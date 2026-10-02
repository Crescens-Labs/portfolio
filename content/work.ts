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
  /**
   * A real screenshot for the laptop screen, 16:10, e.g. 2560x1600, in
   * public/work/<slug>/. Until it exists the screen shows a title card.
   */
  cover?: { src: string; alt: string };
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
      ],
      caption: 'Every channel into one queue, and every answer retrieved from the company’s own documents before it reaches the agent.',
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
            { id: 'arena', label: 'Arena', note: 'best of three' },
            { id: 'draft', label: 'Draft and ban' },
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
  {
    slug: 'snapose',
    index: '03',
    name: 'Snapose',
    initial: 'A',
    subtitle: 'Photobooth studio platform',
    year: '2025',
    type: 'Client product',
    role: 'Problem structuring, architecture, build, training',
    status: 'shipped',
    summary:
      'Competitors sell software. We shipped the operation around it: auto finance with waste analysis, offline-first with Drive sync. Five apps became one.',
    problem:
      'A photobooth studio ran each event across five or more apps, and every one of them assumed the venue had internet. They asked for photobooth software.',
    reframe:
      'Competitors already sell photobooth software. The real constraints were connectivity, because a crowded venue is where the internet fails first, and reconciliation, because five apps meant five versions of the books.',
    build: [
      {
        title: 'Offline first',
        body: 'The booth runs without a connection and syncs to Google Drive when one returns. Data is backed up by default.',
      },
      {
        title: 'Shared across laptops',
        body: 'Sync goes through the studio’s own Drive, so every laptop on that Drive sees the same data instead of one device holding it.',
      },
      {
        title: 'Books that close themselves',
        body: 'Finance is captured as the booth runs, with waste analysis, so reconciliation stops being a monthly fire.',
      },
    ],
    architecture: {
      columns: [
        {
          label: 'venue',
          nodes: [
            { id: 'cam', label: 'Camera' },
            { id: 'booth', label: 'Booth laptop', note: 'works offline' },
          ],
        },
        {
          label: 'local',
          nodes: [
            { id: 'store', label: 'Local store', note: 'source of truth' },
            { id: 'fin', label: 'Auto finance', note: 'waste analysis' },
          ],
        },
        {
          label: 'sync',
          nodes: [
            { id: 'drive', label: 'Google Drive', note: 'when online' },
            { id: 'peers', label: 'Other laptops' },
          ],
        },
      ],
      edges: [
        ['cam', 'booth'],
        ['booth', 'store'],
        ['store', 'fin'],
        ['store', 'drive'],
        ['fin', 'drive'],
        ['drive', 'peers'],
      ],
      caption: 'The laptop is the source of truth on the night. Drive is where it lands afterwards, and how every other laptop catches up.',
    },
    results: [
      {
        label: 'Apps a venue runs',
        value: '5 to 1',
        caption: 'Photobooth operators, before and after Snapose',
        source: 'Operator workflow audit, 2025',
      },
    ],
    voice: 'snapose',
    handover: HANDOVER_SCOPE,
    gallery: [],
  },
  {
    slug: 'pawtrait',
    index: '04',
    name: 'Pawtrait',
    initial: 'P',
    subtitle: 'DIY pet photobox, end to end',
    year: '2026',
    type: 'Client, in build',
    role: 'Problem structuring, architecture, hardware integration, build',
    status: 'in build',
    summary:
      'Every paw deserves a spotlight. A DIY pet photobox that prints accessory sheets for collars, bracelets and keychains, with the camera, printer, template editor, finance and gallery in one system.',
    problem:
      'Pawtrait wanted a self-serve photobox for pets that turns a session into something to wear: an accessory sheet for a collar, a bracelet or a keychain.',
    reframe:
      'Booth software alone would not do it. A DIY booth has no operator to rescue a stuck print or a confused customer, so the flow itself has to carry the session, from the camera to the printer to a file the owner keeps.',
    build: [
      {
        title: 'Wired to the hardware',
        body: 'The software drives the camera and the printer directly, so a session goes from shot to printed sheet without a person at the controls.',
      },
      {
        title: 'Template editor',
        body: 'Pawtrait designs its own accessory layouts, so new collar, bracelet and keychain sheets ship without us.',
      },
      {
        title: 'Finance and gallery',
        body: 'Every session is booked into the finance view, and each customer gets a soft-file gallery site for their photos afterwards.',
      },
    ],
    architecture: {
      columns: [
        {
          label: 'booth',
          nodes: [
            { id: 'flow', label: 'Booth flow', note: 'made for them' },
            { id: 'cam', label: 'Camera' },
          ],
        },
        {
          label: 'core',
          nodes: [
            { id: 'tpl', label: 'Template editor' },
            { id: 'session', label: 'Session' },
            { id: 'fin', label: 'Finance' },
          ],
        },
        {
          label: 'out',
          nodes: [
            { id: 'print', label: 'Printer', note: 'accessory sheet' },
            { id: 'gallery', label: 'Gallery site', note: 'soft files' },
          ],
        },
      ],
      edges: [
        ['flow', 'session'],
        ['cam', 'session'],
        ['tpl', 'session'],
        ['session', 'fin'],
        ['session', 'print'],
        ['session', 'gallery'],
      ],
      caption: 'One session object carries a visit from the first shot to the printed sheet and the gallery link, with finance written as it goes.',
    },
    results: [],
    pending: 'In build. Numbers land here after launch, measured, with their sources.',
    voice: 'pawtrait',
    handover: HANDOVER_SCOPE,
    gallery: [],
  },
  {
    slug: 'franchise-system',
    index: '05',
    name: 'Franchise System',
    initial: 'F',
    subtitle: 'Multi-outlet operations platform',
    year: '2026',
    type: 'Client, in build',
    role: 'Problem structuring, architecture, full build',
    status: 'in build',
    summary:
      'One operating system for a leading multi-outlet restaurant chain: POS, finance, inventory, logistics and HR in one place.',
    problem:
      'A leading restaurant chain in Central Java needed operations, POS, finance and accounting, inventory, logistics and HR for every outlet.',
    reframe:
      'Read as a list, that is six products. The real job is one record that all six read from, built to survive a bad connection at an outlet, because six systems that disagree cannot be reconciled after the fact.',
    build: [
      {
        title: 'One record per outlet',
        body: 'POS, inventory and logistics write to the same data, so stock follows sales without anyone retyping it.',
      },
      {
        title: 'Finance and accounting',
        body: 'Books built from what the outlets actually did, not from what was reported at the end of the month.',
      },
      {
        title: 'People',
        body: 'HR sits in the same system, so staffing is planned against the outlets it serves.',
      },
    ],
    architecture: {
      columns: [
        {
          label: 'outlets',
          nodes: [{ id: 'pos', label: 'POS', note: 'every outlet' }],
        },
        {
          label: 'operations',
          nodes: [
            { id: 'inv', label: 'Inventory' },
            { id: 'log', label: 'Logistics' },
            { id: 'hr', label: 'HR' },
          ],
        },
        {
          label: 'head office',
          nodes: [{ id: 'fin', label: 'Finance and accounting' }],
        },
      ],
      edges: [
        ['pos', 'inv'],
        ['pos', 'fin'],
        ['inv', 'log'],
        ['log', 'fin'],
        ['hr', 'fin'],
      ],
      caption: 'Sales at the till move stock, stock moves logistics, and all of it lands in the same books.',
    },
    results: [],
    pending: 'In build. Results are published after handover, with their sources.',
    handover: HANDOVER_SCOPE,
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
