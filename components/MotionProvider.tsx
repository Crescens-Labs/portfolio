'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { getLenis, startLenis, stopLenis } from '@/lib/lenis';
import { ScrollTrigger } from '@/lib/gsap';

/**
 * Lands a navigation where it was aimed.
 *
 * Lenis lives in the root layout, so it survives client navigation and
 * keeps animating toward the old page's scroll position: the next case
 * study opened at the bottom, where its link had been. On every route
 * change this resets it.
 *
 *   no hash   jump to the top, immediately, Lenis and window together
 *   hash      wait two frames for the new page's triggers to pin (their
 *             spacers move everything below them), refresh, then jump
 *             to the target. A browser's own early hash jump lands short
 *             of any section below a pin.
 *
 * The first load runs the hash path too, so an outside link to
 * /#work-pawtrait opens on that row.
 */
function land(hash: string) {
  const lenis = getLenis();
  if (!hash) {
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    return () => {};
  }
  let raf = requestAnimationFrame(() => {
    raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;
      // An absolute number, not the element: Next has already moved the
      // window natively, so Lenis's own idea of the scroll is stale and
      // it would measure the target from the wrong origin.
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      const y = Math.max(0, target.getBoundingClientRect().top + window.scrollY - margin);
      lenis?.scrollTo(y, { immediate: true, force: true });
      window.scrollTo(0, y);
    });
  });
  return () => cancelAnimationFrame(raf);
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    startLenis();
    return () => stopLenis();
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (first.current) {
      first.current = false;
      if (!hash) return;
    }
    return land(hash);
  }, [pathname]);

  return children;
}
