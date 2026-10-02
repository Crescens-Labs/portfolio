# Asset Brief

Every image and video the site needs.

**Image generation:** ChatGPT / GPT Image. **Video generation:** Google Flow.

---

## Read this first: what you generate and what you do not

Three categories. Only the first one gets AI prompts.

### 🟢 AI-GENERATED, prompts in this doc

You paste the prompt, you get the asset. Nothing else needed.

| ID | Asset | Section |
|---|---|---|
| H-01, H-02 | Hero and section background fields | Part 1 |
| TG-01 | The thinking figure (ASCII source plate) | Part 1 |
| B-01, B-04, B-05, B-06 | Bento card visuals | Part 2 |
| S-01 to S-06 | Service thumbnails | Part 3 |
| P-env | Project environment plate | Part 4 |
| I-01 | Insights imagery | Part 7 |
| V-01, V-02 | Optional ambient video | Part 9 |

### 🔵 CODE, no AI involved

These are built in the repo. Generating them would produce something worse and unusable.

| ID | Asset | Why not AI |
|---|---|---|
| T-01 | Grain tile | Needs to tile seamlessly. AI output will not. SVG `feTurbulence`, exact code in Part 1. |
| B-02 | Accent card | Oversized type clipped by the card edge. That is CSS. |
| B-03 | Dot orb | Live animated component, `thinking-orbs`. |
| CS-arch | Architecture diagrams | AI cannot produce a correct architecture. A wrong one on a public case study is worse than none. Inline SVG, hand-authored, animates on scroll. |
| OG-01, OG-02 | Open Graph images | Generated at build by `opengraph-image.tsx` so they always match deployed copy. |

### 🔴 REAL, you have to capture it

The assets that actually sell the studio. No prompt can substitute.

| ID | Asset | What to do |
|---|---|---|
| P-01 to P-05 | Project screenshots | Screenshot each real product at 2560px, composite onto the P-env plate |
| CS-gallery | Case study screens | Same, straight on |
| V-03 | Product demo recordings | 8 to 15s silent screen recordings |
| TEAM-01, TEAM-02 | Founder portraits | Shooting direction in Part 6. Fake founder portraits destroy trust instantly. |

**If time is short, do the 🔴 ones.** A ten-second clip of Snapose surviving a dropped connection outperforms every generated image in this document.

---

## The palette block

Paste this verbatim into **every** image prompt. Consistency across 30+ assets comes from repeating the same color contract, not from re-describing the mood each time.

Values match the locked system in `docs/DESIGN-SYSTEM.md`.

```
PALETTE LOCK, obey exactly:
background #08120E near-black forest green
mid tones #0E1A15 and #17291F
highlights #FBFDFC near-white, neutral, no green tint
single accent #F9B4D6 bright soft pink, on less than 5% of the frame
no other hues, no blue, no orange, no yellow, no saturated green
the ONLY chromatic element is the pink, everything else is neutral or deep green
heavy fine film grain across the whole frame
matte finish, no gloss, no lens flare, no bloom
```

**Why highlights are neutral now.** The palette went through three passes. The failure mode was tinting everything green, which left nothing for the eye to anchor on and made the pink unable to pop. Same rule applies to imagery: greens live in the field, highlights stay neutral, the pink is the one colored thing in frame.

## The negative block

Also paste verbatim into every image prompt.

```
NEGATIVE: no text, no letters, no numbers, no logos, no watermarks,
no UI chrome, no browser frames, no people unless specified,
no stock-photo lighting, no glossy 3D render look, no neon glow,
no rainbow gradients, no purple-blue tech cliche, no lens flare,
no vignette burn, no HDR, no oversharpening
```

## House style rules

1. **Grain is mandatory.** It is the brand. Any asset that comes back clean gets regenerated.
2. **The pink is rationed.** Under 5% of any frame. If an image is visibly pink, it is wrong.
3. **Matte, never glossy.** No specular highlights, no glass, no chrome.
4. **Composition breathes.** Generate with empty space, because these sit inside a dense grid.
5. **Generate at 2x display size**, then compress to AVIF.

---

# Part 1: Textures and fields

### T-01, Grain tile  🔵 CODE  `CRITICAL`

The most important asset on the site. Everything else sits under it.

- **Size:** 256 x 256, seamlessly tileable, PNG with alpha
- **Not AI generated.** Produce with SVG `feTurbulence` for a mathematically perfect tile. AI output will not tile.

```html
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
  <filter id="g">
    <feTurbulence type="fractalNoise" baseFrequency="0.85"
                  numOctaves="4" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="256" height="256" filter="url(#g)" opacity="1"/>
</svg>
```

