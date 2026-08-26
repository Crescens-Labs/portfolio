'use client';

import { useRef } from 'react';
import { Wrap } from '@/components/layout';
import { RevealText } from '@/components/RevealText';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { TEAM } from '@/content/home';
import s from './team.module.css';

/**
 * Team. Two founders, shown as two large editorial cards.
 *
 * Without real founder photos, a stock portrait would be dishonest. The
 * cards use rendered direction instead and receive colour as they enter.
 */
export function Team() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!root.current || prefersReducedMotion()) return;
      // M7, adapted: the cards arrive desaturated and resolve to full
      // colour as they enter, staggered left to right. On this design
      // the accent role line and the portrait gradients are what
      // colourise, so the beat still reads even without photography.
      gsap.from(`.${s.card}`, {
        filter: 'grayscale(1)',
        y: 24,
        opacity: 0,
        duration: 1.05,
        ease: 'house',
        stagger: 0.14,
        clearProps: 'filter,transform,opacity',
        scrollTrigger: { trigger: root.current, start: 'top 74%', once: true },
      });
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section id="team" data-ground="light" className={s.team} ref={root}>
      <Wrap>
        <p className={s.eyebrow}>{TEAM.eyebrow}</p>
        <header className={s.head}>
          <h2 className={s.title}>
            <span className={s.tMuted}>{TEAM.heading.muted}</span>{' '}
            <span className={s.tStrong}>{TEAM.heading.strong}</span>
          </h2>
          <p className={s.lead}>{TEAM.lead}</p>
        </header>

        <div className={s.row}>
          {TEAM.members.map((m, i) => (
            <article key={m.name} className={s.card} data-i={i}>
              <div className={s.portrait} data-i={i}>
                {/* The dot cluster behind the monogram, drawn the same
                    way the hero mark and the covers draw it. Same
                    motif, recognisable across the page. */}
                <svg className={s.mark} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  {[-88, -134, 180, 134, 88].map((deg) => {
                    const a = (deg * Math.PI) / 180;
                    return (
                      <circle
                        key={deg}
                        cx={12 + Math.cos(a) * 9.4}
                        cy={12 + Math.sin(a) * 9.4}
                        r={2.6}
                        fill="currentColor"
                      />
                    );
                  })}
                </svg>
                <span className={s.monogram} aria-hidden="true">
                  {m.initial}
                </span>
              </div>
              <div className={s.meta}>
                <h3 className={s.name}>{m.name}</h3>
                <p className={s.role}>{m.role}</p>
                <p className={s.bio}>{m.bio}</p>
              </div>
            </article>
          ))}
        </div>

        <div className={s.close}>
          <span className={s.closeGlyph} aria-hidden="true">
            &ldquo;
          </span>
          <div className={s.closing}>
            <RevealText as="p" distance={0.8} text={TEAM.closing} />
          </div>
          <a className={s.cta} href={TEAM.cta.href}>
            <span className={s.ctaKick}>{TEAM.cta.kicker}</span>
            <span className={s.ctaLabel}>
              {TEAM.cta.label}
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
            </span>
          </a>
        </div>
      </Wrap>
    </section>
  );
}