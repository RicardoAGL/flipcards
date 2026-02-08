/**
 * Lesson Index
 * Centralized export of all lesson data with metadata
 *
 * @fileoverview Exports all lesson data and provides metadata
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

// Import all Phase 2 lessons
import P2_OE_BEG from './P2-OE-BEG.json';
import P2_OE_ADV from './P2-OE-ADV.json';
import P2_IE_BEG from './P2-IE-BEG.json';
import P2_IE_ADV from './P2-IE-ADV.json';
import P2_EI_BEG from './P2-EI-BEG.json';
import P2_EI_ADV from './P2-EI-ADV.json';
import P2_IJ_BEG from './P2-IJ-BEG.json';
import P2_IJ_ADV from './P2-IJ-ADV.json';
import P2_OU_BEG from './P2-OU-BEG.json';
import P2_OU_ADV from './P2-OU-ADV.json';
import P2_AU_BEG from './P2-AU-BEG.json';
import P2_AU_ADV from './P2-AU-ADV.json';
import P2_EU_BEG from './P2-EU-BEG.json';
import P2_EU_ADV from './P2-EU-ADV.json';
import P2_UI_BEG from './P2-UI-BEG.json';
import P2_UI_ADV from './P2-UI-ADV.json';

/**
 * All lessons indexed by their ID
 * @type {Record<string, import('../schema.js').Lesson>}
 */
export const lessonsById = /** @type {Record<string, import('../schema.js').Lesson>} */ ({
  // Phase 1
  'P1-AA-BEG': P1_AA_BEG,
  'P1-AA-ADV': P1_AA_ADV,
  'P1-EE-BEG': P1_EE_BEG,
  'P1-EE-ADV': P1_EE_ADV,
  'P1-OO-BEG': P1_OO_BEG,
  'P1-OO-ADV': P1_OO_ADV,
  'P1-UU-BEG': P1_UU_BEG,
  'P1-UU-ADV': P1_UU_ADV,
  // Phase 2
  'P2-OE-BEG': P2_OE_BEG,
  'P2-OE-ADV': P2_OE_ADV,
  'P2-IE-BEG': P2_IE_BEG,
  'P2-IE-ADV': P2_IE_ADV,
  'P2-EI-BEG': P2_EI_BEG,
  'P2-EI-ADV': P2_EI_ADV,
  'P2-IJ-BEG': P2_IJ_BEG,
  'P2-IJ-ADV': P2_IJ_ADV,
  'P2-OU-BEG': P2_OU_BEG,
  'P2-OU-ADV': P2_OU_ADV,
  'P2-AU-BEG': P2_AU_BEG,
  'P2-AU-ADV': P2_AU_ADV,
  'P2-EU-BEG': P2_EU_BEG,
  'P2-EU-ADV': P2_EU_ADV,
  'P2-UI-BEG': P2_UI_BEG,
  'P2-UI-ADV': P2_UI_ADV,
});

/**
 * Ordered list of all lesson IDs (for progression)
 * @type {string[]}
 */
