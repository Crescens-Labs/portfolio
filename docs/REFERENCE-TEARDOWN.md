# Reference Teardown: kudos.framer.media

Captured 2026-08-03 from `assets/reference/kudos.mp4` (71s, 1918x1078, 30fps, single continuous scroll take) plus live DOM inspection of the running site at 1536px viewport.

This is the structural and motion source of truth. Colors here are the reference's own, they get remapped to the Crescens palette in `DESIGN-SYSTEM.md`.

---

## 1. Measured foundations

### Layout grid

| Property | Value |
|---|---|
| Viewport measured | 1536px |
| Page gutter | 48px each side |
| Content width | `calc(100vw - 96px)` (1425px measured, incl. scrollbar) |
| Columns | **4 equal**, 356.25px each, **zero gap** |
| Column boundaries (x) | 48 / 404 / 760 / 1116 / 1472 |
| Divider | 1px line at **opacity 0.08**, drawn as an element (not a border) |
| Nav height | 96px, `position: relative` (scrolls away, does not stick) |
| Section top padding | 192px |
| Sticky offsets in use | 0px (hero), 96px (services rail), 192px (project meta, pricing rail) |
| Total page height | 19,972px |

The 4-column grid with full-bleed hairlines running the whole page height is the single most defining structural trait. Content spans 1, 2, or 3 of those columns and the hairlines never move. This is what makes the page feel like a document rather than a stack of sections.

### Type system

Three families, strict roles.

| Role | Family | Size | Weight | Line height | Tracking |
|---|---|---|---|---|---|
| H1 (hero) | Inter Display | 84px | 800 | 75.6px (0.90) | -1.68px (-0.02em) |
| H2 (section) | Inter Display | 64px | 800 | 57.6px (0.90) | -1.28px (-0.02em) |
| H3 (large card) | Inter Display | 48px | 700 | 43.2px (0.90) | -0.96px (-0.02em) |
| H3 (card title) | Inter Display | 20px | 700 | 18px (0.90) | -0.40px (-0.02em) |
| H3 (micro label) | Inter Display | 16px | 700 | 14.4px (0.90) | -0.32px (-0.02em) |
| Lead paragraph | Inter Display | 22-24px | **600** | 1.20 | -0.02em |
| Body paragraph | Inter Display | 18px | **600** | 1.20 | -0.02em |
| Mono label | Intel One Mono | 12px | 500 | 1.00 | normal |
| Mono micro | Intel One Mono | 10px | 500 | 1.00 | normal |
| Wordmark | Syne | display | - | - | - |

Two things people miss when copying this look:

1. **Line height is 0.90 on every heading.** Not 1.0, not 1.1. Lines nearly touch. This is where the density comes from.
2. **Body copy is weight 600, not 400.** At 18px/1.2 semibold, paragraphs read as compact blocks of texture rather than as running prose. Combined with the 0.90 headings the whole page has one uniform optical weight.

Mono is never `text-transform: uppercase`, the copy is authored in caps. Tracking stays `normal` because the monospace advance already provides the spacing.

### Color (reference values)

| Token | Value | Use |
|---|---|---|
| Dark bg | `#050505` | Hero, services, pricing, footer |
| Light bg | `#FAFAFA` | Process, projects, social proof, FAQ, contact, insights |
| Surface | `#FFFFFF` | Cards on light |
| Surface alt | `#F5F5F5` | Recessed panels |
| Line | `#E0E0E0` | Solid dividers |
| Muted | `#666666` | Secondary text on light |
| Muted 2 | `#999999` | Tertiary text |
| Accent | `#00FFC8` | One accent only, used sparingly |
| Hairline | `currentColor @ 0.08` | Grid dividers, both themes |

The accent appears on: the first 1-2 words of a heading, list bullets/diamonds, small status dots, one full-bleed card, and the active state of a toggle. That is the entire budget. Everything else is monochrome.

### Motion constants

| Property | Value |
|---|---|
| **House easing** | `cubic-bezier(0.44, 0, 0.56, 1)` |
| Hover / state duration | 0.30s |
| Scroll-linked reveal duration | 1.00s |
| Corner radii | 6px (dominant), 4px, 2px, 8px |

`cubic-bezier(0.44, 0, 0.56, 1)` is a near-symmetric ease-in-out with a slow start and slow finish and a fast middle. It is used for every transition on the site. Adopt it as the one global easing token.

