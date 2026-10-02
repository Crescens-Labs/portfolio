import Link from 'next/link';
import { Wrap } from '@/components/layout';
import { RevealText } from '@/components/RevealText';
import { SocialGlyph } from '@/components/Nav';
import { BarcodeStrip } from '@/components/BarcodeStrip';
import { FOOTER, SOCIALS, TAGLINE, WHATSAPP } from '@/content/home';
import { external, waHref } from '@/lib/whatsapp';
import s from './footer.module.css';

/**
 * Footer closing composition:
 *
 *   meta row     tagline / nav / email
 *   centre       the closing statement and the circular CTA
 *   wordmark     CRESCENS, full width, full weight, at the foot
 *   meta row     copyright / elsewhere + legal / where we work from
 *   barcode      the process tick pattern, run out as a strip
 *
 * The circular CTA carries a rotating text ring, the one piece of
 * perpetual motion on the band, so the end of the page still breathes.
 * The barcode is our own tick motif from the process bars, which means
 * the page ends on a pattern the visitor has already learned.
 */
export function Footer() {
  return (
    <footer id="footer" data-ground="void" className={`specks-host ${s.footer}`}>
      <i className="specks specks-live" aria-hidden="true" />
      <Wrap>
        <div className={s.metaTop}>
          <span className={s.tagline}>{TAGLINE.text}</span>
          <nav className={s.metaNav} aria-label="Footer">
            {FOOTER.nav.map((n) => (
              <Link key={n.href} href={n.href}>
                {n.label}
              </Link>
            ))}
          </nav>
          <a className={s.metaEmail} href={`mailto:${FOOTER.email}`}>
            {FOOTER.email}
          </a>
        </div>

        <div className={s.mid}>
          <p className={s.midKicker}>+ start a project</p>

          <div className={s.midGrid}>
            <div className={s.statement}>
              <RevealText as="p" distance={0.7} text={FOOTER.statementHead} />
            </div>

            {/* The seal. A rotating text ring around an arrow core, the
                keystone of the triptych and the one piece of perpetual
                motion on the band, slow enough to read as a stamp rather
                than a spinner. On hover the ring text and the core take
                the accent: the whole seal lights before the visitor
                commits to it. */}
            <Link className={s.ctaOrb} href="/#contact" aria-label="Start a project, go to the contact form">
              <svg className={s.ring} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
                <defs>
                  <path id="ctaRing" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" />
                </defs>
                <text>
                  {/* textLength closes the loop exactly, so the band
                      reads as a continuous seal; where unsupported it
                      renders at its natural length and still reads as a
                      ring. */}
                  <textPath href="#ctaRing" textLength="294" lengthAdjust="spacing">
                    start a project · let&apos;s talk ·
                  </textPath>
                </text>
              </svg>
              <span className={s.orbCore} aria-hidden="true">
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
            </Link>

            <p className={s.midTail}>{FOOTER.statementTail}</p>
          </div>
        </div>
      </Wrap>

      {/* The wordmark at the foot, full width via the same textLength
          solve the hero uses, so the page ends on the name at full
          weight rather than on a strip of links. */}
      <div className={s.wordmarkRow} aria-hidden="true">
        <svg className={s.wordmark} viewBox="0 0 1000 146" focusable="false" role="presentation">
          <text x="0" y="146" textLength="1000" lengthAdjust="spacingAndGlyphs">
            CRESCENS
          </text>
        </svg>
      </div>

      <Wrap>
        <div className={s.metaBottom}>
          <span className={s.copy}>{FOOTER.copyright}</span>
          <div className={s.metaLinks}>
            {SOCIALS.map((sl) => (
              <a key={sl.href} href={sl.href} target="_blank" rel="noreferrer" aria-label={sl.label}>
                <SocialGlyph label={sl.label} />
                <span>{sl.label}</span>
              </a>
            ))}
            <a href={waHref(WHATSAPP.messages.hello)} {...external} aria-label="WhatsApp">
              <SocialGlyph label="WhatsApp" />
              <span>WhatsApp</span>
            </a>
            <span className={s.metaSep} aria-hidden="true" />
            {FOOTER.legal.map((l) => (
              <a key={l.label} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>
          <span className={s.locale}>Remote, Indonesia</span>
        </div>
      </Wrap>

      {/* The barcode. The process tick pattern run out as a full width
          strip, and it reads the pointer: see BarcodeStrip. */}
      <BarcodeStrip />
    </footer>
  );
}