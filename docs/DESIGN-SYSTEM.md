# Design System

**Locked: Forest Neutral, plus a void ground.** Picked 2026-08-03 after three measured passes.

The source of truth is `app/tokens.css`. This document explains the reasoning; the stylesheet holds the values, and `tests/tokens.spec.ts` parses that stylesheet rather than keeping its own copy, so the numbers below cannot silently drift from what ships.

Every primitive is rendered at **`/styleguide`**.

---

## 1. Why this palette, in three numbers

Two earlier passes failed, and neither failure was visible in a contrast checker. Measuring the reference (`kudos.framer.media`) against our own page explained it:

| | reference | our pass 2 | now |
|---|---|---|---|
| ink to body gap | 5.74x | **1.50x** | **3.30x** |
| accent chroma | 100% | **14%** | 46% |
| field neutrality | 0% | tinted green | text neutral, field green |

**The gap is the thing.** Every pair in pass 2 cleared 4.5:1 and the page still read as a flat smear, because headings and body sat in the same tonal band. Worse, the fix applied at the time, brightening `body` to cure "murkiness", closed the gap further. A floor-only test suite would have called that an improvement, which is exactly why `tokens.spec.ts` asserts the ratio between tones as well as the ratio against the ground.

**Chroma is not saturation.** The rejected magenta `#E576B8` sat at 68% lightness, and that darkness was what read as aggressive, not the saturation. Holding lightness at 82 to 84% and raising saturation instead roughly doubles the visible chroma (R minus G spread, 30 to 69) while staying unmistakably a soft pink.

**One accent, everywhere.** Green lives in the field. Ink and body carry almost no hue, so the pink is the only chromatic thing on screen and reads as intentional rather than as one more tint. If a second accent ever appears, it is a bug.

---

## 2. Grounds

Four, not two. `void` is the addition: a near-black field for the wordmark band, the footer, and any full-bleed moment that should read as a hard cut rather than a shade.

### Dark

| Token | Hex | Use |
|---|---|---|
| `--d-void` | `#040706` | Full bleed cuts, footer, wordmark band |
| `--d-bg` | `#08120E` | The page field |
| `--d-surface` | `#0E1A15` | Cards, inputs |
| `--d-raise` | `#17291F` | Hover, elevated state |

### Light

| Token | Hex | Use |
|---|---|---|
| `--l-bg` | `#EFF2EF` | Counterpoint band field |
| `--l-surface` | `#FFFFFF` | Cards on a light band |
| `--l-raise` | `#DFE6E1` | Hover, elevated state |

Bands alternate ground so the page has tonal rhythm. A `<Band ground="...">` owns its palette; nothing overrides colour inline.

---

## 3. Foregrounds and verified contrast

Checked against the **worst** ground, not the page field. Checking only `bg` hid real failures on cards.

### Dark ground

| Token | Hex | void | bg | surface | raise | worst |
|---|---|---|---|---|---|---|
| `--d-ink` | `#FBFDFC` | 19.80 | 18.63 | 17.46 | 14.97 | **14.97** |
| `--d-body` | `#858E8A` | 6.00 | 5.65 | 5.29 | 4.54 | **4.54** |
| `--d-label` | `#9AA29E` | 7.74 | 7.28 | 6.83 | 5.85 | **5.85** |
| `--d-accent` | `#F9B4D6` | 12.07 | 11.36 | 10.64 | 9.12 | **9.12** |

Hierarchy gap on the field: **3.30x**.

### Light ground

| Token | Hex | bg | surface | raise | worst |
|---|---|---|---|---|---|
| `--l-ink` | `#070F0B` | 17.20 | 19.40 | 15.29 | **15.29** |
| `--l-body` | `#4E5955` | 6.46 | 7.28 | 5.74 | **5.74** |
| `--l-label` | `#414B47` | 8.02 | 9.04 | 7.12 | **7.12** |
| `--l-accent` | `#8C2565` | 7.25 | 8.18 | 6.44 | **6.44** |

Hierarchy gap on the field: **2.67x**.

### The naming trap

**`--label` is brighter than `--body`. That is deliberate.** `--body` carries paragraphs at 15px; `--label` carries 10 to 11px mono, which needs more contrast to survive at that size. The token used to be called `--faint`, which read as "dimmer" and invited exactly the wrong instinct. A test asserts the ordering so a future rename cannot quietly invert it.

---

## 4. The field: grain and bloom

The atmosphere is **not** a background image. It was, briefly, and the measurements killed the idea:

| | `hero-background.png` | `section-bg.png` |
|---|---|---|
| dimensions | 1376x768 | 1376x768 |
| visible width at 390px, `cover` | **26%** | **26%** |
| bloom position | right edge | left edge |
| bloom on mobile | **cropped out** | **cropped out** |
| white ink on the bloom | **1.35:1** | **1.03:1** |
| brightest spot in the mobile slice | 4.70:1 | **3.71:1**, fails AA |
| weight | 1.5 MB | 1.7 MB |

