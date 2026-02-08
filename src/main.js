/**
 * Dutch Pronunciation Flip Cards
 * Main application entry point
 */

import './styles/main.css';
import { createFlipCard } from './components/FlipCard.js';
import { createQuiz } from './components/Quiz.js';
import { createLessonMenu } from './components/LessonMenu.js';
import { getLessonForFlipCard } from './lib/lessonLoader.js';
import { lessonsById } from './data/lessons/index.js';
import {
  markLessonComplete,
  addPoints,
  getTotalPoints,
  checkNewMilestone,
  recordQuizAttempt,
  checkAndAwardBadges,
  getLanguage,
  setLanguage,
} from './lib/progressStorage.js';
import { showMilestoneCelebration, showBadgeCelebrations } from './components/StarIndicator.js';
import { createBadgeGallery } from './components/BadgeGallery.js';
import { createSplashScreen } from './components/SplashScreen.js';

// Application state
let currentView = 'splash'; // 'splash' | 'menu' | 'flipcard' | 'quiz' | 'badges'
let currentLanguage = getLanguage();
let selectedLessonId = null;
let currentLesson = null;
let flipCardData = null;
let flipCard = null;
let quiz = null;
let lessonMenu = null;
let badgeGallery = null;
let splashScreen = null;

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
  mountSplashScreen();
}

/**
 * Render the main application layout
 */
