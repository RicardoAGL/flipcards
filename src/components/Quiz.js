/**
 * Quiz Component
 * Multi-choice quiz for Dutch pronunciation learning
 *
 * Features:
 * - IPA notation display with description
 * - 4-option multiple choice (2x2 grid on mobile, row on desktop)
 * - Correct/incorrect feedback with animations
 * - TTS plays correct word pronunciation
 * - Points animation for correct answers
 * - Progress dots indicator
 * - Results screen on completion
 */

import { generateQuiz, calculateScore, createUserAnswer, generateFeedbackExplanation } from '../lib/quizHelpers.js';
import { speakDutch, isDutchVoiceAvailable } from '../lib/tts.js';
import { createQuizResults } from './QuizResults.js';
import './Quiz.css';

/**
 * Text content for different languages
 */
const TEXT = {
  es: {
    title: 'Quiz',
    questionPrefix: 'P',
    instruction: 'Escucha la palabra y selecciona la correcta',
    prompt: '¿Qué palabra escuchaste?',
    correct: '¡Correcto!',
    incorrect: 'No exactamente',
    theAnswerWas: 'La respuesta era:',
    playing: 'Reproduciendo...',
    next: 'Siguiente',
    listenAgain: 'Escuchar de nuevo',
    autoPlaying: 'Escuchando...',
    ttsUnavailable: 'Pronunciación no disponible en este navegador',
  },
  en: {
    title: 'Quiz',
    questionPrefix: 'Q',
    instruction: 'Listen to the word and select the correct one',
    prompt: 'Which word did you hear?',
    correct: 'Correct!',
    incorrect: 'Not quite',
    theAnswerWas: 'The answer was:',
    playing: 'Playing...',
    next: 'Next',
    listenAgain: 'Listen again',
    autoPlaying: 'Listening...',
    ttsUnavailable: 'Pronunciation not available in this browser',
  },
};

/**
 * Points awarded per correct answer
 */
const POINTS_PER_CORRECT = 20;

/**
 * Create the Quiz component
 * @param {Object} lesson - The lesson data
 * @param {Object} options - Configuration options
 * @param {number} [options.questionCount=5] - Number of questions
 * @param {string} [options.language='es'] - Display language ('es' or 'en')
 * @param {Function} options.onComplete - Callback when quiz is completed
 * @param {Function} [options.onClose] - Callback when quiz is closed
 * @param {import('../lib/quizHelpers.js').QuizQuestion[]} [options.questions] - Pre-supplied questions (overrides generateQuiz)
 * @returns {Object} Component API with mount and destroy methods
 */
