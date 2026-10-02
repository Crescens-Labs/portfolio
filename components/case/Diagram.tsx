'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/gsap';
import type { Diagram as DiagramData } from '@/content/work';
import s from './diagram.module.css';

/**
 * An architecture diagram drawn from data: columns of nodes, directed
 * edges, one caption. Laid out twice, because a diagram that is only
 * scaled down stops being legible on a phone:
 *
 *   wide    columns run left to right, edges leave a node's right side
 *   narrow  columns become rows, edges leave a node's bottom
 *
 * CSS shows one of the two. Every coordinate lives in the viewBox, so the
 * drawing scales as a unit and the text stays aligned to its boxes.
 */

type Box = { id: string; x: number; y: number; w: number; h: number; label: string; note?: string; col: number };
type Layout = { width: number; height: number; boxes: Map<string, Box>; heads: { x: number; y: number; label: string }[] };

const BOX_H = 66;
const HEAD = 44;

function wide(d: DiagramData): Layout {
  const width = 1000;
  const boxW = 196;
  const gapY = 22;
  const cols = d.columns.length;
  const maxN = Math.max(...d.columns.map((c) => c.nodes.length));
  const height = HEAD + maxN * BOX_H + (maxN - 1) * gapY + 4;
  const step = (width - boxW) / Math.max(1, cols - 1);
  const boxes = new Map<string, Box>();
  const heads: Layout['heads'] = [];
  d.columns.forEach((c, ci) => {
    const x = ci * step;
    heads.push({ x, y: 14, label: c.label });
    const offset = ((maxN - c.nodes.length) * (BOX_H + gapY)) / 2;
    c.nodes.forEach((n, ni) => {
      boxes.set(n.id, { ...n, x, y: HEAD + offset + ni * (BOX_H + gapY), w: boxW, h: BOX_H, col: ci });
    });
  });
  return { width, height, boxes, heads };
}

function narrow(d: DiagramData): Layout {
  const width = 420;
  const gapX = 14;
  const rowGap = 46;
  const boxes = new Map<string, Box>();
  const heads: Layout['heads'] = [];
  let y = 0;
  d.columns.forEach((c, ci) => {
    heads.push({ x: 0, y: y + 14, label: c.label });
    y += 28;
    const n = c.nodes.length;
    const w = (width - gapX * (n - 1)) / n;
    c.nodes.forEach((node, ni) => {
      boxes.set(node.id, { ...node, x: ni * (w + gapX), y, w, h: BOX_H, col: ci });
    });
    y += BOX_H + rowGap;
  });
  return { width, height: y - rowGap + 4, boxes, heads };
}

/** A cubic from one box to the next, leaving along the flow direction. */
function edgePath(a: Box, b: Box, dir: 'x' | 'y'): string {
  if (a.col === b.col) {
    // Same column: a short straight link between facing sides, a drop
    // when the column stands up (wide) and a step sideways when it lies
    // down as a row (narrow). Which sides face depends on which box is
    // first, so the line never crosses a box to reach the other.
    if (dir === 'x') {
      const down = b.y > a.y;
      const x = a.x + a.w / 2;
      return down ? `M${x} ${a.y + a.h} L${x} ${b.y}` : `M${x} ${a.y} L${x} ${b.y + b.h}`;
    }
    const right = b.x > a.x;
    const y = a.y + a.h / 2;
    return right ? `M${a.x + a.w} ${y} L${b.x} ${y}` : `M${a.x} ${y} L${b.x + b.w} ${y}`;
  }
  if (dir === 'x') {
    const x1 = a.x + a.w;
    const y1 = a.y + a.h / 2;
    const x2 = b.x;
    const y2 = b.y + b.h / 2;
    const k = (x2 - x1) / 2;
    return `M${x1} ${y1} C${x1 + k} ${y1} ${x2 - k} ${y2} ${x2} ${y2}`;
  }
  const x1 = a.x + a.w / 2;
  const y1 = a.y + a.h;
  const x2 = b.x + b.w / 2;
  const y2 = b.y;
  const k = (y2 - y1) / 2;
  return `M${x1} ${y1} C${x1} ${y1 + k} ${x2} ${y2 - k} ${x2} ${y2}`;
}