function renderLayout(app) {
  app.innerHTML = `
    <main class="app-container">
      <header class="app-header">
        <div class="app-header-row">
          <button
            class="app-back-btn"
            type="button"
            id="back-btn"
            aria-label="Back to lessons"
            style="visibility: hidden;"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1>Dutch Pronunciation</h1>
          <div class="app-header-right">
            <div class="app-header-points" id="header-points">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span id="points-value">${getTotalPoints()}</span>
            </div>
            <button class="app-lang-btn" type="button" id="lang-toggle-btn"
                    aria-label="Switch language">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" width="18" height="18">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <span id="lang-label">${currentLanguage.toUpperCase()}</span>
            </button>
          </div>
        </div>
        <p class="app-subtitle" id="view-subtitle"></p>
      </header>

      <section class="app-main" id="main-container" aria-label="Main content">
        <!-- Components will be mounted here -->
      </section>

      <footer class="app-footer" id="app-footer" style="display: none;">
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

  // Bind button events
  const toggleBtn = document.getElementById('toggle-view-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', handleToggleView);
  }

  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', handleBackToMenu);
  }

  const langBtn = document.getElementById('lang-toggle-btn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const newLang = currentLanguage === 'es' ? 'en' : 'es';
      handleLanguageChange(newLang);
    });
  }

  addLayoutStyles();
}

/**
 * Mount the Splash Screen component
 */
function mountSplashScreen() {
  const container = document.getElementById('main-container');
  if (!container) {
    return;
  }

  destroyCurrentComponent();

  // Hide footer, back button, points, subtitle, header title, and lang toggle
  const footer = document.getElementById('app-footer');
  const backBtn = document.getElementById('back-btn');
  const subtitle = document.getElementById('view-subtitle');
  const headerPoints = document.getElementById('header-points');
  const headerTitle = document.querySelector('.app-header-row h1');
  const langToggle = document.getElementById('lang-toggle-btn');

  if (footer) { footer.style.display = 'none'; }
  if (backBtn) { backBtn.style.visibility = 'hidden'; }
  if (subtitle) { subtitle.textContent = ''; }
  if (headerPoints) { headerPoints.style.display = 'none'; }
  if (headerTitle) { headerTitle.style.display = 'none'; }
  if (langToggle) { langToggle.style.display = 'none'; }

  splashScreen = createSplashScreen(container, {
    language: currentLanguage,
    onStart: mountLessonMenu,
    onLanguageChange: (lang) => {
      handleLanguageChange(lang);
      // Re-mount splash with new language
      mountSplashScreen();
    },
  });

  currentView = 'splash';
}

/**
 * Mount the Lesson Menu component
 */
function mountLessonMenu() {
  const container = document.getElementById('main-container');
  if (!container) {
    return;
  }

  // Destroy existing components
  destroyCurrentComponent();

  // Hide footer and show header in menu mode
  const footer = document.getElementById('app-footer');
  const backBtn = document.getElementById('back-btn');
  const subtitle = document.getElementById('view-subtitle');
  const headerPoints = document.getElementById('header-points');
  const headerTitle = document.querySelector('.app-header-row h1');
  const langToggle = document.getElementById('lang-toggle-btn');

  if (footer) { footer.style.display = 'none'; }
  if (backBtn) { backBtn.style.visibility = 'hidden'; }
  if (subtitle) { subtitle.textContent = ''; }
  if (headerPoints) { headerPoints.style.display = 'none'; }
  if (headerTitle) { headerTitle.style.display = ''; }
  if (langToggle) { langToggle.style.display = ''; }

  // Create and mount lesson menu
  lessonMenu = createLessonMenu(container, {
    language: currentLanguage,
    onSelectLesson: handleSelectLesson,
    onViewBadges: mountBadgeGallery,
  });

  currentView = 'menu';
  selectedLessonId = null;
  currentLesson = null;
  flipCardData = null;

  // Update points display
  updatePointsDisplay();
}

/**
 * Handle lesson selection from menu
 */
function handleSelectLesson(lessonId) {
  selectedLessonId = lessonId;
  currentLesson = lessonsById[lessonId];
  flipCardData = getLessonForFlipCard(lessonId);

  mountFlipCard();
}

/**
 * Mount the FlipCard component
 */
function mountFlipCard() {
  const container = document.getElementById('main-container');
  if (!container) {
    return;
  }

  // Destroy existing components
  destroyCurrentComponent();

  // Show footer and back button in practice mode
  const footer = document.getElementById('app-footer');
  const backBtn = document.getElementById('back-btn');
  const headerPoints = document.getElementById('header-points');
  const headerTitle = document.querySelector('.app-header-row h1');
  const langToggle = document.getElementById('lang-toggle-btn');

  if (footer) { footer.style.display = 'block'; }
  if (backBtn) { backBtn.style.visibility = 'visible'; }
  if (headerPoints) { headerPoints.style.display = 'flex'; }
  if (headerTitle) { headerTitle.style.display = ''; }
  if (langToggle) { langToggle.style.display = ''; }

  // Create and mount flip card with current lesson data
  flipCard = createFlipCard(flipCardData, container, { language: currentLanguage });
  currentView = 'flipcard';

  // Update UI
  updateViewUI();
  updatePointsDisplay();

}

/**
 * Mount the Quiz component
 */
async function mountQuiz() {
  const container = document.getElementById('main-container');
  if (!container) {
    return;
  }

  // Destroy existing components
  destroyCurrentComponent();

  // Create and mount quiz with same lesson as FlipCard
  quiz = createQuiz(currentLesson, {
    questionCount: 5,
    language: currentLanguage,
    onComplete: handleQuizComplete,
    onClose: handleQuizClose,
  });

  await quiz.mount(container);
  currentView = 'quiz';

  // Update UI
  updateViewUI();

}

/**
 * Destroy the current component
 */
function destroyCurrentComponent() {
  if (flipCard) {
    flipCard.destroy();
    flipCard = null;
  }
  if (quiz) {
    quiz.destroy();
    quiz = null;
  }
  if (lessonMenu) {
    lessonMenu.destroy();
    lessonMenu = null;
  }
  if (badgeGallery) {
    badgeGallery.destroy();
    badgeGallery = null;
  }
  if (splashScreen) {
    splashScreen.destroy();
    splashScreen = null;
  }
}

/**
 * Mount the Badge Gallery component
 */
function mountBadgeGallery() {
  const container = document.getElementById('main-container');
  if (!container) {
    return;
  }

  destroyCurrentComponent();

  // Hide footer and back button in gallery mode
  const footer = document.getElementById('app-footer');
  const backBtn = document.getElementById('back-btn');
  const subtitle = document.getElementById('view-subtitle');
  const headerPoints = document.getElementById('header-points');
  const headerTitle = document.querySelector('.app-header-row h1');
  const langToggle = document.getElementById('lang-toggle-btn');

  if (footer) { footer.style.display = 'none'; }
  if (backBtn) { backBtn.style.visibility = 'hidden'; }
  if (subtitle) { subtitle.textContent = ''; }
  if (headerPoints) { headerPoints.style.display = 'none'; }
  if (headerTitle) { headerTitle.style.display = ''; }
  if (langToggle) { langToggle.style.display = ''; }

  badgeGallery = createBadgeGallery(container, {
    language: currentLanguage,
    onBack: mountLessonMenu,
  });

  currentView = 'badges';
}

/**
 * Handle view toggle button click
 */
function handleToggleView() {
  if (currentView === 'flipcard') {
    mountQuiz();
  } else if (currentView === 'quiz') {
    mountFlipCard();
  }
}

/**
 * Handle back button click - return to menu
 */
function handleBackToMenu() {
  mountLessonMenu();
}

/**
 * Handle language change
 * @param {string} lang - New language code ('es' or 'en')
 */
function handleLanguageChange(lang) {
  setLanguage(lang);
  currentLanguage = lang;

  // Update language label in header
  const langLabel = document.getElementById('lang-label');
  if (langLabel) {
    langLabel.textContent = lang.toUpperCase();
  }

  // Re-render the current view
  const viewMounters = {
    menu: mountLessonMenu,
    flipcard: mountFlipCard,
    badges: mountBadgeGallery,
  };

  const mounter = viewMounters[currentView];
  if (mounter) {
    mounter();
  }
}

/**
 * Handle quiz completion
 */
function handleQuizComplete(result) {
  // Record quiz attempt for badge tracking
  recordQuizAttempt(
    selectedLessonId,
    result.score,
    result.answers.length,
    result.passed,
  );

  // Check for new badges BEFORE marking lesson complete
  const newBadges = checkAndAwardBadges({
    lessonId: selectedLessonId,
    score: result.score,
    total: result.answers.length,
    passed: result.passed,
  });

  // Check for new milestone BEFORE adding points
  let newMilestone = null;
  if (result.passed && result.pointsEarned > 0) {
    newMilestone = checkNewMilestone(result.pointsEarned);
  }

  // If passed, mark lesson complete and add points
  if (result.passed) {
    markLessonComplete(selectedLessonId);
    if (result.pointsEarned > 0) {
      addPoints(result.pointsEarned);
    }
  }

  // Chain celebrations: badges → milestone → menu
  const returnToMenu = () => {
    mountLessonMenu();
  };

  const showMilestoneOrReturn = () => {
    if (newMilestone) {
      showMilestoneCelebration(newMilestone, {
        language: currentLanguage,
        onDismiss: returnToMenu,
      });
    } else {
      returnToMenu();
    }
  };

  // Show badge celebrations first, then milestone, then return
  setTimeout(() => {
    if (newBadges.length > 0) {
      showBadgeCelebrations(newBadges, {
        language: currentLanguage,
        onComplete: showMilestoneOrReturn,
      });
    } else {
      showMilestoneOrReturn();
    }
  }, 600);
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

  if (currentView === 'flipcard' && currentLesson) {
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
  } else if (currentView === 'quiz') {
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
 * Update points display in header
 */
function updatePointsDisplay() {
  const pointsValue = document.getElementById('points-value');
  if (pointsValue) {
    pointsValue.textContent = getTotalPoints();
  }
}

/**
 * Add styles for the layout
 */
function addLayoutStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .app-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-3);
    }

    .app-header-row h1 {
      flex: 1;
      text-align: center;
    }

    .app-back-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--rounded-full);
      color: var(--text-secondary);
      transition: color var(--duration-fast) var(--ease-out),
                  background-color var(--duration-fast) var(--ease-out);
    }

    .app-back-btn:hover {
      color: var(--text-primary);
      background-color: var(--color-gray-100);
    }

    .app-back-btn svg {
      width: 24px;
      height: 24px;
    }

    .app-header-right {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .app-header-points {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      padding: var(--space-2) var(--space-3);
      background: var(--color-primary-50);
      border-radius: var(--rounded-full);
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--color-primary-700);
    }

    .app-header-points svg {
      width: 16px;
      height: 16px;
      color: var(--color-primary-500);
    }

    .app-lang-btn {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--rounded-full);
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--text-secondary);
      transition: color var(--duration-fast) var(--ease-out),
                  background-color var(--duration-fast) var(--ease-out);
    }

    .app-lang-btn:hover {
      color: var(--text-primary);
      background-color: var(--color-gray-100);
    }

    .app-lang-btn svg {
      display: block;
    }

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
