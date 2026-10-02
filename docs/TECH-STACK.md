# Tech Stack

All versions verified against npm, official docs, and GitHub releases on **2026-08-02/03**. Stable channels only, no beta, rc, canary, or next.

---

## Runtime

| Item | Version | Why |
|---|---|---|
| Node.js | **20.9.0 LTS minimum**, target **22.x LTS** | Next.js 16 dropped Node 18. 22.x is in active LTS and is the safe production target today. |
| Package manager | **pnpm 10.x** | Already installed (10.33.2). Strict node_modules catches phantom dependencies, and the content-addressed store matters once Three.js and GSAP are in the tree. |

---

## Core

| Package | Version | Notes |
|---|---|---|
| `next` | **16.2.12** | App Router. Turbopack is the default bundler in 16. |
| `react` / `react-dom` | **19.2.8** | |
| `typescript` | **7.0.2** | |
| `tailwindcss` | **4.3.3** | v4 is the current stable major. CSS-first config, no `tailwind.config.js`. |
| `@tailwindcss/postcss` | **4.3.3** | |

### Next.js 16 breaking changes that affect this build

Read these before writing a line, they will cost hours otherwise.

1. **Turbopack is default.** Any custom webpack config fails the build. Opt out with `--webpack` only if something forces it. We should not need to.
2. **Async request APIs.** `cookies()`, `headers()`, `draftMode()`, `params`, and `searchParams` are async-only. Synchronous access is fully removed. This hits the case study route: `params` in `/work/[slug]` must be awaited.
3. **`middleware.ts` is now `proxy.ts`**, and the Edge runtime is gone, Node runtime is required.
4. **`next/image` changes.** `minimumCacheTTL` now defaults to 14400s, `qualities` defaults to `[75]`, `imageSizes` no longer includes 16, and local images with query strings need `images.localPatterns.search`.
5. **GSAP specifically.** No breaking changes against GSAP 3.15. Every GSAP component needs `'use client'`. The Next 15 hydration warning with ScrollTrigger and inline style attributes is reported as resolved in 16, but if it resurfaces the fix is to set initial state in CSS rather than in a `gsap.set()` that runs before paint.

### Tailwind v4 setup

No `tailwind.config.js`. Configuration is CSS.

```js
// postcss.config.mjs
export default { plugins: { '@tailwindcss/postcss': {} } };
```

```css
/* app/globals.css */
@import 'tailwindcss';

@theme {
  --color-field:   #08110D;
  --color-accent:  #E9C5DC;
  --font-display:  'Inter Display', system-ui, sans-serif;
  --ease-house:    cubic-bezier(0.44, 0, 0.56, 1);
  /* full token set lands in DESIGN-SYSTEM.md */
}
```

Content detection is automatic in v4, there is no `content` array to maintain.

---

## Motion

You asked for LazyMotion and GSAP. Both are in, with a hard division of labour so nothing is animated twice.

| Package | Version | Owns |
|---|---|---|
| `gsap` | **3.15.0** | Everything scroll-linked |
| `motion` | **12.43.0** | Component state, enter, exit, layout |
| `lenis` | **1.3.25** | Smooth scroll normalisation |

### Division of labour

| Effect | Library | Reason |
|---|---|---|
| Word-by-word color reveal (M2) | GSAP ScrollTrigger + SplitText | Needs scrub tied to scroll position |
| Process bar growth (M5) | GSAP ScrollTrigger | Scrubbed `scaleX` |
| Stat count-up (M6) | GSAP | `snap` utility |
| Portrait desaturate (M7) | GSAP ScrollTrigger | Staggered scrub |
| Infinite marquee (M8) | GSAP | Seamless `xPercent` wrap |
| Section row fade-in (M9) | **Motion** `whileInView` | One-shot, declarative, no scrub needed |
| Menu overlay, accordion, hover, page transitions | **Motion** | State-driven, needs exit animations |
| Smooth scroll | Lenis | Feeds GSAP ticker |

Rule: **if it needs `scrub`, it is GSAP. If it needs component state or an exit animation, it is Motion.** Anything that could be plain CSS should be plain CSS.

### GSAP plugins are free

ScrollTrigger, SplitText, and ScrollSmoother are fully free for commercial use in 3.15.0 after the Webflow acquisition. No Club membership, no auth token in `.npmrc`.

