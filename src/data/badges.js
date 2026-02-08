/**
 * Badge Definitions
 * Defines all available badges and their criteria
 */

/**
 * Badge categories
 */
export const BADGE_CATEGORIES = {
  ENCOURAGEMENT: 'encouragement',
  MASTERY: 'mastery',
  MILESTONE: 'milestone',
};

/**
 * All available badges
 * @type {Array<{
 *   id: string,
 *   category: string,
 *   nameES: string,
 *   nameEN: string,
 *   descriptionES: string,
 *   descriptionEN: string,
 *   icon: string,
 *   criteria: Object
 * }>}
 */
export const BADGES = [
  // Encouragement Badges - Reward persistence
  {
    id: 'never-give-up',
    category: BADGE_CATEGORIES.ENCOURAGEMENT,
    nameES: '¡No me rendiré!',
    nameEN: "I won't give up!",
    descriptionES: 'Obtén 0/5 en un quiz y vuelve a intentarlo',
    descriptionEN: 'Score 0/5 on a quiz and try again',
    icon: '💪',
    criteria: {
      type: 'zero_score_retry',
    },
  },
  {
    id: 'practice-master',
    category: BADGE_CATEGORIES.ENCOURAGEMENT,
    nameES: 'La práctica hace al maestro',
    nameEN: 'Practice makes perfect',
    descriptionES: 'Aprueba 10 quizzes',
    descriptionEN: 'Pass 10 quizzes',
    icon: '🎯',
    criteria: {
      type: 'quiz_pass_count',
      count: 10,
    },
  },
  {
    id: 'perseverance',
    category: BADGE_CATEGORIES.ENCOURAGEMENT,
    nameES: 'Perseverancia',
    nameEN: 'Perseverance',
    descriptionES: 'Falla un quiz y luego apruébalo',
    descriptionEN: 'Fail a quiz and then pass it',
    icon: '🔥',
    criteria: {
      type: 'fail_then_pass',
    },
  },

  // Mastery Badges - Reward excellence
  {
    id: 'first-steps',
    category: BADGE_CATEGORIES.MILESTONE,
    nameES: 'Primeros Pasos',
    nameEN: 'First Steps',
    descriptionES: 'Completa tu primera lección',
    descriptionEN: 'Complete your first lesson',
    icon: '🌟',
    criteria: {
      type: 'lessons_completed',
      count: 1,
    },
  },
  {
    id: 'perfect-score',
    category: BADGE_CATEGORIES.MASTERY,
    nameES: 'Puntuación Perfecta',
    nameEN: 'Perfect Score',
    descriptionES: 'Obtén 100% en cualquier quiz',
    descriptionEN: 'Get 100% on any quiz',
    icon: '⭐',
    criteria: {
      type: 'perfect_quiz',
    },
  },
  {
    id: 'sound-master-aa',
    category: BADGE_CATEGORIES.MASTERY,
    nameES: 'Maestro de AA',
    nameEN: 'AA Master',
    descriptionES: 'Completa principiante y avanzado de "aa"',
    descriptionEN: 'Complete beginner and advanced "aa"',
    icon: '🏅',
    criteria: {
      type: 'sound_mastery',
      sound: 'aa',
    },
  },
  {
    id: 'sound-master-ee',
    category: BADGE_CATEGORIES.MASTERY,
    nameES: 'Maestro de EE',
    nameEN: 'EE Master',
    descriptionES: 'Completa principiante y avanzado de "ee"',
    descriptionEN: 'Complete beginner and advanced "ee"',
    icon: '🏅',
    criteria: {
      type: 'sound_mastery',
      sound: 'ee',
    },
  },
  {
    id: 'sound-master-oo',
    category: BADGE_CATEGORIES.MASTERY,
    nameES: 'Maestro de OO',
    nameEN: 'OO Master',
    descriptionES: 'Completa principiante y avanzado de "oo"',
    descriptionEN: 'Complete beginner and advanced "oo"',
    icon: '🏅',
    criteria: {
      type: 'sound_mastery',
      sound: 'oo',
    },
  },
  {
    id: 'sound-master-uu',
    category: BADGE_CATEGORIES.MASTERY,
    nameES: 'Maestro de UU',
    nameEN: 'UU Master',
    descriptionES: 'Completa principiante y avanzado de "uu"',
    descriptionEN: 'Complete beginner and advanced "uu"',
    icon: '🏅',
    criteria: {
      type: 'sound_mastery',
      sound: 'uu',
    },
  },
  {
    id: 'level-1-complete',
    category: BADGE_CATEGORIES.MILESTONE,
    nameES: 'Nivel 1 Completo',
    nameEN: 'Level 1 Complete',
    descriptionES: 'Completa todas las lecciones de Misma Vocal',
    descriptionEN: 'Complete all Same Vowel lessons',
    icon: '🏆',
    criteria: {
      type: 'lessons_completed',
      count: 8,
    },
  },
];

/**
 * Get badge by ID
 * @param {string} badgeId - The badge ID
 * @returns {Object|null} Badge definition or null
 */
export function getBadgeById(badgeId) {
  return BADGES.find(b => b.id === badgeId) || null;
}

/**
 * Get badges by category
 * @param {string} category - The category to filter by
 * @returns {Array} Badges in that category
 */
export function getBadgesByCategory(category) {
  return BADGES.filter(b => b.category === category);
}

/**
 * Get encouragement badges
 * @returns {Array} Encouragement badges
 */
export function getEncouragementBadges() {
  return getBadgesByCategory(BADGE_CATEGORIES.ENCOURAGEMENT);
}

export default BADGES;
