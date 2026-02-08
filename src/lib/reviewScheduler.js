/**
 * Spaced Repetition Review Scheduler
 * Pure functions for computing review intervals, urgency, and due lessons
 *
 * @fileoverview Implements a simplified spaced repetition system with
 * fixed intervals indexed by review count.
 */

/**
 * Review interval schedule in days, indexed by completed review count
 * @type {number[]}
 */
export const REVIEW_INTERVALS = [1, 3, 7, 14, 30];

/**
 * Get the review interval for a given review count
 * @param {number} completedReviewCount - Number of passing reviews completed
 * @returns {number} Interval in days until next review
 */
export function getReviewInterval(completedReviewCount) {
  const index = Math.min(completedReviewCount, REVIEW_INTERVALS.length - 1);
  return REVIEW_INTERVALS[index];
}

/**
 * Check if a lesson is due for review
 * @param {number} lastReviewTimestamp - Timestamp of last review
 * @param {number} completedReviewCount - Number of passing reviews completed
 * @param {number} [now=Date.now()] - Current timestamp
 * @returns {boolean} True if the lesson is due for review
 */
export function isLessonDueForReview(lastReviewTimestamp, completedReviewCount, now = Date.now()) {
  const intervalDays = getReviewInterval(completedReviewCount);
  const intervalMs = intervalDays * 24 * 60 * 60 * 1000;
  return (now - lastReviewTimestamp) >= intervalMs;
}

/**
 * Calculate review urgency (0-100)
 * 0 = just reviewed, 100 = maximally overdue
 * @param {number} lastReviewTimestamp - Timestamp of last review
 * @param {number} completedReviewCount - Number of passing reviews completed
 * @param {number} [now=Date.now()] - Current timestamp
 * @returns {number} Urgency score 0-100
 */
export function getReviewUrgency(lastReviewTimestamp, completedReviewCount, now = Date.now()) {
  const intervalDays = getReviewInterval(completedReviewCount);
  const intervalMs = intervalDays * 24 * 60 * 60 * 1000;
  const elapsed = now - lastReviewTimestamp;
  const ratio = elapsed / intervalMs;
  return Math.min(Math.round(ratio * 100), 100);
}

/**
 * @typedef {Object} DueLesson
 * @property {string} lessonId - The lesson ID
 * @property {number} urgency - Urgency score 0-100
 * @property {number} lastReview - Last review timestamp
 * @property {number} reviewCount - Number of completed reviews
 */

/**
 * Get all lessons due for review, sorted by urgency descending
 * @param {string[]} completedLessonIds - IDs of completed lessons
 * @param {Object.<string, number>} reviewDates - Map of lessonId to last review timestamp
 * @param {Object.<string, number>} reviewCounts - Map of lessonId to passing review count
 * @param {number} [now=Date.now()] - Current timestamp
 * @returns {DueLesson[]} Lessons due for review, sorted by urgency
 */
export function getLessonsDueForReview(completedLessonIds, reviewDates, reviewCounts, now = Date.now()) {
  const dueLessons = [];

  for (const lessonId of completedLessonIds) {
    const lastReview = reviewDates[lessonId];
    if (lastReview === undefined) {
      continue;
    }

    const reviewCount = reviewCounts[lessonId] || 0;

    if (isLessonDueForReview(lastReview, reviewCount, now)) {
      dueLessons.push({
        lessonId,
        urgency: getReviewUrgency(lastReview, reviewCount, now),
        lastReview,
        reviewCount,
      });
    }
  }

  return dueLessons.sort((a, b) => b.urgency - a.urgency);
}

/**
 * Select top N lessons for review by urgency
 * @param {DueLesson[]} dueLessons - Sorted list of due lessons
 * @param {number} [maxLessons=5] - Maximum lessons to select
 * @returns {DueLesson[]} Selected lessons for review
 */
export function selectReviewLessons(dueLessons, maxLessons = 5) {
  return dueLessons.slice(0, maxLessons);
}
