# Content Model

Per-section content schema for the Crescens Labs site. Every section below gives you the layout, the field list, the real content, and the animation hook.

**Notation.** Every diagram is drawn on the 4-column grid from `docs/REFERENCE-TEARDOWN.md`. Vertical bars `|` are the hairline dividers at 8% opacity. `[C1]` through `[C4]` mark columns.

```
 <----48----><-------------- 1425px content ---------------><----48---->
             |    C1    |    C2    |    C3    |    C4    |
             |  356px   |  356px   |  356px   |  356px   |
```

**Field types.** `text` `richtext` `image` `video` `url` `number` `list` `flag`

**Flags.** Content marked `flag:` is a switch you can flip without a redesign. All flags live in one file so the site can be re-pointed as permissions and results change.

**Sourced claims.** Any field holding a number that makes a claim uses this shape, not a bare string. `GATE 7` fails the build if `source` is missing.

```ts
type Claim = { value: string; label: string; caption?: string; source: string };
// { value: "80%+", label: "Response time", source: "SimplyBox, measured pre/post deployment" }
```

---

## 0. Global content

```ts
// content/global.ts
{
  company:   "Crescens Labs",
  wordmark:  "CRESCENS",
  tagline:   "Don't trust. Verify.",
  descriptor:"End to end software studio",
  email:     "hi@crescenslabs.com",          // shipped
  phone:     none,                          // deliberately not published
  location:  "Remote, Indonesia",           // shipped in the footer meta
  socials:   [ GitHub, X, LinkedIn, Instagram ],  // shipped, TODO(launch): confirm handles
  founded:   not published,                 // no verified year to cite yet
}
```

### Naming flags

| Flag | Default | Effect |
|---|---|---|
| `nameSnapose` | `true` | Shows the photobooth product as **Snapose**. Set `false` to render "a photobooth studio platform". |
| `nameFranchiseClient` | `false` | Renders "one of the largest Ayam Taliwang chains in Solo and greater Central Java". Never names them while `false`. |
| `nameKostClient` | `false` | Renders "one of the largest kost operators in Lampung". Never names them while `false`. |

Snapose is your product name rather than a client name, so naming it costs nothing and buys a concrete, memorable proof point. The two client engagements stay described-not-named as you asked. If you later get written permission, flip the flag, no layout changes.

---

## 1. Nav

```
 | CRESCENS                                              MENU  |
```

96px tall, `position: relative`, scrolls away and never returns, exactly like the reference. No sticky header means the hero is never crowded.

| Field | Type | Value |
|---|---|---|
| `wordmark` | image | Logo mark + CRESCENS |
| `links` | list | Work, Process, Products, About, Contact |
| `cta` | text | Book a call |

Menu opens a full-screen overlay. Links are the in-page anchors plus the case study index.

---

## 2. Hero

```
 |                                                             |
 |  We find the problem            |          |  (o)(o)(o)     |
 |  worth solving.                 |          |  Top 7, Llama  |
 |  Then build it with you.        |          |  AI Accelerator|
 |                                 |          |                |
 |  An end to end studio. We       |          |  Ready to      |
 |  structure, architect, build,   |          |  start?        |
 |  train, and hand over, so       |          | +------------+ |
 |  your system outlasts us.       |          | | Book a call| |
 |     [C1]        [C2]            |   [C3]   | +----[C4]---+ |
 |                                                             |
```

| Field | Type | Content |
|---|---|---|
| `headlineAccent` | text | `We find the problem` |
| `headlineRest` | text | `worth solving.` / `Then build it with you.` |
| `sub` | text | An end to end studio. We structure the problem, architect the solution, iterate it with you, then train your team and hand it over, so your system outlasts us. |
| `proofBadge` | object | `{ label: "Top 7", sub: "Llama AI Accelerator", detail: "the only active student team to advance" }` |
| `ctaKicker` | text | Ready to start something real? |
| `cta` | object | `{ label: "Book a call", href }` |
| `bg` | image | Grain field, deep green. See `ASSET-BRIEF.md` H-01. |

**Animation.** `position: sticky; top: 0` (M1). The wordmark band scrolls up over it. Headline words rise in on load with a 40ms stagger, house easing.

**Note on the proof badge.** The reference puts an avatar stack and a 4.9/5 star rating here. You have no client review volume yet, so that slot would be fabricated. Replacing it with the Llama accelerator result is stronger anyway: it is specific, verifiable, and it is the single most impressive thing about the studio.

---

## 3. Wordmark band

```
 | C R E S C E N S                                             |
 |^^ bleeds off both edges ^^                                  |
 |                                                             |
 | Don't trust. Verify.        |          | Every number on    |
 |                             |          | this page has a    |
 |                             |          | source. Every      |
 |                             |          | system has a       |
 |                             |          | published          |
 |                             |          | architecture.      |
```