export const lessonOrder = [
  // Phase 1
  'P1-AA-BEG',
  'P1-AA-ADV',
  'P1-EE-BEG',
  'P1-EE-ADV',
  'P1-OO-BEG',
  'P1-OO-ADV',
  'P1-UU-BEG',
  'P1-UU-ADV',
  // Phase 2
  'P2-OE-BEG',
  'P2-OE-ADV',
  'P2-IE-BEG',
  'P2-IE-ADV',
  'P2-EI-BEG',
  'P2-EI-ADV',
  'P2-IJ-BEG',
  'P2-IJ-ADV',
  'P2-OU-BEG',
  'P2-OU-ADV',
  'P2-AU-BEG',
  'P2-AU-ADV',
  'P2-EU-BEG',
  'P2-EU-ADV',
  'P2-UI-BEG',
  'P2-UI-ADV',
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
 * @type {Record<string, import('../schema.js').Lesson[]>}
 */
export const lessonsBySound = /** @type {Record<string, import('../schema.js').Lesson[]>} */ ({
  // Phase 1
  aa: [P1_AA_BEG, P1_AA_ADV],
  ee: [P1_EE_BEG, P1_EE_ADV],
  oo: [P1_OO_BEG, P1_OO_ADV],
  uu: [P1_UU_BEG, P1_UU_ADV],
  // Phase 2
  oe: [P2_OE_BEG, P2_OE_ADV],
  ie: [P2_IE_BEG, P2_IE_ADV],
  ei: [P2_EI_BEG, P2_EI_ADV],
  ij: [P2_IJ_BEG, P2_IJ_ADV],
  ou: [P2_OU_BEG, P2_OU_ADV],
  au: [P2_AU_BEG, P2_AU_ADV],
  eu: [P2_EU_BEG, P2_EU_ADV],
  ui: [P2_UI_BEG, P2_UI_ADV],
});

/**
 * Lessons grouped by phase
 * @type {Record<number, import('../schema.js').Lesson[]>}
 */
export const lessonsByPhase = /** @type {Record<number, import('../schema.js').Lesson[]>} */ ({
  1: [
    P1_AA_BEG, P1_AA_ADV,
    P1_EE_BEG, P1_EE_ADV,
    P1_OO_BEG, P1_OO_ADV,
    P1_UU_BEG, P1_UU_ADV,
  ],
  2: [
    P2_OE_BEG, P2_OE_ADV,
    P2_IE_BEG, P2_IE_ADV,
    P2_EI_BEG, P2_EI_ADV,
    P2_IJ_BEG, P2_IJ_ADV,
    P2_OU_BEG, P2_OU_ADV,
    P2_AU_BEG, P2_AU_ADV,
    P2_EU_BEG, P2_EU_ADV,
    P2_UI_BEG, P2_UI_ADV,
  ],
});

/**
 * Sound information for all phases
 * @type {Object.<string, { ipa: string, descriptionES: string, descriptionEN: string }>}
 */
export const soundInfo = {
  // Phase 1
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
  // Phase 2
  oe: {
    ipa: '[u]',
    descriptionES: "Similar a la 'u' en espa\u00F1ol como en 'su'",
    descriptionEN: "Like 'oo' in 'book' but shorter",
  },
  ie: {
    ipa: '[i]',
    descriptionES: "Similar a la 'i' en espa\u00F1ol como en 'si'",
    descriptionEN: "Like 'ee' in 'see'",
  },
  ei: {
    ipa: '[\u025Bi]',
    descriptionES: "Similar a 'ei' como en 'reina'",
    descriptionEN: "Like 'ay' in 'say' or 'ei' in 'eight'",
  },
  ij: {
    ipa: '[\u025Bi]',
    descriptionES: "Mismo sonido que 'ei', diferente escritura",
    descriptionEN: "Same sound as 'ei', different spelling",
  },
  ou: {
    ipa: '[ʌu]',
    descriptionES: "Similar al diptongo 'au' en español como en 'cauto', pero más corto",
    descriptionEN: "Like 'ow' in 'now' but shorter",
  },
  au: {
    ipa: '[ʌu]',
    descriptionES: "Mismo sonido que 'ou', diferente escritura",
    descriptionEN: "Same sound as 'ou', different spelling",
  },
  eu: {
    ipa: '[ø]',
    descriptionES: "Sin equivalente en español. Redondea los labios como para 'o' y di 'e'",
    descriptionEN: "No English equivalent. Round lips as for 'o' and say 'ay'",
  },
  ui: {
    ipa: '[œy]',
    descriptionES: "El sonido más difícil. Similar a 'eu' pero deslizando hacia 'i'",
    descriptionEN: "Most difficult Dutch sound. Start with 'eu' and glide toward 'ee'",
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
  phases: 2,
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
