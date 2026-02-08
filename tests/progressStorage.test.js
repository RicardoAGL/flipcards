/**
 * Progress Storage Tests
 * Tests for localStorage-based progress persistence
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getCompletedLessons,
  isLessonCompleted,
  markLessonComplete,
  getTotalPoints,
  addPoints,
  getProgress,
  isLessonUnlocked,
  resetProgress,
  STORAGE_KEYS,
  MILESTONES,
  getCurrentMilestone,
  getNextMilestone,
  getAchievedMilestones,
  checkNewMilestone,
  getEarnedBadges,
  isBadgeEarned,
  awardBadge,
  getQuizHistory,
  recordQuizAttempt,
  getQuizAttemptsForLesson,
  getTotalQuizCount,
  checkAndAwardBadges,
} from '../src/lib/progressStorage.js';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('Progress Storage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('getCompletedLessons', () => {
    it('should return empty array when no lessons completed', () => {
      const result = getCompletedLessons();
      expect(result).toEqual([]);
    });

    it('should return completed lessons from storage', () => {
      localStorageMock.setItem(
        STORAGE_KEYS.COMPLETED_LESSONS,
        JSON.stringify(['P1-AA-BEG', 'P1-EE-BEG'])
      );

      const result = getCompletedLessons();
      expect(result).toEqual(['P1-AA-BEG', 'P1-EE-BEG']);
    });

    it('should handle invalid JSON gracefully', () => {
      localStorageMock.setItem(STORAGE_KEYS.COMPLETED_LESSONS, 'invalid-json');

      const result = getCompletedLessons();
      expect(result).toEqual([]);
    });
  });

  describe('isLessonCompleted', () => {
    it('should return false for incomplete lesson', () => {
      expect(isLessonCompleted('P1-AA-BEG')).toBe(false);
    });

    it('should return true for completed lesson', () => {
      localStorageMock.setItem(
        STORAGE_KEYS.COMPLETED_LESSONS,
        JSON.stringify(['P1-AA-BEG'])
      );

      expect(isLessonCompleted('P1-AA-BEG')).toBe(true);
    });
  });

  describe('markLessonComplete', () => {
    it('should add lesson to completed list', () => {
      markLessonComplete('P1-AA-BEG');

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.COMPLETED_LESSONS,
        JSON.stringify(['P1-AA-BEG'])
      );
    });

    it('should not duplicate completed lessons', () => {
      localStorageMock.setItem(
        STORAGE_KEYS.COMPLETED_LESSONS,
        JSON.stringify(['P1-AA-BEG'])
      );

      markLessonComplete('P1-AA-BEG');

      // Should not be called again since lesson already exists
      const calls = localStorageMock.setItem.mock.calls.filter(
        (call) => call[0] === STORAGE_KEYS.COMPLETED_LESSONS
      );
      // Initial set + no additional set for duplicate
      expect(calls.length).toBe(1);
    });

    it('should append to existing completed lessons', () => {
      localStorageMock.setItem(
        STORAGE_KEYS.COMPLETED_LESSONS,
        JSON.stringify(['P1-AA-BEG'])
      );

      markLessonComplete('P1-EE-BEG');

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.COMPLETED_LESSONS,
        JSON.stringify(['P1-AA-BEG', 'P1-EE-BEG'])
      );
    });
  });

  describe('getTotalPoints', () => {
    it('should return 0 when no points stored', () => {
      expect(getTotalPoints()).toBe(0);
    });

    it('should return stored points', () => {
      localStorageMock.setItem(STORAGE_KEYS.TOTAL_POINTS, '100');

      expect(getTotalPoints()).toBe(100);
    });

    it('should handle invalid value gracefully', () => {
      localStorageMock.setItem(STORAGE_KEYS.TOTAL_POINTS, 'not-a-number');

      expect(getTotalPoints()).toBe(0);
    });
  });

  describe('addPoints', () => {
    it('should add points to empty storage', () => {
      const result = addPoints(50);

      expect(result).toBe(50);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.TOTAL_POINTS,
        '50'
      );
    });

    it('should accumulate points', () => {
      localStorageMock.setItem(STORAGE_KEYS.TOTAL_POINTS, '100');

      const result = addPoints(50);

      expect(result).toBe(150);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.TOTAL_POINTS,
        '150'
      );
    });
  });

  describe('getProgress', () => {
    it('should return correct progress summary', () => {
      localStorageMock.setItem(
        STORAGE_KEYS.COMPLETED_LESSONS,
        JSON.stringify(['P1-AA-BEG', 'P1-EE-BEG'])
      );
      localStorageMock.setItem(STORAGE_KEYS.TOTAL_POINTS, '200');

      const progress = getProgress();

      expect(progress.completed).toBe(2);
      expect(progress.total).toBe(8); // 8 lessons total
      expect(progress.percentage).toBe(25);
      expect(progress.points).toBe(200);
    });

    it('should return zeros for empty progress', () => {
      const progress = getProgress();

      expect(progress.completed).toBe(0);
      expect(progress.total).toBe(8);
      expect(progress.percentage).toBe(0);
      expect(progress.points).toBe(0);
    });
  });

  describe('isLessonUnlocked', () => {
    it('should return true for beginner lessons', () => {
      expect(isLessonUnlocked('P1-AA-BEG')).toBe(true);
      expect(isLessonUnlocked('P1-EE-BEG')).toBe(true);
    });

    it('should return false for advanced lessons when beginner not complete', () => {
      expect(isLessonUnlocked('P1-AA-ADV')).toBe(false);
    });

    it('should return true for advanced lessons when beginner is complete', () => {
      localStorageMock.setItem(
        STORAGE_KEYS.COMPLETED_LESSONS,
        JSON.stringify(['P1-AA-BEG'])
      );

      expect(isLessonUnlocked('P1-AA-ADV')).toBe(true);
    });

    it('should not unlock other sounds advanced lessons', () => {
      localStorageMock.setItem(
        STORAGE_KEYS.COMPLETED_LESSONS,
        JSON.stringify(['P1-AA-BEG'])
      );

      expect(isLessonUnlocked('P1-EE-ADV')).toBe(false);
    });
  });

  describe('resetProgress', () => {
    it('should clear all progress data', () => {
      localStorageMock.setItem(
        STORAGE_KEYS.COMPLETED_LESSONS,
        JSON.stringify(['P1-AA-BEG'])
      );
      localStorageMock.setItem(STORAGE_KEYS.TOTAL_POINTS, '100');

      resetProgress();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        STORAGE_KEYS.COMPLETED_LESSONS
      );
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        STORAGE_KEYS.TOTAL_POINTS
      );
    });
  });

  describe('MILESTONES', () => {
    it('should have 3 milestone levels (Bronze, Silver, Gold)', () => {
      expect(MILESTONES).toHaveLength(3);
    });

    it('should have correct point thresholds', () => {
      expect(MILESTONES[0].points).toBe(200);
      expect(MILESTONES[1].points).toBe(640);
      expect(MILESTONES[2].points).toBe(1280);
    });

    it('should have correct level names', () => {
      expect(MILESTONES[0].level).toBe('bronze');
      expect(MILESTONES[1].level).toBe('silver');
      expect(MILESTONES[2].level).toBe('gold');
    });
  });

  describe('getCurrentMilestone', () => {
    it('should return null when below first milestone', () => {
      expect(getCurrentMilestone(100)).toBeNull();
    });

    it('should return bronze at 200 points', () => {
      const milestone = getCurrentMilestone(200);
      expect(milestone.level).toBe('bronze');
    });

    it('should return silver at 640 points', () => {
      const milestone = getCurrentMilestone(640);
      expect(milestone.level).toBe('silver');
    });

    it('should return gold at 1280 points', () => {
      const milestone = getCurrentMilestone(1280);
      expect(milestone.level).toBe('gold');
    });

    it('should return previous milestone when between thresholds', () => {
      const milestone = getCurrentMilestone(400);
      expect(milestone.level).toBe('bronze');
    });
  });

  describe('getNextMilestone', () => {
    it('should return bronze as first milestone', () => {
      const next = getNextMilestone(0);
      expect(next.level).toBe('bronze');
      expect(next.remaining).toBe(200);
    });

    it('should return silver after bronze', () => {
      const next = getNextMilestone(200);
      expect(next.level).toBe('silver');
      expect(next.remaining).toBe(440);
    });

    it('should return gold after silver', () => {
      const next = getNextMilestone(640);
      expect(next.level).toBe('gold');
      expect(next.remaining).toBe(640);
    });

    it('should return null when all milestones achieved', () => {
      const next = getNextMilestone(1280);
      expect(next).toBeNull();
    });

    it('should calculate correct remaining points', () => {
      const next = getNextMilestone(100);
      expect(next.remaining).toBe(100);
    });
  });

  describe('getAchievedMilestones', () => {
    it('should return empty array when below first milestone', () => {
      const achieved = getAchievedMilestones(100);
      expect(achieved).toHaveLength(0);
    });

    it('should return one milestone at bronze', () => {
      const achieved = getAchievedMilestones(200);
      expect(achieved).toHaveLength(1);
      expect(achieved[0].level).toBe('bronze');
    });

    it('should return all milestones at gold', () => {
      const achieved = getAchievedMilestones(1280);
      expect(achieved).toHaveLength(3);
    });
  });

  describe('checkNewMilestone', () => {
    it('should return null when no new milestone reached', () => {
      localStorageMock.setItem(STORAGE_KEYS.TOTAL_POINTS, '100');
      const result = checkNewMilestone(50);
      expect(result).toBeNull();
    });

    it('should return bronze when crossing 200 threshold', () => {
      localStorageMock.setItem(STORAGE_KEYS.TOTAL_POINTS, '150');
      const result = checkNewMilestone(100);
      expect(result).not.toBeNull();
      expect(result.level).toBe('bronze');
    });

    it('should return silver when crossing 640 threshold', () => {
      localStorageMock.setItem(STORAGE_KEYS.TOTAL_POINTS, '600');
      const result = checkNewMilestone(100);
      expect(result).not.toBeNull();
      expect(result.level).toBe('silver');
    });

    it('should return gold when crossing 1280 threshold', () => {
      localStorageMock.setItem(STORAGE_KEYS.TOTAL_POINTS, '1200');
      const result = checkNewMilestone(200);
      expect(result).not.toBeNull();
      expect(result.level).toBe('gold');
    });

    it('should return null when already at a milestone', () => {
      localStorageMock.setItem(STORAGE_KEYS.TOTAL_POINTS, '200');
      const result = checkNewMilestone(100);
      expect(result).toBeNull();
    });
  });

  // Badge Tracking Tests
  describe('getEarnedBadges', () => {
    it('should return empty array when no badges earned', () => {
      expect(getEarnedBadges()).toEqual([]);
    });

    it('should return earned badges from storage', () => {
      const badges = [{ id: 'first-steps', earnedAt: 1234567890 }];
      localStorageMock.setItem(STORAGE_KEYS.EARNED_BADGES, JSON.stringify(badges));

      expect(getEarnedBadges()).toEqual(badges);
    });

    it('should handle invalid JSON gracefully', () => {
      localStorageMock.setItem(STORAGE_KEYS.EARNED_BADGES, 'invalid-json');

      expect(getEarnedBadges()).toEqual([]);
    });
  });

  describe('isBadgeEarned', () => {
    it('should return false when badge not earned', () => {
      expect(isBadgeEarned('first-steps')).toBe(false);
    });

    it('should return true when badge is earned', () => {
      const badges = [{ id: 'first-steps', earnedAt: 1234567890 }];
      localStorageMock.setItem(STORAGE_KEYS.EARNED_BADGES, JSON.stringify(badges));

      expect(isBadgeEarned('first-steps')).toBe(true);
    });
  });

  describe('awardBadge', () => {
    it('should award badge and return true', () => {
      const result = awardBadge('first-steps');

      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.EARNED_BADGES,
        expect.stringContaining('first-steps')
      );
    });

    it('should not duplicate badges and return false', () => {
      const badges = [{ id: 'first-steps', earnedAt: 1234567890 }];
      localStorageMock.setItem(STORAGE_KEYS.EARNED_BADGES, JSON.stringify(badges));

      const result = awardBadge('first-steps');

      expect(result).toBe(false);
    });
  });

  describe('getQuizHistory', () => {
    it('should return empty array when no history', () => {
      expect(getQuizHistory()).toEqual([]);
    });

    it('should return quiz history from storage', () => {
      const history = [
        { lessonId: 'P1-AA-BEG', score: 4, total: 5, passed: true, timestamp: 123 },
      ];
      localStorageMock.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(history));

      expect(getQuizHistory()).toEqual(history);
    });
  });

  describe('recordQuizAttempt', () => {
    it('should record quiz attempt', () => {
      recordQuizAttempt('P1-AA-BEG', 4, 5, true);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.QUIZ_HISTORY,
        expect.stringContaining('P1-AA-BEG')
      );
    });

    it('should append to existing history', () => {
      const existing = [
        { lessonId: 'P1-AA-BEG', score: 3, total: 5, passed: false, timestamp: 100 },
      ];
      localStorageMock.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(existing));

      recordQuizAttempt('P1-EE-BEG', 5, 5, true);

      const calls = localStorageMock.setItem.mock.calls.filter(
        (c) => c[0] === STORAGE_KEYS.QUIZ_HISTORY
      );
      const lastCall = calls[calls.length - 1];
      const saved = JSON.parse(lastCall[1]);

      expect(saved).toHaveLength(2);
    });
  });

  describe('getQuizAttemptsForLesson', () => {
    it('should filter attempts by lesson ID', () => {
      const history = [
        { lessonId: 'P1-AA-BEG', score: 3, total: 5, passed: false, timestamp: 100 },
        { lessonId: 'P1-EE-BEG', score: 5, total: 5, passed: true, timestamp: 200 },
        { lessonId: 'P1-AA-BEG', score: 4, total: 5, passed: true, timestamp: 300 },
      ];
      localStorageMock.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(history));

      const attempts = getQuizAttemptsForLesson('P1-AA-BEG');

      expect(attempts).toHaveLength(2);
      expect(attempts.every((a) => a.lessonId === 'P1-AA-BEG')).toBe(true);
    });
  });

  describe('getTotalQuizCount', () => {
    it('should return total number of quizzes', () => {
      const history = [
        { lessonId: 'P1-AA-BEG', score: 3, total: 5, passed: false, timestamp: 100 },
        { lessonId: 'P1-EE-BEG', score: 5, total: 5, passed: true, timestamp: 200 },
      ];
      localStorageMock.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(history));

      expect(getTotalQuizCount()).toBe(2);
    });
  });

  describe('checkAndAwardBadges', () => {
    it('should award perfect-score badge on 100%', () => {
      const result = checkAndAwardBadges({
        lessonId: 'P1-AA-BEG',
        score: 5,
        total: 5,
        passed: true,
      });

      expect(result).toContain('perfect-score');
    });

    it('should award first-steps badge on first lesson pass', () => {
      const result = checkAndAwardBadges({
        lessonId: 'P1-AA-BEG',
        score: 4,
        total: 5,
        passed: true,
      });

      expect(result).toContain('first-steps');
    });

    it('should not award first-steps badge if lessons already completed', () => {
      localStorageMock.setItem(
        STORAGE_KEYS.COMPLETED_LESSONS,
        JSON.stringify(['P1-EE-BEG'])
      );

      const result = checkAndAwardBadges({
        lessonId: 'P1-AA-BEG',
        score: 4,
        total: 5,
        passed: true,
      });

      expect(result).not.toContain('first-steps');
    });

    it('should award practice-master badge after 10 passed quizzes', () => {
      const history = Array(10)
        .fill(null)
        .map((_, i) => ({
          lessonId: 'P1-AA-BEG',
          score: 4,
          total: 5,
          passed: true,
          timestamp: i * 1000,
        }));
      localStorageMock.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(history));

      const result = checkAndAwardBadges({
        lessonId: 'P1-AA-BEG',
        score: 4,
        total: 5,
        passed: true,
      });

      expect(result).toContain('practice-master');
    });

    it('should award sound-master badge when both BEG and ADV complete', () => {
      localStorageMock.setItem(
        STORAGE_KEYS.COMPLETED_LESSONS,
        JSON.stringify(['P1-AA-BEG'])
      );

      const result = checkAndAwardBadges({
        lessonId: 'P1-AA-ADV',
        score: 4,
        total: 5,
        passed: true,
      });

      expect(result).toContain('sound-master-aa');
    });

    it('should award level-1-complete when all 8 lessons done', () => {
      localStorageMock.setItem(
        STORAGE_KEYS.COMPLETED_LESSONS,
        JSON.stringify([
          'P1-AA-BEG',
          'P1-AA-ADV',
          'P1-EE-BEG',
          'P1-EE-ADV',
          'P1-OO-BEG',
          'P1-OO-ADV',
          'P1-UU-BEG',
        ])
      );

      const result = checkAndAwardBadges({
        lessonId: 'P1-UU-ADV',
        score: 4,
        total: 5,
        passed: true,
      });

      expect(result).toContain('level-1-complete');
    });

    it('should not duplicate badges', () => {
      const badges = [{ id: 'perfect-score', earnedAt: 1234567890 }];
      localStorageMock.setItem(STORAGE_KEYS.EARNED_BADGES, JSON.stringify(badges));

      const result = checkAndAwardBadges({
        lessonId: 'P1-AA-BEG',
        score: 5,
        total: 5,
        passed: true,
      });

      expect(result).not.toContain('perfect-score');
    });
  });

  describe('resetProgress with badges', () => {
    it('should clear badges and quiz history', () => {
      localStorageMock.setItem(
        STORAGE_KEYS.EARNED_BADGES,
        JSON.stringify([{ id: 'first-steps', earnedAt: 123 }])
      );
      localStorageMock.setItem(
        STORAGE_KEYS.QUIZ_HISTORY,
        JSON.stringify([{ lessonId: 'P1-AA-BEG', score: 5, total: 5, passed: true, timestamp: 123 }])
      );

      resetProgress();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.EARNED_BADGES);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.QUIZ_HISTORY);
    });
  });
});
