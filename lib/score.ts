/**
 * The generative studio score, written in Web Audio.
 *
 * It plays while the composed theme does not exist, and it is a better fit
 * than a loop for a page someone reads for minutes: it never repeats,
 * weighs nothing, and can be quieter than any recording.
 *
 *   pads   four chords in D minor and its relative F major, fourteen
 *          seconds each, slow attack, long overlap, a filtered saw pair
 *          per note breathing on an LFO, a sine sub under the root
 *   bells  sparse FM bells from the current chord, two octaves up, a
 *          returning three note motif (A, F, D), panned, mostly reverb
 *   room   a generated stereo impulse, five seconds, no file
 *   grain  the ElevenLabs tape hiss, looped, under everything
 *
 * Events are scheduled ahead on the audio clock by a one second ticker,
 * so timing never depends on the main thread being free.
 */

export type Score = { stop: () => void };

const mtof = (m: number) => 440 * 2 ** ((m - 69) / 12);

/** Dm9, Bbmaj7, Fmaj9, Gm9: home, lift, open, lean back home. */
const CHORDS = [
  [50, 57, 60, 64, 65],
  [46, 53, 57, 62],
  [41, 48, 52, 55, 57],
  [43, 50, 53, 57, 58],
];
const MOTIF = [81, 77, 74];
const CHORD_S = 14;

function impulse(ctx: AudioContext, seconds: number) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3.2;
  }
  return buf;
}

export function startScore(ctx: AudioContext, out: AudioNode, grain: AudioBuffer | null): Score {
  const bus = ctx.createGain();
  bus.gain.value = 0;
  bus.gain.setTargetAtTime(1, ctx.currentTime, 2.4);
  bus.connect(out);

  const room = ctx.createConvolver();
  room.buffer = impulse(ctx, 5);
  const roomTone = ctx.createBiquadFilter();
  roomTone.type = 'lowpass';
  roomTone.frequency.value = 4200;
  const wet = ctx.createGain();
  wet.gain.value = 0.55;
  room.connect(roomTone).connect(wet).connect(bus);

  const nodes = new Set<AudioScheduledSourceNode>();
  const track = <T extends AudioScheduledSourceNode>(n: T): T => {
    nodes.add(n);
    n.onended = () => nodes.delete(n);
    return n;
  };

  // The breathing: one slow LFO moves every pad filter together.
  const lfo = track(ctx.createOscillator());
  lfo.frequency.value = 0.06;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 260;
  lfo.connect(lfoDepth);
  lfo.start();

  let grainSrc: AudioBufferSourceNode | null = null;
  if (grain) {
    grainSrc = ctx.createBufferSource();
    grainSrc.buffer = grain;
    grainSrc.loop = true;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 400;
    const g = ctx.createGain();
    g.gain.value = 0.32;
    grainSrc.connect(hp).connect(g).connect(bus);
    grainSrc.start();
  }

  function pad(notes: number[], at: number) {
    const end = at + CHORD_S + 7;
    notes.forEach((m, i) => {
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 620 + i * 40;
      filter.Q.value = 0.4;
      lfoDepth.connect(filter.frequency);
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, at);
      env.gain.linearRampToValueAtTime(0.028, at + 5);
      env.gain.setValueAtTime(0.028, at + CHORD_S);
      env.gain.linearRampToValueAtTime(0, end);
      filter.connect(env);
      env.connect(bus);
      env.connect(room);
      for (const cents of [-7, 7]) {
        const o = track(ctx.createOscillator());
        o.type = 'sawtooth';
        o.frequency.value = mtof(m);
        o.detune.value = cents;
        o.connect(filter);
        o.start(at);
        o.stop(end);
      }
    });
    const sub = track(ctx.createOscillator());
    sub.type = 'sine';
    sub.frequency.value = mtof(notes[0] - 12);
    const subEnv = ctx.createGain();
    subEnv.gain.setValueAtTime(0, at);
    subEnv.gain.linearRampToValueAtTime(0.05, at + 4);
    subEnv.gain.setValueAtTime(0.05, at + CHORD_S);
    subEnv.gain.linearRampToValueAtTime(0, end);
    sub.connect(subEnv).connect(bus);
    sub.start(at);
    sub.stop(end);
  }

  /** A glassy FM bell: the modulator's index falls away as it rings. */
  function bell(m: number, at: number, level = 0.1) {
    const f = mtof(m);
    const car = track(ctx.createOscillator());
    const mod = track(ctx.createOscillator());
    car.frequency.value = f;
    mod.frequency.value = f * 3.5;
    const index = ctx.createGain();
    index.gain.setValueAtTime(f * 1.4, at);
    index.gain.exponentialRampToValueAtTime(1, at + 1.4);
    mod.connect(index).connect(car.frequency);
    const amp = ctx.createGain();
    amp.gain.setValueAtTime(0, at);
    amp.gain.linearRampToValueAtTime(level, at + 0.006);
    amp.gain.exponentialRampToValueAtTime(0.0001, at + 3.6);
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1 - 0.5;
    car.connect(amp).connect(pan);
    const dry = ctx.createGain();
    dry.gain.value = 0.35;
    pan.connect(dry).connect(bus);
    pan.connect(room);
    for (const o of [car, mod]) {
      o.start(at);
      o.stop(at + 3.8);
    }
  }

  let chord = 0;
  let nextChord = ctx.currentTime + 0.1;
  let nextBell = ctx.currentTime + 4;

  const tick = () => {
    const horizon = ctx.currentTime + 2;
    while (nextChord < horizon) {
      pad(CHORDS[chord % CHORDS.length], nextChord);
      chord++;
      nextChord += CHORD_S;
    }
    while (nextBell < horizon) {
      const current = CHORDS[(chord - 1 + CHORDS.length) % CHORDS.length];
      if (Math.random() < 0.18) {
        // The motif, the one phrase a returning visitor will recognise.
        MOTIF.forEach((m, i) => bell(m, nextBell + i * 0.48, 0.1));
        nextBell += 7 + Math.random() * 4;
      } else {
        const pick = current[1 + Math.floor(Math.random() * (current.length - 1))] + 24;
        bell(pick, nextBell, 0.07 + Math.random() * 0.04);
        nextBell += 2.4 + Math.random() * 3.6;
      }
    }
  };
  tick();
  const timer = window.setInterval(tick, 1000);

  return {
    stop() {
      window.clearInterval(timer);
      const now = ctx.currentTime;
      bus.gain.cancelScheduledValues(now);
      bus.gain.setTargetAtTime(0, now, 0.4);
      window.setTimeout(() => {
        nodes.forEach((n) => {
          try {
            n.stop();
          } catch {
            /* already stopped */
          }
        });
        grainSrc?.stop();
        bus.disconnect();
      }, 2000);
    },
  };
}
