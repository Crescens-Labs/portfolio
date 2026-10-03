/**
 * Generates the site's interface sound from ElevenLabs, then masters it
 * for the web. Effects only: the site has no background music. A page
 * read for minutes does not need a bed under it, and one drowned the
 * cues that answer what the visitor did.
 *
 *   node scripts/generate-audio.mjs                 every effect
 *   node scripts/generate-audio.mjs --only=hover    one cue, by name
 *   node scripts/generate-audio.mjs --variants=3    takes per effect
 *   node scripts/generate-audio.mjs --master-only   re-master the PICKS below
 *                                                   from .audio-raw, no API
 *
 * Needs ELEVENLABS_API_KEY in .env.local (server side only: this runs on a
 * developer machine, the key never reaches the browser) and ffmpeg on PATH.
 *
 * Raw takes land in .audio-raw/ (gitignored) so a pick can be re-mastered
 * without paying for a regeneration. Mastered files land in public/audio/.
 *
 * The palette, so the site sounds like it looks: tactile and dry, felt,
 * ceramic, glass and paper, no sci-fi bleeps. Short, low in the mix, and
 * every cue answers something the visitor did.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const API = 'https://api.elevenlabs.io/v1';
const RAW = '.audio-raw';
const OUT = 'public/audio';

/** Every interface cue. Durations are what we ask for; mastering trims. */
export const SFX = [
  {
    name: 'hover',
    seconds: 0.5,
    influence: 0.75,
    // "Extremely soft" came back as near-silent noise: ask for a clear
    // transient and let mastering and the engine make it quiet.
    text: 'A single crisp short tick of a small wooden bead dropped once onto a hard wooden table, clean sharp attack, close-miked, dry, very short, one hit only.',
    // One hit only: the bead bounces, and the bounce is a second cue.
    maxMs: 90,
  },
  {
    name: 'click',
    seconds: 0.5,
    influence: 0.75,
    text: 'One soft, tactile, premium click of a well-damped mechanical key, warm and rounded, close-miked, dry, very short, no echo.',
    maxMs: 220,
  },
  {
    name: 'open',
    seconds: 1,
    influence: 0.6,
    text: 'A soft airy upward whoosh, like a thick paper sheet sliding open, with a faint glassy shimmer at the end. Gentle, short, clean, dark and premium.',
    maxMs: 900,
  },
  {
    name: 'close',
    seconds: 0.8,
    influence: 0.6,
    text: 'A soft airy downward whoosh, like a thick paper sheet sliding shut, settling quietly. Gentle, short, clean, no shimmer.',
    maxMs: 700,
  },
  {
    name: 'on',
    seconds: 1.2,
    influence: 0.7,
    text: 'Two warm soft notes rising a fifth, felt piano struck gently with a little analog synth warmth underneath, intimate and quiet, short natural decay.',
    maxMs: 1100,
  },
  {
    name: 'off',
    seconds: 1.2,
    influence: 0.7,
    // Mirrors `on`. The first prompt came back as a weak blip, so the
    // notes are named and the dynamics asked for plainly.
    text: 'A clear gentle two-note descending chime on a warm felt piano, first note A then D below it, medium-soft and clearly tonal, short natural decay, no noise.',
    maxMs: 1100,
  },
  {
    name: 'focus',
    seconds: 0.5,
    influence: 0.75,
    text: 'A very soft, short flick of a stiff paper card being turned over, dry and close, tiny.',
    maxMs: 200,
  },
  {
    name: 'confirm',
    seconds: 0.8,
    influence: 0.7,
    text: 'A soft warm confirmation chime, one rounded glassy note with a gentle bloom, friendly and calm, short decay, no harshness.',
    maxMs: 700,
  },
  {
    // The Lab's decrypt veil opening. A split-flap board is the right
    // object: mechanical, paper, and literally characters resolving.
    name: 'decrypt',
    seconds: 1.4,
    influence: 0.7,
    text: 'A split-flap departure board flipping: a fast soft flutter of many tiny dry paper flaps clicking, quickly slowing down and settling, close-miked, quiet, no voices, no beeps, no music.',
    maxMs: 1400,
  },
  {
    // The veil fully clear: the last flap lands, and a small glass note.
    name: 'resolve',
    seconds: 1.0,
    influence: 0.7,
    text: 'One soft final clack of a paper split-flap landing on its letter, followed by a single delicate high glass tick with a short gentle ring, quiet and clean.',
    maxMs: 1000,
  },
];

