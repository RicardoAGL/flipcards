# User Stories
## Dutch Pronunciation Learning App - Flip Cards

**Document Version:** 1.1
**Date:** 2026-01-30
**Status:** Approved for MVP Development

---

## Story Format
All user stories follow this structure:
- **As a** [user type]
- **I want** [feature/capability]
- **So that** [business value/benefit]

**Acceptance Criteria:** Specific, testable conditions that must be met
**Priority:** Must Have (MVP) / Should Have (Phase 2) / Could Have (Future)

---

## Epic 1: Lesson Selection & Navigation

### US-101: Browse Available Lessons
**As a** Dutch learner
**I want** to see a menu of available lessons organized by sound
**So that** I can choose which pronunciation to practice

**Acceptance Criteria:**
- Lesson menu displays all available sounds (aa, ee, oo, uu in MVP)
- Each sound shows two difficulty levels: Beginner and Advanced
- Locked lessons are visually distinct (grayed out or locked icon)
- Advanced lessons are locked until Beginner lesson completed
- Current completion status visible (e.g., "Completed" badge, progress percentage)
- Tapping a lesson navigates to practice mode

**Priority:** Must Have (MVP)

---

### US-102: View Lesson Progress
**As a** Dutch learner
**I want** to see my overall progress across all lessons
**So that** I can track my learning journey and stay motivated

**Acceptance Criteria:**
- Dashboard/menu shows completion status for each lesson
- Visual progress indicator (e.g., 6/8 lessons completed)
- Total points displayed prominently
- Badges earned displayed in dedicated section
- Progress persists across browser sessions (localStorage)

**Priority:** Must Have (MVP)

---

### US-103: Switch Language
**As a** Spanish-speaking learner
**I want** to toggle the interface language between Spanish and English
**So that** I can use the app in my preferred language

**Acceptance Criteria:**
- Language toggle button visible in app header/settings
- All UI text changes immediately when toggled (no page reload)
- Language preference persists across sessions (localStorage)
- Pronunciation descriptions change to match selected language
- Default language is Spanish (based on browser locale or user selection on first visit)

**Priority:** Must Have (MVP)

---

## Epic 2: Card Interaction & Practice

### US-201: Flip Prefix/Suffix Cards
**As a** Dutch learner
**I want** to flip the prefix and suffix cards to see different word combinations
**So that** I can practice the target sound in multiple contexts

**Acceptance Criteria:**
- Tapping/clicking left card cycles to next prefix combination
- Tapping/clicking right card cycles to next suffix combination
- Smooth flip animation (< 300ms)
- Word combinations are pre-loaded (no loading delay)
- Each combination displays clearly with visual separation between prefix-sound-suffix
- User can flip independently (prefix without suffix, or vice versa)

**Priority:** Must Have (MVP)

---

### US-202: View Pronunciation Guide
**As a** Dutch learner
**I want** to flip the center card to see pronunciation guidance
**So that** I understand how to pronounce the target sound

**Acceptance Criteria:**
- Tapping center card flips to reveal back side
- Back side displays:
  - IPA notation prominently
  - Spanish approximation description (if Spanish UI)
  - English approximation description (if English UI)
- "Pronounce" button visible on back side
- Tapping again flips back to front (showing vowel combination)
- Smooth flip animation matching prefix/suffix card behavior

**Priority:** Must Have (MVP)

---

### US-203: Hear Pronunciation
**As a** Dutch learner
**I want** to tap a button to hear the target sound pronounced
**So that** I can learn the correct pronunciation through audio

**Acceptance Criteria:**
- "Pronounce" button visible on center card (back side)
- Tapping button triggers Dutch TTS pronunciation
- Audio plays current sound in isolation (e.g., "ui" sound)
- Audio playback starts within 500ms of button tap
- Works on iOS Safari (primary target)
- If Dutch voice not available, display error message: "Dutch voice not installed. Please enable Dutch language in iOS Settings > Accessibility > Spoken Content."
- Button has loading/playing state indicator

**Priority:** Must Have (MVP)

---

### US-204: Mark Words as Difficult
**As a** Dutch learner
**I want** to mark specific words as difficult during practice
**So that** the app shows them more frequently for extra practice

