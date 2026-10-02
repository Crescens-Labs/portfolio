import Link from 'next/link';
import { SocialGlyph } from '@/components/Nav';
import { ENGAGEMENT, VOICES, WHATSAPP } from '@/content/home';
import { nextCaseStudy, type CaseStudy } from '@/content/work';
import { external, waHref } from '@/lib/whatsapp';
import { Chapter } from './CaseStory';
import s from './case.module.css';

/**
 * Result, the client's words, handover, then the way on. Chapters number
 * themselves from 05, skipping any the study has nothing true to fill.
 */
export function CaseOutro({ study }: { study: CaseStudy }) {
  const voice = VOICES.cards.find((c) => c.key === study.voice && c.kind === 'quote');
  const next = nextCaseStudy(study.slug);
  let n = 4;
  const num = () => String(++n).padStart(2, '0');

  return (
    <>
      <Chapter n={num()} label="the result" id="result">
        {study.results.length > 0 ? (
          <ul className={s.results}>
            {study.results.map((r) => (
              <li key={r.label}>
                <b className={s.resultValue}>{r.value}</b>
                <div className={s.resultText}>
                  <p className={s.resultLabel}>{r.label}</p>
                  <p className={s.resultCaption}>{r.caption}</p>
                  <p className={s.resultSrc}>
                    <span aria-hidden="true">src / </span>
                    {r.source}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className={s.pending}>
            <b>In build.</b>
            <p>{study.pending}</p>
          </div>
        )}
      </Chapter>

      {voice && voice.kind === 'quote' && (
        <Chapter n={num()} label="in their words" id="voice">
          <figure className={s.voice}>
            <blockquote lang="id">{voice.quote}</blockquote>
            <p className={s.voiceGloss}>{voice.gloss}</p>
            <figcaption>
              <span aria-hidden="true">{voice.initial}</span>
              <b>{voice.name}</b>
              <em>{voice.role}</em>
            </figcaption>
          </figure>
        </Chapter>
      )}

      {study.handover && (
        <Chapter n={num()} label="handover" id="handover">
          <p className={s.kicker}>What the client owns at the end</p>
          <ul className={s.handover}>
            {study.handover.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <p className={s.handoverNote}>{ENGAGEMENT.footnote}</p>
        </Chapter>
      )}

      <section data-ground="void" className={`specks-host ${s.next}`}>
        <i className="specks specks-static" aria-hidden="true" />
        <div className={s.nextInner}>
          <p className={s.kicker}>Next case study</p>
          <Link href={`/work/${next.slug}`} className={s.nextLink}>
            <span className={s.nextIndex}>{next.index}</span>
            <span className={s.nextName}>{next.name}</span>
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
          </Link>
          <p className={s.nextSub}>{next.subtitle}</p>

          <div className={s.ask}>
            <p>Have a problem shaped like this one?</p>
            <div className={s.askActions}>
              <a className={s.askWa} href={waHref(WHATSAPP.messages.hello)} {...external}>
                <SocialGlyph label="WhatsApp" />
                Chat on WhatsApp
              </a>
              <Link className={s.askBrief} href="/#contact">
                Send a brief
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
