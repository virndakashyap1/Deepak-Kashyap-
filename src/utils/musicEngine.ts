/**
 * AI MADHUR SANGEET - Web Audio Synthesizer & Indian Rhythm Engine
 * Provides rich procedural backing music, Indian instruments (Tanpura, Sitar, Bansuri,
 * Harmonium, Tabla, Dholak), Western instruments (Acoustic Guitar, Piano, Lo-fi Synth, DJ Beats),
 * and audio mastering / mixing capabilities.
 */

export type MusicStyleKey =
  | 'Romantic Music'
  | 'Sad Music'
  | 'Devotional Music'
  | 'Bhajan Music'
  | 'Bollywood-inspired Music'
  | 'Classical Music'
  | 'Folk Music'
  | 'DJ Music'
  | 'Instrumental Music'
  | 'Lo-fi Music';

export interface StyleConfig {
  name: string;
  hindiName: string;
  bpm: number;
  scale: number[]; // MIDI note offsets from root C3 (48)
  rootFreq: number; // Hz (e.g. C#3 = 138.59, D3 = 146.83)
  rhythmPattern: 'keherwa' | 'dadra' | 'bhajan' | 'bhangra' | 'lofi' | 'dj' | 'classical' | 'ambient';
  color: string;
  gradient: string;
  description: string;
}

export const MUSIC_STYLES: Record<MusicStyleKey, StyleConfig> = {
  'Romantic Music': {
    name: 'Romantic Music',
    hindiName: 'रोमांटिक संगीत',
    bpm: 82,
    scale: [0, 4, 7, 11, 14, 16, 19], // Major 7th / Yaman touch
    rootFreq: 138.59, // C#3
    rhythmPattern: 'keherwa',
    color: '#ec4899',
    gradient: 'from-pink-600 via-rose-500 to-amber-500',
    description: 'बांसुरी, पियानो और गिटार की मखमली धुन',
  },
  'Sad Music': {
    name: 'Sad Music',
    hindiName: 'दर्द भरा / विरह संगीत',
    bpm: 68,
    scale: [0, 3, 7, 8, 10, 14, 15], // Minor (Bhairavi / Asavari mood)
    rootFreq: 130.81, // C3
    rhythmPattern: 'ambient',
    color: '#6366f1',
    gradient: 'from-indigo-700 via-blue-600 to-slate-800',
    description: 'रूह को छू लेने वाली बांसुरी और सितार की मद्धम धुन',
  },
  'Devotional Music': {
    name: 'Devotional Music',
    hindiName: 'भक्ति भाव संगीत',
    bpm: 78,
    scale: [0, 2, 4, 7, 9, 12, 14], // Bilawal / Pentatonic
    rootFreq: 146.83, // D3
    rhythmPattern: 'bhajan',
    color: '#f59e0b',
    gradient: 'from-amber-600 via-orange-500 to-yellow-400',
    description: 'मंदिर की घंटियां, तानपूरा और मंजीरा',
  },
  'Bhajan Music': {
    name: 'Bhajan Music',
    hindiName: 'पारंपरिक भजन धुन',
    bpm: 84,
    scale: [0, 2, 5, 7, 9, 12, 14],
    rootFreq: 146.83,
    rhythmPattern: 'bhajan',
    color: '#d97706',
    gradient: 'from-orange-600 via-amber-500 to-red-500',
    description: 'ढोलक की मधुर थाप और हारमोनियम के सुर',
  },
  'Bollywood-inspired Music': {
    name: 'Bollywood-inspired Music',
    hindiName: 'बॉलीवुड तड़का',
    bpm: 96,
    scale: [0, 2, 4, 5, 7, 9, 11, 12],
    rootFreq: 138.59,
    rhythmPattern: 'keherwa',
    color: '#8b5cf6',
    gradient: 'from-purple-600 via-violet-500 to-pink-500',
    description: 'आधुनिक स्ट्रिंग्स, ढोलक और ग्रूवी रिदम',
  },
  'Classical Music': {
    name: 'Classical Music',
    hindiName: 'शास्त्रीय राग संगीत',
    bpm: 74,
    scale: [0, 2, 4, 6, 7, 9, 11, 12], // Raag Yaman
    rootFreq: 138.59,
    rhythmPattern: 'classical',
    color: '#eab308',
    gradient: 'from-yellow-600 via-amber-600 to-stone-800',
    description: 'गूंजता तानपूरा, सितार की मींड और तीनताल',
  },
  'Folk Music': {
    name: 'Folk Music',
    hindiName: 'देसी लोकगीत / भांगड़ा',
    bpm: 104,
    scale: [0, 2, 4, 7, 9, 12, 14],
    rootFreq: 146.83,
    rhythmPattern: 'bhangra',
    color: '#10b981',
    gradient: 'from-emerald-600 via-teal-500 to-amber-400',
    description: 'ढोल की तेज थाप, चिमटा और लोकधुनों का उत्सव',
  },
  'DJ Music': {
    name: 'DJ Music',
    hindiName: 'डीजे पार्टी बीट्स',
    bpm: 126,
    scale: [0, 3, 5, 7, 10, 12, 15],
    rootFreq: 130.81,
    rhythmPattern: 'dj',
    color: '#06b6d4',
    gradient: 'from-cyan-500 via-blue-600 to-purple-600',
    description: 'दमदार 4x4 किक, बेस ड्रॉप और इलेक्ट्रॉनिक सिंथ',
  },
  'Instrumental Music': {
    name: 'Instrumental Music',
    hindiName: 'मधुर वाद्य संगीत',
    bpm: 80,
    scale: [0, 4, 7, 9, 11, 14, 16],
    rootFreq: 138.59,
    rhythmPattern: 'keherwa',
    color: '#3b82f6',
    gradient: 'from-blue-600 via-indigo-500 to-teal-400',
    description: 'सितार और बांसुरी की जुगलबंदी',
  },
  'Lo-fi Music': {
    name: 'Lo-fi Music',
    hindiName: 'लो-फाई चिल',
    bpm: 72,
    scale: [0, 3, 7, 10, 14, 17, 21], // Lush Minor 9th
    rootFreq: 130.81,
    rhythmPattern: 'lofi',
    color: '#a855f7',
    gradient: 'from-purple-700 via-pink-600 to-indigo-900',
    description: 'सॉफ्ट विनाइल क्रैकल, विंटेज पियानो और चिल बीट',
  },
};

