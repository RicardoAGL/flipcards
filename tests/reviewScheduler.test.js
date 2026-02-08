/**
 * Review Scheduler Tests
 * Tests for spaced repetition interval calculation and lesson selection
 */

import { describe, it, expect } from 'vitest';
import {
  REVIEW_INTERVALS,
  getReviewInterval,
  isLessonDueForReview,
  getReviewUrgency,
  getLessonsDueForReview,
  selectReviewLessons,
} from '../src/lib/reviewScheduler.js';

const DAY_MS = 24 * 60 * 60 * 1000;

describe('Review Scheduler', () => {
  // ==========================================
  // REVIEW_INTERVALS
  // ==========================================
  describe('REVIEW_INTERVALS', () => {
    it('should have 5 intervals', () => {
      expect(REVIEW_INTERVALS).toHaveLength(5);
    });

    it('should be in ascending order', () => {
      for (let i = 1; i < REVIEW_INTERVALS.length; i++) {
        expect(REVIEW_INTERVALS[i]).toBeGreaterThan(REVIEW_INTERVALS[i - 1]);
      }
    });

    it('should start at 1 day', () => {
      expect(REVIEW_INTERVALS[0]).toBe(1);
    });

    it('should end at 30 days', () => {
      expect(REVIEW_INTERVALS[REVIEW_INTERVALS.length - 1]).toBe(30);
    });
  });

  // ==========================================
  // getReviewInterval
  // ==========================================
  describe('getReviewInterval', () => {
    it('should return 1 day for 0 completed reviews', () => {
      expect(getReviewInterval(0)).toBe(1);
    });

    it('should return 3 days for 1 completed review', () => {
      expect(getReviewInterval(1)).toBe(3);
    });

    it('should return 7 days for 2 completed reviews', () => {
      expect(getReviewInterval(2)).toBe(7);
    });

    it('should return 14 days for 3 completed reviews', () => {
      expect(getReviewInterval(3)).toBe(14);
    });

    it('should return 30 days for 4 completed reviews', () => {
      expect(getReviewInterval(4)).toBe(30);
    });

    it('should cap at 30 days for reviews beyond the schedule', () => {
      expect(getReviewInterval(10)).toBe(30);
      expect(getReviewInterval(100)).toBe(30);
    });
  });

  // ==========================================
  // isLessonDueForReview
  // ==========================================
  describe('isLessonDueForReview', () => {
    const now = Date.now();

    it('should return true when interval has elapsed', () => {
      const lastReview = now - (2 * DAY_MS); // 2 days ago
      expect(isLessonDueForReview(lastReview, 0, now)).toBe(true); // interval = 1 day
    });

    it('should return false when interval has not elapsed', () => {
      const lastReview = now - (0.5 * DAY_MS); // 12 hours ago
      expect(isLessonDueForReview(lastReview, 0, now)).toBe(false); // interval = 1 day
    });

    it('should return true exactly at interval boundary', () => {
      const lastReview = now - (1 * DAY_MS); // exactly 1 day ago
      expect(isLessonDueForReview(lastReview, 0, now)).toBe(true);
    });

    it('should use longer intervals for higher review counts', () => {
      const lastReview = now - (2 * DAY_MS); // 2 days ago
      // 0 reviews: interval 1 day → due
      expect(isLessonDueForReview(lastReview, 0, now)).toBe(true);
      // 1 review: interval 3 days → not due
      expect(isLessonDueForReview(lastReview, 1, now)).toBe(false);
    });
  });

  // ==========================================
  // getReviewUrgency
  // ==========================================
  describe('getReviewUrgency', () => {
    const now = Date.now();

    it('should return 0 when just reviewed', () => {
      expect(getReviewUrgency(now, 0, now)).toBe(0);
    });

    it('should return 100 when exactly at interval', () => {
      const lastReview = now - (1 * DAY_MS); // 1 day ago, interval = 1 day
      expect(getReviewUrgency(lastReview, 0, now)).toBe(100);
    });

    it('should cap at 100 for overdue reviews', () => {
      const lastReview = now - (10 * DAY_MS); // 10 days ago, interval = 1 day
      expect(getReviewUrgency(lastReview, 0, now)).toBe(100);
    });

    it('should return 50 at half the interval', () => {
      const lastReview = now - (0.5 * DAY_MS); // 12 hours ago, interval = 1 day
      expect(getReviewUrgency(lastReview, 0, now)).toBe(50);
    });

    it('should scale with review count intervals', () => {
      const lastReview = now - (1 * DAY_MS);
      // 0 reviews: 1 day interval → 100% urgency
      const urgency0 = getReviewUrgency(lastReview, 0, now);
      // 1 review: 3 day interval → ~33% urgency
      const urgency1 = getReviewUrgency(lastReview, 1, now);

      expect(urgency0).toBeGreaterThan(urgency1);
    });
  });

  // ==========================================
  // getLessonsDueForReview
  // ==========================================
  describe('getLessonsDueForReview', () => {
    const now = Date.now();

    it('should return empty when no lessons have review dates', () => {
      const result = getLessonsDueForReview(['P1-AA-BEG'], {}, {}, now);
      expect(result).toEqual([]);
    });

    it('should return due lessons sorted by urgency', () => {
      const reviewDates = {
        'P1-AA-BEG': now - (5 * DAY_MS), // 5 days ago
        'P1-EE-BEG': now - (2 * DAY_MS), // 2 days ago
      };
      const reviewCounts = {
        'P1-AA-BEG': 0,
        'P1-EE-BEG': 0,
      };
      const result = getLessonsDueForReview(
        ['P1-AA-BEG', 'P1-EE-BEG'],
        reviewDates,
        reviewCounts,
        now,
      );

      expect(result).toHaveLength(2);
      // More overdue lesson first
      expect(result[0].lessonId).toBe('P1-AA-BEG');
      expect(result[1].lessonId).toBe('P1-EE-BEG');
    });

    it('should not include lessons that are not yet due', () => {
      const reviewDates = {
        'P1-AA-BEG': now - (0.5 * DAY_MS), // 12 hours ago, not due yet
      };
      const reviewCounts = { 'P1-AA-BEG': 0 };

      const result = getLessonsDueForReview(
        ['P1-AA-BEG'],
        reviewDates,
        reviewCounts,
        now,
      );

      expect(result).toHaveLength(0);
    });

    it('should only include completed lesson IDs', () => {
      const reviewDates = {
        'P1-AA-BEG': now - (5 * DAY_MS),
        'P1-EE-BEG': now - (5 * DAY_MS),
      };
      const reviewCounts = { 'P1-AA-BEG': 0, 'P1-EE-BEG': 0 };

      // Only P1-AA-BEG is "completed"
      const result = getLessonsDueForReview(
        ['P1-AA-BEG'],
        reviewDates,
        reviewCounts,
        now,
      );

      expect(result).toHaveLength(1);
      expect(result[0].lessonId).toBe('P1-AA-BEG');
    });

    it('should include urgency and metadata in results', () => {
      const reviewDates = {
        'P1-AA-BEG': now - (2 * DAY_MS),
      };
      const reviewCounts = { 'P1-AA-BEG': 0 };

      const result = getLessonsDueForReview(
        ['P1-AA-BEG'],
        reviewDates,
        reviewCounts,
        now,
      );

      expect(result[0]).toHaveProperty('lessonId');
      expect(result[0]).toHaveProperty('urgency');
      expect(result[0]).toHaveProperty('lastReview');
      expect(result[0]).toHaveProperty('reviewCount');
    });

    it('should default review count to 0 when not provided', () => {
      const reviewDates = {
        'P1-AA-BEG': now - (2 * DAY_MS),
      };

      const result = getLessonsDueForReview(
        ['P1-AA-BEG'],
        reviewDates,
        {}, // no review counts
        now,
      );

      expect(result).toHaveLength(1);
      expect(result[0].reviewCount).toBe(0);
    });
  });

  // ==========================================
  // selectReviewLessons
  // ==========================================
  describe('selectReviewLessons', () => {
    it('should select top N lessons', () => {
      const dueLessons = [
        { lessonId: 'P1-AA-BEG', urgency: 100, lastReview: 0, reviewCount: 0 },
        { lessonId: 'P1-EE-BEG', urgency: 80, lastReview: 0, reviewCount: 0 },
        { lessonId: 'P1-OO-BEG', urgency: 60, lastReview: 0, reviewCount: 0 },
      ];

      const result = selectReviewLessons(dueLessons, 2);
      expect(result).toHaveLength(2);
      expect(result[0].lessonId).toBe('P1-AA-BEG');
      expect(result[1].lessonId).toBe('P1-EE-BEG');
    });

    it('should return all lessons when fewer than max', () => {
      const dueLessons = [
        { lessonId: 'P1-AA-BEG', urgency: 100, lastReview: 0, reviewCount: 0 },
      ];

      const result = selectReviewLessons(dueLessons, 5);
      expect(result).toHaveLength(1);
    });

    it('should default to max 5 lessons', () => {
      const dueLessons = Array.from({ length: 8 }, (_, i) => ({
        lessonId: `lesson-${i}`,
        urgency: 100 - i,
        lastReview: 0,
        reviewCount: 0,
      }));

      const result = selectReviewLessons(dueLessons);
      expect(result).toHaveLength(5);
    });

    it('should return empty array for empty input', () => {
      const result = selectReviewLessons([]);
      expect(result).toEqual([]);
    });
  });
});
