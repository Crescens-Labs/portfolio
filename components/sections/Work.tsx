'use client';

import { useRef, useState } from 'react';
import { Wrap } from '@/components/layout';
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { PROJECTS } from '@/content/home';
import s from './work.module.css';

const RAIL_INTRO = `Four systems shipped or in build, two competitions entered and placed. Four briefs on show here, each pinned beside its cover.`;

/**
 * Section 11. Featured work, the centerpiece.
 *
 *   rail (sticky, whole section)  |  rows of cover + meta
 *
 * Each row is a real element that owns its cover and its meta. The meta
 * pins beside the cover while the row passes and releases when the row
 * ends, keeping the reading order aligned.
 * The rows used to be promoted through `display: contents` so cover and
 * meta could sit directly on the gallery grid; with no box of their own
 * the metas escaped their rows and every one of them pinned at once,
 * piling into the same column. A row that exists is the fix and the
 * whole motion hangs off it: covers unclip as they arrive and the rail
 * counts which row is passing. Inside the frame nothing drifts: the
 * monogram and ghost sit still, a printed plate rather than a parallax
 * toy, so the covers read as documents in a series.
 *
 * The Kost project stays dropped: four strong beats five where one is
 * speculative.
 */
export function Work() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      if (!root.current || prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      // M6, the rail edition: the systems count climbs when the rail
      // enters, the same ease and length as the stats strip. Text
      // values like "2 / 2" stay text, as the content model holds.
      const statVals = q(`.${s.railStatVal}`);
      const systems = statVals[0];
      if (systems && systems.textContent?.trim() === '4') {
        const counter = { n: 0 };
        gsap.fromTo(
          counter,
          { n: 0 },
          {
            n: 4,
            duration: 1.1,
            ease: 'house',
            scrollTrigger: { trigger: systems, start: 'top 92%', once: true },
            onUpdate: () => {
              systems.textContent = String(Math.round(counter.n));
            },
          },
        );
      }

      // The rail's live counter. One trigger reading row positions on
      // update, not a trigger per row: a fast scroll jumps whole rows in
      // a single frame and enter/leave pairs settle on the wrong answer.
      const rows = q(`.${s.project}`);
      const stack = root.current.querySelector(`.${s.stack}`);
      if (stack) {
        ScrollTrigger.create({
          trigger: stack as Element,
          start: 'top 60%',
          end: 'bottom 40%',
          onUpdate: () => {
            let next = 0;
            rows.forEach((row, i) => {
              if (row.getBoundingClientRect().top < window.innerHeight * 0.55) next = i;
            });
            setActive(next);
          },
        });
      }

      rows.forEach((row) => {
        // Scoped to this row, so each iteration builds exactly one of
        // every trigger below instead of one per existing row.
        const rq = gsap.utils.selector(row);

        // The cover arrives as an unclipping frame, once. Props are
        // cleared at the end so the hover transition owns the element
        // again afterwards.
        gsap.from(rq(`.${s.cover}`), {
          clipPath: 'inset(9% 6% 9% 6% round 3px)',
          scale: 0.965,
          duration: 1.1,
          ease: 'house',
          clearProps: 'transform,clipPath',
          scrollTrigger: { trigger: row, start: 'top 84%', once: true },
        });

        // The meta's own blocks rise into place beside the arriving
        // cover, once, staggered top to bottom.
        gsap.from(rq(`.${s.meta} > *`), {
          y: 14,
          opacity: 0,
          duration: 0.7,
          ease: 'house',
          stagger: 0.055,
          scrollTrigger: { trigger: row, start: 'top 72%', once: true },
        });
      });
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section id="work" data-ground="dark" className={`specks-host ${s.work}`} ref={root}>
      <i className="specks specks-live" aria-hidden="true" />
      <Wrap>
        <p className={s.eyebrow}>+ selected work</p>
        <div className={s.head}>
          <h2 className={s.title}>
            <span className={s.tLine}>The hard part was</span>
            <span className={s.tLine}>
              <span className={s.accent}>the problem</span>, not the code.
            </span>
          </h2>
          <p className={s.intro}>
            Four in flight, none from a template. The reframe mattered more than the build.
          </p>
        </div>

        <div className={s.gallery}>
          <aside className={s.rail} aria-label="Studio overview">
            <div className={s.railCard}>
              <span className={s.railKicker}>team</span>
              <p className={s.railValue}>CRESCENS</p>
              <span className={s.railKicker}>year</span>
              <p className={s.railValue}>2026</p>
            </div>
            <p className={s.railIntro}>{RAIL_INTRO}</p>
            <div className={s.railStats}>
              <div>
                <span className={s.railStatKey}>systems</span>
                <b className={s.railStatVal}>4</b>
                <em className={s.railStatNote}>shipped or in build</em>
              </div>
              <div>
                <span className={s.railStatKey}>competitions</span>
                <b className={s.railStatVal}>2 / 2</b>
                <em className={s.railStatNote}>entered and placed</em>
              </div>
            </div>

            {/* Counts which row is passing. Decorative: the same count
                exists in the document as each row's own index. */}
            <div className={s.railProgress} aria-hidden="true">
              <b className={s.railIndex}>{String(active + 1).padStart(2, '0')}</b>
              <span className={s.railTicks}>
                {PROJECTS.map((p, i) => (
                  <i key={p.slug} data-on={i === active} />
                ))}
              </span>
              <span className={s.railTotal}>{String(PROJECTS.length).padStart(2, '0')}</span>
            </div>
          </aside>

          <div className={s.stack}>
            {PROJECTS.map((p) => (
              <article key={p.slug} className={s.project} data-slug={p.slug}>
                <ProjectCover project={p} />
                <ProjectMeta project={p} />
              </article>
            ))}
          </div>
        </div>
      </Wrap>
    </section>
  );
}

function ProjectMeta({ project }: { project: (typeof PROJECTS)[number] }) {
  return (
    <div className={s.meta}>
      <span className={s.metaIndex} aria-hidden="true">
        {project.index}
      </span>
      <div className={s.metaTitle}>
        <h3 className={s.projectName}>{project.name}</h3>
        <p className={s.projectSub}>{project.subtitle}</p>
      </div>
      <div className={s.metaFacts}>
        <div>
          <span>year</span>
          <b>{project.year}</b>
        </div>
        <div>
          <span>type</span>
          <b>{project.type}</b>
        </div>
        <div>
          <span>status</span>
          <b>{project.status}</b>
        </div>
      </div>
      <p className={s.metaSummary}>{project.summary}</p>
      <a className={s.metaCta} href={`#${project.slug}`}>
        <span>View case study</span>
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
      </a>
    </div>
  );
}

/**
 * Each cover is an oversized initial inside a bordered frame, the
 * dot-cluster mark behind it as a low-contrast ghost, the accent index in
 * the top corner. On hover the monogram lifts and the ghost sharpens,
 * so the cover reads as a surface with depth rather than a flat stamp.
 */
function ProjectCover({ project }: { project: (typeof PROJECTS)[number] }) {
  return (
    <div className={s.cover}>
      <svg className={s.coverMark} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        {[-88, -134, 180, 134, 88].map((deg) => {
          const a = (deg * Math.PI) / 180;
          return (
            <circle
              key={deg}
              cx={12 + Math.cos(a) * 9.4}
              cy={12 + Math.sin(a) * 9.4}
              r={2.6}
              fill="currentColor"
            />
          );
        })}
      </svg>

      <span className={s.coverIndex}>{project.index}</span>

      <span className={s.coverMonogram} aria-hidden="true">
        {project.initial}
      </span>

    </div>
  );
}
