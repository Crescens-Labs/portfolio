'use client';

import { useEffect, useRef } from 'react';

/**
 * ASCII figure. A source line drawing is painted to an offscreen canvas
 * once, sampled cell by cell into a grid, then re-rendered as monospace
 * glyphs in ONE ink. No accent band, no per-glyph shimmer: the figure
 * is white marks on a void plate, and the only motion is a single slow
 * scan of brightness travelling down it every sixteen seconds, quiet
 * enough to read as the plate breathing rather than the art moving.
 *
 * The art itself: a bust in right-facing profile, one filled mass, the
 * face cut out so the features survive the sample grid. Inside the
 * skull, cut out as a tangle: a spiral, two loops, a zigzag. The
 * confusion is carved INTO the head, not floating around it. The
 * question marks sit ahead of the face, in the direction the figure
 * looks, because that is where the client is looking too.
 *
 * Canvas 2D only, no three.js, no GLB, no image assets to fall out of
 * date. Reduced motion: the figure paints once, fully lit, and the
 * scan never runs.
 */
const GLYPHS = ' .:-=+*#%@';

function drawFigure(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#fff';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // The bust, one filled mass, drawn up the back and down the face so
  // the profile carries the direction: nose, lips and chin all sit on
  // the right edge of the shape. The figure faces right.
  ctx.beginPath();
  ctx.moveTo(w * 0.14, h * 0.9);
  ctx.quadraticCurveTo(w * 0.13, h * 0.64, w * 0.27, h * 0.54);
  ctx.quadraticCurveTo(w * 0.26, h * 0.47, w * 0.27, h * 0.42);
  ctx.quadraticCurveTo(w * 0.27, h * 0.28, w * 0.36, h * 0.16);
  ctx.quadraticCurveTo(w * 0.44, h * 0.07, w * 0.58, h * 0.09);
  ctx.quadraticCurveTo(w * 0.66, h * 0.11, w * 0.665, h * 0.18);
  ctx.quadraticCurveTo(w * 0.665, h * 0.23, w * 0.66, h * 0.26);
  // Brow to nose tip, then back under: the profile's strongest read.
  ctx.quadraticCurveTo(w * 0.7, h * 0.285, w * 0.735, h * 0.315);
  ctx.quadraticCurveTo(w * 0.7, h * 0.335, w * 0.665, h * 0.345);
  // Lips and chin.
  ctx.lineTo(w * 0.685, h * 0.375);
  ctx.quadraticCurveTo(w * 0.675, h * 0.39, w * 0.655, h * 0.395);
  ctx.quadraticCurveTo(w * 0.67, h * 0.43, w * 0.645, h * 0.46);
  // Jaw to the front of the neck, chest, right shoulder.
  ctx.quadraticCurveTo(w * 0.55, h * 0.52, w * 0.45, h * 0.5);
  ctx.quadraticCurveTo(w * 0.44, h * 0.56, w * 0.46, h * 0.6);
  ctx.quadraticCurveTo(w * 0.6, h * 0.66, w * 0.66, h * 0.68);
  ctx.quadraticCurveTo(w * 0.8, h * 0.72, w * 0.86, h * 0.9);
  ctx.closePath();
  ctx.fill();

  // Everything from here is cut out of the mass, so it samples as
  // absence rather than as a second colour.
  ctx.globalCompositeOperation = 'destination-out';

  // Eye, brow, mouth: the minimum face.
  ctx.beginPath();
  ctx.arc(w * 0.6, h * 0.27, w * 0.013, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = w * 0.022;
  ctx.beginPath();
  ctx.moveTo(w * 0.575, h * 0.245);
  ctx.lineTo(w * 0.635, h * 0.245);
  ctx.stroke();
  ctx.lineWidth = w * 0.015;
  ctx.beginPath();
  ctx.moveTo(w * 0.65, h * 0.4);
  ctx.lineTo(w * 0.685, h * 0.4);
  ctx.stroke();
  // Ear, a small hook in the side of the head.
  ctx.lineWidth = w * 0.02;
  ctx.beginPath();
  ctx.arc(w * 0.47, h * 0.33, w * 0.032, Math.PI * 0.6, Math.PI * 1.7);
  ctx.stroke();

  // The tangle, carved through the skull: a spiral grown from the
  // middle, two loops laid across it, and a zigzag driven through both.
  // This is the confusion the section is about, so it gets the most
  // ink of anything on the figure.
  const cx = w * 0.44;
  const cy = h * 0.235;
  ctx.lineWidth = w * 0.02;
  ctx.beginPath();
  for (let a = 0; a < Math.PI * 6.5; a += 0.12) {
    const r = w * (0.006 + 0.0055 * a);
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r * 0.78;
    if (a === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(w * 0.39, h * 0.2, w * 0.075, h * 0.032, -0.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(w * 0.47, h * 0.28, w * 0.08, h * 0.026, 0.45, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = w * 0.017;
  ctx.beginPath();
  ctx.moveTo(w * 0.3, h * 0.33);
  for (let i = 0; i < 6; i++) {
    ctx.lineTo(w * (0.325 + i * 0.04), h * (i % 2 === 0 ? 0.31 : 0.35));
  }
  ctx.stroke();
  // One loose curl escaping through the crown: the thought not yet
  // caught by the spiral.
  ctx.lineWidth = w * 0.016;
  ctx.beginPath();
  ctx.moveTo(w * 0.55, h * 0.13);
  ctx.quadraticCurveTo(w * 0.6, h * 0.09, w * 0.56, h * 0.06);
  ctx.stroke();

  ctx.globalCompositeOperation = 'source-over';

  // The question marks, ahead of the face, in the direction the figure
  // looks: one large at the horizon, one medium beside it, one small
  // already past. Real bold type, so the glyphs rasterise crisp.
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${Math.round(w * 0.24)}px Inter, system-ui, sans-serif`;
  ctx.fillText('?', w * 0.87, h * 0.16);
  ctx.font = `900 ${Math.round(w * 0.13)}px Inter, system-ui, sans-serif`;
  ctx.fillText('?', w * 0.9, h * 0.4);
  ctx.font = `900 ${Math.round(w * 0.09)}px Inter, system-ui, sans-serif`;
  ctx.fillText('?', w * 0.76, h * 0.05);
}

export function AsciiFigure({
  className,
  /** glyph cell in px before DPR scaling. Smaller is denser/slower. */
  cell = 8,
}: {
  className?: string;
  cell?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cleanup: { fn?: () => void } = {};

    const off = document.createElement('canvas');
    off.width = 380;
    off.height = 480;
    const octx = off.getContext('2d', { willReadFrequently: true });
    if (!octx) return;

    drawFigure(octx, off.width, off.height);
    const data = octx.getImageData(0, 0, off.width, off.height).data;

    // Sample the whole cell, not a point. A centre-pixel read misses
    // thin features and turns the figure into scattered glyphs; a full
    // cell average gives every glyph a true coverage to map from.
    const cols = Math.floor(off.width / cell);
    const rows = Math.floor(off.height / cell);
    const lum = new Float32Array(cols * rows);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let acc = 0;
        for (let sy = 0; sy < cell; sy += 2) {
          for (let sx = 0; sx < cell; sx += 2) {
            const px = Math.min(off.width - 1, x * cell + sx);
            const py = Math.min(off.height - 1, y * cell + sy);
            acc += data[(py * off.width + px) * 4 + 3] / 255;
          }
        }
        lum[y * cols + x] = acc / ((cell / 2) * (cell / 2));
      }
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = cols * cell * dpr;
    canvas.height = rows * cell * dpr;
    canvas.style.aspectRatio = `${cols} / ${rows}`;
    ctx.scale(dpr, dpr);

    const ink = getComputedStyle(canvas).getPropertyValue('--fig-ink').trim() || '#fff';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const paint = (t: number) => {
      ctx.clearRect(0, 0, cols * cell, rows * cell);
      ctx.font = `${cell}px var(--font-mono, ui-monospace), monospace`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillStyle = ink;
      // One scan of brightness travels down the plate, wraparound, a
      // full pass every ~16s. Its floor is high, so between passes the
      // figure is simply THERE, lit.
      const scan = (t * 0.06) % 1;
      for (let y = 0; y < rows; y++) {
        let d = Math.abs(y / rows - scan);
        d = Math.min(d, 1 - d);
        const band = Math.max(0, 1 - d / 0.09);
        for (let x = 0; x < cols; x++) {
          const l = lum[y * cols + x];
          if (l < 0.06) continue;
          const g = GLYPHS[Math.min(GLYPHS.length - 1, Math.floor(l * GLYPHS.length))];
          ctx.globalAlpha = reduced ? Math.min(1, l * 1.3) : Math.min(1, l * (0.72 + 0.38 * band));
          ctx.fillText(g, x * cell + cell / 2, y * cell + cell / 2);
        }
      }
      ctx.globalAlpha = 1;
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
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) raf = requestAnimationFrame(loop);
        else cancelAnimationFrame(raf);
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);
    cleanup.fn = () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };

    return () => {
      cleanup.fn?.();
    };
  }, [cell]);

  return (
    <canvas
      ref={ref}
      className={className}
      role="img"
      aria-label="A figure facing right, the head carved into a tangle, rendered as ASCII"
    />
  );
}