| Field | Type | Content |
|---|---|---|
| `wordmark` | text | CRESCENS |
| `tagline` | text | Don't trust. Verify. |
| `taglineSupport` | text | Every number on this page has a source. Every system we have built has a published architecture. Check them. |

**Revised, 2026-08-03.** This section originally specified roughly 2x viewport width so the outer letters clip. Built, it read as a mistake rather than as a choice: the word came out `CRESCEN` and the eye tried to complete it instead of moving on. It now fits the frame exactly, edge to edge, with all eight letters present.

Implemented as SVG with `textLength` and `lengthAdjust`, not as text sized in `vw`. A `vw` value can only ever be approximately the width of the screen, so any value that fits at 1440 clips at 390 and any value that fits at 390 floats in a margin at 1440. `textLength` makes the browser solve it exactly at every width with no measuring code.

The dot-cluster `C` is not built. At display scale the cluster and the seven solid letters beside it read as two different logos rather than one, and the mark already appears at legible size in the nav and the loader.

**Behaviour.** `position: sticky; top: 0`, inside a containing block that spans the hero and a cream run out below it. The mark rests inside the hero's own bottom padding, so the field behind it at the moment it locks is the hero's own gradient, grain and vignette, and there is no seam to match. The cream then rises through the held letters and `mix-blend-mode: difference` sweeps the inversion across them. The block closes before the section below, so the mark releases rather than sitting on that section's heading.

**Why the tagline sits here and not in the hero.** The hero already carries a proposition ("We find the problem worth solving"). Stacking a second one weakens both. Placed under the wordmark, `Don't trust. Verify.` reads as the studio's operating principle rather than a second sales line, and it arrives immediately before the sections that prove it.

**The tagline is a contract.** It borrows a phrase the reader already knows from crypto, so it only becomes yours if the page actually delivers verification: sourced numbers, published architecture diagrams, and a documented handover scope. `Verify` in the accent color is the only accent usage in this section. If a claim ever ships without a `source` field, this line becomes a liability rather than a position, which is why `GATE 7` tests for it.

**Animation.** Slight horizontal drift on scroll, scrubbed, no more than 60px. Enough to feel alive, not enough to read as a parallax gimmick.

---

## 4. Who we are

```
 | + WHO WE ARE  |                              |             |
 |               | End to end means             | Most teams  |
 |               | end to end.                  | hand you a  |
 |               |                              | repo and go.|
 |               |                              | We hand you |
 |  ""           |                              | a system    |
 |  Our job is   |                              | you can run.|
 |  not to teach |                              |             |
 |  you your     |   [ capability marquee ]     | +---------+ |
 |  business.    |                              | | How we  | |
 |  You know it  |                              | | work    | |
 |  best.        |                              | +---------+ |
 |  [C1]         |     [C2]        [C3]         |    [C4]     |
```

| Field | Type | Content |
|---|---|---|
| `eyebrow` | text | + WHO WE ARE |
| `headingMuted` | text | End to end means |
| `headingStrong` | text | end to end. |
| `support` | text | Most studios hand you a repository and disappear. We hand you a system your team can run, extend, and defend without us. |
| `quote` | richtext | Our job is not to teach you your business, **you know it best**. Our job is to help you find **the problem worth solving**, then build it with you. |
| `quoteAuthor` | object | `{ name: "Dylansius Putra", role: "Founder", avatar }` |
| `marquee` | list | Capability chips, infinite scroll |
| `cta` | object | `{ kicker: "See how we work", label: "How we work", href: "#process" }` |

**Marquee items.** The reference runs client logos here. You do not have a logo wall yet, so run capabilities instead: `Web Apps` `Mobile Apps` `Internal Systems` `POS` `Finance & Accounting` `Inventory` `Logistics` `HR` `AI Integration` `RAG` `Offline-first` `Consulting`.

This is a genuinely better use of the slot than a thin logo wall, and it converts a weakness into a scannable capability list.

**Animation.** M8 infinite marquee. M2 word reveal on the quote.

---

## 5. Stats strip

```
 |  ....         |  ....         |  ....        |  ....       |
 |  Response time|  Apps replaced|  Systems     |  Competition|
 |               |               |  shipped     |  record     |
 |  80%+         |  5 -> 1       |  5           |  2 / 2      |
 |  cut for CS   |  one screen   |  in build or |  entered and|
 |  teams        |  not six      |  delivered   |  placed     |
 |     [C1]      |     [C2]      |    [C3]      |    [C4]     |
```

| Field | Type | Content |
|---|---|---|
| `stats` | list | 4 items: `{ dots: 4, activeIndex, label, value, caption }` |

**Values and where each comes from.**

