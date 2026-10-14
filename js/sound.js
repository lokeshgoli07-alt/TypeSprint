/**
 * TypeSprint - Web Audio Synthesizer Sound Engine
 * Synthesizes realistic mechanical keyboard clicks, spacebar thocks, error cues,
 * and completion chimes using pure Web Audio API. Zero external audio files required!
 */

class SoundController {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = false; // Disabled / muted by default
    this.volume = 0.35; // Default volume
    this.soundProfile = 'mechanical'; // 'mechanical', 'clicky', 'soft'
    
    // Load persisted settings
    this.loadSettings();
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  loadSettings() {
    try {
      // Sound is OFF by default. Respect user's choice only if they toggled it ON
      // during a previous session. Since user requested no background sounds,
      // we always start muted and let the user opt-in via the Sound button.
      this.soundEnabled = false;
      localStorage.setItem('typesprint_sound_enabled', 'false');

      const savedProfile = localStorage.getItem('typesprint_sound_profile');
      if (savedProfile) {
        this.soundProfile = savedProfile;
      }
    } catch (e) {
      this.soundEnabled = false;
    }
  }

  saveSettings() {
    try {
      localStorage.setItem('typesprint_sound_enabled', this.soundEnabled.toString());
      localStorage.setItem('typesprint_sound_profile', this.soundProfile);
    } catch (e) {
      console.warn('LocalStorage sound save failed:', e);
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    this.saveSettings();
    if (this.soundEnabled) {
      this.initAudio();
      this.playKeySound('key');
    }
    return this.soundEnabled;
  }

  setProfile(profile) {
    this.soundProfile = profile;
    this.saveSettings();
  }

  /**
   * Generates a realistic mechanical key press click
   */
  playKeySound(type = 'key') {
    if (!this.soundEnabled) return;
    this.initAudio();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // Pitch randomization for organic mechanical typing feel
    const pitchVariation = 0.95 + Math.random() * 0.1;

    if (type === 'space') {
      // Spacebar: deeper, hollower stabilizer thock
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320 * pitchVariation, now);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140 * pitchVariation, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.06);

      gain.gain.setValueAtTime(this.volume * 0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } else if (type === 'backspace') {
      // Backspace: slightly lower double-tap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260 * pitchVariation, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.045);

      gain.gain.setValueAtTime(this.volume * 0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.055);
    } else {
      // Standard Key: sharp click + resonant thock body
      // 1. High frequency click noise burst
      const bufferSize = ctx.sampleRate * 0.015; // 15ms buffer
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(2200 * pitchVariation, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(this.volume * 0.45, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(now);

      // 2. Body thock
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420 * pitchVariation, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.038);

      oscGain.gain.setValueAtTime(this.volume * 0.6, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    }
  }

  /**
   * Distinct soft error thud for typos
   */
  playErrorSound() {
    if (!this.soundEnabled) return;
    this.initAudio();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.08);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, now);

    gain.gain.setValueAtTime(this.volume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  /**
   * Uplifting completion chime when time runs out or test finishes
   */
  playCompletionSound() {
    if (!this.soundEnabled) return;
    this.initAudio();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    // Pleasant arpeggio: C5, E5, G5, C6
    const notes = [523.25, 659.25, 783.99, 1046.50];

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(this.volume * 0.4, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }
}

// Global sound manager instance
window.soundController = new SoundController();
