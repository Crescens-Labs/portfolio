import { WHATSAPP } from '@/content/home';

/**
 * A wa.me deep link, optionally with a prefilled message. On a phone it
 * opens the app straight into the chat; on desktop it opens WhatsApp Web
 * or the desktop client. No API, no key, nothing to break.
 */
export function waHref(message?: string): string {
  const base = `https://wa.me/${WHATSAPP.number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Spread onto an anchor: a chat opens in its own tab, never replaces ours. */
export const external = { target: '_blank', rel: 'noopener noreferrer' } as const;
