/**
 * Lesson Data Schema
 * TypeScript-style JSDoc types for Dutch pronunciation lessons
 *
 * @fileoverview Defines the data structures and validation helpers
 * for the Dutch pronunciation learning app lesson system.
 */

/**
 * @typedef {Object} Translation
 * @property {string} es - Spanish translation
 * @property {string} en - English translation
 */

/**
 * @typedef {Object} Word
 * @property {string} wordId - Unique identifier (e.g., "aa-001")
 * @property {string} word - The complete Dutch word
 * @property {string} prefix - Letters before the target sound
 * @property {string} suffix - Letters after the target sound
 * @property {Translation} translation - Translations for the word
 * @property {number} syllables - Number of syllables in the word
 */

/**
 * @typedef {Object} Sound
 * @property {string} combination - The vowel combination (e.g., "aa", "ee")
 * @property {string} ipa - IPA notation (e.g., "[a:]")
 * @property {string} descriptionES - Spanish pronunciation description
 * @property {string} descriptionEN - English pronunciation description
 */

/**
 * @typedef {Object} QuizConfig
 * @property {number} questionCount - Number of questions per quiz (default: 5)
 * @property {number} passingScore - Minimum score to pass (0-1, default: 0.8)
 * @property {number} pointsPerCorrect - Points awarded per correct answer
 * @property {number} completionBonus - Bonus points for completing the quiz
 * @property {number} perfectBonus - Bonus points for a perfect score
 */

/**
 * @typedef {'beginner' | 'advanced'} LessonLevel
 */

/**
 * @typedef {Object} Lesson
 * @property {string} lessonId - Unique lesson identifier (e.g., "P1-AA-BEG")
 * @property {number} phase - Phase number (1, 2, etc.)
 * @property {Sound} sound - Target sound information
 * @property {LessonLevel} level - Difficulty level
 * @property {string|null} unlockRequires - Lesson ID required to unlock, or null if available
 * @property {Word[]} words - Array of words in the lesson
 * @property {QuizConfig} quiz - Quiz configuration
 * @property {number} estimatedMinutes - Estimated completion time in minutes
 * @property {string[]} [distractorPool] - Optional pool of distractor words for quizzes
 */

/**
 * @typedef {Object} LessonMetadata
 * @property {string} lessonId - Unique lesson identifier
 * @property {string} sound - Target sound combination
 * @property {string} ipa - IPA notation
 * @property {LessonLevel} level - Difficulty level
 * @property {number} wordCount - Number of words in the lesson
 * @property {number} estimatedMinutes - Estimated completion time
 * @property {string|null} unlockRequires - Required lesson ID or null
 * @property {number} phase - Phase number
 */

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Valid lesson levels
 * @type {LessonLevel[]}
 */
export const VALID_LEVELS = ['beginner', 'advanced'];

/**
 * Valid sound combinations for Phase 1
 * @type {string[]}
 */
export const PHASE_1_SOUNDS = ['aa', 'ee', 'oo', 'uu'];

/**
 * Valid sound combinations for Phase 2
 * @type {string[]}
 */
export const PHASE_2_SOUNDS = ['ui', 'ij', 'ei', 'oe', 'eu', 'au', 'ou'];

/**
 * Lesson ID pattern regex
 * Format: P[phase]-[SOUND]-[LEVEL]
 * Examples: P1-AA-BEG, P1-EE-ADV, P2-UI-BEG
 */
export const LESSON_ID_PATTERN = /^P(\d+)-([A-Z]{2,3})-([A-Z]{3})$/;

/**
 * Validates a lesson ID format
 * @param {string} lessonId - The lesson ID to validate
 * @returns {boolean} True if valid
 */
export function isValidLessonId(lessonId) {
  if (typeof lessonId !== 'string') {
    return false;
  }
  return LESSON_ID_PATTERN.test(lessonId);
}

/**
 * Parses a lesson ID into its components
 * @param {string} lessonId - The lesson ID to parse
 * @returns {{ phase: number, sound: string, level: string } | null} Parsed components or null
 */
export function parseLessonId(lessonId) {
  const match = lessonId.match(LESSON_ID_PATTERN);
  if (!match) {
    return null;
  }

  const [, phase, sound, levelCode] = match;
  const level = levelCode === 'BEG' ? 'beginner' : levelCode === 'ADV' ? 'advanced' : null;

  return {
    phase: parseInt(phase, 10),
    sound: sound.toLowerCase(),
    level,
  };
}

/**
 * Validates a word object
 * @param {Word} word - The word to validate
 * @returns {{ valid: boolean, errors: string[] }} Validation result
 */
