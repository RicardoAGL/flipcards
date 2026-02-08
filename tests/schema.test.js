import { describe, it, expect } from 'vitest';
import {
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
} from '../src/data/schema.js';

describe('Schema Constants', () => {
  it('should export correct VALID_LEVELS', () => {
    expect(VALID_LEVELS).toEqual(['beginner', 'advanced']);
  });

  it('should export correct PHASE_1_SOUNDS', () => {
    expect(PHASE_1_SOUNDS).toEqual(['aa', 'ee', 'oo', 'uu']);
  });

  it('should export correct PHASE_2_SOUNDS', () => {
    expect(PHASE_2_SOUNDS).toEqual(['ui', 'ij', 'ei', 'oe', 'eu', 'au', 'ou', 'ie']);
  });

  it('should export LESSON_ID_PATTERN regex', () => {
    expect(LESSON_ID_PATTERN).toBeInstanceOf(RegExp);
    expect(LESSON_ID_PATTERN.test('P1-AA-BEG')).toBe(true);
  });
});

describe('isValidLessonId', () => {
  it('should validate correct lesson IDs with Phase 1 sounds', () => {
    expect(isValidLessonId('P1-AA-BEG')).toBe(true);
    expect(isValidLessonId('P1-EE-ADV')).toBe(true);
    expect(isValidLessonId('P1-OO-BEG')).toBe(true);
    expect(isValidLessonId('P1-UU-ADV')).toBe(true);
  });

  it('should validate correct lesson IDs with Phase 2 sounds', () => {
    expect(isValidLessonId('P2-UI-BEG')).toBe(true);
    expect(isValidLessonId('P2-IJ-ADV')).toBe(true);
    expect(isValidLessonId('P2-EI-BEG')).toBe(true);
  });

  it('should validate lesson IDs with 3-letter sounds', () => {
    expect(isValidLessonId('P2-OOI-BEG')).toBe(true);
  });

  it('should reject empty string', () => {
    expect(isValidLessonId('')).toBe(false);
  });

  it('should reject lesson ID without phase prefix', () => {
    expect(isValidLessonId('AA-BEG')).toBe(false);
  });

  it('should reject lesson ID with wrong format', () => {
    expect(isValidLessonId('P1_AA_BEG')).toBe(false);
    expect(isValidLessonId('P1-AA')).toBe(false);
    expect(isValidLessonId('1-AA-BEG')).toBe(false);
  });

  it('should reject non-string values', () => {
    expect(isValidLessonId(/** @type {any} */ (null))).toBe(false);
    expect(isValidLessonId(/** @type {any} */ (undefined))).toBe(false);
    expect(isValidLessonId(/** @type {any} */ (123))).toBe(false);
    expect(isValidLessonId(/** @type {any} */ ({}))).toBe(false);
  });
});

describe('parseLessonId', () => {
  it('should correctly parse valid lesson ID with BEG level', () => {
    const result = parseLessonId('P1-AA-BEG');
    expect(result).toEqual({
      phase: 1,
      sound: 'aa',
      level: 'beginner',
    });
  });

  it('should correctly parse valid lesson ID with ADV level', () => {
    const result = parseLessonId('P2-UI-ADV');
    expect(result).toEqual({
      phase: 2,
      sound: 'ui',
      level: 'advanced',
    });
  });

  it('should convert BEG to beginner', () => {
    const result = /** @type {any} */ (parseLessonId('P1-EE-BEG'));
    expect(result.level).toBe('beginner');
  });

  it('should convert ADV to advanced', () => {
    const result = /** @type {any} */ (parseLessonId('P1-OO-ADV'));
    expect(result.level).toBe('advanced');
  });

  it('should return null for invalid lesson ID', () => {
    expect(parseLessonId('INVALID')).toBeNull();
    expect(parseLessonId('P1-AA')).toBeNull();
    expect(parseLessonId('')).toBeNull();
  });

  it('should lowercase the sound combination', () => {
    const result = /** @type {any} */ (parseLessonId('P1-AA-BEG'));
    expect(result.sound).toBe('aa');
  });

  it('should parse phase as number', () => {
    const result = /** @type {any} */ (parseLessonId('P2-UI-BEG'));
    expect(result.phase).toBe(2);
    expect(typeof result.phase).toBe('number');
  });
});

