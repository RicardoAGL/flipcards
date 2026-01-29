/**
 * Lesson Index
 * Centralized export of all lesson data with metadata
 *
 * @fileoverview Exports all Phase 1 lessons and provides metadata
 * for the lesson menu and navigation.
 */

// Import all Phase 1 lessons
import P1_AA_BEG from './P1-AA-BEG.json';
import P1_AA_ADV from './P1-AA-ADV.json';
import P1_EE_BEG from './P1-EE-BEG.json';
import P1_EE_ADV from './P1-EE-ADV.json';
import P1_OO_BEG from './P1-OO-BEG.json';
import P1_OO_ADV from './P1-OO-ADV.json';
import P1_UU_BEG from './P1-UU-BEG.json';
import P1_UU_ADV from './P1-UU-ADV.json';

/**
 * All lessons indexed by their ID
 * @type {Object.<string, import('../schema.js').Lesson>}
 */
export const lessonsById = {
  'P1-AA-BEG': P1_AA_BEG,
  'P1-AA-ADV': P1_AA_ADV,
  'P1-EE-BEG': P1_EE_BEG,
  'P1-EE-ADV': P1_EE_ADV,
  'P1-OO-BEG': P1_OO_BEG,
  'P1-OO-ADV': P1_OO_ADV,
  'P1-UU-BEG': P1_UU_BEG,
  'P1-UU-ADV': P1_UU_ADV,
};

/**
 * Ordered list of all lesson IDs (for progression)
 * @type {string[]}
 */
export const lessonOrder = [
  'P1-AA-BEG',
  'P1-AA-ADV',
  'P1-EE-BEG',
  'P1-EE-ADV',
  'P1-OO-BEG',
  'P1-OO-ADV',
  'P1-UU-BEG',
  'P1-UU-ADV',
];

/**
 * @typedef {Object} LessonMenuEntry
 * @property {string} lessonId - Unique lesson identifier
 * @property {string} sound - Target sound combination
 * @property {string} ipa - IPA notation
 * @property {'beginner' | 'advanced'} level - Difficulty level
 * @property {number} wordCount - Number of words in the lesson
 * @property {number} estimatedMinutes - Estimated completion time
 * @property {string|null} unlockRequires - Required lesson ID to unlock
 * @property {number} phase - Phase number
 * @property {Object} labels - Localized labels
 * @property {string} labels.levelES - Spanish level label
 * @property {string} labels.levelEN - English level label
 */

/**
 * Generate menu metadata for a lesson
 * @param {import('../schema.js').Lesson} lesson - The lesson data
 * @returns {LessonMenuEntry} Menu entry data
 */
function generateMenuEntry(lesson) {
  const levelLabels = {
    beginner: { es: 'Principiante', en: 'Beginner' },
    advanced: { es: 'Avanzado', en: 'Advanced' },
  };

  return {
    lessonId: lesson.lessonId,
    sound: lesson.sound.combination,
    ipa: lesson.sound.ipa,
    level: lesson.level,
    wordCount: lesson.words.length,
    estimatedMinutes: lesson.estimatedMinutes,
    unlockRequires: lesson.unlockRequires,
    phase: lesson.phase,
    labels: {
      levelES: levelLabels[lesson.level].es,
      levelEN: levelLabels[lesson.level].en,
    },
  };
}

/**
 * Pre-computed menu data for all lessons
 * @type {LessonMenuEntry[]}
 */
export const lessonMenu = lessonOrder.map(id => generateMenuEntry(lessonsById[id]));

/**
 * Lessons grouped by sound
 * @type {Object.<string, import('../schema.js').Lesson[]>}
 */
export const lessonsBySound = {
  aa: [P1_AA_BEG, P1_AA_ADV],
  ee: [P1_EE_BEG, P1_EE_ADV],
  oo: [P1_OO_BEG, P1_OO_ADV],
  uu: [P1_UU_BEG, P1_UU_ADV],
};

/**
 * Lessons grouped by phase
 * @type {Object.<number, import('../schema.js').Lesson[]>}
 */
export const lessonsByPhase = {
  1: [
    P1_AA_BEG, P1_AA_ADV,
    P1_EE_BEG, P1_EE_ADV,
    P1_OO_BEG, P1_OO_ADV,
    P1_UU_BEG, P1_UU_ADV,
  ],
};

/**
 * Sound information for Phase 1
 * @type {Object.<string, { ipa: string, descriptionES: string, descriptionEN: string }>}
 */
export const soundInfo = {
  aa: {
    ipa: '[a\u02D0]',
    descriptionES: "Similar a la 'a' en espa\u00F1ol pero m\u00E1s larga y abierta, como en 'pap\u00E1'",
    descriptionEN: "Like 'a' in 'father' but longer",
  },
  ee: {
    ipa: '[e\u02D0]',
    descriptionES: "Similar a la 'e' en espa\u00F1ol pero m\u00E1s larga y cerrada, como en 'beb\u00E9'",
    descriptionEN: "Like 'ay' in 'day' but without the glide",
  },
  oo: {
    ipa: '[o\u02D0]',
    descriptionES: "Similar a la 'o' en espa\u00F1ol pero m\u00E1s larga y redondeada, como en 'solo'",
    descriptionEN: "Like 'o' in 'go' but without the 'w' glide",
  },
  uu: {
    ipa: '[y\u02D0]',
    descriptionES: "Similar a la 'u' francesa o alemana. Redondea los labios y di 'i'",
    descriptionEN: "Like French 'u' in 'tu' or German '\u00FC' - rounded lips saying 'ee'",
  },
};

/**
 * Total statistics for all lessons
 * @type {{ totalLessons: number, totalWords: number, totalMinutes: number, phases: number }}
 */
export const lessonStats = {
  totalLessons: lessonOrder.length,
  totalWords: Object.values(lessonsById).reduce((sum, lesson) => sum + lesson.words.length, 0),
  totalMinutes: Object.values(lessonsById).reduce((sum, lesson) => sum + lesson.estimatedMinutes, 0),
  phases: 1, // Currently only Phase 1
};

// Default export with all data
export default {
  lessonsById,
  lessonOrder,
  lessonMenu,
  lessonsBySound,
  lessonsByPhase,
  soundInfo,
  lessonStats,
};
