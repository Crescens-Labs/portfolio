'use client';

import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { PROCESS } from '@/content/home';
import { Wrap } from '@/components/layout';
import shared from './build.module.css';
import s from './process.module.css';

/**
 * Section 9, the process. The signature section, where the end to end
 * positioning becomes visible rather than claimed.
 *
 * Five rows, each bar wider than the last, so the section reads as a
 * filling progress meter that resolves at handover. The bar is `scaleX`
 * on the compositor, `transform-origin: left`, house easing, scrubbed per
 * row. The tick pattern in the remainder is a repeating linear gradient,
 * not hundreds of DOM nodes.
 *
 * Animation contract, the most important part:
 *   CSS paints every fill at its final width via `scaleX(var(--w))`,
 *   so failed hydration, opted out visitors, and reduced motion all
 *   render the finished section. GSAP only dims each fill back down to
 *   `scaleX: 0` once it has confirmed motion is wanted, then scrubs it
 *   up to the target as the row passes through the viewport. A tween
 *   that starts hidden and animates up leaves the page blank for the
 *   people who opted out, which is the exact failure this guards.
 */
const WIDTHS = [0.44, 0.58, 0.72, 0.86, 1];

export function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!root.current || prefersReducedMotion()) return;

      const rows = root.current.querySelectorAll<HTMLElement>(`.${s.row}`);
      rows.forEach((row, i) => {
        const fill = row.querySelector<HTMLElement>(`.${s.barFill}`);
        if (!fill) return;

        // One trigger per row, so each bar scrubs against its own slice of
        // the scroll. A single trigger for the whole section left the lower
        // rows sitting at `scaleX: 0` until the section was nearly gone,
        // which read as the page lagging.
        gsap.fromTo(
          fill,
          { scaleX: 0 },
          {
            scaleX: WIDTHS[i],
            ease: 'house',
            scrollTrigger: {
              trigger: row,
              start: 'top 88%',
              end: 'bottom 55%',
              scrub: 0.55,
            },
          },
        );
      });
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section id="process" data-ground="dark" className={`specks-host ${s.process}`} ref={root}>
      <i className="grid-field" aria-hidden="true" />
      <Wrap>
        <p className={shared.eyebrow}>+ process</p>

        <div className={shared.head}>
          <h2 className={shared.title}>
            <span className={shared.tMuted}>Structure</span>{' '}
            <span className={shared.tStrong}>meets shipping.</span>
          </h2>
          <p className={shared.lead}>
            Five stages. You own the system at the end of stage five.
          </p>
        </div>

        <div className={s.rows}>
          {PROCESS.map((p, i) => (
            <div
              key={p.key}
              className={s.row}
              data-testid={`process-row-${p.key}`}
            >
              {/* The bar. Ticks in the remainder, accent in the filled part.
                  The fill is the visual representation of progress, so it is
                  the one place in the section the accent is allowed to be. */}
              <div className={s.bar}>
                <i
                  className={s.barFill}
                  style={{ '--w': WIDTHS[i] } as React.CSSProperties}
                  aria-hidden="true"
                />
              </div>

              <div className={s.rowHead}>
                <span className={s.index} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={s.title}>{p.title}</h3>
              </div>

              <p className={s.desc}>{p.desc}</p>

              <p className={s.out}>
                <span>outcome</span>
                <em>{p.out}</em>
              </p>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  );
}