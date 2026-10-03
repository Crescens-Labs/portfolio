import type { NextConfig } from 'next';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// Turbopack otherwise infers the workspace root from the lockfile in the home
// directory, which breaks the React Client Manifest paths. Pin it to this file.
const root = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: { root },
  // The case study index became a section of home: one place to browse
  // the work, so a case study's back link and an old /work link both
  // land on the same gallery.
  async redirects() {
    return [{ source: '/work', destination: '/#work', permanent: false }];
  },
};

export default nextConfig;
