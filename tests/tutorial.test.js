/**
 * Tutorial Component Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createTutorial } from '../src/components/Tutorial.js';

describe('Tutorial', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Clean up any remaining overlays
    document.querySelectorAll('.tutorial-overlay').forEach((el) => el.remove());
  });

  describe('rendering', () => {
    it('should render overlay with dialog role', () => {
      const tut = createTutorial();
      const overlay = document.querySelector('.tutorial-overlay');

      expect(overlay).toBeTruthy();
      expect(overlay.getAttribute('role')).toBe('dialog');
      expect(overlay.getAttribute('aria-modal')).toBe('true');

      tut.destroy();
    });

    it('should render first step content by default', () => {
      const tut = createTutorial({ language: 'es' });

      expect(document.querySelector('.tutorial-title').textContent).toBe('Elige un sonido');
      expect(document.querySelector('.tutorial-description')).toBeTruthy();
      expect(document.querySelector('.tutorial-icon')).toBeTruthy();

      tut.destroy();
    });

    it('should render 4 dots', () => {
      const tut = createTutorial();
      const dots = document.querySelectorAll('.tutorial-dot');

      expect(dots).toHaveLength(4);
      expect(dots[0].classList.contains('tutorial-dot--active')).toBe(true);

      tut.destroy();
    });

    it('should render step counter showing 1 de 4', () => {
      const tut = createTutorial({ language: 'es' });
      const counter = document.querySelector('.tutorial-step-counter');

      expect(counter.textContent).toBe('1 de 4');

      tut.destroy();
    });

    it('should render skip and next buttons', () => {
      const tut = createTutorial();

      expect(document.querySelector('[data-tutorial-skip]')).toBeTruthy();
      expect(document.querySelector('[data-tutorial-next]')).toBeTruthy();

      tut.destroy();
    });
  });

  describe('navigation', () => {
    it('should advance to next step on Next click', () => {
      const tut = createTutorial({ language: 'es' });
      const nextBtn = document.querySelector('[data-tutorial-next]');

      nextBtn.click();

      expect(document.querySelector('.tutorial-title').textContent).toBe('Explora con tarjetas');
      expect(document.querySelector('.tutorial-step-counter').textContent).toBe('2 de 4');
      expect(tut.getState().currentStep).toBe(1);

      tut.destroy();
    });

    it('should update dots on navigation', () => {
      const tut = createTutorial();

      document.querySelector('[data-tutorial-next]').click();

      const dots = document.querySelectorAll('.tutorial-dot');
      expect(dots[0].classList.contains('tutorial-dot--completed')).toBe(true);
      expect(dots[1].classList.contains('tutorial-dot--active')).toBe(true);

      tut.destroy();
    });

    it('should show done text on last step', () => {
      const tut = createTutorial({ language: 'es' });

      // Advance to last step
      document.querySelector('[data-tutorial-next]').click();
      document.querySelector('[data-tutorial-next]').click();
      document.querySelector('[data-tutorial-next]').click();

      expect(document.querySelector('[data-tutorial-next]').textContent).toBe('Comenzar');
      expect(tut.getState().currentStep).toBe(3);

      tut.destroy();
    });
  });

  describe('completion', () => {
    it('should call onComplete when clicking done on last step', () => {
      const onComplete = vi.fn();
      createTutorial({ onComplete });

      // Advance to last step
      document.querySelector('[data-tutorial-next]').click();
      document.querySelector('[data-tutorial-next]').click();
      document.querySelector('[data-tutorial-next]').click();
      // Click done
      document.querySelector('[data-tutorial-next]').click();

      expect(onComplete).toHaveBeenCalledOnce();
      expect(document.querySelector('.tutorial-overlay')).toBeNull();
    });

    it('should call onComplete when clicking skip', () => {
      const onComplete = vi.fn();
      createTutorial({ onComplete });

      document.querySelector('[data-tutorial-skip]').click();

      expect(onComplete).toHaveBeenCalledOnce();
      expect(document.querySelector('.tutorial-overlay')).toBeNull();
    });

    it('should call onComplete on backdrop click', () => {
      const onComplete = vi.fn();
      createTutorial({ onComplete });

      const overlay = document.querySelector('.tutorial-overlay');
      overlay.click();

      expect(onComplete).toHaveBeenCalledOnce();
      expect(document.querySelector('.tutorial-overlay')).toBeNull();
    });

    it('should call onComplete on Escape key', () => {
      const onComplete = vi.fn();
      createTutorial({ onComplete });

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(onComplete).toHaveBeenCalledOnce();
      expect(document.querySelector('.tutorial-overlay')).toBeNull();
    });

    it('should NOT call onComplete on non-backdrop card click', () => {
      const onComplete = vi.fn();
      createTutorial({ onComplete });

      document.querySelector('.tutorial-card').click();

      expect(onComplete).not.toHaveBeenCalled();
      expect(document.querySelector('.tutorial-overlay')).toBeTruthy();
    });

    it('should remove overlay from DOM on completion', () => {
      const onComplete = vi.fn();
      createTutorial({ onComplete });

      document.querySelector('[data-tutorial-skip]').click();

      expect(document.querySelectorAll('.tutorial-overlay')).toHaveLength(0);
    });
  });

  describe('i18n', () => {
    it('should render Spanish text by default', () => {
      const tut = createTutorial({ language: 'es' });

      expect(document.querySelector('[data-tutorial-skip]').textContent).toBe('Saltar');
      expect(document.querySelector('[data-tutorial-next]').textContent).toBe('Siguiente');

      tut.destroy();
    });

    it('should render English text', () => {
      const tut = createTutorial({ language: 'en' });

      expect(document.querySelector('[data-tutorial-skip]').textContent).toBe('Skip');
      expect(document.querySelector('[data-tutorial-next]').textContent).toBe('Next');
      expect(document.querySelector('.tutorial-title').textContent).toBe('Choose a sound');

      tut.destroy();
    });

    it('should fall back to Spanish for unknown language', () => {
      const tut = createTutorial({ language: 'fr' });

      expect(document.querySelector('[data-tutorial-skip]').textContent).toBe('Saltar');

      tut.destroy();
    });

    it('should show Start Learning on last step in English', () => {
      const tut = createTutorial({ language: 'en' });

      document.querySelector('[data-tutorial-next]').click();
      document.querySelector('[data-tutorial-next]').click();
      document.querySelector('[data-tutorial-next]').click();

      expect(document.querySelector('[data-tutorial-next]').textContent).toBe('Start Learning');

      tut.destroy();
    });
  });

  describe('accessibility', () => {
    it('should have aria-modal attribute', () => {
      const tut = createTutorial();
      const overlay = document.querySelector('.tutorial-overlay');

      expect(overlay.getAttribute('aria-modal')).toBe('true');

      tut.destroy();
    });

    it('should call focus on the next button on render', () => {
      const focusSpy = vi.spyOn(HTMLButtonElement.prototype, 'focus');
      const tut = createTutorial();

      expect(focusSpy).toHaveBeenCalled();

      focusSpy.mockRestore();
      tut.destroy();
    });

    it('should call focus on the next button after navigation', () => {
      const tut = createTutorial();
      const focusSpy = vi.spyOn(HTMLButtonElement.prototype, 'focus');

      document.querySelector('[data-tutorial-next]').click();

      expect(focusSpy).toHaveBeenCalled();

      focusSpy.mockRestore();
      tut.destroy();
    });
  });

  describe('lifecycle', () => {
    it('should return currentStep in getState', () => {
      const tut = createTutorial();

      expect(tut.getState().currentStep).toBe(0);

      document.querySelector('[data-tutorial-next]').click();
      expect(tut.getState().currentStep).toBe(1);

      tut.destroy();
    });

    it('should clean up without calling onComplete on destroy', () => {
      const onComplete = vi.fn();
      const tut = createTutorial({ onComplete });

      tut.destroy();

      expect(onComplete).not.toHaveBeenCalled();
      expect(document.querySelector('.tutorial-overlay')).toBeNull();
    });

    it('should remove keydown listener on destroy', () => {
      const onComplete = vi.fn();
      const tut = createTutorial({ onComplete });

      tut.destroy();

      // Escape should not trigger onComplete after destroy
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(onComplete).not.toHaveBeenCalled();
    });
  });
});
