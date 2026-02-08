# Project Backlog

**Dutch Pronunciation Flip Cards**
**Last Updated:** 2026-02-08

---

## Current State Summary

| Metric | Value |
|--------|-------|
| Sounds covered | 8 (aa, ee, oo, uu, oe, ie, ei, ij) |
| Lessons | 16 (BEG + ADV per sound) |
| Words | 252 |
| Tests | 523 (17 test files) |
| Components | 8 (FlipCard, Quiz, QuizResults, LessonMenu, BadgeGallery, StarIndicator, SplashScreen, SoundIntro) |
| Languages | 2 (ES, EN) — user-selectable via header toggle + splash screen |
| Storage | localStorage only (6 keys) |
| Deployment | GitHub Pages (static SPA) |
| Backend | None |
| PWA | No |
| Auth | None |

---

## Learning Objectives (Draft)

**Primary Goal:** Enable the student to READ Dutch by building familiar memory of vowel sounds and their written forms.

**Specific Objectives:**
1. Recognize all Dutch long vowel sounds (aa, ee, oo, uu) in written words
2. Associate each vowel combination with its IPA pronunciation
3. Discriminate between similar-sounding Dutch vowel pairs
4. Recognize diphthongs and complex vowel pairs (ae, au, ie, ou, ui, oe, eu, ei, ij) in written words
5. Build sufficient vowel recognition to support reading comprehension of simple Dutch texts

**Bloom's Taxonomy Coverage:**
- Current: Remember/Understand/Apply (recognition + word construction)
- Needed: Analyze (minimal pair discrimination, contrastive analysis)
- Future: Evaluate/Create (production exercises, self-assessment)

---

## Completed Work

### Phase 1 — MVP
- [x] FlipCard component (3-section layout, 3D flip, keyboard accessible)
- [x] Quiz component (multiple choice, progress dots, TTS feedback)
- [x] QuizResults component (score breakdown, points display)
- [x] LessonMenu component (progress tracking, unlock logic)
- [x] Lesson data schema with validators
- [x] 8 lesson JSON files with bilingual translations
- [x] Web Speech API integration for Dutch TTS
- [x] Quiz distractor strategy (5-tier priority system)
- [x] localStorage progress persistence
- [x] GitHub Pages deployment with CI/CD

### Phase 1.5 — Enhancements
- [x] **US-1007** Quiz feedback layout fix
- [x] **US-1005** Point milestone stars (global: 300/800/1500)
- [x] **US-1006** Encouragement badges (never-give-up, practice-master, perseverance)
- [x] **US-1004** Badge Gallery with progress indicators and category grouping
- [x] **US-1001** Word translations (togglable, hidden by default — pedagogically correct)
- [x] Badge awarding wired into quiz completion flow
- [x] Debug globals removed from production
- [x] 399 tests across 12 files (schema, quizHelpers, lessonLoader, badges, FlipCard, Quiz, QuizResults, StarIndicator, BadgeGallery, LessonMenu, progressStorage, tts)

### Sprint 1 — Security Hardening & Scoring
- [x] **BL-016** `.envrc` added to `.gitignore`
- [x] **BL-015** GitHub Actions pinned to SHA hashes
- [x] **BL-014** CSP meta tag added (with `'unsafe-inline'` for styles)
- [x] **BL-004** Milestones recalibrated to 200/640/1280
- [x] **BL-005** `perfectBonus` → `masteryBonus` (20pts for >=80%, not 50pts for 100%)
- [x] **BL-011** practice-master badge requires passing (not just attempts)

### Sprint 2 — Language & UX
- [x] **tsconfig fix** Added `allowJs: true` to fix CI typecheck step
- [x] **BL-002** Language selection with header globe toggle (ES/EN), persisted to localStorage
- [x] **BL-001** Splash screen shown on every visit as app entry point
- [x] **BL-020 + BL-021** Sound intro screen with IPA, pronunciation description, listen button, and learning objectives
- [x] View flow: Splash → Menu → SoundIntro → FlipCard → Quiz → Results → Menu
- [x] 437 tests across 14 files (added splashScreen, soundIntro test files)

