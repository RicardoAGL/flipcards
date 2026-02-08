/**
 * Quiz Helpers
 * Utility functions for generating and scoring quizzes
 *
 * @fileoverview Provides functions to generate quiz questions,
 * create distractors, and calculate quiz scores.
 */

import { lessonsById, lessonsBySound, soundInfo } from '../data/lessons/index.js';

/**
 * @typedef {Object} QuizQuestion
 * @property {string} questionId - Unique question identifier
 * @property {string} wordId - The word being tested
 * @property {string} correctAnswer - The correct word
 * @property {string[]} options - Array of answer options (including correct)
 * @property {string} sound - The target sound
 * @property {string} ipa - IPA notation for the sound
 * @property {string} descriptionES - Spanish pronunciation description
 * @property {string} descriptionEN - English pronunciation description
 */

/**
 * @typedef {Object} QuizResult
 * @property {number} score - Number of correct answers
 * @property {number} total - Total number of questions
 * @property {number} percentage - Percentage score (0-100)
 * @property {boolean} passed - Whether the passing threshold was met
 * @property {number} points - Total points earned
 * @property {Object} breakdown - Points breakdown
 * @property {number} breakdown.correctPoints - Points from correct answers
 * @property {number} breakdown.completionBonus - Completion bonus points
 * @property {number} breakdown.masteryBonus - Mastery bonus for passing (0 if not passed)
 */

/**
 * @typedef {Object} UserAnswer
 * @property {string} questionId - The question identifier
 * @property {string} selectedAnswer - The user's selected answer
 * @property {string} correctAnswer - The correct answer
 * @property {boolean} isCorrect - Whether the answer was correct
 */

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {any[]} array - Array to shuffle
 * @returns {any[]} New shuffled array
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate a unique question ID
 * @param {string} lessonId - The lesson ID
 * @param {string} wordId - The word ID
 * @returns {string} Unique question ID
 */
