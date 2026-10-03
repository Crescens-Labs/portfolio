/**
 * The site's sound, one engine for every cue and the music.
 *
 *   master  <- volume from the dock, ramped, never stepped
 *     sfx   <- interface cues, decoded once, played as one-shot buffers
 *     music <- the composed theme if public/audio/theme.mp3 exists,
 *              otherwise the generative score (lib/score.ts)
 *   analyser on the master, so the dock's mark can listen to it
 *
 * Rules, because a page that makes noise uninvited is a page people
 * leave:
 *   - nothing plays until the visitor turns sound on;
 *   - the AudioContext is created on that gesture, never before;
 *   - a visitor who turned it on last time is re-armed on their first
 *     click or key press this time, never on load or on scroll.
 */

import { startScore, type Score } from './score';

export type Cue = 'hover' | 'click' | 'open' | 'close' | 'on' | 'off' | 'focus' | 'confirm';

/** Per cue: level against the master, the shortest gap between two
    plays, and how far each play may drift in pitch (cents). */
const CUES: Record<Cue, { gain: number; gapMs: number; detune: number }> = {
  hover: { gain: 0.16, gapMs: 70, detune: 60 },
  click: { gain: 0.3, gapMs: 50, detune: 40 },
  open: { gain: 0.28, gapMs: 200, detune: 0 },
  close: { gain: 0.24, gapMs: 200, detune: 0 },
  on: { gain: 0.34, gapMs: 300, detune: 0 },
  off: { gain: 0.3, gapMs: 300, detune: 0 },
  focus: { gain: 0.12, gapMs: 140, detune: 80 },
  confirm: { gain: 0.3, gapMs: 300, detune: 0 },
};

const KEY_ON = 'crescens-sound';
const KEY_VOL = 'crescens-vol';

type State = { enabled: boolean; volume: number; music: 'theme' | 'score' | null };
type Listener = (s: State) => void;

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode: state lives for the session */
  }
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private sfx!: GainNode;
  private musicBus!: GainNode;
  analyser: AnalyserNode | null = null;
  private buffers = new Map<Cue, AudioBuffer>();
  private last = new Map<Cue, number>();
  private theme: AudioBufferSourceNode | null = null;
  private score: Score | null = null;
  private listeners = new Set<Listener>();
  state: State = { enabled: false, volume: 0.7, music: null };

  constructor() {
    if (typeof window === 'undefined') return;
    const v = parseFloat(read(KEY_VOL) ?? '');
    if (Number.isFinite(v)) this.state.volume = Math.min(1, Math.max(0, v));
    // A hidden tab goes quiet and costs nothing; it comes back as it was.
    document.addEventListener('visibilitychange', () => {
      if (!this.ctx || !this.state.enabled) return;
      void (document.hidden ? this.ctx.suspend() : this.ctx.resume());
    });
    // Re-arm a returning visitor's choice on their first real gesture.
    if (read(KEY_ON) === '1') {
      const arm = () => {
        window.removeEventListener('pointerdown', arm);
        window.removeEventListener('keydown', arm);
        void this.enable();
      };
      window.addEventListener('pointerdown', arm, { once: true });
      window.addEventListener('keydown', arm, { once: true });
    }
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    fn(this.state);
    return () => this.listeners.delete(fn);
  }
  private set(patch: Partial<State>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((fn) => fn(this.state));
  }

  private graph() {
    if (this.ctx) return this.ctx;
    const ctx = new AudioContext({ latencyHint: 'interactive' });
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.sfx = ctx.createGain();
    this.musicBus = ctx.createGain();
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.82;
    this.sfx.connect(this.master);
    this.musicBus.connect(this.master);
    this.master.connect(this.analyser);
    this.analyser.connect(ctx.destination);
    this.ctx = ctx;
    return ctx;
  }

  private async load(url: string): Promise<AudioBuffer | null> {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      return await this.graph().decodeAudioData(await res.arrayBuffer());
    } catch {
      return null;
    }
  }

  private async loadCues() {
    if (this.buffers.size) return;
    await Promise.all(
      (Object.keys(CUES) as Cue[]).map(async (cue) => {
        const buf = await this.load(`/audio/${cue}.mp3`);
        if (buf) this.buffers.set(cue, buf);
      }),
    );
  }

  /** Composed theme first, generative score when there is none. */
  private async startMusic() {
    const ctx = this.graph();
    const theme = await this.load('/audio/theme.mp3');
    if (!this.state.enabled) return;
    if (theme) {
      const src = ctx.createBufferSource();
      src.buffer = theme;
      src.loop = true;
      src.connect(this.musicBus);
      src.start();
      this.theme = src;
      this.set({ music: 'theme' });
      return;
    }
    const grain = await this.load('/audio/grain.mp3');
    if (!this.state.enabled) return;
    this.score = startScore(ctx, this.musicBus, grain);
    this.set({ music: 'score' });
  }

  private stopMusic() {
    this.theme?.stop();
    this.theme = null;
    this.score?.stop();
    this.score = null;
    this.set({ music: null });
  }

  /** Must be called from a user gesture: it creates or resumes the context. */
  async enable() {
    if (this.state.enabled) return;
    const ctx = this.graph();
    await ctx.resume();
    this.set({ enabled: true });
    write(KEY_ON, '1');
    const now = ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(this.state.volume, now, 0.6);
    await this.loadCues();
    this.play('on', true);
    void this.startMusic();
  }

  async disable() {
    if (!this.state.enabled || !this.ctx) return;
    this.play('off', true);
    this.set({ enabled: false });
    write(KEY_ON, '0');
    const now = this.ctx.currentTime;
    this.master.gain.setTargetAtTime(0, now + 0.25, 0.35);
    window.setTimeout(() => {
      if (this.state.enabled) return;
      this.stopMusic();
      void this.ctx?.suspend();
    }, 1800);
  }

  toggle() {
    return this.state.enabled ? this.disable() : this.enable();
  }

  setVolume(v: number) {
    const volume = Math.min(1, Math.max(0, v));
    this.set({ volume });
    write(KEY_VOL, String(volume));
    if (this.ctx && this.state.enabled) this.master.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.08);
  }

  /** One cue. Silent unless sound is on; throttled per cue; each play
      drifts a few cents so repeated hovers do not sound like a machine. */
  play(cue: Cue, force = false) {
    if (!this.ctx || (!this.state.enabled && !force)) return;
    const buf = this.buffers.get(cue);
    if (!buf) return;
    const spec = CUES[cue];
    const t = performance.now();
    if (t - (this.last.get(cue) ?? 0) < spec.gapMs) return;
    this.last.set(cue, t);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.detune.value = (Math.random() * 2 - 1) * spec.detune;
    const g = this.ctx.createGain();
    g.gain.value = spec.gain;
    src.connect(g).connect(this.sfx);
    src.start();
  }
}

let engine: SoundEngine | null = null;

/** The one engine, created on first use in the browser, null on the server. */
export function getSound(): SoundEngine | null {
  if (typeof window === 'undefined') return null;
  engine ??= new SoundEngine();
  return engine;
}