Three separate failures: the phone crop deletes the only interesting part of the frame, the bright area cannot carry text, and 3.2 MB of grain is unservable against a 95+ mobile Lighthouse target, because high-frequency noise is the worst case for image compression.

Static was never the problem. **Baked-in lighting was.** So the two layers were separated.

### Grain, `public/grain.png`

Extracted from the supplied hero PNG: a flat region high-passed to strip the lighting and keep only the paper fibre, quantised, then four-way mirrored into a seamless tile. **256x256, 36.8 KB.** Tiles infinitely, resolution-independent, one cache hit. 3.2 MB to 37 KB, an 88x reduction, and it is still the original texture rather than `feTurbulence`, which always reads as TV static.

Applied with `mix-blend-mode: soft-light` at `--grain-dark: 0.05` / `--grain-light: 0.035`, and scaled to 62% above 2dppx so the fibre keeps the same physical size on a retina phone instead of turning to mush.

### Bloom, CSS

A `radial-gradient` in `rgb(var(--bloom-rgb) / a)`, sampled from the same PNG so the colour matches exactly:

| sample | hex |
|---|---|
| bloom core | `#C6D5CB` |
| bloom mid | `#ADBEB1` |
| field mid | `#1F2D22` |
| field deep | `#030B05` |

Because it is a gradient and not a pixel, it repositions per breakpoint. Defaults sit the bloom at the edge on desktop and at `62% 10%` on mobile, so the phone gets the light instead of the flat corner.

### The alpha budget

The cap is not a matter of taste. Each level is defined by what it can carry, measured against `--d-bg`:

| level | value | composite | ink | body | accent | may carry |
|---|---|---|---|---|---|---|
| `--bloom-safe` | 0.10 | `#1B2621` | 15.28 | 4.63 | 9.31 | anything |
| `--bloom-head` | 0.35 | `#4A5650` | 7.51 | 2.28 | 4.58 | headings and accent |
| `--bloom-hot` | 0.62 | `#7E8B83` | ~3.4 | ~1.1 | ~2.1 | no text |

**Never raise a level to make a section prettier. Move the bloom.** All three rows are asserted in `tokens.spec.ts`, including that `head` fails on body, so the level's existence is documented rather than accidental.

---

## 5. Type

**Inter and JetBrains Mono.** Both self-hosted at build time by `next/font`, so no third-party request and no layout shift.

Inter is a common choice and the design hook flags it as such. It stays because the distinctiveness is carried by the optical setting, not the face:

| Role | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| Display, `h1` | `clamp(34px, 6.2vw, 80px)` | 800 | **0.90** | -0.024em |
| Heading, `h2` | `clamp(30px, 5.1vw, 64px)` | 800 | 0.90 | -0.024em |
| Spine | `clamp(21px, 3.3vw, 40px)` | 700 | 1.16 | -0.022em |
| Lead | `clamp(14px, 1.2vw, 17px)` | 500 | 1.35 | normal |
| Body | 15px | 500 | 1.40 | normal |
| Mono label | 10 to 11px | 400 | 1.0 to 1.3 | 0.02em |

The 0.90 line height and 800 weight are measured from the reference teardown. A more unusual face would have added novelty at the cost of that setting.

**The Lead sits at `--ink`, not `--body`.** It is the sentence directly under a heading, which is the exact moment the text must not grey out.

---

## 6. Motion

One easing token, defined once in CSS and once in GSAP from the same four control points so the two cannot drift:

```
--ease: cubic-bezier(0.44, 0, 0.56, 1)
--dur-state:  300ms    state changes, hover, toggles
--dur-reveal: 1000ms   scroll reveals
```

Library split, fixed at three:

| Layer | Owns |
|---|---|
| **CSS** | Anything expressible as a transition. First choice, always. |
| **GSAP** | Scroll-linked only: scrub, pin, progress. |
| **Motion** | Component state and exit, via `LazyMotion` + `strict`. |

`strict` makes a stray `motion.div` throw instead of silently pulling the full library into the bundle, which is a failure with no visible symptom.

**Transform and opacity only.** Never `width`, `height`, `padding`, `margin`, `top`, or `left`. `tests/reduced-motion.spec.ts` greps for these inside tweens and fails the build.

### Sticky versus pin

Both are used, for different jobs, and the distinction was learned the hard way.

- **`position: sticky`** for anything that just has to hold still. Costs no spacer and is handled by the compositor. The process rail uses this.
- **ScrollTrigger `pin`** only where scroll progress must drive something, which is the quote spine and nothing else so far.