| Value | Label | Caption | Source |
|---|---|---|---|
| `80%+` | Response time | cut for CS teams using SimplyBox | SimplyBox result |
| `5 -> 1` | Apps replaced | one screen instead of six | Snapose |
| `5` | Systems shipped | delivered or in build | SimplyBox, RoyaleCard, Snapose, Franchise, Kost |
| `2 / 2` | Competition record | entered and placed | Llama top 7, Solana hackathon win |

Four honest numbers beat four impressive ones. `2 / 2` in particular is a much better flex than a raw count, because it says you have never entered something without placing.

**Animation.** M6 count-up on enter. The `5 -> 1` and `2 / 2` render as text, no count.

---

## 6. The thesis

```
 | + WHY CRESCENS |                             |             |
 |                | Software that              | We optimise |
 |                | outlasts us.               | for the day |
 |                |                            | we leave.   |
 |                |                                          |
 |  Top 7         | A handover is not a zip file and a        |
 |  Llama AI      | goodbye. It is documentation your team   |
 |  Accelerator   | reads, architecture they can extend,     |
 |                | and training until they are faster       |
 |                | without us than they were with us.       |
 |  [C1]          |        [C2] [C3]                  [C4]   |
```

| Field | Type | Content |
|---|---|---|
| `eyebrow` | text | + WHY CRESCENS |
| `headingMuted` | text | Software that |
| `headingStrong` | text | outlasts us. |
| `support` | text | We optimise for the day we leave. |
| `revealParagraph` | richtext | A handover is not a zip file and a goodbye. It is documentation your team actually reads, an architecture they can extend on their own, and training that runs until they are faster without us than they were with us. |
| `badge` | object | Llama accelerator badge, repeated |

**Animation.** M2, the signature word-by-word color reveal, scrubbed. This is the emotional peak of the top half of the page, so it gets the site's most expensive effect.

---

## 7. Capability bento

```
 | +-------------------------------+ | +-----------+ | +--------+ |
 | | Offline-first by default      | | | GROUNDED  | | | Dot    | |
 | | Built for venues where the    | | | NOT       | | | orb    | |
 | | internet is the failure point | | | GUESSING  | | | viz    | |
 | |                               | | +-----------+ | +--------+ |
 | | > sync   > backup   > 100%    | |               |            |
 | +-------------------------------+ | +-----------+ | +--------+ |
 |                                   | | One inbox | | | Books  | |
 |                                   | | not six   | | | that   | |
 |                                   | | [ chart ] | | | close  | |
 |          [C1] [C2]                | +---[C3]----+ | +--[C4]--+ |
```

Six cards, irregular heights, mixed treatments.

| # | Span | Title | Body | Visual |
|---|---|---|---|---|
| 1 | 2 cols | **Offline-first by default** | Venues are crowded and the internet is the first thing to fail. We architect for that, then sync when the connection returns. | Grain field + icon list (Sync / Backup / Multi-device) opposite a huge `100%` uptime figure |
| 2 | 1 col | **GROUNDED NOT GUESSING** | Accent card. RAG over your own knowledge, so the AI answers from your documents instead of inventing. | Oversized type clipped by the card edge, reference's `BETTER LESS` treatment |
| 3 | 1 col | Dot orb | Live animated dot cluster echoing the logo mark. | `thinking-orbs` from `.claude/skill-sources/thinking-orbs` |
| 4 | 1 col | **One inbox, not six** | CS teams were opening six apps to answer one customer. Now they open one. | Descending bar chart, six bars to one |
| 5 | 1 col | **Books that close themselves** | Auto finance capture with waste analysis, so reconciliation stops being a monthly fire. | Abstract ledger blocks, one accent |
| 6 | 1 col | **Yours on day one** | Documentation, architecture, and training built into the engagement, not sold as an extra. | Stacked-document visual |

**Animation.** M9 staggered fade-in, 70ms. Card 3 runs continuously. Card 4 bars animate height on enter.

---

## 8. What we build

```
 | + SERVICES |  * 01 | [img] | Custom Web Apps  | Description |
 |            |  * 02 | [img] | Mobile Apps      | Description |
 | What we    |  * 03 | [img] | Internal Systems | Description |
 | build.     |  * 04 | [img] | AI Integration   | Description |
 |            |  * 05 | [img] | Product & Arch   | Description |
 | sticky     |  * 06 | [img] | Consulting       | Description |
 | top:96px   |       |       |                  |             |
 |   [C1]     |  [C2] |       |       [C3]       |    [C4]     |
```

