import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseHero } from '@/components/case/CaseHero';
import { Footer } from '@/components/sections/Footer';
import { CASE_STUDIES, getCaseStudy } from '@/content/work';

type Params = { params: Promise<{ slug: string }> };

/** Every case study is prerendered; anything else is a 404, not a render. */
export const dynamicParams = false;

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

// Next 16: params is a promise. Awaited here and in the page, never read sync.
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const title = `${study.name}, ${study.subtitle}`;
  return {
    title,
    description: study.summary,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: { type: 'article', title, description: study.summary, url: `/work/${study.slug}` },
    twitter: { card: 'summary_large_image', title, description: study.summary },
  };
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <>
      <main>
        <CaseHero study={study} />
      </main>
      <Footer />
    </>
  );
}
