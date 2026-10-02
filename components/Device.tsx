/* eslint-disable @next/next/no-img-element */
import type { CaseStudy } from '@/content/work';
import { CASE_STUDIES } from '@/content/work';
import s from './device.module.css';

/**
 * A laptop, drawn in CSS, holding one project on its screen.
 *
 * Sized entirely in container query units, so the same component reads
 * right as a home gallery cover and as a full-width case study plate:
 * the stage is the container, and every bezel, radius and shadow scales
 * with it. The fluid px pass never touches cq units.
 *
 * The screen shows the project's real screenshot when `study.cover`
 * exists. Until then it shows a title card: the project's name, what it
 * is, its index and status, set like a keynote slide. That is a cover,
 * not a fabricated interface, so it passes the tagline; the day a real
 * capture lands in content/work.ts it replaces the card with no other
 * change.
 */
export function Device({ study, priority = false }: { study: CaseStudy; priority?: boolean }) {
  return (
    <div className={s.device} data-device aria-hidden={study.cover ? undefined : true}>
      <div className={s.lift} data-lift>
        <div className={s.lid}>
          <span className={s.notch} />
          <div className={s.screen}>
            {study.cover ? (
              <img
                className={s.shot}
                src={study.cover.src}
                alt={study.cover.alt}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
              />
            ) : (
              <TitleCard study={study} />
            )}
            <span className={s.glare} />
          </div>
        </div>
        <div className={s.base}>
          <span className={s.lip} />
        </div>
      </div>
      <span className={s.shadow} />
    </div>
  );
}

function TitleCard({ study }: { study: CaseStudy }) {
  const total = String(CASE_STUDIES.length).padStart(2, '0');
  return (
    <div className={s.card}>
      <span className={s.ghost}>{study.initial}</span>
      <div className={s.cardTop}>
        <span className={s.cardBrand}>
          <svg viewBox="0 0 24 24" focusable="false">
            {[-88, -134, 180, 134, 88].map((deg) => {
              const a = (deg * Math.PI) / 180;
              return <circle key={deg} cx={12 + Math.cos(a) * 9.4} cy={12 + Math.sin(a) * 9.4} r={2.6} />;
            })}
          </svg>
          crescens / {study.slug}
        </span>
        <span>
          {study.index} / {total}
        </span>
      </div>
      <div className={s.cardBody}>
        <b className={s.cardName}>{study.name}</b>
        <span className={s.cardSub}>{study.subtitle}</span>
      </div>
      <div className={s.cardFoot}>
        <span className={s.cardStatus} data-status={study.status}>
          {study.status}
        </span>
        <span>{study.year}</span>
        <span className={s.cardType}>{study.type}</span>
      </div>
    </div>
  );
}
