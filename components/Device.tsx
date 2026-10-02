/* eslint-disable @next/next/no-img-element */
import type { CaseStudy } from '@/content/work';
import { CASE_STUDIES } from '@/content/work';
import s from './device.module.css';

/**
 * A laptop, drawn in CSS, holding one project on its screen.
 *
 * Sized in percentages and aspect ratios of whatever stage holds it, so
 * the same component reads right as a home gallery cover and as a case
 * study plate. The title card is an SVG, so its type scales with the
 * glass for free. No container queries: see device.module.css.
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

/** Inter 800 at -0.05em runs about 0.58 of its size per glyph. */
const nameSize = (name: string) => Math.min(168, Math.floor(1408 / (name.length * 0.58)));

function TitleCard({ study }: { study: CaseStudy }) {
  const total = String(CASE_STUDIES.length).padStart(2, '0');
  // JetBrains Mono is 0.6em wide plus the 0.04em tracking.
  const pillW = Math.round(study.status.length * 20.5 + 52);
  return (
    <svg className={s.card} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" focusable="false">
      <text className={s.ghost} x="1640" y="1030" fontSize="992" textAnchor="end">
        {study.initial}
      </text>
      <g className={s.cardMark}>
        {[-88, -134, 180, 134, 88].map((deg) => {
          const a = (deg * Math.PI) / 180;
          return <circle key={deg} cx={120 + Math.cos(a) * 18.8} cy={100 + Math.sin(a) * 18.8} r={5.2} />;
        })}
      </g>
      <text className={s.cardMono} x="166" y="111" fontSize="32">
        crescens / {study.slug}
      </text>
      <text className={s.cardMono} x="1504" y="111" fontSize="32" textAnchor="end">
        {study.index} / {total}
      </text>
      <text className={s.cardName} x="96" y="540" fontSize={nameSize(study.name)}>
        {study.name}
      </text>
      <text className={s.cardSub} x="98" y="624" fontSize="48">
        {study.subtitle}
      </text>
      <rect className={s.pill} data-status={study.status} x="96" y="868" width={pillW} height="64" rx="32" />
      <text className={`${s.cardMono} ${s.pillText}`} data-status={study.status} x={96 + pillW / 2} y="911" fontSize="32" textAnchor="middle">
        {study.status}
      </text>
      <text className={s.cardMono} x={96 + pillW + 48} y="911" fontSize="32">
        {study.year}
      </text>
      <text className={s.cardMono} x="1504" y="911" fontSize="32" textAnchor="end">
        {study.type}
      </text>
    </svg>
  );
}
