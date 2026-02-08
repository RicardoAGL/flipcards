/**
 * Splash Screen Component
 * Entry point for the application with language selection and CTA
 *
 * @module SplashScreen
 */

import './SplashScreen.css';

/**
 * UI text for different languages
 */
const TEXT = {
  es: {
    tagline: 'Aprende los sonidos vocálicos del holandés',
    cta: 'Comenzar',
    ariaLabel: 'Pantalla de inicio',
  },
  en: {
    tagline: 'Learn Dutch vowel sounds',
    cta: 'Start Learning',
    ariaLabel: 'Welcome screen',
  },
};

/**
 * Create a Splash Screen component
 * @param {HTMLElement} container - Container element to render into
 * @param {Object} [options] - Configuration options
 * @param {string} [options.language='es'] - Display language ('es' or 'en')
 * @param {Function} [options.onStart] - Callback when CTA is clicked
 * @param {Function} [options.onLanguageChange] - Callback when language is changed
 * @returns {{ destroy: Function, getState: Function }}
 */
export function createSplashScreen(container, options = {}) {
  const { language = 'es', onStart, onLanguageChange } = options;
  const text = TEXT[/** @type {'es' | 'en'} */ (language)] || TEXT.es;

  function render() {
    container.innerHTML = `
      <div class="splash-screen" role="region" aria-label="${text.ariaLabel}">
        <div class="splash-screen__content">
          <h1 class="splash-screen__title">Dutch Pronunciation</h1>
          <p class="splash-screen__tagline">${text.tagline}</p>
          <div class="splash-screen__lang">
            <button class="splash-screen__lang-btn ${language === 'es' ? 'splash-screen__lang-btn--active' : ''}"
                    type="button" data-lang="es">ES</button>
            <button class="splash-screen__lang-btn ${language === 'en' ? 'splash-screen__lang-btn--active' : ''}"
                    type="button" data-lang="en">EN</button>
          </div>
          <button class="splash-screen__cta btn btn--primary" type="button">
            ${text.cta}
          </button>
        </div>
      </div>`;

    attachEventListeners();
  }

  function attachEventListeners() {
    const cta = container.querySelector('.splash-screen__cta');
    if (cta) {
      cta.addEventListener('click', () => {
        if (onStart) { onStart(); }
      });
    }

    const langBtns = container.querySelectorAll('.splash-screen__lang-btn');
    langBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        if (lang !== language && onLanguageChange) {
          onLanguageChange(lang);
        }
      });
    });
  }

  function destroy() {
    container.innerHTML = '';
  }

  function getState() {
    return { language };
  }

  render();

  return { destroy, getState };
}
