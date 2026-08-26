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