| Field | Type | Content |
|---|---|---|
| `eyebrow` | text | + SERVICES |
| `headingAccent` | text | What we |
| `headingRest` | text | build. |
| `support` | text | Six things, done properly, for teams that need the system to still work in three years. |
| `items` | list | 6 items: `{ index, thumb, title, body }` |
| `closingQuote` | richtext | Most clients arrive unsure what the real problem is. **Finding it is the work.** Building it is the easy part. |
| `cta` | object | `{ kicker: "Let's scope it", label: "Get in touch" }` |

**The six.**

| # | Title | Body |
|---|---|---|
| 01 | Custom Web Apps | Products and platforms built to your operation, not bent around a template. Performance and long-term maintainability are requirements, not extras. |
| 02 | Mobile Apps | Native-feeling applications for teams that work away from a desk, designed to stay useful when the connection does not. |
| 03 | Internal Systems | Operations, POS, finance and accounting, inventory, logistics, and HR. Wired into one system instead of six that disagree with each other. |
| 04 | AI Integration | RAG over your own knowledge so answers stay grounded. We integrate AI where it removes work, and we say no where it only adds risk. |
| 05 | Product & Architecture | Problem structuring, scoping, and system design. The part that decides whether the build succeeds before a line is written. |
| 06 | Consulting & Handover | Documentation, architecture review, and training until your team ships without us. |

**Animation.** M3 sticky rail at 96px. M9 row fade as each enters. Thumbnails scale from 0.94 to 1 on enter.

---

## 9. Process

The signature section. This is where the E2E positioning becomes visible rather than claimed.

```
 | + PROCESS  |                          |                     |
 | Structure  |                          | Five stages. You    |
 | meets      |                          | own the system at   |
 | shipping.  |                          | the end of stage 5. |
 |                                                             |
 | +==================+||||||||||||||||||||||||||||||||||||||| |
 | | 01  Structure    |                                        |
 | *      | We map the problem before   | Outcome:            |
 |        | we design a solution.       | A problem worth     |
 |        |                             | solving, in writing.|
 |                                                             |
 | +=========================+||||||||||||||||||||||||||||||||| |
 | | 02  Architect          |                                  |
 | *      | ...                         | Outcome: ...        |
 |                                                             |
 | +==================================+|||||||||||||||||||||||| |
 | | 03  Build & Iterate               |                       |
 |                                                             |
 | +==============================================+|||||||||||| |
 | | 04  Train                                    |            |
 |                                                             |
 | +====================================================+|||||| |
 | | 05  Handover                                       |      |
 |   [C1]         [C2]            [C3]          [C4]           |
```

Each bar is wider than the last, so the section reads as a filling progress meter. The remainder of each row is a dense vertical tick pattern.

| # | Stage | Description | Outcome |
|---|---|---|---|
| 01 | Structure | Most clients know their business better than we ever will, but not which problem is worth money. We map the operation, find the constraint, and write it down before anyone designs anything. | A problem worth solving, agreed in writing. |
| 02 | Architect | We design the system around how you actually operate, including the parts that fail. Offline paths, sync, roles, and the reporting you will need later. | An architecture your team can read and extend. |
| 03 | Build & Iterate | We ship in slices you can use, then change them against real usage instead of assumptions. You see it working long before it is finished. | Working software, iterated against reality. |
| 04 | Train | Your team learns the system while it is being built, not after. Documentation is written for them, not for us. | A team that operates it without asking us. |
| 05 | Handover | Code, docs, architecture, and access transfer to you. We stay reachable, but you are not dependent on it. | Full ownership. You can outlast us. |

**Animation.** M5. Bar `scaleX` from 0 to target, `transform-origin: left`, house easing, scrubbed, staggered per row. The tick pattern is a repeating linear-gradient behind the bar, not 400 DOM nodes.

---

## 10. What working together looks like

```
 | + ENGAGEMENT | What to expect | What you get  | What it takes|
 |              | Weekly demos,  | A system, its | Access to the|
 |              | one owner, no  | documentation,| people who    |
 |              | account layer. | and a team    | know the      |
 |              |                | trained on it.| operation.    |
 |    [C1]      |     [C2]       |     [C3]      |    [C4]      |
```

| Field | Type | Content |
|---|---|---|
| `items` | list | 3 items: `{ title, body }` |

| Title | Body |
|---|---|
| What to expect | Weekly working demos, one owner who knows your project, and direct access to the people writing the code. No account management layer. |
| What you get | A working system, documentation your team reads, an architecture they can extend, and training until they are independent. |
| What it takes | Access to the people who actually run the operation, and honest answers about what is broken. We can find the problem, but only you can show us the floor. |

---

## 11. Featured work

Three-column sticky scroll gallery. Five projects.

