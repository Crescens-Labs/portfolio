import { ImageResponse } from 'next/og';
import { CASE_STUDIES, getCaseStudy } from '@/content/work';

/**
 * The social card for one case study: the home card's materials, with the
 * project's monogram plate and name in place of the wordmark, so a shared
 * case link previews the case and still reads as Crescens.
 */

const FIELD = '#08120E';
const PLATE = '#0E1A15';
const ACCENT = '#F9B4D6';
const INK = '#EDF1EE';
const MUTED = '#8FA79A';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'A Crescens Labs case study';

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export default async function CaseOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCaseStudy(slug) ?? CASE_STUDIES[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          gap: 64,
          padding: '72px 84px',
          background: FIELD,
          color: INK,
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 400,
            height: 486,
            borderRadius: 6,
            border: '1px solid rgba(237,241,238,0.14)',
            background: PLATE,
            fontSize: 300,
            fontWeight: 800,
            letterSpacing: -14,
          }}
        >
          {c.initial}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
          <div style={{ display: 'flex', fontSize: 22, letterSpacing: 6, color: MUTED }}>
            CASE STUDY {c.index}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', fontSize: 88, fontWeight: 800, letterSpacing: -4, lineHeight: 0.95 }}>
              {c.name}
            </div>
            <div style={{ display: 'flex', fontSize: 32, color: MUTED, lineHeight: 1.2 }}>{c.subtitle}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', fontSize: 24, letterSpacing: 4, color: ACCENT }}>
              {c.status === 'shipped' ? 'SHIPPED' : 'IN BUILD'} · {c.year}
            </div>
            <div style={{ display: 'flex', fontSize: 22, color: MUTED }}>crescens.dev</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
