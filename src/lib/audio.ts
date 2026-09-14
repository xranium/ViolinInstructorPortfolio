/* ————— کتابخانهٔ صدای مشترک (Web Audio) —————
   سنتزِ صدای آرشه‌مانندِ ویولن + پخشِ موتیف + صدای محیطِ ملایم.
   فقط سمت کلاینت استفاده شود.
*/

export type Voice = { stop: (t?: number) => void };

let ctx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/* ————— نقشهٔ فرکانس نُت‌ها ————— */
const NOTE_MAP: Record<string, number> = {
  G2: 98.0,
  A2: 110.0,
  B2: 123.47,
  C3: 130.81,
  D3: 146.83,
  Eb3: 155.56,
  E3: 164.81,
  F3: 174.61,
  Fp3: 185.0, // F♯
  G3: 196.0,
  Ab3: 207.65,
  A3: 220.0,
  Bb3: 233.08,
  B3: 246.94,
  C4: 261.63,
  Db4: 277.18,
  D4: 293.66,
  Eb4: 311.13,
  E4: 329.63,
  F4: 349.23,
  Fp4: 369.99, // F♯
  G4: 392.0,
  Ab4: 415.3,
  A4: 440.0,
  Bb4: 466.16,
  B4: 493.88,
  C5: 523.25,
  Db5: 554.37,
  D5: 587.33,
  Eb5: 622.25,
  E5: 659.25,
  F5: 698.46,
  Fp5: 739.99, // F♯
  G5: 783.99,
  A5: 880.0,
  Bb5: 932.33,
};

export function noteFreq(note: string): number {
  return NOTE_MAP[note] ?? 440;
}

/* ————— صدای تک‌نُتِ آرشه‌مانند ————— */

export type BowedOptions = {
  /** زمان شروع مطلق (AudioContext.currentTime) — پیش‌فرض: اکنون */
  when?: number;
  /** مدت‌زمان به ثانیه */
  dur?: number;
  /** بلندی صدا (۰ تا ۱) — پیش‌فرض ۰٫۱۱ */
  gain?: number;
  /** عمق ویبراتو (سنت) — پیش‌فرض ۴٫۵ */
  vibrato?: number;
};

export function playBowed(freq: number, opts: BowedOptions = {}): Voice {
  const ac = getAudioContext();
  if (!ac) return { stop: () => {} };
  const { when, dur = 1.4, gain = 0.11, vibrato = 4.5 } = opts;
  const t = Math.max(when ?? ac.currentTime, ac.currentTime);

  const master = ac.createGain();
  master.gain.setValueAtTime(0.0001, t);
  master.gain.exponentialRampToValueAtTime(gain, t + 0.08); // کششِ آرشه
  master.gain.setValueAtTime(gain, t + Math.max(0.2, dur - 0.4));
  master.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  master.connect(ac.destination);

  // گرمای چوب — فیلتر میان‌گذر
  const lp = ac.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = Math.min(freq * 5.5, 3600);
  lp.Q.value = 2.2;
  lp.connect(master);

  // دو اره‌ایِ کوک‌نزدیک — بدنهٔ صدای آرشه
  const o1 = ac.createOscillator();
  o1.type = "sawtooth";
  o1.frequency.value = freq;
  const o2 = ac.createOscillator();
  o2.type = "sawtooth";
  o2.frequency.value = freq;
  o2.detune.value = 6;
  const g1 = ac.createGain();
  g1.gain.value = 0.5;
  const g2 = ac.createGain();
  g2.gain.value = 0.33;
  o1.connect(g1).connect(lp);
  o2.connect(g2).connect(lp);

  // هارمونیکِ اکتاو — درخشش
  const o3 = ac.createOscillator();
  o3.type = "triangle";
  o3.frequency.value = freq * 2;
  const g3 = ac.createGain();
  g3.gain.value = 0.07;
  o3.connect(g3).connect(lp);

  // ویبراتوی ظریف — دستِ انسانی
  const lfo = ac.createOscillator();
  lfo.frequency.value = 5.1;
  const lfoGain = ac.createGain();
  lfoGain.gain.value = vibrato;
  lfo.connect(lfoGain);
  lfoGain.connect(o1.detune);
  lfoGain.connect(o2.detune);

  const oscs = [o1, o2, o3, lfo];
  oscs.forEach((o) => o.start(t));

  const stop = (when2?: number) => {
    const w = when2 ?? ac.currentTime;
    try {
      master.gain.cancelScheduledValues(w);
      master.gain.setTargetAtTime(0.0001, w, 0.06);
      oscs.forEach((o) => o.stop(w + 0.3));
    } catch {
      /* صدا پیش‌تر متوقف شده است */
    }
  };
  const auto = window.setTimeout(() => stop(t + dur), Math.max(0, (t - ac.currentTime + dur) * 1000));

  return {
    stop: (w) => {
      window.clearTimeout(auto);
      stop(w);
    },
  };
}

/* ————— صدای محیطِ ملایم (لوپ پس‌زمینه) ————— */

type AmbientHandle = { stop: () => void };

const AMBIENT_CYCLE = 13; // ثانیه
const AMBIENT_MELODY = ["D4", "Fp4", "A4", "C5", "Bb4", "A4", "Fp4", "D4"];

let ambientVoices: Voice[] = [];

/**
 * پس‌زمینهٔ آرام با گامِ ایرانی‌مایه:
 * بوردونِ عمیق (D3) + نُت‌های ارامِ پیوسته از گامِ سل→ر.
 */
export function startAmbient(): AmbientHandle {
  const ac = getAudioContext();
  if (!ac) return { stop: () => {} };

  const stopped = { value: false };
  let cycle = 0;

  const scheduleCycle = (startAt: number) => {
    // بوردونِ عمیق — دو نتِ بلند و نرم
    ambientVoices.push(playBowed(noteFreq("D3"), { when: startAt, dur: 6.5, gain: 0.032, vibrato: 2 }));
    ambientVoices.push(
      playBowed(noteFreq("A3"), { when: startAt + 6.5, dur: 6.5, gain: 0.028, vibrato: 2 }),
    );
    // دو نُتِ ملودیک در هر چرخه — آرام و کم‌صدا
    const m1 = AMBIENT_MELODY[cycle % AMBIENT_MELODY.length];
    const m2 = AMBIENT_MELODY[(cycle * 3 + 1) % AMBIENT_MELODY.length];
    ambientVoices.push(playBowed(noteFreq(m1), { when: startAt + 2.2, dur: 2.8, gain: 0.045 }));
    ambientVoices.push(playBowed(noteFreq(m2), { when: startAt + 8.4, dur: 2.4, gain: 0.04 }));
    cycle++;
  };

  // چرخهٔ نخست + زمان‌بندِ چرخه‌های بعدی
  scheduleCycle(ac.currentTime + 0.1);
  const scheduler = window.setInterval(() => {
    if (stopped.value) return;
    const ac2 = getAudioContext();
    if (!ac2) return;
    scheduleCycle(ac2.currentTime + 0.05);
  }, AMBIENT_CYCLE * 1000);

  // پاک‌سازیِ دوره‌ایِ صداهای پایان‌یافته
  const janitor = window.setInterval(() => {
    ambientVoices = ambientVoices.slice(-16);
  }, 30000);

  return {
    stop: () => {
      stopped.value = true;
      window.clearInterval(scheduler);
      window.clearInterval(janitor);
      ambientVoices.forEach((v) => v.stop());
      ambientVoices = [];
    },
  };
}
