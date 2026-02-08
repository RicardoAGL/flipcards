import './Tutorial.css';

const TOTAL_STEPS = 4;

const TEXT = {
  es: {
    skip: 'Saltar',
    next: 'Siguiente',
    done: 'Comenzar',
    stepOf: (/** @type {number} */ current, /** @type {number} */ total) => `${current} de ${total}`,
    steps: [
      {
        icon: '\u{1F4DA}',
        title: 'Elige un sonido',
        description: 'Selecciona un sonido del men\u00FA para comenzar. Cada sonido tiene una lecci\u00F3n para principiantes y una avanzada.',
      },
      {
        icon: '\u{1F0CF}',
        title: 'Explora con tarjetas',
        description: 'Toca las tarjetas laterales para recorrer las palabras. Toca la tarjeta central para escuchar la pronunciaci\u00F3n.',
      },
      {
        icon: '\u2705',
        title: 'Pon a prueba tu conocimiento',
        description: 'Completa el quiz para cada lecci\u00F3n. Obt\u00E9n 80% para aprobar y ganar puntos e insignias.',
      },
      {
        icon: '\u{1F504}',
        title: 'Vuelve a repasar',
        description: 'Las lecciones completadas mostrar\u00E1n indicadores de repaso. Vuelve a practicar para reforzar tu aprendizaje.',
      },
    ],
  },
  en: {
    skip: 'Skip',
    next: 'Next',
    done: 'Start Learning',
    stepOf: (/** @type {number} */ current, /** @type {number} */ total) => `${current} of ${total}`,
    steps: [
      {
        icon: '\u{1F4DA}',
        title: 'Choose a sound',
        description: 'Select a sound from the menu to get started. Each sound has a beginner and an advanced lesson.',
      },
      {
        icon: '\u{1F0CF}',
        title: 'Explore with flip cards',
        description: 'Tap the side cards to cycle through words. Tap the center card to hear the pronunciation.',
      },
      {
        icon: '\u2705',
        title: 'Test your knowledge',
        description: 'Complete the quiz for each lesson. Get 80% correct to pass and earn points and badges.',
      },
      {
        icon: '\u{1F504}',
        title: 'Come back to review',
        description: 'Completed lessons will show review indicators. Come back to practice and reinforce your learning.',
      },
    ],
  },
};

/**
 * Create a Tutorial overlay component
 * @param {Object} options - Configuration options
 * @param {string} [options.language='es'] - Language code
 * @param {Function} [options.onComplete] - Called when tutorial is completed or skipped
 * @returns {{ destroy: Function, getState: Function }}
 */
export function createTutorial(options = {}) {
  const { language = 'es', onComplete } = options;
  let currentStep = 0;

  const text = TEXT[/** @type {'es' | 'en'} */ (language)] || TEXT.es;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'tutorial-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Tutorial');

  /**
   * Render the current step content inside the card
   */
  function render() {
    const step = text.steps[currentStep];
    const isLastStep = currentStep === TOTAL_STEPS - 1;

    const dots = Array.from({ length: TOTAL_STEPS }, (_, i) => {
      let cls = 'tutorial-dot';
      if (i === currentStep) { cls += ' tutorial-dot--active'; }
      else if (i < currentStep) { cls += ' tutorial-dot--completed'; }
      return `<div class="${cls}"></div>`;
    }).join('');

    overlay.innerHTML = `
      <div class="tutorial-card">
        <div class="tutorial-header">
          <button class="tutorial-skip" type="button" data-tutorial-skip>${text.skip}</button>
        </div>
        <div class="tutorial-icon">${step.icon}</div>
        <h2 class="tutorial-title">${step.title}</h2>
        <p class="tutorial-description">${step.description}</p>
        <div class="tutorial-dots">${dots}</div>
        <div class="tutorial-nav">
          <span class="tutorial-step-counter">${text.stepOf(currentStep + 1, TOTAL_STEPS)}</span>
          <button class="tutorial-next" type="button" data-tutorial-next>${isLastStep ? text.done : text.next}</button>
        </div>
      </div>
    `;

    // Bind button events
    /** @type {HTMLElement} */ (overlay.querySelector('[data-tutorial-skip]')).addEventListener('click', complete);
    /** @type {HTMLElement} */ (overlay.querySelector('[data-tutorial-next]')).addEventListener('click', handleNext);

    // Focus the next button
    /** @type {HTMLElement} */ (overlay.querySelector('[data-tutorial-next]')).focus();
  }

  function handleNext() {
    if (currentStep < TOTAL_STEPS - 1) {
      currentStep++;
      render();
    } else {
      complete();
    }
  }

  function complete() {
    cleanup();
    if (onComplete) { onComplete(); }
  }

  function cleanup() {
    document.removeEventListener('keydown', handleKeydown);
    overlay.remove();
  }

  /** @param {KeyboardEvent} e */
  function handleKeydown(e) {
    if (e.key === 'Escape') { complete(); }
  }

  // Backdrop click to dismiss
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) { complete(); }
  });

  document.addEventListener('keydown', handleKeydown);

  // Initial render and mount
  render();
  document.body.appendChild(overlay);

  return {
    destroy() {
      cleanup();
    },
    getState() {
      return { currentStep };
    },
  };
}
