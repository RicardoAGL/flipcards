/**
 * FlipCard Component
 * Core UI component for Dutch pronunciation learning
 *
 * Features:
 * - 3-section layout (prefix, center, suffix)
 * - 3D flip animations
 * - Keyboard accessibility
 * - Text-to-speech integration
 */

import { createTTSController, speakDutch } from '../lib/tts.js';
import './FlipCard.css';

/**
 * Sample lesson data structure
 */
const sampleLessonData = {
  sound: 'ui',
  ipa: '[oey]',
  description: 'Redondea los labios y di "ei"',
  words: [
    { prefix: 'h', suffix: 's' }, // huis
    { prefix: 'b', suffix: 'ten' }, // buiten
    { prefix: 't', suffix: 'n' }, // tuin
    { prefix: '', suffix: '' }, // ui (standalone)
  ],
};

/**
 * @typedef {Object} FlipCardLessonData
 * @property {string} sound
 * @property {string} ipa
 * @property {string} description
 * @property {Array<{prefix: string, suffix: string, word?: string, translation?: Record<string, string>}>} words
 */

/**
 * Create the FlipCard component
 * @param {FlipCardLessonData} lessonData - Lesson data containing sound, IPA, description, and words
 * @param {HTMLElement} container - Container element to render into
 * @param {Object} [options] - Configuration options
 * @param {string} [options.language='es'] - Display language for translations ('es' or 'en')
 * @returns {{ destroy: () => void, setLessonData: (newData: FlipCardLessonData) => void, getState: () => any, getCurrentWord: () => any, buildFullWord: () => string }} Component API
 */