Render once, export PNG, apply at 4% / 7% / 12% opacity per `DESIGN-SYSTEM.md`. One file, three opacities.

### TG-01, The thinking figure  🟢 AI  `CRITICAL`

The source art behind the ASCII figure in the "How we work" section. The renderer samples this image into monospace glyphs, so it is a **luminance plate, not a finished image**: pure black art on pure white, solid fills, nothing soft. Save the winner as `public/figures/thinking.png` and the section picks it up on its own; until the file exists the authored vector figure renders instead, so nothing is blocked.

- **Size:** 1024 x 1365 (3:4 portrait), PNG
- **Colors:** pure `#000000` on pure `#FFFFFF` only. No grays, no color, no gradient fills. Gray turns into mid-density glyph noise, color is discarded at sampling.
- **Do not paste the palette block into this one.** The palette lock exists for finished imagery. This is a sampling source and needs maximum luminance separation instead.

**The prompt, paste as one block:**

```
Minimalist high-contrast monochrome illustration for a bitmap sampling
process. A single human figure standing in three-quarter view, seen
slightly from the side, caught mid-thought: one hand raised with the
fingertips touching the chin, the other arm crossed underneath
supporting the elbow, weight settled, head tilted very slightly down.
The figure reads instantly at small size: a clear unbroken silhouette.

STYLE, obey exactly:
solid filled black silhouette on a pure white background, flat matte
vector-like illustration, clean confident shapes, no outlines around
fills, no hatching, no stipple, no crosshatch shading, no gray tones,
no gradients, no texture inside the black shapes
the face is left white (cut out of the silhouette) with just two small
black eye dots and one short straight mouth line, no nose, no detail
three question marks floating around the head: one large above right,
one medium further right, one small upper left, each rotated a few
degrees off vertical for a loose hand-arranged feel
question marks are solid black, bold geometric sans-serif forms with
consistent weight, fully filled counters

COMPOSITION:
figure centered, occupying about 65-70% of the frame height
generous even white margin on all four sides, nothing cropped
3:4 portrait aspect
nothing else in frame: no floor line, no shadow, no props, no border

QUALITY:
crisp edges, minimal anti-aliasing, no motion blur, matte finish,
no glow
```

**Variants worth generating (same prompt, swap the pose sentence):**

1. **Thinker (primary).** The pose above. This is the one the section expects.
2. **The shrug.** Both palms open at chest height, shoulders raised, head level. Use if the thinker comes back too contemplative.
3. **Head-scratch.** One hand at the back of the head, looking up at the question marks. Slightly more comic, use only if it survives the glyph test.

**Post-processing, two minutes in any editor:**

1. Threshold to pure black/white at roughly 50%.
2. Erase stray specks smaller than a pencil eraser; they sample into orphan glyphs.
3. Confirm the margins stayed even, export PNG at 1024 x 1365.
4. Drop at `public/figures/thinking.png`. Hard refresh: the glyph field should now trace the generated pose, accent half on top.

**The glyph test.** Squint until the image is a tenth of its size. If the pose still reads, it will survive sampling. If it dissolves into confetti, thicken the limbs and regenerate.

### H-01, Hero background  🟢 AI  `CRITICAL`

- **Size:** 3840 x 2160

```
An abstract dark field. Deep near-black forest green, very slightly
brighter toward the upper right where a soft diffuse light falls across
it, fading to almost pure black at the lower left. The surface reads
like heavy matte paper or unlit velvet photographed in a dim room.
Extremely subtle large-scale tonal variation, no visible shapes, no
objects, no pattern. Very heavy fine film grain, the kind found in
pushed 35mm film. Flat, quiet, expensive. Shot on a large format camera.

PALETTE LOCK: [paste]
NEGATIVE: [paste]
```

**Accept when:** you can look at it for ten seconds without your eye finding a shape. If anything reads as a form, regenerate.

### H-02, Section field, warm variant  🟢 AI

- **Size:** 2560 x 1440
- Same as H-01 but light falls from the **left**, roughly 15% brighter overall. Used to alternate sections so the page has tonal rhythm without introducing a light theme.

---

# Part 2: Bento cards

Six cards from `CONTENT-MODEL.md` section 7.

### B-01, Offline-first (2 columns)  🟢 AI  `CRITICAL`

- **Size:** 2400 x 1400

```
An abstract representation of a connection breaking and healing.
A field of small soft-edged dots arranged in a loose irregular grid,
deep near-black forest green background. On the left the dots are
connected by very thin faint lines. Toward the center the lines break
and the dots drift slightly out of alignment. On the right the dots
realign and the lines reconnect, and a few of these reconnected dots
glow a bright soft pink. Shallow depth of field, dots at the edges
slightly out of focus. Extremely subtle, mostly empty frame, the dot
field occupies only the lower two thirds. Heavy fine grain.

PALETTE LOCK: [paste]
NEGATIVE: [paste]
```

