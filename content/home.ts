/**
 * Home page content.
 *
 * `source` is a required field on anything numeric or comparative, not an
 * optional one. The tagline is "Don't trust. Verify." A claim without an
 * attribution turns that line from a promise into a liability, so the type
 * system refuses to let one ship.
 *
 * Client names follow the disclosure rules: Snapose is nameable, the Ayam
 * Taliwang chain and the Lampung kost operator are not.
 */

export type Claim = {
  label: string;
  value: string;
  caption: string;
  /** Where a reader can check this. Required. */
  source: string;
};

/**
 * The hero carries a headline, one line of support, one proof, one action.
 * That is the whole budget.
 *
 * The opening remains poster-like. Supporting detail belongs further down
 * the page, after a reader has asked for it.
 *
 * Three tones, not two. `body` sets up, `ink` lands the claim, `accent`
 * marks the one idea worth remembering. White and pink alone read as a
 * template, because there is no hierarchy inside the sentence.
 */
export const HERO = {
  eyebrow: 'end to end software studio',
  headline: {
    /** grey, the setup */
    lead: 'Find',
    /** white, the claim */
    main: 'the problem worth solving.',
    /** pink, the differentiator */
    accent: 'Then build it with you.',
  },
  lead: 'We structure, architect and build with you, so the system outlasts us.',
  proof: {
    value: 'Top 7',
    label: 'Llama AI Accelerator',
    detail: 'the only active student team to advance',
  },
  cta: { label: 'Let\u2019s collaborate', href: '#contact', kicker: 'Ready to start something real?' },
  secondary: { label: 'See the work', href: '#work' },
} as const;

export const TAGLINE = {
  text: "DON'T TRUST. VERIFY.",
  note: 'Every number on this site carries a source. Every system we build ships with its architecture written down.',
} as const;

/** The studio's public profiles, kept close to the opening. */
export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/crescens-labs' },
  { label: 'X', href: 'https://x.com/crescenslabs' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/crescens-labs' },
  { label: 'Instagram', href: 'https://www.instagram.com/crescenslabs' },
] as const;

/**
 * Competitions and programmes, not clients and not partners. The heading
 * says so in plain words, because a logo strip that leaves the reader to
 * guess is claiming a relationship it has not earned.
 */
export const PROOF = {
  label: 'judged, not self declared',
  /**
   * Ordered by weight of claim, not by how recognisable the logo is. A
   * national win outranks a cohort placement, which outranks being in the
   * room. Leading with Meta because it is the biggest name would have been
   * the weaker order and the less honest one.
   *
   * The result reads first and the organisation second. Nobody scanning a
   * strip of logos remembers which one was which; they remember "winner".
   */
  marks: [
    {
      slug: 'solana',
      result: 'Winner',
      event: 'National Campus Hackathon',
      org: 'Solana Foundation',
    },
    { slug: 'meta', result: 'Top 7', event: 'Llama AI Accelerator', org: 'Meta' },
    {
      slug: 'colosseum',
      result: 'Competed',
      event: 'International blockchain track',
      org: 'Colosseum',
    },
    { slug: 'grab', result: 'Winner', event: 'Marketing competition', org: 'Grab' },
  ],
} as const;

/**
 * Section 4 of the content model. The one section that answers "who is
 * this" without a founder photo and a paragraph about passion.
 *
 * The position is set as an attributed quote rather than dissolved into
 * body copy. In the third person it reads as marketing; attributed to a
 * named founder it reads as a commitment somebody can be held to.
 */
export const WHO = {
  eyebrow: '+ who we are',
  heading: { muted: 'End to end means', strong: 'end to end.' },
  support:
    'Most studios hand back a repository and disappear. We hand back a system your team can run, extend and defend without us.',
  /** Pipes mark the words that land on the accent in the scrubbed reveal. */
  quote:
    'We will not teach you your business, you know it better than we do. We find |the problem worth solving| and build it with you.',
  author: { name: 'Dylansius Putra', role: 'Founder' },
  /** The marquee names the capabilities a visitor can ask the studio to build. */
  capabilities: [
    'Web apps',
    'Mobile apps',
    'Internal systems',
    'POS',
    'Finance and accounting',
    'Inventory',
    'Logistics',
    'HR',
    'AI integration',
    'RAG',
    'Offline first',
    'Consulting',
  ],
  cta: { kicker: 'the whole engagement, written down', label: 'How we work', href: '#process' },
} as const;

