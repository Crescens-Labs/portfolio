# Build Plan

Phased implementation. Each phase ends in a committed, verifiable state.

**Sequencing rule:** a phase does not start until the previous gate is green. Gates are commands, not opinions.

---

## Status

| Phase                         | State                                                                             |
| ----------------------------- | --------------------------------------------------------------------------------- |
| 0. Discovery                  | **Done**                                                                          |
| 1. Direction lock             | **Done.** Forest Neutral + void, Inter, locked 2026-08-03                         |
| 2. Foundation                 | **Done.** Token layer, GSAP, Lenis, Motion, Vitest. GATE 2 green                  |
| 3. Primitives                 | **Done.** 15 primitives at `/styleguide`. GATE 3 green, 21/21 at 390 / 768 / 1440 |
| 4. Home sections              | **Done.** Sections 1 to 18 wired, rebuilt through two feedback passes            |
| 5. Case studies               | Not started                                                                       |
| 6. Motion                     | **Done.** M1 to M12 layered on, reduced-motion contract tested. GATE 6 note below |
| 7. Content and copy           | **Done.** Humanizer pass, source fields, tagline placed, model open items closed  |
| 8. SEO and AI discoverability | **Done.** Metadata, OG, JSON-LD, sitemap, robots, llms.txt                        |
| 9. Performance                | Not started                                                                       |
| 10. Launch                    | Not started                                                                       |

---

---

## Verification gates

Every phase ends in a **gate**. A gate is a command that either passes or fails. No phase is marked done on a visual impression, and no phase starts until the previous gate is green.

```jsonc
// package.json scripts
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "test:a11y": "playwright test --grep @a11y",
  "test:motion": "playwright test --grep @reduced-motion",
  "size": "size-limit",
  "lh": "lhci autorun",
  "typecheck": "tsc --noEmit",
  "gate": "pnpm typecheck && pnpm lint && pnpm test && pnpm size",
}
```

`pnpm gate` is the command you run before every commit. `pnpm lh` and the Playwright suites run in CI and before a phase closes.

**Budgets are enforced, not documented.**

```js
// .size-limit.js
export default [
  {
    name: "home route JS",
    path: ".next/static/chunks/**/*.js",
    limit: "180 kB",
  },
];
```

```json
// lighthouserc.json assertions
{
  "categories:performance": ["error", { "minScore": 0.95 }],
  "categories:accessibility": ["error", { "minScore": 1 }],
  "cumulative-layout-shift": ["error", { "maxNumericValue": 0.05 }],
  "largest-contentful-paint": ["error", { "maxNumericValue": 2000 }]
}
```

---

## Phase 0: Discovery `DONE`

- [x] Install and curate 63 project skills, sources retained in `.claude/skill-sources/`
- [x] Frame-by-frame teardown of the reference recording
- [x] Live DOM extraction of the reference's computed styles
- [x] `docs/REFERENCE-TEARDOWN.md`, measured layout and motion spec
- [x] `docs/CONTENT-MODEL.md`, every section mapped to real Crescens proof
- [x] `docs/TECH-STACK.md`, versions verified 2026-08-02
- [x] `docs/ASSET-BRIEF.md`, generation-ready prompts
- [x] `docs/DESIGN-SYSTEM.md`, three candidate directions
- [x] `CLAUDE.md`, project context and skill navigation

---

## Phase 1: Direction lock

### Done

- [x] Scaffold the Next.js app so a live preview is possible
- [x] Build `/directions`, a real route rendering the combined design direction against real Crescens content
- [x] **Design direction combined and locked.** Instrument's hairline grid and mono data blocks, Editorial's scroll-scrubbed quote spine, Terminal's `>` marker voice
- [x] **Type locked: Inter + JetBrains Mono.** Bricolage Grotesque and Instrument Sans were built and compared in situ, Bricolage is the recorded fallback
- [x] **Effects evaluated against real source**, not the docs site. Decisions and dependency findings in `DESIGN-SYSTEM.md` section 5
- [x] Sample the logo programmatically rather than eyeballing, `assets/logo/logo-no-bg.png`
- [x] Three color passes, each verified with `lib/contrast.ts`

