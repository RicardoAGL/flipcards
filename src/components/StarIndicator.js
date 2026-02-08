/**
 * Star Indicator Component
 * Displays point milestone stars and celebration animations
 */

import {
  MILESTONES,
  getCurrentMilestone,
  getNextMilestone,
  getAchievedMilestones,
  getTotalPoints,
} from '../lib/progressStorage.js';
import { getBadgeById } from '../data/badges.js';
import './StarIndicator.css';

/**
 * Text content for different languages
 */
const TEXT = {
  es: {
    congratulations: '¡Felicidades!',
    newMilestone: 'Nuevo Hito Alcanzado',
    starUnlocked: 'Has desbloqueado la estrella',
    continue: 'Continuar',
    nextMilestone: 'Próximo hito',
    pointsToGo: 'puntos restantes',
    allMilestonesComplete: '¡Todos los hitos completados!',
    newBadge: '¡Nueva Insignia!',
    badgeEarned: 'Has ganado',
  },
  en: {
    congratulations: 'Congratulations!',
    newMilestone: 'New Milestone Reached',
    starUnlocked: 'You unlocked the',
    starSuffix: 'star',
    continue: 'Continue',
    nextMilestone: 'Next milestone',
    pointsToGo: 'points to go',
    allMilestonesComplete: 'All milestones complete!',
    newBadge: 'New Badge!',
    badgeEarned: 'You earned',
  },
};

/**
 * Create SVG star with specified color
 * @param {string} color - Fill color for the star
 * @param {boolean} earned - Whether the star is earned
 * @returns {string} SVG markup
 */
function createStarSVG(color, earned = true) {
  const fillColor = earned ? color : '#D4D4D8';
  const className = earned ? 'star-indicator-star--earned' : 'star-indicator-star--unearned';

  return `
    <svg class="star-indicator-star ${className}" viewBox="0 0 24 24" fill="${fillColor}" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  `;
}

/**
 * Create the star indicator showing all milestone stars
 * @param {Object} options - Configuration options
 * @param {string} [options.size='md'] - Size variant ('sm', 'md', 'lg')
 * @param {number} [options.points] - Points to display (defaults to current total)
 * @returns {string} HTML markup
 */
export function createStarIndicatorHTML(options = {}) {
  const { size = 'md', points } = options;
  const totalPoints = points !== undefined ? points : getTotalPoints();
  const achieved = getAchievedMilestones(totalPoints);
  const achievedLevels = new Set(achieved.map(m => m.level));

  const stars = MILESTONES.map(milestone => {
    const earned = achievedLevels.has(milestone.level);
    return createStarSVG(milestone.color, earned);
  }).join('');

  const sizeClass = size !== 'md' ? `star-indicator--${size}` : '';

  return `
    <div class="star-indicator ${sizeClass}" role="img" aria-label="Milestone stars: ${achieved.length} of ${MILESTONES.length} earned">
      ${stars}
    </div>
  `;
}

/**
 * Create progress bar showing distance to next milestone
 * @param {Object} options - Configuration options
 * @param {string} [options.language='es'] - Display language
 * @param {number} [options.points] - Points to display (defaults to current total)
 * @returns {string} HTML markup
 */
export function createStarProgressHTML(options = {}) {
  const { language = 'es', points } = options;
  const text = TEXT[language] || TEXT.es;
  const totalPoints = points !== undefined ? points : getTotalPoints();
  const nextMilestone = getNextMilestone(totalPoints);
  const currentMilestone = getCurrentMilestone(totalPoints);

  if (!nextMilestone) {
    // All milestones complete
    return `
      <div class="star-progress">
        <div class="star-progress-header">
          <span class="star-progress-label">${text.allMilestonesComplete}</span>
        </div>
        <div class="star-progress-bar-container">
          <div class="star-progress-bar" style="width: 100%; background: linear-gradient(90deg, #CD7F32, #C0C0C0, #FFD700, #B9F2FF);"></div>
        </div>
      </div>
    `;
  }

  // Calculate progress percentage
  const startPoints = currentMilestone ? currentMilestone.points : 0;
  const pointsInRange = totalPoints - startPoints;
  const rangeSize = nextMilestone.points - startPoints;
  const percentage = Math.round((pointsInRange / rangeSize) * 100);
  const milestoneName = language === 'es' ? nextMilestone.nameES : nextMilestone.nameEN;

  return `
    <div class="star-progress">
      <div class="star-progress-header">
        <span class="star-progress-label">${text.nextMilestone}: ${milestoneName}</span>
        <span class="star-progress-points">${nextMilestone.remaining} ${text.pointsToGo}</span>
      </div>
      <div class="star-progress-bar-container">
        <div class="star-progress-bar" style="width: ${percentage}%; background: ${nextMilestone.color};"></div>
      </div>
    </div>
  `;
}

/**
 * Show milestone celebration modal
 * @param {Object} milestone - The milestone achieved
 * @param {Object} options - Configuration options
 * @param {string} [options.language='es'] - Display language
 * @param {Function} [options.onDismiss] - Callback when dismissed
 */