/** Technology shown in the implementation marquee. These are tools, not
 * endorsements, clients, or vendor relationships. */
export const TECH_STACK = [
  { slug: 'nextjs', name: 'Next.js', domain: 'nextjs.org' },
  { slug: 'react', name: 'React', domain: 'react.dev' },
  { slug: 'typescript', name: 'TypeScript', domain: 'typescriptlang.org' },
  { slug: 'tailwind', name: 'Tailwind CSS', domain: 'tailwindcss.com' },
  { slug: 'nodejs', name: 'Node.js', domain: 'nodejs.org' },
  { slug: 'postgresql', name: 'PostgreSQL', domain: 'postgresql.org' },
  { slug: 'supabase', name: 'Supabase', domain: 'supabase.com' },
  { slug: 'vercel', name: 'Vercel', domain: 'vercel.com' },
  { slug: 'gsap', name: 'GSAP', domain: 'gsap.com' },
  { slug: 'solana', name: 'Solana', domain: 'solana.com' },
  { slug: 'python', name: 'Python', domain: 'python.org' },
  { slug: 'expo', name: 'Expo', domain: 'expo.dev' },
  { slug: 'framer', name: 'Framer Motion', domain: 'framer.com' },
  { slug: 'figma', name: 'Figma', domain: 'figma.com' },
  { slug: 'claude', name: 'Claude', domain: 'claude.ai' },
  { slug: 'rust', name: 'Rust', domain: 'rust-lang.org' },
  { slug: 'solidity', name: 'Solidity', domain: 'soliditylang.org' },
] as const;


/**
 * Section 5. Four honest numbers beat four impressive ones.
 *
 * Deliberately not repeating the competition results that already sit in
 * the hero strip. A number the reader saw ninety seconds ago is not
 * evidence twice.
 */
export const STATS: Claim[] = [
  {
    label: 'Response time',
    value: '80%+',
    caption: 'Cut for support teams running SimplyBox',
    source: "Measured against the client's own pre-launch baseline",
  },
  {
    label: 'Apps replaced',
    value: '5 to 1',
    caption: 'One screen for a photobooth venue, not five',
    source: 'Operator workflow audit, 2025',
  },
  {
    label: 'Systems shipped or in build',
    value: '4',
    caption: 'Delivered systems across three categories, plus one in build',
    source: 'SimplyBox, RoyaleCard Arena, Snapose, franchise system',
  },
  {
    label: 'People on the build',
    value: '2',
    caption: 'Founders. No subcontractors, no handoffs',
    source: 'Team, below',
  },
];

export const CLAIMS: Claim[] = [
  {
    label: 'llama ai accelerator',
    value: 'Top 7',
    caption: 'The only active student team to advance',
    source: 'Meta Llama AI Accelerator, 2025 cohort standings',
  },
  {
    label: 'simplybox response time',
    value: '80%+',
    caption: 'Cut in customer response time',
    source: "Measured against the client's own pre-launch baseline",
  },
  {
    label: 'national campus hackathon',
    value: '1st',
    caption: 'Solana Foundation with Colosseum Frontier',
    source: 'Final standings, RoyaleCard Arena',
  },
  {
    label: 'apps a venue used to run',
    value: '5 to 1',
    caption: 'Photobooth operators, before and after Snapose',
    source: 'Operator workflow audit, 2025',
  },
];

export const PROCESS = [
  {
    key: 'structure',
    title: 'Find the problem worth solving',
    desc: 'You know your business better than we do. We help you separate the symptom from the cause.',
    out: 'A written problem statement you can argue with',
  },
  {
    key: 'architect',
    title: 'Decide the shape of the system',
    desc: 'Data model, service boundaries, failure modes. Decided before code, published as a diagram.',
    out: 'An architecture diagram, committed',
  },
  {
    key: 'iterate',
    title: 'Build it with you in the room',
    desc: 'Short cycles against real usage. Snapose went offline first because of what this stage surfaced, not the brief.',
    out: 'Working software, every cycle',
  },
  {
    key: 'train',
    title: 'Train your team on it',
    desc: 'Sessions on your own system with your own data, until your people can change it without asking us first.',
    out: 'Recorded sessions and runbooks',
  },
  {
    key: 'handover',
    title: 'Leave',
    desc: 'Repos, keys, docs, diagrams. It ends when you no longer need us, the only ending that counts.',
    out: 'Full ownership, no retainer required',
  },
] as const;

/**
 * Capability bento. Six cards carry the argument through mechanisms rather
 * than unattributed metrics.
 */
