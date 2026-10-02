# Crescens Labs, Portfolio Site

Company portfolio site for Crescens Labs. Target quality bar: award-submission level. Reference build is `kudos.framer.media`, structurally torn down in `docs/REFERENCE-TEARDOWN.md`.

## What Crescens Labs is

An antique studio, two people, that builds end-to-end custom software. Apps, websites, internal systems, AI integration, and consulting.

**End to end means:** structure the problem, architect the solution, iterate it, then train the client and hand over, so the client can operate and extend the system without us. We build it for them, not for us.

**The positioning line:** most clients arrive unsure what their actual problem is. Our job is not to teach them their business, they know it better than we do. Our job is to help them find the problem worth solving, then build it with them.

**Team**
- Dylansius Putra, Founder, PM, Fullstack Developer
- Daffa Hasanal Arkaan, Founder, Lead Engineer

### Proof, competition

1. **SimplyBox**, Llama AI Accelerator, top 7. The only active student team to advance. An AI unified inbox for the Meta ecosystem that cuts business response time by 80%+. RAG over the company's own ingested knowledge, so answers are grounded and hallucination drops. CS agents work one inbox instead of many apps.
2. **RoyaleCard Arena**, winner, National Campus Hackathon (Solana Foundation with Colosseum Frontier, one of the largest national blockchain competitions). Open-world competitive strategy game where market knowledge is the trading edge. Players configure rules on cards and the cards trade for them, so strategy is iterated rather than hand-executed. MOBA-style draft and ban: scout an opponent's profile, ban their best-performing card. Paper trading in the open world, escrow and winner-takes-all in the arena. Best of 3, two-minute battles, three single-use interactive buttons per game that can change the course of a match. Shipped to a second hackathon with the same deadline: video, deck, X launch, everything, finished a full day early.
3. Co-founder won Grab's marketing competition against 100+ participants. The studio can build the product and sell it.

### Proof, professional

1. **Photobooth studio software.** Competitors sell software only. We embedded auto-finance with waste analysis so the books reconcile themselves. The old flow needed 5+ apps and assumed connectivity, but venues are crowded and internet is the biggest failure point. So the architecture is offline-first with auto-sync to Drive: data is backed up, and it syncs across laptops sharing that Drive instead of being locked to one device.
2. **Franchise system**, in build, for one of the largest Ayam Taliwang chains in Solo and greater Central Java. Operations, POS, finance and accounting, inventory, logistics, HR, wired into one robust and scalable system.
3. **Kost chain system**, in discussion, for one of the largest kost operators in Lampung.

### Coming soon
Digital products from the lab itself: frameworks and tooling. Needs a real section on the site, marked as upcoming, used to build an audience now.

## Brand

Logo is a dot cluster forming a `C` beside a wordmark. Two color variants exist and both use heavy film grain:
- `assets/logo/logo.png`, deep green and black
- `assets/reference/reference.png`, teal and near-black

Grain is core to the identity and carries into the site. The lilac dot accent is the one warm note against a cold dark field.

