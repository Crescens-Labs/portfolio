import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The styleguide is a build tool, not a destination.
        disallow: ['/styleguide'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
