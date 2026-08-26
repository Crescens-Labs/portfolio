'use client';

import { useEffect, useRef } from 'react';
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

    const cell = 10;
    const line = 19;
    const edge = 110;
    let cells: Cell[] = [];
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const layout = () => {
      const rect = host.getBoundingClientRect();
      w = Math.max(0, rect.width);
      h = Math.max(0, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
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
    };
    layout();
    const ro = new ResizeObserver(() => {
      layout();
      // Assigning canvas.width cleared it. Repaint the resting veil in
      // place when the loop is parked, so a resize never blinks the
      // cipher out. This is the "sometimes there, sometimes not" bug:
      // the observer fired, nothing repainted, the veil was gone.
      if (!running) draw(performance.now());
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
      wake();
    };
    const onEnter = () => {
      inside = true;
      window.clearTimeout(linger);
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

    const inkCol = getComputedStyle(canvas).getPropertyValue('--veil-ink').trim() || 'rgba(154,162,158,0.55)';
    const edgeCol = getComputedStyle(canvas).getPropertyValue('--veil-edge').trim() || 'rgba(249,180,214,0.9)';
    const washCol = getComputedStyle(canvas).getPropertyValue('--veil-wash').trim() || 'rgba(8,17,13,0.93)';

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
      if (!running) draw(performance.now());
    });

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

      ctx.clearRect(0, 0, w, h);

      // The wash is what actually hides the content. Glyphs alone left
      // the real words readable through the line gaps, which broke the
      // premise: encrypted means unreadable, not decorated. A near
      // opaque field goes down first, then the decrypt circle is punched
      // out of it with a soft radial edge, so the hole and the sizzle
      // band share one boundary.
      ctx.fillStyle = washCol;
      ctx.fillRect(0, 0, w, h);
      if (radius > 1) {
        const hole = ctx.createRadialGradient(sx, sy, Math.max(0, radius - edge), sx, sy, Math.max(1, radius));
        hole.addColorStop(0, 'rgba(0,0,0,1)');
        hole.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = hole;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'source-over';
      }

      const t = now / 1000;
      const scrambled = Math.max(1, Math.round(cells.length * 0.004));

      ctx.font = `${cell}px var(--font-mono, ui-monospace), monospace`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      for (let i = 0; i < cells.length; i++) {
        const c = cells[i];
        const d = Math.hypot(c.x - sx, c.y - sy);
        const rel = (radius - d) / edge; // >1 clear, <0 cipher, between edge
        if (rel > 1) continue; // fully decrypted: nothing to draw
        // Idle mutation keeps the unread cipher alive.
        if (rel < 0 && Math.random() < 0.0007 * scrambled) {
          c.ch = Math.floor(Math.random() * CHARS.length);
        }
        if (rel < 0) {
          ctx.fillStyle = inkCol;
          ctx.globalAlpha = c.a;
        } else {
          // The sizzle: cells inside the edge band flip characters fast
          // and burn in the accent before they go.
          if (Math.random() < 0.5) c.ch = Math.floor(Math.random() * CHARS.length);
          ctx.fillStyle = edgeCol;
          ctx.globalAlpha = c.a * (1 - rel) * (0.6 + 0.4 * Math.sin(t * 22 + i));
        }
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
      if (!inside && radius < 1) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    return () => {
      running = false;
      window.clearTimeout(linger);
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
