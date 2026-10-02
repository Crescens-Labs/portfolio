/**
 * Regenerates public/grain-speck.png, the logo-speck texture the specks
 * layer tiles across dark sections.
 *
 * The previous tile was a 2x2 checkerboard: two quadrants carried every
 * speck and two were empty, so tiled across a section it drew a visible
 * 128px grid, and the drift animation made that grid jump. This writes a
 * uniform field instead. Every pixel draws independently from one seeded
 * generator, so there is no structure inside the tile, and the edges join
 * because nothing in the noise depends on position.
 *
 * Density and alpha match the old tile's average: about 5.7% of pixels lit,
 * mean alpha near 40 out of 255, a long tail of bright flecks. Same weather,
 * no grid.
 *
 *   node scripts/make-speck-tile.mjs   (needs ffmpeg on PATH)
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SIZE = 256;
const DENSITY = 0.057;
const SEED = 0xc0ffee;

// mulberry32: tiny, seeded, good enough for texture. Deterministic so the
// committed PNG can be reproduced byte for byte.
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = rng(SEED);
const px = Buffer.alloc(SIZE * SIZE * 4);
for (let i = 0; i < SIZE * SIZE; i++) {
  const o = i * 4;
  px[o] = px[o + 1] = px[o + 2] = 255;
  // u^5 skews hard toward faint, leaving a sparse bright tail: mean ~43.
  px[o + 3] = rand() < DENSITY ? 1 + Math.round(254 * rand() ** 5) : 0;
}

const raw = join(mkdtempSync(join(tmpdir(), 'speck-')), 'tile.rgba');
writeFileSync(raw, px);
execFileSync('ffmpeg', [
  '-v', 'error', '-y',
  '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${SIZE}x${SIZE}`, '-i', raw,
  '-frames:v', '1', 'public/grain-speck.png',
]);
console.log('wrote public/grain-speck.png');
