'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/gsap';
import s from './ui.module.css';

const GLYPHS = '01<>/\\[]{}=+*#%$@ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * The real string remains in the DOM while the visible layer resolves from
 * noise. It stays selectable, accessible, and sharp without a graphics
 * context.
 *
 * Accessibility: the scrambled frames are marked aria-hidden and the true
 * text is exposed to assistive tech from first paint, so nobody hears a
 * stream of nonsense glyphs.
 */
export function DecryptText({
  text,
  className,
  /** Seconds. The whole string resolves left to right over this. Slow
      enough that the scramble reads as a process, not a flicker. */
  duration = 1.7,
}: {
  text: string;
  className?: string;
  duration?: number;
}) {
  const root = useRef<HTMLSpanElement>(null);
  const [frame, setFrame] = useState(text);
  const [state, setState] = useState<'idle' | 'decrypting' | 'resolved'>('resolved');

  useEffect(() => {
    const node = root.current;
    if (!node || prefersReducedMotion()) {
      setFrame(text);
      setState('resolved');
      return;
    }

    let animationFrame = 0;
    let started = false;

    const render = (progress: number) => {
      const settled = Math.floor(progress * text.length);
      setFrame(
        text
          .split('')
          .map((ch, i) => {
            if (i < settled || ch === ' ') return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(''),
      );
    };

    const start = () => {
      if (started) return;
      started = true;
      setState('decrypting');
      render(0);

      const beganAt = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - beganAt) / (duration * 1_000));
        render(progress);
        if (progress < 1) {
          animationFrame = requestAnimationFrame(tick);
          return;
        }
        setFrame(text);
        setState('resolved');
      };
      animationFrame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        start();
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [text, duration]);

  return (
    <span
      ref={root}
      className={[s.decrypt, className].filter(Boolean).join(' ')}
      data-decrypt-state={state}
    >
      <span className={s.srOnly}>{text}</span>
      <span aria-hidden="true">{frame}</span>
    </span>
  );
}
