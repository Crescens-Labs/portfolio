import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * The highest value test in this suite.
 *
 * A reveal animation that starts at `opacity: 0` and animates up looks
 * perfect in review and ships a blank page to anyone who set "reduce
 * motion", because the tween that was going to reveal the text never
 * runs. The bug is invisible unless you specifically go looking, and the
 * people it breaks the page for are the ones least able to work around it.
 *
 * So: every animated component must paint its END state and animate away
 * from it, never toward it. These checks enforce the shape of that rule.
 */

const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');

/** Every file under `dirs` whose name ends in `ext`, walked recursively. */
function filesIn(dirs: string[], ext: string): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(ext)) out.push(full);
    }
  };
  for (const d of dirs) walk(join(process.cwd(), d));
  return out;
}

describe('reduced motion', () => {
  it('no stylesheet parks an element at opacity 0', () => {
    const files = filesIn(['app', 'components'], '.css');
    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      // `opacity: 0` inside a @keyframes block is fine and unavoidable for
      // a fade in. What is not fine is a normal rule setting it, because
      // then the resting style of the element is invisible and any failure
      // to animate is permanent. The next test enforces the other half of
      // that contract: the keyframe has to be paired with a fill mode.
      const css = readFileSync(file, 'utf8')
        .replace(/@keyframes[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '')
        // An explicit, commented exemption rather than a blanket one. A
        // decorative glyph in a hover cross fade is legitimately hidden at
        // rest, but every case has to be argued in the stylesheet where the
        // next person will read it, not waved through by the test.
        .replace(/\/\*\s*hidden-by-design:[\s\S]*?\*\/\s*opacity:\s*0(?!\.)\s*;/g, '');

      const offenders = [...css.matchAll(/opacity:\s*0(?!\.)\s*[;}]/g)];
      expect(
        offenders.map((m) => m[0]),
        `${file} parks an element at opacity 0 with no hidden-by-design note`,
      ).toHaveLength(0);
    }
  });

  it('every fade-in animation declares a backwards fill', () => {
    // Narrowly scoped on purpose: only animations whose keyframes actually
    // start at opacity 0. Checking every `animation:` shorthand flagged the
    // marquee, which is an infinite loop with no hidden state and no delay,
    // and a test that cries wolf gets muted.
    //
    // For the ones that do start hidden, `backwards` is what keeps the
    // element visible during the delay and if the animation never runs at
    // all. Without it a staggered entrance flashes visible, then hides.
    const files = filesIn(['app', 'components'], '.css');

    for (const file of files) {
      const css = readFileSync(file, 'utf8');
      const fadeIn = new Set<string>();

      for (const m of css.matchAll(
        /@keyframes\s+([\w-]+)\s*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g,
      )) {
        if (/(?:from|0%)\s*\{[^}]*opacity:\s*0(?!\.)/.test(m[0])) fadeIn.add(m[1]);
      }

      for (const m of css.matchAll(/animation:\s*([^;]+);/g)) {
        const name = [...fadeIn].find((n) => m[1].includes(n));
        if (!name) continue;
        expect(
          /\b(backwards|both)\b/.test(m[1]),
          `${file}: "${name}" starts at opacity 0 but its rule has no backwards fill`,
        ).toBe(true);
      }
    }
  });

  it('every client component that animates checks the setting', () => {
    const files = filesIn(['components'], '.tsx');
    const animated = files.filter((f) => {
      const src = readFileSync(f, 'utf8');
      return src.includes('useGSAP') || src.includes('gsap.to') || src.includes('gsap.fromTo');
    });

    expect(animated.length, 'no animated components found, the glob is wrong').toBeGreaterThan(0);

    for (const file of animated) {
      const src = readFileSync(file, 'utf8');
      expect(src, `${file} animates without consulting prefersReducedMotion`).toContain(
        'prefersReducedMotion',
      );
    }
  });

  it('the global stylesheet carries a reduce block', () => {
    expect(read('app/globals.css')).toContain('prefers-reduced-motion: reduce');
  });

  it('smooth scroll is disabled rather than slowed', () => {
    const src = read('lib/lenis.ts');
    const guard = src.indexOf('prefersReducedMotion()');
    const construct = src.indexOf('new Lenis');
    expect(guard).toBeGreaterThan(-1);
    expect(guard, 'Lenis is constructed before the reduced-motion check').toBeLessThan(construct);
  });

  it('the process bar resolves to its filled state, not an empty one', () => {
    const src = read('components/ProcessBar.tsx');
    const guard = src.slice(src.indexOf('prefersReducedMotion()'));
    expect(guard.slice(0, 160)).toContain('scaleX: clamped');
  });
});

/**
 * The motion spec bans layout-triggering properties outright. A width
 * animation runs layout on every frame and is the single easiest way to
 * lose the 95+ mobile Lighthouse target with animations on.
 */
describe('motion technique', () => {
  it('animates transform and opacity only', () => {
    const files = filesIn(['components'], '.tsx');
    for (const file of files) {
      const src = readFileSync(file, 'utf8');
      for (const prop of ['width:', 'height:', 'marginLeft:', 'paddingLeft:', 'top:', 'left:']) {
        const inTween = new RegExp(`gsap\\.(to|from|fromTo|set)\\([^)]*${prop}`, 's');
        expect(inTween.test(src), `${file} animates ${prop} instead of a transform`).toBe(false);
      }
    }
  });
});
