'use client';

import { useRef } from 'react';
import { Wrap } from '@/components/layout';
import { AsciiFigure } from '@/components/AsciiFigure';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { TOGETHER } from '@/content/home';
import s from './together.module.css';

/**
 * Section 10. What working together looks like.
 *
 * The ASCII figure anchors the head: a right-facing bust on a void
 * plate, white glyphs only, the confusion carved into the skull as a
 * tangle and the question marks waiting ahead of the face. It is
 * the visual for "most clients arrive unsure of the cause", which is the
 * problem the whole studio is positioned around.
 *
 * Below it, a triptych of three honest expectations, each cell with a
 * dot marker and a top hairline that draws in on hover. No icons, no
 * CTAs; the form stays rigid so the three read as a single statement.
 */
export function Together() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!root.current || prefersReducedMotion()) return;
      gsap.from(`.${s.cell}`, {
        y: 26,
        opacity: 0,
        duration: 0.8,
        ease: 'house',
        stagger: 0.09,
        scrollTrigger: { trigger: root.current, start: 'top 78%', once: true },
      });
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section id="together" data-ground="light" className={s.together} ref={root}>
      <Wrap>
        <div className={s.headRow}>
          <div className={s.headText}>
            <p className={s.eyebrow}>{TOGETHER.eyebrow}</p>
            <h2 className={s.title}>
              <span className={s.tMuted}>{TOGETHER.heading.muted}</span>{' '}
              <span className={s.tStrong}>{TOGETHER.heading.strong}</span>
            </h2>
            <p className={s.lead}>{TOGETHER.lead}</p>
          </div>
          <div className={s.figure} aria-hidden="true">
            {/* The void plate. White glyphs need the void behind them,
                and the plate is what lets the figure run large: a
                portrait panel of ASCII beside the copy, captioned like
                the exhibits the rest of the page cites. */}
            <AsciiFigure className={s.figureCanvas} />
            <span className={s.figureCap}>fig. 01 / day one</span>
          </div>
        </div>

        <div className={s.row}>
          {TOGETHER.items.map((item, i) => (
            <article key={item.key} className={s.cell} data-i={i}>
              <span className={s.cellBar} aria-hidden="true" />
              <span className={s.cellTop} aria-hidden="true">
                <i className={s.cellDot} />
                <em>{String(i + 1).padStart(2, '0')}</em>
              </span>
              <h3 className={s.cellTitle}>{item.title}</h3>
              <p className={s.cellBody}>{item.body}</p>
            </article>
          ))}
        </div>
      </Wrap>
    </section>
  );
}