Radii are deliberately tiny. 6px on cards, 4px on chips, 2px on the smallest elements. Nothing is pill-shaped except the numbered process bars.

---

## 2. Section-by-section inventory

Timestamps map to `assets/reference/kudos.mp4`.

### 01. Nav (0:00)
Wordmark left, hamburger right, transparent over the dark hero. Height 96px, `position: relative`, so it scrolls out of view and never returns. No sticky header, no backdrop blur.

### 02. Hero (0:00-0:02) `#050505`
- `position: sticky; top: 0`. The hero pins while the next section scrolls up over it. This is the site's opening move: the giant wordmark band slides over the pinned hero rather than the hero scrolling away.
- Background: black with a soft silk / draped-fabric texture, very low contrast, lit from the upper right.
- H1 84px/0.90/800, two-tone: first three words in accent, remainder in white.
- Sub-paragraph, 2 lines, spans columns 1-2.
- Right rail (column 4): avatar stack (4 overlapping circular portraits) + 5 diamond glyphs + "4.9/5" + "TRUSTED BY TOP BRANDS" in mono 12px.
- Below it: mono kicker "Ready to start something great?" then a CTA card with a label left and a vertical 3-dot marker right.
- Fixed right-edge badge: rotated "W. Nominee" tab, persists the entire page.

### 03. Wordmark band (0:02-0:04) `#FAFAFA`
Giant black "KUDOS" set at roughly 2x the viewport width so both outer letters bleed off screen. Sits directly on the light background, no card. Acts as the hard cut from dark to light.

### 04. Who we are (0:04-0:10) `#FAFAFA`
- Eyebrow `+ WHO WE ARE` in mono, column 1.
- H2 two-tone (grey first word, black remainder): "**Aligned** with your mission". The grey/black split is the site's standard heading treatment on light sections.
- Support paragraph in column 4.
- Pull quote in column 1 with a `❞` glyph above, bolded key phrases inside otherwise grey text, attributed with a small avatar + name + role.
- Client logo marquee, infinite horizontal scroll, low contrast greyscale logos, spanning columns 2-3.
- CTA card in column 4 with mono kicker above it.

### 05. Stats strip (0:10-0:12) `#FAFAFA`
Four cells on the 4-column grid divided by hairlines. Each cell: a 4-dot progress indicator (filled dots show position in the set), mono label, big number in Inter Display 800, two-line description. Numbers count up on entry.

### 06. Why choose us (0:12-0:16) `#FAFAFA`
- Eyebrow `+ WHY CHOOSE US?`
- H2 two-tone: "**Positioned** for lasting success".
- Avatar stack + rating repeated in column 1.
- **Scroll-linked word reveal.** A large paragraph (36px+) where each word transitions from `#CCCCCC` to `#050505` as the scroll position passes it. Implemented as `transition: color 1s cubic-bezier(0.44,0,0.56,1)` per word, toggled by scroll position. Not a mask, not opacity. 14 elements on the page carry this transition.

### 07. Bento grid (0:16-0:19)
Mixed backgrounds, 3 columns wide, irregular row heights.
- **Dark silk card** (2 cols): same fabric texture as the hero, accent-word heading "**Design** that drives growth", description, and at the bottom a small icon list (Clarity / Performance / Scale) opposite a huge "100%".
- **Accent card**: solid `#00FFC8`, small title + description at top, then "BETTER" in black and "LESS" in a lighter tint of the same green, oversized and clipped by the card edge.
- **White cards**: "Built with intention" with an abstract stacked-paper visual, "For ambitious teams" with an ascending bar chart, "Strategy > aesthetics" with an abstract grid of rounded UI blocks in greys with one accent block.

### 08. Services (0:19-0:28) `#050505`
- Left rail `position: sticky; top: 96px`: eyebrow `+ SERVICES`, H2 two-tone with accent ("**Our** focus"), description. Stays pinned for the whole section.
- Right side: 6 rows, each on the grid: accent dot + `01`, then a rounded thumbnail (~72px, radius 6px), then the service title, then the description in column 4. Rows divided by hairlines.
- Rows fade text from dim to full as they enter the viewport.
- Section closes with a `❞` pull quote (accent-highlighted phrases) and a "Get in touch" CTA card in column 4.

