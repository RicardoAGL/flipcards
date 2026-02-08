# Phase 1.5 Enhancements Implementation Plan

**User Stories:** US-1001 through US-1007, US-1101
**Status:** Planning
**Last Updated:** 2026-01-30

---

## Overview

Polish and enhancement features identified after MVP testing. These improvements address user feedback and add depth to the learning experience.

## Feature Summary

| ID | Feature | Priority | Complexity | Status |
|----|---------|----------|------------|--------|
| US-1007 | Quiz Feedback Layout Fix | High | Low | ✅ Complete |
| US-1004 | Badge Gallery | High | Medium | ✅ Complete |
| US-1001 | Word Translations | High | Medium | ✅ Complete |
| US-1002 | Example Sentences | Medium | Medium | ⬜ Not Started |
| US-1005 | Point Milestone Stars (global, not per-level) | Medium | Low | ✅ Complete |
| US-1006 | Encouragement Badges | Medium | Low | ✅ Complete |
| US-1003 | TTS Voice Selection | Low | Medium | ⬜ Not Started |
| US-1101 | Internationalization (i18n) | Low | High | ⬜ Not Started |

---

## Feature Details

### 1. Quiz Feedback Layout Fix (US-1007)

**Problem:** When answering a quiz question correctly, the green feedback box appears above the "Next" button, causing layout shift and pushing the button down.

**Solution:** Move feedback display below the "Next" button so UI elements remain anchored.

**Files to Modify:**
- `src/components/Quiz.css` - Adjust feedback container positioning
- `src/components/Quiz.js` - Update feedback insertion point

**Implementation:**
```css
/* Feedback appears below button, not above */
.quiz-feedback-container {
  order: 2; /* After button in flex order */
  margin-top: var(--space-4);
}
```

---

### 2. Badge Gallery (US-1004)

**Description:** Dedicated view showing all available badges with earned/unearned states and progress toward each.

**Files to Create:**
- `src/components/BadgeGallery.js` - Gallery component
- `src/components/BadgeGallery.css` - Styles
- `src/data/badges.js` - Badge definitions

**Files to Modify:**
- `src/main.js` - Add navigation to gallery
- `src/lib/progressStorage.js` - Add badge tracking functions
- `src/components/LessonMenu.js` - Add gallery access button

**Badge Data Structure:**
```js
{
  id: 'first-steps',
  nameES: 'Primeros Pasos',
  nameEN: 'First Steps',
  descriptionES: 'Completa tu primera lección',
  descriptionEN: 'Complete your first lesson',
  icon: '🎯',
  criteria: { type: 'lessons_completed', count: 1 },
  earnedAt: null // timestamp when earned
}
```

---

### 3. Word Translations (US-1001)

**Description:** Display Spanish/English translation below flip cards during practice.

**Files to Modify:**
- `src/data/lessons/*.json` - Add translation fields to words
- `src/components/FlipCard.js` - Display translation below cards
- `src/components/FlipCard.css` - Style translation display

**Data Schema Addition:**
```json
{
  "word": "huis",
  "prefix": "h",
  "suffix": "s",
  "translationES": "casa",
  "translationEN": "house"
}
```

**UI Placement:**
```
┌─────┐ ┌─────┐ ┌─────┐
│  h  │ │ ui  │ │  s  │
└─────┘ └─────┘ └─────┘
        huis
      ─────────
       "casa"     ← Translation (tappable)
```

---

### 4. Example Sentences (US-1002)

**Description:** On tapping translation, show example sentence using the word.

**Files to Modify:**
- `src/data/lessons/*.json` - Add example sentence fields
- `src/components/FlipCard.js` - Add tap handler and modal/tooltip
- `src/components/FlipCard.css` - Style sentence display

**Data Schema Addition:**
```json
{
  "word": "huis",
  "exampleNL": "Ik woon in een groot huis.",
  "exampleES": "Vivo en una casa grande.",
  "exampleEN": "I live in a big house."
}
```

---

### 5. Point Milestone Stars (US-1005) - REVISED

**Description:** 3-star progression (Bronze, Silver, Gold) per level, not global.

**Tiered Level System:**
```
Level 1: Misma Vocal (aa, ee, oo, uu) → 3 stars
Level 2: Vocales Diferentes (ui, oe, eu, au) → 3 stars
Level 3: Consonantes (future) → 3 stars
Level 4: Gramática (future) → 3 stars
```

**Files Modified:**
- `src/lib/progressStorage.js` - 3 milestones per level
- `src/components/StarIndicator.js` - Updated for 3 stars
- `src/components/StarIndicator.css` - Updated styles
- `src/components/LessonMenu.js` - Display level stars
- `src/main.js` - Show celebration on milestone

**Milestone Thresholds (per level):**
| Points | Star | Color | ~Quizzes |
|--------|------|-------|----------|
| 300 | ⭐ Bronze | #CD7F32 | ~3 |
| 800 | ⭐ Silver | #C0C0C0 | ~8 |
| 1,500 | ⭐ Gold | #FFD700 | ~15 |

---

### 6. Encouragement Badges (US-1006)

**Description:** Badges that reward persistence and effort, not just success.

**New Badges:**
| ID | Name (ES) | Name (EN) | Criteria |
|----|-----------|-----------|----------|
| `never-give-up` | ¡No me rendiré! | I won't give up! | Score 0/5, then retry |
| `practice-master` | La práctica hace al maestro | Practice makes perfect | Complete 10 quizzes |
| `perseverance` | Perseverancia | Perseverance | Fail then pass same quiz |

**Files to Modify:**
- `src/data/badges.js` - Add new badge definitions
- `src/lib/progressStorage.js` - Track quiz attempts for criteria
- `src/components/Quiz.js` - Check for badge conditions on complete