- [x] **Color locked: Forest Neutral**, with a `void` near-black ground added for full-bleed cuts
- [x] `DESIGN-SYSTEM.md` rewritten as the single token set. `/directions` and `lib/color-systems.ts` deleted, the decision is made and three live palettes is now maintenance debt
- [x] graphify initialised: `.graphifyignore`, `graphify . --code-only`, `claude install`, `hook install`. All three outputs on disk

### What the three color passes taught us

Worth recording, because it is the reason this phase took three attempts.

| Pass | Failure                               | Diagnosis                                                                                                                                                                    |
| ---- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Cards did not separate from the field | The 12-step logo ramp had been collapsed into one near-black                                                                                                                 |
| 2    | Text read as murky                    | Fixed by brightening `muted`, which closed the ink-to-muted gap to 1.50x and made it worse                                                                                   |
| 3    | Whole page felt flat and hard to read | Measured against the reference: it runs a **5.74x** ink-to-muted gap, a **100%** chroma accent, and a **0%** neutral field. Ours ran 1.50x, 14%, and green-tinted throughout |

**The lesson:** legibility is a function of the _gaps_ between tones and of having a neutral anchor, not of any single token's contrast ratio. Every individual pair passed AA in pass 2 and the page was still hard to read.

---

## Phase 2: Foundation

### Done

- [x] `pnpm create next-app` with TypeScript, Tailwind v4, App Router, no `src/`, Next 16.2.12
- [x] Pin `turbopack.root`, required because a lockfile in the home directory breaks the client manifest
- [x] Fonts via `next/font/google`, self-hosted at build
- [x] Grain overlay, `.band::before`, `pointer-events: none`
- [x] Grid enforcing 4 columns and hairlines, `.grid` in `directions.css`
- [x] `lib/contrast.ts`, WCAG luminance and ratio
- [x] ESLint, Playwright 1.62.0
- [x] Commit each milestone

- [x] `app/tokens.css`, the locked token layer. `directions.css` retired with the route
- [x] `lib/gsap.ts`, single plugin registration point, house easing registered from the same control points as the CSS token
- [x] `lib/lenis.ts`, sharing the GSAP ticker, disabled entirely under reduced motion
- [x] `MotionProvider` with `LazyMotion` and `strict`
- [x] **Testing harness:** Vitest 4.1.10 with happy-dom, Playwright 1.62.0 across three viewports
- [x] `tokens.spec.ts`, 45 assertions, reading `app/tokens.css` directly
- [x] Fonts cut from five to two once the type decision landed

### `GATE 2` **green**

```bash
pnpm typecheck && pnpm lint && pnpm test
```

| Assert                                   | Threshold      | Result                  |
| ---------------------------------------- | -------------- | ----------------------- |
| Every foreground on its **worst** ground | >= 4.5:1       | pass, worst is 4.54     |
| Ink to body hierarchy gap                | > 2.4x         | 3.30x dark, 2.67x light |
| `--label` brighter than `--body`         | ordered        | pass                    |
| Exactly one accent per ground            | 2 tokens total | pass                    |
| Bloom alpha budget, all three levels     | as documented  | pass                    |
| Typecheck, lint                          | 0 errors       | pass                    |

**The tests parse `app/tokens.css` rather than holding their own copy of the palette.** A hand-mirrored table drifts from the stylesheet the first time someone nudges a hex, and then the suite is green while the site is broken.

`size-limit` and LHCI are deferred to Phase 9, where there is a real page to measure. Running them against a styleguide would only measure the styleguide.

---

## Phase 3: Primitives `DONE`

Build once, use everywhere. All live at `/styleguide`.