export function showMilestoneCelebration(milestone, options = {}) {
  const { language = 'es', onDismiss } = options;
  const text = TEXT[language] || TEXT.es;
  const milestoneName = language === 'es' ? milestone.nameES : milestone.nameEN;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'milestone-celebration';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', text.newMilestone);

  const starSuffix = language === 'en' ? ` ${text.starSuffix}` : '';

  overlay.innerHTML = `
    <div class="milestone-celebration-content">
      <svg class="milestone-celebration-star" viewBox="0 0 24 24" fill="${milestone.color}">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
      <h2 class="milestone-celebration-title">${text.congratulations}</h2>
      <p class="milestone-celebration-level" style="color: ${milestone.color};">
        ${text.starUnlocked} ${milestoneName}${starSuffix}
      </p>
      <p class="milestone-celebration-message">${milestone.points} pts</p>
      <button class="milestone-celebration-btn" type="button" data-dismiss>
        ${text.continue}
      </button>
    </div>
  `;

  // Dismiss handler
  const dismiss = () => {
    overlay.remove();
    if (onDismiss) {
      onDismiss();
    }
  };

  // Bind events
  overlay.querySelector('[data-dismiss]').addEventListener('click', dismiss);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      dismiss();
    }
  });

  // Handle escape key
  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      dismiss();
      document.removeEventListener('keydown', handleKeydown);
    }
  };
  document.addEventListener('keydown', handleKeydown);

  // Add to DOM
  document.body.appendChild(overlay);

  // Focus the button
  overlay.querySelector('[data-dismiss]').focus();
}

/**
 * Show badge celebration modal
 * @param {string} badgeId - The badge ID to celebrate
 * @param {Object} options - Configuration options
 * @param {string} [options.language='es'] - Display language
 * @param {Function} [options.onDismiss] - Callback when dismissed
 */
export function showBadgeCelebration(badgeId, options = {}) {
  const { language = 'es', onDismiss } = options;
  const text = TEXT[language] || TEXT.es;
  const badge = getBadgeById(badgeId);

  if (!badge) {
    if (onDismiss) {onDismiss();}
    return;
  }

  const badgeName = language === 'es' ? badge.nameES : badge.nameEN;
  const badgeDescription = language === 'es' ? badge.descriptionES : badge.descriptionEN;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'milestone-celebration badge-celebration';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', text.newBadge);

  overlay.innerHTML = `
    <div class="milestone-celebration-content">
      <span class="badge-celebration-icon">${badge.icon}</span>
      <h2 class="milestone-celebration-title">${text.newBadge}</h2>
      <p class="badge-celebration-name">${badgeName}</p>
      <p class="badge-celebration-description">${badgeDescription}</p>
      <button class="milestone-celebration-btn" type="button" data-dismiss>
        ${text.continue}
      </button>
    </div>
  `;

  // Dismiss handler
  const dismiss = () => {
    overlay.remove();
    if (onDismiss) {
      onDismiss();
    }
  };

  // Bind events
  overlay.querySelector('[data-dismiss]').addEventListener('click', dismiss);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      dismiss();
    }
  });

  // Handle escape key
  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      dismiss();
      document.removeEventListener('keydown', handleKeydown);
    }
  };
  document.addEventListener('keydown', handleKeydown);

  // Add to DOM
  document.body.appendChild(overlay);

  // Focus the button
  overlay.querySelector('[data-dismiss]').focus();
}

/**
 * Show multiple badge celebrations in sequence
 * @param {string[]} badgeIds - Array of badge IDs to celebrate
 * @param {Object} options - Configuration options
 * @param {string} [options.language='es'] - Display language
 * @param {Function} [options.onComplete] - Callback when all celebrations complete
 */
export function showBadgeCelebrations(badgeIds, options = {}) {
  const { language = 'es', onComplete } = options;

  if (!badgeIds || badgeIds.length === 0) {
    if (onComplete) {onComplete();}
    return;
  }

  let index = 0;

  const showNext = () => {
    if (index >= badgeIds.length) {
      if (onComplete) {onComplete();}
      return;
    }

    showBadgeCelebration(badgeIds[index], {
      language,
      onDismiss: () => {
        index++;
        // Small delay between celebrations
        setTimeout(showNext, 300);
      },
    });
  };

  showNext();
}

/**
 * Create a Star Indicator component with update capability
 * @param {HTMLElement} container - Container element to render into
 * @param {Object} options - Configuration options
 * @returns {Object} Component API
 */
export function createStarIndicator(container, options = {}) {
  const { size = 'md', showProgress = false, language = 'es' } = options;

  /**
   * Render the component
   */
  const render = () => {
    let html = createStarIndicatorHTML({ size });

    if (showProgress) {
      html += createStarProgressHTML({ language });
    }

    container.innerHTML = html;
  };

  /**
   * Update with new points
   * @param {number} _newPoints - New point total (triggers re-render)
   */
  const update = (_newPoints) => {
    render();
  };

  /**
   * Get current state
   */
  const getState = () => ({
    points: getTotalPoints(),
    currentMilestone: getCurrentMilestone(),
    nextMilestone: getNextMilestone(),
    achievedMilestones: getAchievedMilestones(),
  });

  /**
   * Destroy the component
   */
  const destroy = () => {
    container.innerHTML = '';
  };

  // Initial render
  render();

  return {
    render,
    update,
    getState,
    destroy,
  };
}

export default createStarIndicator;
