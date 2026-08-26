'use client';

import { useEffect, useRef, useState } from 'react';
import s from './music-toggle.module.css';

/** The meter's tick count. Volume lands on the nearest tick visually. */
const TICKS = 12;

/**
 * The floating music control, docked bottom right.
 *
 *   disc     play and pause, one glyph morphing into the other
 *   blade    the tape label: status, track name, and the volume as a
 *            VU meter of ticks, the same tick language as the process
 *            bars and the footer barcode
 *
 * The control READS THE PAGE. A rAF-throttled sample on scroll finds the
 * section under the dock's corner and copies its data-ground onto the
 * dock, so over a dark band it is dark glass and over a cream band it
 * is cream glass, in both cases via the same token mapping the sections
 * themselves use. The control never fights the page it floats over.
 *
 * The track drops in at `public/audio/theme.mp3`. Until it exists the
 * control renders dimmed and inert with an honest label, so the slot
 * never looks broken. Volume persists in localStorage; play never
 * autostarts, because a page that makes noise uninvited is a page
 * people leave.
 */
export function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [ground, setGround] = useState<'dark' | 'light' | 'void'>('dark');

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

  // Restore the last volume, and probe for the track without loading it.
  useEffect(() => {
    let restored = 0.7;
    try {
      const v = parseFloat(localStorage.getItem('crescens-vol') ?? '');
      if (Number.isFinite(v)) restored = Math.min(1, Math.max(0, v));
    } catch {
      /* private mode: the default stands */
    }
    const probe = new Audio();
    probe.preload = 'metadata';
    probe.src = '/audio/theme.mp3';
    const ok = () => setAvailable(true);
    const no = () => setAvailable(false);
    probe.addEventListener('loadedmetadata', ok, { once: true });
    probe.addEventListener('error', no, { once: true });
    // Volume restore rides the event that will fire anyway, so the
    // effect itself performs no synchronous state writes.
    probe.addEventListener('loadedmetadata', () => setVolume(restored), { once: true });
    return () => {
      probe.removeEventListener('loadedmetadata', ok);
      probe.removeEventListener('error', no);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
    try {
      localStorage.setItem('crescens-vol', String(volume));
    } catch {
      /* private mode */
    }
  }, [volume]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a || !available) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      try {
        await a.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
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
      data-off={available === false}
      data-ground={ground}
      onPointerEnter={() => available && setOpen(true)}
      onPointerLeave={() => setOpen(false)}
    >
      <audio ref={audioRef} src="/audio/theme.mp3" loop preload="none" />

      <div className={s.blade}>
        <div className={s.head}>
          <span className={s.status} data-on={playing}>
            <i className={s.dot} aria-hidden="true" />
            {available === false ? 'no track yet' : playing ? 'playing' : 'paused'}
          </span>
          <span className={s.name}>studio theme</span>
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
        aria-pressed={playing}
        aria-label={playing ? 'Pause the music' : 'Play the music'}
        disabled={available === false}
      >
        {/* The mark itself is the icon: the five dots of the C, still
            while paused, slowly turning while the theme plays. No play
            or pause glyph is needed; the blade says the state in words
            and the disc says it in motion and colour. */}
        <span className={s.mark} aria-hidden="true">
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
