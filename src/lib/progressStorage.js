/**
 * Progress Storage Module
 * Manages localStorage persistence for lesson progress, points, and badges
 *
 * @fileoverview Provides functions for tracking and persisting user progress
 * across browser sessions using localStorage.
 */

import { lessonOrder } from '../data/lessons/index.js';

/**
 * Storage keys for localStorage
 */
const STORAGE_KEYS = {
  COMPLETED_LESSONS: 'flipcards_completed_lessons',
  TOTAL_POINTS: 'flipcards_total_points',
  EARNED_BADGES: 'flipcards_earned_badges',
  QUIZ_HISTORY: 'flipcards_quiz_history',
};

/**
 * Get the list of completed lesson IDs
 * @returns {string[]} Array of completed lesson IDs
 */
export function getCompletedLessons() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Check if a specific lesson is completed
 * @param {string} lessonId - The lesson ID to check
 * @returns {boolean} True if the lesson is completed
 */
export function isLessonCompleted(lessonId) {
  const completed = getCompletedLessons();
  return completed.includes(lessonId);
}

/**
 * Mark a lesson as complete
 * @param {string} lessonId - The lesson ID to mark as complete
 */
export function markLessonComplete(lessonId) {
  const completed = getCompletedLessons();
  if (!completed.includes(lessonId)) {
    completed.push(lessonId);
    try {
      localStorage.setItem(STORAGE_KEYS.COMPLETED_LESSONS, JSON.stringify(completed));
    } catch {
      console.warn('Failed to save lesson completion to localStorage');
    }
  }
}

/**
 * Get the total accumulated points
 * @returns {number} Total points
 */
export function getTotalPoints() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TOTAL_POINTS);
    if (!stored) {
      return 0;
    }
    const points = parseInt(stored, 10);
    return isNaN(points) ? 0 : points;
  } catch {
    return 0;
  }
}

/**
 * Add points to the total
 * @param {number} points - Points to add
 * @returns {number} New total points
 */
export function addPoints(points) {
  const current = getTotalPoints();
  const newTotal = current + points;
  try {
    localStorage.setItem(STORAGE_KEYS.TOTAL_POINTS, String(newTotal));
  } catch {
    console.warn('Failed to save points to localStorage');
  }
  return newTotal;
}

/**
 * Get overall progress summary
 * @returns {{ completed: number, total: number, percentage: number, points: number }}
 */
export function getProgress() {
  const completed = getCompletedLessons();
  const total = lessonOrder.length;
  const percentage = total > 0 ? Math.round((completed.length / total) * 100) : 0;
  const points = getTotalPoints();

  return {
    completed: completed.length,
    total,
    percentage,
    points,
  };
}

/**
 * Check if an advanced lesson is unlocked
 * An advanced lesson is unlocked when its corresponding beginner lesson is completed
 * @param {string} lessonId - The lesson ID to check (e.g., 'P1-AA-ADV')
 * @returns {boolean} True if the lesson is unlocked
 */
export function isLessonUnlocked(lessonId) {
  // Beginner lessons are always unlocked
  if (lessonId.endsWith('-BEG')) {
    return true;
  }

  // Advanced lessons require their beginner counterpart
  if (lessonId.endsWith('-ADV')) {
    const beginnerLessonId = lessonId.replace('-ADV', '-BEG');
    return isLessonCompleted(beginnerLessonId);
  }

  // Unknown format, assume unlocked
  return true;
}

/**
 * Reset all progress data
 * WARNING: This permanently deletes all progress
 */
export function resetProgress() {
  try {
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_LESSONS);
    localStorage.removeItem(STORAGE_KEYS.TOTAL_POINTS);
    localStorage.removeItem(STORAGE_KEYS.EARNED_BADGES);
    localStorage.removeItem(STORAGE_KEYS.QUIZ_HISTORY);
  } catch {
    console.warn('Failed to reset progress in localStorage');
  }
}

/**
 * Point milestone thresholds for stars (3-star system per level)
 * Bronze → Silver → Gold progression
 * @type {Array<{level: string, points: number, color: string, nameES: string, nameEN: string}>}
 */