```
 | A selection of  | +----------------------+ | SimplyBox     |
 | work where the  | |                      | | AI unified    |
 | hard part was   | |   [ project visual ] | | inbox         |
 | the problem,    | |                      | |               |
 | not the code.   | |                      | | Year:  2025   |
 |                 | +----------------------+ | Type:  Product|
 | Team CRESCENS   |                          |               |
 | 2026            | +----------------------+ | Description   |
 |                 | |                      | |               |
 | Systems | Comps | |   [ project visual ] | | View case     |
 |   5     |  2/2  | |                      | | study      :  |
 | sticky top:192  | +----------------------+ | sticky top:192|
 |     [C1]        |      [C2]      [C3]      |     [C4]      |
```

| Field | Type | Content |
|---|---|---|
| `intro` | richtext | A selection of work where **the hard part was the problem**, not the code. |
| `teamBlock` | object | `{ label: "Team", value: "CRESCENS", year: "2026" }` |
| `stats` | list | 2x2 as shipped: Systems `5`, Competitions `2/2`, Apps replaced `5 to 1`, People on the build `2`. Users reached dropped: no verified number to cite, and the tagline forbids an unsourced one |
| `projects` | list | 5 items |

### Project schema

```ts
{
  slug, name, subtitle, year, type, client,   // client honours the naming flags
  summary,        // 3-4 lines shown on the home page
  cover,          // image
  href,           // /work/<slug>
  flag_named,     // whether the client may be named
}
```

### The five

| # | Name | Subtitle | Year | Type | Home summary |
|---|---|---|---|---|---|
| 1 | **SimplyBox** | AI unified inbox | 2025 | Product, competition | Customer service teams were opening six apps to answer one message. SimplyBox unifies the Meta ecosystem into one inbox and answers from the company's own ingested knowledge using RAG, so replies are grounded instead of invented. Response time down 80%+. Top 7 at the Llama AI Accelerator, the only active student team to advance. |
| 2 | **RoyaleCard Arena** | On-chain strategy game | 2025 | Product, competition | An open-world competitive game where market knowledge is the edge. You do not trade, you configure rules on cards and the cards trade for you, so strategy compounds instead of resetting. MOBA-style draft and ban, escrowed arena matches, best of three. Winner, National Campus Hackathon by the Solana Foundation with Colosseum Frontier. |
| 3 | **Snapose** | Photobooth studio platform | 2025 | Client product | Competitors sell photobooth software. We shipped the operation around it: auto finance capture with waste analysis, and an offline-first architecture that syncs to Drive when the connection returns. Six apps became one, and the data stopped being trapped on a single laptop. |
| 4 | **Franchise System** | Multi-outlet operations platform | 2026 | Client, in build | A full operating system for one of the largest Ayam Taliwang chains in Solo and greater Central Java. Operations, POS, finance and accounting, inventory, logistics, and HR in one system rather than six that disagree. |
| 5 | **Kost Operations** | Property management system | 2026 | Client, in discussion | A rigid, upgradeable system for one of the largest kost operators in Lampung. Scoped so their team owns and extends it after handover. |

**Animation.** M4 per-project meta pin at 192px. M3 sticky left rail. M6 count-up on the 2x2 stats.

**Note on project 5.** It is in discussion, not signed. Label it honestly as `In discussion` rather than implying delivery. If you would rather not show unsigned work at all, drop it and run four. Four strong beats five where one is speculative.

---

## 12. Recognition

Replaces the reference's testimonial section, because you do not yet have client quotes and inventing them is not an option.

```
 | + RECOGNITION |                          |                  |
 |               | Judged, not              | Two competitions.|
 |               | self-declared.           | Two placements.  |
 |                                                             |
 |  [ large scroll-reveal statement paragraph spanning C2-C3 ] |
 |                                                             |
 |  Top 7       | Winner        | 1st of 100+  | 1 day        |
 |  Llama AI    | Solana Nat.   | Grab Marketing| early        |
 |  Accelerator | Campus Hack   | Competition  | on a dual    |
 |              |               |              | deadline     |
 |    [C1]      |    [C2]       |    [C3]      |    [C4]      |
```

| Field | Type | Content |
|---|---|---|
| `eyebrow` | text | + RECOGNITION |
| `headingMuted` | text | Judged, not |
| `headingStrong` | text | self-declared. |
| `revealParagraph` | richtext | We have entered two competitions and placed in both. SimplyBox reached the top 7 of the Llama AI Accelerator as the only active student team in the round. RoyaleCard Arena won the National Campus Hackathon run by the Solana Foundation with Colosseum Frontier. One of us also won Grab's marketing competition against more than 100 entrants, which is how we know the difference between building a product and selling one. |
| `awards` | list | 4 cells |

| Value | Label | Caption |
|---|---|---|
| Top 7 | Llama AI Accelerator | Only active student team to advance |
| Winner | National Campus Hackathon | Solana Foundation with Colosseum Frontier |
| 1st / 100+ | Grab Marketing Competition | We can build it and sell it |
| 1 day early | Dual deadline | Deck, video, launch post, all shipped ahead |

