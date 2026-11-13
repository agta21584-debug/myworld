class PixelAudioEngine {
  private ctx: AudioContext | null = null;
  private enabled = false;
  private musicPlaying = false;
  private musicTimer: number | null = null;
  private stepIndex = 0;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (val) {
      this.ensureContext();
      this.playBlip(587, 0.06);
    } else {
      this.stopMusic();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public isMusicPlaying(): boolean {
    return this.musicPlaying;
  }

  public playBlip(freq = 520, duration = 0.07, type: OscillatorType = 'square', gainVal = 0.04) {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  public playHeartChime() {
    if (!this.enabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      window.setTimeout(() => this.playBlip(n, 0.11, 'triangle', 0.06), idx * 70);
    });
  }

  public playHugChord() {
    if (!this.enabled) return;
    const notes = [440, 554.37, 659.25];
    notes.forEach((n) => this.playBlip(n, 0.22, 'triangle', 0.04));
  }

  public playShutter() {
    if (!this.enabled) return;
    this.playBlip(980, 0.04, 'square', 0.05);
    window.setTimeout(() => this.playBlip(620, 0.05, 'triangle', 0.04), 45);
  }

  public toggleMusic(): boolean {
    if (!this.enabled) {
      this.setEnabled(true);
    }
    if (this.musicPlaying) {
      this.stopMusic();
      return false;
    }
    this.startMusic();
    return true;
  }

  private startMusic() {
    if (this.musicPlaying) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    this.musicPlaying = true;
    // Cute cozy 8-bit melody loop (C major / A minor nostalgic progression)
    const melody = [
      523.25, 659.25, 783.99, 659.25,
      587.33, 698.46, 880.0, 698.46,
      523.25, 659.25, 783.99, 1046.5,
      880.0, 783.99, 659.25, 587.33,
    ];
    this.musicTimer = window.setInterval(() => {
      if (!this.enabled || !this.musicPlaying) return;
      const note = melody[this.stepIndex % melody.length];
      this.playBlip(note, 0.18, 'triangle', 0.025);
      if (this.stepIndex % 4 === 0) {
        this.playBlip(note / 2, 0.24, 'sine', 0.025);
      }
      this.stepIndex += 1;
    }, 320);
  }

  public stopMusic() {
    this.musicPlaying = false;
    if (this.musicTimer !== null) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }
}

export const pixelAudio = new PixelAudioEngine();