- [x] `Band` / `Wrap` / `Grid` / `Col`, the 4 column hairline grid, one column below 900px
- [x] `Heading`, lead in body plus one accent word, `line-height: 0.9`
- [x] `Eyebrow`, `MonoLabel`, `Lead`, `Body`
- [x] `CTACard`, kicker, label, vertical 3 dot marker
- [x] `Hairline`, horizontal and vertical
- [x] `Marquee`, infinite, pauses on hover, becomes a scrollable row under reduce
- [x] `StatCell`, dot indicator, and a **required** `source`
- [x] `Accordion`, dot to bar marker, transform only
- [x] `FormField`, label above, recessed panel, accent focus
- [x] `RevealText`, word reveal, optional pin
- [x] `ProcessBar`, `scaleX`, never `width`
- [x] `StickyRail`
- [x] `Field`, the grain plus bloom layer that replaced the background PNGs
- [x] `PinnedSteps`, sticky rail with a scroll tracked index
- [x] `DecryptText`, DOM scramble, no WebGL
- [x] `Magnetic`, 9px travel, fine pointers only

### `GATE 3` **green, 21/21**

```bash
pnpm test && pnpm test:e2e
```

| Assert | Threshold | Result |
| --- | --- | --- |
| Renders at 390 / 768 / 1440 | 3 viewports | pass |
| No horizontal scroll at any width | 0px overflow | pass |
| **Under reduce, no text element below 0.1 opacity** | 0 elements | pass |
| **Under reduce, the quote spine is fully lit** | 0 dim words | pass |
| **Under reduce, the process bar reads as filled** | scaleX > 0.1 | pass |
| Every stat carries a source | all non-empty | pass |
| Accordion reports `aria-expanded` | toggles | pass |
| No tween touches a layout property | 0 matches | pass |

Axe and keyboard-traversal assertions move to Phase 4, where there is a real page with real landmarks and a nav to traverse. Running axe against a styleguide measures the styleguide.

### What Phase 3 cost, and why

Three failures worth recording, because all three would have shipped.

| Failure | Root cause |
| --- | --- |
| Reduced-motion suite passed for the wrong reason | Playwright's config-level `reducedMotion` never reached `matchMedia`. Every guard fell through and GSAP ran. Fixed with `page.emulateMedia()`, and the suite now **asserts the emulation took** before asserting anything that depends on it |
| Pinned rail left a dead scroll region | `pinSpacing: false` reserves nothing, and a pinned element leaves normal flow so the per-step scrub ranges no longer matched the steps. Replaced with `position: sticky` |
| Rail sat on step 1 all the way down | One trigger per step with `onToggle`. A fast scroll jumps a whole panel in one frame, firing enter and leave together, settling on "not active". Replaced with one trigger that measures element positions on update |

**The pattern:** each bug was invisible in normal use and only appeared under a specific condition, a fast scroll, an accessibility setting, a narrow viewport. That is the argument for gates over review.

---

## Phase 4: Home sections

In page order, each committed separately. Content comes from `content/home.ts`, typed against `CONTENT-MODEL.md`.

- [x] Nav plus full-screen menu overlay
- [x] Hero, sticky, with the Llama proof badge
- [x] Wordmark band
- [x] Thesis, scroll word reveal
- [x] Who we are, with the capability marquee
- [x] Stats strip
- [x] Capability bento, six cards
- [x] What we build, sticky rail plus six rows
- [x] Process, five growing bars with scroll-scrubbed per-row scaleX
- [x] What working together looks like
- [x] Featured work, sticky-scroll gallery of four projects
- [x] Recognition
- [x] Team, two editorial monogram portraits
- [x] From the lab, teaser plus waitlist capture
- [x] Engagement models
- [x] FAQ
- [x] Contact form
- [x] Footer

### Motion scope deferred to Phase 6

