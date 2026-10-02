'use client';

import { useRef } from 'react';
import { Wrap } from '@/components/layout';
import { FormField } from '@/components/ui';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { SocialGlyph } from '@/components/Nav';
import { CONTACT, WHATSAPP } from '@/content/home';
import { external, waHref } from '@/lib/whatsapp';
import s from './contact.module.css';

/**
 * Section 17. Contact.
 *
 * The form field is labelled "What is breaking?" on purpose. "Message"
 * filters for nothing, "What is breaking?" filters for people with a real
 * operational problem and primes the exact conversation we want to have.
 *
 * The form is a raised sheet, the one panel object on the page a visitor
 * is invited to touch: fields sit in it as numbered slots, ledger style,
 * and each slot's index lights when it holds the caret. The left column
 * answers what happens after I send this in three plain steps. The form
 * keeps the interaction local until delivery wiring is connected.
 *
 * The ghosted wordmark behind reads as the studio underneath the page
 * rather than as a graphic placed on it. Same SVG textLength trick the
 * hero wordmark uses, at much lower contrast.
 */
export function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!root.current || prefersReducedMotion()) return;
      // The sheet rises, its slots stagger in after it, and the steps
      // settle beside them: three beats, one entrance.
      gsap.from(`.${s.form}`, {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'house',
        scrollTrigger: { trigger: root.current, start: 'top 74%', once: true },
      });
      gsap.from(`.${s.fieldSlot}`, {
        y: 16,
        opacity: 0,
        duration: 0.7,
        ease: 'house',
        stagger: 0.06,
        delay: 0.15,
        scrollTrigger: { trigger: root.current, start: 'top 74%', once: true },
      });
      gsap.from(`.${s.steps} li`, {
        y: 14,
        opacity: 0,
        duration: 0.6,
        ease: 'house',
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
      });
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section id="contact" data-ground="void" className={`specks-host ${s.contact}`} ref={root}>
      <i className="specks specks-static" aria-hidden="true" />
      {/* The ghost wordmark, anchored bottom, clipped by the contact
          section's lower edge. Same construction as the giant
          wordmark's SVG, at a fraction of the opacity. */}
      <svg
        className={s.ghost}
        viewBox="0 0 1000 146"
        aria-hidden="true"
        focusable="false"
        role="presentation"
      >
        <text x="0" y="146" textLength="1000" lengthAdjust="spacingAndGlyphs">
          CRESCENS
        </text>
      </svg>

      <Wrap>
        <div className={s.grid}>
          <header className={s.side}>
            <p className={s.eyebrow}>{CONTACT.eyebrow}</p>
            <h2 className={s.title}>
              <span className={s.tAccent}>{CONTACT.heading.accent}</span>{' '}
              <span className={s.tStrong}>{CONTACT.heading.rest}</span>
            </h2>
            <p className={s.lead}>{CONTACT.lead}</p>

            {/* What happens after the send. The question every form
                raises and most never answer; answering it is what makes
                this one worth filling. */}
            <ol className={s.steps}>
              {CONTACT.steps.map((step, i) => (
                <li key={step}>
                  <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  {step}
                </li>
              ))}
            </ol>

            <p className={s.emailLine}>
              <span>{CONTACT.secondaryLine}</span>
              <a className={s.email} href={`mailto:${CONTACT.email}`}>
                {CONTACT.email}
              </a>
            </p>

            {/* The fast lane, for a visitor with one question who is not
                ready to write a brief. The form stays the considered route,
                this sits under it rather than competing with it. */}
            <div className={s.waLine}>
              <span>{CONTACT.whatsapp.kicker}</span>
              <a className={s.wa} href={waHref(WHATSAPP.messages.hello)} {...external}>
                <SocialGlyph label="WhatsApp" />
                <span className={s.waLabel}>{CONTACT.whatsapp.label}</span>
                <span className={s.waNumber}>{WHATSAPP.display}</span>
              </a>
            </div>
          </header>

          <form className={s.form} action="#" method="POST">
            <div className={s.fields}>
              {CONTACT.fields.map((f, i) => (
                <div className={s.fieldSlot} key={f.name}>
                  <span className={s.slotIndex} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <FormField
                    label={f.label}
                    name={f.name}
                    type={f.type}
                    placeholder={f.placeholder}
                    required={f.required}
                  />
                </div>
              ))}
            </div>

            <div className={s.fieldSlot}>
              <span className={s.slotIndex} aria-hidden="true">
                {String(CONTACT.fields.length + 1).padStart(2, '0')}
              </span>
              <div className={s.messageCol}>
                <label className={s.messageLabel} htmlFor="breaking">
                  {CONTACT.messageField.label}
                </label>
                <textarea
                  id="breaking"
                  name={CONTACT.messageField.name}
                  placeholder={CONTACT.messageField.placeholder}
                  className={s.message}
                  rows={4}
                  required
                />
              </div>
            </div>

            <div className={s.submitRow}>
              <p className={s.consent}>{CONTACT.submit.note}</p>
              <button type="submit" className={s.submit}>
                <span>{CONTACT.submit.label}</span>
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
              </button>
            </div>
          </form>
        </div>
      </Wrap>
    </section>
  );
}