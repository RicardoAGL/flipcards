/**
 * Lesson Menu Component
 * Displays the lesson selection grid with progress tracking
 *
 * Features:
 * - Progress summary card with completion percentage
 * - 2-column grid of sound cards
 * - Beginner/Advanced level buttons with lock states
 * - Points display in header
 */

import {
  getProgress,
  getCompletedLessons,
  isLessonUnlocked,
  isLessonCompleted,
} from '../lib/progressStorage.js';
import { lessonsBySound, lessonsByPhase, soundInfo } from '../data/lessons/index.js';
import { createStarIndicatorHTML, createStarProgressHTML } from './StarIndicator.js';
import './LessonMenu.css';

/**
 * Phase display names
 * @type {Object.<number, { es: string, en: string }>}
 */
const PHASE_NAMES = {
  1: { es: 'Misma Vocal', en: 'Same Vowel' },
  2: { es: 'Pares Voc\u00e1licos', en: 'Vowel Pairs' },
};

const TEXT = {
  es: {
    title: 'Lecciones',
    points: 'pts',
    progressTitle: 'Tu Progreso',
    lessonsCompleted: 'lecciones completadas',
    beginner: 'Principiante',
    advanced: 'Avanzado',
    lockedMessage: 'Completa Principiante para desbloquear',
    viewBadges: 'Ver Insignias',
    phase: 'Fase',
  },
  en: {
    title: 'Lessons',
    points: 'pts',
    progressTitle: 'Your Progress',
    lessonsCompleted: 'lessons completed',
    beginner: 'Beginner',
    advanced: 'Advanced',
    lockedMessage: 'Complete Beginner to unlock',
    viewBadges: 'View Badges',
    phase: 'Phase',
  },
};

/**
 * Create the Lesson Menu component
 * @param {HTMLElement} container - Container element to render into
 * @param {Object} options - Configuration options
 * @param {string} [options.language='es'] - Display language ('es' or 'en')
 * @param {Function} options.onSelectLesson - Callback when a lesson is selected
 * @returns {Object} Component API
 */
