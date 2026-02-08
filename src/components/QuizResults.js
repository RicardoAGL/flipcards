/**
 * QuizResults Component
 * Displays quiz completion results, score, and points earned
 *
 * Features:
 * - Score display with percentage
 * - Points breakdown
 * - Pass/fail messaging
 * - Badge unlock animation (when applicable)
 * - Action buttons for retry or continue
 */

import './QuizResults.css';

/**
 * Text content for different languages
 */
const TEXT = {
  es: {
    title: 'Quiz Completado!',
    passed: {
      perfect: { icon: '⭐', message: 'Perfecto!' },
      great: { icon: '🎉', message: 'Muy bien!' },
    },
    failed: { icon: '💪', message: 'Casi lo logras!' },
    passMessage: 'Has aprobado el quiz',
    failMessage: 'Necesitas 80% para aprobar',
    pointsTitle: 'Puntos Ganados',
    correctAnswers: 'Respuestas correctas',
    completionBonus: 'Bonus de completar',
    masteryBonus: 'Bonus de maestría',
    total: 'Total',
    badgeUnlocked: 'Insignia Desbloqueada!',
    continue: 'Continuar',
    tryAgain: 'Intentar de Nuevo',
    practiceMore: 'Practicar Mas',
  },
  en: {
    title: 'Quiz Complete!',
    passed: {
      perfect: { icon: '⭐', message: 'Perfect!' },
      great: { icon: '🎉', message: 'Great Job!' },
    },
    failed: { icon: '💪', message: 'Almost There!' },
    passMessage: 'You passed the quiz',
    failMessage: 'You need 80% to pass',
    pointsTitle: 'Points Earned',
    correctAnswers: 'Correct answers',
    completionBonus: 'Completion bonus',
    masteryBonus: 'Mastery bonus',
    total: 'Total',
    badgeUnlocked: 'Badge Unlocked!',
    continue: 'Continue',
    tryAgain: 'Try Again',
    practiceMore: 'Practice More',
  },
};

/**
 * Create the QuizResults component
 * @param {Object} options - Configuration options
 * @param {import('../lib/quizHelpers.js').QuizResult} options.result - Quiz result data
 * @param {import('../lib/quizHelpers.js').UserAnswer[]} options.answers - Array of user answers
 * @param {string} [options.language] - Display language ('es' or 'en')
 * @param {{ name: string, icon: string }} [options.badge] - Badge data if one was unlocked
 * @param {Function} [options.onContinue] - Callback when continue is clicked
 * @param {Function} [options.onRetry] - Callback when retry is clicked
 * @param {Function} [options.onClose] - Callback when close is clicked
 * @returns {{ mount: (targetContainer: HTMLElement) => void, destroy: () => void, getResult: () => any }} Component API with mount and destroy methods
 */