export function createQuiz(lesson, options = {}) {
  const {
    questionCount = 5,
    language = 'es',
    onComplete,
    onClose,
  } = options;

  const text = TEXT[language] || TEXT.es;

  // State
  let container = null;
  let questions = [];
  let currentQuestionIndex = 0;
  let answers = [];
  let isAnswered = false;
  let isSpeaking = false;
  let ttsAvailable = false;
  let resultsComponent = null;

  // Elements cache
  let elements = {};

  /**
   * Initialize the quiz
   */
  const init = async () => {
    // Use pre-supplied questions or generate from lesson
    questions = options.questions || generateQuiz(lesson, questionCount);

    // Check TTS availability
    ttsAvailable = await isDutchVoiceAvailable();
  };

  /**
   * Get current question
   */
  const getCurrentQuestion = () => questions[currentQuestionIndex];

  /**
   * Get description based on language
   */
  const getDescription = (question) => {
    return language === 'en' ? question.descriptionEN : question.descriptionES;
  };

  /**
   * Render the quiz question
   */
  const render = () => {
    const question = getCurrentQuestion();
    const description = getDescription(question);
    const questionNumber = currentQuestionIndex + 1;

    const html = `
      <div class="quiz" role="application" aria-label="Pronunciation Quiz">
        <!-- Header -->
        <header class="quiz-header">
          <button
            class="quiz-close-btn"
            type="button"
            aria-label="Close quiz"
            data-action="close"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h1 class="quiz-title">${lesson.sound.combination} ${text.title}</h1>
          <span class="quiz-question-counter">${text.questionPrefix} ${questionNumber}/${questions.length}</span>
        </header>

        <!-- Progress Dots -->
        <div class="quiz-progress-dots" role="progressbar" aria-valuenow="${questionNumber}" aria-valuemin="1" aria-valuemax="${questions.length}">
          ${renderProgressDots()}
        </div>

        <!-- Main Instruction Banner -->
        <div class="quiz-instruction-banner">
          <svg class="quiz-instruction-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          <span class="quiz-instruction-text">${text.instruction}</span>
        </div>

        <!-- Question Card -->
        <div class="quiz-question-card">
          <p class="quiz-prompt">${text.prompt}</p>

          <!-- Listen Button (Primary Action) -->
          ${ttsAvailable ? `
          <button
            class="quiz-listen-btn ${isSpeaking ? 'is-playing' : ''}"
            type="button"
            aria-label="${text.listenAgain}"
            data-action="preview-sound"
            ${isSpeaking ? 'disabled' : ''}
          >
            <svg class="quiz-listen-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            <span class="quiz-listen-text">${isSpeaking ? text.autoPlaying : text.listenAgain}</span>
          </button>
          ` : `
          <div class="quiz-tts-warning" role="status">${text.ttsUnavailable}</div>
          `}

          <!-- IPA Reference (Secondary) -->
          <div class="quiz-reference">
            <span class="quiz-reference-label">Sound reference:</span>
            <span class="quiz-ipa-small" aria-label="IPA notation: ${question.ipa}">${question.ipa}</span>
            <span class="quiz-description-small">${description}</span>
          </div>
        </div>

        <!-- Answer Options -->
        <div class="quiz-options" role="radiogroup" aria-label="Answer options">
          ${renderOptions(question)}
        </div>

        <!-- Next Button (fixed position) -->
        <button
          class="quiz-next-btn ${!isAnswered ? 'quiz-next-btn--hidden' : ''}"
          type="button"
          data-action="next"
          ${!isAnswered ? 'disabled' : ''}
        >
          ${text.next}
        </button>

        <!-- Feedback Area (appears below button) -->
        <div class="quiz-feedback-container" data-feedback-container aria-live="polite">
          <!-- Feedback will be inserted here -->
        </div>
      </div>
    `;

    container.innerHTML = html;
    cacheElements();
    bindEvents();

    // Auto-play the word when question renders
    if (ttsAvailable && !isAnswered) {
      setTimeout(() => autoPlayWord(), 300);
    }
  };

  /**
   * Auto-play the correct word pronunciation
   */
  const autoPlayWord = async () => {
    if (isSpeaking || isAnswered) {
      return;
    }

    const question = getCurrentQuestion();
    isSpeaking = true;
    updateListenButtonState();

    try {
      await speakDutch(question.correctAnswer, {
        rate: 0.8,
        onEnd: () => {
          isSpeaking = false;
          updateListenButtonState();
        },
        onError: () => {
          isSpeaking = false;
          updateListenButtonState();
        },
      });
    } catch (error) {
      console.error('TTS error:', error);
      isSpeaking = false;
      updateListenButtonState();
    }
  };

  /**
   * Update listen button visual state
   */
  const updateListenButtonState = () => {
    const listenBtn = container?.querySelector('[data-action="preview-sound"]');
    if (listenBtn) {
      if (isSpeaking) {
        listenBtn.classList.add('is-playing');
        listenBtn.disabled = true;
        listenBtn.querySelector('.quiz-listen-text').textContent = text.autoPlaying;
      } else {
        listenBtn.classList.remove('is-playing');
        listenBtn.disabled = false;
        listenBtn.querySelector('.quiz-listen-text').textContent = text.listenAgain;
      }
    }
  };

  /**
   * Render progress dots
   */
  const renderProgressDots = () => {
    return questions
      .map((_, index) => {
        let stateClass = '';
        if (index < currentQuestionIndex) {
          // Previous questions
          const answer = answers[index];
          stateClass = answer && answer.isCorrect
            ? 'quiz-progress-dot--correct'
            : 'quiz-progress-dot--incorrect';
        } else if (index === currentQuestionIndex) {
          stateClass = 'quiz-progress-dot--current';
        }
        return `<span class="quiz-progress-dot ${stateClass}" aria-hidden="true"></span>`;
      })
      .join('');
  };

  /**
   * Render answer options
   */
  const renderOptions = (question) => {
    return question.options
      .map((option, index) => {
        const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
        return `
          <button
            class="quiz-option"
            type="button"
            data-option="${option}"
            aria-label="Option ${optionLetter}: ${option}"
            ${isAnswered ? 'disabled' : ''}
          >
            <span class="quiz-option-icon" aria-hidden="true">
              <svg class="icon-check" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <svg class="icon-x" viewBox="0 0 20 20" fill="currentColor" style="display: none;">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </span>
            <span class="quiz-option-text">${option}</span>
          </button>
        `;
      })
      .join('');
  };

  /**
   * Cache DOM elements
   */
  const cacheElements = () => {
    elements = {
      closeBtn: container.querySelector('[data-action="close"]'),
      soundBtn: container.querySelector('[data-action="preview-sound"]'),
      options: container.querySelectorAll('.quiz-option'),
      feedbackContainer: container.querySelector('[data-feedback-container]'),
      nextBtn: container.querySelector('[data-action="next"]'),
      progressDots: container.querySelectorAll('.quiz-progress-dot'),
    };
  };

  /**
   * Bind event listeners
   */
  const bindEvents = () => {
    // Close button
    if (elements.closeBtn) {
      elements.closeBtn.addEventListener('click', handleClose);
    }

    // Sound preview button
    if (elements.soundBtn) {
      elements.soundBtn.addEventListener('click', handlePreviewSound);
    }

    // Option buttons
    elements.options.forEach((btn) => {
      btn.addEventListener('click', handleOptionClick);
    });

    // Next button
    if (elements.nextBtn) {
      elements.nextBtn.addEventListener('click', handleNext);
    }

    // Keyboard navigation
    container.addEventListener('keydown', handleKeydown);
  };

  /**
   * Handle close button click
   */
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  /**
   * Handle preview sound button click (listen again)
   */
  const handlePreviewSound = async () => {
    if (isSpeaking || !ttsAvailable) {
      return;
    }

    const question = getCurrentQuestion();
    isSpeaking = true;
    updateListenButtonState();

    try {
      await speakDutch(question.correctAnswer, {
        rate: 0.8,
        onEnd: () => {
          isSpeaking = false;
          updateListenButtonState();
        },
        onError: () => {
          isSpeaking = false;
          updateListenButtonState();
        },
      });
    } catch (error) {
      console.error('TTS error:', error);
      isSpeaking = false;
      updateListenButtonState();
    }
  };

  /**
   * Handle option click
   */
  const handleOptionClick = async (event) => {
    if (isAnswered) {
      return;
    }

    const optionBtn = event.currentTarget;
    const selected = optionBtn.dataset.option;
    const question = getCurrentQuestion();
    const isCorrect = selected === question.correctAnswer;

    // Record answer
    isAnswered = true;

    const userAnswer = createUserAnswer(question, selected);
    answers.push(userAnswer);

    // Update UI
    updateOptionsState(selected, question.correctAnswer, isCorrect);
    showFeedback(isCorrect, question, selected);
    updateProgressDot(isCorrect);
    showNextButton();

    // Show points animation for correct answer
    if (isCorrect) {
      showPointsAnimation(optionBtn);
    }

    // Play correct word pronunciation
    if (ttsAvailable) {
      playCorrectPronunciation(question.correctAnswer);
    }
  };

  /**
   * Update options state after answer
   */
  const updateOptionsState = (selected, correct, isCorrect) => {
    elements.options.forEach((btn) => {
      const option = btn.dataset.option;
      btn.disabled = true;

      if (option === selected) {
        if (isCorrect) {
          btn.classList.add('quiz-option--correct');
          btn.querySelector('.icon-check').style.display = 'block';
        } else {
          btn.classList.add('quiz-option--incorrect');
          btn.querySelector('.icon-x').style.display = 'block';
          btn.querySelector('.icon-check').style.display = 'none';
        }
      } else if (option === correct && !isCorrect) {
        // Reveal correct answer when user was wrong
        btn.classList.add('quiz-option--reveal-correct');
        btn.querySelector('.icon-check').style.display = 'block';
      } else {
        btn.classList.add('quiz-option--disabled');
      }
    });
  };

  /**
   * Show feedback message
   * @param {boolean} isCorrect - Whether the answer was correct
   * @param {import('../lib/quizHelpers.js').QuizQuestion} question - The quiz question
   * @param {string} selectedWord - The word the user selected
   */
  const showFeedback = (isCorrect, question, selectedWord) => {
    const feedbackClass = isCorrect ? 'quiz-feedback--correct' : 'quiz-feedback--incorrect';
    const title = isCorrect ? text.correct : text.incorrect;
    const icon = isCorrect
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';

    let explanationHtml = '';
    if (!isCorrect) {
      const explanation = generateFeedbackExplanation(question, selectedWord, language);
      explanationHtml = `
        <div class="quiz-feedback-explanation">
          <p class="quiz-feedback-tip">${explanation}</p>
        </div>
      `;
    }

    const html = `
      <div class="quiz-feedback ${feedbackClass}">
        <span class="quiz-feedback-icon">${icon}</span>
        <span class="quiz-feedback-title">${title}</span>
        ${!isCorrect ? `<span class="quiz-feedback-subtitle">${text.theAnswerWas}</span>` : ''}
        <span class="quiz-feedback-word">${question.correctAnswer}</span>
        <span class="quiz-feedback-tts">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          ${text.playing}
        </span>
        ${explanationHtml}
      </div>
    `;

    elements.feedbackContainer.innerHTML = html;
  };

  /**
   * Update progress dot for current question
   */
  const updateProgressDot = (isCorrect) => {
    const dot = elements.progressDots[currentQuestionIndex];
    if (dot) {
      dot.classList.remove('quiz-progress-dot--current');
      dot.classList.add(
        isCorrect ? 'quiz-progress-dot--correct' : 'quiz-progress-dot--incorrect',
      );
    }
  };

  /**
   * Show next button
   */
  const showNextButton = () => {
    if (elements.nextBtn) {
      elements.nextBtn.classList.remove('quiz-next-btn--hidden');
      elements.nextBtn.disabled = false;
      elements.nextBtn.focus();
    }
  };

  /**
   * Show points animation
   */
  const showPointsAnimation = (optionBtn) => {
    const pointsEl = document.createElement('span');
    pointsEl.className = 'quiz-points-animation';
    pointsEl.textContent = `+${POINTS_PER_CORRECT}`;
    pointsEl.setAttribute('aria-hidden', 'true');

    optionBtn.style.position = 'relative';
    optionBtn.appendChild(pointsEl);

    // Remove after animation
    setTimeout(() => {
      pointsEl.remove();
    }, 800);
  };

  /**
   * Play correct word pronunciation
   */
  const playCorrectPronunciation = async (word) => {
    if (isSpeaking) {
      return;
    }

    isSpeaking = true;

    try {
      await speakDutch(word, {
        rate: 0.85,
        onEnd: () => {
          isSpeaking = false;
        },
        onError: () => {
          isSpeaking = false;
        },
      });
    } catch (error) {
      console.error('TTS error:', error);
      isSpeaking = false;
    }
  };

  /**
   * Handle next button click
   */
  const handleNext = () => {
    currentQuestionIndex++;

    if (currentQuestionIndex >= questions.length) {
      // Quiz complete - show results
      showResults();
    } else {
      // Reset state for next question
      isAnswered = false;
      render();
    }
  };

  /**
   * Handle keyboard navigation
   */
  const handleKeydown = (event) => {
    if (event.key === 'Escape') {
      handleClose();
      return;
    }

    // Number keys 1-4 for quick option selection
    if (!isAnswered && event.key >= '1' && event.key <= '4') {
      const index = parseInt(event.key, 10) - 1;
      if (elements.options[index]) {
        elements.options[index].click();
      }
    }

    // Enter/Space for next when answered
    if (isAnswered && (event.key === 'Enter' || event.key === ' ')) {
      if (document.activeElement !== elements.nextBtn) {
        event.preventDefault();
        handleNext();
      }
    }
  };

  /**
   * Show results screen
   */
  const showResults = () => {
    const result = calculateScore(answers, lesson);

    resultsComponent = createQuizResults({
      result,
      answers,
      language,
      badge: (result.passed && result.percentage === 100) ? {
        name: 'Perfect Score',
        icon: '',
      } : null,
      onContinue: (finalResult) => {
        if (onComplete) {
          onComplete({
            score: finalResult.score,
            passed: finalResult.passed,
            pointsEarned: finalResult.points,
            answers,
          });
        }
      },
      onRetry: () => {
        // Reset and restart quiz
        currentQuestionIndex = 0;
        answers = [];
        isAnswered = false;
        questions = options.questions || generateQuiz(lesson, questionCount);
        render();
      },
      onClose: handleClose,
    });

    resultsComponent.mount(container);
  };

  /**
   * Mount the component to a container
   * @param {HTMLElement} targetContainer - The container element
   */
  const mount = async (targetContainer) => {
    container = targetContainer;
    await init();
    render();
  };

  /**
   * Destroy the component and clean up
   */
  const destroy = () => {
    if (resultsComponent) {
      resultsComponent.destroy();
      resultsComponent = null;
    }
    if (container) {
      container.innerHTML = '';
      container = null;
    }
    elements = {};
    questions = [];
    answers = [];
  };

  /**
   * Get current state
   */
  const getState = () => ({
    currentQuestionIndex,
    totalQuestions: questions.length,
    answers: [...answers],
    isAnswered,
  });

  return {
    mount,
    destroy,
    getState,
  };
}

export default createQuiz;
