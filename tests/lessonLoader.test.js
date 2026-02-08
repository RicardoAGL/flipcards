/**
 * Lesson Loader Tests
 * Tests for lesson querying and navigation utilities
 */

import { describe, it, expect } from 'vitest';
import {
  getAllLessons,
  getLessonById,
  getLessonForFlipCard,
  getLessonsBySound,
  getLessonsByPhase,
  getNextLesson,
  getPreviousLesson,
  isLessonUnlocked,
  getAvailableLessons,
  getLessonProgress,
  getSoundInfo,
  getAllSounds,
  getLessonMetadata,
  getLessonStats,
  findLessonsByWord,
  getFirstLesson,
  getLessonIndex,
} from '../src/lib/lessonLoader.js';

describe('Lesson Loader', () => {
  // ==========================================
  // getAllLessons
  // ==========================================
  describe('getAllLessons', () => {
    it('should return an array of lesson menu entries', () => {
      const lessons = getAllLessons();

      expect(Array.isArray(lessons)).toBe(true);
      expect(lessons.length).toBeGreaterThan(0);
    });

    it('should have correct fields in each entry', () => {
      const lessons = getAllLessons();

      lessons.forEach(entry => {
        expect(entry).toHaveProperty('lessonId');
        expect(entry).toHaveProperty('sound');
        expect(entry).toHaveProperty('ipa');
        expect(entry).toHaveProperty('level');
        expect(entry).toHaveProperty('wordCount');
        expect(entry).toHaveProperty('phase');
      });
    });

    it('should return 16 lessons across Phase 1 and Phase 2', () => {
      const lessons = getAllLessons();
      expect(lessons).toHaveLength(16);
    });
  });

  // ==========================================
  // getLessonById
  // ==========================================
  describe('getLessonById', () => {
    it('should return lesson for valid ID', () => {
      const lesson = getLessonById('P1-AA-BEG');

      expect(lesson).not.toBeNull();
      expect(lesson.lessonId).toBe('P1-AA-BEG');
    });

    it('should return null for invalid ID', () => {
      const lesson = getLessonById('P99-XX-BEG');

      expect(lesson).toBeNull();
    });

    it('should return a lesson with correct structure', () => {
      const lesson = getLessonById('P1-AA-BEG');

      expect(lesson).toHaveProperty('sound');
      expect(lesson).toHaveProperty('words');
      expect(lesson).toHaveProperty('quiz');
      expect(lesson).toHaveProperty('level');
    });
  });

  // ==========================================
  // getLessonForFlipCard
  // ==========================================
  describe('getLessonForFlipCard', () => {
    it('should return FlipCard-formatted data', () => {
      const data = getLessonForFlipCard('P1-AA-BEG');

      expect(data).not.toBeNull();
      expect(data).toHaveProperty('sound');
      expect(data).toHaveProperty('ipa');
      expect(data).toHaveProperty('description');
      expect(data).toHaveProperty('words');
    });

    it('should return null for invalid ID', () => {
      const data = getLessonForFlipCard('P99-XX-BEG');

      expect(data).toBeNull();
    });

    it('should format words with prefix, suffix, word, and translation', () => {
      const data = getLessonForFlipCard('P1-AA-BEG');

      data.words.forEach(word => {
        expect(word).toHaveProperty('prefix');
        expect(word).toHaveProperty('suffix');
        expect(word).toHaveProperty('word');
        expect(word).toHaveProperty('translation');
      });
    });
  });

  // ==========================================
  // getLessonsBySound
  // ==========================================
  describe('getLessonsBySound', () => {
    it('should return lessons for a valid sound', () => {
      const lessons = getLessonsBySound('aa');

      expect(lessons.length).toBeGreaterThan(0);
      lessons.forEach(l => {
        expect(l.sound.combination).toBe('aa');
      });
    });

    it('should handle case-insensitive sound', () => {
      const lessons = getLessonsBySound('AA');

      expect(lessons.length).toBeGreaterThan(0);
    });

    it('should return empty array for unknown sound', () => {
      const lessons = getLessonsBySound('xyz');

      expect(lessons).toEqual([]);
    });

    it('should return both beginner and advanced for each sound', () => {
      const lessons = getLessonsBySound('aa');

      expect(lessons).toHaveLength(2);
      const levels = lessons.map(l => l.level);
      expect(levels).toContain('beginner');
      expect(levels).toContain('advanced');
    });
  });

  // ==========================================
  // getLessonsByPhase
  // ==========================================
  describe('getLessonsByPhase', () => {
    it('should return lessons for Phase 1', () => {
      const lessons = getLessonsByPhase(1);

      expect(lessons).toHaveLength(8);
    });

    it('should return lessons for Phase 2', () => {
      const lessons = getLessonsByPhase(2);

      expect(lessons).toHaveLength(8);
    });

    it('should return empty array for non-existent phase', () => {
      const lessons = getLessonsByPhase(99);

      expect(lessons).toEqual([]);
    });
  });

  // ==========================================
  // getNextLesson
  // ==========================================
  describe('getNextLesson', () => {
    it('should return next lesson in sequence', () => {
      const next = getNextLesson('P1-AA-BEG');

      expect(next).not.toBeNull();
      expect(next.lessonId).toBe('P1-AA-ADV');
    });

    it('should return null for last lesson', () => {
      const next = getNextLesson('P2-IJ-ADV');

      expect(next).toBeNull();
    });

    it('should return null for invalid lesson ID', () => {
      const next = getNextLesson('P99-XX-BEG');

      expect(next).toBeNull();
    });

    it('should include lesson data in result', () => {
      const next = getNextLesson('P1-AA-BEG');

      expect(next.lesson).toHaveProperty('lessonId');
      expect(next.lesson).toHaveProperty('words');
    });
  });

  // ==========================================
  // getPreviousLesson
  // ==========================================
  describe('getPreviousLesson', () => {
    it('should return previous lesson in sequence', () => {
      const prev = getPreviousLesson('P1-AA-ADV');

      expect(prev).not.toBeNull();
      expect(prev.lessonId).toBe('P1-AA-BEG');
    });

    it('should return null for first lesson', () => {
      const prev = getPreviousLesson('P1-AA-BEG');

      expect(prev).toBeNull();
    });

    it('should return null for invalid lesson ID', () => {
      const prev = getPreviousLesson('P99-XX-BEG');

      expect(prev).toBeNull();
    });
  });

  // ==========================================
  // isLessonUnlocked
  // ==========================================
  describe('isLessonUnlocked', () => {
    it('should return true for lesson with no unlock requirement', () => {
      const unlocked = isLessonUnlocked('P1-AA-BEG', []);

      expect(unlocked).toBe(true);
    });

    it('should return false when required lesson is not completed', () => {
      const unlocked = isLessonUnlocked('P1-AA-ADV', []);

      expect(unlocked).toBe(false);
    });

    it('should return true when required lesson is completed', () => {
      const unlocked = isLessonUnlocked('P1-AA-ADV', ['P1-AA-BEG']);

      expect(unlocked).toBe(true);
    });

    it('should return false for non-existent lesson', () => {
      const unlocked = isLessonUnlocked('P99-XX-BEG', []);

      expect(unlocked).toBe(false);
    });
  });

  // ==========================================
  // getAvailableLessons
  // ==========================================
  describe('getAvailableLessons', () => {
    it('should return only unlocked lessons with no completions', () => {
      const available = getAvailableLessons([]);

      // All beginner lessons should be available
      available.forEach(entry => {
        expect(entry.level).toBe('beginner');
      });
    });

    it('should include advanced when beginner is completed', () => {
      const available = getAvailableLessons(['P1-AA-BEG']);

      const aaAdvanced = available.find(e => e.lessonId === 'P1-AA-ADV');
      expect(aaAdvanced).toBeDefined();
    });
  });

  // ==========================================
  // getLessonProgress
  // ==========================================
  describe('getLessonProgress', () => {
    it('should return zero progress for empty completions', () => {
      const progress = getLessonProgress([]);

      expect(progress.completed).toBe(0);
      expect(progress.total).toBe(16);
      expect(progress.percentage).toBe(0);
    });

    it('should calculate correct percentage', () => {
      const progress = getLessonProgress(['P1-AA-BEG', 'P1-EE-BEG']);

      expect(progress.completed).toBe(2);
      expect(progress.percentage).toBe(13); // 2/16 = 12.5% → 13%
    });

    it('should ignore invalid lesson IDs', () => {
      const progress = getLessonProgress(['P1-AA-BEG', 'P99-XX-BEG']);

      expect(progress.completed).toBe(1);
    });
  });

  // ==========================================
  // getSoundInfo
  // ==========================================
  describe('getSoundInfo', () => {
    it('should return info for valid sound', () => {
      const info = getSoundInfo('aa');

      expect(info).not.toBeNull();
      expect(info).toHaveProperty('ipa');
      expect(info).toHaveProperty('descriptionES');
      expect(info).toHaveProperty('descriptionEN');
    });

    it('should handle case-insensitive input', () => {
      const info = getSoundInfo('AA');

      expect(info).not.toBeNull();
    });

    it('should return null for unknown sound', () => {
      const info = getSoundInfo('xyz');

      expect(info).toBeNull();
    });
  });

  // ==========================================
  // getAllSounds
  // ==========================================
  describe('getAllSounds', () => {
    it('should return array of sound strings', () => {
      const sounds = getAllSounds();

      expect(Array.isArray(sounds)).toBe(true);
      expect(sounds).toContain('aa');
      expect(sounds).toContain('ee');
      expect(sounds).toContain('oo');
      expect(sounds).toContain('uu');
    });
  });

  // ==========================================
  // getLessonMetadata
  // ==========================================
  describe('getLessonMetadata', () => {
    it('should return metadata for valid lesson', () => {
      const meta = getLessonMetadata('P1-AA-BEG');

      expect(meta).not.toBeNull();
      expect(meta.lessonId).toBe('P1-AA-BEG');
      expect(meta.sound).toBe('aa');
      expect(meta.level).toBe('beginner');
      expect(meta.phase).toBe(1);
      expect(meta.wordCount).toBeGreaterThan(0);
    });

    it('should return null for invalid lesson', () => {
      const meta = getLessonMetadata('P99-XX-BEG');

      expect(meta).toBeNull();
    });
  });

  // ==========================================
  // getLessonStats
  // ==========================================
  describe('getLessonStats', () => {
    it('should return overall statistics', () => {
      const stats = getLessonStats();

      expect(stats.totalLessons).toBe(16);
      expect(stats.totalWords).toBeGreaterThan(0);
      expect(stats.totalMinutes).toBeGreaterThan(0);
      expect(stats.phases).toBe(2);
    });
  });

  // ==========================================
  // findLessonsByWord
  // ==========================================
  describe('findLessonsByWord', () => {
    it('should find lessons containing a word', () => {
      const results = findLessonsByWord('naam');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].lessonId).toBe('P1-AA-BEG');
      expect(results[0].word.word).toBe('naam');
    });

    it('should be case-insensitive', () => {
      const results = findLessonsByWord('Naam');

      expect(results.length).toBeGreaterThan(0);
    });

    it('should return empty array for non-existent word', () => {
      const results = findLessonsByWord('xyzbogusword');

      expect(results).toEqual([]);
    });
  });

  // ==========================================
  // getFirstLesson
  // ==========================================
  describe('getFirstLesson', () => {
    it('should return the first lesson', () => {
      const first = getFirstLesson();

      expect(first.lessonId).toBe('P1-AA-BEG');
      expect(first.lesson).toBeDefined();
      expect(first.lesson.lessonId).toBe('P1-AA-BEG');
    });
  });

  // ==========================================
  // getLessonIndex
  // ==========================================
  describe('getLessonIndex', () => {
    it('should return 0 for first lesson', () => {
      expect(getLessonIndex('P1-AA-BEG')).toBe(0);
    });

    it('should return correct index for other lessons', () => {
      expect(getLessonIndex('P1-AA-ADV')).toBe(1);
      expect(getLessonIndex('P1-EE-BEG')).toBe(2);
    });

    it('should return -1 for non-existent lesson', () => {
      expect(getLessonIndex('P99-XX-BEG')).toBe(-1);
    });
  });
});