We use **ScrollTrigger** and **SplitText**. We do **not** use ScrollSmoother, because Lenis already does that job and running both fights for the scroll.

### LazyMotion

Keeps Motion's bundle at roughly 6kb for the initial load instead of 34kb, with features loaded async.

```tsx
// app/providers.tsx
'use client';
import { LazyMotion, domAnimation } from 'motion/react';

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation} strict>{children}</LazyMotion>;
}
```

`strict` is deliberate: it throws if anyone imports the full `motion.*` components instead of the `m.*` ones, which is the exact mistake that silently undoes the saving.

### Lenis and GSAP must share one ticker

Two independent RAF loops is the most common cause of scroll jank in this exact stack.

```tsx
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

### Reduced motion is not optional

Every scroll effect gets a static fallback via `gsap.matchMedia()`. The full mapping is in `docs/REFERENCE-TEARDOWN.md` section 3.

---

## Three.js: recommended **out** for v1

You said we could use it. My recommendation is that we should not, and here is the honest reasoning.

The only thing the design actually needs WebGL for is **animated grain**, and grain does not need WebGL.

| Approach | Cost | Quality |
|---|---|---|
| Static SVG `feTurbulence` baked to a tiled PNG | ~8kb, zero runtime | Indistinguishable when static, which the reference's texture also is |
| Canvas 2D noise, redrawn at 12fps | ~1kb, minor CPU | Good, visibly alive |
| Three.js shader grain | **~160kb gzipped** for `three` + `@react-three/fiber` + `drei`, plus a WebGL context | Best, and nobody will be able to tell on a phone |

160kb of JavaScript and a GPU context, on a marketing site whose Lighthouse target is 95+ on mobile, to improve a texture that is 4% opacity. That trade does not pay.

**Plan:** ship v1 with a tiled grain PNG plus a CSS grain overlay. If after launch the hero specifically feels flat, add a single WebGL layer for the hero only, dynamically imported and behind `prefers-reduced-motion` and a mobile check. The versions if we get there: `three@0.185.1`, `@react-three/fiber@9.7.0`, `@react-three/drei@10.7.7`.

---

## Forms, validation, email

| Package | Version | Role |
|---|---|---|
| `react-hook-form` | **7.84.0** | Uncontrolled inputs, no re-render per keystroke |
| `zod` | **4.4.3** | One schema validating both client and Server Action |
| `resend` | **6.18.1** | Contact form delivery |

Submission runs through a Next Server Action, not an API route. Validation uses the same Zod schema on both sides. Rate limiting and a honeypot field go in before launch, because a public contact form without them will be filled with spam within a week.

---

## Testing

Versions verified **2026-08-03**.

| Package | Version | Role |
|---|---|---|
| `vitest` | **4.1.10** | Unit and integration |
| `@vitest/coverage-v8` | **4.1.10** | Coverage |
| `vite` | **8.2.0** | Vitest peer |
| `@vitejs/plugin-react` | **6.0.5** | JSX transform for tests |
| `vite-tsconfig-paths` | latest | Path alias resolution |
| `happy-dom` | **20.11.1** | DOM environment |
| `@testing-library/react` | **16.3.2** | Component queries |
| `@testing-library/jest-dom` | **7.0.0** | DOM matchers |
| `@testing-library/user-event` | **14.6.1** | Interaction |
| `@playwright/test` | **1.62.0** | End to end and visual |
| `@axe-core/playwright` | **4.12.1** | Accessibility assertions |
| `@lhci/cli` | **0.15.1** | Lighthouse budgets in CI |
| `size-limit` + `@size-limit/preset-app` | **12.1.0** | Bundle budget |

### Setup notes

- **`next/jest` is not the path.** Next 16 has an official Vitest guide and Vitest is configured standalone through `vitest.config.ts`, not through a Next adapter. Vitest handles ESM natively so the Jest shim is unnecessary.
- **`happy-dom` over `jsdom`.** Roughly 2 to 4x faster, and our unit tests do not touch exotic browser APIs. If a specific test needs an API happy-dom lacks, `jsdom@30.0.1` can be set per-file with a `// @vitest-environment jsdom` docblock rather than switching globally.
- **TypeScript 7 is fine.** No known Vitest incompatibility. The one caveat is that TS 7 does not ship a public compiler API, so any tool depending on it needs the `tsc6` compatibility package. Vitest does not.

### What we actually test, and why

