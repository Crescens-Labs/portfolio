'use client';

import { useEffect, useRef } from 'react';

/**
 * Dot-matrix wordmark. The word is drawn to an offscreen canvas once,
 * sampled into a grid of on/off cells, then re-rendered as dots. A
 * brightness wave sweeps the columns continuously, so the word reads as
 * the logo's dot cluster extended into type.
 *
 * Canvas 2D, no dependencies, no WebGL context. The dots take their
 * colour from the element's `color`, so the palette stays in CSS where
 * the token tests can see it.
 *
 * Reduced motion: the matrix paints once, fully lit, and the wave never
 * runs.
 */
export function DotMatrix({
  text,
  className,
  /** Logical dot-cell size in px before devicePixelRatio scaling. */
  cell = 10,
}: {
  text: string;
  className?: string;
  cell?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Sample the word offscreen. The font size only sets sampling
    // resolution; the drawn size comes from the grid, so any canvas-
    // capable font works, loaded or not.
    const off = document.createElement('canvas');
    const pad = 8;
    const font = '700 64px Inter, system-ui, sans-serif';
    const octx = off.getContext('2d');
    if (!octx) return;
    octx.font = font;
    const metrics = octx.measureText(text);
    off.width = Math.ceil(metrics.width) + pad * 2;
    off.height = 96;
    octx.font = font;
    octx.textBaseline = 'middle';
    octx.fillStyle = '#fff';
    octx.fillText(text, pad, off.height / 2);

    const data = octx.getImageData(0, 0, off.width, off.height).data;
    const cols = Math.floor(off.width / cell);
    const rows = Math.floor(off.height / cell);
    const on: boolean[] = new Array(cols * rows).fill(false);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // A cell is on when the centre pixel of the block is painted.
        const px = Math.min(off.width - 1, x * cell + (cell >> 1));
        const py = Math.min(off.height - 1, y * cell + (cell >> 1));
        on[y * cols + x] = data[(py * off.width + px) * 4 + 3] > 110;
      }
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = cols * cell * dpr;
    canvas.height = rows * cell * dpr;
    canvas.style.aspectRatio = `${cols} / ${rows}`;
    ctx.scale(dpr, dpr);

    const colour = getComputedStyle(canvas).color;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const r = cell * 0.31;

    const paint = (t: number) => {
      ctx.clearRect(0, 0, cols * cell, rows * cell);
      ctx.fillStyle = colour;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (!on[y * cols + x]) continue;
          // The wave travels left to right; a slower vertical drift keeps
          // it from reading as a progress bar.
          const wave = 0.5 + 0.5 * Math.sin(x * 0.34 - t * 1.9 + y * 0.12);
          ctx.globalAlpha = reduced ? 1 : 0.3 + wave * 0.7;
          ctx.beginPath();
          ctx.arc(x * cell + cell / 2, y * cell + cell / 2, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    if (reduced) {
      paint(0);
      return;
    }
    let raf = 0;
    const loop = (now: number) => {
      paint(now / 1000);
      raf = requestAnimationFrame(loop);
    };
    // Only animate while on screen; a canvas that animates offscreen is
    // a battery tax nobody sees.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          raf = requestAnimationFrame(loop);
        } else {
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text, cell]);

  return <canvas ref={ref} className={className} role="img" aria-label={text} />;
}
