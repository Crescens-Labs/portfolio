import { describe, expect, it } from 'vitest';
import { CASE_STUDIES, getCaseStudy, nextCaseStudy } from '@/content/work';

/**
 * Case study invariants. The tagline makes these promises, so the content
 * has to keep them: every result is sourced, every diagram is drawable,
 * nothing uncleared is named, nothing a visitor reads carries an em dash.
 */
describe('case studies', () => {
  it('has unique, url-safe slugs', () => {
    const slugs = CASE_STUDIES.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('carries the sections the template renders', () => {
    for (const c of CASE_STUDIES) {
      expect(c.problem.trim(), `${c.slug} problem`).not.toHaveLength(0);
      expect(c.reframe.trim(), `${c.slug} reframe`).not.toHaveLength(0);
      expect(c.build.length, `${c.slug} build`).toBeGreaterThan(0);
      expect(c.architecture.columns.length, `${c.slug} diagram`).toBeGreaterThan(1);
      // Either numbers or an honest line saying why there are none yet.
      expect(c.results.length > 0 || Boolean(c.pending), `${c.slug} results`).toBe(true);
    }
  });

  it('sources every result', () => {
    for (const c of CASE_STUDIES) {
      for (const r of c.results) expect(r.source.trim(), `${c.slug}: ${r.label}`).not.toHaveLength(0);
    }
  });

  it('only links diagram nodes that exist', () => {
    for (const c of CASE_STUDIES) {
      const ids = new Set(c.architecture.columns.flatMap((col) => col.nodes.map((n) => n.id)));
      for (const [a, b] of c.architecture.edges) {
        expect(ids.has(a), `${c.slug}: edge from ${a}`).toBe(true);
        expect(ids.has(b), `${c.slug}: edge to ${b}`).toBe(true);
      }
    }
  });

  it('never names the restaurant chain, and never uses an em dash', () => {
    const text = JSON.stringify(CASE_STUDIES);
    expect(text).not.toMatch(/taliwang/i);
    expect(text).not.toContain('—');
  });

  it('resolves slugs and wraps the next link', () => {
    expect(getCaseStudy('pawtrait')?.name).toBe('Pawtrait');
    expect(getCaseStudy('nope')).toBeUndefined();
    const last = CASE_STUDIES[CASE_STUDIES.length - 1];
    expect(nextCaseStudy(last.slug).slug).toBe(CASE_STUDIES[0].slug);
  });
});
