'use client';

import { useRef, useState } from 'react';
import { Wrap } from '@/components/layout';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { VOICES, type VoiceCard } from '@/content/home';
import s from './voices.module.css';

/**
 * Voices. Vertical scroll drives a horizontal rail of client cards, with a
 * tracker that stays synchronised to the travel.
 *
 * Card anatomy follows the social proof reference: a pale sheet, the
 * speaker top left (round monogram, name, role), open space, and the words
 * set large at the foot. The cards sit at staggered heights so the rail
 * reads as a loose hand of cards rather than a table row.
 *
 * Motion contract: without JS, or under reduced motion, the rail is an
 * ordinary horizontally scrollable strip with snap points and every card
 * is at full strength. The pin is built only when motion is wanted and the
 * viewport can hold it.
 */

/** Resting heights, px. A loose hand, not a sine wave: no two neighbours
    share a direction for long, so the eye does not read a pattern. */
const LIFT = [0, 26, -6, 34, 8, 20];

export function Voices() {
  const root = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      if (!root.current) return;
      const rail = root.current.querySelector<HTMLElement>(`.${s.rail}`);
      const stage = root.current.querySelector<HTMLElement>(`.${s.stage}`);
      if (!rail || !stage) return;

      const n = VOICES.cards.length;
      const setProgress = (p: number) => {
        const c = Math.min(1, Math.max(0, p));
        if (fillRef.current) fillRef.current.style.transform = `scaleX(${c})`;
        setActive(Math.min(n - 1, Math.floor(c * n)));
      };
      const nativeProgress = () => {
        const max = stage.scrollWidth - stage.clientWidth;
        setProgress(max > 0 ? stage.scrollLeft / max : 1);
      };

      if (prefersReducedMotion()) {
        stage.addEventListener('scroll', nativeProgress, { passive: true });
        return () => stage.removeEventListener('scroll', nativeProgress);
      }

      const mm = gsap.matchMedia();
      mm.add('(min-width: 1000px) and (min-height: 620px)', () => {
        const prevOverflow = stage.style.overflowX;
        stage.style.overflowX = 'hidden';
        // Travel ends with the last card on the right gutter: the rail's
        // own width minus the window the stage leaves between its paddings.
        const distance = () => {
          const cs = getComputedStyle(stage);
          const inner = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
          return Math.max(0, rail.offsetWidth - inner);
        };
        gsap.to(rail, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${Math.round(distance() * 1.75 + window.innerHeight * 0.5)}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setProgress(self.progress),
          },
        });
        return () => {
          stage.style.overflowX = prevOverflow;
        };
      });
      mm.add('(max-width: 999px), (max-height: 619px)', () => {
        stage.addEventListener('scroll', nativeProgress, { passive: true });
        return () => stage.removeEventListener('scroll', nativeProgress);
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [] },
  );

  const total = VOICES.cards.length;

  return (
    <section id="voices" data-ground="dark" className={`specks-host ${s.voices}`} ref={root}>
      <i className="specks specks-live" aria-hidden="true" />
      <Wrap>
        <p className={s.eyebrow}>{VOICES.eyebrow}</p>
        <header className={s.head}>
          <h2 className={s.title}>
            <span className={s.tMuted}>{VOICES.heading.muted}</span>{' '}
            <span className={s.tStrong}>{VOICES.heading.strong}</span>
          </h2>
          <p className={s.lead}>{VOICES.lead}</p>
        </header>

        {/* Counter, then one node per card. The fill rides the same
            scroll that moves the cards, so it is never ahead of them. */}
        <div className={s.tracker} aria-hidden="true">
          <b className={s.trackIndex}>{String(active + 1).padStart(2, '0')}</b>
          <div className={s.trackBar}>
            <span className={s.trackFill} ref={fillRef} />
            {VOICES.cards.map((c, i) => (
              <i
                key={c.key}
                className={s.trackNode}
                data-on={i === active}
                style={{ '--at': i / total } as React.CSSProperties}
              />
            ))}
          </div>
          <span className={s.trackTotal}>{String(total).padStart(2, '0')}</span>
        </div>
      </Wrap>

      <div className={s.stage}>
        <div className={s.rail} role="list" aria-label="Client words and receipts">
          {VOICES.cards.map((c, i) => (
            <article
              key={c.key}
              className={s.card}
              data-kind={c.kind}
              role="listitem"
              style={{ '--lift': `${LIFT[i % LIFT.length]}px` } as React.CSSProperties}
            >
              <header className={s.who}>
                <span className={s.avatar} aria-hidden="true">
                  {c.initial}
                </span>
                <span className={s.whoText}>
                  <b>{c.name}</b>
                  <em>{c.role}</em>
                </span>
              </header>
              <CardBody card={c} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The foot of a card: words, a number with its source, or the build. */
function CardBody({ card }: { card: VoiceCard }) {
  if (card.kind === 'quote') {
    return (
      <div className={s.body}>
        <blockquote className={s.quote} lang="id" data-long={card.quote.length > 90 || undefined}>
          {card.quote}
        </blockquote>
        <p className={s.gloss}>{card.gloss}</p>
      </div>
    );
  }
  if (card.kind === 'receipt') {
    return (
      <div className={s.body}>
        <b className={s.value}>{card.value}</b>
        <p className={s.valueLabel}>{card.label}</p>
        <p className={s.src}>
          <span aria-hidden="true">src / </span>
          {card.source}
        </p>
      </div>
    );
  }
  return (
    <div className={s.body}>
      <p className={s.chipNote}>{card.note}</p>
      <ul className={s.chipList}>
        {card.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
