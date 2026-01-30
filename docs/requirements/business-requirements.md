# Business Requirements Document
## Dutch Pronunciation Learning App - Flip Cards

**Document Version:** 1.2
**Date:** 2026-01-30
**Status:** Approved for MVP Development

---

## 1. Executive Summary

### 1.1 Project Overview
A mobile-first web application designed to help Spanish speakers learn Dutch pronunciation through an interactive flip card interface with gamification mechanics. The app focuses on teaching Dutch vowel sounds and combinations that are challenging for Spanish native speakers.

### 1.2 Business Objective
Enable effective pronunciation practice for Dutch learners by providing an engaging, visually appealing, gamified learning experience that emphasizes reading-to-speaking skill transfer.

### 1.3 Target User
- **Primary User:** Spanish-speaking adult learning Dutch
- **Learning Context:** Self-directed study, supplementing formal Dutch language education
- **Core Challenge:** Practicing Dutch sounds that don't exist in Spanish, particularly vowel combinations
- **Learning Philosophy:** Dutch is nearly phonetic; learning to read properly enables correct speaking

---

## 2. Product Vision & Scope

### 2.1 Core Concept
Three-section flip card interface where users practice Dutch pronunciation:
- **Left Card (Prefix):** Initial consonant(s) or syllable(s)
- **Center Card (MAIN SOUND):** Target vowel sound being practiced
- **Right Card (Suffix):** Ending consonant(s) or syllable(s)

**Example:** h-**ui**-s, b-**ui**-ten, standalone **ui**

### 2.2 Tiered Level System

The app organizes content into progressive levels, each with its own set of lessons and star progression.

**Level Structure:**
| Level | Theme | Sounds/Topics | Lessons |
|-------|-------|---------------|---------|
| 1 | Misma Vocal (Same Vowel) | aa, ee, oo, uu | 8 (4 sounds × 2 difficulties) |
| 2 | Vocales Diferentes (Different Vowels) | ui, oe, eu, au/ou | 8-10 |
| 3 | Consonantes (Consonants) | g, ch, sch, r | TBD |
| 4 | Gramática (Grammar) | de/het, plurals | TBD |

**Star Progression (per level):**
- Each level has its own Bronze → Silver → Gold star progression
- Stars are earned based on points accumulated within that level
- Completing a level unlocks the next level

### 2.3 MVP Scope (Level 1)
**Theme:** Misma Vocal (Same Vowel Combinations)
**Sounds Covered:** aa, ee, oo, uu
**Lesson count:** 8 lessons (4 sounds × 2 difficulty levels each)
**Word count per lesson:**
  - Beginner: 8-10 common words
  - Advanced: 15-20 more complex words

**Core Features:**
- Flip card interface with adaptive spaced repetition
- Bilingual UI (Spanish/English toggle)
- Quiz mode with pronunciation playback
- Points, badges, and visual rewards system
- 3-star progression (Bronze, Silver, Gold) per level
- Text-to-speech using Web Speech Synthesis API
- Progress tracking via browser localStorage

### 2.4 Phase 2 Scope (Level 2)
**Theme:** Vocales Diferentes (Different Vowel Combinations)
**Sounds to Add:** ui, oe, eu, au/ou
**Lesson count:** 8-10 lessons (4-5 sounds × 2 difficulty levels)

### 2.4 Phase 1.5 Enhancements (Post-MVP Polish)
- **Word Translations:** Display Spanish/English translations below flip cards
- **Example Sentences:** Show Dutch sentences using practiced words (on tap)
- **TTS Voice Selection:** Allow users to choose from available Dutch voices
- **Badge Gallery:** Dedicated view for earned and available badges
- **Point Milestones:** Unlock stars/rewards at point thresholds
- **Encouragement Badges:** Motivational badges for persistence (e.g., "I won't give up!")
- **Quiz UI Polish:** Improved feedback positioning for better UX