**The `1 day early` cell earns its place.** Two hackathon deadlines landed on the same day and everything went out a full day ahead. For a client evaluating a two-person studio, delivery under pressure is the exact anxiety they have. This answers it with a fact.

**Animation.** M2 word reveal on the statement. M9 on the award cells.

---

## 13. Team

Two people, so the reference's four-portrait row is redesigned into two large editorial portraits.

```
 | + TEAM                                                      |
 | Two people.                          | Small enough to know |
 | Full ownership.                      | your system by heart.|
 |                                                             |
 | +-------------------+  +-------------------+                |
 | |                   |  |                   |                |
 | |   [ portrait ]    |  |   [ portrait ]    |                |
 | |                   |  |                   |                |
 | +-------------------+  +-------------------+                |
 | Dylansius Putra        Daffa Hasanal Arkaan                 |
 | Founder, PM,           Founder,                             |
 | Fullstack Developer    Lead Engineer                        |
 |    [C1]      [C2]         [C3]        [C4]                  |
```

| Field | Type | Content |
|---|---|---|
| `eyebrow` | text | + TEAM |
| `headingMuted` | text | Two people. |
| `headingStrong` | text | Full ownership. |
| `support` | text | Small enough that both of us know your system by heart. Large enough to have shipped five of them. |
| `members` | list | 2 items: `{ name, role, portrait, bio, links }` |
| `closing` | richtext | No account managers, no handoffs, no one learning your business on your budget. **You talk to the people building it.** |
| `cta` | object | `{ kicker: "Built by specialists", label: "More about us" }` |

| Name | Role | Bio |
|---|---|---|
| Dylansius Putra | Founder, PM, Fullstack Developer | Structures the problem and owns delivery. Won Grab's marketing competition against 100+ entrants, which is why scoping conversations here start with your economics rather than your feature list. |
| Daffa Hasanal Arkaan | Founder, Lead Engineer | Owns architecture and the build. Designs for the failure cases first, which is how Snapose ended up offline-first and why the franchise system survives a bad connection at an outlet. |

**Animation.** M7 desaturate to color on enter, staggered. Two large cards, portraits at 4:5.

---

## 14. From the lab (coming soon)

New section, no reference equivalent. This is the digital products teaser plus waitlist.

```
 | + FROM THE LAB |                       |                    |
 |                | What we learned,      | The frameworks we  |
 |                | packaged.             | use internally,    |
 |                |                       | made available.    |
 |                                                             |
 | +---------------------+  +---------------------+            |
 | | COMING SOON         |  | COMING SOON         |            |
 | | <Product one>       |  | <Product two>       |            |
 | | One line on what    |  | One line on what    |            |
 | | it does             |  | it does             |            |
 | +---------------------+  +---------------------+            |
 |                                                             |
 | Be first when it ships                                      |
 | [ your@email.com                          ] [ Notify me ]   |
 |    [C1]      [C2]           [C3]              [C4]          |
```

| Field | Type | Content |
|---|---|---|
| `eyebrow` | text | + FROM THE LAB |
| `headingMuted` | text | What we learned, |
| `headingStrong` | text | packaged. |
| `support` | text | The frameworks and tooling we built to run our own projects, being prepared for release. |
| `products` | list | 3 items as shipped: `{ name, status, tag, what, who }` |
| `capture` | object | `{ kicker: "Be first when it ships", placeholder, cta: "Notify me", consent }` |

**Open item, closed 2026-08-17.** The products are named and shipped: Field AI (AI specialized workflow and tools), The Ledger (back and forth development workflow, everything recorded), Harness Playbook (efficient AI workflow and harness). Three rows under the decrypt veil, coming soon ticker above, waitlist capture below.

**Animation.** Cards get a subtle grain-shift on hover. The capture field is the only true form control above the contact section, so it gets a focus state with the accent.

---

## 15. Engagement models

The reference shows a `$6,468/month` price. You should not.

```
 | + ENGAGEMENT | Project        | Retainer      | Consulting   |
 |              | Fixed scope,   | Ongoing build | Architecture |
 | How we       | clear deadline,| and iteration | review and   |
 | work         | full handover  | for teams     | problem      |
 | together.    |                | already live  | structuring  |
 |              | > scoped in    | > continuous  | > fixed      |
 |              |   writing      |   delivery    |   engagement |
 |              | > fixed price  | > monthly     | > outcome    |
 |              | > handover     | > cancel any  |   document   |
 |              |   included     |   time        |              |
 |              |                                               |
 |              | Every engagement ends with handover.          |
 |              | That is not an upsell.        [ Book a call ] |
 |    [C1]      |     [C2]       |     [C3]      |    [C4]      |
```

