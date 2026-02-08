/**
 * Quiz Component Tests
 * Tests for the multi-choice quiz component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock TTS module
vi.mock('../src/lib/tts.js', () => ({
  speakDutch: vi.fn(() => Promise.resolve()),
  isDutchVoiceAvailable: vi.fn(() => Promise.resolve(true)),
}));

// Mock QuizResults component
vi.mock('../src/components/QuizResults.js', () => ({
  createQuizResults: vi.fn(() => ({
    mount: vi.fn(),
    destroy: vi.fn(),
    getResult: vi.fn(),
  })),
}));

// Mock quizHelpers - provide deterministic quiz generation
vi.mock('../src/lib/quizHelpers.js', () => ({
  generateQuiz: vi.fn(() => [
    {
      questionId: 'q1',
      wordId: 'aa-001',
      correctAnswer: 'naam',
      options: ['naam', 'jaar', 'straat', 'maat'],
      sound: 'aa',
      ipa: '[aː]',
      translation: { es: 'nombre', en: 'name' },
      descriptionES: 'Como la a en padre',
      descriptionEN: 'Like a in father',
    },
    {
      questionId: 'q2',
      wordId: 'aa-002',
      correctAnswer: 'jaar',
      options: ['naam', 'jaar', 'straat', 'maat'],
      sound: 'aa',
      ipa: '[aː]',
      translation: { es: 'año', en: 'year' },
      descriptionES: 'Como la a en padre',
      descriptionEN: 'Like a in father',
    },
    {
      questionId: 'q3',
      wordId: 'aa-003',
      correctAnswer: 'straat',
      options: ['naam', 'jaar', 'straat', 'maat'],
      sound: 'aa',
      ipa: '[aː]',
      translation: { es: 'calle', en: 'street' },
      descriptionES: 'Como la a en padre',
      descriptionEN: 'Like a in father',
    },
  ]),
  calculateScore: vi.fn(() => ({
    score: 2,
    total: 3,
    percentage: 67,
    passed: false,
    points: 50,
    breakdown: { correctPoints: 40, completionBonus: 10, masteryBonus: 0 },
  })),
  createUserAnswer: vi.fn((question, selected) => ({
    questionId: question.questionId,
    selectedAnswer: selected,
    correctAnswer: question.correctAnswer,
    isCorrect: selected === question.correctAnswer,
  })),
  generateFeedbackExplanation: vi.fn(() => 'Test explanation text'),
}));

// Import after mocks are set up
import { createQuiz } from '../src/components/Quiz.js';
import { speakDutch, isDutchVoiceAvailable } from '../src/lib/tts.js';
import { createQuizResults } from '../src/components/QuizResults.js';
import { generateQuiz, calculateScore, createUserAnswer, generateFeedbackExplanation } from '../src/lib/quizHelpers.js';

describe('Quiz Component', () => {
  let container;
  let mockLesson;

  beforeEach(() => {
    // Create a fresh container for each test
    container = document.createElement('div');
    document.body.appendChild(container);

    // Mock lesson data
    mockLesson = {
      lessonId: 'P1-AA-BEG',
      phase: 1,
      sound: {
        combination: 'aa',
        ipa: '[aː]',
        descriptionES: 'Como la a en padre',
        descriptionEN: 'Like a in father',
      },
      level: 'beginner',
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
      ],
      quiz: {
        questionCount: 3,
        passingScore: 0.8,
        pointsPerCorrect: 20,
        completionBonus: 10,
        masteryBonus: 25,
      },
      estimatedMinutes: 5,
    };

    // Clear all mocks
    vi.clearAllMocks();

    // Use fake timers for auto-play timeout and animations
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Clean up container
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }

    // Restore real timers
    vi.useRealTimers();
  });

  describe('Mounting & Rendering', () => {
    it('should mount and render quiz to container', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      expect(container.querySelector('.quiz')).not.toBeNull();
    });

    it('should display question counter (P 1/3)', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3, language: 'es' });
      await quiz.mount(container);

      const counter = container.querySelector('.quiz-question-counter');
      expect(counter.textContent).toBe('P 1/3');
    });

    it('should render 4 option buttons per question', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      const options = container.querySelectorAll('.quiz-option');
      expect(options).toHaveLength(4);
    });

    it('should render progress dots matching question count', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      const dots = container.querySelectorAll('.quiz-progress-dot');
      expect(dots).toHaveLength(3);
    });

    it('should have close button', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      const closeBtn = container.querySelector('[data-action="close"]');
      expect(closeBtn).not.toBeNull();
    });
  });

  describe('Answer Selection', () => {
    it('should mark correct answer with quiz-option--correct class', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      // Click correct answer for first question (naam)
      const correctOption = container.querySelector('[data-option="naam"]');
      correctOption.click();

      expect(correctOption.classList.contains('quiz-option--correct')).toBe(true);
    });

    it('should mark incorrect answer with quiz-option--incorrect class and reveal correct', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      // Click incorrect answer for first question (jaar instead of naam)
      const incorrectOption = container.querySelector('[data-option="jaar"]');
      incorrectOption.click();

      expect(incorrectOption.classList.contains('quiz-option--incorrect')).toBe(true);

      // Check that correct answer is revealed
      const correctOption = container.querySelector('[data-option="naam"]');
      expect(correctOption.classList.contains('quiz-option--reveal-correct')).toBe(true);
    });

    it('should show feedback in [data-feedback-container] after answering', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      // Click any answer
      const option = container.querySelector('[data-option="naam"]');
      option.click();

      const feedbackContainer = container.querySelector('[data-feedback-container]');
      expect(feedbackContainer.innerHTML).not.toBe('');
      expect(feedbackContainer.querySelector('.quiz-feedback')).not.toBeNull();
    });

    it('should disable all options after answering', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      // Click an answer
      const option = container.querySelector('[data-option="naam"]');
      option.click();

      // Check all options are disabled
      const options = container.querySelectorAll('.quiz-option');
      options.forEach((opt) => {
        expect(opt.disabled).toBe(true);
      });
    });

    it('should show explanation in feedback for incorrect answer', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      // Click incorrect answer
      const incorrectOption = container.querySelector('[data-option="jaar"]');
      incorrectOption.click();

      const explanation = container.querySelector('.quiz-feedback-explanation');
      expect(explanation).not.toBeNull();
      expect(explanation.querySelector('.quiz-feedback-tip').textContent).toBe('Test explanation text');
    });

    it('should NOT show explanation in feedback for correct answer', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      // Click correct answer
      const correctOption = container.querySelector('[data-option="naam"]');
      correctOption.click();

      const explanation = container.querySelector('.quiz-feedback-explanation');
      expect(explanation).toBeNull();
    });

    it('should show next button after answering', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      // Initially next button should be hidden
      const nextBtn = container.querySelector('[data-action="next"]');
      expect(nextBtn.classList.contains('quiz-next-btn--hidden')).toBe(true);

      // Click an answer
      const option = container.querySelector('[data-option="naam"]');
      option.click();

      // Next button should now be visible
      expect(nextBtn.classList.contains('quiz-next-btn--hidden')).toBe(false);
      expect(nextBtn.disabled).toBe(false);
    });
  });

  describe('Navigation', () => {
    it('should advance to next question on next button click', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      // Verify we start at question 1
      let counter = container.querySelector('.quiz-question-counter');
      expect(counter.textContent).toBe('P 1/3');

      // Answer first question
      const option = container.querySelector('[data-option="naam"]');
      option.click();

      // Click next button
      const nextBtn = container.querySelector('[data-action="next"]');
      nextBtn.click();

      // Verify we're now at question 2
      counter = container.querySelector('.quiz-question-counter');
      expect(counter.textContent).toBe('P 2/3');
    });

    it('should update progress dots after answering', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      const dots = container.querySelectorAll('.quiz-progress-dot');

      // First dot should be current
      expect(dots[0].classList.contains('quiz-progress-dot--current')).toBe(true);

      // Answer correctly
      const correctOption = container.querySelector('[data-option="naam"]');
      correctOption.click();

      // First dot should now be correct
      expect(dots[0].classList.contains('quiz-progress-dot--correct')).toBe(true);
      expect(dots[0].classList.contains('quiz-progress-dot--current')).toBe(false);
    });

    it('should show results after last question (via createQuizResults mock)', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      // Answer all 3 questions
      for (let i = 0; i < 3; i++) {
        const option = container.querySelector('.quiz-option');
        option.click();

        if (i < 2) {
          const nextBtn = container.querySelector('[data-action="next"]');
          nextBtn.click();
        }
      }

      // Click next after last question
      const nextBtn = container.querySelector('[data-action="next"]');
      nextBtn.click();

      // Verify createQuizResults was called
      expect(createQuizResults).toHaveBeenCalled();

      // Verify the results component was mounted
      const mockResultsComponent = createQuizResults.mock.results[0].value;
      expect(mockResultsComponent.mount).toHaveBeenCalledWith(container);
    });

    it('Escape key should call onClose', async () => {
      const onClose = vi.fn();
      const quiz = createQuiz(mockLesson, { questionCount: 3, onClose });
      await quiz.mount(container);

      // Simulate Escape key
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      container.dispatchEvent(event);

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Component API', () => {
    it('should return mount, destroy, getState methods', () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });

      expect(typeof quiz.mount).toBe('function');
      expect(typeof quiz.destroy).toBe('function');
      expect(typeof quiz.getState).toBe('function');
    });

    it('destroy should clear container', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      expect(container.innerHTML).not.toBe('');

      quiz.destroy();

      expect(container.innerHTML).toBe('');
    });

    it('getState should return current question index, answers, isAnswered', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      let state = quiz.getState();
      expect(state.currentQuestionIndex).toBe(0);
      expect(state.totalQuestions).toBe(3);
      expect(state.answers).toEqual([]);
      expect(state.isAnswered).toBe(false);

      // Answer a question
      const option = container.querySelector('[data-option="naam"]');
      option.click();

      state = quiz.getState();
      expect(state.isAnswered).toBe(true);
      expect(state.answers).toHaveLength(1);
    });

    it('should pass correct callbacks to QuizResults on completion', async () => {
      const onComplete = vi.fn();
      const onClose = vi.fn();
      const quiz = createQuiz(mockLesson, {
        questionCount: 3,
        onComplete,
        onClose,
      });
      await quiz.mount(container);

      // Answer all questions and advance to results
      for (let i = 0; i < 3; i++) {
        const option = container.querySelector('.quiz-option');
        option.click();

        const nextBtn = container.querySelector('[data-action="next"]');
        nextBtn.click();
      }

      // Verify createQuizResults was called with correct options
      expect(createQuizResults).toHaveBeenCalledWith(
        expect.objectContaining({
          onContinue: expect.any(Function),
          onRetry: expect.any(Function),
          onClose: expect.any(Function),
        })
      );
    });
  });

  describe('TTS Integration', () => {
    it('should not show TTS warning when TTS is available', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      const warning = container.querySelector('.quiz-tts-warning');
      expect(warning).toBeNull();
    });

    it('should show TTS warning when TTS is unavailable', async () => {
      isDutchVoiceAvailable.mockResolvedValueOnce(false);

      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      const warning = container.querySelector('.quiz-tts-warning');
      expect(warning).not.toBeNull();
    });

    it('should check TTS availability on mount', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      expect(isDutchVoiceAvailable).toHaveBeenCalled();
    });

    it('should auto-play word after mount with 300ms delay', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      // Initially speakDutch should not be called
      expect(speakDutch).not.toHaveBeenCalled();

      // Advance timers by 300ms for auto-play
      vi.advanceTimersByTime(300);
      await Promise.resolve();

      // Now speakDutch should have been called with correct answer
      expect(speakDutch).toHaveBeenCalledWith(
        'naam',
        expect.objectContaining({ rate: 0.8 })
      );
    });

    it('should render listen button when TTS is available', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      const listenBtn = container.querySelector('[data-action="preview-sound"]');
      expect(listenBtn).not.toBeNull();
    });

    it('should play pronunciation when listen button is clicked', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      vi.clearAllMocks();

      const listenBtn = container.querySelector('[data-action="preview-sound"]');
      listenBtn.click();

      expect(speakDutch).toHaveBeenCalledWith(
        'naam',
        expect.objectContaining({ rate: 0.8 })
      );
    });
  });

  describe('Keyboard Navigation', () => {
    it('should select option when number key 1-4 is pressed', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      // Press '1' to select first option
      const event = new KeyboardEvent('keydown', { key: '1' });
      container.dispatchEvent(event);

      // First option should be selected
      const firstOption = container.querySelectorAll('.quiz-option')[0];
      expect(firstOption.disabled).toBe(true);
    });

    it('should not respond to number keys after answering', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      // Answer first question
      const option = container.querySelector('[data-option="naam"]');
      option.click();

      const state = quiz.getState();
      const answerCountBefore = state.answers.length;

      // Try to press another number key
      const event = new KeyboardEvent('keydown', { key: '2' });
      container.dispatchEvent(event);

      const stateAfter = quiz.getState();
      expect(stateAfter.answers.length).toBe(answerCountBefore);
    });
  });

  describe('Language Support', () => {
    it('should render Spanish text by default', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      const counter = container.querySelector('.quiz-question-counter');
      expect(counter.textContent).toContain('P');

      const instruction = container.querySelector('.quiz-instruction-text');
      expect(instruction.textContent).toBe('Escucha la palabra y selecciona la correcta');
    });

    it('should render English text when language is en', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3, language: 'en' });
      await quiz.mount(container);

      const counter = container.querySelector('.quiz-question-counter');
      expect(counter.textContent).toContain('Q');

      const instruction = container.querySelector('.quiz-instruction-text');
      expect(instruction.textContent).toBe('Listen to the word and select the correct one');
    });
  });

  describe('Progress Tracking', () => {
    it('should track correct and incorrect answers', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      // Answer first question correctly
      let correctOption = container.querySelector('[data-option="naam"]');
      correctOption.click();

      let state = quiz.getState();
      expect(state.answers).toHaveLength(1);
      expect(createUserAnswer).toHaveBeenCalledWith(
        expect.objectContaining({ correctAnswer: 'naam' }),
        'naam'
      );

      // Move to next question
      let nextBtn = container.querySelector('[data-action="next"]');
      nextBtn.click();

      // Answer second question incorrectly
      const incorrectOption = container.querySelector('[data-option="naam"]');
      incorrectOption.click();

      state = quiz.getState();
      expect(state.answers).toHaveLength(2);
    });

    it('should show correct progress dot states', async () => {
      const quiz = createQuiz(mockLesson, { questionCount: 3 });
      await quiz.mount(container);

      let dots = container.querySelectorAll('.quiz-progress-dot');

      // Initial state: first dot current, rest neutral
      expect(dots[0].classList.contains('quiz-progress-dot--current')).toBe(true);
      expect(dots[1].classList.contains('quiz-progress-dot--current')).toBe(false);

      // Answer correctly
      const correctOption = container.querySelector('[data-option="naam"]');
      correctOption.click();

      // First dot should be correct
      expect(dots[0].classList.contains('quiz-progress-dot--correct')).toBe(true);

      // Move to next question
      const nextBtn = container.querySelector('[data-action="next"]');
      nextBtn.click();

      dots = container.querySelectorAll('.quiz-progress-dot');

      // Second dot should now be current
      expect(dots[1].classList.contains('quiz-progress-dot--current')).toBe(true);

      // Answer incorrectly
      const incorrectOption = container.querySelector('[data-option="naam"]');
      incorrectOption.click();

      // Second dot should be incorrect
      expect(dots[1].classList.contains('quiz-progress-dot--incorrect')).toBe(true);
    });
  });
});