**Acceptance Criteria:**
- "Difficult" button/icon visible during practice mode
- Tapping marks current word combination as difficult
- Visual indicator confirms word marked (e.g., icon changes color, toast notification)
- Difficult words appear more frequently in rotation (adaptive algorithm)
- User can also mark words as "Easy" to see them less often
- Marking persists in localStorage

**Priority:** Must Have (MVP)

---

### US-205: Practice with Spaced Repetition
**As a** Dutch learner
**I want** the app to show me each word multiple times during practice
**So that** I reinforce my learning through spaced repetition

**Acceptance Criteria:**
- Each word in lesson appears minimum 3 times during practice phase
- Word order is semi-randomized (not strictly sequential)
- Difficult words appear more than 3 times (adaptive frequency)
- Easy words may appear exactly 3 times
- Progress indicator shows how many words remain to be seen 3x
- Quiz becomes available only after all words seen minimum 3 times

**Priority:** Must Have (MVP)

---

## Epic 3: Quiz & Assessment

### US-301: Take Pronunciation Quiz
**As a** Dutch learner
**I want** to take a quiz after practicing
**So that** I can test my pronunciation knowledge and earn points

**Acceptance Criteria:**
- Quiz mode triggers after completing practice phase (all words seen 3x)
- Quiz presents 5 randomly selected words from current lesson
- Each question shows phonetic pronunciation (IPA + text description)
- 4 multiple choice options displayed (1 correct, 3 distractors)
- User taps to select answer
- Immediate feedback on correctness (visual indicator: green checkmark or red X)
- TTS plays correct pronunciation after selection (regardless of correctness)
- Quiz completion shows total score (e.g., "4/5 correct - 80%")

**Priority:** Must Have (MVP)

---

### US-302: Earn Points for Correct Answers
**As a** Dutch learner
**I want** to earn points for correct quiz answers
**So that** I feel rewarded for my progress and stay motivated

**Acceptance Criteria:**
- Each correct answer awards 20 points
- Quiz completion awards 10 bonus points (regardless of score)
- Perfect quiz (5/5) awards additional 50 bonus points (total 160 points)
- Points display animates when awarded (count-up effect)
- Total points update in header after quiz completion
- Points history tracked in localStorage

**Priority:** Must Have (MVP)

---

### US-303: Pass Quiz to Complete Lesson
**As a** Dutch learner
**I want** to pass the quiz with 80% accuracy
**So that** I can complete the lesson and unlock the next one

**Acceptance Criteria:**
- Passing score is 4/5 correct (80%)
- If user scores < 80%, lesson not marked complete
- User can retake quiz immediately (new random 5 questions)
- No point penalty for retaking quiz
- Upon passing:
  - Lesson marked "Completed"
  - Celebratory animation displays
  - Badge awarded (if applicable)
  - Next difficulty level unlocked (if applicable)
- Completion status persists in localStorage

**Priority:** Must Have (MVP)

---

### US-304: Retake Quiz for Practice
**As a** Dutch learner
**I want** to retake quizzes I've already passed
**So that** I can review and reinforce my pronunciation knowledge

