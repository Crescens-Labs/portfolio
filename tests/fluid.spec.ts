import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { fluidValue } = require('../lib/postcss-fluid.cjs') as { fluidValue: (v: string) => string };

/**
 * The fluid px pass is what makes a 1920 screen at 100% show the design
 * it was composed at (1536, i.e. 125%). The failures worth guarding are
 * the silent ones: a hairline turning into a blurry 1.25px line, a url
 * path rewritten, or the unit itself losing its 1px floor.
 */
describe('fluid px', () => {
  it('rewrites authored px into the fluid unit', () => {
    expect(fluidValue('12px')).toBe('calc(12 * var(--px))');
    expect(fluidValue('clamp(34px, 5.6vw, 84px)')).toBe(
      'clamp(calc(34 * var(--px)), 5.6vw, calc(84 * var(--px)))',
    );
    expect(fluidValue('0 -18px 42px rgb(0 0 0 / 0.18)')).toBe(
      '0 calc(-18 * var(--px)) calc(42 * var(--px)) rgb(0 0 0 / 0.18)',
    );
    expect(fluidValue('13.5px')).toBe('calc(13.5 * var(--px))');
  });

  it('leaves hairlines, unitless and non-px values alone', () => {
    expect(fluidValue('1px solid rgb(var(--line-rgb) / 0.1)')).toBe('1px solid rgb(var(--line-rgb) / 0.1)');
    expect(fluidValue('0.5px')).toBe('0.5px');
    expect(fluidValue('5.6vw')).toBe('5.6vw');
    expect(fluidValue('1.4')).toBe('1.4');
  });

  it('never rewrites inside url()', () => {
    expect(fluidValue("url('/a-12px.png') 4px")).toBe("url('/a-12px.png') calc(4 * var(--px))");
  });

  it('defines the unit with a 1px floor at the 1536 reference', () => {
    const tokens = readFileSync('app/tokens.css', 'utf8');
    expect(tokens).toMatch(/--px:\s*clamp\(1px,\s*calc\(100vw \/ 1536\),\s*1\.5px\)/);
  });
});
