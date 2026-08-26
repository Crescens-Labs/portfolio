import { describe, expect, it } from 'vitest';
import { contrast } from '@/lib/contrast';
import { foregroundsFor, groundsFor, readTokens, type Ground } from '@/lib/tokens';

/**
 * The contrast floor, enforced.
 *
 * Three passes at this palette taught the lesson these tests encode:
 * every individual pair can clear 4.5:1 and the page can still read as an
 * unreadable smear. So the suite checks two different things.
 *
 *   1. The FLOOR. Every foreground against its WORST ground, not against
 *      the page field. Checking only `bg` hid real failures on cards.
 *
 *   2. The GAP. `ink` has to sit far enough above `body` that hierarchy is
 *      instant. A compliant palette can still feel flat when these values
 *      sit too close together.
 */

const t = readTokens();
const AA = 4.5;
const MIN_GAP = 2.4;

describe.each<Ground>(['dark', 'light'])('%s ground', (ground) => {
  const grounds = groundsFor(t, ground);
  const fgs = foregroundsFor(t, ground);

  it('defines every token', () => {
    for (const [name, value] of [...Object.entries(grounds), ...Object.entries(fgs)]) {
      expect(value, `${ground}/${name} is missing from tokens.css`).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  describe.each(Object.entries(fgs))('%s', (fgName, fg) => {
    it.each(Object.entries(grounds))(`clears ${AA}:1 on %s`, (bgName, bg) => {
      const ratio = contrast(fg, bg);
      expect(
        ratio,
        `${ground}: ${fgName} ${fg} on ${bgName} ${bg} is ${ratio.toFixed(2)}:1`,
      ).toBeGreaterThanOrEqual(AA);
    });
  });

  it(`keeps ink at least ${MIN_GAP}x above body`, () => {
    const field = grounds.bg;
    const gap = contrast(fgs.ink, field) / contrast(fgs.body, field);
    expect(gap, `hierarchy gap is ${gap.toFixed(2)}x, headings will blur into body`).toBeGreaterThan(
      MIN_GAP,
    );
  });

  it('keeps label above body, because small mono needs more contrast', () => {
    const field = grounds.bg;
    expect(contrast(fgs.label, field)).toBeGreaterThan(contrast(fgs.body, field));
  });

  it('uses exactly one accent', () => {
    const accents = Object.entries(t).filter(([k]) => k.endsWith('-accent'));
    expect(accents).toHaveLength(2); // one per ground
  });
});

/**
 * The bloom replaced two background PNGs whose bright areas measured
 * 1.03:1 against white ink. These assertions are the reason that cannot
 * happen again: each level is capped at what it is allowed to carry.
 */
describe('bloom alpha budget', () => {
  const BLOOM = '#c6d5cb'; // sampled from assets/hero-background.png
  const field = t['--d-bg'];
  const fgs = foregroundsFor(t, 'dark');

  const mix = (alpha: number) => {
    const hex = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
    const [br, bg, bb] = hex(BLOOM);
    const [fr, fg2, fb] = hex(field);
    const c = [fr, fg2, fb].map((v, i) =>
      Math.round(v * (1 - alpha) + [br, bg, bb][i] * alpha),
    );
    return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
  };

  it('safe carries all three text tones', () => {
    const peak = mix(Number(t['--bloom-safe']));
    for (const [name, fg] of Object.entries(fgs)) {
      expect(contrast(fg, peak), `${name} on bloom-safe`).toBeGreaterThanOrEqual(AA);
    }
  });

  it('head carries ink and accent but not body', () => {
    const peak = mix(Number(t['--bloom-head']));
    expect(contrast(fgs.ink, peak)).toBeGreaterThanOrEqual(AA);
    expect(contrast(fgs.accent, peak)).toBeGreaterThanOrEqual(AA);
    // Documented, not accidental: this is why `head` is a separate level.
    expect(contrast(fgs.body, peak)).toBeLessThan(AA);
  });

  it('hot is ordered above head and below opaque', () => {
    expect(Number(t['--bloom-hot'])).toBeGreaterThan(Number(t['--bloom-head']));
    expect(Number(t['--bloom-hot'])).toBeLessThan(1);
  });
});
