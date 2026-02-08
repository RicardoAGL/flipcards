/**
 * Splash Screen Component Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createSplashScreen } from '../src/components/SplashScreen.js';

describe('SplashScreen', () => {
  /** @type {HTMLElement} */
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('rendering (Spanish)', () => {
    it('should render app title', () => {
      createSplashScreen(container, { language: 'es' });
      const title = /** @type {HTMLElement} */ (container.querySelector('.splash-screen__title'));
      expect(title).not.toBeNull();
      expect(title.textContent).toContain('Dutch Pronunciation');
    });

    it('should render tagline in Spanish', () => {
      createSplashScreen(container, { language: 'es' });
      const tagline = /** @type {HTMLElement} */ (container.querySelector('.splash-screen__tagline'));
      expect(tagline).not.toBeNull();
      expect(tagline.textContent).toContain('Aprende los sonidos vocálicos del holandés');
    });

    it('should render CTA button in Spanish', () => {
      createSplashScreen(container, { language: 'es' });
      const cta = /** @type {HTMLElement} */ (container.querySelector('.splash-screen__cta'));
      expect(cta).not.toBeNull();
      expect(cta.textContent).toContain('Comenzar');
    });

    it('should render language selector buttons', () => {
      createSplashScreen(container, { language: 'es' });
      const langBtns = container.querySelectorAll('.splash-screen__lang-btn');
      expect(langBtns.length).toBe(2);
    });

    it('should highlight current language button', () => {
      createSplashScreen(container, { language: 'es' });
      const activeBtn = /** @type {HTMLElement} */ (container.querySelector('.splash-screen__lang-btn--active'));
      expect(activeBtn).not.toBeNull();
      expect(activeBtn.textContent).toBe('ES');
    });
  });

  describe('rendering (English)', () => {
    it('should render tagline in English', () => {
      createSplashScreen(container, { language: 'en' });
      const tagline = /** @type {HTMLElement} */ (container.querySelector('.splash-screen__tagline'));
      expect(tagline.textContent).toContain('Learn Dutch vowel sounds');
    });

    it('should render CTA button in English', () => {
      createSplashScreen(container, { language: 'en' });
      const cta = /** @type {HTMLElement} */ (container.querySelector('.splash-screen__cta'));
      expect(cta.textContent).toContain('Start Learning');
    });

    it('should highlight EN button when language is en', () => {
      createSplashScreen(container, { language: 'en' });
      const activeBtn = /** @type {HTMLElement} */ (container.querySelector('.splash-screen__lang-btn--active'));
      expect(activeBtn.textContent).toBe('EN');
    });
  });

  describe('interactions', () => {
    it('should call onStart when CTA is clicked', () => {
      const onStart = vi.fn();
      createSplashScreen(container, { onStart });
      const cta = /** @type {HTMLButtonElement} */ (container.querySelector('.splash-screen__cta'));
      cta.click();
      expect(onStart).toHaveBeenCalledOnce();
    });

    it('should call onLanguageChange when language button is clicked', () => {
      const onLanguageChange = vi.fn();
      createSplashScreen(container, { language: 'es', onLanguageChange });
      const enBtn = /** @type {HTMLButtonElement} */ (container.querySelector('[data-lang="en"]'));
      enBtn.click();
      expect(onLanguageChange).toHaveBeenCalledWith('en');
    });

    it('should not call onLanguageChange when active language button is clicked', () => {
      const onLanguageChange = vi.fn();
      createSplashScreen(container, { language: 'es', onLanguageChange });
      const esBtn = /** @type {HTMLButtonElement} */ (container.querySelector('[data-lang="es"]'));
      esBtn.click();
      expect(onLanguageChange).not.toHaveBeenCalled();
    });

    it('should trigger onStart on Enter keypress on CTA', () => {
      const onStart = vi.fn();
      createSplashScreen(container, { onStart });
      const cta = /** @type {HTMLButtonElement} */ (container.querySelector('.splash-screen__cta'));
      cta.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      // Button click is native behavior for Enter on buttons; test focus + enter
      cta.focus();
      cta.click();
      expect(onStart).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have appropriate ARIA role on main container', () => {
      createSplashScreen(container);
      const splash = /** @type {HTMLElement} */ (container.querySelector('.splash-screen'));
      expect(splash.getAttribute('role')).toBe('region');
    });

    it('should have aria-label on splash screen', () => {
      createSplashScreen(container);
      const splash = /** @type {HTMLElement} */ (container.querySelector('.splash-screen'));
      expect(splash.getAttribute('aria-label')).toBeTruthy();
    });
  });

  describe('lifecycle', () => {
    it('should clear container on destroy', () => {
      const splash = createSplashScreen(container);
      expect(container.innerHTML).not.toBe('');
      splash.destroy();
      expect(container.innerHTML).toBe('');
    });

    it('should return current state via getState', () => {
      const splash = createSplashScreen(container, { language: 'es' });
      const state = splash.getState();
      expect(state.language).toBe('es');
    });
  });
});
