/**
 * Lesson Loader Utility
 * Functions for loading and navigating lesson data
 *
 * @fileoverview Provides utility functions to retrieve lessons,
 * filter by sound, and navigate between lessons.
 */

import {
  lessonsById,
  lessonOrder,
  lessonMenu,
  lessonsBySound,
  lessonsByPhase,
  soundInfo,
  lessonStats,
} from '../data/lessons/index.js';
import { toFlipCardFormat, extractMetadata } from '../data/schema.js';

/**
 * Get all lessons menu data for displaying the lesson list
 * @returns {import('../data/lessons/index.js').LessonMenuEntry[]} Array of lesson menu entries
 */
export function getAllLessons() {
  return lessonMenu;
}

/**
 * Get a specific lesson by its ID
 * @param {string} lessonId - The lesson ID (e.g., "P1-AA-BEG")
 * @returns {import('../data/schema.js').Lesson | null} The lesson data or null if not found
 */
export function getLessonById(lessonId) {
  return lessonsById[lessonId] || null;
}

/**
 * Get a specific lesson formatted for the FlipCard component
 * @param {string} lessonId - The lesson ID
 * @returns {Object | null} FlipCard-compatible lesson data or null
 */
export function getLessonForFlipCard(lessonId) {
  const lesson = getLessonById(lessonId);
  if (!lesson) {
    return null;
  }
  return toFlipCardFormat(lesson);
}

/**
 * Get all lessons for a specific sound combination
 * @param {string} sound - The sound combination (e.g., "aa", "ee")
 * @returns {import('../data/schema.js').Lesson[]} Array of lessons for that sound
 */
export function getLessonsBySound(sound) {
  const normalizedSound = sound.toLowerCase();
  return lessonsBySound[normalizedSound] || [];
}

/**
 * Get all lessons for a specific phase
 * @param {number} phase - The phase number
 * @returns {import('../data/schema.js').Lesson[]} Array of lessons for that phase
 */
export function getLessonsByPhase(phase) {
  return lessonsByPhase[phase] || [];
}

/**
 * Get the next lesson in the learning sequence
 * @param {string} currentLessonId - The current lesson ID
 * @returns {{ lessonId: string, lesson: import('../data/schema.js').Lesson } | null} Next lesson or null if at end
 */
export function getNextLesson(currentLessonId) {
  const currentIndex = lessonOrder.indexOf(currentLessonId);
  if (currentIndex === -1 || currentIndex === lessonOrder.length - 1) {
    return null;
  }

  const nextLessonId = lessonOrder[currentIndex + 1];
  return {
    lessonId: nextLessonId,
    lesson: lessonsById[nextLessonId],
  };
}

/**
 * Get the previous lesson in the learning sequence
 * @param {string} currentLessonId - The current lesson ID
 * @returns {{ lessonId: string, lesson: import('../data/schema.js').Lesson } | null} Previous lesson or null if at start
 */
export function getPreviousLesson(currentLessonId) {
  const currentIndex = lessonOrder.indexOf(currentLessonId);
  if (currentIndex <= 0) {
    return null;
  }

  const prevLessonId = lessonOrder[currentIndex - 1];
  return {
    lessonId: prevLessonId,
    lesson: lessonsById[prevLessonId],
  };
}

/**
 * Check if a lesson is unlocked based on completion of required lessons
 * @param {string} lessonId - The lesson ID to check
 * @param {string[]} completedLessonIds - Array of completed lesson IDs
 * @returns {boolean} True if the lesson is unlocked
 */
export function isLessonUnlocked(lessonId, completedLessonIds = []) {
  const lesson = getLessonById(lessonId);
  if (!lesson) {
    return false;
  }

  // If no unlock requirement, it's always unlocked
  if (lesson.unlockRequires === null) {
    return true;
  }

  // Check if the required lesson is completed
  return completedLessonIds.includes(lesson.unlockRequires);
}

/**
 * Get all available (unlocked) lessons for a user
 * @param {string[]} completedLessonIds - Array of completed lesson IDs
 * @returns {import('../data/lessons/index.js').LessonMenuEntry[]} Array of unlocked lesson menu entries
 */
export function getAvailableLessons(completedLessonIds = []) {
  return lessonMenu.filter(entry =>
    isLessonUnlocked(entry.lessonId, completedLessonIds)
  );
}

/**
 * Get lesson progress statistics
 * @param {string[]} completedLessonIds - Array of completed lesson IDs
 * @returns {{ completed: number, total: number, percentage: number }} Progress stats
 */
export function getLessonProgress(completedLessonIds = []) {
  const total = lessonOrder.length;
  const completed = completedLessonIds.filter(id => lessonsById[id]).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    completed,
    total,
    percentage,
  };
}

/**
 * Get sound information
 * @param {string} sound - The sound combination
 * @returns {{ ipa: string, descriptionES: string, descriptionEN: string } | null} Sound info or null
 */
export function getSoundInfo(sound) {
  const normalizedSound = sound.toLowerCase();
  return soundInfo[normalizedSound] || null;
}

/**
 * Get all available sounds
 * @returns {string[]} Array of sound combinations
 */
export function getAllSounds() {
  return Object.keys(soundInfo);
}

/**
 * Get lesson metadata for quick access
 * @param {string} lessonId - The lesson ID
 * @returns {import('../data/schema.js').LessonMetadata | null} Lesson metadata or null
 */
export function getLessonMetadata(lessonId) {
  const lesson = getLessonById(lessonId);
  if (!lesson) {
    return null;
  }
  return extractMetadata(lesson);
}

/**
 * Get overall lesson statistics
 * @returns {{ totalLessons: number, totalWords: number, totalMinutes: number, phases: number }}
 */
export function getLessonStats() {
  return lessonStats;
}

/**
 * Find lessons containing a specific word
 * @param {string} word - The word to search for
 * @returns {{ lessonId: string, word: import('../data/schema.js').Word }[]} Array of matches
 */
export function findLessonsByWord(word) {
  const results = [];
  const normalizedWord = word.toLowerCase();

  for (const [lessonId, lesson] of Object.entries(lessonsById)) {
    const foundWord = lesson.words.find(w => w.word.toLowerCase() === normalizedWord);
    if (foundWord) {
      results.push({ lessonId, word: foundWord });
    }
  }

  return results;
}

/**
 * Get the first lesson (starting point)
 * @returns {{ lessonId: string, lesson: import('../data/schema.js').Lesson }}
 */
export function getFirstLesson() {
  const firstLessonId = lessonOrder[0];
  return {
    lessonId: firstLessonId,
    lesson: lessonsById[firstLessonId],
  };
}

/**
 * Get the lesson order index
 * @param {string} lessonId - The lesson ID
 * @returns {number} The index in the order (0-based) or -1 if not found
 */
export function getLessonIndex(lessonId) {
  return lessonOrder.indexOf(lessonId);
}

export default {
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
};