### B-02, Grounded not guessing (accent card)  🔵 CODE

Not generated. Built in CSS: solid `#F9B4D6` field, `grain-heavy` at 12%, `GROUNDED` in `#08120E` and `NOT GUESSING` in a lighter tint, oversized and clipped by the card edge. The reference's `BETTER LESS` treatment.

### B-03, Dot orb  🔵 CODE

Not generated. Live component from `.claude/skill-sources/thinking-orbs`, restyled to pink on the dark field.

### B-04, Six to one  🟢 AI

- **Size:** 1200 x 1400

```
An abstract minimal data visualisation. Six vertical bars of descending
height arranged left to right on a deep near-black forest green field.
The five taller bars are a muted desaturated green, barely lifted from
the background. The single shortest bar on the right is bright soft pink.
Flat, no perspective, no 3D, no shadow, no axis lines, no labels.
Generous empty space above the bars. Heavy fine grain.

PALETTE LOCK: [paste]
NEGATIVE: [paste]
```

### B-05, Books that close themselves  🟢 AI

- **Size:** 1200 x 1400

```
An abstract stack of thin horizontal rectangles, like ledger rows,
receding slightly with each layer. Deep near-black forest green field,
rows in barely-lifted mid green with very fine separation. One row near
the middle is bright soft pink and sits perfectly aligned while the rows
above and below are very slightly rotated out of true. Flat overhead
view, no perspective distortion, no shadow. Quiet and geometric.
Heavy fine grain.

PALETTE LOCK: [paste]
NEGATIVE: [paste]
```

### B-06, Yours on day one  🟢 AI

- **Size:** 1200 x 1400

```
An abstract stack of layered sheets seen from a low three-quarter angle,
edges just catching a soft diffuse light. Deep near-black forest green,
sheets in slightly lifted mid green tones. The topmost sheet edge is
lined in bright soft pink. Matte paper surface, no gloss. Soft shadow
between layers, very low contrast. Generous empty space around the
stack. Heavy fine grain.

PALETTE LOCK: [paste]
NEGATIVE: [paste]
```

---

# Part 3: Service thumbnails  🟢 AI

Six, from `CONTENT-MODEL.md` section 8. **Size: 640 x 640** each, displayed at ~96px.

Because they render small, they must be readable as a **single silhouette**. Anything detailed becomes mud.

**Shared prompt frame:**

```
A single abstract object floating centered on a deep near-black forest
green field, lit by one soft diffuse light from the upper left. Matte
surface, no gloss, no reflection. The object occupies about 55% of the
frame with generous empty space around it. Extremely simple silhouette,
readable at thumbnail size. One small detail is bright soft pink.
Heavy fine grain. Shot like a still-life on seamless paper.

OBJECT: <see below>

PALETTE LOCK: [paste]
NEGATIVE: [paste]
```

| # | Service | OBJECT |
|---|---|---|
| S-01 | Custom Web Apps | three flat rounded rectangles of different sizes, loosely stacked and slightly offset, floating with small gaps between them |
| S-02 | Mobile Apps | a single tall rounded rectangle standing upright, slightly tilted, with one small pink dot near its lower edge |
| S-03 | Internal Systems | six small cubes arranged in a loose 3x2 formation, connected by very thin lines, one cube pink |
| S-04 | AI Integration | a dense cluster of small spheres tightening toward a single point, spheres nearest the center pink |
| S-05 | Product & Architecture | a wireframe skeletal structure of thin intersecting lines forming an open volume, one joint pink |
| S-06 | Consulting & Handover | two flat planes passing an object between them, the object mid-transfer and pink |

---

# Part 4: Project covers

Five, from `CONTENT-MODEL.md` section 11. **Size: 2400 x 1600.**

These are the credibility assets, so the rule changes: **real product screens beat generated art every time.** Use generated backgrounds only as the setting.

### Production method

1. Screenshot the real product at 2560px wide.
2. Generate the environment plate with the prompt below.
3. Composite the screenshot into it. Do not ask the model to invent UI, it will produce gibberish text.

**Environment plate prompt:**

```
An empty product photography scene. A dark matte surface receding into
near-black forest green shadow, lit by one large soft diffuse light from
the upper left creating a gentle falloff. A completely empty flat area
in the center of the frame at a slight three-quarter angle, ready for a
screen to be composited in. No device, no object, no screen, just the
empty lit surface and the surrounding shadow. Matte, no reflection,
no gloss. Heavy fine grain. Editorial product photography, large format.

PALETTE LOCK: [paste]
NEGATIVE: [paste]
```