### Sprint 3 — Content Expansion (First Batch)
- [x] **BL-003** Phase 2 first batch: 8 lessons for oe, ie, ei, ij (BEG + ADV each)
- [x] **BL-018** 5 new badges: sound-master-oe, sound-master-ie, sound-master-ei, sound-master-ij, level-2-complete
- [x] **BL-019** ei/ij cross-distractors for spelling discrimination
- [x] Dynamic badge logic (iterates `lessonsBySound` instead of hardcoded array)
- [x] Phase-grouped LessonMenu rendering (Phase 1: Same Vowel, Phase 2: Vowel Pairs)
- [x] 443 tests across 14 files

### Sprint 4 — Learning Mechanics
- [x] **BL-006** TTS Dutch voice selection: `scoreVoice()` ranking (nl-NL > nl-BE, cloud preferred), `getDutchVoices()` timeout, TTS unavailable warning in Quiz
- [x] **BL-010** Explanatory quiz feedback: dynamic explanations for incorrect answers comparing sound differences via `getWordSound()` and `generateFeedbackExplanation()`
- [x] **BL-007** Spaced repetition review mode: `reviewScheduler.js` with urgency-based scheduling (1/3/7/14/30 day intervals), review storage in localStorage, `generateReviewQuiz()` for multi-lesson sessions, review-due indicators on menu buttons, full review flow
- [x] 523 tests across 17 files (added tts, reviewScheduler, expanded quiz/quizHelpers/lessonMenu/progressStorage)

---

## Backlog

### Priority Legend
- **P0 — Critical:** Blocks learning effectiveness or user experience
- **P1 — High:** Significant feature or improvement
- **P2 — Medium:** Valuable enhancement
- **P3 — Low:** Nice to have

---

### BL-001: Splash Screen
**Priority:** P2 | **Effort:** Small | **Status:** Complete

Add a splash/welcome screen when the app first opens. Should display:
- App logo/title
- Brief tagline ("Learn Dutch pronunciation")
- Language selection (see BL-002)
- "Start Learning" CTA

**Dependencies:** BL-002 (language selection)

---

### BL-002: Language Selection UI
**Priority:** P1 | **Effort:** Medium | **Status:** Complete

Currently the UI language is hardcoded to `'es'` in main.js. All components already accept a `language` parameter and have TEXT objects with both ES/EN strings.

**Options (choose one):**
- A) Flag icon in header corner — toggles ES/EN on tap
- B) Language selector on splash screen + icon in header for switching

**Implementation:**
- Store language preference in localStorage
- Pass selected language to all component instantiations
- Update `main.js` to read language from storage instead of hardcoding `'es'`
- No i18n library needed — existing TEXT object pattern works

**Related:** US-1101 from Phase 1.5 plan (can be simplified — full i18n extraction not needed yet)

---

### BL-003: Add Phase 2 Vowel Pair Lessons
**Priority:** P0 | **Effort:** Large | **Status:** Partial (first batch complete)

Add lessons for Dutch diphthongs and vowel pairs. Currently only "same vowel" sounds (aa, ee, oo, uu). Need to add vowel combinations.

**Sounds to add** (recommended order from pedagogical review):

| Order | Sound | IPA | Why This Order |
|-------|-------|-----|----------------|
| 1 | oe | [u] | Familiar — maps to Spanish "u" in "su" |
| 2 | ie | [i] | Familiar — maps to Spanish "i" in "si" |
| 3 | ei | [ɛi] | Semi-familiar — similar to Spanish "ey" |
| 4 | ij | [ɛi] | Same sound as ei, different spelling — critical minimal pair |
| 5 | ou | [ʌu] | Partially familiar — diphthong with known components |
| 6 | au | [ʌu] | Same sound as ou, different spelling — another spelling pair |
| 7 | eu | [ø] | Unfamiliar — no Spanish equivalent |
| 8 | ui | [œy] | Most difficult — no Spanish equivalent |
| 9 | ae | [a] | Archaic/rare — lower priority |

