import type { NextConfig } from 'next';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// Turbopack otherwise infers the workspace root from the lockfile in the home
// directory, which breaks the React Client Manifest paths. Pin it to this file.
const root = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: { root },
};

export default nextConfig;