| Field | Type | Content |
|---|---|---|
| `eyebrow` | text | + ENGAGEMENT |
| `headingAccent` | text | How we work |
| `headingRest` | text | together. |
| `models` | list | 3 items: `{ name, description, points }` |
| `footnote` | text | Every engagement ends with handover. That is not an upsell, it is the definition of the work. |
| `cta` | object | `{ label: "Book a call" }` |

**Why no numbers.** Custom E2E work at your stage is scoped per client, and a public monthly figure would either underprice the franchise-system class of work or scare off the smaller ones. Publishing engagement *shapes* instead of prices keeps the qualifying conversation where it belongs, on a call, while still answering the "how does this work" question that makes people bounce. Revisit once you have a productised tier.

---

## 16. FAQ

```
 |                | Good questions,          | Straight answers |
 |                | straight answers.        | about scope,     |
 |                |                          | cost, and what   |
 |                |                          | happens after.   |
 |                |                                             |
 | Working with   | 01  How do projects start?           ....   |
 | Crescens       |     Answer text, open by default            |
 |                | 02  Who will I actually work with?     :    |
 |                | 03  What if I don't know the problem?  :    |
 |                |                                             |
 | Scope & cost   | 04  How is pricing structured?         :    |
 |                | 05  How long does a system take?       :    |
 |                                                              |
 | After handover | 06  What does handover include?        :    |
 |                | 07  Are you still available after?     :    |
 |                | 08  Can our team extend it ourselves?  :    |
 |    [C1]        |          [C2] [C3]                    [C4]  |
```

| # | Group | Question | Answer |
|---|---|---|---|
| 01 | Working with Crescens | How does a project start? | With a call about your operation, not your feature list. We map where the work actually breaks, then write down the problem we think is worth solving. If we disagree with your brief, you hear it before you spend anything. |
| 02 | Working with Crescens | Who will I actually work with? | Both of us. There are two people in the studio and no account layer, so the people scoping your project are the people building it. |
| 03 | Working with Crescens | What if I don't know what the problem is? | That is the normal case, and it is the part we are best at. You know your business better than we ever will. We are there to turn that knowledge into a problem worth building against. |
| 04 | Scope & cost | How is pricing structured? | Three shapes: fixed-scope projects, ongoing retainers, and consulting engagements. Which one fits depends on whether the scope is knowable up front. We tell you which after the first call. |
| 05 | Scope & cost | How long does a system take? | A focused product ships in weeks. A full multi-module operations platform runs months, delivered in slices you can use as they land rather than all at the end. |
| 06 | After handover | What does handover actually include? | Source, infrastructure access, architecture documentation, operating documentation written for your team, and training sessions until they are running it unaided. |
| 07 | After handover | Are you still available afterwards? | Yes, and the point is that you should not need us. We stay reachable for changes, but the system is built so your team is not blocked waiting on ours. |
| 08 | After handover | Can our team extend it themselves? | That is the design constraint. Conventional stack, documented architecture, no clever tricks that only we understand. |

**Animation.** M10 dot morph on the row marker. Height transitions on the panel, house easing, 0.3s.

---

## 17. Contact

```
 |  [ ghosted CRESCENS wordmark behind everything ]            |
 | + WORK WITH US |                       |                    |
 |                | Let's find the        | Tell us what is    |
 |                | problem worth         | breaking. We reply |
 |                | solving.              | with what we think |
 |                |                       | the real problem is|
 |                                                             |
 | Ambitious ideas| Name                                       |
 | deserve real   | [_______________________________________]  |
 | ownership.     | Email                | Phone               |
 |                | [__________________] | [________________]  |
 | Team CRESCENS  | Company (optional)                         |
 | 2026           | [_______________________________________]  |
 |                | What is breaking?                          |
 | Top 7 Llama    | [_______________________________________]  |
 |                |                                             |
 |                | By submitting...      | [ Send request ]    |
 |    [C1]        |     [C2]  [C3]        |     [C4]           |
```

| Field | Type | Content |
|---|---|---|
| `eyebrow` | text | + WORK WITH US |
| `headingAccent` | text | Let's find the |
| `headingRest` | text | problem worth solving. |
| `support` | text | Tell us what is breaking. We will reply with what we think the real problem is, before you commit to anything. |
| `statement` | richtext | Ambitious ideas deserve **real ownership**. Start the conversation and let's define what success looks like. |
| `fields` | list | Name (req), Email (req), Phone, Company, Message (req) |
| `consent` | richtext | By submitting, I confirm I have read the Privacy Policy. |
| `cta` | text | Send request |

**The `What is breaking?` field is deliberate.** It is a better prompt than `Message` because it filters for people who have a real operational problem and it primes the exact conversation you want to have. It also gives you a qualified lead instead of "hi, interested in a website".

