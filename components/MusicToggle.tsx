'use client';

import { useEffect, useRef, useState } from 'react';
import { getSound } from '@/lib/sound';
import { prefersReducedMotion } from '@/lib/gsap';
import s from './music-toggle.module.css';

/** The meter's tick count. Volume lands on the nearest tick visually. */
const TICKS = 12;

/**
 * The floating sound control, docked bottom right.
 *
 *   disc     the site's one sound switch for the interface cues. Its mark is the logo's five dots, and while
 *            sound is on each dot listens to one band of the mix.
 *   blade    the tape label: status, what is playing, and the volume as
 *            a VU meter of ticks, the same tick language as the process
 *            bars and the footer barcode
 *
 * The control READS THE PAGE. A rAF-throttled sample on scroll finds the
 * section under the dock's corner and copies its data-ground onto the
 * dock, so over a dark band it is dark glass and over a cream band it
 * is cream glass, in both cases via the same token mapping the sections
 * themselves use. The control never fights the page it floats over.
 *
 * All audio lives in lib/sound.ts; the dock only mirrors and drives it.
 * There is no music, only cues that answer what the visitor does. Volume
 * persists; nothing ever autostarts, because a page that makes noise
 * uninvited is a page people leave.
 */
export function MusicToggle() {
  const trackRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [ground, setGround] = useState<'dark' | 'light' | 'void'>('dark');

  // The engine owns the truth; the dock mirrors it.
  useEffect(() => {
    const engine = getSound();
    if (!engine) return;
    return engine.subscribe((st) => {
      setEnabled(st.enabled);
      setVolumeState(st.volume);
    }) as () => void;
  }, []);
  const setVolume = (v: number | ((prev: number) => number)) => {
    const next = typeof v === 'function' ? v(volume) : v;
    getSound()?.setVolume(next);
  };

  // The dock adopts the ground beneath it. Sampled on scroll and resize
  // through one rAF slot, so a long scroll costs one sample per frame,
  // never one per event.
  useEffect(() => {
    let raf = 0;
    const sample = () => {
      raf = 0;
      const stack = document.elementsFromPoint(
        Math.max(8, window.innerWidth - 34),
        Math.max(8, window.innerHeight - 34),
      );
      for (const el of stack) {
        const host = (el as Element).closest?.('[data-ground]');
        if (host) {
          const g = host.getAttribute('data-ground');
          setGround(g === 'light' ? 'light' : g === 'void' ? 'void' : 'dark');
          return;
        }
      }
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(sample);
    };
    queue();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
    };
  }, []);

  // The mark listens. Five dots, five log-spaced bands of the analyser,
  // each dot's level written as --lv for CSS to scale. Only while sound is
  // on and motion is welcome; otherwise the dots rest as the logo.
  useEffect(() => {
    const engine = getSound();
    const mark = markRef.current;
    if (!enabled || !engine?.analyser || !mark || prefersReducedMotion()) return;
    const an = engine.analyser;
    const bins = new Uint8Array(an.frequencyBinCount);
    const dots = [...mark.querySelectorAll<HTMLElement>('i')];
    // [from bin, to bin, weight]. Weights tilt against the mix's own
    // slope (the pads sit low, the bells high), so all five dots move
    // instead of the first one pinning at full.
    const bands = [
      [1, 3, 0.55],
      [3, 7, 0.75],
      [7, 14, 1.2],
      [14, 28, 2],
      [28, 60, 3],
    ];
    let raf = 0;
    const frame = () => {
      an.getByteFrequencyData(bins);
      bands.forEach(([a, b, w], i) => {
        let sum = 0;
        for (let k = a; k < b; k++) sum += bins[k];
        const lv = Math.min(1, (sum / (b - a) / 255) * w);
        dots[i]?.style.setProperty('--lv', lv.toFixed(3));
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      dots.forEach((d) => d.style.removeProperty('--lv'));
    };
  }, [enabled]);

  const toggle = () => {
    void getSound()?.toggle();
  };

  // The meter: pointer position over the ticks becomes the volume, with
  // the same capture logic a native range would have.
  const seek = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const r = track.getBoundingClientRect();
    setVolume(Math.min(1, Math.max(0, (clientX - r.left) / r.width)));
  };
  const onMeterDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    seek(e.clientX);
  };
  const onMeterMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons === 1) seek(e.clientX);
  };

  const lit = Math.round(volume * TICKS);

  return (
    <div
      className={s.dock}
      data-open={open}
      data-ground={ground}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >

      <div className={s.blade}>
        <div className={s.head}>
          <span className={s.status} data-on={enabled}>
            <i className={s.dot} aria-hidden="true" />
            {enabled ? 'sound on' : 'sound off'}
          </span>
          <span className={s.name}>interface sound</span>
          <span className={s.read} aria-hidden="true">
            {String(Math.round(volume * 100)).padStart(2, '0')}
          </span>
        </div>

        <div
          className={s.meter}
          ref={trackRef}
          onPointerDown={onMeterDown}
          onPointerMove={onMeterMove}
          role="slider"
          aria-label="Volume"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(volume * 100)}
          aria-valuetext={`${Math.round(volume * 100)} percent`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') setVolume((v) => Math.max(0, v - 1 / TICKS));
            if (e.key === 'ArrowRight') setVolume((v) => Math.min(1, v + 1 / TICKS));
          }}
        >
          {Array.from({ length: TICKS }, (_, i) => (
            <i key={i} className={s.tick} data-on={i < lit} aria-hidden="true" />
          ))}
        </div>
      </div>

      <button
        type="button"
        className={s.disc}
        onClick={toggle}
        aria-pressed={enabled}
        aria-label={enabled ? 'Turn sound off' : 'Turn interface sound on'}
        data-sfx="none"
      >
        {/* The mark itself is the icon: the five dots of the C, still
            while paused, slowly turning while sound is on. No play
            or pause glyph is needed; the blade says the state in words
            and the disc says it in motion and colour. */}
        <span className={s.mark} ref={markRef} aria-hidden="true">
          {[-88, -134, 180, 134, 88].map((deg, i) => {
            const a = (deg * Math.PI) / 180;
            return (
              <i
                key={deg}
                className={s.markDot}
                style={
                  {
                    '--i': i,
                    '--dx': `${(Math.cos(a) * 5.2).toFixed(2)}px`,
                    '--dy': `${(Math.sin(a) * 5.2).toFixed(2)}px`,
                  } as React.CSSProperties
                }
              />
            );
          })}
        </span>
      </button>
    </div>
  );
}
