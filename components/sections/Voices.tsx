'use client';

import { useRef, useState } from 'react';
import { Wrap } from '@/components/layout';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { getSound } from '@/lib/sound';
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
      const cards = [...rail.querySelectorAll<HTMLElement>(`.${s.card}`)];
      const n = cards.length;
      let lastActive = -1;

      /**
       * Focus, the reference's signature. A focus line travels from the
       * first card's centre (progress 0) to the last card's (progress 1),
       * so the opening card is lit when the section arrives and the
       * closing one when it leaves. Each card's strength falls off with
       * its distance from the line, smoothstepped, written to `--f` for
       * CSS to turn into opacity and lift. Continuous, so the hand-over
       * between cards is a short crossfade rather than a switch.
       *
       * All rects are read before any style is written: one layout per
       * frame, never a read-write ping-pong.
       */
      const focus = (p: number) => {
        const c = Math.min(1, Math.max(0, p));
        if (fillRef.current) fillRef.current.style.transform = `scaleX(${c})`;
        const rects = cards.map((el) => el.getBoundingClientRect());
        const first = rects[0];
        const last = rects[n - 1];
        if (!first || !last) return;
        // Positions are read mid-travel, so measure the line in rail space:
        // offset each centre by how far the rail has moved.
        const shift = rail.getBoundingClientRect().left;
        const a = first.left + first.width / 2 - shift;
        const b = last.left + last.width / 2 - shift;
        const line = a + (b - a) * c;
        const pitch = (b - a) / Math.max(1, n - 1);
        let best = 0;
        let bestF = -1;
        rects.forEach((r, i) => {
          const d = Math.abs(r.left + r.width / 2 - shift - line) / pitch;
          // Held at full until the line is 38% of a step away, gone by
          // 62%: the nearest card stays lit for most of the travel and the
          // crossfade happens only around the midpoint between two cards.
          const t = Math.min(1, Math.max(0, (0.62 - d) / 0.24));
          const f = t * t * (3 - 2 * t);
          cards[i].style.setProperty('--f', f.toFixed(3));
          if (f > bestF) {
            bestF = f;
            best = i;
          }
        });
        if (best !== lastActive) {
          // A card turned over: the hand-over is audible, softly, once
          // the rail is in motion (not on the first measurement).
          if (lastActive !== -1) getSound()?.play('focus');
          lastActive = best;
          cards.forEach((el, i) => (el.dataset.active = String(i === best)));
          setActive(best);
        }
      };
      const nativeProgress = () => {
        const max = stage.scrollWidth - stage.clientWidth;
        focus(max > 0 ? stage.scrollLeft / max : 1);
      };

      // Under reduced motion every card stays at full strength (the CSS
      // default for --f is 1); only the tracker follows the strip.
      if (prefersReducedMotion()) {
        const bar = () => {
          const max = stage.scrollWidth - stage.clientWidth;
          const c = max > 0 ? stage.scrollLeft / max : 1;
          if (fillRef.current) fillRef.current.style.transform = `scaleX(${c})`;
          setActive(Math.min(n - 1, Math.round(c * (n - 1))));
        };
        stage.addEventListener('scroll', bar, { passive: true });
        return () => stage.removeEventListener('scroll', bar);
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
        // Focus rides the TWEEN's update, not the trigger's: with scrub the
        // rail keeps gliding after the wheel stops, and the light has to
        // keep moving with it. Scrub is short because Lenis already
        // smooths the wheel; two long smoothings stacked read as lag and
        // then a lurch, which was the harshness in the old rail.
        // `this` rather than the returned tween: with a pinned trigger
        // the first update can fire during construction, before any
        // variable holding the tween has been assigned.
        gsap.to(rail, {
          x: () => -distance(),
          ease: 'none',
          onUpdate(this: gsap.core.Tween) {
            focus(this.progress());
          },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${Math.round(distance() * 1.6 + window.innerHeight * 0.4)}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        focus(0);

        // The hand is dealt as the section arrives: cards rise from
        // below their resting heights, staggered along the rail.
        gsap.from(cards, {
          yPercent: 18,
          opacity: 0,
          duration: 0.9,
          ease: 'house',
          stagger: 0.07,
          clearProps: 'opacity,transform',
          scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
        });

        return () => {
          stage.style.overflowX = prevOverflow;
          cards.forEach((el) => {
            el.style.removeProperty('--f');
            delete el.dataset.active;
          });
        };
      });
      mm.add('(max-width: 999px), (max-height: 619px)', () => {
        stage.addEventListener('scroll', nativeProgress, { passive: true });
        nativeProgress();
        return () => stage.removeEventListener('scroll', nativeProgress);
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [] },
  );

  const total = VOICES.cards.length;

  return (
    <section id="voices" data-ground="dark" className={`specks-host ${s.voices}`} ref={root}>
      <i className="specks specks-static" style={{ '--specks-o': 0.5 } as React.CSSProperties} aria-hidden="true" />
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
        <ul className={s.rail} aria-label="Client words and receipts">
          {VOICES.cards.map((c, i) => (
            <li
              key={c.key}
              className={s.card}
              data-kind={c.kind}
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
            </li>
          ))}
        </ul>
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
