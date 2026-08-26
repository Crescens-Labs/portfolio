'use client';

import { useRef } from 'react';
import { Wrap } from '@/components/layout';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { SERVICES } from '@/content/home';
import s from './build.module.css';

/**
 * Section 8, what we build. The sticky rail carries the section title
 * while six rows scroll past, so the reader always knows where they are.
 *
 * Rows brighten as they enter the viewport, and on
 * hover each row performs: the marker dot lands, the index takes the
 * accent, the title steps forward, and the top hairline draws itself in
 * the accent. All transforms and opacity, no layout work.
 *
 * The closing quote that used to sit under the rows was cut: the same
 * sentence already opens the page as the thesis, and a section that says
 * its thing twice reads as unsure of it. The CTA is now a command bar,
 * a different silhouette from the display links elsewhere on the page.
 */
export function Services() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!root.current || prefersReducedMotion()) return;
      const rows = root.current.querySelectorAll<HTMLElement>(`.${s.serviceRow}`);
      rows.forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0.22 },
          {
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: row,
              start: 'top 94%',
              end: 'top 58%',
              scrub: 0.4,
            },
          },
        );
      });
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section id="services" data-ground="dark" className={`specks-host ${s.services}`} ref={root}>
      <i className="specks specks-static" aria-hidden="true" />
      <Wrap>
        <div className={s.servicesGrid}>
          <div className={s.servicesRail}>
            <p className={s.eyebrow}>{SERVICES.eyebrow}</p>
            <h2 className={s.title}>
              <span className={s.tAccent}>{SERVICES.heading.accent}</span>{' '}
              <span className={s.tStrong}>{SERVICES.heading.rest}</span>
            </h2>
            <p className={s.lead}>{SERVICES.lead}</p>
          </div>

          <div className={s.servicesRows}>
            {SERVICES.items.map((it) => (
              <article key={it.index} className={s.serviceRow}>
                <span className={s.serviceIndex} aria-hidden="true">
                  <i className={s.serviceDot} />
                  {it.index}
                </span>
                <h3 className={s.serviceTitle}>{it.title}</h3>
                <p className={s.serviceBody}>{it.body}</p>
              </article>
            ))}
          </div>
        </div>

        {/* The command bar CTA. Every other section closes with a display
            link; this one closes like a prompt, which fits both the
            studio's tooling identity and the "let's scope it" kicker. */}
        <a className={s.scopeBar} href={SERVICES.cta.href}>
          <span className={s.scopeFill} aria-hidden="true" />
          <span className={s.scopeKick}>{SERVICES.cta.kicker}</span>
          <span className={s.scopeLabel}>
            <span className={s.scopePrompt} aria-hidden="true">
              &gt;
            </span>
            {SERVICES.cta.label}
          </span>
          <span className={s.scopeArrow} aria-hidden="true">
            <svg viewBox="0 0 16 16" focusable="false">
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
      </Wrap>
    </section>
  );
}
