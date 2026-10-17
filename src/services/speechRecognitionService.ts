/**
 * Speech Recognition Service
 * Allows users to practice speaking the vocabulary words and receive real-time pronunciation verification.
 * Built on native browser SpeechRecognition API - 0 latency, 0 external API keys needed.
 */

export interface SpeechVerificationResult {
  transcript: string;
  isMatch: boolean;
  score: number; // 0 to 100
  targetWord: string;
}

class SpeechRecognitionService {
  public isSupported: boolean = false;
  private recognitionInstance: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition ||
        (window as any).mozSpeechRecognition ||
        (window as any).msSpeechRecognition;

      this.isSupported = !!SpeechRecognition;
    }
  }

  private cleanString(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '');
  }

  /**
   * Listen to user speech from the microphone and check if it matches the target word
   */
  public verifyPronunciation(
    targetWord: string,
    onResult: (result: SpeechVerificationResult) => void,
    onError: (errorMessage: string) => void,
    onStatusChange?: (isListening: boolean) => void
  ): () => void {
    if (typeof window === 'undefined') {
      onError('Audio recognition unavailable in this environment.');
      return () => {};
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      (window as any).mozSpeechRecognition ||
      (window as any).msSpeechRecognition;

    if (!SpeechRecognition) {
      onError('Speech recognition is not supported in this browser.');
      return () => {};
    }

    // Stop existing instance if any
    if (this.recognitionInstance) {
      try {
        this.recognitionInstance.abort();
      } catch (e) {}
    }

    try {
      const recognition = new SpeechRecognition();
      this.recognitionInstance = recognition;

      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;

      let recognized = false;

      recognition.onstart = () => {
        onStatusChange?.(true);
      };

      recognition.onresult = (event: any) => {
        recognized = true;
        const results = event.results[0];
        const primaryTranscript = results[0]?.transcript || '';
        const cleanTarget = this.cleanString(targetWord);

        // Check if any of the alternatives match
        let isMatch = false;
        let matchedTranscript = primaryTranscript;

        for (let i = 0; i < results.length; i++) {
          const altText = results[i]?.transcript || '';
          const cleanAlt = this.cleanString(altText);

          if (
            cleanAlt === cleanTarget ||
            cleanAlt.includes(cleanTarget) ||
            cleanTarget.includes(cleanAlt)
          ) {
            isMatch = true;
            matchedTranscript = altText;
            break;
          }
        }

        const score = isMatch ? 100 : 0;

        onResult({
          transcript: matchedTranscript,
          isMatch,
          score,
          targetWord
        });
      };

      recognition.onerror = (event: any) => {
        const error = event.error;
        if (error === 'no-speech') {
          onError('Didn’t hear anything. Tap the mic and try speaking closer.');
        } else if (error === 'not-allowed') {
          onError('Microphone permission denied. Please allow microphone access in browser settings.');
        } else {
          onError(`Microphone error: ${error}`);
        }
        onStatusChange?.(false);
      };

      recognition.onend = () => {
        onStatusChange?.(false);
        if (!recognized) {
          // Ended without result
        }
      };

      recognition.start();

      return () => {
        try {
          recognition.abort();
        } catch (e) {}
        onStatusChange?.(false);
      };
    } catch (err: any) {
      onError('Could not start microphone: ' + (err?.message || 'Permission denied'));
      onStatusChange?.(false);
      return () => {};
    }
  }

  public stop(): void {
    if (this.recognitionInstance) {
      try {
        this.recognitionInstance.abort();
      } catch (e) {}
      this.recognitionInstance = null;
    }
  }
}

export const speechRecognitionService = new SpeechRecognitionService();
