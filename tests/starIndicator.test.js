/**
 * Star Indicator Tests
 * Tests for the star indicator and milestone celebration components
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

// Mock progressStorage module
vi.mock('../src/lib/progressStorage.js', () => ({
  MILESTONES: [
    { level: 1, points: 200, color: '#CD7F32', nameES: 'Bronce', nameEN: 'Bronze' },
    { level: 2, points: 640, color: '#C0C0C0', nameES: 'Plata', nameEN: 'Silver' },
    { level: 3, points: 1280, color: '#FFD700', nameES: 'Oro', nameEN: 'Gold' },
  ],
  getCurrentMilestone: vi.fn(() => null),
  getNextMilestone: vi.fn(() => ({ level: 1, points: 200, color: '#CD7F32', nameES: 'Bronce', nameEN: 'Bronze', remaining: 200 })),
  getAchievedMilestones: vi.fn(() => []),
  getTotalPoints: vi.fn(() => 0),
}));

// Mock badges module
vi.mock('../src/data/badges.js', () => ({
  getBadgeById: vi.fn((id) => {
    const badges = {
      'first-steps': {
        id: 'first-steps',
        nameES: 'Primeros Pasos',
        nameEN: 'First Steps',
        descriptionES: 'Completa tu primera lección',
        descriptionEN: 'Complete your first lesson',
        icon: '🎯',
      },
      'perfect-score': {
        id: 'perfect-score',
        nameES: 'Puntuación Perfecta',
        nameEN: 'Perfect Score',
        descriptionES: 'Quiz perfecto',
        descriptionEN: 'Perfect quiz',
        icon: '💯',
      },
    };
    return badges[id] || null;
  }),
}));

// Import after mocks are set up
import {
  createStarIndicatorHTML,
  createStarProgressHTML,
  showMilestoneCelebration,
  showBadgeCelebration,
  showBadgeCelebrations,
  createStarIndicator,
} from '../src/components/StarIndicator.js';
import {
  getAchievedMilestones,
  getNextMilestone,
  getTotalPoints,
} from '../src/lib/progressStorage.js';
import { getBadgeById } from '../src/data/badges.js';

describe('StarIndicator Component', () => {
  let container;

  beforeEach(() => {
    // Create a fresh container for each test
    container = document.createElement('div');
    document.body.appendChild(container);

    // Clear localStorage and mocks
    localStorageMock.clear();
    vi.clearAllMocks();

    // Reset mock return values to defaults
    getTotalPoints.mockReturnValue(0);
    getAchievedMilestones.mockReturnValue([]);
    getNextMilestone.mockReturnValue({
      level: 1,
      points: 200,
      color: '#CD7F32',
      nameES: 'Bronce',
      nameEN: 'Bronze',
      remaining: 300,
    });
  });

  afterEach(() => {
    // Clean up container
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }

    // Clean up any celebration overlays
    document.querySelectorAll('.milestone-celebration').forEach((el) => el.remove());
    document.querySelectorAll('.badge-celebration').forEach((el) => el.remove());
  });

  describe('createStarIndicatorHTML', () => {
    it('should render 3 star SVGs', () => {
      const html = createStarIndicatorHTML();
      container.innerHTML = html;

      const stars = container.querySelectorAll('.star-indicator-star');
      expect(stars).toHaveLength(3);
    });

    it('should render all unearned when no milestones achieved', () => {
      getAchievedMilestones.mockReturnValue([]);

      const html = createStarIndicatorHTML();
      container.innerHTML = html;

      const unearnedStars = container.querySelectorAll('.star-indicator-star--unearned');
      const earnedStars = container.querySelectorAll('.star-indicator-star--earned');

      expect(unearnedStars).toHaveLength(3);
      expect(earnedStars).toHaveLength(0);
    });

    it('should render earned stars when milestones achieved', () => {
      getAchievedMilestones.mockReturnValue([
        { level: 1, points: 300, color: '#CD7F32', nameES: 'Bronce', nameEN: 'Bronze' },
        { level: 2, points: 640, color: '#C0C0C0', nameES: 'Plata', nameEN: 'Silver' },
      ]);

      const html = createStarIndicatorHTML();
      container.innerHTML = html;

      const unearnedStars = container.querySelectorAll('.star-indicator-star--unearned');
      const earnedStars = container.querySelectorAll('.star-indicator-star--earned');

      expect(earnedStars).toHaveLength(2);
      expect(unearnedStars).toHaveLength(1);
    });
  });

  describe('createStarProgressHTML', () => {
    it('should render next milestone info when milestones remain', () => {
      getNextMilestone.mockReturnValue({
        level: 1,
        points: 200,
        color: '#CD7F32',
        nameES: 'Bronce',
        nameEN: 'Bronze',
        remaining: 150,
      });

      const html = createStarProgressHTML({ language: 'es' });
      container.innerHTML = html;

      const label = container.querySelector('.star-progress-label');
      const points = container.querySelector('.star-progress-points');

      expect(label.textContent).toContain('Próximo hito');
      expect(label.textContent).toContain('Bronce');
      expect(points.textContent).toContain('150');
      expect(points.textContent).toContain('puntos restantes');
    });

    it('should show "all milestones complete" when no next milestone', () => {
      getNextMilestone.mockReturnValue(null);

      const html = createStarProgressHTML({ language: 'es' });
      container.innerHTML = html;

      const label = container.querySelector('.star-progress-label');
      expect(label.textContent).toContain('¡Todos los hitos completados!');
    });

    it('should calculate correct progress percentage', () => {
      getTotalPoints.mockReturnValue(150);
      getNextMilestone.mockReturnValue({
        level: 1,
        points: 200,
        color: '#CD7F32',
        nameES: 'Bronce',
        nameEN: 'Bronze',
        remaining: 150,
      });

      const html = createStarProgressHTML();
      container.innerHTML = html;

      const progressBar = container.querySelector('.star-progress-bar');
      // 150 points out of 200 = 75%
      expect(progressBar.style.width).toBe('75%');
    });
  });

  describe('createStarIndicator', () => {
    it('should render stars in container', () => {
      createStarIndicator(container);

      const starIndicator = container.querySelector('.star-indicator');
      expect(starIndicator).not.toBeNull();
    });

    it('should return render, update, getState, destroy methods', () => {
      const component = createStarIndicator(container);

      expect(typeof component.render).toBe('function');
      expect(typeof component.update).toBe('function');
      expect(typeof component.getState).toBe('function');
      expect(typeof component.destroy).toBe('function');
    });

    it('destroy should clear container', () => {
      const component = createStarIndicator(container);
      component.destroy();

      expect(container.innerHTML).toBe('');
    });
  });

  describe('showMilestoneCelebration', () => {
    it('should append overlay to document.body', () => {
      const milestone = {
        level: 1,
        points: 200,
        color: '#CD7F32',
        nameES: 'Bronce',
        nameEN: 'Bronze',
      };

      showMilestoneCelebration(milestone, { language: 'es' });

      const overlay = document.body.querySelector('.milestone-celebration');
      expect(overlay).not.toBeNull();
    });

    it('should display milestone name and points', () => {
      const milestone = {
        level: 1,
        points: 200,
        color: '#CD7F32',
        nameES: 'Bronce',
        nameEN: 'Bronze',
      };

      showMilestoneCelebration(milestone, { language: 'es' });

      const overlay = document.body.querySelector('.milestone-celebration');
      const level = overlay.querySelector('.milestone-celebration-level');
      const message = overlay.querySelector('.milestone-celebration-message');

      expect(level.textContent).toContain('Bronce');
      expect(message.textContent).toContain('200');
    });

    it('should dismiss on button click and call onDismiss callback', () => {
      const milestone = {
        level: 1,
        points: 200,
        color: '#CD7F32',
        nameES: 'Bronce',
        nameEN: 'Bronze',
      };
      const onDismiss = vi.fn();

      showMilestoneCelebration(milestone, { language: 'es', onDismiss });

      const overlay = document.body.querySelector('.milestone-celebration');
      const dismissBtn = overlay.querySelector('[data-dismiss]');

      dismissBtn.click();

      expect(document.body.querySelector('.milestone-celebration')).toBeNull();
      expect(onDismiss).toHaveBeenCalled();
    });
  });

  describe('showBadgeCelebration', () => {
    it('should show badge celebration overlay', () => {
      showBadgeCelebration('first-steps', { language: 'es' });

      const overlay = document.body.querySelector('.badge-celebration');
      expect(overlay).not.toBeNull();

      const badgeName = overlay.querySelector('.badge-celebration-name');
      expect(badgeName.textContent).toContain('Primeros Pasos');
    });

    it('should call onDismiss immediately if badge not found', () => {
      getBadgeById.mockReturnValue(null);
      const onDismiss = vi.fn();

      showBadgeCelebration('non-existent-badge', { onDismiss });

      expect(onDismiss).toHaveBeenCalled();
      expect(document.body.querySelector('.badge-celebration')).toBeNull();
    });
  });

  describe('showBadgeCelebrations', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      // Reset getBadgeById to return valid badges
      getBadgeById.mockImplementation((id) => {
        const badges = {
          'first-steps': {
            id: 'first-steps',
            nameES: 'Primeros Pasos',
            nameEN: 'First Steps',
            descriptionES: 'Completa tu primera lección',
            descriptionEN: 'Complete your first lesson',
            icon: '🎯',
          },
          'perfect-score': {
            id: 'perfect-score',
            nameES: 'Puntuación Perfecta',
            nameEN: 'Perfect Score',
            descriptionES: 'Quiz perfecto',
            descriptionEN: 'Perfect quiz',
            icon: '💯',
          },
        };
        return badges[id] || null;
      });
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should show multiple badge celebrations in sequence', () => {
      const onComplete = vi.fn();

      showBadgeCelebrations(['first-steps', 'perfect-score'], { language: 'es', onComplete });

      // First badge should appear immediately
      let overlay = document.body.querySelector('.badge-celebration');
      expect(overlay).not.toBeNull();
      expect(overlay.textContent).toContain('Primeros Pasos');

      // Dismiss first badge
      const dismissBtn = overlay.querySelector('[data-dismiss]');
      dismissBtn.click();

      // Fast-forward the 300ms delay
      vi.advanceTimersByTime(300);

      // Second badge should appear
      overlay = document.body.querySelector('.badge-celebration');
      expect(overlay).not.toBeNull();
      expect(overlay.textContent).toContain('Puntuación Perfecta');

      // Dismiss second badge
      overlay.querySelector('[data-dismiss]').click();

      // Fast-forward the 300ms delay
      vi.advanceTimersByTime(300);

      // onComplete should be called
      expect(onComplete).toHaveBeenCalled();
    });

    it('should call onComplete immediately if no badges provided', () => {
      const onComplete = vi.fn();

      showBadgeCelebrations([], { onComplete });

      expect(onComplete).toHaveBeenCalled();
    });
  });
});