function Drawing({ data, layout, dir, className }: { data: DiagramData; layout: Layout; dir: 'x' | 'y'; className: string }) {
  return (
    <svg
      className={className}
      viewBox={`-2 -2 ${layout.width + 4} ${layout.height + 4}`}
      role="img"
      aria-label={`Architecture: ${data.caption}`}
    >
      {layout.heads.map((h) => (
        <text key={h.label} className={s.head} x={h.x} y={h.y} fontSize={11} letterSpacing={0.9}>
          {h.label}
        </text>
      ))}
      {data.edges.map(([from, to], i) => {
        const a = layout.boxes.get(from);
        const b = layout.boxes.get(to);
        if (!a || !b) return null;
        const d = edgePath(a, b, dir);
        return (
          <g key={`${from}-${to}`} data-a={from} data-b={to} className={s.link}>
            <path className={s.edge} d={d} pathLength={1} style={{ '--i': i } as React.CSSProperties} />
            {/* A packet travelling the link, so the drawing reads as data
                moving rather than as a flowchart. SMIL, because it moves
                in viewBox units and scales with the drawing. */}
            <circle className={s.pulse} r={3}>
              <animateMotion dur="2.6s" begin={`${(i * 0.37) % 2.6}s`} repeatCount="indefinite" path={d} />
            </circle>
          </g>
        );
      })}
      {[...layout.boxes.values()].map((b) => (
        <g key={b.id} className={s.node} data-node={b.id} style={{ '--c': b.col } as React.CSSProperties}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={4} />
          <text className={s.nodeLabel} x={b.x + 14} y={b.y + (b.note ? 28 : 38)} fontSize={15} letterSpacing={-0.15}>
            {b.label}
          </text>
          {b.note && (
            <text className={s.nodeNote} x={b.x + 14} y={b.y + 48} fontSize={11}>
              {b.note}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

/**
 * Motion is added, never required. The markup renders fully drawn; only
 * once JS knows motion is welcome does it arm the figure (edges hidden),
 * and the first sight of it draws them in, column by column. Hovering a
 * node lights the links that touch it.
 */
export function Diagram({ data }: { data: DiagramData }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const hot = (id: string | null) => {
      el.querySelectorAll<SVGGElement>('[data-a]').forEach((g) => {
        const on = id !== null && (g.dataset.a === id || g.dataset.b === id);
        g.toggleAttribute('data-hot', on);
      });
      el.toggleAttribute('data-focus', id !== null);
    };
    const nodes = [...el.querySelectorAll<SVGGElement>('[data-node]')];
    const enter = (e: Event) => hot((e.currentTarget as SVGGElement).dataset.node ?? null);
    const leave = () => hot(null);
    nodes.forEach((n) => {
      n.addEventListener('pointerenter', enter);
      n.addEventListener('pointerleave', leave);
    });

    let io: IntersectionObserver | undefined;
    if (!prefersReducedMotion()) {
      el.dataset.armed = 'true';
      io = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          el.dataset.in = 'true';
          io?.disconnect();
        },
        { threshold: 0.35 },
      );
      io.observe(el);
    }

    return () => {
      io?.disconnect();
      nodes.forEach((n) => {
        n.removeEventListener('pointerenter', enter);
        n.removeEventListener('pointerleave', leave);
      });
    };
  }, []);

  return (
    <figure className={s.diagram} ref={root}>
      <div className={s.frame}>
        <Drawing data={data} layout={wide(data)} dir="x" className={s.wide} />
        <Drawing data={data} layout={narrow(data)} dir="y" className={s.narrow} />
      </div>
      <figcaption className={s.caption}>{data.caption}</figcaption>
    </figure>
  );
}
