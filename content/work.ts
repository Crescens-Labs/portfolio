import type { Claim } from '@/content/home';

/**
 * Case studies. One record per project, rendered by the home gallery and
 * by /work/[slug].
 *
 * The order of a case study is the studio's positioning, written as a
 * page: what they came in with (`problem`), what it actually was
 * (`reframe`), what we built, the architecture behind it, what it did,
 * and what the client owns afterwards. The reframe is the section that
 * sells; every other studio goes problem, solution, result.
 *
 * Rules the tests enforce:
 *   - every result is a Claim, so it carries a source;
 *   - nothing here names the restaurant chain (not cleared);
 *   - no em dashes anywhere a visitor reads.
 *
 * No product screenshots exist yet. `gallery` stays empty until real ones
 * do, and the page renders the monogram cover instead of a fake capture.
 */

export type DiagramNode = { id: string; label: string; note?: string };
export type Diagram = {
  /** Left to right: where data enters, what holds it, what comes out. */
  columns: { label: string; nodes: DiagramNode[] }[];
  /** Directed links, by node id. */
  edges: [string, string][];
  caption: string;
};

export type CaseStudy = {
  slug: string;
  index: string;
  name: string;
  initial: string;
  subtitle: string;
  year: string;
  type: string;
  role: string;
  status: 'shipped' | 'in build';
  /** One paragraph for the home gallery and the case study intro. */
  summary: string;
  problem: string;
  reframe: string;
  build: { title: string; body: string }[];
  architecture: Diagram;
  results: Claim[];
  /** Shown when there are no results yet, in place of the numbers. */
  pending?: string;
  /** Key into VOICES.cards for the client's own words, if any. */
  voice?: string;
  /** What the client owns afterwards. Absent on our own products. */
  handover?: string[];
  gallery: { src: string; alt: string }[];
};

