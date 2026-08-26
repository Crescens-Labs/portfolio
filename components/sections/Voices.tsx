'use client';

import { useRef, useState } from 'react';
import { Wrap } from '@/components/layout';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { TESTIMONIAL, VOICES } from '@/content/home';
import s from './voices.module.css';

/**
 * Voices. Vertical scroll drives a horizontal rail of cards, with a progress
 * bar and counter that stay synchronized to the active card.
 *
 * The cards are quote cards in anatomy: glyph, text, then a round
 * avatar and a name line at the bottom left. One carries the verbatim
 * client quote, the rest carry the receipts, each with its source, so
 * nothing on the rail is invented and nothing needs paraphrasing.
 *
 * Motion contract: without JS, or under reduced motion, the rail is an
 * ordinary horizontally scrollable strip with snap points and the bar
 * follows its scroll position, so every card is reachable and nothing
 * waits on an animation. The pin is built only when motion is wanted
 * and the viewport is wide enough to sell the theatre.
 */
/** One entry per card on the rail, in order. Drives the tracker's
    segments so the two can never drift apart. */
const CARDS = [{ key: 'quote' }, ...VOICES.receipts.map((r) => ({ key: r.key })), { key: 'chips' }];

export function Voices() {
  const root = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      if (!root.current) return;
      const rail = root.current.querySelector<HTMLElement>(`.${s.rail}`);
      const stage = root.current.querySelector<HTMLElement>(`.${s.stage}`);
      const cards = [...root.current.querySelectorAll<HTMLElement>(`.${s.card}`)];
      if (!rail || !stage || cards.length === 0) return;

      const n = cards.length;

      // The fill is an instrument needle: it moves every scroll frame,
      // so it writes straight to the DOM instead of re-rendering the
      // rail for it. The index and the nodes change only when another
      // card takes over, which is what state is for.
      const setBar = (p: number) => {
        const clamped = Math.min(1, Math.max(0, p));
        if (fillRef.current) fillRef.current.style.transform = `scaleX(${clamped})`;
      };
      // Active card derives from travel progress, not from card rects:
      // the nodes sit at i/n of the bar and the fill head is the
      // progress, so "the node the head has reached" is exact at both
      // ends. A centre-of-screen rule can never light the last node,
      // because the last card's centre never crosses the middle.
      const setProgressState = (p: number) => {
        setBar(p);
        setActive(Math.min(n - 1, Math.floor(Math.min(1, Math.max(0, p)) * n)));
      };

      if (prefersReducedMotion()) {
        // The strip scrolls natively; the bar rides its scroll position.
        const onScroll = () => {
          const max = stage.scrollWidth - stage.clientWidth;
          setProgressState(max > 0 ? stage.scrollLeft / max : 1);
        };
        stage.addEventListener('scroll', onScroll, { passive: true });
        return () => stage.removeEventListener('scroll', onScroll);
      }

      const mm = gsap.matchMedia();
      mm.add('(min-width: 1000px) and (min-height: 620px)', () => {
        // The pin owns the horizontal axis on desktop, so the stage
        // stops being a native scroller for as long as it lasts. A
        // trackpad swipe that moved both would move the cards twice.
        const prevOverflow = stage.style.overflowX;
        stage.style.overflowX = 'hidden';

        // The pin. The section holds still while the track travels; the
        // distance is stretched past the raw overflow so the journey is
        // a slow browse rather than a flick, and the last card ends
        // flush with the right edge before the section hands back.
        const distance = () => Math.max(0, rail.scrollWidth - stage.clientWidth);
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
            onUpdate: (self) => setProgressState(self.progress),
          },
        });

        // Cards arrive as the section does, once, staggered along the
        // rail so the entrance reads as the rail itself sliding in.
        gsap.from(cards, {
          y: 26,
          opacity: 0,
          duration: 0.85,
          ease: 'house',
          stagger: 0.07,
          scrollTrigger: { trigger: root.current, start: 'top 72%', once: true },
        });

        return () => {
          stage.style.overflowX = prevOverflow;
        };
      });

      // Narrow OR SHORT viewports keep the native strip and its
      // scroll-driven bar even when motion is welcome. A pin buys
      // nothing on a phone, and on a short window the pinned stack
      // cannot fit, which is how the quote card once got cropped.
      mm.add('(max-width: 999px), (max-height: 619px)', () => {
        const onScroll = () => {
          const max = stage.scrollWidth - stage.clientWidth;
          setProgressState(max > 0 ? stage.scrollLeft / max : 1);
        };
        stage.addEventListener('scroll', onScroll, { passive: true });
        return () => stage.removeEventListener('scroll', onScroll);
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [] },
  );

  const total = CARDS.length;

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

        {/* The tracker, custom for this section: a counter in the accent,
            then one segment per card on the rail, each ending in a node.
            The fill rides the same scroll that moves the cards, so it is
            never ahead of or behind them, and a node lights when its
            card owns the middle of the screen. */}
        <div className={s.tracker} aria-hidden="true">
          <b className={s.trackIndex}>{String(active + 1).padStart(2, '0')}</b>
          <div className={s.trackBar}>
            <span className={s.trackFill} ref={fillRef} />
            {CARDS.map((c, i) => (
              <i
                key={c.key}
                className={s.trackNode}
                data-on={i === active}
                style={{ '--at': i / CARDS.length } as React.CSSProperties}
              />
            ))}
          </div>
          <span className={s.trackTotal}>{String(total).padStart(2, '0')}</span>
        </div>
      </Wrap>

      <div className={s.stage}>
        <div className={s.rail} role="list" aria-label="Client words and receipts">
          {/* The hero card: the one verbatim quote. */}
          <article className={s.card} data-kind="quote" role="listitem">
            <span className={s.glyph} aria-hidden="true">
              &ldquo;
            </span>
            <blockquote className={s.quote}>{TESTIMONIAL.quote}</blockquote>
            <p className={s.gloss}>{TESTIMONIAL.gloss}</p>
            <div className={s.foot}>
              <span className={s.avatar} aria-hidden="true">
                S
              </span>
              <span className={s.who}>
                <b>{TESTIMONIAL.context.split(',')[0]}</b>
                <em>said in chat, verbatim</em>
              </span>
            </div>
          </article>

          {/* The receipts. Client-side outcomes only, each with its
              source, so the number beside the quote can be checked. */}
          {VOICES.receipts.map((r) => (
            <article className={s.card} data-kind="receipt" role="listitem" key={r.key}>
              <b className={s.value}>{r.value}</b>
              <p className={s.valueLabel}>{r.label}</p>
              <p className={s.src}>
                <span aria-hidden="true">src / </span>
                {r.source}
              </p>
              <div className={s.foot}>
                <span className={s.avatar} aria-hidden="true">
                  {r.note.trim().charAt(0)}
                </span>
                <span className={s.who}>
                  <b>{r.note.split(',')[0]}</b>
                  <em>receipt</em>
                </span>
              </div>
            </article>
          ))}

          {/* The architecture card. The chips behind the numbers. */}
          <article className={s.card} data-kind="chips" role="listitem">
            <p className={s.chipNote}>{VOICES.chips.note}</p>
            <ul className={s.chipList}>
              {VOICES.chips.items.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <div className={s.foot}>
              <span className={s.avatar} data-kind="mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  {[-88, -134, 180, 134, 88].map((deg) => {
                    const a = (deg * Math.PI) / 180;
                    return (
                      <circle
                        key={deg}
                        cx={12 + Math.cos(a) * 8.2}
                        cy={12 + Math.sin(a) * 8.2}
                        r="2.3"
                        fill="currentColor"
                      />
                    );
                  })}
                </svg>
              </span>
              <span className={s.who}>
                <b>Snapose</b>
                <em>how it is built</em>
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
