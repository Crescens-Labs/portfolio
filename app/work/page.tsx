import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/sections/Footer';
import { CASE_STUDIES } from '@/content/work';
import s from '@/components/case/index.module.css';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Five systems, shipped or in build. Each case study publishes the problem, what it actually was, and the architecture we built against it.',
  alternates: { canonical: '/work' },
};

/**
 * The case study index. A ledger, not a grid of thumbnails: there are no
 * screenshots to tile, and a list of names with what each one is reads
 * as a body of work rather than a portfolio template. Each row carries
 * its monogram, which surfaces on hover as the cover the case opens on.
 */
export default function WorkIndex() {
  return (
    <>
      <main>
        <section data-ground="dark" className={`specks-host ${s.top}`}>
          <i className="specks specks-static" aria-hidden="true" />
          <div className={s.inner}>
            <Nav />
            <p className={s.eyebrow}>+ work</p>
            <h1 className={s.title}>
              <span>Work,</span> written down.
            </h1>
            <p className={s.lead}>
              Five systems, shipped or in build. Each case study publishes the problem, what it actually was,
              and the architecture we built against it.
            </p>

            <ol className={s.list}>
              {CASE_STUDIES.map((c) => (
                <li key={c.slug}>
                  <Link href={`/work/${c.slug}`} className={s.row}>
                    <span className={s.index}>{c.index}</span>
                    <span className={s.name}>{c.name}</span>
                    <span className={s.sub}>{c.subtitle}</span>
                    <span className={s.year}>{c.year}</span>
                    <span className={s.status} data-status={c.status}>
                      {c.status}
                    </span>
                    <span className={s.mono} aria-hidden="true">
                      {c.initial}
                    </span>
                    <svg className={s.arrow} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
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
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