export const BENTO = {
  eyebrow: '+ what we bring',
  heading: { muted: 'Opinions,', strong: 'built in.' },
  cards: [
    {
      key: 'offline',
      span: 2,
      title: 'Offline-first by default',
      body: 'Crowded venues, failing internet. We architect for that, then sync when the connection returns.',
      points: ['Auto-sync to Drive', 'Backed up by default', 'Shared across devices'],
    },
    {
      key: 'grounded',
      span: 1,
      title: 'Grounded, not guessing',
      body: 'RAG over your own ingested knowledge, so the AI answers from your documents instead of inventing.',
      points: null,
    },
    {
      key: 'ascii',
      span: 1,
      title: null,
      body: null,
      points: null,
    },
    {
      key: 'inbox',
      span: 1,
      title: 'One inbox, not six',
      body: 'Support agents were opening six apps to answer one customer. Now they open one.',
      points: null,
    },
    {
      key: 'books',
      span: 1,
      title: 'Books that close themselves',
      body: 'Auto finance capture with waste analysis, so reconciliation stops being a monthly fire.',
      points: null,
    },
    {
      key: 'yours',
      span: 2,
      title: 'Yours on day one',
      body: 'Documentation, architecture and training are built into the engagement, not sold as an extra.',
      points: null,
    },
  ],
} as const;

/**
 * Section 8, what we build. Six rows behind a sticky rail. There is no
 * closing quote: the thesis already carries that sentence at the top of
 * the page, and a section that repeats itself reads as unsure of itself.
 * The command bar CTA is the close.
 */
export const SERVICES = {
  eyebrow: '+ services',
  heading: { accent: 'What we', rest: 'build.' },
  lead: 'Six things, done properly, for teams that need the system to still work in three years.',
  items: [
    {
      index: '01',
      title: 'Custom Web Apps',
      body: 'Built to your operation, not a template. Performance and maintainability are requirements, not extras.',
    },
    {
      index: '02',
      title: 'Mobile Apps',
      body: 'For teams that work away from a desk. Still useful when the connection is not.',
    },
    {
      index: '03',
      title: 'Internal Systems',
      body: 'Operations, POS, finance, inventory, logistics, HR. One system instead of six that disagree.',
    },
    {
      index: '04',
      title: 'AI Integration',
      body: 'RAG over your own knowledge, so answers stay grounded. Where it only adds risk, we say no.',
    },
    {
      index: '05',
      title: 'Product & Architecture',
      body: 'Problem structuring, scoping, system design. The part that decides the build before a line is written.',
    },
    {
      index: '06',
      title: 'Consulting & Handover',
      body: 'Documentation, architecture review and training until your team ships without us.',
    },
  ],
  cta: { kicker: "Let's scope it", label: 'Get in touch', href: '#contact' },
} as const;

/** Verbatim client feedback, retained in the language it was said in. */
export const TESTIMONIAL = {
  quote:
    'gw baru dikasih liat flow yang pake snapose software yang kalian bikin and gw masih amazed padahal kita udah rehearse sebelumnya',
  gloss:
    'I was just shown the flow running on the Snapose software you built and I am still amazed, even though we had already rehearsed it.',
  attribution: null as string | null,
  context: 'Snapose, photobooth studio software',
} as const;

/**
 * The voices section. One verbatim quote plus the client-side receipts,
 * scattered as cards. The competition record lives in Recognition; this
 * section deliberately repeats none of it. The two numbers here are the
 * flagship outcomes from the stats strip, restated once as receipts,
 * which is the repetition a page is allowed: the number you want
 * remembered, and never a competition result twice.
 */
export const VOICES = {
  eyebrow: '+ voices',
  heading: { muted: 'Said back', strong: 'to us.' },
  lead: 'One verbatim quote and the receipts behind it. Nothing paraphrased, nothing invented.',
  receipts: [
    {
      key: 'response',
      value: '80%+',
      label: 'Cut in customer response time',
      note: 'SimplyBox, AI unified inbox',
      source: "Measured against the client's own pre-launch baseline",
    },
    {
      key: 'apps',
      value: '5 to 1',
      label: 'Apps a venue runs now',
      note: 'Snapose, photobooth platform',
      source: 'Operator workflow audit, 2025',
    },
    {
      key: 'early',
      value: '1 day early',
      label: 'Ahead of a dual deadline',
      note: 'RoyaleCard Arena, second hackathon',
      source: 'Deck, video and launch post shipped ahead',
    },
  ],
  chips: {
    note: 'Snapose architecture',
    items: ['offline first', 'auto-sync to Drive', 'shared across laptops'],
  },
} as const;