export class MusicEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private vocalGain: GainNode | null = null;

  // Active nodes for real-time synthesis
  private isPlaying = false;
  private currentStyle: MusicStyleKey = 'Romantic Music';
  private rhythmTimer: number | null = null;
  private step = 0;
  private currentVocalAudio: HTMLAudioElement | null = null;

  // Volumes
  private masterVol = 0.85;
  private musicVol = 0.75;
  private vocalVol = 0.95;

  constructor() {
    // Initialized on first user gesture to comply with browser autoplay
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVol, this.ctx.currentTime);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicVol, this.ctx.currentTime);

      this.vocalGain = this.ctx.createGain();
      this.vocalGain.gain.setValueAtTime(this.vocalVol, this.ctx.currentTime);

      this.musicGain.connect(this.masterGain);
      this.vocalGain.connect(this.masterGain);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    this.initContext();
    return this.analyser;
  }

  public setVolumes(master: number, music: number, vocal: number) {
    this.masterVol = master;
    this.musicVol = music;
    this.vocalVol = vocal;

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(master, this.ctx.currentTime);
    }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(music, this.ctx.currentTime);
    }
    if (this.vocalGain && this.ctx) {
      this.vocalGain.gain.setValueAtTime(vocal, this.ctx.currentTime);
    }
    if (this.currentVocalAudio) {
      this.currentVocalAudio.volume = vocal;
    }
  }

  // --- Procedural Instrument Synthesizers ---

  // 1. Tanpura Drone (Indian Classical Resonance)
  private playTanpura(baseFreq: number, time: number, duration: number) {
    if (!this.ctx || !this.musicGain) return;

    // Sa, Pa, Sa', Sa
    const intervals = [1, 1.5, 2, 1];
    intervals.forEach((ratio, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(baseFreq * ratio, time + idx * 0.4);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, time);
      filter.Q.setValueAtTime(3, time);

      gain.gain.setValueAtTime(0, time + idx * 0.4);
      gain.gain.linearRampToValueAtTime(0.08, time + idx * 0.4 + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, time + idx * 0.4 + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain!);

      osc.start(time + idx * 0.4);
      osc.stop(time + idx * 0.4 + duration);
    });
  }

  // 2. Bansuri (Indian Bamboo Flute)
  private playFlute(freq: number, time: number, duration = 0.8) {
    if (!this.ctx || !this.musicGain) return;

    const osc = this.ctx.createOscillator();
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Soft sine + gentle odd harmonics
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    // Flute breath vibrato (5.5 Hz)
    vibrato.frequency.setValueAtTime(5.5, time);
    vibratoGain.gain.setValueAtTime(freq * 0.015, time);
    vibrato.connect(osc.frequency);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 1.5, time);
    filter.Q.setValueAtTime(2.5, time);

    // Soft breathy attack and long soulful release
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.14, time + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    vibrato.start(time);
    osc.stop(time + duration);
    vibrato.stop(time + duration);
  }

  // 3. Sitar Pluck with Meend glide
  private playSitar(freq: number, time: number, duration = 1.2) {
    if (!this.ctx || !this.musicGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    // Sitar Meend (slight initial pitch micro-bend)
    osc.frequency.setValueAtTime(freq * 0.98, time);
    osc.frequency.exponentialRampToValueAtTime(freq, time + 0.08);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(280, time);

    // Pluck envelope: sharp metallic pluck attack, ringing resonance
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.18, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  // 4. Harmonium / Acoustic Piano Cord Swell
  private playChord(chordFreqs: number[], time: number, duration = 1.6) {
    if (!this.ctx || !this.musicGain) return;

    chordFreqs.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, time);
      filter.frequency.exponentialRampToValueAtTime(1400, time + 0.3);
      filter.frequency.exponentialRampToValueAtTime(500, time + duration);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.05, time + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain!);

      osc.start(time);
      osc.stop(time + duration);
    });
  }

  // 5. Tabla / Dholak Percussion Hits
  // 'Dha' = Bass 'Ge' + Dayan ring
  private playTabla(type: 'dha' | 'ge' | 'na' | 'tin' | 'kick' | 'snare' | 'bell', time: number) {
    if (!this.ctx || !this.musicGain) return;

    if (type === 'dha' || type === 'ge' || type === 'kick') {
      // Bayan / Bass Drum Pitch Drop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(type === 'kick' ? 140 : 110, time);
      osc.frequency.exponentialRampToValueAtTime(type === 'kick' ? 45 : 65, time + 0.18);

      gain.gain.setValueAtTime(0.35, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + (type === 'kick' ? 0.35 : 0.45));

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(time);
      osc.stop(time + 0.5);
    }

    if (type === 'dha' || type === 'na' || type === 'tin') {
      // Dayan / Treble Ring
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(type === 'tin' ? 440 : 380, time);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(type === 'tin' ? 880 : 760, time);
      filter.Q.setValueAtTime(5, time);

      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(time);
      osc.stop(time + 0.25);
    }

    if (type === 'bell') {
      // Devotional Temple Ghanti / Chime
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, time); // A6 bell

      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(time);
      osc.stop(time + 0.85);
    }

    if (type === 'snare') {
      // White noise snare / clap
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1000, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      noise.start(time);
      noise.stop(time + 0.15);
    }
  }

  // --- Step Sequencer Loop ---
  private tick() {
    if (!this.isPlaying || !this.ctx) return;

    const style = MUSIC_STYLES[this.currentStyle];
    const bpm = style.bpm;
    const stepDuration = 60 / bpm / 2; // 8th note steps
    const now = this.ctx.currentTime;
    const currentStep = this.step % 16;

    // 1. Tanpura drone trigger every 16 steps
    if (currentStep === 0) {
      this.playTanpura(style.rootFreq, now, stepDuration * 16);
    }

    // 2. Rhythm Sequencer according to pattern
    const pattern = style.rhythmPattern;
    if (pattern === 'keherwa') {
      // 8-beat keherwa: Dha Ge Na Tin | Na Ke Dhin Na
      if (currentStep % 8 === 0) this.playTabla('dha', now);
      if (currentStep % 8 === 1) this.playTabla('ge', now);
      if (currentStep % 8 === 2) this.playTabla('na', now);
      if (currentStep % 8 === 3) this.playTabla('tin', now);
      if (currentStep % 8 === 4) this.playTabla('na', now);
      if (currentStep % 8 === 6) this.playTabla('dha', now);
    } else if (pattern === 'bhajan') {
      // Bhajan theka + temple bell
      if (currentStep % 4 === 0) this.playTabla('dha', now);
      if (currentStep % 4 === 2) this.playTabla('na', now);
      if (currentStep % 8 === 0) this.playTabla('bell', now);
    } else if (pattern === 'bhangra') {
      // Bhangra / Garba fast dhol
      if (currentStep % 4 === 0) this.playTabla('kick', now);
      if (currentStep % 4 === 1) this.playTabla('na', now);
      if (currentStep % 4 === 2) this.playTabla('dha', now);
      if (currentStep % 4 === 3) this.playTabla('tin', now);
    } else if (pattern === 'dj') {
      // 4-on-the-floor EDM
      if (currentStep % 4 === 0) this.playTabla('kick', now);
      if (currentStep % 4 === 2) this.playTabla('snare', now);
      if (currentStep % 2 === 1) this.playTabla('tin', now); // hihat
    } else if (pattern === 'lofi') {
      // Lo-fi Boom Bap
      if (currentStep === 0 || currentStep === 6 || currentStep === 10) this.playTabla('kick', now);
      if (currentStep === 4 || currentStep === 12) this.playTabla('snare', now);
      if (currentStep % 2 === 0) this.playTabla('tin', now);
    } else {
      // Ambient / Classical
      if (currentStep === 0 || currentStep === 8) this.playTabla('dha', now);
      if (currentStep === 4 || currentStep === 12) this.playTabla('tin', now);
    }

    // 3. Melodic accompaniment (Sitar or Flute motif)
    if (currentStep % 4 === 0) {
      const scaleOffsets = style.scale;
      const noteOffset = scaleOffsets[(currentStep / 2) % scaleOffsets.length];
      const noteFreq = style.rootFreq * Math.pow(2, (noteOffset + 12) / 12);

      if (this.currentStyle === 'Classical Music' || this.currentStyle === 'Romantic Music') {
        this.playSitar(noteFreq, now, stepDuration * 2);
      } else if (this.currentStyle === 'Devotional Music' || this.currentStyle === 'Sad Music') {
        this.playFlute(noteFreq * 2, now, stepDuration * 2.5);
      } else {
        // Chord pad
        const c1 = style.rootFreq * Math.pow(2, 12 / 12);
        const c2 = style.rootFreq * Math.pow(2, (noteOffset + 12) / 12);
        const c3 = style.rootFreq * Math.pow(2, (scaleOffsets[2] + 12) / 12);
        this.playChord([c1, c2, c3], now, stepDuration * 3.5);
      }
    }

    this.step++;
    this.rhythmTimer = window.setTimeout(() => this.tick(), stepDuration * 1000);
  }

  // --- Public Playback Controls ---

  public startMusic(styleKey: MusicStyleKey = 'Romantic Music') {
    this.initContext();
    this.currentStyle = styleKey;
    this.stopMusic();
    this.isPlaying = true;
    this.step = 0;
    this.tick();
  }

  public stopMusic() {
    this.isPlaying = false;
    if (this.rhythmTimer) {
      clearTimeout(this.rhythmTimer);
      this.rhythmTimer = null;
    }
  }

  public isMusicPlaying(): boolean {
    return this.isPlaying;
  }

  // Play Vocal WAV base64
  public playVocals(base64Wav: string, onEnded?: () => void): HTMLAudioElement {
    this.initContext();
    if (this.currentVocalAudio) {
      this.currentVocalAudio.pause();
      this.currentVocalAudio.src = '';
    }

    const audio = new Audio(`data:audio/wav;base64,${base64Wav}`);
    audio.volume = this.vocalVol;
    this.currentVocalAudio = audio;

    // Connect audio element into our Web Audio graph if possible for visualizer
    try {
      const source = this.ctx!.createMediaElementSource(audio);
      source.connect(this.vocalGain!);
    } catch {
      // Audio already connected in some browser implementations
    }

    audio.onended = () => {
      if (onEnded) onEnded();
    };

    audio.play().catch((err) => console.warn('Vocal playback error:', err));
    return audio;
  }

  public pauseVocals() {
    if (this.currentVocalAudio) {
      this.currentVocalAudio.pause();
    }
  }

  public resumeVocals() {
    if (this.currentVocalAudio) {
      this.currentVocalAudio.play();
    }
  }

  public stopAll() {
    this.stopMusic();
    if (this.currentVocalAudio) {
      this.currentVocalAudio.pause();
      this.currentVocalAudio.currentTime = 0;
    }
  }

  // --- Render Master Audio to WAV Blob for 1-Click Download ---
  public async exportMasterSongBlob(
    vocalBase64Wav: string | null,
    styleKey: MusicStyleKey,
    durationSec = 30
  ): Promise<Blob> {
    const sampleRate = 44100;
    const OfflineCtx = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
    const offlineCtx = new OfflineAudioContext(2, sampleRate * durationSec, sampleRate);

    const style = MUSIC_STYLES[styleKey];
    const bpm = style.bpm;
    const stepDuration = 60 / bpm / 2;
    const totalSteps = Math.floor(durationSec / stepDuration);

    // 1. Synthesize background music tracks offline
    const bgGain = offlineCtx.createGain();
    bgGain.gain.setValueAtTime(this.musicVol, 0);
    bgGain.connect(offlineCtx.destination);

    for (let s = 0; s < totalSteps; s++) {
      const time = s * stepDuration;
      const currentStep = s % 16;

      // Tanpura
      if (currentStep === 0) {
        const osc = offlineCtx.createOscillator();
        const gain = offlineCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(style.rootFreq, time);
        gain.gain.setValueAtTime(0.06, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 16);
        osc.connect(gain);
        gain.connect(bgGain);
        osc.start(time);
        osc.stop(time + stepDuration * 16);
      }

      // Rhythm
      if (currentStep % 4 === 0) {
        // Kick/Bass
        const osc = offlineCtx.createOscillator();
        const gain = offlineCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, time);
        osc.frequency.exponentialRampToValueAtTime(50, time + 0.15);
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
        osc.connect(gain);
        gain.connect(bgGain);
        osc.start(time);
        osc.stop(time + 0.35);
      }
      if (currentStep % 4 === 2) {
        // Ring
        const osc = offlineCtx.createOscillator();
        const gain = offlineCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(380, time);
        gain.gain.setValueAtTime(0.18, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
        osc.connect(gain);
        gain.connect(bgGain);
        osc.start(time);
        osc.stop(time + 0.25);
      }

      // Melody
      if (currentStep % 4 === 0) {
        const noteOffset = style.scale[(currentStep / 2) % style.scale.length];
        const noteFreq = style.rootFreq * Math.pow(2, (noteOffset + 12) / 12);
        const osc = offlineCtx.createOscillator();
        const gain = offlineCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(noteFreq, time);
        gain.gain.setValueAtTime(0.12, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 2);
        osc.connect(gain);
        gain.connect(bgGain);
        osc.start(time);
        osc.stop(time + stepDuration * 2);
      }
    }

    // 2. Decode and overlay Vocal track if present
    if (vocalBase64Wav) {
      try {
        const binaryString = window.atob(vocalBase64Wav);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const vocalAudioBuffer = await offlineCtx.decodeAudioData(bytes.buffer.slice(0));
        const vocalSource = offlineCtx.createBufferSource();
        vocalSource.buffer = vocalAudioBuffer;

        const vocalGain = offlineCtx.createGain();
        vocalGain.gain.setValueAtTime(this.vocalVol, 0);

        vocalSource.connect(vocalGain);
        vocalGain.connect(offlineCtx.destination);
        vocalSource.start(0);
      } catch (err) {
        console.warn('Could not decode vocal buffer for master export:', err);
      }
    }

    // Render buffer
    const renderedBuffer = await offlineCtx.startRendering();
    return this.audioBufferToWavBlob(renderedBuffer);
  }

  // Standard RIFF WAV encoder
  private audioBufferToWavBlob(buffer: AudioBuffer): Blob {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const length = buffer.length * numChannels * 2 + 44;
    const out = new DataView(new ArrayBuffer(length));

    // Write WAV header
    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        out.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    out.setUint32(4, length - 8, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    out.setUint32(16, 16, true); // PCM Chunk size
    out.setUint16(20, 1, true); // Linear PCM format
    out.setUint16(22, numChannels, true);
    out.setUint32(24, sampleRate, true);
    out.setUint32(28, sampleRate * numChannels * 2, true); // Byte rate
    out.setUint16(32, numChannels * 2, true); // Block align
    out.setUint16(34, 16, true); // Bits per sample
    writeString(36, 'data');
    out.setUint32(40, length - 44, true);

    // Interleave channels
    let offset = 44;
    const channels: Float32Array[] = [];
    for (let i = 0; i < numChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    for (let i = 0; i < buffer.length; i++) {
      for (let ch = 0; ch < numChannels; ch++) {
        let sample = Math.max(-1, Math.min(1, channels[ch][i]));
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        out.setInt16(offset, sample, true);
        offset += 2;
      }
    }

    return new Blob([out.buffer], { type: 'audio/wav' });
  }
}

// Global Singleton for easy app-wide playback control
export const musicEngine = new MusicEngine();