export function createFlipCard(lessonData = sampleLessonData, container, options = {}) {
  const language = options.language || 'es';

  // State
  let currentWordIndex = 0;
  let isCenterFlipped = false;
  let isPrefixFlipping = false;
  let isSuffixFlipping = false;
  let isTranslationVisible = false;
  /** @type {ReturnType<typeof createTTSController> | null} */
  let ttsController = null;
  let ttsAvailable = false;
  let isSpeaking = false;

  // Elements cache
  /** @type {any} */
  let elements = {};

  /**
   * Get current word data
   */
  const getCurrentWord = () => lessonData.words[currentWordIndex];

  /**
   * Get next word index (cycling)
   */
  const getNextWordIndex = () => (currentWordIndex + 1) % lessonData.words.length;

  /**
   * Build the full word from parts
   */
  const buildFullWord = () => {
    const word = getCurrentWord();
    return `${word.prefix}${lessonData.sound}${word.suffix}`;
  };

  /**
   * Get the translation for the current word
   */
  const getCurrentTranslation = () => {
    const word = getCurrentWord();
    if (!word.translation) {return '';}
    return word.translation[language] || '';
  };

  /**
   * Render the component HTML
   */
  const render = () => {
    const word = getCurrentWord();
    const fullWord = buildFullWord();

    const html = `
      <div class="flip-card-practice" role="application" aria-label="Dutch pronunciation practice">
        <!-- Card Row -->
        <div class="flip-card-row">
          <!-- Prefix Card -->
          <div
            class="flip-card flip-card--prefix"
            tabindex="0"
            role="button"
            aria-label="Prefix: ${word.prefix || 'empty'}. Press Enter or Space to change"
            data-card="prefix"
          >
            <div class="flip-card-inner">
              <div class="flip-card-face flip-card-face--front">
                <span class="flip-card-letter ${!word.prefix ? 'flip-card-letter--empty' : ''}"
                      aria-hidden="true">
                  ${word.prefix || '-'}
                </span>
                <span class="flip-card-hint" aria-hidden="true">tap</span>
              </div>
              <div class="flip-card-face flip-card-face--back">
                <span class="flip-card-letter" aria-hidden="true" data-next-prefix></span>
              </div>
            </div>
          </div>

          <!-- Center Card -->
          <div
            class="flip-card flip-card--center"
            tabindex="0"
            role="button"
            aria-label="Main sound: ${lessonData.sound}. Press Enter or Space to see pronunciation guide"
            data-card="center"
          >
            <div class="flip-card-inner">
              <div class="flip-card-face flip-card-face--front">
                <span class="flip-card-sound" aria-hidden="true">${lessonData.sound}</span>
                <span class="flip-card-hint" aria-hidden="true">tap</span>
              </div>
              <div class="flip-card-face flip-card-face--back">
                <span class="flip-card-ipa" aria-hidden="true">${lessonData.ipa}</span>
                <div class="flip-card-divider" aria-hidden="true"></div>
                <p class="flip-card-description" aria-hidden="true">${lessonData.description}</p>
                <button
                  class="flip-card-pronounce-btn"
                  type="button"
                  aria-label="Pronounce the word ${fullWord}"
                  data-action="pronounce"
                  ${!ttsAvailable ? 'disabled' : ''}
                >
                  <svg class="icon-speaker" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  <span>Pronounce</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Suffix Card -->
          <div
            class="flip-card flip-card--suffix"
            tabindex="0"
            role="button"
            aria-label="Suffix: ${word.suffix || 'empty'}. Press Enter or Space to change"
            data-card="suffix"
          >
            <div class="flip-card-inner">
              <div class="flip-card-face flip-card-face--front">
                <span class="flip-card-letter ${!word.suffix ? 'flip-card-letter--empty' : ''}"
                      aria-hidden="true">
                  ${word.suffix || '-'}
                </span>
                <span class="flip-card-hint" aria-hidden="true">tap</span>
              </div>
              <div class="flip-card-face flip-card-face--back">
                <span class="flip-card-letter" aria-hidden="true" data-next-suffix></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Word Preview -->
        <div class="flip-card-word-preview" aria-live="polite">
          <span class="flip-card-word-parts" aria-hidden="true">
            ${word.prefix}<span class="highlight">${lessonData.sound}</span>${word.suffix}
          </span>
          <span class="flip-card-word-full">${fullWord}</span>
          <span class="sr-only">Current word: ${fullWord}</span>
        </div>

        <!-- Translation (hidden by default) -->
        <div class="flip-card-translation flip-card-translation--hidden" data-translation>
          <span class="flip-card-translation__text">${getCurrentTranslation()}</span>
          <button
            class="flip-card-translation__toggle"
            type="button"
            data-action="toggle-translation"
            aria-label="Show meaning"
          >
            ${isTranslationVisible ? '🔽' : '💡'}
          </button>
        </div>

        <!-- TTS Error (hidden by default) -->
        <div class="flip-card-tts-error" style="display: none;" data-tts-error role="alert">
          <span class="flip-card-tts-error-text">
            Dutch voice not available. Please enable Dutch language on your device.
          </span>
        </div>
      </div>
    `;

    container.innerHTML = html;
    cacheElements();
    bindEvents();
  };

  /**
   * Cache DOM elements for performance
   */
  const cacheElements = () => {
    elements = {
      prefixCard: container.querySelector('[data-card="prefix"]'),
      centerCard: container.querySelector('[data-card="center"]'),
      suffixCard: container.querySelector('[data-card="suffix"]'),
      pronounceBtn: container.querySelector('[data-action="pronounce"]'),
      ttsError: container.querySelector('[data-tts-error]'),
      wordPreview: container.querySelector('.flip-card-word-preview'),
      wordParts: container.querySelector('.flip-card-word-parts'),
      wordFull: container.querySelector('.flip-card-word-full'),
      translationContainer: container.querySelector('[data-translation]'),
      translationText: container.querySelector('.flip-card-translation__text'),
      translationToggle: container.querySelector('[data-action="toggle-translation"]'),
    };
  };

  /**
   * Bind event listeners
   */
  const bindEvents = () => {
    // Prefix card
    elements.prefixCard.addEventListener('click', handlePrefixClick);
    elements.prefixCard.addEventListener('keydown', handleCardKeydown);

    // Center card
    elements.centerCard.addEventListener('click', handleCenterClick);
    elements.centerCard.addEventListener('keydown', handleCardKeydown);

    // Suffix card
    elements.suffixCard.addEventListener('click', handleSuffixClick);
    elements.suffixCard.addEventListener('keydown', handleCardKeydown);

    // Pronounce button
    elements.pronounceBtn.addEventListener('click', handlePronounce);

    // Translation toggle
    if (elements.translationToggle) {
      elements.translationToggle.addEventListener('click', handleTranslationToggle);
    }
  };

  /**
   * Handle prefix card click - cycle to next word
   */
  const handlePrefixClick = () => {
    if (isPrefixFlipping) {return;}

    // Prepare next word on back face
    const nextIndex = getNextWordIndex();
    const nextWord = lessonData.words[nextIndex];
    const nextPrefixEl = elements.prefixCard.querySelector('[data-next-prefix]');
    nextPrefixEl.textContent = nextWord.prefix || '-';
    nextPrefixEl.classList.toggle('flip-card-letter--empty', !nextWord.prefix);

    // Flip animation
    isPrefixFlipping = true;
    elements.prefixCard.classList.add('is-flipped');

    // After animation completes, update to new word
    setTimeout(() => {
      currentWordIndex = nextIndex;
      elements.prefixCard.classList.remove('is-flipped');
      updateWordDisplay();
      isPrefixFlipping = false;
    }, 300);
  };

  /**
   * Handle suffix card click - cycle to next word
   */
  const handleSuffixClick = () => {
    if (isSuffixFlipping) {return;}

    // Prepare next word on back face
    const nextIndex = getNextWordIndex();
    const nextWord = lessonData.words[nextIndex];
    const nextSuffixEl = elements.suffixCard.querySelector('[data-next-suffix]');
    nextSuffixEl.textContent = nextWord.suffix || '-';
    nextSuffixEl.classList.toggle('flip-card-letter--empty', !nextWord.suffix);

    // Flip animation
    isSuffixFlipping = true;
    elements.suffixCard.classList.add('is-flipped');

    // After animation completes, update to new word
    setTimeout(() => {
      currentWordIndex = nextIndex;
      elements.suffixCard.classList.remove('is-flipped');
      updateWordDisplay();
      isSuffixFlipping = false;
    }, 300);
  };

  /**
   * Handle center card click - toggle flip to show pronunciation
   */
  const handleCenterClick = () => {
    isCenterFlipped = !isCenterFlipped;
    elements.centerCard.classList.toggle('is-flipped', isCenterFlipped);

    // Update aria-label
    const label = isCenterFlipped
      ? `Pronunciation guide showing. IPA: ${lessonData.ipa}. ${lessonData.description}. Press Enter or Space to flip back`
      : `Main sound: ${lessonData.sound}. Press Enter or Space to see pronunciation guide`;
    elements.centerCard.setAttribute('aria-label', label);
  };

  /**
   * Handle keyboard events on cards
   */
  /** @param {KeyboardEvent} event */
  const handleCardKeydown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      /** @type {HTMLElement} */ (event.target).click();
    }
  };

  /**
   * Handle translation toggle click
   */
  const handleTranslationToggle = () => {
    isTranslationVisible = !isTranslationVisible;
    elements.translationContainer.classList.toggle('flip-card-translation--hidden', !isTranslationVisible);
    elements.translationToggle.textContent = isTranslationVisible ? '🔽' : '💡';
    elements.translationToggle.setAttribute('aria-label', isTranslationVisible ? 'Hide meaning' : 'Show meaning');
  };

  /**
   * Handle pronounce button click
   */
  /** @param {Event} event */
  const handlePronounce = async (event) => {
    event.stopPropagation(); // Prevent card flip

    if (isSpeaking || !ttsAvailable) {return;}

    const fullWord = buildFullWord();
    const btn = elements.pronounceBtn;

    try {
      isSpeaking = true;
      btn.classList.add('is-playing');
      btn.setAttribute('aria-label', `Playing pronunciation of ${fullWord}`);

      await speakDutch(fullWord, {
        onEnd: () => {
          isSpeaking = false;
          btn.classList.remove('is-playing');
          btn.setAttribute('aria-label', `Pronounce the word ${fullWord}`);
        },
        onError: (/** @type {any} */ error) => {
          console.error('TTS error:', error);
          isSpeaking = false;
          btn.classList.remove('is-playing');
          showTTSError();
        },
      });
    } catch (/** @type {any} */ error) {
      console.error('TTS error:', error);
      isSpeaking = false;
      btn.classList.remove('is-playing');
      showTTSError();
    }
  };

  /**
   * Update word display after cycling
   */
  const updateWordDisplay = () => {
    const word = getCurrentWord();
    const fullWord = buildFullWord();

    // Update prefix display
    const prefixLetter = elements.prefixCard.querySelector('.flip-card-face--front .flip-card-letter');
    prefixLetter.textContent = word.prefix || '-';
    prefixLetter.classList.toggle('flip-card-letter--empty', !word.prefix);

    // Update suffix display
    const suffixLetter = elements.suffixCard.querySelector('.flip-card-face--front .flip-card-letter');
    suffixLetter.textContent = word.suffix || '-';
    suffixLetter.classList.toggle('flip-card-letter--empty', !word.suffix);

    // Update word preview
    elements.wordParts.innerHTML = `${word.prefix}<span class="highlight">${lessonData.sound}</span>${word.suffix}`;
    elements.wordFull.textContent = fullWord;

    // Update translation
    if (elements.translationText) {
      elements.translationText.textContent = getCurrentTranslation();
    }

    // Update aria labels
    elements.prefixCard.setAttribute(
      'aria-label',
      `Prefix: ${word.prefix || 'empty'}. Press Enter or Space to change`,
    );
    elements.suffixCard.setAttribute(
      'aria-label',
      `Suffix: ${word.suffix || 'empty'}. Press Enter or Space to change`,
    );
    elements.pronounceBtn.setAttribute('aria-label', `Pronounce the word ${fullWord}`);

    // Announce to screen readers
    const srAnnounce = container.querySelector('.sr-only');
    if (srAnnounce) {
      srAnnounce.textContent = `Current word: ${fullWord}`;
    }
  };

  /**
   * Show TTS error message
   */
  const showTTSError = () => {
    elements.ttsError.style.display = 'flex';
    elements.pronounceBtn.disabled = true;

    // Auto-hide after 5 seconds
    setTimeout(() => {
      elements.ttsError.style.display = 'none';
    }, 5000);
  };

  /**
   * Initialize TTS
   */
  const initTTS = async () => {
    ttsController = createTTSController();
    ttsAvailable = await ttsController.init();

    if (!ttsAvailable) {
      elements.pronounceBtn.disabled = true;
    }
  };

  /**
   * Initialize the component
   */
  const init = async () => {
    render();
    await initTTS();
  };

  /**
   * Destroy the component
   */
  const destroy = () => {
    if (ttsController) {
      ttsController.stop();
    }
    container.innerHTML = '';
    elements = {};
  };

  /**
   * Update lesson data
   */
  /** @param {FlipCardLessonData} newData */
  const setLessonData = (newData) => {
    lessonData = newData;
    currentWordIndex = 0;
    isCenterFlipped = false;
    render();
    initTTS();
  };

  /**
   * Get current state
   */
  const getState = () => ({
    currentWordIndex,
    currentWord: getCurrentWord(),
    fullWord: buildFullWord(),
    isCenterFlipped,
    isTranslationVisible,
    ttsAvailable,
  });

  // Initialize and return API
  init();

  return {
    destroy,
    setLessonData,
    getState,
    getCurrentWord,
    buildFullWord,
  };
}

export default createFlipCard;
