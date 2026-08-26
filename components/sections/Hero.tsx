'use client';

import { useRef } from 'react';
import { Nav } from '@/components/Nav';
import { Magnetic } from '@/components/Magnetic';
import { HeroVideo } from '@/components/sections/HeroVideo';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { INTRO_LEAVING } from '@/components/Loader';
import { HERO, PROOF } from '@/content/home';
import s from './sections.module.css';

/**
 * The hero.
 *
 * Structure follows the reference rather than reinventing it: a dark
 * textured field, a short headline, one support line, one action, and the
 * wordmark bleeding off the bottom. No object floating in the middle.
 *
 * Three things were removed and each removal is the point:
 *
 *   - THE EYEBROW. "+ end to end software studio" said what the headline
 *     already says, and cost a line of vertical space at the top of the
 *     page where space is worth the most.
 *   - THE PROOF CARD. A bordered box holding "Top 7" competed with the
 *     headline for the same glance and read as a widget. The same fact is
 *     in the strip below, where it belongs with the other three.
 *   - THE PARTICLE FIELD. The reference has nothing floating in its hero
 *     and that is why it reads as expensive. A scatter of dots over a dark
 *     background is the single most common way to make a page look cheap.
 *
 * The nav renders INSIDE the field, not above it. Rendered outside, it sat
 * on the flat page background while the hero had gradient and grain, and
 * the seam between the two was visible across the full width.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  /**
   * The entrance. Everything here is a `from` tween: the resting state of
   * every element is its final, visible one, so SSR, a failed hydration
   * and reduced motion all render the finished hero.
   *
   * While the loader is running the timeline waits for the curtain to
   * start lifting, then plays into the handoff. When there is no loader
   * (a repeat visit) it plays on the spot. The fallback timer exists
   * because a paused `from` timeline holds its targets at the hidden
   * start state: if the event is ever missed, the page plays anyway
   * rather than staying blank.
   */
  useGSAP(
    () => {
      if (
        !root.current ||
        prefersReducedMotion() ||
        window.matchMedia('(max-width: 767px)').matches
      ) {
        return;
      }

      const tl = gsap.timeline({ paused: true });
      tl.from('header', { y: -16, opacity: 0, duration: 0.7 })
        .from(`.${s.hLead}, .${s.hMain}, .${s.hAccent}`, {
          y: '0.55em',
          opacity: 0,
          duration: 1.05,
          stagger: 0.09,
        }, 0.05)
        .from(`.${s.heroLead}`, { y: 22, opacity: 0, duration: 0.85 }, 0.5)
        .from(`.${s.heroActions} > *`, { y: 18, opacity: 0, duration: 0.75, stagger: 0.09 }, 0.68)
        .from(`.${s.proofLabel}`, { opacity: 0, duration: 0.6 }, 0.85)
        .from(`.${s.proofCard}`, { y: 26, opacity: 0, duration: 0.9, stagger: 0.07 }, 0.9);

      let fallback = 0;
      const play = () => {
        window.clearTimeout(fallback);
        window.removeEventListener(INTRO_LEAVING, onLeaving);
        tl.play();
      };
      const onLeaving = () => window.setTimeout(play, 150);

      if ((window as { __crescensIntro?: boolean }).__crescensIntro) {
        window.addEventListener(INTRO_LEAVING, onLeaving);
        // The loader lifts at ~4s; the fallback must sit past that or
        // the entrance would play underneath the curtain.
        fallback = window.setTimeout(play, 5200);
      } else {
        play();
      }

      return () => {
        window.removeEventListener(INTRO_LEAVING, onLeaving);
        window.clearTimeout(fallback);
      };
    },
    { scope: root },
  );

  return (
    <section id="top" data-ground="dark" className={s.hero} ref={root}>
      <div className={s.field} aria-hidden="true">
        <div className={s.fieldGrad} />
        {/* The silk loop sits above the gradient it enhances and below
            the vignette. Phones and opted-out visitors never download it.
            Grain now comes from the one page-wide sheet in the layout, so
            the hero no longer carries its own layer on top. */}
        <HeroVideo />
        <div className={s.fieldVignette} />
      </div>

      <div className={s.heroInner}>
        <Nav />

        <div className={s.heroBody}>
          <h1 className={s.heroHead}>
            <span className={s.hLead}>{HERO.headline.lead} </span>
            <span className={s.hMain}>{HERO.headline.main}</span>{' '}
            <span className={s.hAccent}>{HERO.headline.accent}</span>
          </h1>

          <div className={s.heroFoot}>
            <p className={s.heroLead}>{HERO.lead}</p>

            {/* Stacked and right aligned. The primary sits on top and ends
                furthest right; the secondary tucks under it, shorter, so
                the ranking is legible before either label is read. */}
            <div className={s.heroActions}>
              <Magnetic>
                <a className={s.ctaCard} href={HERO.cta.href}>
                  <span className={s.ctaLabel}>{HERO.cta.label}</span>
                  {/* Three dots that resolve into an arrow on hover. The
                      dots are the logo's motif; the arrow is the promise
                      that the control does something. */}
                  <span className={s.ctaGlyph} aria-hidden="true">
                    <span className={s.ctaDots}>
                      <i />
                      <i />
                      <i />
                    </span>
                    <svg className={s.ctaArrow} viewBox="0 0 16 16" focusable="false">
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
              </Magnetic>

              <a className={s.heroSecondary} href={HERO.secondary.href}>
                {HERO.secondary.label}
              </a>
            </div>
          </div>
        </div>

        {/* Ordered by weight of claim, not by how well known the logo is.
            A national win outranks a cohort placement, which outranks
            being in the room.

            Cards, not a text row. A flat list of four facts reads as a
            footnote; a card asks to be looked at, and these are the four
            things on the page a stranger has the least reason to doubt. */}
        <div className={s.proofStrip}>
          <p className={s.proofLabel}>{PROOF.label}</p>
          <ul className={s.proofList}>
            {PROOF.marks.map((m, i) => (
              <li key={m.slug} className={s.proofCard}>
                <span className={s.proofRule} aria-hidden="true" />
                <span className={s.proofTop}>
                  <span className={s.proofIndex} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/logos/${m.slug}.png`} alt="" width={26} height={26} loading="lazy" />
                </span>
                <b>{m.result}</b>
                <span className={s.proofEvent}>{m.event}</span>
                <em>{m.org}</em>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/**
 * The giant wordmark, in flow between the hero and the band below it.
 *
 * SVG, not a `<p>`. A text node sized in `vw` can only ever be approximately
 * the width of the screen: pick a value that fits at 1440 and it clips at
 * 390, pick one that fits at 390 and it floats in a margin at 1440. The
 * previous version clipped the last two letters, so the word read CRESCEN.
 *
 * `textLength` with `lengthAdjust` makes the browser solve that exactly.
 * The glyphs are laid out to fill precisely 1000 user units, the viewBox is
 * 1000 wide, and the SVG is 100% of its container, so the word spans edge
 * to edge at every viewport with nothing cut off and no measuring code.
 * The font size is chosen so the natural width is already within about one
 * percent of 1000, which keeps the adjustment invisible.
 *
 * The viewBox height is Inter's cap height at that size, so the box hugs
 * the letters and there is no dead space above or below.
 *
 * `position: sticky; top: 0`. It rides up out of the hero, holds against
 * the top of the viewport while the field behind it turns from dark to
 * cream, and releases before the section below it has anything to say. The
 * earlier version held all the way into that section and sat on top of its
 * heading.
 *
 * `mix-blend-mode: difference` sits on the wrapper, not on the glyphs.
 * White stays white over the dark field and resolves to near black over
 * the cream, so the inversion is done by the compositor rather than by a
 * scroll listener that can fall out of step.
 */
export function GiantWordmark() {
  return (
    <div className={s.wordmarkBand} aria-hidden="true">
      <svg
        className={s.giant}
        data-testid="wordmark"
        viewBox="0 0 1000 146"
        focusable="false"
        role="presentation"
      >
        <text x="0" y="146" textLength="1000" lengthAdjust="spacingAndGlyphs">
          CRESCENS
        </text>
      </svg>
    </div>
  );
}