export const MILESTONES = [
  { level: 'bronze', points: 300, color: '#CD7F32', nameES: 'Bronce', nameEN: 'Bronze' },
  { level: 'silver', points: 800, color: '#C0C0C0', nameES: 'Plata', nameEN: 'Silver' },
  { level: 'gold', points: 1500, color: '#FFD700', nameES: 'Oro', nameEN: 'Gold' },
];

/**
 * Get the current milestone level based on points
 * @param {number} [points] - Points to check (defaults to current total)
 * @returns {{ level: string, points: number, color: string, nameES: string, nameEN: string } | null}
 */
export function getCurrentMilestone(points) {
  const totalPoints = points !== undefined ? points : getTotalPoints();
  let currentMilestone = null;

  for (const milestone of MILESTONES) {
    if (totalPoints >= milestone.points) {
      currentMilestone = milestone;
    } else {
      break;
    }
  }

  return currentMilestone;
}

/**
 * Get the next milestone to achieve
 * @param {number} [points] - Points to check (defaults to current total)
 * @returns {{ level: string, points: number, color: string, nameES: string, nameEN: string, remaining: number } | null}
 */
export function getNextMilestone(points) {
  const totalPoints = points !== undefined ? points : getTotalPoints();

  for (const milestone of MILESTONES) {
    if (totalPoints < milestone.points) {
      return {
        ...milestone,
        remaining: milestone.points - totalPoints,
      };
    }
  }

  return null; // All milestones achieved
}

/**
 * Get all achieved milestones
 * @param {number} [points] - Points to check (defaults to current total)
 * @returns {Array<{ level: string, points: number, color: string, nameES: string, nameEN: string }>}
 */
export function getAchievedMilestones(points) {
  const totalPoints = points !== undefined ? points : getTotalPoints();
  return MILESTONES.filter(m => totalPoints >= m.points);
}

/**
 * Check if adding points would trigger a new milestone
 * @param {number} pointsToAdd - Points about to be added
 * @returns {{ level: string, points: number, color: string, nameES: string, nameEN: string } | null}
 */
export function checkNewMilestone(pointsToAdd) {
  const currentPoints = getTotalPoints();
  const newPoints = currentPoints + pointsToAdd;

  const currentMilestone = getCurrentMilestone(currentPoints);
  const newMilestone = getCurrentMilestone(newPoints);

  // If we crossed into a new milestone
  if (newMilestone && (!currentMilestone || newMilestone.level !== currentMilestone.level)) {
    return newMilestone;
  }

  return null;
}

// ==========================================
// Badge Tracking Functions
// ==========================================

/**
 * @typedef {Object} QuizAttempt
 * @property {string} lessonId - The lesson ID
 * @property {number} score - Number of correct answers
 * @property {number} total - Total questions
 * @property {boolean} passed - Whether the quiz was passed
 * @property {number} timestamp - Unix timestamp
 */

/**
 * @typedef {Object} EarnedBadge
 * @property {string} id - Badge ID
 * @property {number} earnedAt - Unix timestamp when earned
 */

/**
 * Get the list of earned badges
 * @returns {EarnedBadge[]} Array of earned badge objects
 */
export function getEarnedBadges() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.EARNED_BADGES);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Check if a specific badge has been earned
 * @param {string} badgeId - The badge ID to check
 * @returns {boolean} True if the badge is earned
 */
export function isBadgeEarned(badgeId) {
  const earned = getEarnedBadges();
  return earned.some(b => b.id === badgeId);
}

/**
 * Award a badge to the user
 * @param {string} badgeId - The badge ID to award
 * @returns {boolean} True if badge was newly awarded, false if already earned
 */
export function awardBadge(badgeId) {
  if (isBadgeEarned(badgeId)) {
    return false;
  }

  const earned = getEarnedBadges();
  earned.push({
    id: badgeId,
    earnedAt: Date.now(),
  });

  try {
    localStorage.setItem(STORAGE_KEYS.EARNED_BADGES, JSON.stringify(earned));
    return true;
  } catch {
    console.warn('Failed to save badge to localStorage');
    return false;
  }
}

/**
 * Get the quiz attempt history
 * @returns {QuizAttempt[]} Array of quiz attempts
 */