/**
 * Chosen takes, by measurement (attack, single onset, spectral centroid
 * for harshness, flatness for tonality). Re-mastered with --master-only.
 */
export const PICKS = { hover: 1, click: 1, open: 2, close: 1, on: 1, off: 3, focus: 2, confirm: 1, decrypt: 2, resolve: 3 };

// ---------------------------------------------------------------------------

function loadKey() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY;
  if (existsSync('.env.local')) {
    const line = readFileSync('.env.local', 'utf8')
      .split('\n')
      .find((l) => l.startsWith('ELEVENLABS_API_KEY='));
    if (line) return line.slice('ELEVENLABS_API_KEY='.length).trim();
  }
  throw new Error('ELEVENLABS_API_KEY missing: add it to .env.local');
}

async function post(path, body, key) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path} ${res.status}: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args]);

/**
 * Master one effect: cut the silence in front so the cue lands on the
 * frame it is triggered, cap the length, fade the tail so nothing clicks,
 * mono, peak at -3 dBFS so every cue starts from the same level and the
 * engine's gain decides loudness.
 */
function masterSfx(src, dst, maxMs) {
  const fade = Math.max(30, Math.round(maxMs * 0.35));
  ff([
    '-i', src,
    '-af',
    [
      'silenceremove=start_periods=1:start_threshold=-50dB',
      `atrim=0:${maxMs / 1000}`,
      `afade=t=out:st=${(maxMs - fade) / 1000}:d=${fade / 1000}`,
      'loudnorm=I=-20:TP=-3:LRA=7',
    ].join(','),
    '-ac', '1', '-ar', '44100', '-b:a', '96k', dst,
  ]);
}

async function main() {
  const args = Object.fromEntries(
    process.argv.slice(2).map((a) => {
      const [k, v] = a.replace(/^--/, '').split('=');
      return [k, v ?? true];
    }),
  );
  if (args['master-only']) {
    for (const cue of SFX) {
      const pick = PICKS[cue.name] ?? 1;
      masterSfx(join(RAW, `${cue.name}-${pick}.mp3`), join(OUT, `${cue.name}.mp3`), cue.maxMs);
      console.log(`master ${cue.name} <- take ${pick}`);
    }
    return;
  }
  const key = loadKey();
  const variants = Number(args.variants ?? 1);
  const only = args.only ? String(args.only).split(',') : null;
  mkdirSync(RAW, { recursive: true });
  mkdirSync(OUT, { recursive: true });

  {
    for (const cue of SFX) {
      if (only && !only.includes(cue.name)) continue;
      for (let v = 1; v <= variants; v++) {
        const raw = join(RAW, `${cue.name}-${v}.mp3`);
        const audio = await post(
          '/sound-generation?output_format=mp3_44100_128',
          { text: cue.text, duration_seconds: cue.seconds, prompt_influence: cue.influence },
          key,
        );
        writeFileSync(raw, audio);
        console.log(`sfx  ${cue.name} take ${v}: ${audio.length} bytes`);
      }
      // The recorded pick, if this cue has one; re-run --master-only after
      // listening and updating PICKS.
      const pick = Math.min(variants, PICKS[cue.name] ?? 1);
      masterSfx(join(RAW, `${cue.name}-${pick}.mp3`), join(OUT, `${cue.name}.mp3`), cue.maxMs);
      console.log(`     -> ${OUT}/${cue.name}.mp3 (take ${pick})`);
    }
  }
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
