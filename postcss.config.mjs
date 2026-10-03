import { fileURLToPath } from 'node:url';

// Absolute, because Turbopack resolves plugin names from its own working
// directory rather than from this file. See lib/postcss-fluid.cjs.
const fluid = fileURLToPath(new URL('./lib/postcss-fluid.cjs', import.meta.url));

const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    // After Tailwind, so the imported token and module sheets are already
    // inlined when the px rewrite runs.
    [fluid]: {},
  },
};

export default config;
