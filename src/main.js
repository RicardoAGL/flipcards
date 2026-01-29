/**
 * Dutch Pronunciation Flip Cards
 * Main application entry point
 */

import './styles/main.css';

/**
 * Initialize the application
 */
function init() {
  const app = document.getElementById('app');

  if (!app) {
    console.error('Application root element not found');
    return;
  }

  // Placeholder content - to be replaced with actual application
  app.innerHTML = `
    <main class="app-container">
      <header class="app-header">
        <h1>Dutch Pronunciation Flip Cards</h1>
        <p>Learn to pronounce Dutch vowel sounds</p>
      </header>

      <section class="coming-soon">
        <div class="card-placeholder">
          <div class="card">aa</div>
        </div>
        <p>Application coming soon...</p>
      </section>
    </main>
  `;

  console.log('Dutch Pronunciation Flip Cards initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