const HANDOVER_SCOPE = [
  'Source code and infrastructure access, in your accounts',
  'Architecture documentation, the diagram on this page included',
  'Operating documentation written for the people who run it',
  'Training sessions until your team runs it without us',
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'simplybox',
    index: '01',
    name: 'SimplyBox',
    initial: 'S',
    subtitle: 'AI unified inbox for the Meta ecosystem',
    year: '2025',
    type: 'Product, competition',
    role: 'Problem structuring, architecture, full build',
    status: 'shipped',
    summary:
      'Six apps to answer one message. SimplyBox unifies the Meta ecosystem into one inbox, grounded in the company’s own knowledge by RAG. Response time down 80%+. Top 7, Llama AI Accelerator.',
    problem:
      'Support teams answering customers across the Meta apps were switching between inboxes all day. The brief was speed: answer faster.',
    reframe:
      'Speed was the symptom. The real constraint was that answers were not grounded: every agent answered from memory, so the same question got different replies. A faster inbox would only have produced wrong answers sooner.',
    build: [
      {
        title: 'One inbox',
        body: 'Every Meta channel lands in a single queue, so an agent works one screen instead of several apps.',
      },
      {
        title: 'Their knowledge, ingested',
        body: 'The company\u2019s own documents become the knowledge base, so the system knows their products and policies, not the internet\u2019s.',
      },
      {
        title: 'Grounded answers',
        body: 'Replies are retrieved from that knowledge at answer time (RAG), so they cite the company\u2019s material and hallucination drops.',
      },
    ],
    architecture: {
      columns: [
        {
          label: 'channels',
          nodes: [
            { id: 'wa', label: 'WhatsApp' },
            { id: 'ig', label: 'Instagram DMs' },
            { id: 'ms', label: 'Messenger' },
          ],
        },
        {
          label: 'core',
          nodes: [
            { id: 'router', label: 'Message router', note: 'one queue' },
            { id: 'kb', label: 'Company knowledge', note: 'ingested docs' },
          ],
        },
        {
          label: 'grounding',
          nodes: [
            { id: 'rag', label: 'Retrieval', note: 'RAG' },
            { id: 'llm', label: 'Language model' },
          ],
        },
        {
          label: 'out',
          nodes: [{ id: 'agent', label: 'Agent workspace', note: 'one inbox' }],
        },
      ],
      edges: [
        ['wa', 'router'],
        ['ig', 'router'],
        ['ms', 'router'],
        ['router', 'rag'],
        ['kb', 'rag'],
        ['rag', 'llm'],
        ['llm', 'agent'],
        ['router', 'agent'],
      ],
      caption: 'Every channel into one queue; every draft grounded in the company’s own documents before a person sends it.',
    },
    results: [
      {
        label: 'Response time',
        value: '80%+',
        caption: 'Cut for support teams running SimplyBox',
        source: "Measured against the client's own pre-launch baseline",
      },
      {
        label: 'Llama AI Accelerator',
        value: 'Top 7',
        caption: 'The only active student team to advance',
        source: 'Meta Llama AI Accelerator, 2025 cohort standings',
      },
    ],
    gallery: [],
  },
  {
    slug: 'royalecard-arena',
    index: '02',
    name: 'RoyaleCard Arena',
    initial: 'R',
    subtitle: 'On-chain competitive strategy game',
    year: '2025',
    type: 'Product, competition',
    role: 'Game design, architecture, full build, launch',
    status: 'shipped',
    summary:
      'An open-world game where market knowledge is the edge. Rules live on cards, the cards trade for you. Draft, ban, escrowed best of three. Winner, National Campus Hackathon.',
    problem:
      'Most trading games reward execution speed. We wanted one where market knowledge is the edge.',
    reframe:
      'The fix was to stop players executing trades by hand. Players write their strategy as rules on cards and the cards trade for them, so a match is won by iterating strategy, and losing teaches you which rule was wrong.',
    build: [
      {
        title: 'Cards that trade',
        body: 'Players configure rules on each card and the card executes them. Strategy is iterated, not hand-executed.',
      },
      {
        title: 'Draft and ban',
        body: 'MOBA style: scout an opponent’s profile, ban their best-performing card, then draft your own.',
      },
      {
        title: 'Two worlds',
        body: 'Paper trading in the open world to practise. In the arena, escrow and winner takes all: best of three, two-minute battles, three single-use buttons per game that can turn a match.',
      },
    ],
    architecture: {
      columns: [
        {
          label: 'player',
          nodes: [
            { id: 'world', label: 'Open world', note: 'paper trading' },
            { id: 'scout', label: 'Profile scouting' },
          ],
        },
        {
          label: 'game',
          nodes: [
            { id: 'rules', label: 'Card rules engine' },
            { id: 'draft', label: 'Draft and ban' },
            { id: 'arena', label: 'Arena', note: 'best of three' },
          ],
        },
        {
          label: 'chain',
          nodes: [
            { id: 'escrow', label: 'Escrow', note: 'Solana' },
            { id: 'payout', label: 'Winner takes all' },
          ],
        },
      ],
      edges: [
        ['world', 'rules'],
        ['scout', 'draft'],
        ['rules', 'arena'],
        ['draft', 'arena'],
        ['arena', 'escrow'],
        ['escrow', 'payout'],
      ],
      caption: 'Practice is free and off-chain. Stakes only enter at the arena, where escrow holds them until the best of three settles.',
    },
    results: [
      {
        label: 'Competition result',
        value: 'Winner',
        caption: 'National Campus Hackathon, Solana Foundation with Colosseum Frontier',
        source: 'Final standings, RoyaleCard Arena',
      },
      {
        label: 'Dual deadline',
        value: '1 day early',
        caption: 'Shipped to a second hackathon on the same date: video, deck and launch post',
        source: 'RoyaleCard Arena, same-date hackathons',
      },
    ],
    gallery: [],
  },
];


export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

/** The next case study, wrapping to the first, for the page footer. */
export function nextCaseStudy(slug: string): CaseStudy {
  const i = CASE_STUDIES.findIndex((c) => c.slug === slug);
  return CASE_STUDIES[(i + 1) % CASE_STUDIES.length];
}