export function validateWord(word) {
  const errors = [];

  if (!word.wordId || typeof word.wordId !== 'string') {
    errors.push('wordId is required and must be a string');
  }

  if (!word.word || typeof word.word !== 'string') {
    errors.push('word is required and must be a string');
  }

  if (typeof word.prefix !== 'string') {
    errors.push('prefix must be a string');
  }

  if (typeof word.suffix !== 'string') {
    errors.push('suffix must be a string');
  }

  if (!word.translation || typeof word.translation !== 'object') {
    errors.push('translation is required and must be an object');
  } else {
    if (typeof word.translation.es !== 'string') {
      errors.push('translation.es is required and must be a string');
    }
    if (typeof word.translation.en !== 'string') {
      errors.push('translation.en is required and must be a string');
    }
  }

  if (typeof word.syllables !== 'number' || word.syllables < 1) {
    errors.push('syllables must be a positive number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a sound object
 * @param {Sound} sound - The sound to validate
 * @returns {{ valid: boolean, errors: string[] }} Validation result
 */
export function validateSound(sound) {
  const errors = [];

  if (!sound.combination || typeof sound.combination !== 'string') {
    errors.push('sound.combination is required and must be a string');
  }

  if (!sound.ipa || typeof sound.ipa !== 'string') {
    errors.push('sound.ipa is required and must be a string');
  }

  if (!sound.descriptionES || typeof sound.descriptionES !== 'string') {
    errors.push('sound.descriptionES is required and must be a string');
  }

  if (!sound.descriptionEN || typeof sound.descriptionEN !== 'string') {
    errors.push('sound.descriptionEN is required and must be a string');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a complete lesson object
 * @param {Lesson} lesson - The lesson to validate
 * @returns {{ valid: boolean, errors: string[] }} Validation result
 */
export function validateLesson(lesson) {
  const errors = [];

  // Validate lessonId
  if (!isValidLessonId(lesson.lessonId)) {
    errors.push(`Invalid lessonId format: ${lesson.lessonId}`);
  }

  // Validate phase
  if (typeof lesson.phase !== 'number' || lesson.phase < 1) {
    errors.push('phase must be a positive number');
  }

  // Validate sound
  const soundValidation = validateSound(lesson.sound);
  if (!soundValidation.valid) {
    errors.push(...soundValidation.errors);
  }

  // Validate level
  if (!VALID_LEVELS.includes(lesson.level)) {
    errors.push(`level must be one of: ${VALID_LEVELS.join(', ')}`);
  }

  // Validate unlockRequires (can be null or valid lesson ID)
  if (lesson.unlockRequires !== null && !isValidLessonId(lesson.unlockRequires)) {
    errors.push('unlockRequires must be null or a valid lesson ID');
  }

  // Validate words array
  if (!Array.isArray(lesson.words) || lesson.words.length === 0) {
    errors.push('words must be a non-empty array');
  } else {
    lesson.words.forEach((word, index) => {
      const wordValidation = validateWord(word);
      if (!wordValidation.valid) {
        errors.push(`Word at index ${index}: ${wordValidation.errors.join(', ')}`);
      }
    });
  }

  // Validate quiz config
  if (!lesson.quiz || typeof lesson.quiz !== 'object') {
    errors.push('quiz configuration is required');
  } else {
    if (typeof lesson.quiz.questionCount !== 'number' || lesson.quiz.questionCount < 1) {
      errors.push('quiz.questionCount must be a positive number');
    }
    if (typeof lesson.quiz.passingScore !== 'number' || lesson.quiz.passingScore < 0 || lesson.quiz.passingScore > 1) {
      errors.push('quiz.passingScore must be a number between 0 and 1');
    }
    if (typeof lesson.quiz.pointsPerCorrect !== 'number') {
      errors.push('quiz.pointsPerCorrect must be a number');
    }
    if (typeof lesson.quiz.completionBonus !== 'number') {
      errors.push('quiz.completionBonus must be a number');
    }
    if (typeof lesson.quiz.perfectBonus !== 'number') {
      errors.push('quiz.perfectBonus must be a number');
    }
  }

  // Validate estimatedMinutes
  if (typeof lesson.estimatedMinutes !== 'number' || lesson.estimatedMinutes < 1) {
    errors.push('estimatedMinutes must be a positive number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Converts a full lesson to FlipCard-compatible format
 * @param {Lesson} lesson - The lesson data
 * @returns {Object} FlipCard-compatible lesson data
 */
export function toFlipCardFormat(lesson) {
  return {
    sound: lesson.sound.combination,
    ipa: lesson.sound.ipa,
    description: lesson.sound.descriptionES, // Default to Spanish
    words: lesson.words.map(word => ({
      prefix: word.prefix,
      suffix: word.suffix,
      word: word.word,
      translation: word.translation,
    })),
  };
}

/**
 * Extracts lesson metadata for menu display
 * @param {Lesson} lesson - The lesson data
 * @returns {LessonMetadata} Lesson metadata
 */
export function extractMetadata(lesson) {
  return {
    lessonId: lesson.lessonId,
    sound: lesson.sound.combination,
    ipa: lesson.sound.ipa,
    level: lesson.level,
    wordCount: lesson.words.length,
    estimatedMinutes: lesson.estimatedMinutes,
    unlockRequires: lesson.unlockRequires,
    phase: lesson.phase,
  };
}

export default {
  VALID_LEVELS,
  PHASE_1_SOUNDS,
  PHASE_2_SOUNDS,
  LESSON_ID_PATTERN,
  isValidLessonId,
  parseLessonId,
  validateWord,
  validateSound,
  validateLesson,
  toFlipCardFormat,
  extractMetadata,
};