| # | Project | Composite in | Fallback if no screens exist yet |
|---|---|---|---|
| P-01 | SimplyBox | Unified inbox view, conversation list plus a grounded AI reply | B-04 style, six-to-one bars |
| P-02 | RoyaleCard Arena | Card configuration screen plus the draft and ban phase | Abstract card grid, one card pink and elevated |
| P-03 | Snapose | Capture screen plus the finance dashboard, side by side | B-05 style, ledger rows |
| P-04 | Franchise System | POS screen plus the multi-outlet inventory view | Six connected cubes, S-03 style, scaled up |
| P-05 | Kost Operations | Not started | Abstract only, and label the card `In discussion` |

**This is the highest-value item in this brief.** Real screens from five shipped systems will do more for conversion than every other asset combined. Prioritise capturing them.

---

# Part 5: Case study assets

### CS-hero, per project  🔴 REAL + 🟢 AI plate

**Size: 3200 x 1400.** Same environment plate method, wider crop, screenshot composited larger.

### CS-arch, architecture diagrams  🔵 CODE  `CRITICAL`

**Do not generate these.** AI cannot produce a correct architecture diagram, and a wrong one on a public case study is worse than no diagram.

Build them as **inline SVG**, hand-authored, styled with the design tokens so they inherit theme and grain. They animate on scroll, which a raster image cannot.

| Project | Diagram must show |
|---|---|
| SimplyBox | Meta channels into unified ingest, knowledge base into vector store, retrieval into grounded generation, single inbox out. The RAG loop is the whole point, make it legible. |
| RoyaleCard Arena | Rule configuration into card state, market feed into rule evaluation, paper trade engine, arena escrow and settlement, best-of-three match flow. |
| Snapose | Local-first capture and local database, sync queue, Drive sync layer, multi-device convergence, finance capture branching to waste analysis. Show the offline path as a first-class route, not an error case. |
| Franchise System | Module map: POS, inventory, logistics, finance, HR, all against one shared operations core, with the outlet boundary drawn. |

Specification: 1px strokes at `--color-line-strong`, `--font-mono` at 11px for labels, `--color-accent` on exactly one path (the one that carries the insight), zero fill, generous whitespace.

### CS-gallery  🔴 REAL

**Size: 2000 x 1400**, 3 to 6 per project. Real screens on the flat environment plate, straight on, no angle.

---

# Part 6: Team portraits  🔴 REAL

Two, from `CONTENT-MODEL.md` section 13. **Size: 1600 x 2000, 4:5.**

**Do not generate these.** Fake founder portraits on a two-person studio's site are the single fastest way to destroy trust, and they will be spotted.

### Shooting direction

Give this to whoever takes the photos, a phone in good light is enough.

```
Setting:     plain wall, mid-tone, no pattern. Or shoot against a
             window with the subject side-lit.
Light:       one large soft source from the side, roughly 45 degrees.
             No flash, no overhead office lighting.
Framing:     chest up, subject slightly off-center, looking just past
             the camera rather than into it. Vertical 4:5.
Wardrobe:    plain, dark, no logos, no busy pattern.
Expression:  neutral and direct. Not smiling for the camera.
Distance:    stand back and zoom rather than stepping close, so faces
             are not distorted.
```

### Post-processing

Applied in code, not in the photo, so the M7 scroll animation works:

```css
filter: grayscale(1) contrast(1.05) brightness(0.95);
/* animates to grayscale(0) on scroll enter */
```

Then a `grain-mid` overlay at 7% and a `--color-field` multiply layer at 15% so portraits sit in the palette rather than on top of it. This is why they must not be pre-graded.

---

# Part 7: Insights imagery  🟢 AI

Only needed if the blog ships. **Size: 1600 x 1200.**

```
A moody abstract landscape photograph, extremely low contrast, almost
monochrome, deep near-black forest green throughout. <SUBJECT>. Heavy
atmospheric haze softening everything in the distance. Shot on medium
format film with heavy grain. Quiet, still, contemplative. No people,
no structures, no horizon line drama.

SUBJECT options:
  a single ridge line barely emerging from thick fog
  the surface of still water with almost no ripple
  a dense canopy seen from directly below
  a wide empty plain under heavy overcast

PALETTE LOCK: [paste]
NEGATIVE: [paste]
```

---

# Part 8: Open Graph

### OG-01, Default  🔵 CODE

