# Business Requirements Document
## Dutch Pronunciation Learning App - Flip Cards

**Document Version:** 1.0
**Date:** 2026-01-29
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

### 2.2 MVP Scope (Phase 1)
**Sounds Covered:**
- Same vowel combinations: **aa, ee, oo, uu**
- Lesson count: 8 lessons (4 sounds × 2 difficulty levels each)
- Word count per lesson:
  - Beginner: 8-10 common words
  - Advanced: 15-20 more complex words

**Core Features:**
- Flip card interface with adaptive spaced repetition
- Bilingual UI (Spanish/English toggle)
- Quiz mode with pronunciation playback
- Points, badges, and visual rewards system
- Text-to-speech using Web Speech Synthesis API
- Progress tracking via browser localStorage

### 2.3 Phase 2 Scope (Post-MVP)
**Sounds to Add:**
- Different vowel combinations: **ui, ij, oe, eu, au/ou**
- Lesson count: +10 lessons (5 sounds × 2 difficulty levels)

### 2.4 Future Enhancements
- Consonant sounds (Dutch "g", Scheveningen exceptions)
- Cloud-based progress sync
- Advanced analytics and learning insights
- User-generated content lessons
- Social features (sharing, collaborative learning)

### 2.5 Explicit Out of Scope (MVP)
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
- **Voice Selection:** Default device Dutch voice (iOS Siri voices)

#### 3.5.2 TTS Trigger Points
1. **Center Card "Pronounce" Button:** User-initiated pronunciation of isolated sound
2. **Quiz Answer Reveal:** Automatic pronunciation after user selects answer (correct or incorrect)

#### 3.5.3 Implementation Constraints
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

**Related Documents:**
- `/docs/requirements/user-stories.md` - User story specifications
- `/docs/requirements/lesson-taxonomy.md` - Lesson structure and content organization
