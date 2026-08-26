'use client';

import { useRef } from 'react';
import { Wrap } from '@/components/layout';
import { Accordion } from '@/components/ui';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { FAQ } from '@/content/home';
import s from './faq.module.css';

/**
 * Section 16. FAQ. Eight questions, three groups, written as straight
 * answers. The Accordion primitive carries the dot-to-bar marker already,
 * so each row reads as the mark transforming rather than as a box
 * expanding. The section title is two-tone like every other section title
 * on the page, so the FAQ claims the same stance as the rest of the page
 * rather than reading as a help-desk page. The groups rise into place in
 * column order, so the section opens like the page's other ledgers.
 */
export function Faq() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!root.current || prefersReducedMotion()) return;
      gsap.from(`.${s.group}`, {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: 'house',
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: 'top 78%', once: true },
      });
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section id="faq" data-ground="dark" className={`specks-host ${s.faq}`} ref={root}>
      <i className="specks specks-static" aria-hidden="true" />
      <Wrap>
        <p className={s.eyebrow}>{FAQ.eyebrow}</p>
        <header className={s.head}>
          <h2 className={s.title}>
            <span className={s.tMuted}>{FAQ.heading.muted}</span>{' '}
            <span className={s.tStrong}>{FAQ.heading.strong}</span>
          </h2>
          <p className={s.lead}>{FAQ.lead}</p>
        </header>

        <div className={s.groups}>
          {FAQ.groups.map((g) => (
            <section key={g.key} className={s.group}>
              <h3 className={s.groupLabel}>{g.label}</h3>
              <Accordion
                items={g.items.map((it, i) => ({
                  q: `${String(i + 1).padStart(2, '0')}  ${it.q}`,
                  a: it.a,
                }))}
              />
            </section>
          ))}
        </div>
      </Wrap>
    </section>
  );
}