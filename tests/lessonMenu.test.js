/**
 * Lesson Menu Tests
 * Tests for the lesson selection menu component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock localStorage before importing modules that use it
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

// Import after localStorage mock is set up
import { createLessonMenu } from '../src/components/LessonMenu.js';
import { STORAGE_KEYS } from '../src/lib/progressStorage.js';

describe('LessonMenu Component', () => {
  let container;

  beforeEach(() => {
    // Create a fresh container for each test
    container = document.createElement('div');
    document.body.appendChild(container);

    // Clear localStorage and mocks
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up container
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('Rendering', () => {
    it('should render the lesson menu', () => {
      createLessonMenu(container, {});

      expect(container.querySelector('.lesson-menu')).not.toBeNull();
    });

    it('should render all 4 sound cards', () => {
      createLessonMenu(container, {});

      const soundCards = container.querySelectorAll('.sound-card');
      expect(soundCards).toHaveLength(4);
    });

    it('should render correct sound labels', () => {
      createLessonMenu(container, {});

      const sounds = container.querySelectorAll('.sound-card-sound');
      const soundTexts = Array.from(sounds).map((el) => el.textContent);

      expect(soundTexts).toContain('aa');
      expect(soundTexts).toContain('ee');
      expect(soundTexts).toContain('oo');
      expect(soundTexts).toContain('uu');
    });

    it('should render progress card', () => {
      createLessonMenu(container, {});

      expect(container.querySelector('.lesson-menu-progress')).not.toBeNull();
    });

    it('should render level buttons for each sound', () => {
      createLessonMenu(container, {});

      const levelButtons = container.querySelectorAll('.level-btn');
      // 4 sounds x 2 levels = 8 buttons
      expect(levelButtons).toHaveLength(8);
    });
  });

  describe('Progress Display', () => {
    it('should show 0% progress when no lessons completed', () => {
      createLessonMenu(container, {});

      const progressBar = container.querySelector('.lesson-menu-progress-bar');
      expect(progressBar.style.width).toBe('0%');
    });

    it('should show correct progress percentage', () => {
      // Complete 2 of 8 lessons (25%)
      localStorageMock.setItem(
        STORAGE_KEYS.COMPLETED_LESSONS,
        JSON.stringify(['P1-AA-BEG', 'P1-EE-BEG'])
      );

      createLessonMenu(container, {});

      const progressBar = container.querySelector('.lesson-menu-progress-bar');
      expect(progressBar.style.width).toBe('25%');
    });

    it('should display points', () => {
      localStorageMock.setItem(STORAGE_KEYS.TOTAL_POINTS, '150');

      createLessonMenu(container, {});

      const pointsDisplay = container.querySelector('.lesson-menu-points');
      expect(pointsDisplay.textContent).toContain('150');
    });
  });

  describe('Locked State', () => {
    it('should show beginner lessons as unlocked by default', () => {
      createLessonMenu(container, {});

      const beginnerButtons = container.querySelectorAll(
        '[data-lesson-id$="-BEG"]'
      );
      beginnerButtons.forEach((btn) => {
        expect(btn.classList.contains('level-btn--unlocked')).toBe(true);
        expect(btn.dataset.unlocked).toBe('true');
      });
    });

    it('should show advanced lessons as locked by default', () => {
      createLessonMenu(container, {});

      const advancedButtons = container.querySelectorAll(
        '[data-lesson-id$="-ADV"]'
      );
      advancedButtons.forEach((btn) => {
        expect(btn.classList.contains('level-btn--locked')).toBe(true);
        expect(btn.dataset.unlocked).toBe('false');
      });
    });

    it('should unlock advanced when beginner is completed', () => {
      localStorageMock.setItem(
        STORAGE_KEYS.COMPLETED_LESSONS,
        JSON.stringify(['P1-AA-BEG'])
      );

      createLessonMenu(container, {});

      const aaAdvanced = container.querySelector('[data-lesson-id="P1-AA-ADV"]');
      expect(aaAdvanced.classList.contains('level-btn--unlocked')).toBe(true);
      expect(aaAdvanced.dataset.unlocked).toBe('true');
    });

    it('should show completed lessons with checkmark class', () => {
      localStorageMock.setItem(
        STORAGE_KEYS.COMPLETED_LESSONS,
        JSON.stringify(['P1-AA-BEG'])
      );

      createLessonMenu(container, {});

      const aaBeginner = container.querySelector('[data-lesson-id="P1-AA-BEG"]');
      expect(aaBeginner.classList.contains('level-btn--completed')).toBe(true);
    });
  });

  describe('Lesson Selection', () => {
    it('should call onSelectLesson when unlocked lesson is clicked', () => {
      const onSelectLesson = vi.fn();

      createLessonMenu(container, { onSelectLesson });

      const beginnerButton = container.querySelector(
        '[data-lesson-id="P1-AA-BEG"]'
      );
      beginnerButton.click();

      expect(onSelectLesson).toHaveBeenCalledWith('P1-AA-BEG');
    });

    it('should not call onSelectLesson when locked lesson is clicked', () => {
      const onSelectLesson = vi.fn();

      createLessonMenu(container, { onSelectLesson });

      const advancedButton = container.querySelector(
        '[data-lesson-id="P1-AA-ADV"]'
      );
      advancedButton.click();

      expect(onSelectLesson).not.toHaveBeenCalled();
    });

    it('should show locked message when locked lesson is clicked', async () => {
      createLessonMenu(container, {});

      const advancedButton = container.querySelector(
        '[data-lesson-id="P1-AA-ADV"]'
      );
      advancedButton.click();

      const lockedMessage = container.querySelector('[data-locked-message]');
      expect(lockedMessage.style.display).toBe('block');
    });
  });

  describe('Component API', () => {
    it('should return destroy method', () => {
      const menu = createLessonMenu(container, {});

      expect(typeof menu.destroy).toBe('function');
    });

    it('should return refresh method', () => {
      const menu = createLessonMenu(container, {});

      expect(typeof menu.refresh).toBe('function');
    });

    it('should return getState method', () => {
      const menu = createLessonMenu(container, {});

      expect(typeof menu.getState).toBe('function');
    });

    it('should clean up on destroy', () => {
      const menu = createLessonMenu(container, {});
      menu.destroy();

      expect(container.innerHTML).toBe('');
    });

    it('should return correct state', () => {
      localStorageMock.setItem(
        STORAGE_KEYS.COMPLETED_LESSONS,
        JSON.stringify(['P1-AA-BEG'])
      );
      localStorageMock.setItem(STORAGE_KEYS.TOTAL_POINTS, '100');

      const menu = createLessonMenu(container, {});
      const state = menu.getState();

      expect(state.completedLessons).toEqual(['P1-AA-BEG']);
      expect(state.progress.completed).toBe(1);
      expect(state.progress.points).toBe(100);
    });

    it('should refresh with updated data', () => {
      const menu = createLessonMenu(container, {});

      // Simulate completing a lesson
      localStorageMock.setItem(
        STORAGE_KEYS.COMPLETED_LESSONS,
        JSON.stringify(['P1-AA-BEG'])
      );

      menu.refresh();

      const aaBeginner = container.querySelector('[data-lesson-id="P1-AA-BEG"]');
      expect(aaBeginner.classList.contains('level-btn--completed')).toBe(true);
    });
  });

  describe('Badge Gallery Navigation', () => {
    it('should render a view badges button', () => {
      createLessonMenu(container, {});

      const badgesBtn = container.querySelector('[data-action="view-badges"]');
      expect(badgesBtn).not.toBeNull();
    });

    it('should call onViewBadges when badge button is clicked', () => {
      const onViewBadges = vi.fn();
      createLessonMenu(container, { onViewBadges });

      const badgesBtn = container.querySelector('[data-action="view-badges"]');
      badgesBtn.click();

      expect(onViewBadges).toHaveBeenCalledTimes(1);
    });

    it('should not throw if onViewBadges is not provided', () => {
      createLessonMenu(container, {});

      const badgesBtn = container.querySelector('[data-action="view-badges"]');
      expect(() => badgesBtn.click()).not.toThrow();
    });
  });

  describe('Language Support', () => {
    it('should render Spanish text by default', () => {
      createLessonMenu(container, {});

      const title = container.querySelector('.lesson-menu-title');
      expect(title.textContent).toBe('Lecciones');
    });

    it('should render English text when language is en', () => {
      createLessonMenu(container, { language: 'en' });

      const title = container.querySelector('.lesson-menu-title');
      expect(title.textContent).toBe('Lessons');
    });
  });
});
