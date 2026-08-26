import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Reads the design tokens straight out of `app/tokens.css`.
 *
 * The tests could have held their own copy of the palette, which would be
 * simpler and completely worthless: a hand-mirrored table drifts from the
 * stylesheet the first time someone nudges a hex, and then the suite is
 * green while the site is broken. Parsing the real file means the thing
 * under test is the thing that ships.
 */

const TOKENS_PATH = join(process.cwd(), 'app', 'tokens.css');

export function readTokens(path: string = TOKENS_PATH): Record<string, string> {
  const css = readFileSync(path, 'utf8');
  const out: Record<string, string> = {};
  // Only the :root block. The [data-ground] blocks are aliases into it and
  // would overwrite the raw values with var() references.
  const root = css.slice(css.indexOf(':root'), css.indexOf('[data-ground'));
  for (const [, name, value] of root.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    out[name] = value.trim();
  }
  return out;
}

export type Ground = 'dark' | 'light';

/** The grounds a foreground colour can land on, worst case included. */
export function groundsFor(t: Record<string, string>, ground: Ground): Record<string, string> {
  return ground === 'dark'
    ? { void: t['--d-void'], bg: t['--d-bg'], surface: t['--d-surface'], raise: t['--d-raise'] }
    : { bg: t['--l-bg'], surface: t['--l-surface'], raise: t['--l-raise'] };
}

export function foregroundsFor(t: Record<string, string>, ground: Ground): Record<string, string> {
  const p = ground === 'dark' ? 'd' : 'l';
  return {
    ink: t[`--${p}-ink`],
    body: t[`--${p}-body`],
    label: t[`--${p}-label`],
    accent: t[`--${p}-accent`],
  };
}
