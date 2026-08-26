/**
 * Smooth scroll, driven by the GSAP ticker rather than its own rAF loop.
 *
 * Two loops means two clocks, and scroll linked tweens drift by a frame
 * against the scroll position. Sharing the ticker removes the whole class
 * of problem.
 */

import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap';

let instance: Lenis | null = null;
let detach: (() => void) | null = null;

export function startLenis(): Lenis | null {
  if (typeof window === 'undefined') return null;
  // Smooth scroll is the single most disorienting effect for anyone with a
  // vestibular disorder. Opted out means native scroll, not a slower Lenis.
  if (prefersReducedMotion()) return null;
  // Mobile browsers already supply the right inertia. Do not allocate a
  // second scroll loop on coarse-pointer devices.
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return null;
  if (instance) return instance;

  const lenis = new Lenis({
    duration: 1.05,
    easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    smoothWheel: true,
    // Touch devices already have native momentum that feels better than
    // anything we can synthesise, and hijacking it costs scroll performance.
    syncTouch: false,
  });

  const tick = (time: number) => lenis.raf(time * 1000);

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  instance = lenis;
  detach = () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    instance = null;
    detach = null;
  };

  return lenis;
}

export function stopLenis(): void {
  detach?.();
}

export function getLenis(): Lenis | null {
  return instance;
}
