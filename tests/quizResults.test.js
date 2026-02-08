/**
 * QuizResults Component Tests
 * Tests for the quiz results display component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createQuizResults } from '../src/components/QuizResults.js';

// Mock CSS import
vi.mock('../src/components/QuizResults.css', () => ({}));

/**
 * querySelector shorthand that returns HTMLElement (non-null assertion for tests)
 * @param {HTMLElement} el
 * @param {string} selector
 * @returns {HTMLElement}
 */
const qs = (el, selector) => /** @type {HTMLElement} */ (el.querySelector(selector));

describe('QuizResults Component', () => {
  /** @type {HTMLElement} */
  let container;

  beforeEach(() => {
    // Create a fresh container for each test
    container = document.createElement('div');
    document.body.appendChild(container);

    // Clear mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up container
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('Passed Result Rendering', () => {
    const passedResult = {
      score: 4,
      total: 5,
      percentage: 80,
      passed: true,
      points: 90,
      breakdown: { correctPoints: 80, completionBonus: 10, masteryBonus: 0 },
    };
    const passedAnswers = [
      {
        questionId: 'q1',
        selectedAnswer: 'naam',
        correctAnswer: 'naam',
        isCorrect: true,
      },
      {
        questionId: 'q2',
        selectedAnswer: 'jaar',
        correctAnswer: 'jaar',
        isCorrect: true,
      },
      {
        questionId: 'q3',
        selectedAnswer: 'wrong',
        correctAnswer: 'straat',
        isCorrect: false,
      },
      {
        questionId: 'q4',
        selectedAnswer: 'maat',
        correctAnswer: 'maat',
        isCorrect: true,
      },
      {
        questionId: 'q5',
        selectedAnswer: 'paar',
        correctAnswer: 'paar',
        isCorrect: true,
      },
    ];

    it('should render "Muy bien!" message for passed result (non-perfect)', () => {
      const quizResults = createQuizResults({
        result: passedResult,
        answers: passedAnswers,
      });
      quizResults.mount(container);

      const message = qs(container, '.quiz-results-message');
      expect(message.textContent).toBe('Muy bien!');

      const icon = qs(container, '.quiz-results-icon');
      expect(icon.textContent).toBe('🎉');
    });

    it('should render score as "4/5" and "80%"', () => {
      const quizResults = createQuizResults({
        result: passedResult,
        answers: passedAnswers,
      });
      quizResults.mount(container);

      const score = qs(container, '.quiz-results-score');
      expect(score.textContent.trim()).toBe('4/5');

      const percentage = qs(container, '.quiz-results-percentage');
      expect(percentage.textContent).toBe('80%');
    });

    it('should show "Continue" as primary button when passed', () => {
      const quizResults = createQuizResults({
        result: passedResult,
        answers: passedAnswers,
      });
      quizResults.mount(container);

      const primaryBtn = qs(container, '.quiz-results-btn--primary[data-action="continue"]');
      expect(primaryBtn).not.toBeNull();
      expect(primaryBtn.textContent.trim()).toBe('Continuar');

      const ghostBtn = qs(container, '.quiz-results-btn--ghost[data-action="retry"]');
      expect(ghostBtn).not.toBeNull();
      expect(ghostBtn.textContent.trim()).toBe('Practicar Mas');
    });

    it('should show points breakdown with correct values', () => {
      const quizResults = createQuizResults({
        result: passedResult,
        answers: passedAnswers,
      });
      quizResults.mount(container);

      const breakdownValues = Array.from(
        container.querySelectorAll('.quiz-results-breakdown-value')
      ).map((el) => el.textContent);

      expect(breakdownValues).toContain('+80');
      expect(breakdownValues).toContain('+10');

      const totalValue = qs(container, '.quiz-results-breakdown-total-value');
      expect(totalValue.textContent).toBe('+90');
    });
  });

  describe('Perfect Result Rendering', () => {
    const perfectResult = {
      score: 5,
      total: 5,
      percentage: 100,
      passed: true,
      points: 135,
      breakdown: { correctPoints: 100, completionBonus: 10, masteryBonus: 25 },
    };
    const perfectAnswers = [
      {
        questionId: 'q1',
        selectedAnswer: 'naam',
        correctAnswer: 'naam',
        isCorrect: true,
      },
      {
        questionId: 'q2',
        selectedAnswer: 'jaar',
        correctAnswer: 'jaar',
        isCorrect: true,
      },
      {
        questionId: 'q3',
        selectedAnswer: 'straat',
        correctAnswer: 'straat',
        isCorrect: true,
      },
      {
        questionId: 'q4',
        selectedAnswer: 'maat',
        correctAnswer: 'maat',
        isCorrect: true,
      },
      {
        questionId: 'q5',
        selectedAnswer: 'paar',
        correctAnswer: 'paar',
        isCorrect: true,
      },
    ];

    it('should render "Perfecto!" for 100% score', () => {
      const quizResults = createQuizResults({
        result: perfectResult,
        answers: perfectAnswers,
      });
      quizResults.mount(container);

      const message = qs(container, '.quiz-results-message');
      expect(message.textContent).toBe('Perfecto!');

      const icon = qs(container, '.quiz-results-icon');
      expect(icon.textContent).toBe('⭐');
    });

    it('should show mastery bonus in breakdown', () => {
      const quizResults = createQuizResults({
        result: perfectResult,
        answers: perfectAnswers,
      });
      quizResults.mount(container);

      const breakdownValues = Array.from(
        container.querySelectorAll('.quiz-results-breakdown-value')
      ).map((el) => el.textContent);

      expect(breakdownValues).toContain('+100');
      expect(breakdownValues).toContain('+10');
      expect(breakdownValues).toContain('+25');

      const totalValue = qs(container, '.quiz-results-breakdown-total-value');
      expect(totalValue.textContent).toBe('+135');
    });
  });

  describe('Failed Result Rendering', () => {
    const failedResult = {
      score: 2,
      total: 5,
      percentage: 40,
      passed: false,
      points: 50,
      breakdown: { correctPoints: 40, completionBonus: 10, masteryBonus: 0 },
    };
    const failedAnswers = [
      {
        questionId: 'q1',
        selectedAnswer: 'naam',
        correctAnswer: 'naam',
        isCorrect: true,
      },
      {
        questionId: 'q2',
        selectedAnswer: 'wrong',
        correctAnswer: 'jaar',
        isCorrect: false,
      },
      {
        questionId: 'q3',
        selectedAnswer: 'wrong',
        correctAnswer: 'straat',
        isCorrect: false,
      },
      {
        questionId: 'q4',
        selectedAnswer: 'maat',
        correctAnswer: 'maat',
        isCorrect: true,
      },
      {
        questionId: 'q5',
        selectedAnswer: 'wrong',
        correctAnswer: 'paar',
        isCorrect: false,
      },
    ];

    it('should render "Casi lo logras!" for failed result', () => {
      const quizResults = createQuizResults({
        result: failedResult,
        answers: failedAnswers,
      });
      quizResults.mount(container);

      const message = qs(container, '.quiz-results-message');
      expect(message.textContent).toBe('Casi lo logras!');

      const icon = qs(container, '.quiz-results-icon');
      expect(icon.textContent).toBe('💪');
    });

    it('should show "Try Again" as primary button when failed', () => {
      const quizResults = createQuizResults({
        result: failedResult,
        answers: failedAnswers,
      });
      quizResults.mount(container);

      const primaryBtn = qs(container, '.quiz-results-btn--primary[data-action="retry"]');
      expect(primaryBtn).not.toBeNull();
      expect(primaryBtn.textContent.trim()).toBe('Intentar de Nuevo');

      const ghostBtn = qs(container, '.quiz-results-btn--ghost[data-action="continue"]');
      expect(ghostBtn).not.toBeNull();
      expect(ghostBtn.textContent.trim()).toBe('Practicar Mas');
    });

    it('should show fail message "Necesitas 80% para aprobar"', () => {
      const quizResults = createQuizResults({
        result: failedResult,
        answers: failedAnswers,
      });
      quizResults.mount(container);

      const passMessage = qs(container, '.quiz-results-pass-message');
      expect(passMessage.textContent.trim()).toBe('Necesitas 80% para aprobar');
    });
  });

  describe('Badge Display', () => {
    const resultWithBadge = {
      score: 5,
      total: 5,
      percentage: 100,
      passed: true,
      points: 135,
      breakdown: { correctPoints: 100, completionBonus: 10, masteryBonus: 25 },
    };
    const answers = [
      {
        questionId: 'q1',
        selectedAnswer: 'naam',
        correctAnswer: 'naam',
        isCorrect: true,
      },
      {
        questionId: 'q2',
        selectedAnswer: 'jaar',
        correctAnswer: 'jaar',
        isCorrect: true,
      },
      {
        questionId: 'q3',
        selectedAnswer: 'straat',
        correctAnswer: 'straat',
        isCorrect: true,
      },
      {
        questionId: 'q4',
        selectedAnswer: 'maat',
        correctAnswer: 'maat',
        isCorrect: true,
      },
      {
        questionId: 'q5',
        selectedAnswer: 'paar',
        correctAnswer: 'paar',
        isCorrect: true,
      },
    ];

    it('should render badge section when badge is provided', () => {
      const badge = {
        name: 'AA Master',
        icon: '🏆',
      };

      const quizResults = createQuizResults({
        result: resultWithBadge,
        answers,
        badge,
      });
      quizResults.mount(container);

      const badgeSection = container.querySelector('.quiz-results-badge');
      expect(badgeSection).not.toBeNull();

      const badgeName = qs(container, '.quiz-results-badge-name');
      expect(badgeName.textContent).toBe('AA Master');

      const badgeIcon = qs(container, '.quiz-results-badge-icon');
      expect(badgeIcon.textContent).toBe('🏆');

      const badgeTitle = qs(container, '.quiz-results-badge-title');
      expect(badgeTitle.textContent).toBe('Insignia Desbloqueada!');
    });

    it('should NOT render badge section when badge is null', () => {
      const quizResults = createQuizResults({
        result: resultWithBadge,
        answers,
        badge: /** @type {any} */ (null),
      });
      quizResults.mount(container);

      const badgeSection = container.querySelector('.quiz-results-badge');
      expect(badgeSection).toBeNull();
    });
  });

  describe('Action Callbacks', () => {
    const testResult = {
      score: 4,
      total: 5,
      percentage: 80,
      passed: true,
      points: 90,
      breakdown: { correctPoints: 80, completionBonus: 10, masteryBonus: 0 },
    };
    const testAnswers = [
      {
        questionId: 'q1',
        selectedAnswer: 'naam',
        correctAnswer: 'naam',
        isCorrect: true,
      },
      {
        questionId: 'q2',
        selectedAnswer: 'jaar',
        correctAnswer: 'jaar',
        isCorrect: true,
      },
      {
        questionId: 'q3',
        selectedAnswer: 'wrong',
        correctAnswer: 'straat',
        isCorrect: false,
      },
      {
        questionId: 'q4',
        selectedAnswer: 'maat',
        correctAnswer: 'maat',
        isCorrect: true,
      },
      {
        questionId: 'q5',
        selectedAnswer: 'paar',
        correctAnswer: 'paar',
        isCorrect: true,
      },
    ];

    it('should call onContinue with result when continue button is clicked', () => {
      const onContinue = vi.fn();

      const quizResults = createQuizResults({
        result: testResult,
        answers: testAnswers,
        onContinue,
      });
      quizResults.mount(container);

      const continueBtn = qs(container, '[data-action="continue"]');
      continueBtn.click();

      expect(onContinue).toHaveBeenCalledWith(testResult);
    });

    it('should call onRetry when retry button is clicked', () => {
      const onRetry = vi.fn();

      const quizResults = createQuizResults({
        result: testResult,
        answers: testAnswers,
        onRetry,
      });
      quizResults.mount(container);

      const retryBtn = qs(container, '[data-action="retry"]');
      retryBtn.click();

      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when close button clicked or Escape pressed', () => {
      const onClose = vi.fn();

      const quizResults = createQuizResults({
        result: testResult,
        answers: testAnswers,
        onClose,
      });
      quizResults.mount(container);

      // Test close button click
      const closeBtn = qs(container, '[data-action="close"]');
      closeBtn.click();

      expect(onClose).toHaveBeenCalledTimes(1);

      // Test Escape key
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      container.dispatchEvent(escapeEvent);

      expect(onClose).toHaveBeenCalledTimes(2);
    });
  });

  describe('Component API', () => {
    const testResult = {
      score: 4,
      total: 5,
      percentage: 80,
      passed: true,
      points: 90,
      breakdown: { correctPoints: 80, completionBonus: 10, masteryBonus: 0 },
    };
    const testAnswers = [
      {
        questionId: 'q1',
        selectedAnswer: 'naam',
        correctAnswer: 'naam',
        isCorrect: true,
      },
      {
        questionId: 'q2',
        selectedAnswer: 'jaar',
        correctAnswer: 'jaar',
        isCorrect: true,
      },
      {
        questionId: 'q3',
        selectedAnswer: 'wrong',
        correctAnswer: 'straat',
        isCorrect: false,
      },
      {
        questionId: 'q4',
        selectedAnswer: 'maat',
        correctAnswer: 'maat',
        isCorrect: true,
      },
      {
        questionId: 'q5',
        selectedAnswer: 'paar',
        correctAnswer: 'paar',
        isCorrect: true,
      },
    ];

    it('should destroy and clear container innerHTML', () => {
      const quizResults = createQuizResults({
        result: testResult,
        answers: testAnswers,
      });
      quizResults.mount(container);

      expect(container.innerHTML).not.toBe('');

      quizResults.destroy();

      expect(container.innerHTML).toBe('');
    });
  });

  describe('Language Support', () => {
    const testResult = {
      score: 4,
      total: 5,
      percentage: 80,
      passed: true,
      points: 90,
      breakdown: { correctPoints: 80, completionBonus: 10, masteryBonus: 0 },
    };
    const testAnswers = [
      {
        questionId: 'q1',
        selectedAnswer: 'naam',
        correctAnswer: 'naam',
        isCorrect: true,
      },
      {
        questionId: 'q2',
        selectedAnswer: 'jaar',
        correctAnswer: 'jaar',
        isCorrect: true,
      },
      {
        questionId: 'q3',
        selectedAnswer: 'wrong',
        correctAnswer: 'straat',
        isCorrect: false,
      },
      {
        questionId: 'q4',
        selectedAnswer: 'maat',
        correctAnswer: 'maat',
        isCorrect: true,
      },
      {
        questionId: 'q5',
        selectedAnswer: 'paar',
        correctAnswer: 'paar',
        isCorrect: true,
      },
    ];

    it('should render Spanish text by default', () => {
      const quizResults = createQuizResults({
        result: testResult,
        answers: testAnswers,
      });
      quizResults.mount(container);

      const title = qs(container, '.quiz-results-title');
      expect(title.textContent).toBe('Quiz Completado!');

      const message = qs(container, '.quiz-results-message');
      expect(message.textContent).toBe('Muy bien!');
    });

    it('should render English text when language is en', () => {
      const quizResults = createQuizResults({
        result: testResult,
        answers: testAnswers,
        language: 'en',
      });
      quizResults.mount(container);

      const title = qs(container, '.quiz-results-title');
      expect(title.textContent).toBe('Quiz Complete!');

      const message = qs(container, '.quiz-results-message');
      expect(message.textContent).toBe('Great Job!');
    });

    it('should render English badge text when language is en', () => {
      const badge = {
        name: 'AA Master',
        icon: '🏆',
      };

      const quizResults = createQuizResults({
        result: testResult,
        answers: testAnswers,
        language: 'en',
        badge,
      });
      quizResults.mount(container);

      const badgeTitle = qs(container, '.quiz-results-badge-title');
      expect(badgeTitle.textContent).toBe('Badge Unlocked!');
    });
  });

  describe('Additional API Tests', () => {
    const testResult = {
      score: 4,
      total: 5,
      percentage: 80,
      passed: true,
      points: 90,
      breakdown: { correctPoints: 80, completionBonus: 10, masteryBonus: 0 },
    };
    const testAnswers = [
      {
        questionId: 'q1',
        selectedAnswer: 'naam',
        correctAnswer: 'naam',
        isCorrect: true,
      },
      {
        questionId: 'q2',
        selectedAnswer: 'jaar',
        correctAnswer: 'jaar',
        isCorrect: true,
      },
      {
        questionId: 'q3',
        selectedAnswer: 'wrong',
        correctAnswer: 'straat',
        isCorrect: false,
      },
      {
        questionId: 'q4',
        selectedAnswer: 'maat',
        correctAnswer: 'maat',
        isCorrect: true,
      },
      {
        questionId: 'q5',
        selectedAnswer: 'paar',
        correctAnswer: 'paar',
        isCorrect: true,
      },
    ];

    it('should return destroy method', () => {
      const quizResults = createQuizResults({
        result: testResult,
        answers: testAnswers,
      });

      expect(typeof quizResults.destroy).toBe('function');
    });

    it('should return mount method', () => {
      const quizResults = createQuizResults({
        result: testResult,
        answers: testAnswers,
      });

      expect(typeof quizResults.mount).toBe('function');
    });

    it('should return getResult method', () => {
      const quizResults = createQuizResults({
        result: testResult,
        answers: testAnswers,
      });

      expect(typeof quizResults.getResult).toBe('function');
    });

    it('should return correct result from getResult', () => {
      const quizResults = createQuizResults({
        result: testResult,
        answers: testAnswers,
      });

      const returnedResult = quizResults.getResult();
      expect(returnedResult).toEqual(testResult);
    });
  });
});
