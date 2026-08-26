import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Native tsconfig path resolution, so `@/lib/...` works without a plugin.
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.spec.{ts,tsx}'],
    // Playwright owns the browser specs. Without this, `vitest run` tries
    // to execute them and fails on an import it cannot resolve.
    exclude: ['tests/e2e/**'],
    globals: true,
  },
});
