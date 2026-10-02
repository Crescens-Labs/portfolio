'use client';

import { useEffect } from 'react';
import { getSound } from '@/lib/sound';

/** Anything a visitor can act on. */
const INTERACTIVE = 'a[href], button, [role="slider"], [role="button"], summary, input, select, textarea, label[for]';

/**
 * The interface cues, wired once for the whole site by delegation, so no
 * component has to know sound exists:
 *
 *   hover    pointer arrives on something interactive (mouse and pen
 *            only: a touch has no hover, and a tick on every tap's
 *            synthetic hover would double the click)
 *   click    press on it, or Enter / Space on the focused element
 *   confirm  instead of click when the action leaves the site: a new
 *            tab, mail, WhatsApp, or a form being sent
 *
 * `data-sfx="none"` on an element or an ancestor keeps it silent; the
 * sound switch itself uses it, since it has its own on and off cues.
 * Every cue is silent until the visitor has turned sound on.
 */
export function SoundCues() {
  useEffect(() => {
    const sound = getSound();
    if (!sound) return;

    let lastHover: Element | null = null;
    const target = (e: Event) => {
      const el = (e.target as Element | null)?.closest?.(INTERACTIVE) ?? null;
      if (!el || el.closest('[data-sfx="none"]')) return null;
      return el;
    };
    const leaves = (el: Element) => {
      if (!(el instanceof HTMLAnchorElement)) return false;
      return el.target === '_blank' || /^(mailto:|tel:|https:\/\/wa\.me)/.test(el.getAttribute('href') ?? '');
    };

    const onOver = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const el = target(e);
      if (el === lastHover) return;
      lastHover = el;
      if (el) sound.play('hover');
    };
    const onDown = (e: PointerEvent) => {
      const el = target(e);
      if (el) sound.play(leaves(el) ? 'confirm' : 'click');
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const el = target(e);
      if (el) sound.play(leaves(el) ? 'confirm' : 'click');
    };
    const onSubmit = () => sound.play('confirm');

    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('keydown', onKey);
    document.addEventListener('submit', onSubmit);
    return () => {
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('submit', onSubmit);
    };
  }, []);

  return null;
}
