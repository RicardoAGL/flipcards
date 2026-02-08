/**
 * Sound Intro Component
 * Pre-lesson introduction screen with sound details and learning objectives
 *
 * @module SoundIntro
 */

import { speakDutch, stopSpeaking } from '../lib/tts.js';
import './SoundIntro.css';

/**
 * UI text for different languages
 */
const TEXT = {
  es: {
    listen: 'Escuchar',
    cta: 'Comenzar Práctica',
    objectivesTitle: 'Objetivos de aprendizaje',
    recognizeSound: (combo) => `Reconocer el sonido "${combo}" en palabras holandesas`,
    associateIPA: (combo, ipa) => `Asociar "${combo}" con su pronunciación ${ipa}`,
    practiceWords: (count) => `Practicar con ${count} palabras comunes`,
    estimatedTime: (min) => `Tiempo estimado: ${min} minutos`,
  },
  en: {
    listen: 'Listen',
    cta: 'Start Practice',
    objectivesTitle: 'Learning objectives',
    recognizeSound: (combo) => `Recognize the "${combo}" sound in Dutch words`,
    associateIPA: (combo, ipa) => `Associate "${combo}" with its pronunciation ${ipa}`,
    practiceWords: (count) => `Practice with ${count} common words`,
    estimatedTime: (min) => `Estimated time: ${min} minutes`,
  },
};

/**
 * Create a Sound Intro component
 * @param {import('../data/schema.js').Lesson} lesson - The lesson data
 * @param {HTMLElement} container - Container element to render into
 * @param {Object} [options] - Configuration options
 * @param {string} [options.language='es'] - Display language ('es' or 'en')
 * @param {Function} [options.onStartPractice] - Callback when CTA is clicked
 * @param {Function} [options.onBack] - Callback for back navigation
 * @returns {{ destroy: Function, getState: Function }}
 */
export function createSoundIntro(lesson, container, options = {}) {
  const { language = 'es', onStartPractice, onBack } = options;
  const text = TEXT[language] || TEXT.es;
  const { sound, words, estimatedMinutes } = lesson;
  const description = language === 'en' ? sound.descriptionEN : sound.descriptionES;
  const firstWord = words[0]?.word || sound.combination;

  /** @type {Function|null} */
  let keydownHandler = null;

  function render() {
    container.innerHTML = `
      <div class="sound-intro" role="region" aria-label="${sound.combination} sound introduction">
        <div class="sound-intro__header">
          <div class="sound-intro__badge">${sound.combination}</div>
          <div class="sound-intro__ipa">${sound.ipa}</div>
          <p class="sound-intro__description">${description}</p>
          <button class="sound-intro__listen btn btn--secondary" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" width="20" height="20">
              <path d="M11 5L6 9H2v6h4l5 4V5z"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
            ${text.listen}
          </button>
        </div>
        <div class="sound-intro__objectives">
          <h3 class="sound-intro__objectives-title">${text.objectivesTitle}</h3>
          <ul class="sound-intro__objectives-list">
            <li>${text.recognizeSound(sound.combination)}</li>
            <li>${text.associateIPA(sound.combination, sound.ipa)}</li>
            <li>${text.practiceWords(words.length)}</li>
            <li>${text.estimatedTime(estimatedMinutes)}</li>
          </ul>
        </div>
        <button class="sound-intro__cta btn btn--primary" type="button">
          ${text.cta}
        </button>
      </div>`;

    attachEventListeners();
  }

  function attachEventListeners() {
    const listenBtn = container.querySelector('.sound-intro__listen');
    if (listenBtn) {
      listenBtn.addEventListener('click', () => {
        speakDutch(firstWord);
      });
    }

    const cta = container.querySelector('.sound-intro__cta');
    if (cta) {
      cta.addEventListener('click', () => {
        if (onStartPractice) { onStartPractice(); }
      });
    }

    keydownHandler = (e) => {
      if (e.key === 'Escape' && onBack) {
        onBack();
      }
    };
    document.addEventListener('keydown', keydownHandler);
  }

  function destroy() {
    if (keydownHandler) {
      document.removeEventListener('keydown', keydownHandler);
      keydownHandler = null;
    }
    stopSpeaking();
    container.innerHTML = '';
  }

  function getState() {
    return {
      language,
      lessonId: lesson.lessonId,
    };
  }

  render();

  return { destroy, getState };
}