---

### 7. TTS Voice Selection (US-1003)

**Description:** Allow users to choose from available Dutch voices.

**Files to Create:**
- `src/components/VoiceSettings.js` - Voice picker component
- `src/components/VoiceSettings.css` - Styles

**Files to Modify:**
- `src/lib/tts.js` - Add voice enumeration and selection
- `src/lib/progressStorage.js` - Persist voice preference
- `src/main.js` - Add settings access

**Implementation Notes:**
```js
// Get available Dutch voices
const voices = speechSynthesis.getVoices()
  .filter(v => v.lang.startsWith('nl'));

// User can preview each voice
function previewVoice(voice) {
  speakDutch('Hallo, ik ben een Nederlandse stem.', { voice });
}
```

---

### 8. Internationalization - i18n (US-1101)

**Description:** Externalize all UI strings to JSON files for easy translation.

**Files to Create:**
- `src/i18n/es.json` - Spanish translations
- `src/i18n/en.json` - English translations
- `src/lib/i18n.js` - Translation utility functions

**Files to Modify:**
- All components - Replace hardcoded strings with `t('key')` calls

**Translation File Structure:**
```json
{
  "menu": {
    "title": "Lecciones",
    "progress": "Tu Progreso",
    "lessonsCompleted": "lecciones completadas"
  },
  "quiz": {
    "correct": "¡Correcto!",
    "incorrect": "No exactamente",
    "next": "Siguiente"
  }
}
```

**Usage Pattern:**
```js
import { t } from '@/lib/i18n.js';

// In component
const title = t('menu.title'); // Returns "Lecciones" or "Lessons"
```

---

## Implementation Order

### Phase 1.5a - Quick Wins (1-2 days)
1. **US-1007** - Quiz Feedback Layout Fix (Low complexity, high impact)
2. **US-1005** - Point Milestone Stars (Low complexity, adds motivation)
3. **US-1006** - Encouragement Badges (Low complexity, adds motivation)

### Phase 1.5b - Content Enhancement (3-5 days)
4. **US-1001** - Word Translations (Requires data update)
5. **US-1002** - Example Sentences (Builds on translations)
6. **US-1004** - Badge Gallery (Medium complexity)

### Phase 1.5c - Polish (2-3 days)
7. **US-1003** - TTS Voice Selection (Nice to have)
8. **US-1101** - Internationalization (Foundation for future)

---

## Data Migration Required

The lesson JSON files need to be updated with new fields:

```json
// Before
{
  "words": [
    { "prefix": "h", "suffix": "s" }
  ]
}

// After
{
  "words": [
    {
      "prefix": "h",
      "suffix": "s",
      "translationES": "casa",
      "translationEN": "house",
      "exampleNL": "Ik woon in een groot huis.",
      "exampleES": "Vivo en una casa grande.",
      "exampleEN": "I live in a big house."
    }
  ]
}
```

**Content Tasks:**
- [ ] Add translations to P1-AA-BEG.json (10 words)
- [ ] Add translations to P1-AA-ADV.json (20 words)
- [ ] Add translations to P1-EE-BEG.json (10 words)
- [ ] Add translations to P1-EE-ADV.json (20 words)
- [ ] Add translations to P1-OO-BEG.json (10 words)
- [ ] Add translations to P1-OO-ADV.json (20 words)
- [ ] Add translations to P1-UU-BEG.json (10 words)
- [ ] Add translations to P1-UU-ADV.json (20 words)

---

## Testing Checklist

### US-1007 - Quiz Feedback Layout
- [x] Correct answer feedback appears below Next button
- [x] Incorrect answer feedback appears below Next button
- [x] No layout shift when feedback appears
- [ ] Works on mobile and desktop (manual verification needed)

### US-1004 - Badge Gallery
- [ ] Gallery accessible from menu
- [ ] All badges displayed
- [ ] Earned badges show in color with date
- [ ] Unearned badges grayed out
- [ ] Progress bars for multi-step badges

### US-1001/1002 - Translations & Sentences
- [ ] Translation visible below flip cards
- [ ] Translation updates when word changes
- [ ] Tap translation shows example sentence
- [ ] Sentence has Dutch + translated version
- [ ] Dismiss sentence by tapping outside

### US-1005 - Point Milestones
- [x] Star appears at 500 points
- [x] Star upgrades at 1500, 3000, 5000
- [x] Celebration animation on milestone
- [x] Stars visible in lesson menu header
- [x] Progress bar shows distance to next milestone
- [ ] Manual verification on device

### US-1006 - Encouragement Badges
- [ ] "Never give up" badge after 0/5 + retry
- [ ] "Practice master" badge after 10 quizzes
- [ ] "Perseverance" badge after fail + pass

### US-1003 - Voice Selection
- [ ] Voice list shows available Dutch voices
- [ ] Preview button plays sample
- [ ] Selected voice persists
- [ ] Fallback if voice unavailable

### US-1101 - i18n
- [ ] All strings externalized
- [ ] Spanish translations complete
- [ ] English translations complete
- [ ] Language switch works without reload

---

## Open Questions

1. **Example sentences:** Should we auto-generate sentences or curate them manually?
   - Manual curation ensures quality but requires effort
   - Consider AI-assisted generation with human review

2. **Badge icons:** Use emoji or custom SVG icons?
   - Emoji: Quick, works everywhere, limited style control
   - SVG: Consistent style, more effort to create

3. **Voice selection:** How many voices should we show?
   - Show all available, or curate a "recommended" list?

---

## Next Steps

1. Start with US-1007 (Quiz Feedback Layout) - quick fix with immediate UX improvement
2. Prepare lesson data migration script for translations
3. Design badge gallery wireframe
4. Create i18n utility foundation
