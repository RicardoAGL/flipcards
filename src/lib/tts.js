/**
 * Text-to-Speech Utility for Dutch Pronunciation
 * Uses the Web Speech Synthesis API
 */

/**
 * Check if the browser supports speech synthesis
 * @returns {boolean}
 */
export function isSpeechSynthesisSupported() {
  return 'speechSynthesis' in window;
}

/**
 * Score a voice for quality ranking
 * Higher scores indicate better voices for Dutch pronunciation
 * @param {SpeechSynthesisVoice} voice - The voice to score
 * @returns {number} Quality score
 */
export function scoreVoice(voice) {
  let score = 0;

  // Region preference: nl-NL > nl-BE > other nl
  if (voice.lang === 'nl-NL') {
    score += 10;
  } else if (voice.lang === 'nl-BE') {
    score += 5;
  } else {
    score += 1;
  }

  // Cloud/remote voices tend to be higher quality
  if (!voice.localService) {
    score += 3;
  }

  // Named premium engines
  const name = voice.name.toLowerCase();
  if (name.includes('google') || name.includes('microsoft') || name.includes('apple')) {
    score += 2;
  }

  return score;
}

/**
 * Get available Dutch voices, sorted by quality score
 * @param {number} [timeout=3000] - Max ms to wait for voices to load
 * @returns {Promise<SpeechSynthesisVoice[]>}
 */
export function getDutchVoices(timeout = 3000) {
  return new Promise((resolve) => {
    /** @param {SpeechSynthesisVoice[]} voices */
    const filterAndSort = (voices) => {
      return voices
        .filter((voice) => voice.lang.startsWith('nl'))
        .sort((a, b) => scoreVoice(b) - scoreVoice(a));
    };

    const voices = speechSynthesis.getVoices();

    if (voices.length > 0) {
      resolve(filterAndSort(voices));
      return;
    }

    let settled = false;

    const timeoutId = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve([]);
      }
    }, timeout);

    // Voices may not be loaded yet, wait for them
    speechSynthesis.onvoiceschanged = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timeoutId);
        const allVoices = speechSynthesis.getVoices();
        resolve(filterAndSort(allVoices));
      }
    };
  });
}

/**
 * Check if Dutch voice is available
 * @returns {Promise<boolean>}
 */
export async function isDutchVoiceAvailable() {
  if (!isSpeechSynthesisSupported()) {
    return false;
  }

  const dutchVoices = await getDutchVoices();
  return dutchVoices.length > 0;
}

/**
 * Speak text in Dutch
 * @param {string} text - The text to speak
 * @param {Object} [options] - Optional configuration
 * @param {number} [options.rate] - Speech rate (0.1 to 10, default 0.9)
 * @param {number} [options.pitch] - Speech pitch (0 to 2, default 1)
 * @param {Function} [options.onStart] - Callback when speech starts
 * @param {Function} [options.onEnd] - Callback when speech ends
 * @param {Function} [options.onError] - Callback on error
 * @returns {Promise<void>}
 */
export async function speakDutch(text, options = {}) {
  const {
    rate = 0.9,
    pitch = 1,
    onStart,
    onEnd,
    onError,
  } = options;

  if (!isSpeechSynthesisSupported()) {
    const error = new Error('Speech synthesis is not supported in this browser');
    if (onError) {onError(error);}
    throw error;
  }

  // Cancel any ongoing speech
  speechSynthesis.cancel();

  const dutchVoices = await getDutchVoices();

  if (dutchVoices.length === 0) {
    const error = new Error('No Dutch voice available. Please install Dutch language support on your device.');
    if (onError) {onError(error);}
    throw error;
  }

  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);

    // Use highest-scored voice (already sorted by getDutchVoices)
    utterance.voice = dutchVoices[0];
    utterance.lang = 'nl-NL';
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => {
      if (onStart) {onStart();}
    };

    utterance.onend = () => {
      if (onEnd) {onEnd();}
      resolve();
    };

    utterance.onerror = (event) => {
      const error = new Error(`Speech synthesis error: ${event.error}`);
      if (onError) {onError(error);}
      reject(error);
    };

    speechSynthesis.speak(utterance);
  });
}

/**
 * Stop any ongoing speech
 */
export function stopSpeaking() {
  if (isSpeechSynthesisSupported()) {
    speechSynthesis.cancel();
  }
}

/**
 * Create a TTS controller with state management
 * @returns {{ init: () => Promise<boolean>, speak: (text: string) => Promise<void>, stop: () => void, getIsSpeaking: () => boolean, getIsAvailable: () => boolean | null, subscribe: (listener: (arg0: {isSpeaking: boolean, isAvailable: boolean | null}) => void) => Function }} TTS controller with speak, stop, and state methods
 */
export function createTTSController() {
  let isSpeaking = false;
  /** @type {boolean | null} */
  let isAvailable = null;
  /** @type {Array<function({isSpeaking: boolean, isAvailable: boolean | null}): void>} */
  let listeners = [];

  const notify = () => {
    listeners.forEach((listener) => listener({ isSpeaking, isAvailable }));
  };

  const controller = {
    /**
     * Initialize and check availability
     */
    async init() {
      isAvailable = await isDutchVoiceAvailable();
      notify();
      return isAvailable;
    },

    /**
     * Speak text in Dutch
     * @param {string} text
     */
    async speak(text) {
      if (isSpeaking) {
        this.stop();
      }

      isSpeaking = true;
      notify();

      try {
        await speakDutch(text, {
          onEnd: () => {
            isSpeaking = false;
            notify();
          },
          onError: () => {
            isSpeaking = false;
            notify();
          },
        });
      } catch (error) {
        isSpeaking = false;
        notify();
        throw error;
      }
    },

    /**
     * Stop speaking
     */
    stop() {
      stopSpeaking();
      isSpeaking = false;
      notify();
    },

    /**
     * Check if currently speaking
     */
    getIsSpeaking() {
      return isSpeaking;
    },

    /**
     * Check if Dutch voice is available
     */
    getIsAvailable() {
      return isAvailable;
    },

    /**
     * Subscribe to state changes
     * @param {(arg0: {isSpeaking: boolean, isAvailable: boolean | null}) => void} listener
     * @returns {Function} Unsubscribe function
     */
    subscribe(listener) {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
  };

  return controller;
}
