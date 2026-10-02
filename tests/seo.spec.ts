import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { FAQ, SOCIALS, TEAM } from '@/content/home';
import { CASE_STUDIES } from '@/content/work';
import { caseStudyJsonLd, faqLd, homeJsonLd, organizationLd, SITE_URL } from '@/lib/seo';
import sitemap from '@/app/sitemap';
import robots from '@/app/robots';

/**
 * JSON-LD builders are pure, so schema shape is asserted directly instead of
 * through a third-party validator. The markup follows the same claim-source
 * discipline as page content.
 */

describe('structured data', () => {
  const block = homeJsonLd();

  it('renders four parseable objects with contexts', () => {
    for (const ld of block) {
      expect(() => JSON.parse(JSON.stringify(ld))).not.toThrow();
      expect(ld['@context']).toBe('https://schema.org');
    }
    expect(block.map((ld) => ld['@type'])).toEqual([
      'Organization',
      'ProfessionalService',
      'WebSite',
      'FAQPage',
    ]);
  });

  it('the Organization tracks the team and the socials it vouches for', () => {
    const org = organizationLd();
    expect(org.founder).toHaveLength(TEAM.members.length);
    expect(org.sameAs).toEqual(SOCIALS.map((s) => s.href));
    expect(org.url).toBe(SITE_URL);
  });

  it('the FAQPage entity matches the rendered FAQ item for item', () => {
    const faq = faqLd();
    const rendered = FAQ.groups.reduce((n, g) => n + g.items.length, 0);
    expect(faq.mainEntity).toHaveLength(rendered);
    const first = FAQ.groups[0].items[0];
    expect(faq.mainEntity[0].name).toBe(first.q);
    expect(faq.mainEntity[0].acceptedAnswer.text).toBe(first.a);
  });

  it('carries no em-dashes, the tagline applies to markup too', () => {
    const flat = JSON.stringify(block);
    expect(flat.includes('\u2014')).toBe(false);
    expect(flat.includes('\u2013')).toBe(false);
  });
});

describe('crawl surface', () => {
  it('lists home, the work index and every case study', () => {
    const urls = sitemap().map((e) => new URL(e.url).pathname);
    expect(urls).toEqual(['/', '/work', ...CASE_STUDIES.map((c) => `/work/${c.slug}`)]);
  });

  it('gives every case study a CreativeWork and a three-step breadcrumb', () => {
    for (const c of CASE_STUDIES) {
      const [work, crumbs] = caseStudyJsonLd(c);
      expect(work['@type']).toBe('CreativeWork');
      expect(work.url).toBe(`${SITE_URL}/work/${c.slug}`);
      expect(crumbs.itemListElement).toHaveLength(3);
      expect(JSON.stringify([work, crumbs])).not.toContain('\u2014');
    }
  });

  it('robots allows the site, fences the styleguide, points at the sitemap', () => {
    const r = robots();
    expect(r.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
    const rules = r.rules as Array<{ userAgent?: string | string[]; allow?: string | string[]; disallow?: string | string[] }>;
    const all = rules.find((rule) => rule.userAgent === '*');
    expect(all?.allow).toContain('/');
    expect(all?.disallow).toContain('/styleguide');
  });

  it('llms.txt exists, opens with the studio name, and links the site', () => {
    const txt = readFileSync(join(process.cwd(), 'public', 'llms.txt'), 'utf8');
    expect(txt.startsWith('# Crescens Labs')).toBe(true);
    expect(txt).toContain(SITE_URL);
    expect(txt).toContain('hi@crescens.dev');
    expect(txt.includes('\u2014')).toBe(false);
  });
});