function generateQuestionId(lessonId, wordId) {
  return `${lessonId}-${wordId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get plausible distractor words for a quiz question
 * @param {import('../data/schema.js').Word} word - The target word
 * @param {import('../data/schema.js').Lesson} lesson - The current lesson
 * @param {number} count - Number of distractors needed (default: 3)
 * @returns {string[]} Array of distractor words
 */
export function getDistractors(word, lesson, count = 3) {
  const distractors = new Set();
  const targetWord = word.word.toLowerCase();
  const targetSound = lesson.sound.combination;

  // Priority 1: Use lesson's distractor pool if available
  if (lesson.distractorPool && lesson.distractorPool.length > 0) {
    const poolDistractors = lesson.distractorPool.filter(
      w => w.toLowerCase() !== targetWord,
    );
    shuffleArray(poolDistractors).forEach(d => {
      if (distractors.size < count) {
        distractors.add(d);
      }
    });
  }

  // Priority 2: Words from the same lesson (but not the target word)
  if (distractors.size < count) {
    const lessonWords = lesson.words
      .map(w => w.word)
      .filter(w => w.toLowerCase() !== targetWord);

    shuffleArray(lessonWords).forEach(w => {
      if (distractors.size < count) {
        distractors.add(w);
      }
    });
  }

  // Priority 3: Words from lessons with the same sound
  if (distractors.size < count && lessonsBySound[targetSound]) {
    const sameSoundLessons = lessonsBySound[targetSound];
    for (const sameSoundLesson of sameSoundLessons) {
      if (sameSoundLesson.lessonId !== lesson.lessonId) {
        const otherWords = sameSoundLesson.words
          .map(w => w.word)
          .filter(w => w.toLowerCase() !== targetWord && !distractors.has(w));

        shuffleArray(otherWords).forEach(w => {
          if (distractors.size < count) {
            distractors.add(w);
          }
        });
      }
    }
  }

  // Priority 4: Words from other sounds (cross-sound confusion)
  if (distractors.size < count) {
    const otherSounds = Object.keys(soundInfo).filter(s => s !== targetSound);

    for (const otherSound of shuffleArray(otherSounds)) {
      const otherSoundLessons = lessonsBySound[otherSound] || [];
      for (const otherLesson of otherSoundLessons) {
        const otherWords = otherLesson.words
          .map(w => w.word)
          .filter(w => w.toLowerCase() !== targetWord && !distractors.has(w));

        shuffleArray(otherWords).forEach(w => {
          if (distractors.size < count) {
            distractors.add(w);
          }
        });

        if (distractors.size >= count) {break;}
      }
      if (distractors.size >= count) {break;}
    }
  }

  // Priority 5: Generate similar-looking words (fallback)
  if (distractors.size < count) {
    const fallbackWords = generateSimilarWords(targetWord, targetSound);
    fallbackWords.forEach(w => {
      if (distractors.size < count && !distractors.has(w)) {
        distractors.add(w);
      }
    });
  }

  return Array.from(distractors).slice(0, count);
}

/**
 * Generate similar-looking words as fallback distractors
 * @param {string} word - The target word
 * @param {string} sound - The target sound
 * @returns {string[]} Array of generated distractor words
 */
function generateSimilarWords(word, sound) {
  const distractors = [];
  const vowelVariants = {
    aa: ['a', 'ae', 'ee'],
    ee: ['e', 'ie', 'aa'],
    oo: ['o', 'oe', 'aa'],
    uu: ['u', 'eu', 'oe'],
  };

  // Try replacing the sound with variants
  if (vowelVariants[sound]) {
    for (const variant of vowelVariants[sound]) {
      const modified = word.replace(sound, variant);
      if (modified !== word) {
        distractors.push(modified);
      }
    }
  }

  return distractors;
}

/**
 * Generate a quiz from a lesson
 * @param {import('../data/schema.js').Lesson} lesson - The lesson data
 * @param {number} [questionCount] - Number of questions (defaults to lesson config)
 * @returns {QuizQuestion[]} Array of quiz questions
 */
export function generateQuiz(lesson, questionCount) {
  const count = questionCount || lesson.quiz.questionCount || 5;

  // Filter out standalone sound entries for quiz
  const availableWords = lesson.words.filter(
    w => w.word !== lesson.sound.combination,
  );

  // Select random words for questions
  const selectedWords = shuffleArray(availableWords).slice(0, count);

  // Generate questions
  const questions = selectedWords.map(word => {
    const distractors = getDistractors(word, lesson, 3);
    const options = shuffleArray([word.word, ...distractors]);

    return {
      questionId: generateQuestionId(lesson.lessonId, word.wordId),
      wordId: word.wordId,
      correctAnswer: word.word,
      options,
      sound: lesson.sound.combination,
      ipa: lesson.sound.ipa,
      descriptionES: lesson.sound.descriptionES,
      descriptionEN: lesson.sound.descriptionEN,
      translation: word.translation,
    };
  });

  return questions;
}

/**
 * Calculate the quiz score from user answers
 * @param {UserAnswer[]} answers - Array of user answers
 * @param {import('../data/schema.js').Lesson} lesson - The lesson for scoring config
 * @returns {QuizResult} The calculated quiz result
 */
export function calculateScore(answers, lesson) {
  const { quiz } = lesson;
  const total = answers.length;
  const correctAnswers = answers.filter(a => a.isCorrect);
  const score = correctAnswers.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed = percentage / 100 >= quiz.passingScore;

  // Calculate points
  const correctPoints = score * quiz.pointsPerCorrect;
  const completionBonus = quiz.completionBonus;
  const masteryBonus = passed ? quiz.masteryBonus : 0;
  const totalPoints = correctPoints + completionBonus + masteryBonus;

  return {
    score,
    total,
    percentage,
    passed,
    points: totalPoints,
    breakdown: {
      correctPoints,
      completionBonus,
      masteryBonus,
    },
  };
}

/**
 * Create a user answer object
 * @param {QuizQuestion} question - The quiz question
 * @param {string} selectedAnswer - The user's selected answer
 * @returns {UserAnswer} The user answer object
 */
export function createUserAnswer(question, selectedAnswer) {
  return {
    questionId: question.questionId,
    selectedAnswer,
    correctAnswer: question.correctAnswer,
    isCorrect: selectedAnswer === question.correctAnswer,
  };
}

/**
 * Get feedback message based on quiz result
 * @param {QuizResult} result - The quiz result
 * @param {string} [language='es'] - Language for feedback ('es' or 'en')
 * @returns {{ title: string, message: string, icon: string }} Feedback data
 */
export function getQuizFeedback(result, language = 'es') {
  const messages = {
    es: {
      perfect: {
        title: 'Perfecto!',
        message: 'Has acertado todas las preguntas. Excelente trabajo!',
        icon: 'star',
      },
      passed: {
        title: 'Muy bien!',
        message: 'Has aprobado el quiz. Sigue practicando!',
        icon: 'check',
      },
      failed: {
        title: 'Sigue intentando',
        message: 'No has alcanzado el puntaje minimo. Practica mas y vuelve a intentarlo.',
        icon: 'retry',
      },
    },
    en: {
      perfect: {
        title: 'Perfect!',
        message: 'You got all questions correct. Excellent work!',
        icon: 'star',
      },
      passed: {
        title: 'Great job!',
        message: 'You passed the quiz. Keep practicing!',
        icon: 'check',
      },
      failed: {
        title: 'Keep trying',
        message: "You didn't reach the minimum score. Practice more and try again.",
        icon: 'retry',
      },
    },
  };

  const lang = messages[language] || messages.es;

  if (result.percentage === 100) {
    return lang.perfect;
  } else if (result.passed) {
    return lang.passed;
  } else {
    return lang.failed;
  }
}

/**
 * Get the passing score for a lesson
 * @param {string} lessonId - The lesson ID
 * @returns {number} The passing score as a percentage (0-100)
 */
export function getPassingScore(lessonId) {
  const lesson = lessonsById[lessonId];
  if (!lesson) {
    return 80; // Default
  }
  return Math.round(lesson.quiz.passingScore * 100);
}

/**
 * Calculate maximum possible points for a quiz
 * @param {import('../data/schema.js').Lesson} lesson - The lesson data
 * @returns {number} Maximum possible points
 */
export function getMaxPoints(lesson) {
  const { quiz } = lesson;
  const questionCount = quiz.questionCount;
  return (questionCount * quiz.pointsPerCorrect) + quiz.completionBonus + quiz.masteryBonus;
}

/**
 * Validate a quiz answer
 * @param {string} selectedAnswer - The user's selected answer
 * @param {QuizQuestion} question - The quiz question
 * @returns {boolean} True if the answer is correct
 */
export function validateAnswer(selectedAnswer, question) {
  return selectedAnswer === question.correctAnswer;
}

export default {
  generateQuiz,
  getDistractors,
  calculateScore,
  createUserAnswer,
  getQuizFeedback,
  getPassingScore,
  getMaxPoints,
  validateAnswer,
};