export const PRODUCTS = {
  eyebrow: 'from the lab',
  headline: { lead: 'Digital products,', accent: 'in the open.', tail: '' },
  lead:
    'Client work kept solving the same problems twice. Those solutions became our internal tooling. Now they are becoming products you can use.',
  ticker: 'coming soon · digital products · coming soon · digital products · coming soon · ',
  items: [
    {
      name: 'Field AI',
      status: 'coming soon',
      tag: 'AI specialized workflow and tools',
      what:
        'Vertical AI workflows and tools, one field at a time. First up: marketing for construction, grounded in each company’s own material with the source attached to every answer.',
      who: 'Teams in one specific field who need answers that cite their own documents',
    },
    {
      name: 'The Ledger',
      status: 'coming soon',
      tag: 'back and forth, recorded',
      what:
        'A development workflow where every back and forth is recorded: decisions, changes, and the reasons behind them.',
      who: 'Teams tired of re-deciding decisions nobody can find',
    },
    {
      name: 'Harness Playbook',
      status: 'coming soon',
      tag: 'efficient AI workflow',
      what:
        'Our playbook for an efficient AI harness: what to automate, what to keep manual, and where the guardrail belongs.',
      who: 'Studios that want their own AI workflow, not a borrowed template',
    },
  ],
  waitlist: {
    kicker: 'no launch date yet',
    label: 'Be first when it ships',
    note: 'One email when there is something to use. Nothing else.',
  },
} as const;


/**
 * Section 10. What working together looks like. Three short columns, set
 * against the cream counterpoint, so the page has a clear breath between
 * the Process section above and the Featured work theatre below.
 *
 * Each column is a single statement in two to four sentences. The form is
 * deliberately rigid so the section reads as a triptych rather than a
 * wandering feature list.
 */
export const TOGETHER = {
  eyebrow: '+ what working together looks like',
  heading: { muted: 'How we', strong: 'work.' },
  lead: 'Three expectations, written down before the first call.',
  items: [
    {
      key: 'expect',
      title: 'What to expect',
      body: 'Weekly demos, one owner, direct access to the people writing the code. No account layer.',
    },
    {
      key: 'get',
      title: 'What you get',
      body: 'A working system, docs your team reads, an architecture they can extend, training until they are independent.',
    },
    {
      key: 'takes',
      title: 'What it takes',
      body: 'Access to the people who run the operation, and honest answers about what is broken. Only you can show us the floor.',
    },
  ],
} as const;

/**
 * Section 11. Featured work. The biggest visual section, a sticky-scroll
 * gallery that runs through five projects.
 *
 * The five have to ship without client screenshots for now. Rather than
 * fake UI captures (which would lie about the work and would not pass
 * the tagline), each project is rendered as an editorial monogram: an
 * oversized initial inside a frame, the dot-cluster mark behind it, a
 * single accent index. Reads as art direction rather than as evidence.
 */
type Project = {
  slug: string;
  index: string;
  name: string;
  initial: string;
  subtitle: string;
  year: string;
  type: string;
  status: 'shipped' | 'in build';
  summary: string;
  result?: Claim;
};

export const PROJECTS: Project[] = [
  {
    slug: 'simplybox',
    index: '01',
    name: 'SimplyBox',
    initial: 'S',
    subtitle: 'AI unified inbox for the Meta ecosystem',
    year: '2025',
    type: 'Product, competition',
    status: 'shipped',
    summary:
      'Six apps to answer one message. SimplyBox unifies the Meta ecosystem into one inbox, grounded in the company\u2019s own knowledge by RAG. Response time down 80%+. Top 7, Llama AI Accelerator.',
    result: {
      label: 'Response time',
      value: '80%+',
      caption: 'Cut for CS teams using SimplyBox',
      source: "Measured against the client's own pre-launch baseline",
    },
  },
  {
    slug: 'royalecard-arena',
    index: '02',
    name: 'RoyaleCard Arena',
    initial: 'R',
    subtitle: 'On-chain competitive strategy game',
    year: '2025',
    type: 'Product, competition',
    status: 'shipped',
    summary:
      'An open-world game where market knowledge is the edge. Rules live on cards, the cards trade for you. Draft, ban, escrowed best of three. Winner, National Campus Hackathon.',
    result: {
      label: 'Competition result',
      value: '1st',
      caption: 'National Campus Hackathon, Solana x Colosseum',
      source: 'Final standings, RoyaleCard Arena',
    },
  },
  {
    slug: 'snapose',
    index: '03',
    name: 'Snapose',
    initial: 'A',
    subtitle: 'Photobooth studio platform',
    year: '2025',
    type: 'Client product',
    status: 'shipped',
    summary:
      'Competitors sell software. We shipped the operation around it: auto finance with waste analysis, offline-first with Drive sync. Six apps became one.',
  },
  {
    slug: 'franchise-system',
    index: '04',
    name: 'Franchise System',
    initial: 'F',
    subtitle: 'Multi-outlet operations platform',
    year: '2026',
    type: 'Client, in build',
    status: 'in build',
    summary:
      'One operating system for a leading multi-outlet restaurant chain: POS, finance, inventory, logistics and HR in one place.',
  },
];