### 09. Process (0:28-0:33) `#FAFAFA`
The most distinctive component on the site.
- H2 two-tone "**Structure** meets creative freedom", support paragraph in column 3.
- Four rows. Each row has a **black pill bar** containing `01 Discover` and the rest of the row filled with a dense vertical-tick pattern like a ruler or barcode.
- **The bar width grows with each step**: step 01 is narrow, 02 wider, 03 wider still, 04 nearly full. Read as a progress meter for the engagement. The bar width animates from 0 to its target as the row enters view.
- Below each bar: a small diamond bullet at the far left, the step description in column 2, and an `Outcome:` mono label with its text in column 4.

### 10. Project experience (0:33-0:34) `#FAFAFA`
Three columns of short Q&A: "What to expect?" / "What you get?" / "What it takes?" Title in Inter Display 700, answer in grey. Divided by hairlines.

### 11. Featured projects (0:34-0:42) `#FAFAFA`
Three-column sticky scroll gallery.
- Column 1, `sticky top: 192px`: description paragraph with bolded key phrases, "Team / KUDOS / 2026" block, and a 2x2 stat grid (Brands 88, Launches 136, Users 22M+, Speed 56%) divided by hairlines.
- Columns 2-3: large project visuals stacked vertically, each a dark card with a device mockup inside.
- Column 4, `sticky top: 192px` per project: project name, subtitle, `Year:` / `Client:` mono label pairs, description, and a "View case study" link with a vertical 3-dot marker.
- Each project's meta block pins while its visual scrolls past, then releases to the next. Produces a synchronized left-pinned, right-pinned, center-scrolling reading experience.

### 12. Social proof (0:42-0:44) `#FAFAFA`
- Eyebrow `+ SOCIAL PROOF`, H2 two-tone "**Trusted** by great teams".
- Large pull quote (~40px) with the same scroll-linked word-by-word color reveal as section 06.
- Attribution with avatar bottom-left, then four metric cells on the grid: `+28%` Brand Awareness, `+47%` User Engagement, `+52%` Qualified Demand, `+36%` Growth Impact.

### 13. Testimonial marquee (0:44-0:47) `#FAFAFA`
Mono kicker "Real stories from teams we've partnered with:". Infinite horizontal scroll of quote cards, roughly 4 visible. Each card: `❞` glyph, quote text, then avatar + name + role pinned to the card bottom. Cards divided by hairlines, no card background.

### 14. Team (0:47-0:53) `#FAFAFA`
- H2 stacked on two lines, two-tone across lines: "**Small team.**" grey / "**Big standards.**" black.
- Four tall portrait cards on the grid, near-square, radius 6px.
- **Portraits are desaturated and colorize as they enter the viewport, staggered left to right.** In the recording the fourth portrait is still greyscale while the first three have already resolved to full color.
- Below each: name in Inter Display 700, role in mono, and X / LinkedIn glyphs on the right.
- Closes with a two-tone line "Behind every result is **a team that cares.**" and a "More about us" CTA in column 4.
- A giant ghosted "KUDOS" wordmark sits behind this closing block at very low contrast.

### 15. Pricing (0:53-0:56) `#050505`
- Left rail `sticky top: 192px`: eyebrow `+ PRICING`, H2 two-tone with accent "**Clear** plans", description.
- Center: a Subscription / Project toggle where the active pill is accent-filled, then `$` + `6,468` + `/month` with the number at display scale, then a feature list with accent diamond bullets.
- Right: "Custom" as a display-size heading with a paragraph beneath.
- Below: mono footnotes explaining the three engagement modes, `Delivery: Ongoing` right-aligned in mono, and a "Book a call" CTA card.

### 16. FAQ (0:56-0:59) `#FAFAFA`
- H2 two-tone "**Good questions,** honest answers".
- Category labels in column 1 ("Working with Kudos", "Pricing & Scope") that sit alongside their group of questions rather than above them.
- Accordion rows: mono number `01`, question in Inter Display 700, and a marker on the far right that morphs between a **row of dots (closed)** and a **cluster of dots (open)**. First item open by default with the answer in grey.

