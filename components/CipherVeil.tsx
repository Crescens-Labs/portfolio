'use client';

import { useEffect, useRef } from 'react';
import { getSound } from '@/lib/sound';
import s from './cipher-veil.module.css';

/**
 * The decrypt veil, after canvas-ui's DecryptReveal: the section sits
 * behind a sheet of cipher that the pointer decrypts. Move the cursor
 * over it and a circle of plain reality opens; stay, and the circle
 * keeps growing until the whole section is clear. Leave, and the cipher
 * grows back from the edges.
 *
 * The canvas-ui original rasterises the real DOM through Chrome's
 * experimental HTML-in-canvas API, so outside Chrome it does nothing at
 * all. This one flips the problem: the REAL content stays in the DOM,
 * selected, searchable and readable by assistive tech, and the veil is
 * a purely decorative layer of fake cipher text that simply stops being
 * drawn where the decrypt circle has passed. Every browser gets the
 * effect, nothing is ever actually hidden, and a visitor who never
 * touches a pointer loses nothing.
 *
 * The cipher is written as text-like lines, words of random length in
 * mono, mutating on idle and sizzling in the accent along the decrypt
 * edge. Canvas 2D only.
 *
 * Sound, when the visitor has turned it on: the split-flap flutter as the
 * veil starts to open from rest, and the last flap landing as the
 * section comes fully clear. Once each per visit to the section.
 *
 * Motion contract: reduced motion, coarse pointers and narrow viewports
 * never mount the veil at all; the section is simply itself.
 */

const CHARS = '01<>[]{}/\\|=+*#%&?!@$ABCDEFXYZ';

type Cell = {
  x: number;
  y: number;
  ch: number; // index into CHARS
  a: number; // base alpha, varied per cell
};

