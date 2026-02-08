/**
 * Badge Gallery Component
 * Displays all available badges grouped by category with earned/unearned states
 *
 * @module BadgeGallery
 */

import { BADGES, BADGE_CATEGORIES, getBadgesByCategory } from '../data/badges.js';
import {
  getEarnedBadges,
  getCompletedLessons,
  getQuizHistory,
} from '../lib/progressStorage.js';
import './BadgeGallery.css';

/**
 * UI text for different languages
 */
const TEXT = {
  es: {
    title: 'Galería de Insignias',
    back: 'Volver',
    earned: 'Conseguida',
    locked: 'Por conseguir',
    summary: (earned, total) => `${earned} de ${total} insignias conseguidas`,
    categories: {
      [BADGE_CATEGORIES.ENCOURAGEMENT]: 'Perseverancia',
      [BADGE_CATEGORIES.MASTERY]: 'Maestría',
      [BADGE_CATEGORIES.MILESTONE]: 'Hitos',
    },
  },
  en: {
    title: 'Badge Gallery',
    back: 'Back',
    earned: 'Earned',
    locked: 'Locked',
    summary: (earned, total) => `${earned} of ${total} badges earned`,
    categories: {
      [BADGE_CATEGORIES.ENCOURAGEMENT]: 'Perseverance',
      [BADGE_CATEGORIES.MASTERY]: 'Mastery',
      [BADGE_CATEGORIES.MILESTONE]: 'Milestones',
    },
  },
};

/**
 * Get progress info for a badge based on its criteria
 * @param {Object} badge - Badge definition
 * @returns {{ current: number, target: number } | null}
 */
function getBadgeProgress(badge) {
  const { criteria } = badge;

  if (criteria.type === 'quiz_pass_count') {
    const passed = getQuizHistory().filter(a => a.passed).length;
    return { current: passed, target: criteria.count };
  }

  if (criteria.type === 'lessons_completed') {
    return { current: getCompletedLessons().length, target: criteria.count };
  }

  return null;
}

/**
 * Format an earned date for display
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date string
 */
function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
}

/**
 * Create a Badge Gallery component
 * @param {HTMLElement} container - Container element to render into
 * @param {Object} [options] - Configuration options
 * @param {string} [options.language='es'] - Display language ('es' or 'en')
 * @param {Function} [options.onBack] - Callback when back button is clicked
 * @returns {{ destroy: Function, getState: Function, refresh: Function }}
 */
export function createBadgeGallery(container, options = {}) {
  const language = options.language || 'es';
  const onBack = options.onBack || null;
  const text = TEXT[language] || TEXT.es;

  /** @type {Function|null} */
  let keydownHandler = null;

  /**
   * Render the full gallery
   */
  function render() {
    const earnedBadges = getEarnedBadges();
    const earnedMap = new Map(earnedBadges.map((b) => [b.id, b]));
    const earnedCount = earnedBadges.length;

    const categoryOrder = [
      BADGE_CATEGORIES.ENCOURAGEMENT,
      BADGE_CATEGORIES.MASTERY,
      BADGE_CATEGORIES.MILESTONE,
    ];

    const categoriesHTML = categoryOrder
      .map((cat) => {
        const badges = getBadgesByCategory(cat);
        const cardsHTML = badges
          .map((badge) => renderBadgeCard(badge, earnedMap, text, language))
          .join('');

        return `
        <div class="badge-gallery__category" data-category="${cat}">
          <h3 class="badge-gallery__category-title">${text.categories[cat]}</h3>
          <div class="badge-gallery__grid">
            ${cardsHTML}
          </div>
        </div>`;
      })
      .join('');

    container.innerHTML = `
      <div class="badge-gallery">
        <div class="badge-gallery__header">
          <button class="badge-gallery__back" data-action="back">${text.back}</button>
          <h2 class="badge-gallery__title">${text.title}</h2>
        </div>
        <div class="badge-gallery__summary">${text.summary(earnedCount, BADGES.length)}</div>
        ${categoriesHTML}
      </div>`;

    attachEventListeners();
  }

  /**
   * Render a single badge card
   */
  function renderBadgeCard(badge, earnedMap, text, lang) {
    const earned = earnedMap.get(badge.id);
    const stateClass = earned ? 'badge-card--earned' : 'badge-card--locked';
    const name = lang === 'en' ? badge.nameEN : badge.nameES;
    const description = lang === 'en' ? badge.descriptionEN : badge.descriptionES;

    let dateHTML = '';
    if (earned) {
      dateHTML = `<span class="badge-card__date">${formatDate(earned.earnedAt)}</span>`;
    }

    let progressHTML = '';
    if (!earned) {
      const progress = getBadgeProgress(badge);
      if (progress) {
        progressHTML = `<span class="badge-card__progress">${progress.current} / ${progress.target}</span>`;
      }
    }

    return `
      <div class="badge-card ${stateClass}" data-badge-id="${badge.id}">
        <span class="badge-card__icon">${badge.icon}</span>
        <span class="badge-card__name">${name}</span>
        <span class="badge-card__description">${description}</span>
        ${dateHTML}
        ${progressHTML}
      </div>`;
  }

  /**
   * Attach event listeners
   */
  function attachEventListeners() {
    const backBtn = container.querySelector('[data-action="back"]');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (onBack) {onBack();}
      });
    }

    keydownHandler = (e) => {
      if (e.key === 'Escape' && onBack) {
        onBack();
      }
    };
    document.addEventListener('keydown', keydownHandler);
  }

  /**
   * Destroy the component and clean up
   */
  function destroy() {
    if (keydownHandler) {
      document.removeEventListener('keydown', keydownHandler);
      keydownHandler = null;
    }
    container.innerHTML = '';
  }

  /**
   * Get current state
   * @returns {{ earnedCount: number, totalBadges: number }}
   */
  function getState() {
    const earnedBadges = getEarnedBadges();
    return {
      earnedCount: earnedBadges.length,
      totalBadges: BADGES.length,
    };
  }

  /**
   * Refresh the gallery with latest data
   */
  function refresh() {
    if (keydownHandler) {
      document.removeEventListener('keydown', keydownHandler);
      keydownHandler = null;
    }
    render();
  }

  // Initialize
  render();

  return { destroy, getState, refresh };
}
