'use client';

import { useEffect, useRef } from 'react';

/**
 * The ASCII object, after canvas-ui's AsciiObject: a solid rendered as
 * live monospace glyphs. Their version needs three.js, a GLB loader and
 * a model file. Ours needs none of that, because the object IS the
 * logo: the five-dot C, each dot a sphere of sample points, rotating in
 * space and re-rasterised into the glyph field every frame.
 *
 * Depth becomes density (near points draw dense glyphs, far points
 * sparse ones) and the leading sphere carries the accent, so the mark
 * turns in front of you and reads as a solid, not a scatter.
 *
 * It answers the hand: drag horizontally to spin the cluster, with
 * inertia. Left alone it turns on its own, slowly. Vertical drags pass
 * through to the page (pan-y), so it never traps scroll on a phone.
 *
 * Canvas 2D only. Reduced motion: one static render, no auto-rotation,
 * drag still works because it is the visitor's own motion.
 */

const GLYPHS = ' .:-=+*#%@';
/** The logo's five dot angles, same numbers every other drawing uses. */
const ANGLES = [-88, -134, 180, 134, 88];

type P = { x: number; y: number; z: number; sphere: number };

/** Fibonacci sphere sampling: even coverage without pole bunching. */
function spherePoints(cx: number, cy: number, cz: number, r: number, n: number, sphere: number): P[] {
  const pts: P[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = golden * i;
    pts.push({
      x: cx + Math.cos(th) * rad * r,
      y: cy + y * r,
      z: cz + Math.sin(th) * rad * r,
      sphere,
    });
  }
  return pts;
}

export function AsciiObject({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // The cluster: five spheres on the C arc, in a 200-unit cube.
    const pts: P[] = [];
    ANGLES.forEach((deg, si) => {
      const a = (deg * Math.PI) / 180;
      pts.push(
        ...spherePoints(Math.cos(a) * 46, Math.sin(a) * 46, 0, 15.5, si === 0 ? 190 : 130, si),
      );
    });

    let w = 0;
    let h = 0;
    let cell = 9;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const size = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(0, rect.width);
      h = Math.max(0, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = Math.max(7, Math.min(11, Math.floor(w / 34)));
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(canvas);

    // Orientation of the cluster. Yaw drifts on its own; both respond
    // to drag with inertia.
    let yaw = -0.4;
    let pitch = 0.32;
    let vyaw = reduced ? 0 : 0.0022;
    let vpitch = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      vyaw = dx * 0.0026;
      vpitch = dy * 0.002;
      yaw += vyaw;
      pitch = Math.max(-1.2, Math.min(1.2, pitch + vpitch));
    };
    const onUp = () => {
      dragging = false;
    };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove, { passive: true });
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);

    const accent = getComputedStyle(canvas).color;
    const ink = getComputedStyle(canvas).getPropertyValue('--fig-ink').trim() || accent;

    const paint = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h) / 150;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const persp = 300;

      // Project every point, then sort far to near so the near glyphs
      // overwrite the far ones inside a cell.
      const proj = pts
        .map((p) => {
          const x1 = p.x * cosY - p.z * sinY;
          const z1 = p.x * sinY + p.z * cosY;
          const y1 = p.y * cosP - z1 * sinP;
          const z2 = p.y * sinP + z1 * cosP;
          const d = persp / (persp + z2);
          return { sx: cx + x1 * scale * d, sy: cy - y1 * scale * d, z: z2, sphere: p.sphere };
        })
        .sort((a, b) => b.z - a.z);

      ctx.font = `${cell}px var(--font-mono, ui-monospace), monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Which sphere is currently in front decides who wears the accent.
      let front = 0;
      let frontZ = -1e9;
      for (const p of proj) {
        if (p.z > frontZ) {
          frontZ = p.z;
          front = p.sphere;
        }
      }

      for (const p of proj) {
        const gx = Math.round(p.sx / cell) * cell + cell / 2;
        const gy = Math.round(p.sy / cell) * cell + cell / 2;
        // Near: dense glyph. Far: sparse. The ramp plus perspective is
        // what makes the field read as a solid object.
        const t = 1 - (p.z + 70) / 140;
        const g = GLYPHS[Math.max(1, Math.min(GLYPHS.length - 1, Math.round(t * (GLYPHS.length - 1))))];
        ctx.fillStyle = p.sphere === front ? accent : ink;
        ctx.globalAlpha = 0.35 + t * 0.65;
        ctx.fillText(g, gx, gy);
      }
      ctx.globalAlpha = 1;
    };

    if (reduced) {
      paint();
      return () => {
        ro.disconnect();
      };
    }

    let raf = 0;
    const loop = () => {
      if (!dragging) {
        vyaw *= 0.96;
        vpitch *= 0.9;
        vyaw += (0.0022 - vyaw) * 0.01; // drift back to idle spin
        yaw += vyaw;
        pitch = Math.max(-1.2, Math.min(1.2, pitch + vpitch));
      }
      paint();
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

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className={className}
      role="img"
      aria-label="The studio's dot cluster mark, turning, rendered as ASCII"
      style={{ touchAction: 'pan-y', cursor: 'grab' }}
    />
  );
}