**Sequencing principles** (from pedagogical review):
1. Start with sounds that map to familiar Spanish phonemes
2. Introduce perceptually distinct sounds before similar ones
3. Pair sounds that are written differently but pronounced the same (ei/ij, ou/au)
4. Save most unfamiliar sounds for last (eu, ui)

**Per sound:** Create BEG (8-9 words) + ADV (10-15 words) lesson JSONs
**Estimated content:** ~18 new lessons, ~180 new words

**Schema support:** `PHASE_2_SOUNDS` already defined in `schema.js` line 91

---

### BL-004: Recalibrate Point Milestones
**Priority:** P0 | **Effort:** Small | **Status:** Complete

**Problem identified by gamification review:**
- Current Gold milestone (1500 pts) is unreachable with 8 lessons (max possible: 1280 pts with all perfect scores)
- Thresholds (300/800/1500) are arbitrary, not curriculum-aligned

**Recommendation:** Switch to per-phase milestones
```
Phase 1 (8 lessons):  Bronze 200 | Silver 640 | Gold 1280
Phase 2 (18 lessons): Bronze 360 | Silver 1152 | Gold 2304
```

**Alternative:** Recalibrate global thresholds to match actual achievable points

**Files:** `src/lib/progressStorage.js` (MILESTONES constant)

---

### BL-005: Fix Perfect Bonus Anxiety
**Priority:** P0 | **Effort:** Small | **Status:** Complete

**Problem identified by gamification review:**
- Perfect quiz: (5x20) + 10 + 50 = 160 pts
- Missing ONE question: (4x20) + 10 = 90 pts (44% reduction!)
- The 50-point perfect bonus creates performance anxiety

**Recommendation:** Replace 50-pt perfect bonus with 20-30 pt mastery bonus awarded for 80%+ scores (aligns with existing pass threshold).

**Files:** Lesson JSON files (`masteryBonus`), `src/lib/quizHelpers.js`, `src/components/QuizResults.js`

---

### BL-006: Fix TTS Dutch Pronunciation
**Priority:** P1 | **Effort:** Medium | **Status:** Complete

**Problem:** Web Speech API often defaults to English pronunciation for words that exist in both languages. The `nl-NL` voice must be available on the device.

**Options to investigate:**
1. **Force `lang='nl-NL'` on utterance** (already done in tts.js line 97) — ensure this is working correctly
2. **Use a third-party Dutch TTS API** (e.g., Google Cloud TTS, Azure Cognitive Services, ResponsiveVoice) — higher quality but requires backend/API key
3. **Pre-record audio files** for each word — highest quality but scales poorly (84+ words)
4. **Hybrid approach:** Use Web Speech API with fallback to a cloud TTS service

**Investigation needed:** Test current behavior across browsers (Chrome, Safari, Firefox) and devices (iOS, Android) to quantify the problem.

**Note from security review:** If using cloud TTS, disclose in privacy policy that pronunciation data may be sent to third-party servers.

---

### BL-007: Spaced Repetition / Review Mode
**Priority:** P0 | **Effort:** Medium | **Status:** Complete

**Identified as critical by both pedagogical AND gamification reviews.**

Without review mechanics, learners complete lessons and forget most content (Ebbinghaus forgetting curve: 90% forgotten within a week without review).

**Implementation:**
1. Track `lastReviewedAt` timestamp per lesson in localStorage
2. Surface "due for review" lessons on the LessonMenu with visual indicator
3. Suggested intervals: 1 day, 3 days, 7 days, 14 days, 30 days
4. Add "Review Mode" quiz that mixes questions from all completed lessons
5. Weight review questions toward lessons not reviewed recently

**New localStorage key:** `flipcards_lesson_review_dates`

**Optional:** Daily review tracking (NOT streaks with loss aversion — just "reviews this week" counter)

---

### BL-008: Cross-Device Score Persistence
**Priority:** P2 | **Effort:** Large | **Status:** Not Started