### 2.5 Future Enhancements
- Consonant sounds (Dutch "g", Scheveningen exceptions)
- Cloud-based progress sync
- Advanced analytics and learning insights
- User-generated content lessons
- Social features (sharing, collaborative learning)
- Full internationalization (i18n) support for additional languages

### 2.6 Explicit Out of Scope (MVP)
- Audio recording/speech recognition input
- Native mobile apps (iOS/Android)
- Offline PWA functionality
- User accounts and authentication
- Multi-user progress tracking
- Custom lesson creation by users

---

## 3. Functional Requirements

### 3.1 Lesson Structure

#### 3.1.1 Lesson Organization
- **Hierarchy:** Sound → Difficulty Level → Word List
- **Difficulty Levels:** Beginner, Advanced
- **Progression Model:** Sequential unlocking (must complete Beginner to access Advanced for same sound)

#### 3.1.2 Word Selection Criteria
- **Source:** Frequency-based word lists (most common Dutch words containing target sound)
- **Difficulty Factors:**
  1. Syllable count (primary)
  2. Word frequency/commonness (primary)
  3. Consonant complexity around target vowel (secondary)
  4. Progressive word complexity within lesson

#### 3.1.3 Content Composition
Each lesson includes:
- Target sound presented in isolation (e.g., standalone "ui")
- 8-10 words (Beginner) or 15-20 words (Advanced)
- Prefix-suffix combinations demonstrating sound in context
- IPA notation for target sound
- Spanish approximation description

### 3.2 User Interaction Flow

#### 3.2.1 Card Interaction Mechanics
**Prefix/Suffix Cards (Left/Right):**
- Action: Tap/click to flip
- Behavior: Cycles through different word combinations containing the target sound
- Visual: Smooth flip animation revealing new prefix/suffix

**Center Card (Main Sound):**
- Action: Tap/click to flip
- Behavior: Reveals pronunciation guide on back
- Front: Visual display of vowel combination (e.g., "ui")
- Back: IPA notation + Spanish approximation
- Additional: "Pronounce" button triggers TTS playback

**Example Interaction Sequence:**
1. User sees: h-**ui**-s
2. Taps left card → reveals: b-**ui**-ten
3. Taps center card → flips to show: [œy] + "Similar to Spanish 'ui' but rounder"
4. Taps "Pronounce" button → hears TTS pronunciation of "ui"
5. Taps right card → cycles to next word combination

#### 3.2.2 Lesson Practice Flow
1. **Lesson Selection:** User selects sound and difficulty level from menu
2. **Practice Phase:**
   - System presents words using spaced repetition
   - User flips cards to explore word combinations
   - Each word must be seen 3 times before completion eligible
   - User can mark words as "difficult" or "easy" during practice
   - Difficult words appear more frequently (adaptive algorithm)
3. **Quiz Phase:**
   - Triggered after all words seen minimum 3 times
   - 5 randomly selected words from lesson
   - Format: Show phonetic pronunciation → user selects correct written word from 4 options
   - After selection: TTS plays correct pronunciation regardless of answer correctness
   - Passing score: 80% (4 out of 5 correct)
4. **Completion:**
   - Points awarded for correct quiz answers
   - Badge/achievement unlocked
   - Visual reward animation
   - Next difficulty level unlocked (if applicable)

### 3.3 Gamification System

#### 3.3.1 Points Mechanism
**Earning Points:**
- Quiz correct answer: 20 points per word
- Quiz completion (regardless of score): 10 bonus points
- Perfect quiz (5/5): 50 bonus points

**Point Display:**
- Total cumulative score visible in header
- Points earned animation on quiz answer reveal
- Points leaderboard (self-comparison over time, not multi-user)

#### 3.3.2 Badges & Achievements
**Badge Categories:**
- **Sound Mastery:** Complete both difficulty levels for a sound
  - Example: "aa Master" badge
- **Milestone Achievements:**
  - "First Steps" (complete first lesson)
  - "Vowel Explorer" (complete 3 sounds)
  - "Pronunciation Pro" (complete all Phase 1 sounds)
