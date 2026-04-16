// IntelCore Sound System
// Sounds for UI interactions

export const sounds = {
  // UI Sounds
  ui: {
    click: '/sounds/click.mp3',
    hover: '/sounds/hover.mp3',
    success: '/sounds/success.mp3',
    error: '/sounds/error.mp3',
    notification: '/sounds/notification.mp3',
  },
  // Background Music
  ambient: {
    main: '/sounds/ambient-main.mp3',
    dark: '/sounds/ambient-dark.mp3',
  },
  // Navigation
  nav: {
    open: '/sounds/nav-open.mp3',
    close: '/sounds/nav-close.mp3',
  },
  // Charts & Data
  data: {
    scan: '/sounds/scan.mp3',
    chart: '/sounds/chart.mp3',
    generate: '/sounds/generate.mp3',
  },
};

class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.3;
  private ambientPlaying: boolean = false;
  private ambientSource: AudioBufferSourceNode | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioContext();
    }
  }

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  async loadSound(name: string, url: string): Promise<void> {
    if (!this.audioContext) return;
    
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.sounds.set(name, audioBuffer);
    } catch (e) {
      console.warn(`Failed to load sound: ${name}`);
    }
  }

  play(name: string, volume?: number): void {
    if (!this.enabled || !this.audioContext) return;
    
    const sound = this.sounds.get(name);
    if (!sound) {
      // Generate synthetic sound if not loaded
      this.playSynthetic(name, volume);
      return;
    }

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = sound;
    gainNode.gain.value = volume ?? this.volume;
    
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    source.start(0);
  }

  private playSynthetic(name: string, volume?: number): void {
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const vol = volume ?? this.volume;
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // Different sounds for different actions
    switch (name) {
      case 'click':
        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1);
        gainNode.gain.setValueAtTime(vol * 0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
        break;
        
      case 'hover':
        oscillator.frequency.setValueAtTime(600, now);
        gainNode.gain.setValueAtTime(vol * 0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        oscillator.start(now);
        oscillator.stop(now + 0.05);
        break;
        
      case 'success':
        oscillator.frequency.setValueAtTime(523, now); // C5
        oscillator.frequency.setValueAtTime(659, now + 0.1); // E5
        oscillator.frequency.setValueAtTime(784, now + 0.2); // G5
        gainNode.gain.setValueAtTime(vol * 0.3, now);
        gainNode.gain.setValueAtTime(vol * 0.3, now + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        oscillator.start(now);
        oscillator.stop(now + 0.4);
        break;
        
      case 'error':
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.2);
        gainNode.gain.setValueAtTime(vol * 0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        break;
        
      case 'notification':
        oscillator.frequency.setValueAtTime(880, now);
        oscillator.frequency.setValueAtTime(880, now + 0.15);
        oscillator.frequency.setValueAtTime(1100, now + 0.3);
        gainNode.gain.setValueAtTime(vol * 0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        oscillator.start(now);
        oscillator.stop(now + 0.45);
        break;
        
      case 'nav-open':
        oscillator.frequency.setValueAtTime(300, now);
        oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.15);
        gainNode.gain.setValueAtTime(vol * 0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        oscillator.start(now);
        oscillator.stop(now + 0.15);
        break;
        
      case 'scan':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, now);
        for (let i = 0; i < 10; i++) {
          oscillator.frequency.setValueAtTime(440 + i * 50, now + i * 0.1);
        }
        gainNode.gain.setValueAtTime(vol * 0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1);
        oscillator.start(now);
        oscillator.stop(now + 1);
        break;
        
      default:
        oscillator.frequency.setValueAtTime(440, now);
        gainNode.gain.setValueAtTime(vol * 0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
    }
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
  }

  toggleSound(): boolean {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getVolume(): number {
    return this.volume;
  }

  // Ambient background sound
  playAmbient(type: 'main' | 'dark' = 'dark'): void {
    if (!this.enabled || this.ambientPlaying) return;
    
    if (!this.audioContext) return;
    
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    
    // Create ambient drone
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc1.type = 'sine';
    osc2.type = 'triangle';
    
    if (type === 'dark') {
      osc1.frequency.setValueAtTime(55, now); // A1
      osc2.frequency.setValueAtTime(55.5, now); // Slight detune
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, now);
    } else {
      osc1.frequency.setValueAtTime(110, now); // A2
      osc2.frequency.setValueAtTime(110.5, now);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, now);
    }
    
    gainNode.gain.value = this.volume * 0.15;
    
    // Add subtle LFO modulation
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.1;
    lfoGain.gain.value = 5;
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfo.start(now);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc1.start(now);
    osc2.start(now);
    
    this.ambientSource = ctx.createBufferSource();
    this.ambientPlaying = true;
  }

  stopAmbient(): void {
    if (this.ambientSource) {
      this.ambientSource.stop();
      this.ambientSource = null;
    }
    this.ambientPlaying = false;
  }

  isAmbientPlaying(): boolean {
    return this.ambientPlaying;
  }
}

export const soundManager = SoundManager.getInstance();

// React hook for sound
export function useSound() {
  return {
    playClick: () => soundManager.play('click'),
    playHover: () => soundManager.play('hover'),
    playSuccess: () => soundManager.play('success'),
    playError: () => soundManager.play('error'),
    playNotification: () => soundManager.play('notification'),
    playNavOpen: () => soundManager.play('nav-open'),
    playScan: () => soundManager.play('scan'),
    toggleSound: () => soundManager.toggleSound(),
    setVolume: (vol: number) => soundManager.setVolume(vol),
    isEnabled: () => soundManager.isEnabled(),
    playAmbient: () => soundManager.playAmbient('dark'),
    stopAmbient: () => soundManager.stopAmbient(),
  };
}