export function createLessonMenu(container, options = {}) {
  const { language = 'es', onSelectLesson, onViewBadges } = options;
  const text = TEXT[language] || TEXT.es;

  // State
  let progress = getProgress();
  let completedLessons = getCompletedLessons();
  let lockedMessageTimeout = null;

  // Elements cache
  let elements = {};

  /**
   * Render the component
   */
  const render = () => {
    const html = `
      <div class="lesson-menu" role="main" aria-label="Lesson selection menu">
        <!-- Header with Stars and Points -->
        <header class="lesson-menu-header">
          <h1 class="lesson-menu-title">${text.title}</h1>
          <div class="lesson-menu-header-right">
            ${createStarIndicatorHTML({ size: 'sm' })}
            <div class="lesson-menu-points" aria-label="${progress.points} ${text.points}">
              <span>${progress.points} ${text.points}</span>
            </div>
          </div>
        </header>

        <!-- Progress Card -->
        <section class="lesson-menu-progress" aria-label="${text.progressTitle}">
          <div class="lesson-menu-progress-header">
            <svg class="lesson-menu-progress-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h2 class="lesson-menu-progress-title">${text.progressTitle}</h2>
          </div>
          <div
            class="lesson-menu-progress-bar-container"
            role="progressbar"
            aria-valuenow="${progress.percentage}"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="${progress.completed} of ${progress.total} ${text.lessonsCompleted}"
          >
            <div
              class="lesson-menu-progress-bar"
              style="width: ${progress.percentage}%"
            ></div>
          </div>
          <div class="lesson-menu-progress-text">
            <span>${progress.completed} of ${progress.total} ${text.lessonsCompleted}</span>
            <span class="lesson-menu-progress-percent">${progress.percentage}%</span>
          </div>
          <!-- Star Progress to Next Milestone -->
          <div class="lesson-menu-star-progress">
            ${createStarProgressHTML({ language })}
          </div>
          <button class="lesson-menu-badges-btn" type="button" data-action="view-badges">
            🏆 ${text.viewBadges}
          </button>
        </section>

        <!-- Sound Grid -->
        <section class="lesson-menu-grid" aria-label="Sound lessons">
          ${renderSoundCards()}
        </section>

        <!-- Locked Message (hidden by default) -->
        <div class="lesson-menu-locked-message" style="display: none;" data-locked-message role="alert">
          ${text.lockedMessage}
        </div>
      </div>
    `;

    container.innerHTML = html;
    cacheElements();
    bindEvents();
  };

  /**
   * Render a single sound card
   * @param {string} sound - Sound combination key
   */
  const renderSoundCard = (sound) => {
    const info = soundInfo[sound];
    const lessons = lessonsBySound[sound];
    const beginnerLesson = lessons.find(l => l.level === 'beginner');
    const advancedLesson = lessons.find(l => l.level === 'advanced');

    return `
      <div class="sound-card" role="group" aria-labelledby="sound-${sound}-label">
        <span class="sound-card-sound" id="sound-${sound}-label">${sound}</span>
        <span class="sound-card-ipa">${info.ipa}</span>
        <div class="sound-card-levels">
          ${renderLevelButton(beginnerLesson, text.beginner)}
          ${renderLevelButton(advancedLesson, text.advanced)}
        </div>
      </div>
    `;
  };

  /**
   * Render all sound cards grouped by phase
   */
  const renderSoundCards = () => {
    const phases = Object.keys(lessonsByPhase).map(Number).sort();

    return phases.map(phase => {
      const phaseLessons = lessonsByPhase[phase];
      const phaseSounds = [...new Set(phaseLessons.map(l => l.sound.combination))];
      const phaseName = PHASE_NAMES[phase] || { es: '', en: '' };
      const phaseLabel = phaseName[language] || phaseName.es;

      return `
        <div class="lesson-menu-phase" data-phase="${phase}">
          <h3 class="lesson-menu-phase-title">${text.phase} ${phase}: ${phaseLabel}</h3>
          <div class="lesson-menu-phase-grid">
            ${phaseSounds.map(sound => renderSoundCard(sound)).join('')}
          </div>
        </div>
      `;
    }).join('');
  };

  /**
   * Render a level button
   * @param {Object} lesson - The lesson data
   * @param {string} levelLabel - Display label for the level
   */
  const renderLevelButton = (lesson, levelLabel) => {
    const isCompleted = isLessonCompleted(lesson.lessonId);
    const isUnlocked = isLessonUnlocked(lesson.lessonId);

    let stateClass = '';
    let icon = '';
    let ariaDisabled = 'false';

    if (isCompleted) {
      stateClass = 'level-btn--completed';
      icon = `
        <svg class="level-btn-icon level-btn-icon--check" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
      `;
    } else if (!isUnlocked) {
      stateClass = 'level-btn--locked';
      ariaDisabled = 'true';
      icon = `
        <svg class="level-btn-icon level-btn-icon--lock" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
        </svg>
      `;
    } else {
      stateClass = 'level-btn--unlocked';
    }

    return `
      <button
        class="level-btn ${stateClass}"
        type="button"
        data-lesson-id="${lesson.lessonId}"
        data-unlocked="${isUnlocked}"
        aria-disabled="${ariaDisabled}"
        aria-label="${levelLabel}${isCompleted ? ' (completed)' : ''}${!isUnlocked ? ' (locked)' : ''}"
      >
        ${icon}
        <span>${levelLabel}</span>
      </button>
    `;
  };

  /**
   * Cache DOM elements
   */
  const cacheElements = () => {
    elements = {
      levelButtons: container.querySelectorAll('.level-btn'),
      lockedMessage: container.querySelector('[data-locked-message]'),
      progressBar: container.querySelector('.lesson-menu-progress-bar'),
    };
  };

  /**
   * Bind event listeners
   */
  const bindEvents = () => {
    elements.levelButtons.forEach(btn => {
      btn.addEventListener('click', handleLevelClick);
    });

    const badgesBtn = container.querySelector('[data-action="view-badges"]');
    if (badgesBtn) {
      badgesBtn.addEventListener('click', () => {
        if (onViewBadges) {onViewBadges();}
      });
    }
  };

  /**
   * Handle level button click
   */
  const handleLevelClick = (event) => {
    const btn = event.currentTarget;
    const lessonId = btn.dataset.lessonId;
    const isUnlocked = btn.dataset.unlocked === 'true';

    if (!isUnlocked) {
      showLockedMessage();
      return;
    }

    if (onSelectLesson) {
      onSelectLesson(lessonId);
    }
  };

  /**
   * Show the locked lesson message
   */
  const showLockedMessage = () => {
    if (lockedMessageTimeout) {
      clearTimeout(lockedMessageTimeout);
    }

    elements.lockedMessage.style.display = 'block';

    lockedMessageTimeout = setTimeout(() => {
      elements.lockedMessage.style.display = 'none';
    }, 2500);
  };

  /**
   * Refresh the component with latest progress data
   */
  const refresh = () => {
    progress = getProgress();
    completedLessons = getCompletedLessons();
    render();
  };

  /**
   * Destroy the component and clean up
   */
  const destroy = () => {
    if (lockedMessageTimeout) {
      clearTimeout(lockedMessageTimeout);
    }
    container.innerHTML = '';
    elements = {};
  };

  /**
   * Get current state
   */
  const getState = () => ({
    progress: { ...progress },
    completedLessons: [...completedLessons],
  });

  // Initialize
  render();

  return {
    destroy,
    refresh,
    getState,
  };
}

export default createLessonMenu;
