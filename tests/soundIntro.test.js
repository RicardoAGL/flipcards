/**
 * Sound Intro Component Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createSoundIntro } from '../src/components/SoundIntro.js';

// Mock speakDutch and stopSpeaking
vi.mock('../src/lib/tts.js', () => ({
  speakDutch: vi.fn(() => Promise.resolve()),
  stopSpeaking: vi.fn(),
}));

import { speakDutch, stopSpeaking } from '../src/lib/tts.js';

/**
 * querySelector shorthand that returns HTMLElement (non-null assertion for tests)
 * @param {HTMLElement} el
 * @param {string} selector
 * @returns {HTMLElement}
 */
const qs = (el, selector) => /** @type {HTMLElement} */ (el.querySelector(selector));

/** @type {any} */
const mockLesson = {
  lessonId: 'P1-AA-BEG',
  phase: 1,
  sound: {
    combination: 'aa',
    ipa: '[a\u02D0]',
    descriptionES: "Similar a la 'a' en español pero más larga",
    descriptionEN: "Like 'a' in 'father' but longer",
  },
  level: 'beginner',
  unlockRequires: null,
  words: [
    { wordId: 'aa-001', word: 'naam', prefix: 'n', suffix: 'm', translation: { es: 'nombre', en: 'name' }, syllables: 1 },
    { wordId: 'aa-002', word: 'jaar', prefix: 'j', suffix: 'r', translation: { es: 'año', en: 'year' }, syllables: 1 },
    { wordId: 'aa-003', word: 'straat', prefix: 'str', suffix: 't', translation: { es: 'calle', en: 'street' }, syllables: 1 },
    { wordId: 'aa-004', word: 'maat', prefix: 'm', suffix: 't', translation: { es: 'medida', en: 'size' }, syllables: 1 },
    { wordId: 'aa-005', word: 'paar', prefix: 'p', suffix: 'r', translation: { es: 'par', en: 'pair' }, syllables: 1 },
    { wordId: 'aa-006', word: 'kaas', prefix: 'k', suffix: 's', translation: { es: 'queso', en: 'cheese' }, syllables: 1 },
    { wordId: 'aa-007', word: 'vaak', prefix: 'v', suffix: 'k', translation: { es: 'a menudo', en: 'often' }, syllables: 1 },
    { wordId: 'aa-008', word: 'waar', prefix: 'w', suffix: 'r', translation: { es: 'dónde', en: 'where' }, syllables: 1 },
  ],
  estimatedMinutes: 12,
  quiz: { questionCount: 5, passingScore: 0.8, pointsPerCorrect: 20, completionBonus: 10, masteryBonus: 20 },
};

describe('SoundIntro', () => {
  /** @type {HTMLElement} */
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('rendering (Spanish)', () => {
    it('should render sound combination prominently', () => {
      createSoundIntro(mockLesson, container, { language: 'es' });
      const badge = qs(container, '.sound-intro__badge');
      expect(badge).not.toBeNull();
      expect(badge.textContent).toBe('aa');
    });

    it('should render IPA notation', () => {
      createSoundIntro(mockLesson, container, { language: 'es' });
      const ipa = qs(container, '.sound-intro__ipa');
      expect(ipa).not.toBeNull();
      expect(ipa.textContent).toContain('[a\u02D0]');
    });

    it('should render pronunciation description in Spanish', () => {
      createSoundIntro(mockLesson, container, { language: 'es' });
      const desc = qs(container, '.sound-intro__description');
      expect(desc).not.toBeNull();
      expect(desc.textContent).toContain("Similar a la 'a' en español");
    });

    it('should render listen button in Spanish', () => {
      createSoundIntro(mockLesson, container, { language: 'es' });
      const listenBtn = qs(container, '.sound-intro__listen');
      expect(listenBtn).not.toBeNull();
      expect(listenBtn.textContent).toContain('Escuchar');
    });

    it('should render start practice CTA in Spanish', () => {
      createSoundIntro(mockLesson, container, { language: 'es' });
      const cta = qs(container, '.sound-intro__cta');
      expect(cta).not.toBeNull();
      expect(cta.textContent).toContain('Comenzar Práctica');
    });

    it('should render learning objectives section', () => {
      createSoundIntro(mockLesson, container, { language: 'es' });
      const objectives = container.querySelector('.sound-intro__objectives');
      expect(objectives).not.toBeNull();
    });

    it('should show number of words in lesson', () => {
      createSoundIntro(mockLesson, container, { language: 'es' });
      const objectives = qs(container, '.sound-intro__objectives');
      expect(objectives.textContent).toContain('8');
    });

    it('should show estimated time', () => {
      createSoundIntro(mockLesson, container, { language: 'es' });
      const objectives = qs(container, '.sound-intro__objectives');
      expect(objectives.textContent).toContain('12');
    });
  });

  describe('rendering (English)', () => {
    it('should render description in English', () => {
      createSoundIntro(mockLesson, container, { language: 'en' });
      const desc = qs(container, '.sound-intro__description');
      expect(desc.textContent).toContain("Like 'a' in 'father'");
    });

    it('should render listen button in English', () => {
      createSoundIntro(mockLesson, container, { language: 'en' });
      const listenBtn = qs(container, '.sound-intro__listen');
      expect(listenBtn.textContent).toContain('Listen');
    });

    it('should render CTA in English', () => {
      createSoundIntro(mockLesson, container, { language: 'en' });
      const cta = qs(container, '.sound-intro__cta');
      expect(cta.textContent).toContain('Start Practice');
    });
  });

  describe('interactions', () => {
    it('should call speakDutch with first word when listen button is clicked', () => {
      createSoundIntro(mockLesson, container, { language: 'es' });
      const listenBtn = qs(container, '.sound-intro__listen');
      listenBtn.click();
      expect(speakDutch).toHaveBeenCalledWith('naam');
    });

    it('should call onStartPractice when CTA is clicked', () => {
      const onStartPractice = vi.fn();
      createSoundIntro(mockLesson, container, { onStartPractice });
      const cta = qs(container, '.sound-intro__cta');
      cta.click();
      expect(onStartPractice).toHaveBeenCalledOnce();
    });

    it('should call onBack when Escape is pressed', () => {
      const onBack = vi.fn();
      createSoundIntro(mockLesson, container, { onBack });
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(onBack).toHaveBeenCalledOnce();
    });
  });

  describe('lifecycle', () => {
    it('should clear container and stop TTS on destroy', () => {
      const intro = createSoundIntro(mockLesson, container);
      expect(container.innerHTML).not.toBe('');
      intro.destroy();
      expect(container.innerHTML).toBe('');
      expect(stopSpeaking).toHaveBeenCalled();
    });

    it('should remove keydown listener on destroy', () => {
      const onBack = vi.fn();
      const intro = createSoundIntro(mockLesson, container, { onBack });
      intro.destroy();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(onBack).not.toHaveBeenCalled();
    });

    it('should return current state via getState', () => {
      const intro = createSoundIntro(mockLesson, container, { language: 'en' });
      const state = intro.getState();
      expect(state.language).toBe('en');
      expect(state.lessonId).toBe('P1-AA-BEG');
    });
  });
});
