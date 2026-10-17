/**
 * High-performance Audio Service with Audio Preloading and Zero-Latency Native Speech
 */

class AudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private voices: SpeechSynthesisVoice[] = [];
  public isSlowMode: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      this.voices = window.speechSynthesis.getVoices() || [];
    } catch (e) {}
  }

  public toggleSpeed(): boolean {
    this.isSlowMode = !this.isSlowMode;
    return this.isSlowMode;
  }

  /**
   * Preload audio file in background before user taps speak
   */
  public preloadAudio(audioUrl?: string): void {
    if (!audioUrl || !audioUrl.trim() || typeof window === 'undefined') return;
    if (this.audioCache.has(audioUrl)) return;

    try {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = audioUrl;
      audio.load();
      this.audioCache.set(audioUrl, audio);
    } catch (e) {}
  }

  public playWord(word: string, audioUrl?: string, onEnd?: () => void): void {
    this.stop();

    if (audioUrl && audioUrl.trim().length > 0) {
      // Check if we have preloaded audio ready
      let audio = this.audioCache.get(audioUrl);
      if (!audio) {
        audio = new Audio(audioUrl);
        audio.preload = 'auto';
        this.audioCache.set(audioUrl, audio);
      }

      this.currentAudio = audio;
      audio.playbackRate = this.isSlowMode ? 0.75 : 1.0;
      audio.currentTime = 0;

      let hasStarted = false;

      audio.onended = () => {
        this.currentAudio = null;
        if (onEnd) onEnd();
      };

      audio.onplay = () => {
        hasStarted = true;
      };

      audio.onerror = () => {
        this.fallbackSpeech(word, onEnd);
      };

      // Play with instant fast fallback if audio takes longer than 300ms to start
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        // Fast timer: if remote mp3 network request is slow, don't keep user waiting!
        const fastFallbackTimer = setTimeout(() => {
          if (!hasStarted) {
            try { audio.pause(); } catch (e) {}
            this.fallbackSpeech(word, onEnd);
          }
        }, 320);

        playPromise
          .then(() => {
            clearTimeout(fastFallbackTimer);
          })
          .catch(() => {
            clearTimeout(fastFallbackTimer);
            this.fallbackSpeech(word, onEnd);
          });
      }
    } else {
      this.fallbackSpeech(word, onEnd);
    }
  }

  public stop(): void {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {}
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
  }

  public fallbackSpeech(word: string, onEnd?: () => void): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = this.isSlowMode ? 0.65 : 0.90;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      if (this.voices.length === 0) {
        this.loadVoices();
      }

      const englishVoice =
        this.voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Google') ||
              v.name.includes('Natural') ||
              v.name.includes('Siri') ||
              v.name.includes('Samantha') ||
              v.name.includes('Daniel') ||
              v.name.includes('Karen'))
        ) || this.voices.find((v) => v.lang.startsWith('en'));

      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onend = () => {
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis failed:', err);
      if (onEnd) onEnd();
    }
  }
}

export const audioService = new AudioService();
