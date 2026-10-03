'use client';

import { useRef } from 'react';
import { Wrap } from '@/components/layout';
import { RevealText } from '@/components/RevealText';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { RECOGNITION, TAGLINE } from '@/content/home';
import s from './recognition.module.css';

/**
 * Section 12. Recognition.
 *
 * The statement reveal runs on the left and the four awards stack as a
 * ledger on the right, so the section's two halves work at the same
 * time instead of the right side sitting empty. Each ledger row is
 * result first, then label, caption and source, the same evidence
 * discipline as the stats strip.
 *
 * No client quotes exist and inventing them fails the tagline, so the
 * section trades the testimonial gesture for judged results, each
 * carrying its source.
 */
export function Recognition() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!root.current || prefersReducedMotion()) return;
      gsap.from(`.${s.award}`, {
        y: 22,
        opacity: 0,
        duration: 0.8,
        ease: 'house',
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: 'top 76%', once: true },
      });
      // The verification foot anchors the bottom of the statement column,
      // so it arrives with the ledger it answers rather than with the
      // sentence above it.
      gsap.from(`.${s.statementFoot}`, {
        y: 16,
        opacity: 0,
        duration: 0.8,
        ease: 'house',
        scrollTrigger: { trigger: root.current, start: 'top 62%', once: true },
      });
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section id="recognition" data-ground="dark" className={`specks-host ${s.recognition}`} ref={root}>
      <i className="grid-field" aria-hidden="true" />
      <Wrap>
        <p className={s.eyebrow}>{RECOGNITION.eyebrow}</p>
        <h2 className={s.title}>
          <span className={s.tMuted}>{RECOGNITION.heading.muted}</span>{' '}
          <span className={s.tStrong}>{RECOGNITION.heading.strong}</span>
        </h2>

        <div className={s.split}>
          <div className={s.statement}>
            <RevealText as="blockquote" distance={0.85} text={RECOGNITION.reveal} />

            {/* The foot claims the depth the ledger gives the column:
                the reveal ends high, and without this the left side ends
                in a field of nothing. It restates the section's method,
                the tagline the ledger just proved. */}
            <div className={s.statementFoot}>
              <p className={s.statementNote}>{RECOGNITION.note}</p>
              <p className={s.statementTag}>{TAGLINE.text}</p>
            </div>
          </div>

          <ul className={s.awards}>
            {RECOGNITION.awards.map((a, i) => (
              <li key={a.key} className={s.award} data-i={i}>
                <span className={s.awardIndex} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <b className={s.awardValue}>{a.value}</b>
                <div className={s.awardText}>
                  <p className={s.awardLabel}>{a.label}</p>
                  <p className={s.awardCaption}>{a.caption}</p>
                  <p className={s.awardSrc}>
                    <span aria-hidden="true">src / </span>
                    {a.source}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Wrap>
    </section>
  );
}