A marketing site does not need 80% component coverage, and chasing it is ceremony. The tests that earn their place here are **content invariants**, because the content is typed data and the rules are objective.

| Suite | Asserts | Why it matters |
|---|---|---|
| `content.spec.ts` | No em-dash appears in any string in `content/` | It is a hard project rule and it is invisible in review |
| `content.spec.ts` | Every project has `problem`, `reframe`, `results` | A case study missing the reframe loses the positioning |
| `content.spec.ts` | Naming flags are respected, no client name leaks when the flag is `false` | A permissions breach shipped to production |
| `tokens.spec.ts` | Every ink-on-field pair computes to at least 4.5:1 | Catches a token edit that quietly breaks contrast |
| `tokens.spec.ts` | Accent appears at most N times per section definition | Enforces the one-accent budget mechanically |
| `schema.spec.ts` | Contact Zod schema accepts valid and rejects invalid payloads | The only real input on the site |
| `jsonld.spec.ts` | Generated JSON-LD parses and carries required fields | Broken structured data fails silently |
| `a11y.spec.ts` (Playwright) | Axe reports zero violations on `/` and one case study | |
| `motion.spec.ts` (Playwright) | Under `prefers-reduced-motion`, all content is visible and no element sits at opacity 0 | The single most likely animation bug, and it makes the site unreadable |

That last one is the highest-value test in the suite. A reduced-motion fallback that leaves elements at `opacity: 0` produces a blank page for the users who need it most, and no visual review will catch it.

### GSAP and Playwright

Asserting scroll-linked animation *progress* has no documented reliable approach, so do not try. Test the outcomes instead:

- Scroll to a position, then assert the **final state** with `toHaveScreenshot({ animations: 'disabled' })`
- Assert that a scrubbed element's computed transform is not its initial value after scrolling past its trigger
- Use Playwright's Clock API to make JS-driven timing deterministic

## Analytics and monitoring

| Package | Version | Role |
|---|---|---|
| `@vercel/analytics` | **2.0.1** | Page and event analytics, cookieless |
| `@vercel/speed-insights` | **2.0.0** | Real-user Core Web Vitals |
| `@next/bundle-analyzer` | **16.2.12** | Bundle budget enforcement |

Cookieless analytics means **no cookie banner**, which removes an entire piece of UI and a conversion tax. Worth protecting: do not add anything that needs consent without a hard reason.

---

## Tooling

| Package | Version |
|---|---|
| `eslint` | **10.8.0** |
| `prettier` | **3.9.6** |
| `eslint-config-next` | 16.2.12 |

---

## Content

No CMS. Content lives in typed TypeScript modules under `content/`, matching the schema in `docs/CONTENT-MODEL.md`.

A two-person studio with five projects does not need Sanity or Contentful. Typed content objects give you autocomplete, compile-time errors on a missing field, zero runtime cost, full static generation, and content in git next to the code. If the blog grows past roughly fifteen posts, MDX via `next-mdx-remote` is the upgrade path, and it does not require restructuring anything.

---

## Rendering strategy

| Route | Strategy |
|---|---|
| `/` | Static |
| `/work/[slug]` | Static, `generateStaticParams` |
| `/work` | Static |
| Contact submission | Server Action, dynamic |

Everything is statically generated. No database, no ISR, no revalidation logic.

---

## SEO and AI discoverability

| Item | Implementation |
|---|---|
| Metadata | Next `Metadata` API per route |
| Open Graph | `opengraph-image.tsx`, generated at build |
| Structured data | JSON-LD: `Organization`, `ProfessionalService`, `FAQPage`, `BreadcrumbList`, one `CreativeWork` per case study |
| Sitemap | `app/sitemap.ts` |
| Robots | `app/robots.ts` |
| `llms.txt` | `public/llms.txt`, per the `ai-seo` skill |

`llms.txt` matters more than usual here. When someone asks an AI assistant for a development studio in Indonesia that does end-to-end delivery, you want the model to have a clean, structured summary of what Crescens does and what it has shipped. That file is the cheapest high-leverage asset on the site.

---

## Performance budget

Enforced, not aspirational. CI fails if a budget is exceeded.

| Metric | Budget |
|---|---|
| Lighthouse Performance, mobile | **>= 95** |
| LCP | < 2.0s |
| CLS | < 0.05 |
| INP | < 200ms |
| Initial JS, home route | **< 180kb gzipped** |
| Total page weight, home | < 1.4MB |

