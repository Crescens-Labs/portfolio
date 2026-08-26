'use client';

import { useEffect, useRef, useState } from 'react';
import s from './sections.module.css';

/**
 * The silk loop, layered into the hero field between the gradient and
 * the vignette. It is the room the type stands in, never the subject.
 *
 * THE SEAMLESS LOOP. The encoded video is exactly 8s and its last frame
 * cuts to its first, so a single looping element visibly stutters once
 * per cycle. Two copies of the same file play staggered by half the
 * loop: whenever one approaches its own seam it fades out over the
 * other, which is mid-loop and seamless at that moment. The fade is
 * derived from each element's OWN currentTime (distance to 0 and to the
 * duration), so it needs no timers, survives drift, and heals itself if
 * one element stalls.
 *
 * Loading policy, because a hero video is the easiest way to blow the
 * performance budget on the one screen that must be fast:
 *
 *   - BELOW 640px the video never loads. A phone gets the CSS gradient,
 *     which is already good and costs zero bytes.
 *   - SAVE-DATA gets the gradient for the same reason.
 *   - REDUCED MOTION gets the poster frame as a still, so the field keeps
 *     its texture without moving.
 *   - Everyone else gets the pair, but the fetch starts in idle time
 *     after the hero has painted, never on the critical path, and the
 *     layer fades in only once frames are actually playing.
 *
 * Encodes: AV1 in WebM first, H.265 (hvc1) in MP4 for Safari. Both are
 * under 300KB for the whole loop; the poster is a 3KB AVIF of frame 1.
 */
export function HeroVideo() {
  const a = useRef<HTMLVideoElement>(null);
  const b = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<'pending' | 'off' | 'poster' | 'video'>('pending');

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 640px)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;

    // The choice depends on media queries and connection hints, none of
    // which exist during render, so this cannot be an initialiser without
    // a hydration mismatch. Same shape as the loader: first paint is the
    // gradient alone, the enhancement is added on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(!wide || conn?.saveData ? 'off' : reduce ? 'poster' : 'video');
  }, []);

  useEffect(() => {
    if (mode !== 'video' || !a.current || !b.current) return;
    const va = a.current;
    const vb = b.current;
    let cancelled = false;
    let raf = 0;

    const pick = va.canPlayType('video/webm; codecs="av01.0.05M.08"')
      ? '/hero/hero.webm'
      : '/hero/hero.mp4';

    const DURATION = 8;
    const FADE = 1.1; // seconds of crossfade either side of a seam

    // Opacity from each element's own position in its cycle: 0 at the
    // seam, 1 once FADE seconds away from it.
    const curtain = (v: HTMLVideoElement) => {
      const t = v.currentTime % DURATION;
      const dist = Math.min(t, DURATION - t);
      return Math.min(1, dist / FADE);
    };

    const tick = () => {
      if (cancelled) return;
      va.style.opacity = String(curtain(va));
      vb.style.opacity = String(curtain(vb));
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (cancelled) return;
      for (const [v, offset] of [
        [va, 0],
        [vb, DURATION / 2],
      ] as const) {
        v.src = pick;
        v.currentTime = offset;
        v.addEventListener(
          'canplay',
          () => {
            v.play().catch(() => {});
            // The pair is visible once the FIRST element is rolling;
            // the poster keeps the field warm until then.
            if (v === va) va.parentElement?.setAttribute('data-playing', 'true');
          },
          { once: true },
        );
        v.load();
      }
      raf = requestAnimationFrame(tick);
    };

    // The headline paints first. The loop is an enhancement, so it waits
    // for idle time rather than competing with the first screen.
    const idle = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const id = idle.requestIdleCallback
      ? idle.requestIdleCallback(start, { timeout: 1500 })
      : window.setTimeout(start, 400);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (idle.cancelIdleCallback) idle.cancelIdleCallback(id as number);
      else clearTimeout(id as number);
    };
  }, [mode]);

  if (mode === 'poster') {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={s.heroPoster} src="/hero/hero-poster.avif" alt="" aria-hidden="true" />;
  }

  if (mode !== 'video') return null;

  return (
    <div className={s.heroVideoPair} aria-hidden="true">
      <video ref={a} className={s.heroVideo} muted playsInline loop preload="none" tabIndex={-1} />
      <video
        ref={b}
        className={s.heroVideo}
        muted
        playsInline
        loop
        preload="none"
        poster="/hero/hero-poster.avif"
        tabIndex={-1}
      />
    </div>
  );
}