- **Perfection Badges:**
  - "Perfect Score" (100% on any quiz)
  - "Flawless" (100% on 5 consecutive quizzes)
- **Encouragement Badges (Persistence):**
  - "¡No me rendiré!" / "I won't give up!" (0/5 on a quiz, then retry)
  - "La práctica hace al maestro" / "Practice makes perfect" (complete 10 quizzes regardless of score)
  - "Perseverance" (retry a failed quiz and pass)

#### 3.3.3 Point Milestones & Rewards (Per Level)
**Star System:**
Each level has its own 3-star progression based on points earned within that level:
- **Bronze Star:** 300 points (~3 perfect quizzes)
- **Silver Star:** 800 points (~8 quizzes)
- **Gold Star:** 1,500 points (~15 quizzes)

**Star Display:**
- Stars shown per level in the level selection screen
- Current level stars displayed prominently during practice
- All earned stars visible in profile/achievements section

**Rewards:**
- Visual star indicators (Bronze, Silver, Gold colors)
- Celebratory animation when star is earned
- Level completion unlocks next level
- Unlockable themes tied to total stars earned (future)

#### 3.3.3 Visual Rewards
- **Unlockable Themes:** Color schemes/visual themes earned through progression
- **Completion Animations:** Celebratory animations on lesson completion
- **Progress Visualization:** Animated progress bars, visual completion indicators
- **Aesthetic:** Duolingo-style (bright, playful, cartoonish)

### 3.4 User Interface Requirements

#### 3.4.1 Language Support
- **Bilingual Toggle:** Spanish ↔ English (persistent preference)
- **UI Elements:** All navigation, buttons, instructions in selected language
- **Content:**
  - Dutch words (unchanging)
  - Spanish approximation descriptions (Spanish only)
  - English approximation descriptions (English only)

#### 3.4.2 Internationalization (i18n) Architecture
**Design Principles:**
- All user-facing strings stored in language JSON files
- No hardcoded text in component code
- Language file structure: `src/i18n/{lang}.json` (e.g., `es.json`, `en.json`)
- Dynamic language switching without page reload

**Future Language Expansion:**
- Portuguese (high affinity with Spanish speakers)
- German (large Dutch-learning community)
- French (neighboring country)

**Translation Workflow:**
- Primary development in Spanish
- English as secondary (developer-maintained)
- Future languages: external translation service or community contributions

#### 3.4.2 Responsive Design
**Device Priorities:**
1. **Primary (iPhone):** Mobile-first design, touch-optimized
2. **Secondary (iPad):** Tablet layout optimization
3. **Tertiary (Desktop):** Browser compatibility (Chrome, Safari, Firefox)

**Layout Adaptations:**
- Mobile: Stacked card view (vertical orientation option)
- Tablet/Desktop: Side-by-side three-card layout
- Touch targets minimum 44×44px (iOS standards)
- Gesture support: swipe to flip cards (mobile/tablet)

#### 3.4.3 Visual Design Principles
- **Style:** Duolingo-inspired (bright, playful, cartoonish)
- **Color Palette:** High contrast, vibrant colors
- **Typography:** Large, legible fonts (primary target sound minimum 48px)
- **Animations:** Smooth, delightful micro-interactions
- **Accessibility:** WCAG 2.1 AA compliance (color contrast, touch targets)

### 3.5 Text-to-Speech (TTS) Integration

#### 3.5.1 Technology
- **API:** Native Web Speech Synthesis API
- **Language:** Dutch (nl-NL - Netherlands Dutch)
- **Voice Selection:** User-configurable from available Dutch voices

#### 3.5.2 Voice Selection Feature
**Functionality:**
- Detect all available Dutch voices on device
- Present voice options in settings (if multiple available)
- Allow user to preview each voice before selecting
- Persist voice preference in localStorage
- Fallback to default if selected voice becomes unavailable

**Voice Variety Benefits:**
- Different accents/styles for learning exposure
- User preference for voice characteristics (pitch, speed)
- Male/female voice options where available