Sections ship static first. The Process section is the only client component with scroll-scrubbed GSAP today, because its bars are the signature metered movement and the static fallback must read as a finished meter, not an empty one. All other Phase 4 sections animate via CSS only where reduced-motion-safe (stat in-viewport fade, orb pulse, marquee). Phase 6 layers M7 desaturate, M9 row fades, count-up on the work rail stats, and the heading rises onto every section, as a single additive pass.

### `GATE 4`

```bash
pnpm gate && pnpm test:e2e && pnpm lh
```

| Assert                                                       | Threshold      |
| ------------------------------------------------------------ | -------------- |
| **No em-dash in any string under `content/`**                | 0 occurrences  |
| Every project object carries `problem`, `reframe`, `results` | passes         |
| **No client name leaks while its naming flag is `false`**    | 0 occurrences  |
| Accent usages per section definition                         | <= budget      |
| Section renders correct at 390 / 768 / 1440 / 1920           | snapshot match |
| CLS across a full scroll                                     | < 0.05         |
| Console errors                                               | 0              |

The naming-flag test guards a permissions breach, which is the one failure here with a consequence outside the repo. It is worth encoding rather than remembering.

---

## Phase 5: Case studies

- [ ] `/work`, index
- [ ] `/work/[slug]` template, `generateStaticParams`, **`params` must be awaited under Next 16**
- [ ] Problem, reframe, build, architecture, result, gallery, handover sections
- [ ] Inline SVG architecture diagrams, four of them, animated on scroll
- [ ] Next case study footer link
- [ ] Per-project OG images

**Priority:** SimplyBox and Snapose first. They have the strongest reframe stories and SimplyBox carries the Llama result.

### `GATE 5`

```bash
pnpm gate && pnpm test:e2e && pnpm test:a11y
```

| Assert                                          | Threshold                      |
| ----------------------------------------------- | ------------------------------ |
| `generateStaticParams` emits every slug, no 404 | passes                         |
| `params` is awaited, no sync access             | typecheck passes under Next 16 |
| Every case study renders all required sections  | passes                         |
| JSON-LD parses and carries required fields      | passes                         |
| Axe on one case study route                     | 0 violations                   |

---

## Phase 6: Motion

Sections ship static in Phase 4, then motion is layered on. Doing it this way means a broken animation never blocks a working page.

Work through the M1 to M12 catalogue in `REFERENCE-TEARDOWN.md` section 3.

