/**
 * Star Indicator Tests
 * Tests for the star indicator and milestone celebration components
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock localStorage before importing modules that use it
/** @type {any} */
const localStorageMock = (() => {
  /** @type {Record<string, string>} */
  let store = {};
  return {
    getItem: vi.fn((/** @type {string} */ key) => store[key] || null),
    setItem: vi.fn((/** @type {string} */ key, /** @type {string} */ value) => {
      store[key] = value;
    }),
    removeItem: vi.fn((/** @type {string} */ key) => {
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
  getBadgeById: vi.fn((/** @type {string} */ id) => {
    /** @type {Record<string, any>} */
    const badges = {
      'first-steps': { id: 'first-steps', nameES: 'Primeros Pasos', nameEN: 'First Steps', descriptionES: 'Completa tu primera lección', descriptionEN: 'Complete your first lesson', icon: '🎯' },
      'perfect-score': { id: 'perfect-score', nameES: 'Puntuación Perfecta', nameEN: 'Perfect Score', descriptionES: 'Quiz perfecto', descriptionEN: 'Perfect quiz', icon: '💯' },
    };
    return badges[id] || null;
  }),
}));

// Import after mocks are set up
import { createStarIndicatorHTML, createStarProgressHTML, showMilestoneCelebration, showBadgeCelebration, showBadgeCelebrations, showCombinedCelebration, createStarIndicator } from '../src/components/StarIndicator.js';
import { getAchievedMilestones, getNextMilestone, getTotalPoints } from '../src/lib/progressStorage.js';
import { getBadgeById } from '../src/data/badges.js';

/** @type {import('vitest').Mock} */ const getTotalPointsMock = /** @type {any} */ (getTotalPoints);
/** @type {import('vitest').Mock} */ const getAchievedMilestonesMock = /** @type {any} */ (getAchievedMilestones);
/** @type {import('vitest').Mock} */ const getNextMilestoneMock = /** @type {any} */ (getNextMilestone);
/** @type {import('vitest').Mock} */ const getBadgeByIdMock = /** @type {any} */ (getBadgeById);

describe('StarIndicator Component', () => {
  /** @type {HTMLElement} */ let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    localStorageMock.clear();
    vi.clearAllMocks();
    getTotalPointsMock.mockReturnValue(0);
    getAchievedMilestonesMock.mockReturnValue([]);
    getNextMilestoneMock.mockReturnValue({ level: 1, points: 200, color: '#CD7F32', nameES: 'Bronce', nameEN: 'Bronze', remaining: 300 });
  });

  afterEach(() => {
    if (container && container.parentNode) { container.parentNode.removeChild(container); }
    document.querySelectorAll('.milestone-celebration').forEach((el) => el.remove());
    document.querySelectorAll('.badge-celebration').forEach((el) => el.remove());
  });

  describe('createStarIndicatorHTML', () => {
    it('should render 3 star SVGs', () => { const html = createStarIndicatorHTML(); container.innerHTML = html; expect(container.querySelectorAll('.star-indicator-star')).toHaveLength(3); });
    it('should render all unearned when no milestones achieved', () => { getAchievedMilestonesMock.mockReturnValue([]); container.innerHTML = createStarIndicatorHTML(); expect(container.querySelectorAll('.star-indicator-star--unearned')).toHaveLength(3); expect(container.querySelectorAll('.star-indicator-star--earned')).toHaveLength(0); });
    it('should render earned stars when milestones achieved', () => {
      getAchievedMilestonesMock.mockReturnValue([
        { level: 1, points: 200, color: '#CD7F32', nameES: 'Bronce', nameEN: 'Bronze' },
        { level: 2, points: 640, color: '#C0C0C0', nameES: 'Plata', nameEN: 'Silver' },
      ]);
      container.innerHTML = createStarIndicatorHTML();
      expect(container.querySelectorAll('.star-indicator-star--earned')).toHaveLength(2);
      expect(container.querySelectorAll('.star-indicator-star--unearned')).toHaveLength(1);
    });
  });

  describe('createStarProgressHTML', () => {
    it('should render next milestone info when milestones remain', () => {
      getNextMilestoneMock.mockReturnValue({ level: 1, points: 200, color: '#CD7F32', nameES: 'Bronce', nameEN: 'Bronze', remaining: 150 });
      container.innerHTML = createStarProgressHTML({ language: 'es' });
      const label = /** @type {HTMLElement} */ (container.querySelector('.star-progress-label'));
      const points = /** @type {HTMLElement} */ (container.querySelector('.star-progress-points'));
      expect(label.textContent).toContain('Próximo hito');
      expect(label.textContent).toContain('Bronce');
      expect(points.textContent).toContain('150');
      expect(points.textContent).toContain('puntos restantes');
    });
    it('should show "all milestones complete" when no next milestone', () => {
      getNextMilestoneMock.mockReturnValue(null);
      container.innerHTML = createStarProgressHTML({ language: 'es' });
      const label = /** @type {HTMLElement} */ (container.querySelector('.star-progress-label'));
      expect(label.textContent).toContain('¡Todos los hitos completados!');
    });
    it('should calculate correct progress percentage', () => {
      getTotalPointsMock.mockReturnValue(150);
      getNextMilestoneMock.mockReturnValue({ level: 1, points: 200, color: '#CD7F32', nameES: 'Bronce', nameEN: 'Bronze', remaining: 150 });
      container.innerHTML = createStarProgressHTML();
      const progressBar = /** @type {HTMLElement} */ (container.querySelector('.star-progress-bar'));
      expect(progressBar.style.width).toBe('75%');
    });
  });

  describe('createStarIndicator', () => {
    it('should render stars in container', () => { createStarIndicator(container); expect(container.querySelector('.star-indicator')).not.toBeNull(); });
    it('should return render, update, getState, destroy methods', () => {
      const component = /** @type {any} */ (createStarIndicator(container));
      expect(typeof component.render).toBe('function');
      expect(typeof component.update).toBe('function');
      expect(typeof component.getState).toBe('function');
      expect(typeof component.destroy).toBe('function');
    });
    it('destroy should clear container', () => { const component = /** @type {any} */ (createStarIndicator(container)); component.destroy(); expect(container.innerHTML).toBe(''); });
  });

  describe('showMilestoneCelebration', () => {
    it('should append overlay to document.body', () => {
      showMilestoneCelebration(/** @type {any} */ ({ level: 1, points: 200, color: '#CD7F32', nameES: 'Bronce', nameEN: 'Bronze' }), { language: 'es' });
      expect(document.body.querySelector('.milestone-celebration')).not.toBeNull();
    });
    it('should display milestone name and points', () => {
      showMilestoneCelebration(/** @type {any} */ ({ level: 1, points: 200, color: '#CD7F32', nameES: 'Bronce', nameEN: 'Bronze' }), { language: 'es' });
      const overlay = /** @type {HTMLElement} */ (document.body.querySelector('.milestone-celebration'));
      const level = /** @type {HTMLElement} */ (overlay.querySelector('.milestone-celebration-level'));
      const message = /** @type {HTMLElement} */ (overlay.querySelector('.milestone-celebration-message'));
      expect(level.textContent).toContain('Bronce');
      expect(message.textContent).toContain('200');
    });
    it('should dismiss on button click and call onDismiss callback', () => {
      const onDismiss = vi.fn();
      showMilestoneCelebration(/** @type {any} */ ({ level: 1, points: 200, color: '#CD7F32', nameES: 'Bronce', nameEN: 'Bronze' }), { language: 'es', onDismiss });
      const overlay = /** @type {HTMLElement} */ (document.body.querySelector('.milestone-celebration'));
      /** @type {HTMLButtonElement} */ (overlay.querySelector('[data-dismiss]')).click();
      expect(document.body.querySelector('.milestone-celebration')).toBeNull();
      expect(onDismiss).toHaveBeenCalled();
    });
  });

  describe('showMilestoneCelebration - listener cleanup', () => {
    it('should remove keydown listener on button click dismiss', () => {
      const spy = vi.spyOn(document, 'removeEventListener');
      showMilestoneCelebration(/** @type {any} */ ({ level: 1, points: 200, color: '#CD7F32', nameES: 'Bronce', nameEN: 'Bronze' }), { language: 'es' });
      const overlay = /** @type {HTMLElement} */ (document.body.querySelector('.milestone-celebration'));
      /** @type {HTMLButtonElement} */ (overlay.querySelector('[data-dismiss]')).click();
      expect(spy).toHaveBeenCalledWith('keydown', expect.any(Function));
      spy.mockRestore();
    });
    it('should remove keydown listener on backdrop click dismiss', () => {
      const spy = vi.spyOn(document, 'removeEventListener');
      showMilestoneCelebration(/** @type {any} */ ({ level: 1, points: 200, color: '#CD7F32', nameES: 'Bronce', nameEN: 'Bronze' }), { language: 'es' });
      const overlay = /** @type {HTMLElement} */ (document.body.querySelector('.milestone-celebration'));
      overlay.click();
      expect(spy).toHaveBeenCalledWith('keydown', expect.any(Function));
      spy.mockRestore();
    });
  });

  describe('showBadgeCelebration', () => {
    it('should show badge celebration overlay', () => {
      showBadgeCelebration('first-steps', { language: 'es' });
      const overlay = /** @type {HTMLElement} */ (document.body.querySelector('.badge-celebration'));
      expect(overlay).not.toBeNull();
      const badgeName = /** @type {HTMLElement} */ (overlay.querySelector('.badge-celebration-name'));
      expect(badgeName.textContent).toContain('Primeros Pasos');
    });
    it('should remove keydown listener on button click dismiss', () => {
      const spy = vi.spyOn(document, 'removeEventListener');
      showBadgeCelebration('first-steps', { language: 'es' });
      const overlay = /** @type {HTMLElement} */ (document.body.querySelector('.badge-celebration'));
      /** @type {HTMLButtonElement} */ (overlay.querySelector('[data-dismiss]')).click();
      expect(spy).toHaveBeenCalledWith('keydown', expect.any(Function));
      spy.mockRestore();
    });
    it('should remove keydown listener on backdrop click dismiss', () => {
      const spy = vi.spyOn(document, 'removeEventListener');
      showBadgeCelebration('first-steps', { language: 'es' });
      const overlay = /** @type {HTMLElement} */ (document.body.querySelector('.badge-celebration'));
      overlay.click();
      expect(spy).toHaveBeenCalledWith('keydown', expect.any(Function));
      spy.mockRestore();
    });
    it('should call onDismiss immediately if badge not found', () => {
      getBadgeByIdMock.mockReturnValue(null);
      const onDismiss = vi.fn();
      showBadgeCelebration('non-existent-badge', { onDismiss });
      expect(onDismiss).toHaveBeenCalled();
      expect(document.body.querySelector('.badge-celebration')).toBeNull();
    });
  });

  describe('showBadgeCelebrations', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      getBadgeByIdMock.mockImplementation((/** @type {string} */ id) => {
        /** @type {Record<string, any>} */
        const badges = {
          'first-steps': { id: 'first-steps', nameES: 'Primeros Pasos', nameEN: 'First Steps', descriptionES: 'Completa tu primera lección', descriptionEN: 'Complete your first lesson', icon: '🎯' },
          'perfect-score': { id: 'perfect-score', nameES: 'Puntuación Perfecta', nameEN: 'Perfect Score', descriptionES: 'Quiz perfecto', descriptionEN: 'Perfect quiz', icon: '💯' },
        };
        return badges[id] || null;
      });
    });
    afterEach(() => { vi.useRealTimers(); });

    it('should show multiple badge celebrations in sequence', () => {
      const onComplete = vi.fn();
      showBadgeCelebrations(['first-steps', 'perfect-score'], { language: 'es', onComplete });
      let overlay = /** @type {HTMLElement} */ (document.body.querySelector('.badge-celebration'));
      expect(overlay).not.toBeNull();
      expect(overlay.textContent).toContain('Primeros Pasos');
      /** @type {HTMLButtonElement} */ (overlay.querySelector('[data-dismiss]')).click();
      vi.advanceTimersByTime(300);
      overlay = /** @type {HTMLElement} */ (document.body.querySelector('.badge-celebration'));
      expect(overlay).not.toBeNull();
      expect(overlay.textContent).toContain('Puntuación Perfecta');
      /** @type {HTMLButtonElement} */ (overlay.querySelector('[data-dismiss]')).click();
      vi.advanceTimersByTime(300);
      expect(onComplete).toHaveBeenCalled();
    });
    it('should call onComplete immediately if no badges provided', () => { const onComplete = vi.fn(); showBadgeCelebrations([], { onComplete }); expect(onComplete).toHaveBeenCalled(); });
  });

  describe('showCombinedCelebration', () => {
    beforeEach(() => {
      getBadgeByIdMock.mockImplementation((/** @type {string} */ id) => {
        /** @type {Record<string, any>} */
        const badges = {
          'first-steps': { id: 'first-steps', nameES: 'Primeros Pasos', nameEN: 'First Steps', descriptionES: 'Completa tu primera lección', descriptionEN: 'Complete your first lesson', icon: '🎯' },
          'perfect-score': { id: 'perfect-score', nameES: 'Puntuación Perfecta', nameEN: 'Perfect Score', descriptionES: 'Quiz perfecto', descriptionEN: 'Perfect quiz', icon: '💯' },
        };
        return badges[id] || null;
      });
    });

    it('should call onDismiss immediately if no badges and no milestone', () => { const onDismiss = vi.fn(); showCombinedCelebration({ badges: [], milestone: null, onDismiss }); expect(onDismiss).toHaveBeenCalled(); expect(document.body.querySelector('.combined-celebration')).toBeNull(); });
    it('should delegate to showBadgeCelebration for single badge without milestone', () => {
      showCombinedCelebration({ badges: ['first-steps'], milestone: null, language: 'es' });
      const overlay = /** @type {HTMLElement} */ (document.body.querySelector('.badge-celebration'));
      expect(overlay).not.toBeNull();
      expect(overlay.textContent).toContain('Primeros Pasos');
      expect(document.body.querySelector('.combined-celebration')).toBeNull();
    });
    it('should delegate to showMilestoneCelebration for milestone without badges', () => {
      showCombinedCelebration({ badges: [], milestone: /** @type {any} */ ({ level: 1, points: 200, color: '#CD7F32', nameES: 'Bronce', nameEN: 'Bronze' }), language: 'es' });
      const overlay = /** @type {HTMLElement} */ (document.body.querySelector('.milestone-celebration'));
      expect(overlay).not.toBeNull();
      expect(overlay.textContent).toContain('Bronce');
      expect(document.body.querySelector('.combined-celebration')).toBeNull();
    });
    it('should show combined modal for multiple badges', () => {
      showCombinedCelebration({ badges: ['first-steps', 'perfect-score'], milestone: null, language: 'es' });
      const overlay = /** @type {HTMLElement} */ (document.body.querySelector('.combined-celebration'));
      expect(overlay).not.toBeNull();
      expect(overlay.textContent).toContain('Insignias Ganadas');
      expect(overlay.textContent).toContain('Primeros Pasos');
      expect(overlay.textContent).toContain('Puntuación Perfecta');
    });
    it('should show combined modal for badge + milestone', () => {
      showCombinedCelebration({ badges: ['first-steps'], milestone: /** @type {any} */ ({ level: 1, points: 200, color: '#CD7F32', nameES: 'Bronce', nameEN: 'Bronze' }), language: 'es' });
      const overlay = /** @type {HTMLElement} */ (document.body.querySelector('.combined-celebration'));
      expect(overlay).not.toBeNull();
      expect(overlay.textContent).toContain('Insignias Ganadas');
      expect(overlay.textContent).toContain('Primeros Pasos');
      expect(overlay.textContent).toContain('Hito Alcanzado');
      expect(overlay.textContent).toContain('Bronce');
    });
    it('should dismiss on button click', () => {
      const onDismiss = vi.fn();
      showCombinedCelebration({ badges: ['first-steps', 'perfect-score'], milestone: null, language: 'es', onDismiss });
      const overlay = /** @type {HTMLElement} */ (document.body.querySelector('.combined-celebration'));
      expect(overlay).not.toBeNull();
      /** @type {HTMLButtonElement} */ (overlay.querySelector('[data-dismiss]')).click();
      expect(document.body.querySelector('.combined-celebration')).toBeNull();
      expect(onDismiss).toHaveBeenCalled();
    });
    it('should use correct language for EN', () => {
      showCombinedCelebration({ badges: ['first-steps', 'perfect-score'], milestone: null, language: 'en' });
      const overlay = /** @type {HTMLElement} */ (document.body.querySelector('.combined-celebration'));
      expect(overlay).not.toBeNull();
      expect(overlay.textContent).toContain('Badges Earned');
      expect(overlay.textContent).toContain('First Steps');
      expect(overlay.textContent).toContain('Perfect Score');
    });
  });
});