#### 3.5.3 TTS Trigger Points
1. **Center Card "Pronounce" Button:** User-initiated pronunciation of isolated sound
2. **Quiz Answer Reveal:** Automatic pronunciation after user selects answer (correct or incorrect)

#### 3.5.4 Implementation Constraints
- **User Action Required:** TTS must be triggered by user interaction (iOS Safari requirement)
- **Fallback:** Graceful degradation if Dutch voices not installed (display message: "Dutch voice not available on this device")
- **Online/Offline:** Works offline once voices loaded (native API)

### 3.6 Data & Progress Tracking

#### 3.6.1 Progress Data Captured
- Lessons completed (sound + difficulty level)
- Quiz scores (per lesson, historical)
- Total points accumulated
- Badges earned
- Words marked as "difficult"
- Lesson attempt timestamps

#### 3.6.2 Persistence Strategy (MVP)
- **Technology:** Browser localStorage
- **Scope:** Single device, single browser
- **Data Retention:** Indefinite (until browser cache cleared)
- **Privacy:** No data transmitted externally

#### 3.6.3 Future: Cloud Sync (Phase 2+)
- User authentication system
- Cross-device progress synchronization
- Historical analytics and learning insights
- Data export capability

---

## 4. Technical Requirements

### 4.1 Platform & Hosting
- **Hosting:** GitHub Pages (static site hosting)
- **Deployment:** Automated via GitHub Actions
- **Domain:** Custom domain or github.io subdomain

### 4.2 Technology Stack
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Framework Recommendation:** Vanilla JS or lightweight framework (React, Vue, Svelte)
- **Database:** DuckDB (embedded, for future content management/analytics)
- **Version Control:** Git + GitHub

### 4.3 Browser Compatibility
**Minimum Supported Versions:**
- iOS Safari 15+ (primary target)
- Chrome 90+
- Firefox 88+
- Safari 15+ (macOS)

**Required APIs:**
- Web Speech Synthesis API
- localStorage API
- Fetch API (for future content loading)

### 4.4 Performance Requirements
- **Initial Load Time:** < 3 seconds on 4G connection
- **Card Flip Animation:** 60fps smooth animation
- **TTS Latency:** < 500ms from button press to audio start
- **Quiz Response Time:** < 100ms from selection to feedback

### 4.5 Security & Privacy
- **No PII Collection:** Zero personal data collected in MVP
- **localStorage Only:** All data remains on user device
- **No Analytics Tracking:** No third-party analytics in MVP
- **HTTPS:** Enforced via GitHub Pages (automatic)

---

## 5. Content Requirements

### 5.1 Lesson Content Development

#### 5.1.1 Phase 1 Content Specification
**Sound: aa**
- Beginner Lesson: 8-10 words (e.g., naam, jaar, straat, maat, paar, kaas, vaak, waar)
- Advanced Lesson: 15-20 words (longer/complex words with "aa")

**Sound: ee**
- Beginner Lesson: 8-10 words (e.g., meer, zee, nee, twee, keer, leer, weer, beer)
- Advanced Lesson: 15-20 words

**Sound: oo**
- Beginner Lesson: 8-10 words (e.g., groot, rood, boot, dood, noor, zoon, voor, loop)
- Advanced Lesson: 15-20 words

**Sound: uu**
- Beginner Lesson: 8-10 words (e.g., duur,uur, muur, vuur, puur, buur, zuur, stuur)
- Advanced Lesson: 15-20 words

#### 5.1.2 Content Source
- **Primary:** Dutch frequency word lists (top 5000 most common words)
- **Filter:** Words containing target sound in stressed syllable position preferred
- **Verification:** Native Dutch speaker review recommended (future)

#### 5.1.3 Pronunciation Guide Content
For each sound, provide:
- **IPA Notation:** International Phonetic Alphabet representation
- **Spanish Approximation:** Description using Spanish sound references
- **English Approximation:** Description using English sound references (for bilingual UI)

