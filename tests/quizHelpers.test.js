/**
 * Quiz Helpers Tests
 * Tests for quiz generation, scoring, and feedback utilities
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getDistractors,
  generateQuiz,
  calculateScore,
  createUserAnswer,
  getQuizFeedback,
  getPassingScore,
  getMaxPoints,
  validateAnswer,
} from '../src/lib/quizHelpers.js';
import { createMockLesson } from './setup.js';

describe('Quiz Helpers', () => {
  let mockLesson;

  beforeEach(() => {
    mockLesson = createMockLesson();
  });

  // ==========================================
  // getDistractors
  // ==========================================
  describe('getDistractors', () => {
    it('should return the requested number of distractors', () => {
      const word = mockLesson.words[0];
      const distractors = getDistractors(word, mockLesson, 3);

      expect(distractors).toHaveLength(3);
    });

    it('should not include the target word in distractors', () => {
      const word = mockLesson.words[0];
      const distractors = getDistractors(word, mockLesson, 3);

      expect(distractors).not.toContain(word.word);
    });

    it('should return unique distractors', () => {
      const word = mockLesson.words[0];
      const distractors = getDistractors(word, mockLesson, 3);
      const unique = new Set(distractors);

      expect(unique.size).toBe(distractors.length);
    });

    it('should return strings', () => {
      const word = mockLesson.words[0];
      const distractors = getDistractors(word, mockLesson, 3);

      distractors.forEach(d => {
        expect(typeof d).toBe('string');
      });
    });

    it('should use distractor pool when available', () => {
      const lessonWithPool = createMockLesson({
        distractorPool: ['kaas', 'huis', 'fiets', 'boom'],
      });
      const word = lessonWithPool.words[0];
      const distractors = getDistractors(word, lessonWithPool, 3);

      expect(distractors).toHaveLength(3);
    });

    it('should use lesson words as priority 2 distractors', () => {
      const word = mockLesson.words[0]; // 'naam'
      const distractors = getDistractors(word, mockLesson, 3);

      // Other words in the lesson should be candidates
      const lessonWordSet = new Set(mockLesson.words.map(w => w.word));
      const fromLesson = distractors.filter(d => lessonWordSet.has(d));
      expect(fromLesson.length).toBeGreaterThan(0);
    });

    it('should return fewer distractors when not enough candidates', () => {
      const tinyLesson = createMockLesson({
        words: [
          { wordId: 'aa-001', word: 'naam', prefix: 'n', suffix: 'm', translation: { es: 'nombre', en: 'name' }, syllables: 1 },
          { wordId: 'aa-002', word: 'jaar', prefix: 'j', suffix: 'r', translation: { es: 'año', en: 'year' }, syllables: 1 },
        ],
      });
      const word = tinyLesson.words[0];
      const distractors = getDistractors(word, tinyLesson, 3);

      // Should get at least 1 from the lesson (jaar), rest from other sources
      expect(distractors.length).toBeGreaterThanOrEqual(1);
    });

    it('should default to 3 distractors', () => {
      const word = mockLesson.words[0];
      const distractors = getDistractors(word, mockLesson);

      expect(distractors).toHaveLength(3);
    });
  });

  // ==========================================
  // generateQuiz
  // ==========================================
  describe('generateQuiz', () => {
    it('should generate the specified number of questions', () => {
      const questions = generateQuiz(mockLesson, 3);

      expect(questions).toHaveLength(3);
    });

    it('should use lesson config question count when not specified', () => {
      const questions = generateQuiz(mockLesson);

      expect(questions).toHaveLength(mockLesson.quiz.questionCount);
    });

    it('should include required fields in each question', () => {
      const questions = generateQuiz(mockLesson, 3);

      questions.forEach(q => {
        expect(q).toHaveProperty('questionId');
        expect(q).toHaveProperty('wordId');
        expect(q).toHaveProperty('correctAnswer');
        expect(q).toHaveProperty('options');
        expect(q).toHaveProperty('sound');
        expect(q).toHaveProperty('ipa');
      });
    });

    it('should have 4 options per question (1 correct + 3 distractors)', () => {
      const questions = generateQuiz(mockLesson, 3);

      questions.forEach(q => {
        expect(q.options).toHaveLength(4);
      });
    });

    it('should include the correct answer in options', () => {
      const questions = generateQuiz(mockLesson, 3);

      questions.forEach(q => {
        expect(q.options).toContain(q.correctAnswer);
      });
    });

    it('should use the lesson sound info', () => {
      const questions = generateQuiz(mockLesson, 3);

      questions.forEach(q => {
        expect(q.sound).toBe(mockLesson.sound.combination);
        expect(q.ipa).toBe(mockLesson.sound.ipa);
      });
    });

    it('should filter out standalone sound entries', () => {
      const lessonWithStandalone = createMockLesson({
        words: [
          ...mockLesson.words,
          { wordId: 'aa-solo', word: 'aa', prefix: '', suffix: '', translation: { es: 'aa', en: 'aa' }, syllables: 1 },
        ],
      });

      const questions = generateQuiz(lessonWithStandalone, 5);
      const questionWords = questions.map(q => q.correctAnswer);

      expect(questionWords).not.toContain('aa');
    });

    it('should generate unique question IDs', () => {
      const questions = generateQuiz(mockLesson, 5);
      const ids = questions.map(q => q.questionId);
      const unique = new Set(ids);

      expect(unique.size).toBe(ids.length);
    });

    it('should include translation in questions', () => {
      const questions = generateQuiz(mockLesson, 3);

      questions.forEach(q => {
        expect(q).toHaveProperty('translation');
        expect(q.translation).toHaveProperty('es');
        expect(q.translation).toHaveProperty('en');
      });
    });
  });

  // ==========================================
  // calculateScore
  // ==========================================
  describe('calculateScore', () => {
    it('should calculate correct score for all correct answers', () => {
      const answers = [
        { questionId: 'q1', selectedAnswer: 'naam', correctAnswer: 'naam', isCorrect: true },
        { questionId: 'q2', selectedAnswer: 'jaar', correctAnswer: 'jaar', isCorrect: true },
        { questionId: 'q3', selectedAnswer: 'straat', correctAnswer: 'straat', isCorrect: true },
      ];

      const result = calculateScore(answers, mockLesson);

      expect(result.score).toBe(3);
      expect(result.total).toBe(3);
      expect(result.percentage).toBe(100);
      expect(result.passed).toBe(true);
    });

    it('should calculate correct score for all wrong answers', () => {
      const answers = [
        { questionId: 'q1', selectedAnswer: 'wrong', correctAnswer: 'naam', isCorrect: false },
        { questionId: 'q2', selectedAnswer: 'wrong', correctAnswer: 'jaar', isCorrect: false },
      ];

      const result = calculateScore(answers, mockLesson);

      expect(result.score).toBe(0);
      expect(result.total).toBe(2);
      expect(result.percentage).toBe(0);
      expect(result.passed).toBe(false);
    });

    it('should calculate points breakdown correctly', () => {
      const answers = [
        { questionId: 'q1', selectedAnswer: 'naam', correctAnswer: 'naam', isCorrect: true },
        { questionId: 'q2', selectedAnswer: 'wrong', correctAnswer: 'jaar', isCorrect: false },
      ];

      const result = calculateScore(answers, mockLesson);

      expect(result.breakdown.correctPoints).toBe(1 * mockLesson.quiz.pointsPerCorrect);
      expect(result.breakdown.completionBonus).toBe(mockLesson.quiz.completionBonus);
      expect(result.breakdown.masteryBonus).toBe(0); // Not passed
    });

    it('should award mastery bonus for passing score (>=80%)', () => {
      const answers = [
        { questionId: 'q1', selectedAnswer: 'naam', correctAnswer: 'naam', isCorrect: true },
      ];

      const result = calculateScore(answers, mockLesson);

      expect(result.breakdown.masteryBonus).toBe(mockLesson.quiz.masteryBonus);
    });

    it('should calculate total points correctly', () => {
      const answers = [
        { questionId: 'q1', selectedAnswer: 'naam', correctAnswer: 'naam', isCorrect: true },
        { questionId: 'q2', selectedAnswer: 'naam', correctAnswer: 'naam', isCorrect: true },
      ];

      const result = calculateScore(answers, mockLesson);
      const expected = (2 * 20) + 10 + 25; // 2 correct * 20 + completion 10 + mastery 25

      expect(result.points).toBe(expected);
    });

    it('should handle passing threshold correctly (80%)', () => {
      // 4/5 = 80% should pass
      const passAnswers = Array(5).fill(null).map((_, i) => ({
        questionId: `q${i}`,
        selectedAnswer: i < 4 ? 'correct' : 'wrong',
        correctAnswer: 'correct',
        isCorrect: i < 4,
      }));

      const passResult = calculateScore(passAnswers, mockLesson);
      expect(passResult.passed).toBe(true);

      // 3/5 = 60% should fail
      const failAnswers = Array(5).fill(null).map((_, i) => ({
        questionId: `q${i}`,
        selectedAnswer: i < 3 ? 'correct' : 'wrong',
        correctAnswer: 'correct',
        isCorrect: i < 3,
      }));

      const failResult = calculateScore(failAnswers, mockLesson);
      expect(failResult.passed).toBe(false);
    });

    it('should handle empty answers', () => {
      const result = calculateScore([], mockLesson);

      expect(result.score).toBe(0);
      expect(result.total).toBe(0);
      expect(result.percentage).toBe(0);
    });
  });

  // ==========================================
  // createUserAnswer
  // ==========================================
  describe('createUserAnswer', () => {
    it('should create correct answer object for correct selection', () => {
      const question = { questionId: 'q1', correctAnswer: 'naam' };
      const answer = createUserAnswer(question, 'naam');

      expect(answer.questionId).toBe('q1');
      expect(answer.selectedAnswer).toBe('naam');
      expect(answer.correctAnswer).toBe('naam');
      expect(answer.isCorrect).toBe(true);
    });

    it('should create correct answer object for wrong selection', () => {
      const question = { questionId: 'q1', correctAnswer: 'naam' };
      const answer = createUserAnswer(question, 'jaar');

      expect(answer.isCorrect).toBe(false);
      expect(answer.selectedAnswer).toBe('jaar');
      expect(answer.correctAnswer).toBe('naam');
    });
  });

  // ==========================================
  // getQuizFeedback
  // ==========================================
  describe('getQuizFeedback', () => {
    it('should return perfect feedback for 100%', () => {
      const result = { percentage: 100, passed: true };
      const feedback = getQuizFeedback(result, 'es');

      expect(feedback.title).toBe('Perfecto!');
      expect(feedback.icon).toBe('star');
    });

    it('should return passed feedback for passing score', () => {
      const result = { percentage: 80, passed: true };
      const feedback = getQuizFeedback(result, 'es');

      expect(feedback.title).toBe('Muy bien!');
      expect(feedback.icon).toBe('check');
    });

    it('should return failed feedback for failing score', () => {
      const result = { percentage: 40, passed: false };
      const feedback = getQuizFeedback(result, 'es');

      expect(feedback.title).toBe('Sigue intentando');
      expect(feedback.icon).toBe('retry');
    });

    it('should support English language', () => {
      const result = { percentage: 100, passed: true };
      const feedback = getQuizFeedback(result, 'en');

      expect(feedback.title).toBe('Perfect!');
    });

    it('should default to Spanish for unknown language', () => {
      const result = { percentage: 100, passed: true };
      const feedback = getQuizFeedback(result, 'fr');

      expect(feedback.title).toBe('Perfecto!');
    });

    it('should include a message in feedback', () => {
      const result = { percentage: 80, passed: true };
      const feedback = getQuizFeedback(result, 'es');

      expect(feedback.message).toBeTruthy();
      expect(typeof feedback.message).toBe('string');
    });
  });

  // ==========================================
  // getPassingScore
  // ==========================================
  describe('getPassingScore', () => {
    it('should return correct passing score for existing lesson', () => {
      const score = getPassingScore('P1-AA-BEG');

      expect(score).toBe(80); // 0.8 * 100
    });

    it('should return default 80 for non-existent lesson', () => {
      const score = getPassingScore('P99-XX-BEG');

      expect(score).toBe(80);
    });
  });

  // ==========================================
  // getMaxPoints
  // ==========================================
  describe('getMaxPoints', () => {
    it('should calculate maximum possible points', () => {
      const maxPoints = getMaxPoints(mockLesson);
      const expected = (mockLesson.quiz.questionCount * mockLesson.quiz.pointsPerCorrect)
        + mockLesson.quiz.completionBonus
        + mockLesson.quiz.masteryBonus;

      expect(maxPoints).toBe(expected);
    });

    it('should include all bonus components', () => {
      const maxPoints = getMaxPoints(mockLesson);
      // 5 * 20 + 10 + 25 = 135
      expect(maxPoints).toBe(135);
    });
  });

  // ==========================================
  // validateAnswer
  // ==========================================
  describe('validateAnswer', () => {
    it('should return true for correct answer', () => {
      const question = { correctAnswer: 'naam' };
      expect(validateAnswer('naam', question)).toBe(true);
    });

    it('should return false for incorrect answer', () => {
      const question = { correctAnswer: 'naam' };
      expect(validateAnswer('jaar', question)).toBe(false);
    });

    it('should be case-sensitive', () => {
      const question = { correctAnswer: 'naam' };
      expect(validateAnswer('Naam', question)).toBe(false);
    });
  });
});