/**
 * Recognition keeps proof grounded in judged outcomes and verifiable sources.
 */
export const RECOGNITION = {
  eyebrow: '+ recognition',
  heading: { muted: 'Judged, not', strong: 'self-declared.' },
  reveal:
    'Two competitions entered, both placed. RoyaleCard Arena |won| the National Campus Hackathon. SimplyBox reached the |top 7| of the Llama AI Accelerator, the only active student team through. One of us also took |first of 100+| in Grab\u2019s marketing competition.',
  note: 'No client logos and no bought badges. Every row on the right names where it can be checked, which is the only kind of proof this page carries.',
  awards: [
    {
      key: 'solana',
      value: 'Winner',
      label: 'National Campus Hackathon',
      caption: 'Solana Foundation with Colosseum Frontier',
      source: 'Final standings, RoyaleCard Arena',
    },
    {
      key: 'grab',
      value: '1st / 100+',
      label: 'Grab Marketing Competition',
      caption: 'We can build it and sell it',
      source: 'Grab final standings',
    },
    {
      key: 'llama',
      value: 'Top 7',
      label: 'Llama AI Accelerator',
      caption: 'Only active student team to advance',
      source: 'Meta, 2025 cohort standings',
    },
    {
      key: 'deadline',
      value: '1 day early',
      label: 'Dual deadline',
      caption: 'Deck, video and launch post shipped ahead',
      source: 'RoyaleCard Arena, same-date hackathons',
    },
  ],
} as const;

/**
 * Team cards use framed editorial monograms until founder photography is
 * available. The approach reads as intentional direction rather than a
 * borrowed portrait.
 */
export const TEAM = {
  eyebrow: '+ team',
  heading: { muted: 'Two people.', strong: 'Full ownership.' },
  lead: 'Small enough that both of us know your system by heart. Large enough to have shipped five of them.',
  closing:
    'No account managers, no handoffs, no one learning your business on your budget. |You talk to the people building it.|',
  cta: { kicker: 'built by specialists', label: 'More about us', href: '#contact' },
  members: [
    {
      name: 'Dylansius Putra',
      role: 'Founder, PM, Fullstack Developer',
      initial: 'D',
      bio: 'Structures the problem, owns delivery. Won Grab\u2019s marketing competition against 100+ entrants, so scoping starts with your economics, not your feature list.',
    },
    {
      name: 'Daffa Hasanal Arkaan',
      role: 'Founder, Lead Engineer',
      initial: 'H',
      bio: 'Owns architecture and the build. Designs for failure cases first, which is why Snapose is offline-first.',
    },
  ],
} as const;

/**
 * Section 15. Engagement models. Three shapes, written as shapes rather
 * than prices, because a public monthly figure would either underprice
 * the franchise-system class of work or scare off the smaller ones.
 *
 * Every model ends in handover. That is the one line that distinguishes
 * us from a retainer studio, so the footnote is non-negotiable.
 */
export const ENGAGEMENT = {
  eyebrow: '+ engagement',
  heading: { accent: 'How we work', rest: 'together.' },
  lead: 'Three shapes, chosen by whether the scope is knowable up front. We tell you which one fits after the first call.',
  footnote:
    'Every engagement ends with handover. That is not an upsell, it is the definition of the work.',
  cta: { label: 'Book a call', href: '#contact' },
  models: [
    {
      key: 'project',
      name: 'Project',
      description: 'Fixed scope, clear deadline, full handover.',
      points: ['Scoped in writing', 'Fixed price', 'Handover included'],
    },
    {
      key: 'retainer',
      name: 'Retainer',
      description: 'Ongoing build and iteration for teams already live.',
      points: ['Continuous delivery', 'Monthly', 'Cancel any time'],
    },
    {
      key: 'consulting',
      name: 'Consulting',
      description: 'Architecture review and problem structuring.',
      points: ['Fixed engagement', 'Outcome document', 'No build'],
    },
  ],
} as const;

