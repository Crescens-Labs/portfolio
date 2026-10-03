'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import s from './barcode.module.css';

/**
 * The footer barcode. The process tick motif run out as a full width
 * strip, and it reads the pointer: move the cursor left or right and
 * the code travels with it, a fine tick layer drifting at half speed
 * behind, and an accent segment tracks the cursor itself like a read
 * head. The page's last image answers the hand.
 *
 * The bar pattern is generated from a seeded PRNG rather than laid out
 * as DOM nodes, so it is one paint layer, and the seed means the server
 * and the client agree on every stop: no hydration mismatch, and no-JS
 * visitors get the same strip at rest.
 *
 * Motion contract: the strip paints complete and still. The tracking is
 * built only for fine pointers that have not asked for less motion, so
 * touch and reduced-motion visitors see the finished barcode and
 * nothing waits on a pointer that never comes.
 */

/** mulberry32, small and deterministic. */
function prng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** One tile of irregular bars, as gradient stops over a 1600px tile. */
function barcodeStops(): string {
  const rand = prng(0x5eed_1337);
  const tile = 1600;
  const stops: string[] = [];
  let x = 0;
  while (x < tile) {
    const bar = 2 + Math.round(rand() * 5);
    const gap = 2 + Math.round(rand() * 4);
    const at = (v: number) => `${((v / tile) * 100).toFixed(3)}%`;
    stops.push(`var(--bar) ${at(x)} ${at(x + bar)}`, `transparent ${at(x + bar)} ${at(x + bar + gap)}`);
    x += bar + gap;
  }
  return `linear-gradient(90deg, ${stops.join(', ')})`;
}

export function BarcodeStrip() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const code = el.querySelector<HTMLElement>('[data-layer="code"]');
    const ticks = el.querySelector<HTMLElement>('[data-layer="ticks"]');
    const head = el.querySelector<HTMLElement>(`.${s.head}`);
    if (!code || !ticks || !head) return;

    const moveCode = gsap.quickTo(code, 'x', { duration: 0.7, ease: 'house' });
    const moveTicks = gsap.quickTo(ticks, 'x', { duration: 1.05, ease: 'house' });
    const moveHead = gsap.quickTo(head, 'x', { duration: 0.45, ease: 'house' });

    // Measured once and on resize, never inside the handler: reading
    // offsetWidth there, right after the tweens wrote transforms, forced
    // a layout on every pointer move.
    let headW = head.offsetWidth;
    let viewW = window.innerWidth;
    const onResize = () => {
      headW = head.offsetWidth;
      viewW = window.innerWidth;
    };

    const onMove = (e: PointerEvent) => {
      // -1 at the left edge, 1 at the right. The code travels the
      // opposite way to the pointer so the strip reads as being read,
      // not dragged, and the head lands exactly under the cursor.
      const n = (e.clientX / viewW) * 2 - 1;
      moveCode(n * -76);
      moveTicks(n * 38);
      moveHead(e.clientX - headW / 2);
    };

    // Listening only while the strip is on screen. It used to follow
    // the pointer across the whole page, three tweens per move, for a
    // strip that sits at the very bottom.
    let listening = false;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting === listening) return;
      listening = entry.isIntersecting;
      if (listening) window.addEventListener('pointermove', onMove, { passive: true });
      else window.removeEventListener('pointermove', onMove);
    });
    io.observe(el);
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const backgroundImage = barcodeStops();

  return (
    <div className={s.strip} ref={root} aria-hidden="true">
      {/* The fine ticks behind the code, one period off the code's own
          so the two layers never lock into a visible beat. */}
      <div className={s.ticks} data-layer="ticks" />
      <div className={s.code} data-layer="code" style={{ backgroundImage }} />
      <div className={s.head} />
    </div>
  );
}
