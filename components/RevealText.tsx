'use client';

import { useMemo, useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import s from './ui.module.css';

/**
 * The quote spine. Words start dim and light up as the block scrubs
 * through the viewport, with marked words landing on the accent.
 *
 * Mark a word by wrapping it in pipes: "help you find the |problem| worth".
 *
 * The split happens in React rather than with SplitText, for two reasons:
 * the markup renders identically on the server so there is no flash of
 * unsplit text, and the accent flag survives, which it does not once
 * SplitText rewrites the DOM around a nested element.
 *
 * Reduced motion contract, the important part:
 * every word is painted at its FINAL colour in CSS. The animation dims
 * them back down only after we know motion is wanted. An effect that
 * starts invisible and animates up leaves the page blank for the people
 * who opted out, which is the exact failure this component guards.
 */
export function RevealText({
  text,
  as = 'p',
  /**
   * How much scroll the reveal is spread over, in viewport heights.
   * Higher reads slower. Kept near one screen on purpose: spread longer,
   * the last words are still dark when the block has already left, which
   * reads as the page lagging rather than the type resolving.
   */
  distance = 1,
  /**
   * Pin the block while the words light up. This is the effect GSAP is
   * actually known for: the section holds still, the type resolves, then
   * the page moves on. Costs a pin spacer, so use it on the one or two
   * lines that carry the argument, never on every paragraph.
   */
  pin = false,
}: {
  text: string;
  as?: 'p' | 'h2' | 'blockquote';
  distance?: number;
  pin?: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  const Tag = as;

  const words = useMemo(
    () =>
      text
        .split('|')
        .flatMap((chunk, chunkIndex) =>
          chunk
            .split(/\s+/)
            .filter(Boolean)
            .map((word) => ({ word, accent: chunkIndex % 2 === 1 })),
        ),
    [text],
  );

  useGSAP(
    () => {
      if (!root.current || prefersReducedMotion()) return;

      const els = gsap.utils.toArray<HTMLElement>(`.${s.word}`, root.current);
      gsap.set(els, { color: 'rgb(var(--line-rgb) / var(--word-dim))' });

      gsap.to(els, {
        color: (_i, el: HTMLElement) =>
          el.dataset.accent === 'true' ? 'var(--accent)' : 'var(--ink)',
        // In a scrubbed tween duration and stagger are ratios, not
        // seconds. 1.6 against a step of 1 keeps overlap between words
        // without smearing the whole paragraph across the scroll range.
        stagger: { each: 1, from: 'start' },
        duration: 1.6,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: pin ? 'center center' : 'top 85%',
          end: `+=${Math.round(distance * 100)}%`,
          // 0.45s of catch-up. At 1.1 the words trailed a full second
          // behind the thumb, which is exactly the "already past the
          // section and it is still revealing" failure.
          scrub: 0.45,
          pin,
          pinSpacing: pin,
          anticipatePin: pin ? 1 : 0,
        },
      });
    },
    { scope: root, dependencies: [distance, pin] },
  );

  return (
    <Tag ref={root as never} className={s.spine}>
      {words.map(({ word, accent }, i) => {
        // Punctuation that closed a marked span used to arrive as its own
        // word and rendered as "solving ,". A word only gets a trailing
        // space when the next one does not open with punctuation.
        const next = words[i + 1]?.word;
        const space = next && !/^[,.;:!?)\]}]/.test(next) ? ' ' : '';
        return (
          <span
            key={`${word}-${i}`}
            className={accent ? `${s.word} ${s.wordHi}` : s.word}
            data-accent={accent}
          >
            {word}
            {space}
          </span>
        );
      })}
    </Tag>
  );
}
