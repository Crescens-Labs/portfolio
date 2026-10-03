'use client';

import { useRef } from 'react';
import { Wrap } from '@/components/layout';
import { AsciiObject } from '@/components/AsciiObject';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { BENTO } from '@/content/home';
import shared from './build.module.css';
import s from './bento.module.css';

/**
 * Section 7, the capability bento. Six cards of irregular weight, each
 * making one argument a competitor's feature list cannot.
 *
 * Grid layout, two rows on a 4 column field:
 *
 *   row 1  offline (2 col)  | grounded (1)  | ascii (1)
 *   row 2  inbox   (1)      | books   (1)   | yours (2 col)
 *
 * The opener and the closer both span two columns, so the bento reads as
 * a bookended statement rather than a grid that ends one slot short.
 *
 * Every card visual performs its own argument on hover: the sync dots
 * flow, the six apps collapse into one inbox, the ledger rows reconcile,
 * the document stack fans open, and the ascii cell is the mark itself,
 * turning in glyphs and answering a drag. The visuals are the argument
 * in pixels, not decoration pinned to the foot of a card.
 *
 * Animation contract: CSS paints every card fully visible, GSAP only
 * plays a `from` tween when motion is wanted, so failed hydration and
 * reduced motion both render the finished grid.
 */
export function Bento() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!root.current || prefersReducedMotion()) return;
      root.current.querySelectorAll<HTMLElement>(`.${s.card}`).forEach((card, i) => {
        gsap.from(card, {
          y: 34,
          opacity: 0,
          scale: 0.97,
          duration: 1,
          ease: 'house',
          delay: i * 0.07,
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
        });
      });
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section id="capabilities" data-ground="dark" className={`specks-host ${s.bento}`} ref={root}>
      <i className="specks specks-static" style={{ '--specks-o': 0.5 } as React.CSSProperties} aria-hidden="true" />
      <Wrap>
        <p className={shared.eyebrow}>{BENTO.eyebrow}</p>
        <div className={shared.head}>
          <h2 className={shared.title}>
            <span className={shared.tMuted}>{BENTO.heading.muted}</span>{' '}
            <span className={shared.tStrong}>{BENTO.heading.strong}</span>
          </h2>
        </div>

        <div className={s.grid}>
          {BENTO.cards.map((c, i) => {
            const index = String(i + 1).padStart(2, '0');
            if (c.key === 'ascii') {
              return (
                <div key={c.key} className={s.card} data-span="1" data-kind="ascii">
                  <span className={s.cardIndex} aria-hidden="true">
                    {index}
                  </span>
                  {/* The mark itself as the card's whole visual: the
                      five-dot C in live glyphs, turning, draggable. */}
                  <AsciiObject className={s.ascii3d} />
                  <p className={s.asciiHint} aria-hidden="true">
                    drag
                  </p>
                </div>
              );
            }
            if (c.key === 'grounded') {
              return (
                <div key={c.key} className={s.card} data-span="1" data-kind="accent">
                  <span className={s.cardIndex} data-on-accent aria-hidden="true">
                    {index}
                  </span>
                      <p className={s.ghost} aria-hidden="true">
                        GROUNDED
                      </p>
                      <h3 className={s.title}>{c.title}</h3>
                      <p className={s.body}>{c.body}</p>
                      <GroundedViz />
                      <p className={s.sources} aria-hidden="true">
                    <span>doc_04</span>
                    <span>doc_17</span>
                    <span>doc_22</span>
                    <i />
                  </p>
                </div>
              );
            }
            return (
              <div key={c.key} className={s.card} data-span={c.span} data-card={c.key}>
                <span className={s.cardIndex} aria-hidden="true">
                  {index}
                </span>
                <div className={s.cardText}>
                  <h3 className={s.title}>{c.title}</h3>
                  <p className={s.body}>{c.body}</p>
                  {c.points ? (
                    <ul className={s.points}>
                      {c.points.map((p) => (
                        <li key={p}>
                          <span aria-hidden="true">&gt;</span> {p}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                {c.key === 'offline' && <SyncViz />}
                {c.key === 'inbox' && <InboxViz />}
                {c.key === 'books' && <BooksViz />}
                {c.key === 'yours' && <DocsViz />}
              </div>
            );
          })}
        </div>
      </Wrap>
    </section>
  );
}

/* Card visuals, all `aria-hidden`. The accent is the single colour these
   graphics are allowed to use, the same accent the cards use in their
   text. Each one performs the card's argument on hover rather than
   sitting still, and each carries a readout that states the before and
   the after: the card's sentence, said twice, once per state. */

/** The status line under a visual. Two texts occupy one slot and swap
    on the card's hover, so the visual's change of state is also said
    in words, in the page's mono voice. */
function Readout({ rest, hover }: { rest: string; hover: string }) {
  return (
    <p className={s.readout} aria-hidden="true">
      <span className={s.roRest}>{rest}</span>
      <span className={s.roHover}>{hover}</span>
    </p>
  );
}

/** Offline-first. A device, a drive, and the sync path between them.
    The dashes drift toward the drive forever; the flow dots ride the
    path on a loop. Motion path on SVG is compositor work, and reduced
    motion drops the dots while keeping the static path. */
function SyncViz() {
  return (
    <div className={s.vizBox}>
      <svg
        className={s.vizSync}
        viewBox="0 0 260 60"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        focusable="false"
      >
        {/* the device */}
        <rect x="4" y="18" width="46" height="32" rx="4" className={s.vizStrokeDim} strokeWidth="1.5" />
        <circle cx="14" cy="28" r="2" className={s.vizShapeDim} />
        <circle cx="21" cy="28" r="2" className={s.vizShapeDim} />
        <circle cx="28" cy="28" r="2" className={s.vizShapeDim} />
        <line x1="12" y1="38" x2="38" y2="38" className={s.vizStrokeDim} strokeWidth="1.5" />
        {/* the drive */}
        <rect x="212" y="12" width="44" height="40" rx="8" className={s.vizStrokeDim} strokeWidth="1.5" />
        <circle cx="226" cy="26" r="2.2" className={s.vizShapeAccent} />
        <circle cx="236" cy="32" r="1.6" className={s.vizShapeDim} />
        <circle cx="246" cy="40" r="1.6" className={s.vizShapeDim} />
        {/* the sync path */}
        <path
          d="M50 34 C 105 8 157 8 212 32"
          fill="none"
          className={s.vizSyncPath}
          strokeWidth="1.5"
          strokeDasharray="3 6"
        />
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            r="2.6"
            className={s.vizFlowDot}
            style={{ '--d': `${i * -0.9}s` } as React.CSSProperties}
          />
        ))}
      </svg>
      <Readout rest="offline · queue intact" hover="back online · syncing" />
    </div>
  );
}

