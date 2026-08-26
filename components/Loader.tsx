'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import s from './ui.module.css';

/**
 * The intro, in two beats. The format owes its bones to
 * thelaunchcompany.cc, a huge percentage counter and nothing else;
 * theirs is pixel squares on cream, ours is dot matrix on void with
 * grain, and the digits are drawn from dots because the logo is a dot
 * cluster and the counter is the same idea as numerals.
 *
 *   1. RESOLVE. A blank field, grain, and the counter climbing 0 to 100
 *      while the mono status line walks the five process stages. No name,
 *      no mark. Nothing is shown until the count proves out.
 *   2. REVEAL. At 100 the counter, status and bar fall away, the five
 *      dots converge into the C, the wordmark types in, and the curtain
 *      lifts into the hero. The identity is earned, not presented.
 *
 * Rules it obeys, because loaders are the easiest thing to get wrong:
 *
 *   - It never blocks content. The page is fully rendered and readable
 *     underneath; this is an overlay that leaves, not a gate that opens.
 *   - Once per session. A loader on every navigation is an obstacle, not
 *     an identity.
 *   - Reduced motion skips it entirely rather than showing a slower one.
 *   - It cannot get stuck. The schedule below is absolute and set before
 *     anything animates, so even if rAF never fires the overlay still
 *     leaves. The counter and the reveal are cosmetic; the timetable is
 *     not derived from them.
 */

const ANGLES = [-88, -134, 180, 134, 88];

/** Beat 1: counter climbs over this window. */
const COUNT_START = 350;
const COUNT_MS = 2500;
/** Beat 2: the count rests at 100 for a blink, then the identity
    resolves and rests just long enough to be read. */
const REVEAL_AT = COUNT_START + COUNT_MS + 150;
const HOLD = REVEAL_AT + 950;
const GONE = HOLD + 700;

/**
 * Fired on window at the moment the curtain starts to lift. The hero's
 * entrance timeline listens for it, so the page's first content begins
 * moving while the loader is still leaving, one continuous handoff
 * instead of two separate animations with a beat of dead air between.
 */
export const INTRO_LEAVING = 'crescens:intro-leaving';

