import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const budget = 180 * 1024;
const manifestPath = '.next/server/app/page_client-reference-manifest.js';
const source = await readFile(manifestPath, 'utf8');
const marker = '["/page"] = ';
const start = source.indexOf(marker);
const payload = start === -1 ? null : source.slice(start + marker.length).trim().replace(/;$/, '');

if (!payload) throw new Error(`Cannot parse ${manifestPath}`);

const manifest = JSON.parse(payload);
const chunks = new Set(manifest.entryJSFiles['[project]/app/page'] ?? []);
let total = 0;

for (const chunk of chunks) {
  const body = await readFile(join('.next', chunk));
  total += gzipSync(body).byteLength;
}

console.log(`Home initial JavaScript: ${(total / 1024).toFixed(1)} KiB gzip`);
if (total > budget) {
  throw new Error(`Home initial JavaScript exceeds the ${budget / 1024} KiB gzip budget.`);
}
