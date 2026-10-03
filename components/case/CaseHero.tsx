import Link from 'next/link';
import { Device } from '@/components/Device';
import { Nav } from '@/components/Nav';
import { CASE_STUDIES, type CaseStudy } from '@/content/work';
import s from './case.module.css';

/**
 * The case study opening, after the content model's template:
 *
 *   back to work                                      01 / 05
 *   Name, at poster scale
 *   subtitle                              year / type / role / status
 *   [ the plate, full width ]
 *
 * The plate is the same monogram language as the home gallery covers, at
 * banner proportions, so the page reads as the next frame of the cover the
 * visitor just clicked. No screenshot exists and none is faked.
 */
export function CaseHero({ study }: { study: CaseStudy }) {
  const total = String(CASE_STUDIES.length).padStart(2, '0');
  const facts = [
    { k: 'year', v: study.year },
    { k: 'type', v: study.type },
    { k: 'role', v: study.role },
    { k: 'status', v: study.status },
  ];

  return (
    <section data-ground="dark" className={`specks-host ${s.top}`} id="top">
      <i className="specks specks-static" aria-hidden="true" />
      <div className={s.topField} aria-hidden="true" />
      <div className={s.topInner}>
        <Nav />

        <div className={s.crumbs}>
          <Link href={`/#work-${study.slug}`} className={s.back}>
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path
                d="M14 8H3M7 4 3 8l4 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to work
          </Link>
          <span className={s.count}>
            <b>{study.index}</b> / {total}
          </span>
        </div>

        <p className={s.eyebrow}>+ case study</p>
        <h1 className={s.name}>{study.name}</h1>

        <div className={s.intro}>
          <p className={s.subtitle}>{study.subtitle}</p>
          <dl className={s.facts}>
            {facts.map((f) => (
              <div key={f.k} data-k={f.k}>
                <dt>{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The gallery cover's studio shot at banner proportions, so
            the case opens on the frame the visitor just clicked. */}
        <figure className={s.plate}>
          <span className={s.plateIndex}>{study.index}</span>
          <span className={s.plateStatus} data-status={study.status}>
            {study.status}
          </span>
          <Device study={study} priority />
        </figure>

        <p className={s.summary}>{study.summary}</p>
      </div>
    </section>
  );
}