**Current state:** All progress stored in localStorage — lost if user changes device, clears browser data, or uses private browsing. No DuckDB is used (only localStorage with 4 keys).

**Architecture recommendation from security review:**

**Option A: Supabase (Recommended — simplest)**
- Provides PostgreSQL + Auth + Row-Level Security out of the box
- Free tier covers hobby usage
- No custom backend code needed
- OAuth social login (Google) for auth

**Option B: Custom API (more control)**
- Node.js/Express or Hono on Cloudflare Workers / Fly.io
- PostgreSQL or SQLite/Turso for storage
- JWT auth with HTTP-only cookies

**Migration strategy:**
1. Keep localStorage as primary store (offline-first)
2. When user logs in, sync localStorage data to server (one-time migration)
3. Dual-write: write to both localStorage and server on every action
4. Server-wins conflict resolution for scores (scores only go up)
5. Validate all client data server-side (prevent point manipulation)

**Note:** DuckDB is NOT suitable as a web app backend (single-writer, no row-level security). Use PostgreSQL.

**GDPR considerations** (users likely EU residents learning Dutch):
- Privacy policy required before adding auth
- Implement right to deletion (`DELETE /api/v1/users/me`)
- Implement right to export (`GET /api/v1/users/me/export`)
- Define data retention policy

---

### BL-009: Login / Registration
**Priority:** P2 | **Effort:** Large | **Status:** Not Started

**Depends on:** BL-008

**Recommended approach from security review:**
- **OAuth social login** (Google, optionally Apple for iOS users) — avoids password management
- Use managed auth provider (Supabase Auth, Clerk, or Firebase Auth)
- Never store auth tokens in localStorage — use HTTP-only cookies
- Short-lived JWTs (15-min access token) + secure refresh cookie

**Not recommended:** Custom email/password auth — disproportionate complexity for a learning app.

---

### BL-010: Quiz Explanatory Feedback
**Priority:** P1 | **Effort:** Medium | **Status:** Complete

**Identified by both pedagogical and gamification reviews.**

Currently incorrect quiz answers show only "Not exactly" with the correct answer highlighted. No explanation of WHY the answer is wrong.

**Recommendation:** Add "Why?" explanations for incorrect answers:
- Show pronunciation tip: "The 'aa' is a longer sound. Listen again."
- Highlight the sound difference between the selected word and the correct answer
- This turns failure into a teaching moment

**Implementation options:**
- Add `explanation` field to lesson JSON distractor pools
- Or generate contextual feedback based on sound comparison

---

### BL-011: Practice-Master Badge Criteria
**Priority:** P2 | **Effort:** Small | **Status:** Complete

**Problem from gamification review:** The "Practice Master" badge rewards volume (10 quizzes, any score) without requiring learning.

**Options:**
- A) Add passing requirement (10 quizzes with 80%+ average)
- B) Rename to "Dedicated Learner" and move to MILESTONE category
- C) Replace with improvement badge ("Fast Learner": pass 5 lessons on first attempt)

**Files:** `src/data/badges.js`, `src/lib/progressStorage.js`

---

### BL-012: Example Sentences (US-1002)
**Priority:** P3 | **Effort:** Medium | **Status:** Not Started

Display example sentences when tapping a word's translation. Each word would need:
```json
{
  "exampleNL": "Ik woon in een groot huis.",
  "exampleES": "Vivo en una casa grande."
}
```

**Content task:** 84 existing words need example sentences. Consider AI-assisted generation with human review.

---

### BL-013: TTS Voice Selection (US-1003)
**Priority:** P3 | **Effort:** Medium | **Status:** Not Started

Allow users to choose from available Dutch voices. Preview each voice before selecting. Persist preference in localStorage.

---

### BL-014: Content Security Policy
**Priority:** P1 | **Effort:** Small | **Status:** Complete

**From security review:** Add CSP meta tag to `index.html`:
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
               img-src 'self' data:; font-src 'self'; connect-src 'self';
               object-src 'none'; base-uri 'self'; form-action 'self';">
