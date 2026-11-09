/**
 * Ultimate Web Audio Synthesizer for Authentic Indian Diwali Crackers
 * Provides real-time procedural audio for:
 * - Rocket (Launch whistle + air burst)
 * - Anaar (Roaring fountain sizzle)
 * - Chakri (High-speed spinning whir)
 * - Ladi (Rapid 30-burst chain reaction)
 * - Phuljhadi (Hand sparkler sizzling)
 * - Sutli Bomb (Sizzling fuse + Massive ear-shaking sub-bass blast)
 * - Saanp Ki Goli (Snake tablet smoldering hiss)
 * - Bijli Crackers (Sharp pop-pop snaps)
 * - Magic Pencil / Hunter (Rapid aerial tracer shots)
 * - Sky Kandil (Gentle warm atmospheric tone)
 */

class DiwaliAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterGain = null;
    this.reverbNode = null;
    this.ambientGain = null;
    this.isAmbientPlaying = false;
    this.sparklerNode = null;
    this.sparklerGain = null;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime);

      this.reverbNode = this.createSyntheticReverb(2.4, 0.38);
      this.reverbNode.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn('AudioContext initialization error', e);
    }
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (!this.ctx) return;
    const target = muted ? 0 : 0.85;
    this.masterGain.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.05);

    if (!muted && !this.isAmbientPlaying) {
      this.startAmbientRaga();
    }
  }

  createSyntheticReverb(duration, decay) {
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * duration;
    const impulse = this.ctx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = i / length;
      const factor = Math.exp(-n * decay * 10);
      left[i] = (Math.random() * 2 - 1) * factor;
      right[i] = (Math.random() * 2 - 1) * factor;
    }

    const convolver = this.ctx.createConvolver();
    convolver.buffer = impulse;
    return convolver;
  }

  startAmbientRaga() {
    this.ensureContext();
    if (!this.ctx || this.isAmbientPlaying) return;

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 2.5);
    this.ambientGain.connect(this.masterGain);

    const freqs = [73.42, 110.0, 146.83, 220.0];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.18 + idx * 0.08, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(freq * 0.003, this.ctx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.07 / (idx + 1), this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);
      osc.start();
    });

    this.isAmbientPlaying = true;
  }

  // 1. AERIAL ROCKET
  playRocketLaunch(pan = 0) {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220 + Math.random() * 80, now);
    osc.frequency.exponentialRampToValueAtTime(1400 + Math.random() * 500, now + 0.45);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, now);

    osc.connect(filter);
    filter.connect(gain);

    if (panner) {
      panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), now);
      gain.connect(panner);
      panner.connect(this.masterGain);
    } else {
      gain.connect(this.masterGain);
    }

    osc.start(now);
    osc.stop(now + 0.5);
  }

  // 2. EXPLOSION
  playExplosion(pan = 0, size = 1) {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (panner) panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), now);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150 * size, now);
    osc.frequency.exponentialRampToValueAtTime(26, now + 0.35);

    gain.gain.setValueAtTime(0.6 * size, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    if (panner) {
      gain.connect(panner);
      panner.connect(this.masterGain);
    } else {
      gain.connect(this.masterGain);
    }
    osc.start(now);
    osc.stop(now + 0.5);

    // Crackle noise
    const len = this.ctx.sampleRate * 0.4;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.22));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1300 + Math.random() * 400, now);
    filter.Q.setValueAtTime(2, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    noise.connect(filter);
    filter.connect(noiseGain);
    if (panner) {
      noiseGain.connect(panner);
      panner.connect(this.masterGain);
      panner.connect(this.reverbNode);
    } else {
      noiseGain.connect(this.masterGain);
      noiseGain.connect(this.reverbNode);
    }
    noise.start(now);
  }

  // 3. SUTLI BOMB (COLOSSAL BLAST)
  playSutliBomb() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;

    // A. Fuse hiss first (0.4s)
    const fuseLen = this.ctx.sampleRate * 0.35;
    const fuseBuf = this.ctx.createBuffer(1, fuseLen, this.ctx.sampleRate);
    const fData = fuseBuf.getChannelData(0);
    for (let i = 0; i < fuseLen; i++) fData[i] = (Math.random() * 2 - 1) * 0.25;
    const fuse = this.ctx.createBufferSource();
    fuse.buffer = fuseBuf;
    const fFilter = this.ctx.createBiquadFilter();
    fFilter.type = 'highpass';
    fFilter.frequency.setValueAtTime(3500, now);
    fuse.connect(fFilter);
    fFilter.connect(this.masterGain);
    fuse.start(now);

    // B. Massive shockwave detonation at 0.35s
    const blastTime = now + 0.35;
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(180, blastTime);
    subOsc.frequency.exponentialRampToValueAtTime(18, blastTime + 0.6);

    subGain.gain.setValueAtTime(0.9, blastTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, blastTime + 0.75);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subGain.connect(this.reverbNode);
    subOsc.start(blastTime);
    subOsc.stop(blastTime + 0.8);

    // Shockwave distortion noise
    const boomLen = this.ctx.sampleRate * 0.6;
    const boomBuf = this.ctx.createBuffer(1, boomLen, this.ctx.sampleRate);
    const bData = boomBuf.getChannelData(0);
    for (let i = 0; i < boomLen; i++) bData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (boomLen * 0.15));
    const boomSource = this.ctx.createBufferSource();
    boomSource.buffer = boomBuf;

    const bFilter = this.ctx.createBiquadFilter();
    bFilter.type = 'lowpass';
    bFilter.frequency.setValueAtTime(900, blastTime);

    const bGain = this.ctx.createGain();
    bGain.gain.setValueAtTime(0.7, blastTime);
    bGain.gain.exponentialRampToValueAtTime(0.001, blastTime + 0.6);

    boomSource.connect(bFilter);
    bFilter.connect(bGain);
    bGain.connect(this.masterGain);
    bGain.connect(this.reverbNode);
    boomSource.start(blastTime);
  }

  // 4. ANAAR (FOUNTAIN)
  playAnaarSizzle() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const duration = 2.8;
    const len = this.ctx.sampleRate * duration;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);

    for (let i = 0; i < len; i++) {
      const progress = i / len;
      const env = progress < 0.2 ? progress / 0.2 : Math.pow(1 - (progress - 0.2) / 0.8, 1.4);
      data[i] = (Math.random() * 2 - 1) * env;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buf;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1800, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.28, now);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start(now);
  }

  // 5. CHAKRI (SPINNER)
  playChakriWhir() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(450, now + 0.8);
    osc.frequency.linearRampToValueAtTime(120, now + 2.5);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.6);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(3, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 2.7);
  }

  // 6. LADI (CHAIN REACTION)
  playLadiChain(count = 28) {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    for (let i = 0; i < count; i++) {
      const delay = i * 0.07 + (Math.random() - 0.5) * 0.02;
      setTimeout(() => {
        if (this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(380 + Math.random() * 260, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.045);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.05);
      }, delay * 1000);
    }
  }

  // 7. BIJLI CRACKER (SHARP SNAP)
  playBijliSnap() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const t = now + i * 0.04 + Math.random() * 0.02;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600 + Math.random() * 400, t);
      osc.frequency.exponentialRampToValueAtTime(100, t + 0.03);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.04);
    }
  }

  // 8. HUNTER / MAGIC PENCIL (TRACER SHOTS)
  playHunterShot() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800 + Math.random() * 300, now);
    osc.frequency.exponentialRampToValueAtTime(250, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // 9. SAANP KI GOLI (SNAKE TABLET SMOLDER)
  playSnakeHiss() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const len = this.ctx.sampleRate * 2.2;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.6));
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buf;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400, now);
    filter.Q.setValueAtTime(2.5, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, now);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start(now);
  }

  // 10. SPARKLER
  startSparklerSound() {
    this.ensureContext();
    if (!this.ctx || this.isMuted || this.sparklerNode) return;

    const len = this.ctx.sampleRate * 2;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * 0.4;

    this.sparklerNode = this.ctx.createBufferSource();
    this.sparklerNode.buffer = buf;
    this.sparklerNode.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3200, this.ctx.currentTime);

    this.sparklerGain = this.ctx.createGain();
    this.sparklerGain.gain.setValueAtTime(0.15, this.ctx.currentTime);

    this.sparklerNode.connect(filter);
    filter.connect(this.sparklerGain);
    this.sparklerGain.connect(this.masterGain);
    this.sparklerNode.start();
  }

  stopSparklerSound() {
    if (this.sparklerGain && this.ctx) {
      this.sparklerGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
      setTimeout(() => {
        if (this.sparklerNode) {
          try {
            this.sparklerNode.stop();
            this.sparklerNode.disconnect();
          } catch (e) {}
          this.sparklerNode = null;
        }
      }, 120);
    }
  }

  // 11. SKY KANDIL (WARM SERENE TONE)
  playKandilSound() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 1.2);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    osc.connect(gain);
    gain.connect(this.masterGain);
    gain.connect(this.reverbNode);
    osc.start(now);
    osc.stop(now + 1.9);
  }
}

export const soundManager = new DiwaliAudioEngine();