**Where the JS budget goes.** React and Next runtime ~90kb, GSAP core plus ScrollTrigger plus SplitText ~45kb, Motion via LazyMotion ~6kb initial, Lenis ~3kb, app code ~30kb. That lands near 174kb, which is why Three.js at 160kb was never going to fit.

**How the budget is protected:**
- GSAP is imported per-plugin, never `import gsap from 'gsap/all'`
- Every below-fold animated section is `next/dynamic` with `ssr: false`
- `thinking-orbs` and any Canvas UI or Vengeance UI component is copied in as source and tree-shaken, never installed as a whole library
- Fonts self-hosted via `next/font/local`, `woff2` only, subset to Latin, `display: swap`
- All imagery is AVIF with WebP fallback through `next/image`

---

## Component libraries

Canvas UI, Vengeance UI, and thinking-orbs are **source references, not dependencies**. Copy the component in, strip what we do not use, restyle to our tokens, own the file.

Reasons: none of the three is a peer-reviewed design system with a stability guarantee, all three ship Tailwind classes that will fight our token layer, and a marketing site should not carry a component library's full surface area to use four of its parts.

Sources are in `.claude/skill-sources/`:

| Library | Path | Use for |
|---|---|---|
| Canvas UI | `canvas-ui/src/components`, registry at `src/lib/registry.ts` | Scroll and text effects |
| Vengeance UI | `VengeanceUI/src/components`, registry at `src/registry` | Card and layout primitives |
| thinking-orbs | `thinking-orbs/src/ThinkingOrb.tsx` | Dot-cluster animation for the bento, echoes the logo |

---

## Project structure

```
app/
  layout.tsx
  page.tsx
  work/
    page.tsx
    [slug]/page.tsx
  sitemap.ts
  robots.ts
  opengraph-image.tsx
  globals.css
components/
  sections/          one file per section in CONTENT-MODEL.md
  ui/                button, field, card, marquee, accordion
  motion/            reusable animation primitives
lib/
  gsap.ts            plugin registration, one place
  lenis.ts
  schema.ts          zod
  jsonld.ts
content/
  global.ts
  home.ts
  projects/
    simplybox.ts
    royalecard.ts
    snapose.ts
    franchise.ts
    kost.ts
  faq.ts
public/
  fonts/  grain/  llms.txt
```

---

## Fonts

The reference uses Inter Display, Intel One Mono, and Syne. Two of those need substitution.

| Role | Font | Licence | Source |
|---|---|---|---|
| Display | **Inter** with `opsz` variable axis | OFL, free | rsms.me/inter |
| Mono | **JetBrains Mono** | OFL, free | jetbrains.com/lp/mono |
| Wordmark | Inter, tightened | OFL | same file |

Inter's variable `opsz` axis reproduces what "Inter Display" was, it is the same superfamily with optical sizing built in, so there is nothing to license.

Intel One Mono is licensed but JetBrains Mono is a cleaner match for an engineering studio and is unambiguously free.

Syne is only used for the reference's wordmark. Crescens has an actual logo, so the slot does not exist.

**Two families, self-hosted, subset.** Roughly 95kb total.

---

## Deployment

Vercel. Static output, edge CDN, automatic AVIF, and the analytics packages are first-party there. Preview deployments per branch give you a shareable URL for review, which matters when the client is your own founder.

---

## Decisions deliberately not taken

| Not using | Why |
|---|---|
| A CMS | Five projects and two people. Typed content files are faster and freer. |
| Three.js in v1 | 160kb for a 4% opacity texture. Revisit after launch, hero only. |
| ScrollSmoother | Lenis already owns smooth scroll. Two smoothers fight. |
| A component library as a dependency | Copy the parts, own the code, keep the bundle. |
| Framer Motion's full bundle | LazyMotion with `strict`, 6kb instead of 34kb. |
| Cookie-based analytics | Cookieless means no banner, and no banner means no conversion tax. |
| **anime.js** | It does nothing GSAP does not already do here. A third animation runtime inside a 180kb budget is a pure cost. GSAP owns scroll-linked, Motion owns state and exit, CSS owns the rest. There is no gap left for it to fill. |
| `next/jest` | Next 16 documents Vitest standalone. The adapter is unnecessary overhead. |
| High component-test coverage | Content invariants and reduced-motion checks catch the bugs that would actually ship here. Coverage percentage on presentational components is ceremony. |