### 17. Contact (0:59-1:03) `#FAFAFA`
- Giant ghosted "KUDOS" wordmark as a background layer at ~4% contrast.
- Eyebrow `+ WORK WITH US`, H2 two-tone "**Let's** create with purpose", support paragraph column 4.
- Column 1: a two-tone statement paragraph, "Team KUDOS 2026" block, avatar stack + rating.
- Columns 2-3: form with labels above fields, fields as recessed `#F5F5F5` panels with no visible border. Name full width, then Email / Phone side by side, then Company (Optional).
- Consent line with underlined Privacy and Cookie Policies links.
- "Send request" CTA card in column 4 with the vertical 3-dot marker.

### 18. Insights (1:03-1:08) `#FAFAFA`
- Eyebrow `+ INSIGHTS`, H2 two-tone "**Ideas** that move brands".
- Four cards on the grid with **deliberately unequal image heights and staggered vertical offsets**, so the row reads as a masonry rather than a table. Images are moody greyscale photography.
- Each card: date in mono, title in Inter Display 700, excerpt in grey, "Read more" with the vertical 3-dot marker.

### 19. Footer (1:08-1:11) `#050505`
- Giant ghosted wordmark behind everything.
- Column 1: two-tone statement, mono address block, then the email address at display size (~32px, 700) and phone below it, then a copyright line with a tiny avatar.
- Column 2: primary nav stacked at ~20px with a vertical dotted rule running down the right edge of the column.
- Columns 3-4: `Social media` and `Legal` mono headers with link lists beneath.

---

## 3. Motion catalogue

Every named behavior worth reproducing, with the implementation approach for a GSAP + Motion build.

| # | Behavior | Where | Implementation |
|---|---|---|---|
| M1 | Hero pin / overscroll | Hero to wordmark band | `position: sticky; top: 0` on the hero, next section has its own background and scrolls over it. No JS needed. |
| M2 | Word-by-word color reveal | Why choose us, Social proof | Split text into word spans. `transition: color 1s cubic-bezier(0.44,0,0.56,1)`. GSAP ScrollTrigger with `scrub` toggling a class per word based on progress. Do **not** animate opacity, animate `color` from `#CCC` to `#050505`. |
| M3 | Sticky rail | Services, Projects, Pricing | `position: sticky` at 96px or 192px. Pure CSS. |
| M4 | Per-project meta pin | Featured projects | Each meta block `sticky top: 192px` inside its own row wrapper, so it releases naturally when the row ends. Pure CSS, no ScrollTrigger. |
| M5 | Process bar width | Process | GSAP ScrollTrigger, `scaleX` from 0 to target with `transform-origin: left`, house easing, staggered per row. Tick pattern is a repeating linear-gradient behind it. |
| M6 | Stat count-up | Stats strip, project stats | GSAP to a snapped value, triggered once on enter. |
| M7 | Portrait desaturate to color | Team | `filter: grayscale(1) → grayscale(0)` driven by ScrollTrigger with a per-card stagger. |
| M8 | Infinite marquee | Client logos, testimonials | Duplicate the track, GSAP `xPercent: -50` on an infinite linear tween. Pause on hover. Respect `prefers-reduced-motion`. |
| M9 | Row fade-in on enter | Services list, insights, team | Opacity + small y-offset, house easing, stagger 60-80ms. |
| M10 | Accordion dot morph | FAQ | Dots reposition from a row to a cluster. GSAP timeline on the dot elements, 0.3s. |
| M11 | CTA card hover | All CTA cards | `box-shadow, background` at 0.3s house easing. The 3-dot marker animates on hover. |
| M12 | Link color hover | All links | `color` at 0.3s ease. |

### Reduced motion

M2 resolves immediately to the final color. M5 renders at final width. M6 renders the final number. M7 renders in full color. M8 stops. M9 renders visible. Structure and sticky behavior (M1, M3, M4) are safe to keep, they are position-based and cause no vestibular issues.

---

## 4. What to take, what to leave

**Take:** the 4-column hairline grid, the 0.90 line height, semibold body copy, the two-tone heading treatment, the single house easing, the mono label layer, the tiny radii, the one-accent discipline, the sticky rails, the process bar component, the word-reveal.

**Leave:** the exact mint accent, the silk texture (Crescens uses grain instead), the agency-template copy voice, the "W. Nominee" badge, the 20,000px page length. Crescens needs a tighter page.

**Adapt:** the reference is a design agency selling brand work. Crescens is an engineering studio selling end-to-end delivery. The structural moves carry over, the proof points change from awards and brand metrics to shipped systems, competition results, and client operational outcomes.