Pinning the process rail was tried first and was wrong twice over: `pinSpacing: false` left a dead scroll region the height of the section, and a pinned element leaves normal flow, so the per-step scrub ranges stopped matching where the steps actually were.

**Reading a scroll index needs measurement, not toggles.** One `ScrollTrigger` per step with `onToggle` missed three of five steps, because a fast scroll jumps a whole panel in one frame, firing enter and leave together and settling on "not active". One trigger that reads element positions on update cannot miss anything, however far a frame travels.

### Reduced motion is a contract, not a checkbox

**Every animated element paints its final state in CSS, and the animation moves away from it.** Nothing starts at `opacity: 0` and animates up, because a visitor who opted out never runs the tween and gets a blank page. The suite enforces this three ways: no stylesheet may park an element at `opacity: 0`, every component that calls GSAP must consult `prefersReducedMotion`, and a Playwright pass under emulated reduce asserts that no element with text sits below 0.1 opacity.

Smooth scroll is **disabled** under reduce, not slowed. Lenis is the single most disorienting effect for anyone with a vestibular disorder, and a gentler version is not a kindness.

One trap worth recording: Playwright's config-level `reducedMotion` option silently did not reach `matchMedia`. Every guard fell through, GSAP ran, and the tests correctly went red. `page.emulateMedia()` does apply, and the suite now asserts the emulation took before asserting anything that depends on it.

---

## 7. Layout

From the reference teardown:

| Token | Value |
|---|---|
| `--max` | 1512px |
| `--gut` | `clamp(16px, 3.4vw, 48px)` |
| `--col-pad` | `clamp(16px, 1.7vw, 26px)` |
| `--nav-h` | `clamp(64px, 7vw, 96px)` |
| `--pad-block` | `clamp(52px, 8vw, 132px)` |
| `--radius` | 3px |
| hairline | `1px solid rgb(var(--line-rgb) / 0.1)` |

Four columns above 900px, one below. The vertical hairlines disappear on mobile, where four rules stop being structure and start being noise.

---

## 8. Primitives

All at `/styleguide`, all covered by GATE 3 at 390, 768 and 1440.

| Component | File | Notes |
|---|---|---|
| `Band`, `Wrap`, `Grid`, `Col`, `Hairline`, `StickyRail` | `components/layout.tsx` | Band owns the ground |
| `Eyebrow`, `Heading`, `Lead`, `Body`, `MonoLabel` | `components/type.tsx` | One accent word per heading |
| `CTACard`, `StatCell`, `Accordion`, `Marquee`, `FormField` | `components/ui.tsx` | `StatCell.source` is required, not optional |
| `Field` | `components/Field.tsx` | Grain plus bloom. Replaces the background PNGs |
| `RevealText` | `components/RevealText.tsx` | Word reveal, optional pin |
| `PinnedSteps` | `components/PinnedSteps.tsx` | Sticky rail, scroll-tracked index |
| `ProcessBar` | `components/ProcessBar.tsx` | `scaleX`, never `width` |
| `DecryptText` | `components/DecryptText.tsx` | DOM scramble, no WebGL |
| `Magnetic` | `components/Magnetic.tsx` | 9px travel, fine pointers only |

### Component library decisions

The Canvas UI and VengeanceUI repos are a menu, not a checklist.

| Effect | Verdict |
|---|---|
| `DecryptReveal` | **Rebuilt, not imported.** The original is a WebGL2 pass over a rendered texture, right for an image and wrong for type: it costs a context, cannot be selected or read by a screen reader, and blurs the letterforms the type spec exists to protect. The DOM version has no dependency and keeps the real string in the DOM throughout. |
| `Displacement`, `ParticleScroll`, `RetroDither` | Available. Self-contained WebGL2, 10 to 20 KB, no three.js. Candidates for the hero. |
| `DitheredObject`, `AsciiObject`, `ParticleObject`, `GlassObject`, `LiquidObject` | **Out.** All import three.js plus GLTFLoader and need a `.glb`, roughly 160 KB against a 180 KB budget. The `*Object` suffix is the tell. |
| `Bend` | **Out.** It curves the grid the entire layout depends on. |
| Magnetic pointer | **In, at 9px.** The usual 30px puts the control somewhere other than where the cursor says it is, turning polish into a targeting problem. |

---

## 9. Rules

1. **One accent.** A second one is a bug.
2. **Never edit a colour without running `pnpm test`.** The floor and the gap are both enforced.
3. **Verify against the worst ground**, not the page field.
4. **Move the bloom, do not brighten it.**
5. **Transform and opacity only.**
6. **Paint the end state; animate away from it.**
7. **Every numeric claim carries a `source`.** The tagline is "Don't trust. Verify." An unattributed number makes that a liability.
8. **No em-dashes** in anything a visitor reads.