**Acceptance Criteria:**
- Completed lessons show "Practice Again" option
- Retaking quiz generates new random 5 questions
- Points still awarded for correct answers
- Completion status remains (doesn't reset)
- Quiz history tracked (attempt count, scores)

**Priority:** Should Have (Phase 2)

---

## Epic 4: Gamification & Rewards

### US-401: Earn Badges
**As a** Dutch learner
**I want** to earn badges for achievements
**So that** I feel a sense of accomplishment and progression

**Acceptance Criteria:**
- Badges awarded for:
  - "First Steps" - Complete first lesson
  - "[Sound] Master" - Complete both Beginner and Advanced for a sound (e.g., "aa Master")
  - "Vowel Explorer" - Complete 3 different sounds
  - "Pronunciation Pro" - Complete all Phase 1 sounds (aa, ee, oo, uu)
  - "Perfect Score" - 100% on any quiz
  - "Flawless" - 100% on 5 consecutive quizzes
- Badge awarded immediately upon meeting criteria
- Celebration animation plays when badge earned
- Badges displayed in profile/achievements section
- Badge icons are visually distinct and appealing (Duolingo-style)

**Priority:** Must Have (MVP)

---

### US-402: View Achievements Gallery
**As a** Dutch learner
**I want** to see all available badges and which I've earned
**So that** I know what goals to work toward

**Acceptance Criteria:**
- Achievements page lists all possible badges
- Earned badges displayed in color with timestamp
- Unearned badges shown as grayed-out silhouettes
- Description of how to earn each badge
- Progress bars for multi-step achievements (e.g., "Vowel Explorer: 2/3 sounds completed")

**Priority:** Must Have (MVP)

---

### US-403: Unlock Visual Themes
**As a** Dutch learner
**I want** to unlock new color themes as I progress
**So that** I can customize the app appearance as a reward

**Acceptance Criteria:**
- Default theme available from start
- Additional themes unlock at milestones:
  - Theme 2: Complete 2 sounds
  - Theme 3: Complete 4 sounds
  - Theme 4: Complete all Phase 1 sounds
- Theme picker accessible from settings/profile
- Theme change applies immediately (no reload)
- Theme preference persists in localStorage
- Themes maintain high contrast and readability

**Priority:** Should Have (Phase 2)

---

## Epic 5: Progress Tracking & Persistence

### US-501: Save Progress Locally
**As a** Dutch learner
**I want** my progress saved automatically
**So that** I can close the app and resume later without losing progress

**Acceptance Criteria:**
- All progress data stored in browser localStorage:
  - Lessons completed
  - Quiz scores
  - Points accumulated
  - Badges earned
  - Words marked difficult/easy
  - Language preference
  - Theme preference
- Data saves immediately after each action (no manual save button)
- Progress persists across browser sessions
- Data survives browser close/reopen (not tab close)

**Priority:** Must Have (MVP)

---

### US-502: View Learning Statistics
**As a** Dutch learner
**I want** to see statistics about my learning progress
**So that** I can understand my strengths and areas for improvement

**Acceptance Criteria:**
- Statistics page displays:
  - Total lessons completed
  - Total points earned
  - Average quiz score
  - Badges earned count
  - Most practiced sound
  - Words marked as difficult (list)
- Statistics calculated from localStorage data
- Visualizations (charts/graphs) for key metrics

**Priority:** Should Have (Phase 2)

---

### US-503: Export/Import Progress
**As a** Dutch learner
**I want** to export my progress data
**So that** I can back it up or transfer it to another device

**Acceptance Criteria:**
- "Export Progress" button in settings
- Generates JSON file with all localStorage data
- "Import Progress" allows uploading JSON file
- Import merges or replaces existing data (user choice)
- Success/error messages for import/export operations

**Priority:** Should Have (Phase 2)

---

### US-504: Sync Progress Across Devices
**As a** Dutch learner
**I want** my progress synchronized across all my devices
**So that** I can practice on phone, tablet, or computer seamlessly

**Acceptance Criteria:**
- User creates account (email + password)
- Progress automatically syncs to cloud on each action
- Opening app on new device loads synced progress
- Conflict resolution if offline changes on multiple devices
- Requires backend service and authentication system

**Priority:** Could Have (Future)

---

## Epic 6: Accessibility & Usability

### US-601: Use App on Mobile
**As a** mobile user
**I want** the app optimized for my iPhone
**So that** I have a smooth, native-like experience

**Acceptance Criteria:**
- Responsive design adapts to iPhone screen sizes (SE to Pro Max)
- Touch targets minimum 44x44px (iOS standards)
- Swipe gestures supported for card flipping
- No horizontal scrolling required
- Fast load time (< 3s on 4G)
- Works in portrait and landscape orientation
- Tested on iOS Safari 15+

**Priority:** Must Have (MVP)

---

### US-602: Use App on Tablet
**As a** tablet user
**I want** the app to utilize the larger screen effectively
**So that** I have an enhanced learning experience

**Acceptance Criteria:**
- Cards displayed side-by-side (not stacked) on iPad
- Larger font sizes for better readability
- Touch and tap gestures optimized for tablet
- No wasted white space (efficient layout)
- Works in both orientations

**Priority:** Must Have (MVP)

---

### US-603: Use App on Desktop
**As a** desktop user
**I want** the app to work in my browser
**So that** I can practice at my computer

**Acceptance Criteria:**
- Click interactions work for all card flips
- Keyboard shortcuts for common actions (space = flip, arrow keys = navigate)
- Mouse hover states for interactive elements
- Responsive layout for various window sizes
- Tested on Chrome, Firefox, Safari (macOS)

**Priority:** Must Have (MVP)

---

### US-604: Accessibility Compliance
**As a** user with accessibility needs
**I want** the app to follow accessibility best practices
**So that** I can use it regardless of visual or motor limitations

**Acceptance Criteria:**
- WCAG 2.1 AA compliance
- Color contrast ratio minimum 4.5:1 for text
- All interactive elements keyboard accessible
- ARIA labels for screen readers
- Focus indicators visible for keyboard navigation
- Text scalable without breaking layout
- No flashing content (seizure risk)

**Priority:** Should Have (Phase 2)

---

## Epic 7: Content Management

### US-701: View Lesson Content
**As a** Dutch learner
**I want** to see the word list for a lesson before starting
**So that** I know what to expect and can gauge difficulty

**Acceptance Criteria:**
- Lesson detail page shows full word list
- Words displayed with prefix-sound-suffix breakdown
- Word count displayed (e.g., "10 words")
- Estimated time to complete (e.g., "~15 minutes")
- Option to start lesson or return to menu

**Priority:** Should Have (Phase 2)

---

### US-702: Search for Specific Words
**As a** Dutch learner
**I want** to search for a specific Dutch word
**So that** I can practice its pronunciation directly

**Acceptance Criteria:**
- Search bar in lesson menu or dedicated search page
- Type-ahead suggestions as user types
- Results show matching words with their lessons
- Tapping result navigates to that word in practice mode
- Search history tracked (optional)

**Priority:** Could Have (Future)

---

### US-703: Suggest New Content
**As a** Dutch learner
**I want** to suggest words or sounds to add to the app
**So that** the content matches my learning needs

**Acceptance Criteria:**
- "Suggest Content" form in settings/help
- User submits word/sound with rationale
- Confirmation message on submission
- Suggestions stored for content review
- Requires backend service

**Priority:** Could Have (Future)

---

## Epic 10: Phase 1.5 Enhancements

### US-1001: View Word Translations
**As a** Dutch learner
**I want** to see the translation of Dutch words during practice
**So that** I understand what the words mean while learning pronunciation

**Acceptance Criteria:**
- Translation displayed below the flip cards during practice
- Translation matches selected UI language (Spanish/English)
- Translation updates when word combination changes
- Clear visual hierarchy (Dutch word prominent, translation secondary)
- Tap/click on translation reveals example sentence

**Priority:** Should Have (Phase 1.5)

---

### US-1002: View Example Sentences
**As a** Dutch learner
**I want** to see example sentences using the practiced words
**So that** I understand how words are used in context

**Acceptance Criteria:**
- Example sentence appears when tapping the translation
- Sentence displayed in Dutch with translation below
- Sentence uses the current word in natural context
- Modal/tooltip dismissible by tapping outside
- Each word has at least one example sentence

**Priority:** Should Have (Phase 1.5)

---

### US-1003: Select TTS Voice
**As a** Dutch learner
**I want** to choose from different Dutch voices
**So that** I can hear varied pronunciations and find a voice I prefer

**Acceptance Criteria:**
- Voice selector in settings menu
- Lists all available Dutch voices on device
- Preview button to hear each voice before selecting
- Selected voice persists across sessions
- Graceful handling if voice becomes unavailable
- Shows "No Dutch voices" message if none installed

**Priority:** Should Have (Phase 1.5)

---

### US-1004: View Badge Gallery
**As a** Dutch learner
**I want** to see all available badges and my progress toward each
**So that** I know what achievements I can work toward

**Acceptance Criteria:**
- Dedicated badge gallery accessible from menu
- All badges displayed (earned in color, unearned grayed out)
- Each badge shows name, icon, description, and how to earn
- Progress indicators for multi-step badges (e.g., "2/4 sounds mastered")
- Earned badges show unlock date
- Celebratory animation when viewing newly earned badge

**Priority:** Should Have (Phase 1.5)

---

### US-1005: Earn Point Milestone Stars
**As a** Dutch learner
**I want** to unlock stars when reaching point milestones
**So that** I feel rewarded for accumulated effort

**Acceptance Criteria:**
- Point milestones: Bronze (500), Silver (1500), Gold (3000), Diamond (5000)
- Star indicator displayed in header/profile
- Celebration animation when milestone reached
- Stars persist in localStorage
- Progress bar shows distance to next milestone
- All earned stars visible in profile

**Priority:** Should Have (Phase 1.5)

---

### US-1006: Earn Encouragement Badges
**As a** Dutch learner
**I want** to earn badges for persistence even when struggling
**So that** I stay motivated despite making mistakes

**Acceptance Criteria:**
- "¡No me rendiré!" badge: Awarded when scoring 0/5 on quiz, then retrying
- "La práctica hace al maestro" badge: Complete 10 quizzes (any score)
- "Perseverance" badge: Fail a quiz, then retry and pass
- Badge names localized (Spanish/English)
- Encouraging message when these badges are earned
- Badges appear in gallery with others

**Priority:** Should Have (Phase 1.5)

---

### US-1007: Improved Quiz Feedback Layout
**As a** Dutch learner
**I want** quiz feedback to appear without shifting buttons
**So that** the interface feels stable and predictable

**Acceptance Criteria:**
- Feedback message appears below the "Next" button (not above)
- Button position remains fixed during feedback display
- Smooth fade-in animation for feedback
- Feedback does not cause layout shift
- Works correctly on all screen sizes

**Priority:** Should Have (Phase 1.5)

---

## Epic 11: Internationalization

### US-1101: Externalized UI Strings
**As a** developer
**I want** all UI text stored in language files
**So that** the app can be easily translated to new languages

**Acceptance Criteria:**
- All user-facing strings in JSON language files
- File structure: `src/i18n/{lang}.json`
- No hardcoded text in component code
- Language files for Spanish (es) and English (en)
- Missing translation falls back to English
- Build-time validation of translation completeness

**Priority:** Should Have (Phase 1.5)

---

### US-1102: Add New Languages
**As a** product owner
**I want** the ability to add new UI languages easily
**So that** the app can reach broader audiences

**Acceptance Criteria:**
- Adding language requires only new JSON file
- Language selector shows all available languages
- Flag/icon for each language option
- RTL language support consideration (future)
- Translation guide documentation for contributors

**Priority:** Could Have (Future)

---

## Epic 8: Error Handling & Edge Cases

### US-801: Handle Missing Dutch Voice
**As a** user without Dutch TTS installed
**I want** to see a clear message about installing Dutch voices
**So that** I can enable TTS functionality

**Acceptance Criteria:**
- On first TTS attempt, check if Dutch voice available
- If not available, display modal/alert:
  - Title: "Dutch Voice Not Available"
  - Message: "To hear pronunciations, enable Dutch language in iOS Settings > Accessibility > Spoken Content > Voices."
  - Button: "I'll Enable Later" (dismiss)
- Error message stored in localStorage (don't show repeatedly)
- TTS button disabled if voice unavailable (grayed out)

**Priority:** Must Have (MVP)

---

### US-802: Handle Progress Data Loss
**As a** user whose localStorage was cleared
**I want** to understand why my progress disappeared
**So that** I'm not confused and can prevent it in future

**Acceptance Criteria:**
- On app load, detect if expected progress data missing
- If missing after first visit, show message:
  - "It looks like your progress was cleared. This can happen if you cleared browser data. Consider exporting your progress regularly." (if export feature available)
- User can dismiss and start fresh
- Message only shows once per data loss event

**Priority:** Should Have (Phase 2)

---

### US-803: Handle Network Errors
**As a** user with poor internet connection
**I want** the app to work offline
**So that** I can practice without interruption

**Acceptance Criteria:**
- All lesson content pre-loaded (no runtime fetching)
- TTS works offline (native API)
- Progress saves to localStorage (no network required)
- No broken images or missing resources
- Error message if external resources fail to load (future: online-only features)

**Priority:** Must Have (MVP)

---

## Epic 9: Onboarding & Help

### US-901: First-Time User Onboarding
**As a** new user
**I want** a brief tutorial on how to use the app
**So that** I understand the flip card mechanic and quiz system

**Acceptance Criteria:**
- On first app visit, show onboarding flow:
  - Screen 1: Welcome + app purpose
  - Screen 2: Flip card demo (interactive)
  - Screen 3: Quiz explanation
  - Screen 4: Gamification overview (points/badges)
- User can skip onboarding ("Skip" button)
- Onboarding completion tracked in localStorage (don't show again)
- "Show Tutorial Again" option in settings

**Priority:** Should Have (Phase 2)

---

### US-902: Access Help Documentation
**As a** user
**I want** to access help documentation
**So that** I can learn how to use features or troubleshoot issues

**Acceptance Criteria:**
- Help/FAQ page accessible from menu
- Topics covered:
  - How to use flip cards
  - How quiz scoring works
  - How to enable Dutch TTS
  - How to change language
  - How progress is saved
- Content in both Spanish and English
- Clear, concise explanations with screenshots

**Priority:** Should Have (Phase 2)

---

### US-903: Provide Feedback
**As a** user
**I want** to submit feedback about the app
**So that** I can report bugs or suggest improvements

**Acceptance Criteria:**
- "Send Feedback" form in settings/help
- Fields: Name (optional), Email (optional), Message (required), Category (Bug/Suggestion/Question)
- Confirmation on submission
- Requires backend service or email integration

**Priority:** Could Have (Future)

---

## Summary of Priorities

### Must Have (MVP) - 24 Stories
Epic 1: US-101, US-102, US-103
Epic 2: US-201, US-202, US-203, US-204, US-205
Epic 3: US-301, US-302, US-303
Epic 4: US-401, US-402
Epic 5: US-501
Epic 6: US-601, US-602, US-603
Epic 8: US-801, US-803

### Should Have (Phase 1.5) - 8 Stories
Epic 10: US-1001, US-1002, US-1003, US-1004, US-1005, US-1006, US-1007
Epic 11: US-1101

### Should Have (Phase 2) - 9 Stories
Epic 3: US-304
Epic 4: US-403
Epic 5: US-502, US-503
Epic 6: US-604
Epic 7: US-701
Epic 8: US-802
Epic 9: US-901, US-902

### Could Have (Future) - 5 Stories
Epic 5: US-504
Epic 7: US-702, US-703
Epic 9: US-903
Epic 11: US-1102

---

## Story Dependencies

**Critical Path (MVP):**
1. US-101 (Lesson Selection) → US-201, US-202, US-203 (Card Interaction)
2. US-205 (Spaced Repetition) → US-301 (Quiz)
3. US-301 (Quiz) → US-302, US-303 (Scoring/Completion)
4. US-303 (Completion) → US-401 (Badges)
5. All features → US-501 (Progress Persistence)

**Mobile-First:**
- US-601 (Mobile) must be implemented before or alongside all interactive features

**Language Support:**
- US-103 (Language Toggle) must be implemented early, affects all UI text

---

## Acceptance Testing Notes

All user stories must pass:
- **Functional Testing:** All acceptance criteria verified
- **Cross-Browser Testing:** Works on iOS Safari (primary), Chrome, Firefox
- **Responsive Testing:** Works on iPhone, iPad, desktop
- **Performance Testing:** Meets performance requirements (load time, animation frame rate)
- **Accessibility Testing:** Keyboard navigation, screen reader compatibility (Phase 2)

---

## Document Control

**Version History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-29 | Business Requirements Analyst | Initial user story specifications approved for MVP development |
| 1.1 | 2026-01-30 | Business Requirements Analyst | Added Epic 10 (Phase 1.5 Enhancements) and Epic 11 (Internationalization) with 9 new user stories |

**Related Documents:**
- `/docs/requirements/business-requirements.md` - Complete functional requirements
- `/docs/requirements/lesson-taxonomy.md` - Lesson structure and content organization
