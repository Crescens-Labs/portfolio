'use client';

import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import s from './ui.module.css';

export type Step = { key: string; title: string; desc: string; out: string };

/**
 * The process section. The rail holds while the steps move past it and the
 * current stage lights up.
 *
 * The rail is `position: sticky`, not a ScrollTrigger pin. The pin was
 * tried first and was wrong twice over: `pinSpacing: false` left a dead
 * scroll region the height of the whole section with nothing in it, and
 * the pinned element stops being in normal flow, so the per-step scrub
 * ranges no longer lined up with where the steps actually were.
 *
 * Sticky costs no spacer, no layout recalculation, and is handled by the
 * compositor. ScrollTrigger keeps the job it is genuinely better at:
 * knowing which step is current, and easing each one in as it arrives.
 *
 * Reduced motion: no scrub, no index tracking, every marker lit. The list
 * reads as a complete list rather than one stuck on step one.
 */
export function PinnedSteps({ steps, label }: { steps: Step[]; label: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [live, setLive] = useState(false);

  useGSAP(
    () => {
      if (!root.current || prefersReducedMotion()) return;
      setLive(true);

      const panels = gsap.utils.toArray<HTMLElement>(`.${s.step}`, root.current);

      // Each step settles as it arrives. Transform and opacity only, and it
      // starts at 0.4 rather than 0 so a mid-animation stop still leaves
      // readable text.
      panels.forEach((panel) => {
        gsap.fromTo(
          panel,
          { yPercent: 4, opacity: 0.4 },
          {
            yPercent: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: { trigger: panel, start: 'top 88%', end: 'top 58%', scrub: 0.7 },
          },
        );
      });

      /**
       * One trigger reads the current step, rather than one per panel.
       *
       * Per-panel `onToggle` was wrong: a fast scroll jumps clean over a
       * whole panel in a single frame, which fires enter and leave together
       * and settles on "not active". Three of five steps were skipped and
       * the rail sat on step one the entire way down.
       *
       * Measuring positions on update cannot miss anything, however far a
       * frame travels. Five rect reads on one scroll handler is nothing.
       */
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: () => {
          const line = window.innerHeight * 0.55;
          let current = 0;
          panels.forEach((panel, i) => {
            if (panel.getBoundingClientRect().top <= line) current = i;
          });
          setActive(current);
        },
      });
    },
    { scope: root, dependencies: [steps.length] },
  );

  return (
    <div ref={root} className={s.pinWrap}>
      <div className={s.pinRail}>
        <p className={s.pinLabel}>{label}</p>
        <ol className={s.pinTicks}>
          {steps.map((step, i) => (
            <li key={step.key} className={s.pinTick} data-on={live ? i <= active : true}>
              <i />
              {step.key}
            </li>
          ))}
        </ol>
      </div>

      <div className={s.pinSteps}>
        {steps.map((step, i) => (
          <article key={step.key} className={s.step}>
            <p className={s.stepNum}>
              {String(i + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
            </p>
            <h3 className={s.stepTitle}>{step.title}</h3>
            <p className={s.stepDesc}>{step.desc}</p>
            <p className={s.stepOut}>
              <span>you get</span>
              {step.out}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