---

## 18. Footer

```
 |  [ ghosted CRESCENS wordmark ]                              |
 | We build systems   | Work        :  |               |       |
 | that outlast us,   | Process     :  | Social media  | Legal |
 | because ownership  | Products    :  | LinkedIn      | Privacy|
 | is the point.      | About       :  | Instagram     | Terms  |
 |                    | Contact     :  | GitHub        |        |
 | End to end studio  |                | X             |        |
 | <location>         |                                        |
 |                                                             |
 | hi@crescens.<tld>                                           |
 | +62 ...                                                     |
 |                                                             |
 | (c) 2026 Crescens Labs                                      |
 |    [C1]              [C2]           [C3]          [C4]      |
```

| Field | Type | Content |
|---|---|---|
| `statement` | richtext | We build systems that **outlast us**, because ownership is the point. |
| `meta` | text | End to end software studio, based in `<TODO>` |
| `email` | text | Display size, ~32px, 700 |
| `nav` | list | Work, Process, Products, About, Contact |
| `social` | list | TODO: supply |
| `legal` | list | Privacy Policy, Terms |

---

## 19. Case study page template

You asked for these to be excellent, so they get a full template rather than a long paragraph.

```
 /work/<slug>

 | [ back to work ]                                            |
 |                                                             |
 | SimplyBox                                          Year 2025|
 | AI unified inbox for the Meta ecosystem            Type ... |
 |                                                    Role ... |
 | +---------------------------------------------------------+ |
 | |               [ hero visual, full bleed ]               | |
 | +---------------------------------------------------------+ |
 |                                                             |
 | + THE PROBLEM   | [ scroll-reveal problem statement ]       |
 |                                                             |
 | + WHAT WE FOUND | [ the reframe, what the brief missed ]    |
 |                                                             |
 | + THE BUILD     | 01 ... | 02 ... | 03 ...                  |
 |                 | [ architecture diagram ]                  |
 |                                                             |
 | + THE RESULT    | 80%+   | 6 -> 1  | Top 7    | ...        |
 |                                                             |
 | + WHAT SHIPPED  | [ gallery ]                               |
 |                                                             |
 | + HANDOVER      | [ what the client owns now ]              |
 |                                                             |
 | [ next case study ->  RoyaleCard Arena ]                    |
```

### Case study schema

```ts
{
  slug, name, subtitle,
  meta:      { year, type, role, stack[], duration, status },
  hero:      { image, video? },
  problem:   richtext,      // what they came in with
  reframe:   richtext,      // what the actual problem turned out to be
  build:     [ { index, title, body, image? } ],
  architecture: { diagram, caption },   // the differentiator, most studios skip this
  results:   [ { value, label, caption } ],
  gallery:   [ image ],
  handover:  richtext,      // what the client owns and can do alone
  next:      slug,
}
```

**`reframe` is the section that sells you.** Every other studio's case study goes problem, solution, result. Yours has a step in the middle where the stated brief turned out to be the wrong problem, which is literally your positioning. On SimplyBox that is "they asked for a faster inbox, the actual constraint was that answers were ungrounded". On Snapose it is "they asked for photobooth software, the actual constraint was connectivity and reconciliation".

**`architecture` is the second differentiator.** Publishing a real architecture diagram signals that you build systems rather than screens, and it is the single most credible artifact for a technical buyer evaluating a two-person studio.

### Per-project content status

| Project | Problem | Reframe | Architecture | Results | Gallery |
|---|---|---|---|---|---|
| SimplyBox | ready | ready | **TODO: diagram** | ready (80%+, Top 7) | **TODO: screens** |
| RoyaleCard Arena | ready | ready | **TODO: diagram** | ready (winner) | **TODO: screens** |
| Snapose | ready | ready | **TODO: diagram** | **TODO: numbers** | **TODO: screens** |
| Franchise System | ready | ready | **TODO: diagram** | in build, no results yet | **TODO: screens** |
| Kost Operations | thin | thin | n/a | n/a | n/a |

---

## Open items

Things I need from you before the copy is final.

| # | Item | Blocks |
|---|---|---|
| 1 | Email, phone, city, social handles | Footer, contact, schema |
| 2 | Digital product names and one line each | Section 14 |
| 3 | Portraits of both founders | Section 13 |
| 4 | Product screenshots for all five projects | Section 11, case studies |
| 5 | Snapose hard numbers (outlets, events run, hours saved) | Case study results |
| 6 | Whether to show the Kost project while unsigned | Section 11 |
| 7 | Domain and TLD | Metadata, schema, `llms.txt` |
| 8 | Any client quote you can get, even one | Would restore a real testimonial slot |

None of these block the build. Every one has a defensible placeholder in the model above, and the site can ship and then improve as they land.
