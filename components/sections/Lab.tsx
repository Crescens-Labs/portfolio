'use client';

import { useRef, useState } from 'react';
import { Wrap } from '@/components/layout';
import { CipherVeil } from '@/components/CipherVeil';
import { DecryptText } from '@/components/DecryptText';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { PRODUCTS } from '@/content/home';
import s from './lab.module.css';

/**
 * Section 14. From the lab.
 *
 * The loudest "coming soon" on the page, because the products are what
 * the studio sells next:
 *
 *   - a full width ticker strip carries the announcement in the accent
 *     and never stops moving
 *   - the three products are catalogue rows, names decrypting in on
 *     scroll, the "for whom" line expanding on hover
 *   - the whole section sits behind the decrypt veil: at rest it reads
 *     as encrypted, and the pointer opens it up. Stay, and the entire
 *     section clears. The real content is in the DOM the whole time;
 *     the veil is decoration that knows when to leave
 *   - the waitlist band closes, the one surface the accent owns
 */
export function Lab() {
  const root = useRef<HTMLElement>(null);
  const [email, setEmail] = useState('');

  useGSAP(
    () => {
      if (!root.current || prefersReducedMotion()) return;
      gsap.from(`.${s.row}`, {
        y: 28,
        opacity: 0,
        duration: 0.85,
        ease: 'house',
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: 'top 78%', once: true },
      });
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section id="lab" data-ground="dark" className={`specks-host ${s.lab}`} ref={root}>
      <i className="specks specks-static" style={{ '--specks-o': 0.5 } as React.CSSProperties} aria-hidden="true" />
      {/* The decrypt veil over everything. Pointer-transparent, so the
          form and the rows stay live underneath it. */}
      <CipherVeil hint="hover to decrypt" />

      <Wrap>
        <p className={s.eyebrow}>{PRODUCTS.eyebrow}</p>
        <header className={s.head}>
          <h2 className={s.title}>
            {PRODUCTS.headline.lead}{' '}
            <span className={s.accent}>{PRODUCTS.headline.accent}</span>
          </h2>
          <p className={s.lead}>{PRODUCTS.lead}</p>
        </header>

        {/* The announcement, running for as long as the page does. */}
        <div className={s.ticker} aria-hidden="true">
          <div className={s.tickerTrack}>
            <span>{PRODUCTS.ticker}</span>
            <span>{PRODUCTS.ticker}</span>
          </div>
        </div>

        <div className={s.rows}>
          {PRODUCTS.items.map((p, i) => (
            <article key={p.name} className={s.row} data-i={i}>
              <div className={s.rowHead}>
                <span className={s.rowIndex} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={s.rowStatus} data-status={p.status}>
                  <i aria-hidden="true" />
                  {p.status}
                </span>
                <h3 className={s.rowName}>
                  <DecryptText text={p.name} duration={1.4} />
                </h3>
              </div>
              <div className={s.rowBody}>
                <p className={s.rowTag}>{p.tag}</p>
                <p className={s.rowWhat}>{p.what}</p>
                <p className={s.rowWho}>
                  <span>for </span>
                  {p.who}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* The waitlist band. Full width, the accent as the fill, the
            capture row inverted so the accent and the dark swap places.
            It is the one surface on the page the accent owns entirely,
            because the products are what the section sells. */}
        <form
          className={s.capture}
          onSubmit={(e) => {
            e.preventDefault();
            // Stub: real endpoint ships in Phase 10. The state and the
            // submit handshake are in place so the production swap is a
            // one line fetch, not a rewrite.
            setEmail('');
          }}
        >
          <div className={s.captureHead}>
            <span className={s.captureKick}>{PRODUCTS.waitlist.kicker}</span>
            <span className={s.captureLabel}>{PRODUCTS.waitlist.label}</span>
          </div>
          <div className={s.captureRow}>
            <label className={s.field}>
              <span className={s.fieldLabel}>email</span>
              <input
                type="email"
                className={s.input}
                placeholder="you@something.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <button type="submit" className={s.submit}>
              <span>Notify me</span>
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
          <p className={s.captureNote}>{PRODUCTS.waitlist.note}</p>
        </form>
      </Wrap>
    </section>
  );
}