export function createQuizResults(options) {
  const {
    result,
    answers,
    language = 'es',
    badge = null,
    onContinue,
    onRetry,
    onClose,
  } = options;

  const text = TEXT[/** @type {'es' | 'en'} */ (language)] || TEXT.es;
  /** @type {HTMLElement | null} */
  let container = null;

  /**
   * Get celebration data based on result
   */
  const getCelebration = () => {
    if (result.passed) {
      if (result.percentage === 100) {
        return text.passed.perfect;
      }
      return text.passed.great;
    }
    return text.failed;
  };

  /**
   * Generate score dots HTML
   */
  const generateScoreDots = () => {
    return answers
      .map((answer, index) => {
        const stateClass = answer.isCorrect
          ? 'quiz-results-dot--correct'
          : 'quiz-results-dot--incorrect';
        return `<span
          class="quiz-results-dot ${stateClass}"
          role="img"
          aria-label="${answer.isCorrect ? 'Correct' : 'Incorrect'} answer ${index + 1}"
        ></span>`;
      })
      .join('');
  };

  /**
   * Render the component
   */
  const render = () => {
    const celebration = getCelebration();
    const scoreCardClass = result.passed
      ? 'quiz-results-score-card--passed'
      : 'quiz-results-score-card--failed';

    const html = `
      <div class="quiz-results" role="region" aria-label="Quiz Results">
        <!-- Header -->
        <header class="quiz-results-header">
          <button
            class="quiz-results-close-btn"
            type="button"
            aria-label="Close results"
            data-action="close"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h1 class="quiz-results-title">${text.title}</h1>
          <span class="quiz-results-points" aria-label="Total points">${result.points}+</span>
        </header>

        <!-- Celebration -->
        <div class="quiz-results-celebration" aria-live="polite">
          <span class="quiz-results-icon" aria-hidden="true">${celebration.icon}</span>
          <h2 class="quiz-results-message">${celebration.message}</h2>
        </div>

        <!-- Score Card -->
        <div class="quiz-results-score-card ${scoreCardClass}">
          <div class="quiz-results-score" aria-label="Score: ${result.score} out of ${result.total}">
            ${result.score}/${result.total}
          </div>
          <div class="quiz-results-percentage">${result.percentage}%</div>

          <div class="quiz-results-dots" aria-hidden="true">
            ${generateScoreDots()}
          </div>

          <p class="quiz-results-pass-message">
            ${result.passed ? text.passMessage : text.failMessage}
          </p>
        </div>

        <!-- Points Breakdown -->
        <div class="quiz-results-breakdown">
          <h3 class="quiz-results-breakdown-title">${text.pointsTitle}</h3>

          <div class="quiz-results-breakdown-row">
            <span class="quiz-results-breakdown-label">${text.correctAnswers}:</span>
            <span class="quiz-results-breakdown-value">+${result.breakdown.correctPoints}</span>
          </div>

          <div class="quiz-results-breakdown-row">
            <span class="quiz-results-breakdown-label">${text.completionBonus}:</span>
            <span class="quiz-results-breakdown-value quiz-results-breakdown-value--bonus">+${result.breakdown.completionBonus}</span>
          </div>

          ${result.breakdown.masteryBonus > 0 ? `
          <div class="quiz-results-breakdown-row">
            <span class="quiz-results-breakdown-label">${text.masteryBonus}:</span>
            <span class="quiz-results-breakdown-value quiz-results-breakdown-value--bonus">+${result.breakdown.masteryBonus}</span>
          </div>
          ` : ''}

          <div class="quiz-results-breakdown-divider"></div>

          <div class="quiz-results-breakdown-total">
            <span class="quiz-results-breakdown-total-label">${text.total}:</span>
            <span class="quiz-results-breakdown-total-value">+${result.points}</span>
          </div>
        </div>

        ${badge ? `
        <!-- Badge Unlock -->
        <div class="quiz-results-badge" role="alert" aria-label="Badge unlocked">
          <span class="quiz-results-badge-icon" aria-hidden="true">${badge.icon}</span>
          <p class="quiz-results-badge-title">${text.badgeUnlocked}</p>
          <p class="quiz-results-badge-name">${badge.name}</p>
        </div>
        ` : ''}

        <!-- Action Buttons -->
        <div class="quiz-results-actions">
          ${result.passed ? `
          <button
            class="quiz-results-btn quiz-results-btn--primary"
            type="button"
            data-action="continue"
          >
            ${text.continue}
          </button>
          <button
            class="quiz-results-btn quiz-results-btn--ghost"
            type="button"
            data-action="retry"
          >
            ${text.practiceMore}
          </button>
          ` : `
          <button
            class="quiz-results-btn quiz-results-btn--primary"
            type="button"
            data-action="retry"
          >
            ${text.tryAgain}
          </button>
          <button
            class="quiz-results-btn quiz-results-btn--ghost"
            type="button"
            data-action="continue"
          >
            ${text.practiceMore}
          </button>
          `}
        </div>
      </div>
    `;

    /** @type {HTMLElement} */ (container).innerHTML = html;
    bindEvents();
  };

  /**
   * Bind event listeners
   */
  const bindEvents = () => {
    const c = /** @type {HTMLElement} */ (container);
    const closeBtn = c.querySelector('[data-action="close"]');
    const continueBtn = c.querySelector('[data-action="continue"]');
    const retryBtn = c.querySelector('[data-action="retry"]');

    if (closeBtn) {
      closeBtn.addEventListener('click', handleClose);
    }

    if (continueBtn) {
      continueBtn.addEventListener('click', handleContinue);
    }

    if (retryBtn) {
      retryBtn.addEventListener('click', handleRetry);
    }

    // Keyboard navigation
    /** @type {HTMLElement} */ (container).addEventListener('keydown', handleKeydown);
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
   * Handle continue button click
   */
  const handleContinue = () => {
    if (onContinue) {
      onContinue(result);
    }
  };

  /**
   * Handle retry button click
   */
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  /**
   * Handle keyboard navigation
   */
  /** @param {KeyboardEvent} event */
  const handleKeydown = (event) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };

  /**
   * Mount the component to a container
   * @param {HTMLElement} targetContainer - The container element
   */
  const mount = (targetContainer) => {
    container = targetContainer;
    render();

    // Focus management for accessibility
    const firstButton = /** @type {HTMLElement | null} */ (container.querySelector('.quiz-results-btn--primary'));
    if (firstButton) {
      setTimeout(() => firstButton.focus(), 100);
    }
  };

  /**
   * Destroy the component and clean up
   */
  const destroy = () => {
    if (container) {
      container.innerHTML = '';
      container = null;
    }
  };

  /**
   * Get the result data
   */
  const getResult = () => result;

  return {
    mount,
    destroy,
    getResult,
  };
}

export default createQuizResults;