export function getQuizHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Record a quiz attempt
 * @param {string} lessonId - The lesson ID
 * @param {number} score - Number of correct answers
 * @param {number} total - Total questions
 * @param {boolean} passed - Whether the quiz was passed
 */
export function recordQuizAttempt(lessonId, score, total, passed) {
  const history = getQuizHistory();
  history.push({
    lessonId,
    score,
    total,
    passed,
    timestamp: Date.now(),
  });

  try {
    localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(history));
  } catch {
    console.warn('Failed to save quiz history to localStorage');
  }
}

/**
 * Get quiz attempts for a specific lesson
 * @param {string} lessonId - The lesson ID
 * @returns {QuizAttempt[]} Array of quiz attempts for that lesson
 */
export function getQuizAttemptsForLesson(lessonId) {
  const history = getQuizHistory();
  return history.filter(attempt => attempt.lessonId === lessonId);
}

/**
 * Get total count of completed quizzes
 * @returns {number} Total quiz count
 */
export function getTotalQuizCount() {
  return getQuizHistory().length;
}

/**
 * Check badge criteria and award any newly earned badges
 * Call this after a quiz is completed
 * @param {Object} quizResult - The quiz result
 * @param {string} quizResult.lessonId - The lesson ID
 * @param {number} quizResult.score - Number of correct answers
 * @param {number} quizResult.total - Total questions
 * @param {boolean} quizResult.passed - Whether the quiz was passed
 * @returns {string[]} Array of newly awarded badge IDs
 */
export function checkAndAwardBadges(quizResult) {
  const newBadges = [];
  const { lessonId, score, total, passed } = quizResult;

  // Check: perfect-score (100% on any quiz)
  if (score === total && total > 0) {
    if (awardBadge('perfect-score')) {
      newBadges.push('perfect-score');
    }
  }

  // Check: first-steps (complete first lesson)
  const completedLessons = getCompletedLessons();
  if (passed && completedLessons.length === 0) {
    // This is their first completion (before we mark it complete)
    if (awardBadge('first-steps')) {
      newBadges.push('first-steps');
    }
  }

  // Check: practice-master (complete 10 quizzes)
  const quizCount = getTotalQuizCount();
  if (quizCount >= 10) {
    if (awardBadge('practice-master')) {
      newBadges.push('practice-master');
    }
  }

  // Check: never-give-up (score 0 and retry)
  // Look for a previous 0-score attempt on any lesson
  const history = getQuizHistory();
  const hasZeroScore = history.some(
    attempt => attempt.score === 0 && attempt.timestamp < Date.now() - 1000,
  );
  if (hasZeroScore && history.length > 1) {
    if (awardBadge('never-give-up')) {
      newBadges.push('never-give-up');
    }
  }

  // Check: perseverance (fail then pass same lesson)
  const lessonAttempts = getQuizAttemptsForLesson(lessonId);
  const previousFail = lessonAttempts.some(
    attempt => !attempt.passed && attempt.timestamp < Date.now() - 1000,
  );
  if (passed && previousFail) {
    if (awardBadge('perseverance')) {
      newBadges.push('perseverance');
    }
  }

  // Check: sound mastery badges (complete both BEG and ADV for a sound)
  const sounds = ['aa', 'ee', 'oo', 'uu'];
  for (const sound of sounds) {
    const begId = `P1-${sound.toUpperCase()}-BEG`;
    const advId = `P1-${sound.toUpperCase()}-ADV`;
    const begComplete = isLessonCompleted(begId) || (passed && lessonId === begId);
    const advComplete = isLessonCompleted(advId) || (passed && lessonId === advId);

    if (begComplete && advComplete) {
      const badgeId = `sound-master-${sound}`;
      if (awardBadge(badgeId)) {
        newBadges.push(badgeId);
      }
    }
  }

  // Check: level-1-complete (complete all 8 lessons)
  const willHaveCompleted = passed && !completedLessons.includes(lessonId)
    ? completedLessons.length + 1
    : completedLessons.length;
  if (willHaveCompleted >= 8) {
    if (awardBadge('level-1-complete')) {
      newBadges.push('level-1-complete');
    }
  }

  return newBadges;
}

/**
 * Export storage keys for testing purposes
 */
export { STORAGE_KEYS };