export function CipherVeil({ hint }: { hint?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const host = canvas.parentElement;
    if (!host) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (reduced || !fine || window.innerWidth < 700) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const inkCol = getComputedStyle(canvas).getPropertyValue('--veil-ink').trim() || 'rgba(154,162,158,0.55)';
    const edgeCol = getComputedStyle(canvas).getPropertyValue('--veil-edge').trim() || 'rgba(249,180,214,0.9)';
    const washCol = getComputedStyle(canvas).getPropertyValue('--veil-wash').trim() || 'rgba(8,17,13,0.93)';

    const cell = 10;
    const line = 19;
    const edge = 110;
    let cells: Cell[] = [];
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    // The resting cipher, wash and ink, rendered once per layout into an
    // offscreen canvas. A frame copies it in one drawImage instead of
    // calling fillText for every one of ~6000 cells, and only the edge
    // band is drawn glyph by glyph.
    const base = document.createElement('canvas');
    const bctx = base.getContext('2d');
    if (!bctx) return;
    const mono = getComputedStyle(canvas).getPropertyValue('--font-mono').trim() || 'ui-monospace, monospace';
    const font = `${cell}px ${mono}`;

    const paintCell = (c: Cell) => {
      bctx.globalAlpha = c.a;
      bctx.fillText(CHARS[c.ch], c.x, c.y);
    };
    const paintBase = () => {
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bctx.clearRect(0, 0, w, h);
      bctx.globalAlpha = 1;
      bctx.fillStyle = washCol;
      bctx.fillRect(0, 0, w, h);
      bctx.font = font;
      bctx.textBaseline = 'middle';
      bctx.textAlign = 'center';
      bctx.fillStyle = inkCol;
      for (const c of cells) paintCell(c);
      bctx.globalAlpha = 1;
    };
    const layout = () => {
      const rect = host.getBoundingClientRect();
      w = Math.max(0, rect.width);
      h = Math.max(0, rect.height);
      canvas.width = base.width = Math.round(w * dpr);
      canvas.height = base.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cells = [];
      // Text-like lines: runs of word length with word gaps, so the
      // cipher reads as redacted documents rather than a wall of noise.
      let y = 14;
      while (y < h - 8) {
        let x = 10 + ((y * 7) % 60);
        while (x < w - 8) {
          const word = 3 + Math.floor(Math.random() * 9);
          for (let i = 0; i < word && x < w - 8; i++) {
            cells.push({
              x,
              y,
              ch: Math.floor(Math.random() * CHARS.length),
              a: 0.6 + Math.random() * 0.4,
            });
            x += cell;
          }
          x += cell * 2;
        }
        y += line;
      }
      paintBase();
    };
    layout();
    // The section's height twitches while its decrypting names reflow,
    // and every rebuild re-sets ~6000 glyphs (10 to 38ms). Rebuild once
    // the size has settled, and only for a real change; until then the
    // old canvas simply stays put.
    let settle = 0;
    const ro = new ResizeObserver(() => {
      // The border box, the same box layout() sizes the canvas to.
      const { width, height } = host.getBoundingClientRect();
      if (Math.abs(width - w) < 1 && Math.abs(height - h) < 1) return;
      window.clearTimeout(settle);
      window.clearTimeout(landing);
      settle = window.setTimeout(() => {
        layout();
        // Assigning canvas.width cleared it. Repaint the whole veil, loop
        // running or not: a running loop only repaints the dirty box
        // around the circle, so skipping this while running left the rest
        // of the section bare (a row's hover resizes the section). The
        // next frame punches the hole back in. Skipping it while parked
        // was the old "sometimes there, sometimes not" bug.
        if (radius < coverMax() - 1) paintAll();
      }, 180);
    });
    ro.observe(host);

    // Pointer state. The veil itself never takes a pointer event; the
    // host section reports its own.
    let px = -9999;
    let py = -9999;
    let sx = -9999; // smoothed follow
    let sy = -9999;
    let inside = false;
    let radius = 0;
    const coverMax = () => Math.hypot(w, h) * 1.05;

    // The linger. Leaving the section does NOT re-encrypt on the spot:
    // the decrypt holds for 3.5s and then grows back, so a fast in-and-out
    // never makes the section flicker clear-to-cipher-to-clear. The timer
    // is cleared on re-entry, and the loop stays awake through the whole
    // decay so the re-encrypt is one continuous eased motion, never a
    // cut.
    const LINGER_MS = 3500;
    let linger = 0;

    let raf = 0;
    let running = false;
    const wake = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
      if (inside && radius >= coverMax() - 1) return;
      wake();
    };
    // The cues mark the two ends of a reveal, once each: opening from a
    // veil that is (nearly) whole, and arriving at fully clear.
    let resolved = false;
    let decryptAt = -Infinity;
    let landing = 0;
    const onEnter = () => {
      inside = true;
      window.clearTimeout(linger);
      if (radius < edge) {
        resolved = false;
        decryptAt = performance.now();
        getSound()?.play('decrypt');
      }
      wake();
    };
    const onLeave = () => {
      window.clearTimeout(linger);
      // The decrypt holds exactly where it is for the linger window
      // (inside stays true, so the radius target does not move), then
      // the timer flips it and the still-awake loop eases the cipher
      // back in. Re-entering cancels the whole decay.
      linger = window.setTimeout(() => {
        linger = 0;
        inside = false;
        wake();
      }, LINGER_MS);
      wake();
    };
    host.addEventListener('pointermove', onMove, { passive: true });
    host.addEventListener('pointerenter', onEnter, { passive: true });
    host.addEventListener('pointerleave', onLeave, { passive: true });


    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) wake();
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);

    // The resting veil paints as soon as the observer callbacks can
    // run, before the visitor can scroll the section into concern: the
    // content under it is meant to be unreadable, not readable for a
    // blink while the loop waits for its first wake.
    requestAnimationFrame(() => {
      if (!running) paintAll();
    });

    let prev: { x0: number; y0: number; x1: number; y1: number } | null = null;
    /** The resting veil, whole: one copy of the base. */
    const paintAll = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(base, 0, 0, w, h);
      prev = null;
    };

    const draw = (now: number) => {
      // The circle follows the cursor with damping, the way the
      // original's smoothing option does, so the edge never snaps.
      if (sx < -999) {
        sx = px;
        sy = py;
      }
      sx += (px - sx) * 0.16;
      sy += (py - sy) * 0.16;

      // Stay, and the decrypt keeps expanding until everything is
      // clear. Leave, and it collapses back quickly.
      const target = inside ? coverMax() : 0;
      radius += (target - radius) * (inside ? 0.03 : 0.085);

      // Fully decrypted: nothing left to draw.
      if (radius >= coverMax() - 1) {
        ctx.clearRect(0, 0, w, h);
        prev = null;
        return;
      }

      // Only the dirty rectangle is repainted: the circle's box this frame
      // united with last frame's, so wherever the hole was, the cipher is
      // restored. A full-canvas copy and a full-canvas punch every frame
      // cost the Lab section its frame budget.
      const r = radius > 1 ? radius + 2 : 0;
      const box = r ? { x0: sx - r, y0: sy - r, x1: sx + r, y1: sy + r } : null;
      let x0 = box ? box.x0 : w;
      let y0 = box ? box.y0 : h;
      let x1 = box ? box.x1 : 0;
      let y1 = box ? box.y1 : 0;
      if (prev) {
        x0 = Math.min(x0, prev.x0);
        y0 = Math.min(y0, prev.y0);
        x1 = Math.max(x1, prev.x1);
        y1 = Math.max(y1, prev.y1);
      }
      prev = box;
      x0 = Math.max(0, Math.floor(x0));
      y0 = Math.max(0, Math.floor(y0));
      x1 = Math.min(w, Math.ceil(x1));
      y1 = Math.min(h, Math.ceil(y1));
      if (x1 > x0 && y1 > y0) {
        const bw = x1 - x0;
        const bh = y1 - y0;
        ctx.clearRect(x0, y0, bw, bh);
        ctx.drawImage(base, x0 * dpr, y0 * dpr, bw * dpr, bh * dpr, x0, y0, bw, bh);
        if (r) {
          // The wash is what actually hides the content, and it is part
          // of the base: glyphs alone left the real words readable through
          // the line gaps. The circle is punched out of wash and cipher
          // together with a soft radial edge, so the hole and the sizzle
          // band share one boundary.
          const hole = ctx.createRadialGradient(sx, sy, Math.max(0, radius - edge), sx, sy, Math.max(1, radius));
          hole.addColorStop(0, 'rgba(0,0,0,1)');
          hole.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.globalCompositeOperation = 'destination-out';
          ctx.fillStyle = hole;
          ctx.fillRect(x0, y0, bw, bh);
          ctx.globalCompositeOperation = 'source-over';
        }
      }

      // Idle mutation keeps the unread cipher alive: a handful of cells a
      // frame get a new glyph, drawn straight onto the visible canvas
      // where the veil is still whole. The base is never written after
      // layout. Writing to it and then copying from it made Chrome
      // snapshot the whole offscreen canvas on every copy, ~250ms frames.
      const scrambled = Math.max(1, Math.round(cells.length * 0.004));
      const hole2 = radius * radius;
      ctx.font = font;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      for (let k = 0; k < scrambled; k++) {
        const c = cells[Math.floor(Math.random() * cells.length)];
        const dx = c.x - sx;
        const dy = c.y - sy;
        if (radius > 1 && dx * dx + dy * dy < hole2) continue;
        c.ch = Math.floor(Math.random() * CHARS.length);
        const cx = c.x - cell / 2;
        const cy = c.y - line / 2;
        ctx.clearRect(cx, cy, cell, line);
        ctx.globalAlpha = 1;
        ctx.fillStyle = washCol;
        ctx.fillRect(cx, cy, cell, line);
        ctx.fillStyle = inkCol;
        ctx.globalAlpha = c.a;
        ctx.fillText(CHARS[c.ch], c.x, c.y);
      }
      ctx.globalAlpha = 1;

      if (radius <= 1) return;
      // The sizzle: only cells inside the edge band, where the circle is
      // eating the cipher, flip fast and burn in the accent. Squared
      // distances against the band's two radii, no square roots.
      const t = now / 1000;
      const outer = radius * radius;
      const innerR = Math.max(0, radius - edge);
      const inner = innerR * innerR;
      ctx.font = font;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillStyle = edgeCol;
      for (let i = 0; i < cells.length; i++) {
        const c = cells[i];
        const dy = c.y - sy;
        if (dy * dy > outer) continue;
        const dx = c.x - sx;
        const d2 = dx * dx + dy * dy;
        if (d2 > outer || d2 < inner) continue;
        const rel = (radius - Math.sqrt(d2)) / edge;
        if (Math.random() < 0.5) c.ch = Math.floor(Math.random() * CHARS.length);
        ctx.globalAlpha = c.a * (1 - rel) * (0.6 + 0.4 * Math.sin(t * 22 + i));
        ctx.fillText(CHARS[c.ch], c.x, c.y);
      }
      ctx.globalAlpha = 1;
    };

    // Parked while idle: nothing is moving, so nothing redraws. Any
    // event that can change the picture (pointer, intersection, resize)
    // wakes it for another pass, which is what keeps the decrypt alive
    // after the loop has already parked itself once.
    const loop = (now: number) => {
      if (!running) return;
      draw(now);
      // Parks at rest (veiled, pointer gone) and once fully decrypted:
      // a clear section has nothing left to animate, and the loop used
      // to redraw it every frame for as long as the pointer stayed.
      // "Clear" is what the visitor sees: the solid part of the circle
      // covers every corner of the section's on-screen part. The full
      // section takes seconds longer, off screen, where no one is looking.
      if (inside && !resolved && radius > edge) {
        const r = host.getBoundingClientRect();
        const top = Math.max(0, -r.top);
        const bottom = Math.min(h, window.innerHeight - r.top);
        const far = Math.max(
          Math.hypot(sx, sy - top),
          Math.hypot(w - sx, sy - top),
          Math.hypot(sx, bottom - sy),
          Math.hypot(w - sx, bottom - sy),
        );
        if (radius - edge >= far) {
          resolved = true;
          // The last flap lands after the flutter has settled, never on
          // top of it: the flutter runs ~1.4s and thins out by ~1.1s.
          const wait = Math.max(0, decryptAt + 1100 - performance.now());
          landing = window.setTimeout(() => getSound()?.play('resolve'), wait);
        }
      }
      if ((!inside && radius < 1) || (inside && radius >= coverMax() - 1)) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    return () => {
      running = false;
      window.clearTimeout(linger);
      window.clearTimeout(settle);
      window.clearTimeout(landing);
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerenter', onEnter);
      host.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={s.veil}
      aria-hidden="true"
      data-hint={hint || undefined}
    />
  );
}
