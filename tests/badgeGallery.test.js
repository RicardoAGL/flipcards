/**
 * Badge Gallery Tests (TDD - RED)
 * Tests written BEFORE implementation to define the Badge Gallery contract
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
import { createBadgeGallery } from '../src/components/BadgeGallery.js';
import { BADGES, BADGE_CATEGORIES } from '../src/data/badges.js';
import { STORAGE_KEYS } from '../src/lib/progressStorage.js';

describe('BadgeGallery Component', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  // ==========================================
  // Rendering
  // ==========================================
  describe('Rendering', () => {
    it('should render the badge gallery container', () => {
      const gallery = createBadgeGallery(container, {});

      expect(container.querySelector('.badge-gallery')).not.toBeNull();
    });

    it('should render a title', () => {
      const gallery = createBadgeGallery(container, {});

      const title = container.querySelector('.badge-gallery__title');
      expect(title).not.toBeNull();
      expect(title.textContent).toBeTruthy();
    });

    it('should render all 10 badge cards', () => {
      const gallery = createBadgeGallery(container, {});

      const cards = container.querySelectorAll('.badge-card');
      expect(cards.length).toBe(BADGES.length);
    });

    it('should render a back button', () => {
      const gallery = createBadgeGallery(container, {});

      const backBtn = container.querySelector('[data-action="back"]');
      expect(backBtn).not.toBeNull();
    });
  });

  // ==========================================
  // Category Grouping
  // ==========================================
  describe('Category Grouping', () => {
    it('should group badges by category', () => {
      const gallery = createBadgeGallery(container, {});

      const groups = container.querySelectorAll('.badge-gallery__category');
      expect(groups.length).toBe(3); // encouragement, mastery, milestone
    });

    it('should display category headers', () => {
      const gallery = createBadgeGallery(container, {});

      const headers = container.querySelectorAll('.badge-gallery__category-title');
      expect(headers.length).toBe(3);
    });

    it('should have 3 encouragement badges', () => {
      const gallery = createBadgeGallery(container, {});

      const encouragementGroup = container.querySelector(
        '[data-category="encouragement"]'
      );
      expect(encouragementGroup).not.toBeNull();
      const cards = encouragementGroup.querySelectorAll('.badge-card');
      expect(cards.length).toBe(3);
    });

    it('should have 9 mastery badges', () => {
      const gallery = createBadgeGallery(container, {});

      const masteryGroup = container.querySelector('[data-category="mastery"]');
      expect(masteryGroup).not.toBeNull();
      const cards = masteryGroup.querySelectorAll('.badge-card');
      expect(cards.length).toBe(9);
    });

    it('should have 3 milestone badges', () => {
      const gallery = createBadgeGallery(container, {});

      const milestoneGroup = container.querySelector(
        '[data-category="milestone"]'
      );
      expect(milestoneGroup).not.toBeNull();
      const cards = milestoneGroup.querySelectorAll('.badge-card');
      expect(cards.length).toBe(3);
    });
  });

  // ==========================================
  // Badge Card Content
  // ==========================================
  describe('Badge Card Content', () => {
    it('should display badge icon on each card', () => {
      const gallery = createBadgeGallery(container, {});

      const cards = container.querySelectorAll('.badge-card');
      cards.forEach((card) => {
        const icon = card.querySelector('.badge-card__icon');
        expect(icon).not.toBeNull();
        expect(icon.textContent.trim()).toBeTruthy();
      });
    });

    it('should display badge name in Spanish by default', () => {
      const gallery = createBadgeGallery(container, {});

      const firstCard = container.querySelector('.badge-card');
      const name = firstCard.querySelector('.badge-card__name');
      expect(name).not.toBeNull();
      // Should match a nameES from BADGES
      const allNamesES = BADGES.map((b) => b.nameES);
      expect(allNamesES).toContain(name.textContent.trim());
    });

    it('should display badge criteria/description text', () => {
      const gallery = createBadgeGallery(container, {});

      const cards = container.querySelectorAll('.badge-card');
      cards.forEach((card) => {
        const desc = card.querySelector('.badge-card__description');
        expect(desc).not.toBeNull();
        expect(desc.textContent.trim()).toBeTruthy();
      });
    });
  });

  // ==========================================
  // Earned vs Unearned States
  // ==========================================
  describe('Earned vs Unearned States', () => {
    it('should show all badges as unearned when no badges are earned', () => {
      const gallery = createBadgeGallery(container, {});

      const unearnedCards = container.querySelectorAll('.badge-card--locked');
      expect(unearnedCards.length).toBe(BADGES.length);
    });

    it('should show earned badge with earned class', () => {
      // Pre-set an earned badge in localStorage
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === STORAGE_KEYS.EARNED_BADGES) {
          return JSON.stringify([
            { id: 'first-steps', earnedAt: 1706700000000 },
          ]);
        }
        return null;
      });

      const gallery = createBadgeGallery(container, {});

      const earnedCards = container.querySelectorAll('.badge-card--earned');
      expect(earnedCards.length).toBe(1);
    });

    it('should show earned date on earned badges', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === STORAGE_KEYS.EARNED_BADGES) {
          return JSON.stringify([
            { id: 'first-steps', earnedAt: 1706700000000 },
          ]);
        }
        return null;
      });

      const gallery = createBadgeGallery(container, {});

      const earnedCard = container.querySelector('.badge-card--earned');
      const dateEl = earnedCard.querySelector('.badge-card__date');
      expect(dateEl).not.toBeNull();
      expect(dateEl.textContent.trim()).toBeTruthy();
    });

    it('should show unearned badges greyed out (locked class)', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === STORAGE_KEYS.EARNED_BADGES) {
          return JSON.stringify([
            { id: 'first-steps', earnedAt: 1706700000000 },
          ]);
        }
        return null;
      });

      const gallery = createBadgeGallery(container, {});

      const lockedCards = container.querySelectorAll('.badge-card--locked');
      expect(lockedCards.length).toBe(BADGES.length - 1);
    });

    it('should handle multiple earned badges', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === STORAGE_KEYS.EARNED_BADGES) {
          return JSON.stringify([
            { id: 'first-steps', earnedAt: 1706700000000 },
            { id: 'perfect-score', earnedAt: 1706800000000 },
            { id: 'practice-master', earnedAt: 1706900000000 },
          ]);
        }
        return null;
      });

      const gallery = createBadgeGallery(container, {});

      const earnedCards = container.querySelectorAll('.badge-card--earned');
      expect(earnedCards.length).toBe(3);

      const lockedCards = container.querySelectorAll('.badge-card--locked');
      expect(lockedCards.length).toBe(BADGES.length - 3);
    });
  });

  // ==========================================
  // Progress Indicators
  // ==========================================
  describe('Progress Indicators', () => {
    it('should show progress for practice-master badge (quiz count)', () => {
      // Simulate 6 out of 10 quizzes completed
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === STORAGE_KEYS.QUIZ_HISTORY) {
          return JSON.stringify(
            Array(6)
              .fill(null)
              .map((_, i) => ({
                lessonId: 'P1-AA-BEG',
                score: 3,
                total: 5,
                passed: true,
                timestamp: Date.now() - i * 10000,
              }))
          );
        }
        return null;
      });

      const gallery = createBadgeGallery(container, {});

      // Find the practice-master card
      const practiceCard = container.querySelector(
        '[data-badge-id="practice-master"]'
      );
      expect(practiceCard).not.toBeNull();
      const progress = practiceCard.querySelector('.badge-card__progress');
      expect(progress).not.toBeNull();
      expect(progress.textContent).toContain('6');
      expect(progress.textContent).toContain('10');
    });

    it('should show progress for lesson completion badges', () => {
      // Simulate 3 completed lessons
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === STORAGE_KEYS.COMPLETED_LESSONS) {
          return JSON.stringify(['P1-AA-BEG', 'P1-AA-ADV', 'P1-EE-BEG']);
        }
        return null;
      });

      const gallery = createBadgeGallery(container, {});

      // level-1-complete requires 8 lessons
      const levelCard = container.querySelector(
        '[data-badge-id="level-1-complete"]'
      );
      expect(levelCard).not.toBeNull();
      const progress = levelCard.querySelector('.badge-card__progress');
      expect(progress).not.toBeNull();
      expect(progress.textContent).toContain('3');
      expect(progress.textContent).toContain('8');
    });

    it('should show summary of earned badge count', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === STORAGE_KEYS.EARNED_BADGES) {
          return JSON.stringify([
            { id: 'first-steps', earnedAt: 1706700000000 },
            { id: 'perfect-score', earnedAt: 1706800000000 },
          ]);
        }
        return null;
      });

      const gallery = createBadgeGallery(container, {});

      const summary = container.querySelector('.badge-gallery__summary');
      expect(summary).not.toBeNull();
      expect(summary.textContent).toContain('2');
      expect(summary.textContent).toContain(String(BADGES.length));
    });
  });

  // ==========================================
  // Language Support
  // ==========================================
  describe('Language Support', () => {
    it('should display Spanish text by default', () => {
      const gallery = createBadgeGallery(container, { language: 'es' });

      const firstCard = container.querySelector('.badge-card');
      const name = firstCard.querySelector('.badge-card__name');
      const allNamesES = BADGES.map((b) => b.nameES);
      expect(allNamesES).toContain(name.textContent.trim());
    });

    it('should display English text when language is en', () => {
      const gallery = createBadgeGallery(container, { language: 'en' });

      const firstCard = container.querySelector('.badge-card');
      const name = firstCard.querySelector('.badge-card__name');
      const allNamesEN = BADGES.map((b) => b.nameEN);
      expect(allNamesEN).toContain(name.textContent.trim());
    });

    it('should display title in correct language', () => {
      const galleryES = createBadgeGallery(container, { language: 'es' });
      const titleES = container.querySelector('.badge-gallery__title').textContent;

      // Clean up and re-create with English
      container.innerHTML = '';
      const galleryEN = createBadgeGallery(container, { language: 'en' });
      const titleEN = container.querySelector('.badge-gallery__title').textContent;

      // Titles should be different for different languages
      expect(titleES).not.toBe(titleEN);
    });
  });

  // ==========================================
  // Navigation / Callbacks
  // ==========================================
  describe('Navigation', () => {
    it('should call onBack when back button is clicked', () => {
      const onBack = vi.fn();
      const gallery = createBadgeGallery(container, { onBack });

      const backBtn = container.querySelector('[data-action="back"]');
      backBtn.click();

      expect(onBack).toHaveBeenCalledTimes(1);
    });

    it('should call onBack when Escape key is pressed', () => {
      const onBack = vi.fn();
      const gallery = createBadgeGallery(container, { onBack });

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);

      expect(onBack).toHaveBeenCalledTimes(1);
    });

    it('should not throw if onBack is not provided', () => {
      const gallery = createBadgeGallery(container, {});

      const backBtn = container.querySelector('[data-action="back"]');
      expect(() => backBtn.click()).not.toThrow();
    });
  });

  // ==========================================
  // Component API
  // ==========================================
  describe('Component API', () => {
    it('should return an object with mount, destroy, getState, refresh', () => {
      const gallery = createBadgeGallery(container, {});

      expect(typeof gallery.destroy).toBe('function');
      expect(typeof gallery.getState).toBe('function');
      expect(typeof gallery.refresh).toBe('function');
    });

    it('should clean up DOM on destroy', () => {
      const gallery = createBadgeGallery(container, {});

      expect(container.querySelector('.badge-gallery')).not.toBeNull();

      gallery.destroy();

      expect(container.querySelector('.badge-gallery')).toBeNull();
    });

    it('should remove keyboard listener on destroy', () => {
      const onBack = vi.fn();
      const gallery = createBadgeGallery(container, { onBack });

      gallery.destroy();

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);

      expect(onBack).not.toHaveBeenCalled();
    });

    it('should return state with earned count and total', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === STORAGE_KEYS.EARNED_BADGES) {
          return JSON.stringify([
            { id: 'first-steps', earnedAt: 1706700000000 },
          ]);
        }
        return null;
      });

      const gallery = createBadgeGallery(container, {});
      const state = gallery.getState();

      expect(state.earnedCount).toBe(1);
      expect(state.totalBadges).toBe(BADGES.length);
    });

    it('should refresh and re-render with updated data', () => {
      // Start with no earned badges — explicitly reset mock
      localStorageMock.getItem.mockImplementation((key) => null);
      const gallery = createBadgeGallery(container, {});

      let earnedCards = container.querySelectorAll('.badge-card--earned');
      expect(earnedCards.length).toBe(0);

      // Simulate earning a badge
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === STORAGE_KEYS.EARNED_BADGES) {
          return JSON.stringify([
            { id: 'first-steps', earnedAt: 1706700000000 },
          ]);
        }
        return null;
      });

      gallery.refresh();

      earnedCards = container.querySelectorAll('.badge-card--earned');
      expect(earnedCards.length).toBe(1);
    });
  });
});
