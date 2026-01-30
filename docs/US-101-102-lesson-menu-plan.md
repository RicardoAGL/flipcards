# Lesson Selection Menu Implementation Plan

**User Stories:** US-101 (Browse Available Lessons), US-102 (View Lesson Progress)
**Status:** COMPLETE - Verified and Working
**Last Updated:** 2026-01-30

---

## Overview

Implement a lesson selection menu as the home screen of the application, allowing users to browse available lessons and track their progress.

## Requirements Summary

From the business requirements and wireframes:
- Display 4 sounds (aa, ee, oo, uu) in a 2-column grid
- Each sound shows: IPA notation, Beginner/Advanced levels
- Locked lessons (Advanced) visually distinct until Beginner complete
- Progress summary card at top (X/8 lessons, percentage)
- Total points display in header
- Tapping unlocked lesson navigates to practice mode
- Progress persists via localStorage

---

## Implementation Checklist

### Files Created

- [x] **`src/lib/progressStorage.js`** - Progress Persistence
  - `getCompletedLessons()` → string[]
  - `markLessonComplete(lessonId)` → void
  - `getTotalPoints()` → number
  - `addPoints(points)` → number
  - `getProgress()` → {completed, total, percentage, points}
  - `isLessonUnlocked(lessonId)` → boolean
  - `resetProgress()` → void
  - Storage keys: `flipcards_completed_lessons`, `flipcards_total_points`

- [x] **`src/components/LessonMenu.css`** - Menu Styles
  - `.lesson-menu` container
  - `.lesson-menu-progress` summary card
  - `.lesson-menu-grid` 2-column grid
  - `.sound-card` individual sound tile
  - `.level-btn`, `.level-btn--locked`, `.level-btn--completed` level buttons
  - Responsive: stack on xs, 2-col on sm+

- [x] **`src/components/LessonMenu.js`** - Menu Component
  - Factory function pattern returning `{destroy, refresh, getState}`
  - Header with points display
  - Progress summary card with animated bar
  - Sound grid (2-column)
  - Each sound card contains: sound + IPA, Beginner/Advanced buttons
  - `onSelectLesson(lessonId)` callback

- [x] **`tests/progressStorage.test.js`** - 20 test cases
- [x] **`tests/lessonMenu.test.js`** - 23 test cases

### Files Modified

- [x] **`src/main.js`** - Application Flow
  - Added `'menu'` to view types (menu | flipcard | quiz)
  - Default view is `'menu'` instead of `'flipcard'`
  - Added `mountLessonMenu()` function
  - Added `selectedLessonId` state
  - Updated navigation for 3-view flow
  - Added back button handling from practice → menu
  - On quiz complete (passed): mark lesson complete, add points, return to menu
  - Updated header to show points

- [x] **`vite.config.js`** - Added jsdom test environment

### Navigation Flow

```
Menu → Select Lesson → FlipCard Practice → Start Quiz → Quiz
                                                      ↓
                                           Quiz Complete (pass/fail)
                                                      ↓
                                              Return to Menu
```

---

## Automated Verification

- [x] **Lint:** `npm run lint` - Passes
- [x] **Build:** `npm run build` - Passes
- [x] **Unit Tests:** `npm test` - 48 tests passing
  - `tests/progressStorage.test.js` - 20 tests
  - `tests/lessonMenu.test.js` - 23 tests
  - `tests/example.test.js` - 5 tests

---

## Manual Verification

Run the dev server:
```bash
npm run dev
```

### Test Cases

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | Start app | See lesson menu (not FlipCard) | ✅ Passed |
| 2 | Check sound cards | 4 sounds displayed: aa, ee, oo, uu | ✅ Passed |
| 3 | Check IPA notation | Each sound shows correct IPA | ✅ Passed |
| 4 | Check initial lock state | All Beginner unlocked, all Advanced locked | ✅ Passed |
| 5 | Click locked Advanced | Toast message appears, no navigation | ✅ Passed |
| 6 | Click "aa Beginner" | Navigate to practice view with back button | ✅ Passed |
| 7 | Click "Start Quiz" | Navigate to quiz view | ✅ Passed |
| 8 | Complete quiz (80%+) | Lesson marked complete, points added | ✅ Passed |
| 9 | Return to menu | "aa Beginner" shows checkmark | ✅ Passed |
| 10 | Check "aa Advanced" | Now unlocked (not locked) | ✅ Passed |
| 11 | Refresh browser | Progress persists (checkmark still there) | ✅ Passed |
| 12 | Check progress bar | Shows correct percentage (1/8 = 12.5% → 13%) | ✅ Passed |
| 13 | Check points display | Points accumulated correctly | ✅ Passed |

### Visual Verification

| # | Check | Status |
|---|-------|--------|
| 1 | Responsive layout (mobile viewport) | ✅ Passed |
| 2 | Responsive layout (tablet viewport) | ✅ Passed |
| 3 | Locked states visually distinct (gray + lock icon) | ✅ Passed |
| 4 | Completed states visually distinct (green + checkmark) | ✅ Passed |
| 5 | Progress bar animates on completion | ✅ Passed |
| 6 | Hover states on buttons | ✅ Passed |
| 7 | Focus states for keyboard navigation | ✅ Passed |

---

## Design Decisions

### Sound Card Layout
```
┌─────────────────┐
│       aa        │  ← Sound (large, bold)
│      [aː]       │  ← IPA (smaller)
│                 │
│ [Beginner ✓]    │  ← Level buttons
│ [Advanced 🔒]   │
└─────────────────┘
```

### Locked State
- Gray background with lock icon
- Toast message: "Complete Beginner to unlock"
- `aria-disabled="true"` for accessibility

### Progress Card
```
┌─────────────────────────────────────┐
│  ✓ Tu Progreso                      │
│  ▓▓▓▓▓▓░░░░░░  25%                 │
│  2 of 8 lecciones completadas       │
└─────────────────────────────────────┘
```

---

## Accessibility

- [x] Sound cards are `role="group"` with `aria-labelledby`
- [x] Level buttons have `aria-disabled="true"` when locked
- [x] Progress bar has `role="progressbar"` with `aria-valuenow`
- [x] Focus visible on all interactive elements
- [ ] Keyboard navigation testing (Tab through cards, Enter/Space to select)

---

## Future Enhancements (Not in Scope)

- Badge system for achievements
- Sound preview on hover
- Lesson difficulty indicators
- Time estimates per lesson
- Recently practiced section

---

## Troubleshooting

### Reset Progress (for testing)
Open browser console and run:
```javascript
localStorage.removeItem('flipcards_completed_lessons');
localStorage.removeItem('flipcards_total_points');
location.reload();
```

### Check Current State
```javascript
// In browser console
JSON.parse(localStorage.getItem('flipcards_completed_lessons'));
localStorage.getItem('flipcards_total_points');
```