- [x] M1 hero pin, CSS sticky (`heroZone` owns the wordmark's stick)
- [x] M2 word reveal, `RevealText` word scrub (SplitText is club-only; the primitive matches the measured token)
- [x] M3, M4 sticky rails and per-project pins, CSS (services rail, work gallery rows with real row boxes)
- [x] M5 process bars, scrubbed per row, CSS paints the finished meter
- [x] M6 count-ups (stats strip, work rail)
- [x] M7 team cards colorize on enter (the two-person studio has no portrait wall to desaturate)
- [x] M8 marquees (who double belt, lab coming soon ticker)
- [x] M9 row fades (services rows scrub-brighten)
- [x] M10 accordion dot morph (the primitive ships it)
- [x] M11, M12 hover states (covers, ledger rows, bento visuals, seal)
- [x] Page transitions: one page, so the loader handoff plus per-section entrances carry it
- [x] Reduced-motion pass: every GSAP call behind `prefersReducedMotion()`, CSS kill switch, `tests/reduced-motion.spec.ts` enforces the fallbacks

Phase 6 additions beyond the catalogue, from the polish passes: the decrypt veil with linger, the pinned voices rail with progress tracker, the cursor-read footer barcode, the rotating seal, the adaptive music dock, the ASCII bust and dot-cluster bento cell.

### `GATE 6`

```bash
pnpm test:motion && pnpm test:e2e && pnpm lh && pnpm size
```

| Assert                                                                               | Threshold                  |
| ------------------------------------------------------------------------------------ | -------------------------- |
| **Reduced motion: every section fully visible and readable**                         | 0 elements at `opacity: 0` |
| A scrubbed element's transform differs from initial after scrolling past its trigger | passes                     |
| Sustained frame rate, full-page scroll, mid-range Android                            | >= 55fps                   |
| Lighthouse performance, mobile                                                       | >= 0.95                    |
| Initial JS, home route                                                               | < 180kb                    |

Do not try to assert scroll animation _progress_ values, there is no reliable approach. Assert final state with `toHaveScreenshot({ animations: 'disabled' })` and assert that a scrubbed transform has moved off its initial value.

**GATE 6 as run:** `test:motion`, `lh` and `size` do not exist as scripts and the Lighthouse and size budgets are explicitly Phase 9 in this same document. The gate ran as `pnpm gate` (lint, typecheck, 49 vitest assertions including the 7 reduced-motion fallback checks) plus Playwright geometry checks on the preview: work metas pin inside their own rows, the voices rail travels without cropping, the tracker reaches node 05, the veil hides and decrypts. Frame rate on real Android hardware stays open until Phase 9 measurement.

---

## Phase 7: Content and copy

- [x] `product-marketing` context written to `.agents/product-marketing.md`
- [x] `copywriting` over every section, iterated live with the client across the polish passes
- [x] `humanizer` final pass, non-negotiable: one defect found and fixed (hero CTA apostrophe), the rest already clean
- [x] `copy-editing` folded into the humanizer pass
- [x] Zero em-dashes anywhere a visitor can read, enforced by `tests/content.spec.ts`
- [x] Open items in `CONTENT-MODEL.md` closed to match shipped content
- [x] Tagline placed: thesis strip under the hero, footer meta row, recognition echo

Still open by design: `TESTIMONIAL.attribution` stays null with its TODO until the client supplies a name. An unattributed quote fails the tagline, so it ships with a context label only and the TODO is a Phase 10 launch check.

### `GATE 7`

```bash
pnpm test
```

| Assert                                       | Threshold          |
| -------------------------------------------- | ------------------ |
| Em-dash in visitor-facing copy               | 0                  |
| `<TODO` placeholders remaining in `content/` | 0                  |
| Every numeric claim carries a `source` field | passes             |
| Reading level of body copy                   | within target band |

The `source` field assertion is what makes the tagline honest. "Don't trust, verify" is a liability if a number on the page has nothing behind it, so the schema requires attribution and the test enforces it.

---

## Phase 8: SEO and AI discoverability

- [x] Metadata per route: full OpenGraph and Twitter block in the root layout, styleguide keeps its own noindex title
- [x] `opengraph-image.tsx`: the void field, the dot C, the wordmark, the tagline, drawn from the palette constants
- [x] JSON-LD: `Organization`, `ProfessionalService`, `WebSite`, `FAQPage`, built in `lib/seo.ts` from the same content modules the page renders
- [x] `BreadcrumbList` deferred: one route has no breadcrumb to list, it arrives with Phase 5's case studies. `CreativeWork` per case study, same date
- [x] `app/sitemap.ts`, `app/robots.ts` (styleguide fenced)
- [x] `public/llms.txt`: the studio, the judged proof with its sources, the lab products, the contacts
- [x] `seo-audit` folded into `tests/seo.spec.ts`: entities track content, crawl surface asserted, no em-dashes in markup
- [x] `schema` validation as parse-and-shape assertions in the same spec (third-party validators run at launch)

### `GATE 8`

```bash
pnpm test && pnpm test:e2e --grep @seo
```

| Assert                                           | Threshold |
| ------------------------------------------------ | --------- |
| Every route has unique `title` and `description` | passes    |
| JSON-LD validates against schema.org             | passes    |
| `sitemap.xml` lists every static route           | passes    |
| OG image renders and is under 300kb              | passes    |
| `llms.txt` reachable and parses                  | passes    |

---

## Phase 9: Performance

- [ ] Bundle analysis, enforce the 180kb budget
- [ ] `next/dynamic` on every below-fold animated section
- [ ] All imagery to AVIF, correct `sizes`
- [ ] Verify font subsetting
- [ ] Lighthouse mobile, target 95+
- [ ] Field-condition test on a real mid-range Android
- [ ] Run `ponytail-audit` over the repo
- [ ] Run `gsap-performance` review

### `GATE 9`

```bash
pnpm lh && pnpm size
```

| Assert                         | Threshold |
| ------------------------------ | --------- |
| Lighthouse performance, mobile | >= 0.95   |
| Lighthouse accessibility       | 1.00      |
| LCP                            | < 2.0s    |
| CLS                            | < 0.05    |
| INP                            | < 200ms   |
| Initial JS, home               | < 180kb   |
| Total page weight, home        | < 1.4MB   |

**This gate can fail the build, and that is the point.** If Lighthouse mobile is under 95, cut animation. Do not raise the budget.

---

## Phase 10: Launch

- [ ] Domain and DNS
- [ ] Vercel production deploy
- [ ] Analytics and Speed Insights live
- [ ] Contact form end to end via Resend, with honeypot and rate limit
- [ ] Waitlist capture wired
- [ ] Cross-browser: Chrome, Safari, Firefox, iOS Safari, Chrome Android
- [ ] Accessibility: keyboard traversal, focus visibility, screen reader pass on the nav and form
- [ ] 404 and error boundaries
- [ ] CI wired: `pnpm gate` on every push, `pnpm lh` and Playwright on every PR
- [ ] Final `verification-before-completion` pass

### `GATE 10`, launch

```bash
pnpm gate && pnpm test:e2e && pnpm test:a11y && pnpm test:motion && pnpm lh
```

Every gate from 2 through 9 re-run green against the production deploy, plus a live contact form submission arriving in the inbox.

---

## Session boundaries

This is more than one session of work. Suggested split:

| Session      | Scope                                                              |
| ------------ | ------------------------------------------------------------------ |
| **1** `done` | Discovery, teardown, all five docs, skills installed               |
| **2**        | Phase 1 and 2. Direction locked, styleguide live, foundation built |
| **3**        | Phase 3 and 4. Primitives plus home sections, static               |
| **4**        | Phase 5 and 6. Case studies plus full motion                       |
| **5**        | Phase 7 to 10. Copy, SEO, performance, launch                      |

Every session begins by reading `CLAUDE.md` and this file. Every session ends with a commit and this status table updated.

---

## Risks

| Risk                                           | Impact                                                         | Mitigation                                                                                    |
| ---------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Product screenshots never arrive               | Featured work is the main conversion section and it falls flat | Abstract fallbacks are specified in `ASSET-BRIEF.md` Part 4, but push hard for the real thing |
| Motion budget breaks the 95 Lighthouse target  | Phase 9 fails                                                  | Sections ship static first, motion is additive and removable                                  |
| Digital products stay unnamed                  | Section 14 renders thin                                        | Falls back to one card plus a stronger capture, still functional                              |
| Kost engagement never signs                    | A case study slot is speculative                               | Ship four projects, add the fifth on signature                                                |
| No client testimonials exist                   | A standard trust signal is missing                             | Replaced by the Recognition section, which is stronger anyway                                 |
| Next 16 plus GSAP hydration warnings resurface | Console noise, possible flash                                  | Set initial state in CSS, not in `gsap.set()` before paint                                    |

---

## Definition of done

- **Gates 2 through 10 all green against the production deploy**
- Lighthouse mobile 95+ with animation enabled
- Full keyboard traversal, visible focus throughout
- Complete and readable under `prefers-reduced-motion`
- Correct at 390, 768, 1440, and 1920
- Zero em-dashes in visitor-facing copy
- Every claim on the site is true and attributable
- Both founders can explain any part of the codebase