describe('validateWord', () => {
  const validWord = {
    wordId: 'aa-001',
    word: 'naam',
    prefix: 'n',
    suffix: 'm',
    translation: { es: 'nombre', en: 'name' },
    syllables: 1,
  };

  it('should validate a correct word object', () => {
    const result = validateWord(validWord);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should detect missing wordId', () => {
    const word = { ...validWord, wordId: '' };
    const result = validateWord(word);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('wordId is required and must be a string');
  });

  it('should detect invalid wordId type', () => {
    const word = /** @type {any} */ ({ ...validWord, wordId: 123 });
    const result = validateWord(word);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('wordId is required and must be a string');
  });

  it('should detect missing word field', () => {
    const word = { ...validWord, word: '' };
    const result = validateWord(word);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('word is required and must be a string');
  });

  it('should detect invalid prefix type', () => {
    const word = /** @type {any} */ ({ ...validWord, prefix: 123 });
    const result = validateWord(word);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('prefix must be a string');
  });

  it('should detect invalid suffix type', () => {
    const word = /** @type {any} */ ({ ...validWord, suffix: null });
    const result = validateWord(word);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('suffix must be a string');
  });

  it('should detect missing translation object', () => {
    const word = /** @type {any} */ ({ ...validWord, translation: null });
    const result = validateWord(word);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('translation is required and must be an object');
  });

  it('should detect invalid translation.es type', () => {
    const word = /** @type {any} */ ({ ...validWord, translation: { es: null, en: 'name' } });
    const result = validateWord(word);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('translation.es is required and must be a string');
  });

  it('should detect invalid translation.en type', () => {
    const word = /** @type {any} */ ({ ...validWord, translation: { es: 'nombre', en: null } });
    const result = validateWord(word);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('translation.en is required and must be a string');
  });

  it('should detect invalid syllables type', () => {
    const word = /** @type {any} */ ({ ...validWord, syllables: '1' });
    const result = validateWord(word);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('syllables must be a positive number');
  });

  it('should detect syllables less than 1', () => {
    const word = { ...validWord, syllables: 0 };
    const result = validateWord(word);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('syllables must be a positive number');
  });

  it('should allow empty prefix', () => {
    const word = { ...validWord, prefix: '' };
    const result = validateWord(word);
    expect(result.valid).toBe(true);
  });

  it('should allow empty suffix', () => {
    const word = { ...validWord, suffix: '' };
    const result = validateWord(word);
    expect(result.valid).toBe(true);
  });
});

describe('validateSound', () => {
  const validSound = {
    combination: 'aa',
    ipa: '[aː]',
    descriptionES: 'Como la "a" en "padre"',
    descriptionEN: 'Like "a" in "father"',
  };

  it('should validate a correct sound object', () => {
    const result = validateSound(validSound);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should detect missing combination', () => {
    const sound = { ...validSound, combination: '' };
    const result = validateSound(sound);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('sound.combination is required and must be a string');
  });

  it('should detect missing ipa', () => {
    const sound = /** @type {any} */ ({ ...validSound, ipa: null });
    const result = validateSound(sound);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('sound.ipa is required and must be a string');
  });

  it('should detect missing descriptionES', () => {
    const sound = /** @type {any} */ ({ ...validSound, descriptionES: undefined });
    const result = validateSound(sound);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('sound.descriptionES is required and must be a string');
  });

  it('should detect missing descriptionEN', () => {
    const sound = { ...validSound, descriptionEN: '' };
    const result = validateSound(sound);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('sound.descriptionEN is required and must be a string');
  });

  it('should detect invalid combination type', () => {
    const sound = /** @type {any} */ ({ ...validSound, combination: 123 });
    const result = validateSound(sound);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('sound.combination is required and must be a string');
  });
});

