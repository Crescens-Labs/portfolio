/**
 * Generates the site's sound from ElevenLabs, then masters it for the web.
 *
 *   node scripts/generate-audio.mjs                 every effect + the theme
 *   node scripts/generate-audio.mjs --only=hover    one cue, by name
 *   node scripts/generate-audio.mjs --sfx           effects only
 *   node scripts/generate-audio.mjs --music         theme only
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
];

/**
 * Chosen takes, by measurement (attack, single onset, spectral centroid
 * for harshness, flatness for tonality). Re-mastered with --master-only.
 */
export const PICKS = { hover: 1, click: 1, open: 2, close: 1, on: 1, off: 3, focus: 2, confirm: 1 };

/** The studio theme. Instrumental, built to loop under a reading visitor. */
export const THEME = {
  name: 'theme',
  ms: 120000,
  prompt: [
    'Minimal nocturnal ambient electronica for the website of a small software studio, instrumental only.',
    'Deep warm analog synth pads moving slowly through D minor and F major, a soft felt piano playing a sparse three-note motif that returns,',
    'a gentle low sub pulse, quiet tape hiss and vinyl crackle like film grain, a faint brushed hi-hat appearing in the middle section and leaving again.',
    'About 76 BPM, calm, focused, precise, premium, the feeling of working late in a dark green forest studio.',
    'No vocals, no drops, no big builds, no bright leads. Even dynamics from start to end so it can loop and sit under reading.',
  ].join(' '),
};

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

/**
 * Master the theme into a seamless loop: the last 4s are crossfaded onto
 * the first 4s, so the loop point has no seam, then the whole track is
 * normalised to a quiet -23 LUFS bed.
 */
function masterTheme(src, dst) {
  const dur = parseFloat(
    execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src]).toString(),
  );
  const x = 4;
  ff([
    '-i', src,
    '-filter_complex',
    [
      `[0]atrim=0:${x},asetpts=PTS-STARTPTS[head]`,
      `[0]atrim=${x}:${dur - x},asetpts=PTS-STARTPTS[body]`,
      `[0]atrim=${dur - x}:${dur},asetpts=PTS-STARTPTS[tail]`,
      `[tail][head]acrossfade=d=${x}:c1=tri:c2=tri[seam]`,
      `[seam][body]concat=n=2:v=0:a=1,loudnorm=I=-23:TP=-2:LRA=9[out]`,
    ].join(';'),
    '-map', '[out]', '-ar', '44100', '-b:a', '128k', dst,
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
    if (existsSync(join(RAW, 'theme-raw.mp3'))) masterTheme(join(RAW, 'theme-raw.mp3'), join(OUT, 'theme.mp3'));
    return;
  }
  const key = loadKey();
  const variants = Number(args.variants ?? 1);
  const only = args.only ? String(args.only).split(',') : null;
  const doSfx = !args.music || args.sfx;
  const doMusic = !args.sfx || args.music;
  mkdirSync(RAW, { recursive: true });
  mkdirSync(OUT, { recursive: true });

  if (doSfx) {
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

  if (doMusic && (!only || only.includes('theme'))) {
    const raw = join(RAW, 'theme-raw.mp3');
    let audio;
    try {
      audio = await post(
        '/music?output_format=mp3_44100_128',
        { prompt: THEME.prompt, music_length_ms: THEME.ms, model_id: 'music_v1', force_instrumental: true },
        key,
      );
    } catch (e) {
      // Older accounts reject the instrumental flag; the prompt already
      // says no vocals, so retry without it rather than fail the run.
      if (!String(e).includes('force_instrumental')) throw e;
      audio = await post('/music?output_format=mp3_44100_128', { prompt: THEME.prompt, music_length_ms: THEME.ms }, key);
    }
    writeFileSync(raw, audio);
    console.log(`music theme: ${audio.length} bytes`);
    masterTheme(raw, join(OUT, 'theme.mp3'));
    console.log(`     -> ${OUT}/theme.mp3 (seamless loop)`);
  }
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