**Size: 1200 x 630.** Generate at build time with Next's `opengraph-image.tsx` rather than as a static file, so it always matches deployed copy.

```
Layout:  H-01 hero field as background, grain at 7%
         CRESCENS wordmark, centered, --color-ink
         "End to end software studio" below in mono, --color-ink-muted
         a single pink dot cluster above the wordmark
```

### OG-02, Per case study  🔵 CODE

Same frame, project name replacing the wordmark, project cover at 30% opacity behind the field.

---

# Part 9: Video

Google Flow. **Video is optional for v1.** Every second of video is weight against a 95+ mobile Lighthouse target, so each of these must earn its place.

### V-01, Hero ambient loop  🟢 AI  `OPTIONAL`

- **10 seconds, seamless loop, 1920x1080, no audio**
- Target under 1.5MB as AV1. If it will not compress under that, ship H-01 as a still.

```
A very slow drift across an abstract dark field of deep near-black
forest green. Soft diffuse light moves almost imperceptibly from the
upper right toward the center over the full duration, like a cloud
passing far outside a window. Heavy film grain that shifts frame to
frame, giving the surface a living texture. No objects, no shapes, no
camera shake, no zoom. Extremely slow, meditative, almost still. The
first and last frames are identical so it loops seamlessly.

PALETTE LOCK: [paste]
NEGATIVE: [paste] no motion blur, no time-lapse, no fast movement
```

**Implementation:** `autoplay muted loop playsinline preload="none"`, poster is H-01, and it does not load at all under `prefers-reduced-motion` or on connections reporting save-data.

### V-02, Process loop  🟢 AI  `OPTIONAL`

- **6 seconds, loop, 1600x900**

```
Five horizontal bars stacked vertically on a deep near-black forest
green field, each bar growing in width from left to right in sequence,
one after another, each one longer than the last. The bars are a muted
lifted green, and the leading edge of each growing bar carries a small
bright soft pink highlight. Flat, two-dimensional, no perspective, no
shadow. Smooth even growth, no bounce, no overshoot. Heavy fine grain.

PALETTE LOCK: [paste]
NEGATIVE: [paste] no text, no numbers, no labels, no 3D
```

**Recommendation: build this in GSAP instead.** It is the M5 animation and it is cheaper, sharper, scroll-linked, and responsive as code. Only generate the video if the GSAP version underdelivers.

### V-03, Project demos  🔴 REAL  `HIGH VALUE`

**Not generated. Screen recordings of the real products.**

- **8 to 15 seconds each, silent, 1920x1080, looping**
- One per project, showing the single most impressive interaction
- Trim ruthlessly, no cursor hunting, no loading states

| Project | Record |
|---|---|
| SimplyBox | A message arriving, the AI drafting a grounded reply, and one agent handling it in a single view |
| RoyaleCard Arena | Configuring a rule on a card, then the draft and ban phase |
| Snapose | The offline path: connection drops, capture continues, connection returns, sync completes |
| Franchise System | A sale at POS decrementing inventory and landing in the finance view |

A ten-second clip of Snapose surviving a dropped connection is worth more than every generated image in this document. If time is short, make these.

---

# Production order

| Priority | Assets | Blocks |
|---|---|---|
| **1** | T-01 grain tile | Everything |
| **2** | H-01, H-02 fields | Hero, all sections |
| **3** | P-01 to P-05 project covers | Featured work, the main conversion section |
| **4** | Team portraits | Team section |
| **5** | S-01 to S-06 thumbnails | Services |
| **6** | B-01, B-04, B-05, B-06 bento | Bento grid |
| **7** | CS-arch diagrams | Case studies |
| **8** | CS-hero, CS-gallery | Case studies |
| **9** | OG images | Sharing |
| **10** | V-03 product recordings | Case studies, high value |
| 11 | Insights imagery | Only if the blog ships |
| 12 | V-01, V-02 | Optional, only if the budget allows |

Items 1, 2, 5, and 6 are generated and can be done in an afternoon. Items 3, 4, 7, and 10 need you and are the ones that actually sell the studio.

---

# Delivery

```
public/
  grain/        grain-256.png
  fields/       hero.avif  hero.webp  section-warm.avif
  bento/        b01.avif ... b06.avif
  services/     s01.avif ... s06.avif
  work/
    simplybox/  cover.avif  hero.avif  gallery-01..n.avif  demo.webm
    royalecard/ ...
    snapose/    ...
    franchise/  ...
  team/         dylansius.avif  daffa.avif
```

**Format rules.** AVIF primary, WebP fallback, both through `next/image`. Video is AV1 in WebM with an H.264 MP4 fallback. Nothing ships as PNG except the grain tile, which needs alpha.