/** One inbox, not six. Five dim app windows, one accent inbox. On hover
    the five fold away behind the one, which is the sentence the card
    makes, performed. */
function InboxViz() {
  const wins = [
    { x: 0, h: 22 },
    { x: 27, h: 30 },
    { x: 54, h: 17 },
    { x: 81, h: 26 },
    { x: 108, h: 20 },
  ];
  return (
    <div className={s.vizBox}>
      <svg
        className={s.vizInbox}
        viewBox="0 0 200 40"
        preserveAspectRatio="xMaxYMax meet"
        aria-hidden="true"
        focusable="false"
      >
        {wins.map((w, i) => (
          <rect
            key={i}
            x={w.x}
            y={40 - w.h}
            width="21"
            height={w.h}
            rx="2"
            className={s.inboxWin}
            style={{ '--i': i } as React.CSSProperties}
          />
        ))}
        <rect x="152" y="6" width="42" height="34" rx="3" className={s.inboxMain} />
        <line x1="159" y1="15" x2="187" y2="15" className={s.vizStrokeInk} strokeWidth="2" />
        <line x1="159" y1="22" x2="181" y2="22" className={s.vizStrokeInk} strokeWidth="2" />
        <line x1="159" y1="29" x2="184" y2="29" className={s.vizStrokeInk} strokeWidth="2" />
      </svg>
      <Readout rest="06 inboxes" hover="01 inbox" />
    </div>
  );
}