**Example for "ui" (future phase):**
- IPA: [œy]
- Spanish: "Similar a 'ui' en español pero con labios más redondeados"
- English: "Like 'ow' in 'how' but rounder, closer to French 'eu'"

#### 5.1.4 Word Translation & Context Content
For each word in a lesson, provide:
- **Translation (Spanish):** Direct translation to Spanish
- **Translation (English):** Direct translation to English
- **Example Sentence (Dutch):** Simple sentence using the word in context
- **Example Sentence Translation:** Translation of example sentence

**Example for "huis":**
- Dutch: huis
- Spanish: casa
- English: house
- Example (Dutch): "Ik woon in een groot huis."
- Example (Spanish): "Vivo en una casa grande."
- Example (English): "I live in a big house."

**Display Behavior:**
- Translation visible below flip cards during practice
- Example sentence appears on tap/click of translation
- Helps reinforce vocabulary alongside pronunciation

### 5.2 Quiz Content
- **Question Pool:** All words from lesson (8-10 or 15-20)
- **Quiz Size:** 5 random words per quiz attempt
- **Distractors:** Multiple choice options include:
  - Correct answer
  - 3 plausible incorrect words (same sound family or similar phonetics)

---

## 6. Success Criteria & KPIs

### 6.1 MVP Launch Criteria
- All 8 Phase 1 lessons fully functional
- TTS pronunciation working on iOS Safari
- Quiz mode operational with scoring
- Points and badges awarding correctly
- Bilingual UI toggle functional
- Progress persisting in localStorage
- Responsive design working on iPhone, iPad, desktop
- Zero critical bugs

### 6.2 User Success Metrics (Future)
- Lesson completion rate
- Quiz score averages (target: >80% average)
- Return user rate (daily active usage)
- Average session duration
- Words marked as "difficult" (identify problem sounds)

### 6.3 Technical Performance Metrics
- Page load time < 3s
- Zero JavaScript errors in production
- 100% uptime (GitHub Pages SLA)
- Lighthouse score >90 (performance, accessibility)

---

## 7. Assumptions & Dependencies

### 7.1 Confirmed Assumptions
1. Target user has iPhone with iOS Safari browser
2. Target user has Dutch language/voice pack installed on iOS device (for TTS)
3. User has basic familiarity with digital learning apps
4. User is motivated for self-directed learning (no instructor/tutor)
5. Frequency-based word lists are pedagogically appropriate for sound learning

### 7.2 Dependencies
- **Content Creation:** Word lists must be curated before development
- **Dutch TTS Voices:** Users must have Dutch voices installed on device
- **GitHub Pages:** Hosting platform availability and reliability
- **Browser APIs:** Web Speech Synthesis API stability and support

### 7.3 Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Dutch voice not installed on user device | High | Display clear error message with instructions to install Dutch language pack in iOS settings |
| localStorage cleared by user/browser | Medium | Add export/import progress feature (future), educate users about data persistence |
| Browser API deprecation | Low | Use standard Web APIs with wide support, monitor W3C standards |
| Content quality issues | Medium | Pilot test with target user, iterate based on feedback |

---

## 8. Approval & Sign-Off

**Business Requirements Owner:** [User Name]
**Approved for Development:** 2026-01-29
**Next Review Date:** Post-MVP user testing phase

---

## 9. Document Control

**Version History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-29 | Business Requirements Analyst | Initial requirements documentation approved for MVP development |
| 1.1 | 2026-01-30 | Business Requirements Analyst | Added Phase 1.5 features: word translations, example sentences, TTS voice selection, point milestones, encouragement badges, i18n architecture |
| 1.2 | 2026-01-30 | Business Requirements Analyst | Restructured to tiered level system (Level 1: Misma Vocal, Level 2: Vocales Diferentes, etc.). Changed to 3-star progression (Bronze, Silver, Gold) per level. |

**Related Documents:**
- `/docs/requirements/user-stories.md` - User story specifications
- `/docs/requirements/lesson-taxonomy.md` - Lesson structure and content organization
