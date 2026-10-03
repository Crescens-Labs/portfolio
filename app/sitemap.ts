import type { MetadataRoute } from 'next';
import { CASE_STUDIES } from '@/content/work';
import { SITE_URL } from '@/lib/seo';

/** Home and every case study. The work index is a section of home. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    ...CASE_STUDIES.map((c) => ({
      url: `${SITE_URL}/work/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
