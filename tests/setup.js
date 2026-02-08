/**
 * Shared Test Helpers
 * Common mocks and utilities used across test files
 */

import { vi } from 'vitest';

/**
 * Create a mock localStorage with vi.fn() spies
 * @returns {Object} Mock localStorage
 */
export function createLocalStorageMock() {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
}

/**
 * Create a test DOM container and append to body
 * @returns {HTMLElement} Container element
 */
export function createTestContainer() {
  const container = document.createElement('div');
  container.id = 'test-container';
  document.body.appendChild(container);
  return container;
}

/**
 * Remove a test container from the DOM
 * @param {HTMLElement} container - Container to remove
 */
export function removeTestContainer(container) {
  if (container && container.parentNode) {
    container.parentNode.removeChild(container);
  }
}

/**
 * Create a mock Web Speech API (speechSynthesis + SpeechSynthesisUtterance)
 * Installs on the global/window object
 * @returns {Object} Mock references for assertions
 */
export function createSpeechSynthesisMock() {
  const mockUtterance = {
    lang: '',
    rate: 1,
    pitch: 1,
    voice: null,
    text: '',
    onstart: null,
    onend: null,
    onerror: null,
  };

  const mockSynthesis = {
    getVoices: vi.fn(() => [
      { lang: 'nl-NL', name: 'Dutch', localService: true },
    ]),
    speak: vi.fn((utterance) => {
      // Trigger onend asynchronously
      setTimeout(() => {
        if (utterance.onend) utterance.onend();
      }, 0);
    }),
    cancel: vi.fn(),
    onvoiceschanged: null,
  };

  // Install globally
  Object.defineProperty(global, 'speechSynthesis', {
    value: mockSynthesis,
    writable: true,
    configurable: true,
  });

  global.SpeechSynthesisUtterance = vi.fn(function (text) {
    this.text = text;
    this.lang = '';
    this.rate = 1;
    this.pitch = 1;
    this.voice = null;
    this.onstart = null;
    this.onend = null;
    this.onerror = null;
  });

  return { mockSynthesis, mockUtterance, SpeechSynthesisUtterance: global.SpeechSynthesisUtterance };
}

/**
 * Create a valid mock lesson object for testing
 * @param {Object} [overrides] - Optional overrides for specific fields
 * @returns {Object} A valid lesson matching the schema
 */
export function createMockLesson(overrides = {}) {
  return {
    lessonId: 'P1-AA-BEG',
    phase: 1,
    sound: {
      combination: 'aa',
      ipa: '[aː]',
      descriptionES: 'Similar a la "a" en español pero más larga',
      descriptionEN: 'Like "a" in "father" but longer',
    },
    level: 'beginner',
    unlockRequires: null,
    words: [
      {
        wordId: 'aa-001',
        word: 'naam',
        prefix: 'n',
        suffix: 'm',
        translation: { es: 'nombre', en: 'name' },
        syllables: 1,
      },
      {
        wordId: 'aa-002',
        word: 'jaar',
        prefix: 'j',
        suffix: 'r',
        translation: { es: 'año', en: 'year' },
        syllables: 1,
      },
      {
        wordId: 'aa-003',
        word: 'straat',
        prefix: 'str',
        suffix: 't',
        translation: { es: 'calle', en: 'street' },
        syllables: 1,
      },
      {
        wordId: 'aa-004',
        word: 'maat',
        prefix: 'm',
        suffix: 't',
        translation: { es: 'medida', en: 'size' },
        syllables: 1,
      },
      {
        wordId: 'aa-005',
        word: 'paar',
        prefix: 'p',
        suffix: 'r',
        translation: { es: 'par', en: 'pair' },
        syllables: 1,
      },
    ],
    quiz: {
      questionCount: 5,
      passingScore: 0.8,
      pointsPerCorrect: 20,
      completionBonus: 10,
      perfectBonus: 25,
    },
    estimatedMinutes: 5,
    ...overrides,
  };
}
