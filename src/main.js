/**
 * Dutch Pronunciation Flip Cards
 * Main application entry point
 */

import './styles/main.css';
import { createFlipCard } from './components/FlipCard.js';

/**
 * Sample lesson data for the "ui" sound
 * This demonstrates the data structure expected by the FlipCard component
 */
const uiLessonData = {
  sound: 'ui',
  ipa: '[oey]',
  description: 'Redondea los labios y di "ei"',
  words: [
    { prefix: 'h', suffix: 's' },      // huis
    { prefix: 'b', suffix: 'ten' },    // buiten
    { prefix: 't', suffix: 'n' },      // tuin
    { prefix: '', suffix: '' },          // ui (standalone)
  ],
};

/**
 * Initialize the application
 */
function init() {
  const app = document.getElementById('app');

  if (!app) {
    console.error('Application root element not found');
    return;
  }

  // Create the main application layout
  app.innerHTML = `
    <main class="app-container">
      <header class="app-header">
        <h1>Dutch Pronunciation</h1>
        <p>Practice the "${uiLessonData.sound}" sound</p>
      </header>

      <section class="app-main" id="flip-card-container" aria-label="Flip card practice area">
        <!-- FlipCard component will be mounted here -->
      </section>

      <footer class="app-footer">
        <p class="instructions">
          <strong>How to use:</strong> Tap the side cards to cycle through words.
          Tap the center card to see the pronunciation guide.
        </p>
      </footer>
    </main>
  `;

  // Mount the FlipCard component
  const container = document.getElementById('flip-card-container');
  if (container) {
    const flipCard = createFlipCard(uiLessonData, container);

    // Store reference for debugging/development
    window.__flipCard = flipCard;

  }

  // Add footer styles
  addFooterStyles();
}

/**
 * Add styles for the footer (instructions)
 */
function addFooterStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .app-footer {
      padding: var(--space-4);
      text-align: center;
    }

    .app-footer .instructions {
      font-size: var(--font-size-sm);
      color: var(--text-tertiary);
      max-width: 300px;
      margin: 0 auto;
      line-height: var(--line-height-relaxed);
    }

    .app-footer .instructions strong {
      color: var(--text-secondary);
    }
  `;
  document.head.appendChild(style);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
