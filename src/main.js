/**
 * Dutch Pronunciation Flip Cards
 * Main application entry point
 */

import './styles/main.css';
import { createFlipCard } from './components/FlipCard.js';
import { createQuiz } from './components/Quiz.js';
import { getLessonForFlipCard } from './lib/lessonLoader.js';
import { lessonsById } from './data/lessons/index.js';

// Current demo lesson - using AA Beginner for both FlipCard and Quiz
const DEMO_LESSON_ID = 'P1-AA-BEG';

// Get lesson data in different formats
const currentLesson = lessonsById[DEMO_LESSON_ID];
const flipCardData = getLessonForFlipCard(DEMO_LESSON_ID);

// Application state
let currentView = 'flipcard'; // 'flipcard' or 'quiz'
let flipCard = null;
let quiz = null;

/**
 * Initialize the application
 */
function init() {
  const app = document.getElementById('app');

  if (!app) {
    console.error('Application root element not found');
    return;
  }

  renderLayout(app);
  mountFlipCard();
}

/**
 * Render the main application layout
 */
function renderLayout(app) {
  app.innerHTML = `
    <main class="app-container">
      <header class="app-header">
        <h1>Dutch Pronunciation</h1>
        <p class="app-subtitle" id="view-subtitle">Practice the "${currentLesson.sound.combination}" sound</p>
      </header>

      <section class="app-main" id="main-container" aria-label="Practice area">
        <!-- Components will be mounted here -->
      </section>

      <footer class="app-footer">
        <div class="app-actions" id="app-actions">
          <button
            class="app-btn app-btn--primary"
            type="button"
            id="toggle-view-btn"
            aria-label="Start Quiz"
          >
            Start Quiz
          </button>
        </div>
        <p class="instructions" id="instructions">
          <strong>How to use:</strong> Tap the side cards to cycle through words.
          Tap the center card to see the pronunciation guide.
        </p>
      </footer>
    </main>
  `;

  // Bind toggle button event
  const toggleBtn = document.getElementById('toggle-view-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', handleToggleView);
  }

  addLayoutStyles();
}

/**
 * Mount the FlipCard component
 */
function mountFlipCard() {
  const container = document.getElementById('main-container');
  if (!container) {
    return;
  }

  // Destroy existing quiz if any
  if (quiz) {
    quiz.destroy();
    quiz = null;
  }

  // Create and mount flip card with current lesson data
  flipCard = createFlipCard(flipCardData, container);
  currentView = 'flipcard';

  // Update UI
  updateViewUI();

  // Store reference for debugging/development
  window.__flipCard = flipCard;
}

/**
 * Mount the Quiz component
 */
async function mountQuiz() {
  const container = document.getElementById('main-container');
  if (!container) {
    return;
  }

  // Destroy existing flip card if any
  if (flipCard) {
    flipCard.destroy();
    flipCard = null;
  }

  // Create and mount quiz with same lesson as FlipCard
  quiz = createQuiz(currentLesson, {
    questionCount: 5,
    language: 'es',
    onComplete: handleQuizComplete,
    onClose: handleQuizClose,
  });

  await quiz.mount(container);
  currentView = 'quiz';

  // Update UI
  updateViewUI();

  // Store reference for debugging/development
  window.__quiz = quiz;
}

/**
 * Handle view toggle button click
 */
function handleToggleView() {
  if (currentView === 'flipcard') {
    mountQuiz();
  } else {
    mountFlipCard();
  }
}

/**
 * Handle quiz completion
 */
function handleQuizComplete(result) {
  // Quiz completed - result contains score, passed, pointsEarned, answers
  void result; // Mark as intentionally unused for now

  // Show completion message and return to flip card
  setTimeout(() => {
    mountFlipCard();
  }, 500);
}

/**
 * Handle quiz close
 */
function handleQuizClose() {
  mountFlipCard();
}

/**
 * Update UI based on current view
 */
function updateViewUI() {
  const subtitle = document.getElementById('view-subtitle');
  const toggleBtn = document.getElementById('toggle-view-btn');
  const instructions = document.getElementById('instructions');

  if (currentView === 'flipcard') {
    if (subtitle) {
      subtitle.textContent = `Practice the "${currentLesson.sound.combination}" sound`;
    }
    if (toggleBtn) {
      toggleBtn.textContent = 'Start Quiz';
      toggleBtn.setAttribute('aria-label', 'Start Quiz');
    }
    if (instructions) {
      instructions.innerHTML = `
        <strong>How to use:</strong> Tap the side cards to cycle through words.
        Tap the center card to see the pronunciation guide.
      `;
    }
  } else {
    if (subtitle) {
      subtitle.textContent = 'Test your knowledge';
    }
    if (toggleBtn) {
      toggleBtn.textContent = 'Back to Practice';
      toggleBtn.setAttribute('aria-label', 'Back to Practice');
    }
    if (instructions) {
      instructions.innerHTML = `
        <strong>Quiz:</strong> Select the word that contains the sound shown.
        Get 80% correct to pass!
      `;
    }
  }
}

/**
 * Add styles for the layout
 */
function addLayoutStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .app-subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-tertiary);
      margin-top: var(--space-1);
    }

    .app-footer {
      padding: var(--space-4);
      text-align: center;
    }

    .app-actions {
      margin-bottom: var(--space-4);
    }

    .app-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      padding: var(--space-3) var(--space-5);
      border-radius: var(--rounded-xl);
      font-family: var(--font-primary);
      font-size: var(--font-size-base);
      font-weight: 600;
      cursor: pointer;
      transition: all var(--duration-fast) var(--ease-out);
    }

    .app-btn:focus-visible {
      outline: 3px solid var(--color-primary-300);
      outline-offset: 2px;
    }

    .app-btn--primary {
      background: var(--color-primary-500);
      color: var(--color-white);
      border: none;
      box-shadow: var(--shadow-sm);
    }

    .app-btn--primary:hover {
      background: var(--color-primary-400);
      box-shadow: var(--shadow-md);
    }

    .app-btn--primary:active {
      background: var(--color-primary-600);
      transform: scale(0.98);
    }

    .app-footer .instructions {
      font-size: var(--font-size-sm);
      color: var(--text-tertiary);
      max-width: 320px;
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
