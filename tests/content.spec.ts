import { describe, expect, it } from 'vitest';
import { CLAIMS, SOCIALS, STATS } from '@/content/home';

/**
 * Content invariants, the phase-7 tagline rules applied at unit level.
 *
 * The tagline is "Don't trust. Verify." The checks here are what that
 * line is for: every number carries attribution, and every local asset
 * declared by content exists on disk.
 */

describe('content', () => {
  it('every stat and claim carries a source', () => {
    for (const claim of [...STATS, ...CLAIMS]) {
      expect(claim.source.trim(), `${claim.label} shipped without attribution`).not.toHaveLength(0);
      expect(claim.value.trim(), `${claim.label} has no value`).not.toHaveLength(0);
    }
  });


  it('every social link is absolute and labelled', () => {
    expect(SOCIALS.length).toBeGreaterThan(0);
    for (const s of SOCIALS) {
      expect(s.href, `${s.label} has a relative url`).toMatch(/^https:\/\//);
      expect(s.label.trim()).not.toHaveLength(0);
    }
  });
});

describe('whatsapp', () => {
  it('stores the number in the digits-only shape wa.me expects', async () => {
    const { WHATSAPP } = await import('@/content/home');
    expect(WHATSAPP.number).toMatch(/^62\d{8,13}$/);
  });

  it('builds a deep link with the message encoded', async () => {
    const { waHref } = await import('@/lib/whatsapp');
    expect(waHref()).toBe('https://wa.me/6281510123155');
    expect(waHref('Hi, a call?')).toBe('https://wa.me/6281510123155?text=Hi%2C%20a%20call%3F');
  });
});

describe('voices', () => {
  it('every receipt carries a source and every quote an English gloss', async () => {
    const { VOICES } = await import('@/content/home');
    for (const c of VOICES.cards) {
      if (c.kind === 'receipt') expect(c.source.trim(), `${c.key} has no source`).not.toHaveLength(0);
      if (c.kind === 'quote') expect(c.gloss.trim(), `${c.key} has no gloss`).not.toHaveLength(0);
    }
  });

  it('names companies and roles, never a private person', async () => {
    const { VOICES, TEAM } = await import('@/content/home');
    const founders = TEAM.members.map((m) => m.name.split(' ')[0]);
    for (const c of VOICES.cards) {
      for (const f of founders) expect(c.name).not.toContain(f);
    }
  });
});