describe('validateLesson', () => {
  /** @type {any} */
  const validLesson = {
    lessonId: 'P1-AA-BEG',
    phase: 1,
    sound: {
      combination: 'aa',
      ipa: '[aː]',
      descriptionES: 'desc ES',
      descriptionEN: 'desc EN',
    },
    level: 'beginner',
    unlockRequires: null,
    words: [
      {
        wordId: 'aa-001',
        word: 'naam',
        prefix: 'n',
        suffix: 'm',
        translation: { es: 'nombre', en: 'name' },
        syllables: 1,
      },
    ],
    quiz: {
      questionCount: 5,
      passingScore: 0.8,
      pointsPerCorrect: 20,
      completionBonus: 10,
      masteryBonus: 25,
    },
    estimatedMinutes: 5,
  };

  it('should validate a complete valid lesson', () => {
    const result = validateLesson(validLesson);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should detect invalid lessonId format', () => {
    const lesson = { ...validLesson, lessonId: 'INVALID' };
    const result = validateLesson(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Invalid lessonId format'))).toBe(true);
  });

  it('should detect invalid phase type', () => {
    const lesson = { ...validLesson, phase: '1' };
    const result = validateLesson(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('phase must be a positive number');
  });

  it('should detect phase less than 1', () => {
    const lesson = { ...validLesson, phase: 0 };
    const result = validateLesson(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('phase must be a positive number');
  });

  it('should detect invalid level', () => {
    const lesson = { ...validLesson, level: 'intermediate' };
    const result = validateLesson(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('level must be one of'))).toBe(true);
  });

  it('should detect missing words array', () => {
    const lesson = { ...validLesson, words: undefined };
    const result = validateLesson(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('words must be a non-empty array');
  });

  it('should detect empty words array', () => {
    const lesson = { ...validLesson, words: [] };
    const result = validateLesson(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('words must be a non-empty array');
  });

  it('should detect invalid word in words array', () => {
    const lesson = {
      ...validLesson,
      words: [{ ...validLesson.words[0], wordId: null }],
    };
    const result = validateLesson(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Word at index 0'))).toBe(true);
  });

  it('should detect missing quiz config', () => {
    const lesson = { ...validLesson, quiz: null };
    const result = validateLesson(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('quiz configuration is required');
  });

  it('should detect invalid quiz.questionCount', () => {
    const lesson = {
      ...validLesson,
      quiz: { ...validLesson.quiz, questionCount: 0 },
    };
    const result = validateLesson(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('quiz.questionCount must be a positive number');
  });

  it('should detect invalid quiz.passingScore below 0', () => {
    const lesson = {
      ...validLesson,
      quiz: { ...validLesson.quiz, passingScore: -0.1 },
    };
    const result = validateLesson(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('quiz.passingScore must be a number between 0 and 1');
  });

  it('should detect invalid quiz.passingScore above 1', () => {
    const lesson = {
      ...validLesson,
      quiz: { ...validLesson.quiz, passingScore: 1.1 },
    };
    const result = validateLesson(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('quiz.passingScore must be a number between 0 and 1');
  });

  it('should detect invalid quiz.pointsPerCorrect type', () => {
    const lesson = {
      ...validLesson,
      quiz: { ...validLesson.quiz, pointsPerCorrect: '20' },
    };
    const result = validateLesson(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('quiz.pointsPerCorrect must be a number');
  });

  it('should detect invalid quiz.completionBonus type', () => {
    const lesson = {
      ...validLesson,
      quiz: { ...validLesson.quiz, completionBonus: null },
    };
    const result = validateLesson(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('quiz.completionBonus must be a number');
  });

  it('should detect invalid quiz.masteryBonus type', () => {
    const lesson = {
      ...validLesson,
      quiz: { ...validLesson.quiz, masteryBonus: undefined },
    };
    const result = validateLesson(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('quiz.masteryBonus must be a number');
  });

  it('should detect invalid estimatedMinutes', () => {
    const lesson = { ...validLesson, estimatedMinutes: 0 };
    const result = validateLesson(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('estimatedMinutes must be a positive number');
  });

  it('should detect invalid estimatedMinutes type', () => {
    const lesson = { ...validLesson, estimatedMinutes: '5' };
    const result = validateLesson(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('estimatedMinutes must be a positive number');
  });

  it('should accept null unlockRequires', () => {
    const lesson = { ...validLesson, unlockRequires: null };
    const result = validateLesson(lesson);
    expect(result.valid).toBe(true);
  });

  it('should accept valid unlockRequires', () => {
    const lesson = { ...validLesson, unlockRequires: 'P1-AA-BEG' };
    const result = validateLesson(lesson);
    expect(result.valid).toBe(true);
  });

  it('should detect invalid unlockRequires format', () => {
    const lesson = { ...validLesson, unlockRequires: 'INVALID' };
    const result = validateLesson(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('unlockRequires must be null or a valid lesson ID');
  });

  it('should detect invalid sound object', () => {
    const lesson = {
      ...validLesson,
      sound: { ...validLesson.sound, combination: '' },
    };
    const result = validateLesson(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('sound.combination is required and must be a string');
  });
});

describe('toFlipCardFormat', () => {
  /** @type {any} */
  const lesson = {
    lessonId: 'P1-AA-BEG',
    phase: 1,
    sound: {
      combination: 'aa',
      ipa: '[aː]',
      descriptionES: 'Como la "a" en "padre"',
      descriptionEN: 'Like "a" in "father"',
    },
    level: 'beginner',
    unlockRequires: null,
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
        word: 'straat',
        prefix: 'str',
        suffix: 't',
        translation: { es: 'calle', en: 'street' },
        syllables: 1,
      },
    ],
    quiz: {
      questionCount: 5,
      passingScore: 0.8,
      pointsPerCorrect: 20,
      completionBonus: 10,
      masteryBonus: 25,
    },
    estimatedMinutes: 5,
  };

  it('should convert lesson to FlipCard format with correct structure', () => {
    const result = toFlipCardFormat(lesson);
    expect(result).toHaveProperty('sound');
    expect(result).toHaveProperty('ipa');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('words');
  });

  it('should extract sound combination', () => {
    const result = toFlipCardFormat(lesson);
    expect(result.sound).toBe('aa');
  });

  it('should extract IPA notation', () => {
    const result = toFlipCardFormat(lesson);
    expect(result.ipa).toBe('[aː]');
  });

  it('should use Spanish description by default', () => {
    const result = toFlipCardFormat(lesson);
    expect(result.description).toBe('Como la "a" en "padre"');
  });

  it('should map words array correctly', () => {
    const result = toFlipCardFormat(lesson);
    expect(result.words).toHaveLength(2);
    expect(result.words[0]).toEqual({
      prefix: 'n',
      suffix: 'm',
      word: 'naam',
      translation: { es: 'nombre', en: 'name' },
    });
  });

  it('should include translation in mapped words', () => {
    const result = toFlipCardFormat(lesson);
    expect(result.words[1].translation).toEqual({ es: 'calle', en: 'street' });
  });

  it('should preserve word order', () => {
    const result = toFlipCardFormat(lesson);
    expect(result.words[0].word).toBe('naam');
    expect(result.words[1].word).toBe('straat');
  });
});

describe('extractMetadata', () => {
  /** @type {any} */
  const lesson = {
    lessonId: 'P1-AA-BEG',
    phase: 1,
    sound: {
      combination: 'aa',
      ipa: '[aː]',
      descriptionES: 'desc ES',
      descriptionEN: 'desc EN',
    },
    level: 'beginner',
    unlockRequires: null,
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
        word: 'straat',
        prefix: 'str',
        suffix: 't',
        translation: { es: 'calle', en: 'street' },
        syllables: 1,
      },
    ],
    quiz: {
      questionCount: 5,
      passingScore: 0.8,
      pointsPerCorrect: 20,
      completionBonus: 10,
      masteryBonus: 25,
    },
    estimatedMinutes: 5,
  };

  it('should extract lessonId', () => {
    const result = extractMetadata(lesson);
    expect(result.lessonId).toBe('P1-AA-BEG');
  });

  it('should extract sound combination', () => {
    const result = extractMetadata(lesson);
    expect(result.sound).toBe('aa');
  });

  it('should extract IPA notation', () => {
    const result = extractMetadata(lesson);
    expect(result.ipa).toBe('[aː]');
  });

  it('should extract level', () => {
    const result = extractMetadata(lesson);
    expect(result.level).toBe('beginner');
  });

  it('should calculate wordCount from words array length', () => {
    const result = extractMetadata(lesson);
    expect(result.wordCount).toBe(2);
  });

  it('should extract estimatedMinutes', () => {
    const result = extractMetadata(lesson);
    expect(result.estimatedMinutes).toBe(5);
  });

  it('should extract unlockRequires', () => {
    const result = extractMetadata(lesson);
    expect(result.unlockRequires).toBeNull();
  });

  it('should extract phase', () => {
    const result = extractMetadata(lesson);
    expect(result.phase).toBe(1);
  });

  it('should handle unlockRequires with value', () => {
    const lessonWithUnlock = { ...lesson, unlockRequires: 'P1-EE-BEG' };
    const result = extractMetadata(lessonWithUnlock);
    expect(result.unlockRequires).toBe('P1-EE-BEG');
  });

  it('should return object with all required fields', () => {
    const result = extractMetadata(lesson);
    expect(result).toEqual({
      lessonId: 'P1-AA-BEG',
      sound: 'aa',
      ipa: '[aː]',
      level: 'beginner',
      wordCount: 2,
      estimatedMinutes: 5,
      unlockRequires: null,
      phase: 1,
    });
  });
});
