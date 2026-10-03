import type { ReactNode } from 'react';
import { RevealText } from '@/components/RevealText';
import type { CaseStudy } from '@/content/work';
import { Diagram } from './Diagram';
import s from './case.module.css';

/**
 * One chapter of a case study: a sticky mono label in the first column of
 * the grid, the content across the other three. The label stays beside
 * its chapter while it scrolls, the home page's M3 rail at chapter scale.
 */
export function Chapter({
  n,
  label,
  ground = 'dark',
  id,
  children,
}: {
  n: string;
  label: string;
  ground?: 'dark' | 'light' | 'void';
  id?: string;
  children: ReactNode;
}) {
  return (
    <section data-ground={ground} className={s.chapter} id={id}>
      <div className={s.chapterInner}>
        <p className={s.label}>
          <span>{n}</span>+ {label}
        </p>
        <div className={s.chapterBody}>{children}</div>
      </div>
    </section>
  );
}

/**
 * Problem, reframe, build. The reframe gets the cream ground on purpose:
 * it is the step other studios' case studies do not have, the place the
 * stated brief turns out to be the wrong problem, so it is the one band
 * on the page that changes the light.
 */
export function CaseStory({ study }: { study: CaseStudy }) {
  return (
    <>
      <Chapter n="01" label="the problem" id="problem">
        <p className={s.kicker}>What they came in with</p>
        <RevealText as="p" distance={0.8} text={study.problem} />
      </Chapter>

      <Chapter n="02" label="what we found" ground="light" id="reframe">
        <p className={s.kicker}>What it actually was</p>
        <RevealText as="blockquote" distance={0.8} text={study.reframe} />
      </Chapter>

      <Chapter n="03" label="the build" id="build">
        <ol className={s.build}>
          {study.build.map((b, i) => (
            <li key={b.title}>
              <span className={s.buildIndex}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className={s.buildTitle}>{b.title}</h3>
              <p className={s.buildBody}>{b.body}</p>
            </li>
          ))}
        </ol>
      </Chapter>

      <Chapter n="04" label="architecture" id="architecture">
        <p className={s.kicker}>Written down, so your team can extend it</p>
        <Diagram data={study.architecture} />
      </Chapter>
    </>
  );
}
