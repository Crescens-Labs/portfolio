'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import s from './ui.module.css';

/**
 * Pointer-following pull on an interactive element.
 *
 * Deliberately small: 9px of travel, not the 30px the effect usually ships
 * with. At 30px the control stops being where the cursor says it is, which
 * turns a polish detail into a targeting problem.
 *
 * Pointer events only, and only on devices that actually have a hover
 * capable pointer. On touch there is no cursor to follow and the listener
 * would just be dead weight in the bundle's hot path.
 */
export function Magnetic({ children, strength = 9 }: { children: ReactNode; strength?: number }) {
  const root = useRef<HTMLSpanElement>(null);

  const move = (e: React.PointerEvent<HTMLSpanElement>) => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const r = el.getBoundingClientRect();
    gsap.to(el, {
      x: ((e.clientX - r.left) / r.width - 0.5) * strength * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * strength * 2,
      duration: 0.4,
      overwrite: 'auto',
    });
  };

  const reset = () => {
    if (!root.current) return;
    gsap.to(root.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  };

  return (
    <span ref={root} className={s.magnetic} onPointerMove={move} onPointerLeave={reset}>
      {children}
    </span>
  );
}