```

Also move dynamic styles from `addLayoutStyles()` in main.js to a CSS file to eventually remove `'unsafe-inline'`.

---

### BL-015: Pin GitHub Actions to SHA Hashes
**Priority:** P1 | **Effort:** Small | **Status:** Complete

**From security review:** Current workflows use tag-based references (`@v4`) which can be retargeted. Pin to commit SHAs:
```yaml
# Instead of:
uses: actions/checkout@v4
# Use:
uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11  # v4.1.1
```

**Files:** `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`

---

### BL-016: Add `.envrc` to `.gitignore`
**Priority:** P1 | **Effort:** Tiny | **Status:** Complete

**From security review:** The `.envrc` file is tracked in git. While it doesn't contain real secrets now, it creates a risk of accidentally committing credentials in the future.

---

### BL-017: Batch Celebration Modals
**Priority:** P3 | **Effort:** Small | **Status:** Not Started

**From gamification review:** After quiz completion, users can face up to 3 sequential interruption screens (results, milestone, badges). Consider batching celebrations into the results screen.

---

### BL-018: Add Phase 2 Badges
**Priority:** P2 | **Effort:** Small | **Status:** Partial (first batch complete)

**Depends on:** BL-003

When Phase 2 content is added, create corresponding badges:
- Sound mastery badges for each new vowel pair (7 badges)
- `level-2-complete` milestone badge
- Adjust badge gallery categories if needed

**Badge fatigue warning:** Going from 10 to ~18 badges is manageable. Beyond 25-30, individual achievements lose significance.

---

### BL-019: Minimal Pair Exercises
**Priority:** P2 | **Effort:** Medium | **Status:** Partial (ei/ij cross-distractors done)

**From pedagogical review:** For Phase 2, add exercises that contrast similar-sounding pairs:
- ei vs ij (same pronunciation, different spelling)
- ou vs au (same pronunciation, different spelling)
- eu vs oe (different but confusable for Spanish speakers)

This targets the Analyze level on Bloom's Taxonomy and directly supports the reading comprehension objective.

---

### BL-020: Pre-Lesson Sound Introduction
**Priority:** P2 | **Effort:** Small | **Status:** Complete

**From pedagogical review:** Before entering the FlipCard practice, show a brief introduction screen:
- Sound combination and IPA
- Pronunciation description
- Audio demo button
- "Start Practice" CTA

This provides context before the learner encounters individual words.

---

### BL-021: Learning Objectives Display
**Priority:** P2 | **Effort:** Small | **Status:** Complete

**From pedagogical review:** Display explicit learning objectives at the start of each lesson or lesson group. Example: "After this lesson, you will be able to recognize the 'aa' sound in 8 common Dutch words."

---

### BL-022: Confusion Tracking
**Priority:** P3 | **Effort:** Medium | **Status:** Not Started

**From pedagogical review:** Track which sound pairs the learner consistently confuses (e.g., always picks 'ee' words when 'oo' is correct). Surface this insight and suggest targeted review.

---

### BL-023: PWA / Service Worker
**Priority:** P3 | **Effort:** Medium | **Status:** Not Started

Add PWA manifest and service worker for:
- Offline access (the app has no server dependencies)
- Add to Home Screen on iOS/Android
- Faster subsequent loads

---

### BL-024: Localize Footer & View UI Strings
**Priority:** P2 | **Effort:** Small | **Status:** Not Started

**From Sprint 2 PR review:** Footer button labels ("Start Quiz", "Back to Practice", "How to use:") and subtitle strings remain hardcoded in English while all other surfaces now respect language preference.

**Files:** `src/main.js` (`updateViewUI()`, `renderLayout()` footer section)

---

### BL-025: Enable `checkJs` in tsconfig
**Priority:** P3 | **Effort:** Medium | **Status:** Not Started

**From Sprint 2 PR review:** `allowJs: true` was added to fix CI but `checkJs: true` is not enabled, meaning JSDoc type annotations are not validated by tsc. Enabling it surfaces ~1076 errors that need incremental fixing.

**Files:** `tsconfig.json`, various source and test files

---

---

## Recommended Implementation Order

### Sprint 1 — Quick Wins & Critical Fixes ✅
1. ~~BL-016: Add `.envrc` to `.gitignore` (tiny)~~
2. ~~BL-015: Pin GitHub Actions to SHA hashes (small)~~
3. ~~BL-014: Content Security Policy (small)~~
4. ~~BL-005: Fix perfect bonus anxiety (small)~~
5. ~~BL-004: Recalibrate point milestones (small)~~
6. ~~BL-011: Practice-master badge criteria (small)~~

### Sprint 2 — Language & UX ✅
7. ~~BL-002: Language selection UI (medium)~~
8. ~~BL-001: Splash screen (small)~~
9. ~~BL-020: Pre-lesson sound introduction (small)~~
10. ~~BL-021: Learning objectives display (small)~~

### Sprint 3 — Content Expansion (First Batch) ✅
11. ~~BL-003: Phase 2 vowel pair lessons — first batch: oe, ie, ei, ij (large)~~
12. ~~BL-018: Phase 2 badges — first batch: 4 sound-master + level-2-complete (small)~~
13. ~~BL-019: Minimal pair cross-distractors for ei/ij (medium)~~

### Sprint 4 — Learning Mechanics ✅
14. ~~BL-006: Fix TTS Dutch pronunciation (medium)~~
15. ~~BL-010: Quiz explanatory feedback (medium)~~
16. ~~BL-007: Spaced repetition / review mode (medium)~~

### Sprint 5 — Content Expansion (continued)
17. BL-003: Phase 2 remaining sounds: ou, au, eu, ui (large)

### Future — Server-Side Features
18. BL-009: Login / registration (large)
19. BL-008: Cross-device score persistence (large)
20. BL-012: Example sentences (medium)
21. BL-013: TTS voice selection (medium)
22. BL-017: Batch celebration modals (small)
23. BL-022: Confusion tracking (medium)
24. BL-023: PWA / service worker (medium)

---

## Specialist Review Summary

### Pedagogical Review Findings
- **Strengths:** Multimodal learning (visual+auditory+kinesthetic), scaffolded support, L2-first immersion, active word construction, growth mindset badges
- **Critical gaps:** No spaced repetition (BL-007), no learning objectives (BL-021), no explanatory feedback on quiz errors (BL-010), no production exercises
- **Phase 2 sequencing:** Start with familiar sounds (oe, ie), then minimal pairs (ei/ij), then unfamiliar (eu, ui)

### Gamification Review Findings
- **Working well:** Scaffolded unlocks, growth mindset badges, badge gallery transparency, 80% pass threshold, no social comparison mechanics, no dark patterns
- **Critical issues:** Perfect bonus creates anxiety (BL-005), milestone thresholds unreachable (BL-004), practice-master rewards volume not learning (BL-011), no spaced repetition (BL-007)
- **Point economics:** Perfect quiz = 160 pts, one mistake = 90 pts (44% reduction due to lost perfect bonus)

### Security Review Findings
- **Current site:** APPROVED — no high or medium severity issues
- **Findings:** No CSP headers (BL-014), GitHub Actions unpinned (BL-015), `.envrc` tracked in git (BL-016), dynamic style injection blocks strict CSP
- **Future architecture:** Use OAuth social login, managed auth provider (Supabase), PostgreSQL for user data (NOT DuckDB), server-side score validation, GDPR compliance needed
- **Positive findings:** localStorage stores only non-sensitive data, proper error handling, CI uses `npm ci`, least-privilege workflow permissions

### Architecture Clarification
- **No DuckDB** is used anywhere in the project. Progress is stored in browser localStorage only (6 keys: completed_lessons, total_points, earned_badges, quiz_history, language, lesson_review_dates). For server-side persistence, PostgreSQL (via Supabase or custom API) is recommended.
