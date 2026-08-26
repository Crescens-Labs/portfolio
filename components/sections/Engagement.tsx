'use client';

import { useRef } from 'react';
import { Wrap } from '@/components/layout';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { ENGAGEMENT } from '@/content/home';
import s from './engagement.module.css';

/**
 * Section 15. Engagement models.
 *
 * No public price appears here. Scope varies too widely for a fixed figure,
 * so the conversation stays on a call while each shape remains clear.
 *
 * Each model is a card: name, description, three points, plus the
 * footnote that every engagement ends in handover, which is the one line
 * that distinguishes us from a retainer studio. The three cards deal
 * themselves in, left to right, on the way into view.
 */
export function Engagement() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!root.current || prefersReducedMotion()) return;
      gsap.from(`.${s.card}`, {
        y: 26,
        opacity: 0,
        duration: 0.85,
        ease: 'house',
        stagger: 0.09,
        scrollTrigger: { trigger: root.current, start: 'top 76%', once: true },
      });
      gsap.from(`.${s.foot}`, {
        y: 16,
        opacity: 0,
        duration: 0.7,
        ease: 'house',
        delay: 0.25,
        scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
      });
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section id="engagement" data-ground="light" className={s.engagement} ref={root}>
      <Wrap>
        <p className={s.eyebrow}>{ENGAGEMENT.eyebrow}</p>
        <header className={s.head}>
          <h2 className={s.title}>
            <span className={s.tAccent}>{ENGAGEMENT.heading.accent}</span>{' '}
            <span className={s.tStrong}>{ENGAGEMENT.heading.rest}</span>
          </h2>
          <p className={s.lead}>{ENGAGEMENT.lead}</p>
        </header>

        <div className={s.models}>
          {ENGAGEMENT.models.map((m, i) => (
            <article key={m.key} className={s.card} data-i={i}>
              <header className={s.cardHead}>
                <span className={s.cardIndex} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={s.cardKicker}>shape</span>
              </header>
              <h3 className={s.cardName}>{m.name}</h3>
              <p className={s.cardDesc}>{m.description}</p>
              <ul className={s.cardPoints}>
                {m.points.map((pt) => (
                  <li key={pt}>
                    <span aria-hidden="true">&gt;</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className={s.foot}>
          <p className={s.footText}>{ENGAGEMENT.footnote}</p>
          <a className={s.cta} href={ENGAGEMENT.cta.href}>
            {ENGAGEMENT.cta.label}
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path
                d="M2 8h11M9 4l4 4-4 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </Wrap>
    </section>
  );
}