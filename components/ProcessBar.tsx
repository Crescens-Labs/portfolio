'use client';

import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import s from './ui.module.css';

/**
 * A progress bar that fills when its row enters view.
 *
 * `scaleX` with `transform-origin: left`, never `width`. Animating width
 * runs layout on every frame, which is the jank the motion spec exists to
 * prevent, and the teardown already specifies the transform.
 */
export function ProcessBar({ value, label }: { value: number; label?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const clamped = Math.min(1, Math.max(0, value));

  useGSAP(
    () => {
      const fill = root.current?.querySelector(`.${s.barFill}`);
      if (!fill) return;

      // Opted out means the bar is already full, not that it stays empty.
      if (prefersReducedMotion()) {
        gsap.set(fill, { scaleX: clamped });
        return;
      }

      gsap.fromTo(
        fill,
        { scaleX: 0 },
        {
          scaleX: clamped,
          duration: 1.1,
          scrollTrigger: { trigger: root.current, start: 'top 86%', once: true },
        },
      );
    },
    { scope: root, dependencies: [clamped] },
  );

  return (
    <div ref={root}>
      <div
        className={s.bar}
        role="progressbar"
        aria-valuenow={Math.round(clamped * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <i className={s.barFill} style={{ '--s': clamped } as React.CSSProperties} />
      </div>
    </div>
  );
}
