/**
 * Fluid px, a build-time PostCSS pass.
 *
 * The page was designed at a 1536px wide viewport (a 1920 screen at 125%
 * OS scaling). Every size in the stylesheets caps there: `--max` holds the
 * content at 1512px and each `clamp()` reaches its ceiling near 1500. On
 * the same screen at 100% the browser is 1920 wide, the caps hold, and the
 * composition shrinks into a column with ~250px of dead field each side.
 *
 * This rewrites every authored `Npx` as `calc(N * var(--px))`. `--px` is
 * defined in tokens.css as exactly 1px up to 1536 and grows with the
 * viewport after it, so:
 *
 *   - at or below 1536 nothing changes, the design is pixel identical;
 *   - at 1920 everything is 1.25x, i.e. 1920@100% renders as 1536@125%;
 *   - the source stays readable in plain px, authored at the reference.
 *
 * Left alone on purpose:
 *   - |N| <= 1, so hairlines stay one device pixel and crisp;
 *   - media and container query params (only declarations are touched),
 *     so breakpoints keep meaning CSS px;
 *   - anything inside url();
 *   - --grain-size: the texture is a bitmap and scaling it only blurs it.
 */

const PX = /(-?\d*\.?\d+)px\b/g;
const SKIP_PROPS = new Set(['--grain-size']);

/** Pure value transform, exported for tests. */
function fluidValue(value) {
  if (!value.includes('px')) return value;
  // Split out url(...) so a path like /x-12px.png is never rewritten.
  return value
    .split(/(url\([^)]*\))/g)
    .map((part) =>
      part.startsWith('url(')
        ? part
        : part.replace(PX, (m, n) => (Math.abs(parseFloat(n)) <= 1 ? m : `calc(${n} * var(--px))`)),
    )
    .join('');
}

function plugin() {
  return {
    postcssPlugin: 'crescens-fluid-px',
    Declaration(decl) {
      if (SKIP_PROPS.has(decl.prop)) return;
      // The definition of the unit itself must stay in real px.
      if (decl.prop === '--px') return;
      const file = decl.source && decl.source.input && decl.source.input.file;
      if (file && file.includes('node_modules')) return;
      const next = fluidValue(decl.value);
      if (next !== decl.value) decl.value = next;
    },
  };
}
plugin.postcss = true;

module.exports = plugin;
module.exports.fluidValue = fluidValue;