/** Books that close themselves. Three ledger rows end misaligned at
    rest, which is the problem. On hover each row draws to the same
    length and the accent dot lands, which is the card's promise. */
function BooksViz() {
  const rows = [
    { y: 10, w: 0.62 },
    { y: 22, w: 0.84 },
    { y: 34, w: 0.48 },
  ];
  return (
    <div className={s.vizBox}>
      <svg
        className={s.vizBooks}
        viewBox="0 0 200 44"
        preserveAspectRatio="xMaxYMax meet"
        aria-hidden="true"
        focusable="false"
      >
        {rows.map((r, i) => (
          <g key={i}>
            <rect
              x="0"
              y={r.y - 2.5}
              width="168"
              height="5"
              rx="2.5"
              className={s.ledgerRow}
              style={{ '--w': r.w, '--i': i } as React.CSSProperties}
            />
            <rect
              x="176"
              y={r.y - 4.5}
            width="8"
            height="8"
            rx="4"
            className={s.ledgerDot}
            style={{ '--i': i } as React.CSSProperties}
          />
          </g>
        ))}
      </svg>
      <Readout rest="drift +3 rows" hover="reconciled" />
    </div>
  );
}

/** Yours on day one. A document stack, the top one ringed in the accent
    as the signed-off handover. On hover the stack fans open and the
    top document's key line draws itself in the accent. */
function DocsViz() {
  return (
    <div className={s.vizBox}>
      <svg
        className={s.vizDocs}
        viewBox="0 0 220 60"
        preserveAspectRatio="xMaxYMax meet"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="8" y="16" width="120" height="38" rx="3" className={s.docSheet} style={{ '--i': 0 } as React.CSSProperties} />
        <rect x="20" y="10" width="120" height="38" rx="3" className={s.docSheet} style={{ '--i': 1 } as React.CSSProperties} />
        <rect x="32" y="4" width="120" height="38" rx="3" className={s.docTop} style={{ '--i': 2 } as React.CSSProperties} />
        <line x1="44" y1="14" x2="120" y2="14" className={s.vizStrokeThin} strokeWidth="1.5" />
        <line x1="44" y1="22" x2="104" y2="22" className={s.vizStrokeThin} strokeWidth="1.5" />
        <line x1="44" y1="30" x2="112" y2="30" className={s.docKeyLine} strokeWidth="2" />
        {/* the check that signs it off */}
        <path d="M124 30 l 5 5 l 10 -11" className={s.docSign} strokeWidth="2" fill="none" />
      </svg>
      <Readout rest="handover draft" hover="signed off" />
    </div>
  );
}

/** Grounded: the answer with its citations. Three answer lines, each
    carrying a superscript dot that stands for the document behind that
    clause. On hover the dots land solid, the same beat the chips below
    brighten: every claim wired to its source. On the accent card the
    marks are the void colour, the accent's own ink. */
function GroundedViz() {
  const lines = [
    { y: 8, w: 148 },
    { y: 22, w: 122 },
    { y: 36, w: 100 },
  ];
  return (
    <svg
      className={s.vizGrounded}
      viewBox="0 0 176 46"
      preserveAspectRatio="xMaxYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      {lines.map((l, i) => (
        <g key={i}>
          <rect x="0" y={l.y} width={l.w} height="4.5" rx="2.25" className={s.answerLine} style={{ '--i': i } as React.CSSProperties} />
          <circle cx={l.w + 14} cy={l.y + 2.25} r="3.2" className={s.citeDot} style={{ '--i': i } as React.CSSProperties} />
        </g>
      ))}
    </svg>
  );
}