/* 5x7 dot-matrix glyphs, one string per row, 1 is a lit dot. */
const GLYPHS: Record<string, string[]> = {
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  '3': ['11111', '00010', '00100', '00010', '00001', '10001', '01110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  '6': ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
  '%': ['11001', '11010', '00100', '00100', '01000', '01011', '00011'],
};

/** The five process stages, walked in step with the counter. The loader
    is the first place a visitor meets the method, not just the mark. */
const STAGES = ['STRUCTURE', 'ARCHITECT', 'BUILD', 'TRAIN', 'HANDOVER'];

function stageFor(n: number) {
  return STAGES[Math.min(STAGES.length - 1, Math.floor(n / (100 / STAGES.length)))];
}

/** One glyph drawn as dots on a 5x7 grid. Dots that switch on do so with
    a quick pop, so a changing digit reads as a refresh, not a swap. */
function DotGlyph({ char, x }: { char: string; x: number }) {
  const rows = GLYPHS[char] ?? GLYPHS['0'];
  return (
    <g transform={`translate(${x} 0)`}>
      {rows.flatMap((row, ry) =>
        row.split('').map((cell, rx) =>
          cell === '1' ? (
            <circle key={`${ry}-${rx}`} className={s.matrixDot} cx={rx * 10 + 5} cy={ry * 10 + 5} r={4.1} />
          ) : null,
        ),
      )}
    </g>
  );
}

/** The percentage as a row of dot-matrix glyphs, right-aligned so the
    units column never jumps as the count widens. */
function MatrixNumber({ value }: { value: number }) {
  const text = `${value}%`;
  const advance = 60;
  const width = text.length * advance - 10;
  return (
    <svg
      className={s.matrix}
      viewBox={`0 0 ${width} 70`}
      style={{ width: `calc(${width} * var(--matrix-cell))`, height: 'calc(70 * var(--matrix-cell))' }}
      aria-hidden="true"
      focusable="false"
    >
      {text.split('').map((c, i) => (
        <DotGlyph key={`${i}-${c}`} char={c} x={i * advance} />
      ))}
    </svg>
  );
}

export function Loader() {
  // The curtain is painted by the SERVER, not added on mount. An overlay
  // that appears after hydration shows the hero first and then covers
  // it, which reads as the page flashing before the intro. Rendered
  // from the start, the first frame the visitor ever sees is the count.
  //
  // Three ways this stays safe:
  //   - repeat visits and reduced motion remove it in a layout effect,
  //     before the browser paints the hydrated tree, so they never see it
  //   - no JS at all: a CSS failsafe in ui.module.css dismisses the
  //     curtain on its own, so it can never trap content
  //   - the schedule below stays absolute, as it always was
  const [state, setState] = useState<'running' | 'leaving' | 'gone'>('running');
  const [count, setCount] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const timers = useRef<number[]>([]);
  const curtainRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const seen = sessionStorage.getItem('crescens-intro') === '1';
    if (reduce || seen) {
      // Nothing to show. This runs before paint, so the SSR curtain is
      // swapped for nothing within the same frame it would appear in.
      // Deliberately synchronous for that reason: deferring it to a
      // commit after paint would reintroduce the flash this exists to
      // prevent.
      sessionStorage.setItem('crescens-intro', '1');
      delete (window as { __crescensIntro?: boolean }).__crescensIntro;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState('gone');
      return;
    }

    // JavaScript is running, so the CSS failsafe stands down and the
    // absolute schedule below owns the curtain from here.
    if (curtainRef.current) curtainRef.current.style.animation = 'none';

    sessionStorage.setItem('crescens-intro', '1');
    // A synchronous flag the hero reads in its own effect, which runs
    // after this one: the curtain exists from first paint, but the hero
    // still needs to be told to wait for its handoff moment.
    (window as { __crescensIntro?: boolean }).__crescensIntro = true;
    document.body.style.overflow = 'hidden';

    // The absolute schedule, set before anything animates. Even if the
    // rAF loop below never ticks (hidden tab), the curtain still lifts.
    const pending = timers.current;
    pending.push(
      window.setTimeout(() => setRevealed(true), REVEAL_AT),
      window.setTimeout(() => {
        setState('leaving');
        window.dispatchEvent(new CustomEvent(INTRO_LEAVING));
      }, HOLD),
      window.setTimeout(() => {
        setState('gone');
        document.body.style.overflow = '';
        delete (window as { __crescensIntro?: boolean }).__crescensIntro;
      }, GONE),
    );

    // The counter is pure cosmetics driven by rAF. It is not what decides
    // when the loader leaves; the timers above are.
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - t0 - COUNT_START) / COUNT_MS));
      // Ease in-out so the climb accelerates, cruises, then lands on 100
      // rather than slamming into it.
      const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      const n = Math.round(eased * 100);
      setCount((prev) => (prev === n ? prev : n));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      pending.forEach(clearTimeout);
      cancelAnimationFrame(raf);
      document.body.style.overflow = '';
      delete (window as { __crescensIntro?: boolean }).__crescensIntro;
    };
  }, []);

  if (state === 'gone') return null;

  return (
    <div
      className={s.loader}
      data-leaving={state === 'leaving'}
      data-phase={revealed ? 'reveal' : 'count'}
      data-intro
      aria-hidden="true"
      ref={curtainRef}
    >
      <div className={s.loaderGrain} />

      {/* Beat 2. Hidden until the count completes; the animations only
          exist under data-show, so before that moment there is nothing
          here at all. */}
      <div className={s.loaderId} data-show={revealed}>
        <svg className={s.loaderMark} viewBox="0 0 120 120" focusable="false">
          {ANGLES.map((deg, i) => {
            const a = (deg * Math.PI) / 180;
            return (
              <circle
                key={deg}
                className={s.loaderDot}
                cx={60 + Math.cos(a) * 47}
                cy={60 + Math.sin(a) * 47}
                r={11}
                style={
                  {
                    '--i': i,
                    // Each dot enters from further out along its own
                    // radius, so they converge rather than sliding in as a
                    // block. The C assembles instead of arriving.
                    '--fx': `${Math.cos(a) * 90}px`,
                    '--fy': `${Math.sin(a) * 90}px`,
                  } as React.CSSProperties
                }
              />
            );
          })}
        </svg>
        <p className={s.loaderWord}>
          {'CRESCENS'.split('').map((c, i) => (
            <span key={i} style={{ '--i': i } as React.CSSProperties}>
              {c}
            </span>
          ))}
          <em>LABS</em>
        </p>
      </div>

      {/* Beat 1 furniture: status left, counter right, progress hairline
          under both. All of it falls away when the identity resolves. */}
      <p className={s.loaderStatus}>
        <b>{String(STAGES.indexOf(stageFor(count)) + 1).padStart(2, '0')}</b>
        {' / 05 '}
        <span>{stageFor(count)}</span>
      </p>
      <div className={s.loaderCount}>
        <MatrixNumber value={count} />
      </div>
      <div className={s.loaderBar} style={{ transform: `scaleX(${count / 100})` }} />
    </div>
  );
}