/**
 * Section 16. FAQ. Eight questions, three groups, written as straight
 * answers. The accordion carries the dot to bar marker already, so each
 * row reads as the marker transforming rather than expanding a box.
 */
export const FAQ = {
  eyebrow: '+ faq',
  heading: { muted: 'Good questions,', strong: 'straight answers.' },
  lead: 'About scope, cost and what happens after handover.',
  groups: [
    {
      key: 'working',
      label: 'Working with Crescens',
      items: [
        {
          q: 'How does a project start?',
          a: 'With a call about your operation, not your feature list. We map where the work breaks and write down the problem worth solving. If we disagree with your brief, you hear it before you spend anything.',
        },
        {
          q: 'Who will I actually work with?',
          a: 'Both of us. There are two people in the studio and no account layer, so the people scoping your project are the people building it.',
        },
        {
          q: 'What if I don\u2019t know what the problem is?',
          a: 'That is the normal case, and the part we are best at. We turn what you know into a problem worth building against.',
        },
      ],
    },
    {
      key: 'scope',
      label: 'Scope and cost',
      items: [
        {
          q: 'How is pricing structured?',
          a: 'Three shapes: project, retainer, consulting. Which one fits depends on whether the scope is knowable up front. We tell you after the first call.',
        },
        {
          q: 'How long does a system take?',
          a: 'A focused product ships in weeks. A full operations platform runs months, delivered in usable slices rather than one big drop.',
        },
      ],
    },
    {
      key: 'after',
      label: 'After handover',
      items: [
        {
          q: 'What does handover actually include?',
          a: 'Source, infrastructure access, architecture documentation, operating documentation written for your team, and training sessions until they are running it unaided.',
        },
        {
          q: 'Are you still available afterwards?',
          a: 'Yes, and the point is that you should not need us. We stay reachable for changes, but the system is built so your team is not blocked waiting on ours.',
        },
        {
          q: 'Can our team extend it themselves?',
          a: 'That is the design constraint. Conventional stack, documented architecture, no clever tricks that only we understand.',
        },
      ],
    },
  ],
} as const;

/**
 * Section 17. Contact. The form field is labelled "What is breaking?"
 * on purpose. "Message" filters for nothing; "What is breaking?" filters
 * for people with a real operational problem and primes the exact
 * conversation we want to have.
 */
export const CONTACT = {
  eyebrow: '+ work with us',
  heading: { accent: "Let's find the", rest: 'problem worth solving.' },
  lead: 'Tell us what is breaking. We will reply with what we think the real problem is, before you commit to anything.',
  statement:
    'Ambitious ideas deserve |real ownership|. Start the conversation and let\u2019s define what success looks like.',
  fields: [
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Your name', required: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'you@company.com', required: true },
    { name: 'phone', label: 'Phone', type: 'tel', placeholder: 'Optional', required: false },
    { name: 'company', label: 'Company', type: 'text', placeholder: 'Optional', required: false },
  ],
  messageField: { name: 'breaking', label: 'What is breaking?', placeholder: 'Tell us where the operation leaks.' },
  submit: { label: 'Send request', note: 'By submitting, I confirm I have read the Privacy Policy.' },
  steps: [
    'You write what is breaking. A person reads it.',
    'One call, to find the problem worth solving.',
    'The scope arrives in writing, before anything is signed.',
  ],
  secondaryLine: 'Prefer email? Write to us directly at',
  email: 'hi@crescens.dev',
} as const;

/**
 * Section 18. Footer. The closing statement, then the DNA of the page:
 * wordmark, nav, socials, legal, copyright.
 */
export const FOOTER = {
  statementHead: 'We build systems that |outlast us|',
  statementTail: 'because ownership is the point.',
  meta: 'End to end software studio, working remote from Indonesia.',
  email: 'hi@crescens.dev',
  nav: [
    { label: 'Work', href: '#work' },
    { label: 'Process', href: '#process' },
    { label: 'Products', href: '#lab' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms', href: '#' },
  ],
  copyright: '\u00A9 2026 Crescens Labs',
} as const;
