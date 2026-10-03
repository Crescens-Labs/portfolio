import { CONTACT, FAQ, SOCIALS, TAGLINE, TEAM } from '@/content/home';
import type { CaseStudy } from '@/content/work';

/**
 * Structured data, built from the same content the page renders so the
 * two can never disagree. Pure functions: the test suite parses every
 * object these return, so a schema regression fails the gate rather than
 * a validator weeks later.
 *
 * Breadcrumb markup with one entry is noise a crawler ignores.
 */

export const SITE_URL = 'https://crescens.dev';

const LOGO_URL = `${SITE_URL}/logo.png`;

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Crescens Labs',
    url: SITE_URL,
    email: CONTACT.email,
    logo: LOGO_URL,
    description:
      'End to end software studio. We structure the problem, architect the solution, build it with you, then train your team and hand it over.',
    founder: TEAM.members.map((m) => ({
      '@type': 'Person',
      name: m.name,
      jobTitle: m.role,
    })),
    sameAs: SOCIALS.map((s) => s.href),
  };
}

export function professionalServiceLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#service`,
    name: 'Crescens Labs',
    url: SITE_URL,
    email: CONTACT.email,
    image: LOGO_URL,
    priceRange: '$$',
    areaServed: 'Remote, Indonesia and worldwide',
    knowsAbout: [
      'Custom web apps',
      'Mobile apps',
      'Internal systems',
      'AI integration',
      'RAG',
      'Offline first architecture',
      'Consulting and handover',
    ],
    slogan: TAGLINE.text,
    parentOrganization: { '@id': `${SITE_URL}/#organization` },
  };
}

export function webSiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Crescens Labs',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

export function faqLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    mainEntity: FAQ.groups.flatMap((g) =>
      g.items.map((it) => ({
        '@type': 'Question',
        name: it.q,
        acceptedAnswer: { '@type': 'Answer', text: it.a },
      })),
    ),
  };
}

/** The full block the home page renders, in order. */
export function homeJsonLd() {
  return [organizationLd(), professionalServiceLd(), webSiteLd(), faqLd()];
}

/**
 * A case study page: the work itself as a CreativeWork made by the studio,
 * and the breadcrumb home > work > study. Built from the same record the
 * page renders, like everything else in this file.
 */
export function caseStudyJsonLd(study: CaseStudy) {
  const url = `${SITE_URL}/work/${study.slug}`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      '@id': `${url}#work`,
      name: study.name,
      headline: `${study.name}, ${study.subtitle}`,
      description: study.summary,
      url,
      dateCreated: study.year,
      creator: { '@id': `${SITE_URL}/#organization` },
      about: study.subtitle,
      creativeWorkStatus: study.status === 'shipped' ? 'Published' : 'Incomplete',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Work', item: `${SITE_URL}/#work` },
        { '@type': 'ListItem', position: 3, name: study.name, item: url },
      ],
    },
  ];
}
