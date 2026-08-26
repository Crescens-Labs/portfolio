import { Wrap } from '@/components/layout';
import { Marquee } from '@/components/ui';
import { RevealText } from '@/components/RevealText';
import { StatCell } from '@/components/ui';
import { STATS, TECH_STACK, WHO } from '@/content/home';
import s from './sections.module.css';

/**
 * Section 4 of the content model.
 *
 * The one section that answers "who is this" without a founder photo and a
 * paragraph about passion. The claim is set as a quote and attributed to a
 * named person, because in the third person it would read as marketing and
 * attributed it reads as a commitment somebody can be held to.
 *
 * The marquee runs capabilities, not client logos. The reference runs
 * logos here; we do not have a wall of them, and a thin one reads worse
 * than none. Capabilities scan just as fast and are the thing a visitor is
 * actually trying to find out.
 */
export function Who() {
  return (
    <section id="who" data-ground="dark" className={`specks-host ${s.who}`}>
      <i className="specks specks-static" aria-hidden="true" />
      <Wrap>
        <p className={s.eyebrow}>{WHO.eyebrow}</p>

        <div className={s.whoHead}>
          <h2 className={s.whoTitle}>
            <span className={s.tMuted}>{WHO.heading.muted}</span>{' '}
            <span className={s.tStrong}>{WHO.heading.strong}</span>
          </h2>
          <p className={s.whoSupport}>{WHO.support}</p>
        </div>

        <figure className={s.quote}>
          <span className={s.quoteGlyph} aria-hidden="true">
            &ldquo;
          </span>
          <blockquote className={s.quoteBody}>
            {/* M2, the signature word by word reveal. It is the studio's
                actual position, so it gets the site's most expensive
                effect rather than a fade. */}
            <RevealText as="p" distance={0.8} text={WHO.quote} />
          </blockquote>
          <figcaption className={s.quoteBy}>
            <b>{WHO.author.name}</b>
            <span>{WHO.author.role}</span>
          </figcaption>
        </figure>
      </Wrap>

      {/* Full bleed on purpose. A marquee inset inside the gutter looks
          like a component; one that runs off both edges looks like the
          page continues past the frame.

          Two belts running against each other: what we do at display
          weight, what we do it with in quiet mono and greyscale. */}
      <div className={s.marqueeBand}>
        <Marquee speed={54}>
          {WHO.capabilities.map((c) => (
            <span key={c} className={s.chip}>
              {c}
            </span>
          ))}
        </Marquee>

        <Marquee speed={46} reverse>
          {TECH_STACK.map((t) => (
            <span key={t.slug} className={s.logoChip}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/logos/tech/${t.slug}.png`} alt="" width={24} height={24} loading="lazy" />
              <span className={s.logoName}>{t.name}</span>
            </span>
          ))}
        </Marquee>
      </div>

      <Wrap>
        <a className={s.whoCta} href={WHO.cta.href}>
          <span className={s.whoCtaKick}>{WHO.cta.kicker}</span>
          <span className={s.whoCtaLabel}>
            {WHO.cta.label}
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
          </span>
        </a>
      </Wrap>
    </section>
  );
}

/**
 * Section 5. Four numbers, each with the place a reader can go and check
 * it. `source` is a required field on the type, so a stat cannot ship
 * without one, which is the whole point of the tagline.
 *
 * Deliberately not repeating the competition results from the hero strip.
 * A number the reader saw ninety seconds ago is not evidence twice.
 */
export function Stats() {
  return (
    <section id="numbers" data-ground="dark" className={s.stats}>
      <Wrap>
        <div className={s.statsRow}>
          {STATS.map((c, i) => (
            <StatCell
              key={c.label}
              index={i}
              total={STATS.length}
              label={c.label}
              value={c.value}
              caption={c.caption}
              source={c.source}
            />
          ))}
        </div>
      </Wrap>
    </section>
  );
}