**Palette, locked:** Deep Forest. Field `#091410`, accent `#DDBFD1` (the logo's own pink, unmodified) on dark, `#5A1B41` on light. Type is Inter + JetBrains Mono. Full token set and contrast table in `docs/DESIGN-SYSTEM.md`.

**Tagline:** `Don't trust. Verify.`

It reads as crypto-native on its own, which is not a problem given the Solana hackathon win, but it only becomes *ours* if the site backs it. That means published architecture diagrams, a documented handover scope, and every number carrying a source. The tagline is a promise the content model has to keep, so `content/` requires a `source` field on numeric claims and a test enforces it. If a claim ever ships without attribution, the tagline turns into a liability.

## Docs

| File | Purpose |
|---|---|
| `docs/REFERENCE-TEARDOWN.md` | Measured structural and motion spec of the reference. Source of truth for layout and animation. |
| `docs/TECH-STACK.md` | Stack, versions, rationale. |
| `docs/DESIGN-SYSTEM.md` | **Locked.** Deep Forest palette + Inter. Rendered live at `/directions`. |
| `docs/CONTENT-MODEL.md` | Per-section content schema with visual diagrams. |
| `docs/ASSET-BRIEF.md` | Image and video generation prompts. |
| `docs/BUILD-PLAN.md` | Phased implementation plan. |

## Skill navigation

63 project skills are installed in `.Codex/skills/`. Full upstream repos are kept in `.Codex/skill-sources/` so any additional skill can be promoted by copying its folder into `.Codex/skills/`.

Do not fish through the list. Use this map.

### Before building anything
| Need | Skill |
|---|---|
| Turn an idea into an approved spec | `brainstorming` |
| Turn a spec into an implementation plan | `writing-plans` |
| Execute a written plan across sessions | `executing-plans` |
| Split independent work across agents | `subagent-driven-development`, `dispatching-parallel-agents` |
| Claim something is done | `verification-before-completion` (evidence first, always) |

### Design and visual direction
| Need | Skill |
|---|---|
| Overall anti-generic frontend direction | `taste-skill` |
| Editorial, monochrome, bento, no gradients | `minimalist-skill` |
| Make it feel expensive, not templated | `soft-skill` |
| Brand boards and identity systems | `brandkit` |
| UI polish and the invisible details | `emil-design-eng` |
| Gesture, spring, material, optical type | `apple-design` |
| Audit and upgrade something already built | `redesign-skill` |
| Generate section-by-section design comps | `imagegen-frontend-web` |
| Build code from a design image | `image-to-code-skill` |

### Motion
| Need | Skill |
|---|---|
| Core tweens, easing, stagger, matchMedia | `gsap-core` |
| Scroll-linked, pinning, scrub | `gsap-scrolltrigger` |
| Sequencing | `gsap-timeline` |
| React and Next integration, `useGSAP`, cleanup | `gsap-react` |
| SplitText, Flip, Observer, ScrollSmoother | `gsap-plugins` |
| FPS, jank, layout thrashing | `gsap-performance` |
| Helper math: clamp, mapRange, snap, wrap | `gsap-utils` |
| Name an effect you can only describe | `animation-vocabulary` |
| Find places that should animate but don't | `find-animation-opportunities` |
| Audit and plan motion improvements | `improve-animations` |

### Copy, SEO, conversion
| Need | Skill |
|---|---|
| Set product and audience context first | `product-marketing` (writes `.agents/product-marketing.md`) |
| Write page copy | `copywriting` |
| Tighten copy that already exists | `copy-editing` |
| Strip AI tells from any prose | `humanizer` |
| Get cited by AI search, `llms.txt` | `ai-seo` |
| Technical and on-page SEO | `seo-audit` |
| JSON-LD and rich results | `schema` |
| Page and nav structure | `site-architecture` |
| Improve a page that is not converting | `cro` |
| Why people decide | `marketing-psychology` |
| Package the digital products | `offers`, `pricing`, `lead-magnets` |
| Ship the digital products publicly | `launch` |
| Multiple expert opinions on one call | `marketing-council` |

### Code discipline
| Need | Skill |
|---|---|
| Refuse over-engineering while writing | `ponytail` |
| Review a diff for bloat | `ponytail-review` |
| Scan the whole repo for bloat | `ponytail-audit` |
| Track deferred shortcuts | `ponytail-debt` |
| Debug anything | `systematic-debugging` |
| Prevent truncated or placeholder output | `output-skill` |

### Component sources
Not skills. Read from `.Codex/skill-sources/`.
- `canvas-ui/` , registry at `src/lib/registry.ts`, MCP docs at `src/app/(shell)/docs/mcp`
- `VengeanceUI/` , components at `src/components`, registry at `src/registry`
- `thinking-orbs/` , dotted orb loaders. Strong fit for the logo's dot motif.

## Working rules for this repo

- No em-dashes in anything a visitor reads. Applies to site copy and to these docs.
- Run `humanizer` over every block of site copy before it lands.
- Motion respects `prefers-reduced-motion`. Every scroll effect needs a static fallback.
- One accent color. If a second one appears, it is a bug.
- Every numeric claim carries a `source`. The tagline demands it.
- Commit at every milestone, locally only, no attribution.
- Performance is a feature. Lighthouse target 95+ on mobile with the animations on.
- **No phase closes without its gate passing.** Gates are defined in `docs/BUILD-PLAN.md`. `pnpm gate` before every commit.
- Two animation libraries only: GSAP for scroll-linked, Motion for state and exit. Anything that can be CSS should be CSS. Do not add a third.

## Self Learning Logs
Technical lessons from building this repo. Newest on top. Root cause + rule, one short entry each.

### 2026-08-12 - Signature section needs its own scrub, the primitive is not enough
- **Cause:** Reusing `ProcessBar` for the Process section's five bars gave once-on-enter scaleX, but the section's whole point is a metered fill, scrubbed per row as the row passes. The primitive was right for the styleguide stat context and wrong for the signature section.
- **Rule:** When motion is the content (`Process` metering, hero entrances), write bespoke GSAP with `ScrollTrigger` per row, keyed to that section's pattern. Reuse primitives for the long tail of stat-style fades and simple reveals. CSS paints the end state at the final width so opted-out visitors see the finished meter.

### 2026-08-12 - Editorial monogram beats fabricated UI capture
- **Cause:** No client screenshots exist for any shipped project. A stock UI capture would not pass the tagline and reads as a placeholder; a real screenshot would be dishonest about shipped scope. The Featured work covers render as oversized initials in a bordered frame, dot-cluster ghost behind them, accent index in the corner.
- **Rule:** When an asset is missing and fabricating it would fail the verification ethos, render art direction instead. A monogram is a plan, not a dodge: same visual language on every cover means the gallery reads as a series and the absence of the screenshot never shows.

### 2026-08-12 - Bento grid balance by bookending the spans
- **Cause:** A six-card grid on a 4-col layout left one empty slot when opener + closer both spanned 1. The eye reads the negative space as a gap rather than as design choice.
- **Rule:** Bookend the bento: opener (offline) spans 2 at the left of row 1, closer (yours) spans 2 at the right of row 2. Total cells filled exactly, grid reads as a designed object.

### 2026-08-12 - Split SVG fill and stroke classes to keep rects borderless
- **Cause:** Setting both `fill` and `stroke` on a single class for the bento visuals added a thin outline to every filled rect, because every rect that uses the class picks up both properties even though it only uses `fill`.
- **Rule:** Name SVG helpers by what they target: `.vizShape*` for fills on rects, `.vizStroke*` for strokes on lines. One class touching both adds outlines to objects that did not ask for them.

### 2026-08-12 - Constant-literal `as const` arrays break absent property access
- **Cause:** Marking the contact `fields` array as `const` made the optional `required` field `absent` on items that did not set it, not `false`. TypeScript refused `f.required` because two of four items lacked the key.
- **Rule:** Either define a typed `Field` shape and stop using `as const`, or include `required: false` on every item so the union stays uniform. The set of optional fields in a typed content array needs every optional key to exist on every item.

### 2026-08-03 - Muddy text was a lightness problem, not a hue problem
- **Cause:** `#8FA79A` secondary text looked murky against the green field. The instinct was to shift hue (a warm taupe), which the user rejected on sight because it fought the green system. The real defect was that it sat at 7.29:1 with no meaningful gap to the tones above and below it.
- **Rule:** When text reads as muddy, measure the gaps between ink, muted, and faint before changing hue. Fix by opening the lightness ladder inside the existing family.

### 2026-08-03 - Canvas UI splits into two dependency families
- **Cause:** Assumed the whole library was comparable in weight. `DitheredObject`, `AsciiObject`, `ParticleObject`, `GlassObject`, and `LiquidObject` import three.js plus GLTFLoader and need a `.glb` model. Everything else is self-contained WebGL2 at ~10 to 20kb.
- **Rule:** Grep for `from "three"` in the vanilla implementation before proposing any Canvas UI effect. The `*Object` suffix is the tell.

### 2026-08-03 - Turbopack root must be pinned when a lockfile exists above the project
- **Cause:** A `pnpm-lock.yaml` in the home directory made Next infer the workspace root there, producing "Could not find the module ... in the React Client Manifest" 500s. `__dirname` does not exist in an ESM `next.config.ts`, so the first fix silently did nothing.
- **Rule:** Pin `turbopack.root` with `dirname(fileURLToPath(import.meta.url))`, then delete `.next`. A stale manifest survives a config fix.

### 2026-08-03 - Animating width contradicts the motion spec
- **Cause:** The direction pitch animated the process bar with `width`, while `REFERENCE-TEARDOWN.md` M5 specifies `scaleX` with `transform-origin: left`. A design hook caught it. Width animation triggers layout on every frame, which is exactly the jank the spec exists to avoid.
- **Rule:** Never animate `width`, `height`, `padding`, or `margin`. Transform and opacity only. When a doc already specifies the technique, follow it in throwaway demos too, because the demo is what gets copied into the build.

### 2026-08-03 - Tests on a marketing site should target content, not components
- **Cause:** Default instinct is component coverage, which on a presentational site asserts that markup is markup. The failures that would actually ship here are a leaked client name behind a `false` flag, an em-dash in copy, an unsourced number, and a reduced-motion fallback stuck at `opacity: 0`.
- **Rule:** Test invariants over content data and cross-cutting rules. The reduced-motion assertion is the highest-value test in the suite, because that bug is invisible in normal review and blanks the page for the users who need the fallback.

### 2026-08-03 - Reference motion values must be measured, not eyeballed
- **Cause:** Scroll recordings show what an effect looks like but not its easing, duration, or trigger offsets. Reading the frames alone would have produced a plausible but wrong motion spec.
- **Rule:** For any reference site, extract computed styles from the live DOM before writing a spec. The reference's entire motion language turned out to be one token, `cubic-bezier(0.44, 0, 0.56, 1)`, at 0.3s for state and 1s for scroll. That is not guessable from video.

## Self Insight Logs
What the user likes, dislikes, and expects. Newest on top. Observation + how to apply, one short entry each.

### 2026-08-12 - Sessions resume fast from a compacted context dump
- **Observed:** Supplied a tight summary of the previous session as a single paste (visual specs, what shipped, what is unwired, what to do next) instead of asking me to re-fetch a 5MB shared session URL.
- **Apply:** Treat compacted session dumps as primary context. Skim once, verify against the live files, then act. The user trusts the dump is accurate, which is faster than re-discovering with codebase exploration.

### 2026-08-12 - Wants the reference's signature sections executed faithfully, not loosely translated
- **Observed:** Made clear the Featured work centerpiece and the Process signature section should land as the reference does, with monogram covers and scrubbed meter bars, not as reduced versions.
- **Apply:** When the content model diagrams a section as a sticky-scroll gallery or a metered process, ship that exact pattern (CSS sticky, per-row scrub), not a simpler stacked list. The simplification reads as a downgrade to anyone who has seen the reference.

### 2026-08-12 - Untagged work gets honestly dropped rather than shipped thin
- **Observed:** Did not challenge the unsigned Kost project shipping as a Featured work card. Per the content model's open item, four strong beats five where one is speculative.
- **Apply:** When a content item is in discussion and not signed, drop it from the public page; the footer of the section can wait for the signature. Showing thin work to look larger fails the page's own posture.

### 2026-08-03 - Brand colors get refined, not replaced
- **Observed:** Rejected a saturated magenta accent and asked for the original soft pink back, then rejected a warm taupe secondary. Both replacements were more "correct" by contrast math but neither was the brand's color anymore.
- **Apply:** When something reads weak, adjust lightness and the gaps around it before changing hue. Treat the sampled logo colors as fixed points. Bring the measurements, but let them serve the brand rather than override it.

### 2026-08-03 - Component references are a menu, not a checklist
- **Observed:** Listed five Canvas UI and VengeanceUI effects, then said explicitly they were references and to push back on anything that would read as norak or excessive.
- **Apply:** Evaluate each against real source and cost, then say plainly which are in and which are out with the reason. Rejecting `Bend` because it curves the grid the whole layout depends on was the expected answer, not an unhelpful one.

### 2026-08-03 - Wants work in the repo, not in artifacts
- **Observed:** Asked not to publish an artifact and to build the comparison as a real route in the codebase instead.
- **Apply:** Build previews as routes under `app/`, run the dev server, and screenshot. Artifacts are for throwaway comparisons only, and this project is past that stage.

### 2026-08-03 - Options must be shown, not described
- **Observed:** Asked for three design systems to be presented visually so they could pick, and pushed back when the token doc was written before that choice existed. A markdown table of hex codes is not a thing anyone can decide from.
- **Apply:** When a decision is visual, build the comparison as a real rendered page with the actual palette, grain, type, and motion, then ask. Write the spec document after the pick, never before.

### 2026-08-03 - Wants verification built in, not bolted on
- **Observed:** Asked for the build plan to carry verification gates and tests, and to add Vitest, unprompted by any failure.
- **Apply:** Ship plans with pass/fail commands per phase and enforced budgets rather than prose checklists. This user treats "done" as something proven, which matches the studio's own handover positioning.

### 2026-08-03 - Wants the reference captured forensically, not approximately
- **Observed:** Supplied a 71-second screen recording and asked explicitly for frame-by-frame capture of animations, transitions, and UI, then said to use a headless browser on top of that.
- **Apply:** Treat reference fidelity as a deliverable in its own right. Measure, tabulate, and write it to disk before designing anything. Approximations read as laziness here.

### 2026-08-03 - Decisions get deferred until they can be made well
- **Observed:** Asked for `DESIGN-SYSTEM.md` to be written last, explicitly, so the work is efficient once the direction is fixed.
- **Apply:** Sequence docs by dependency, not by list order. Do not produce a token file before the visual direction is approved.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
