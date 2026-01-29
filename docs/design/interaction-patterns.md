# Interaction Patterns
## Dutch Pronunciation Learning App - Flip Cards

**Document Version:** 1.0
**Date:** 2026-01-29
**Status:** Design Specification

---

## 1. Overview

This document specifies all micro-interactions, animations, and gesture patterns for the Dutch pronunciation learning app. Each interaction is designed to provide immediate, delightful feedback while maintaining performance and accessibility.

### 1.1 Interaction Principles

1. **Immediate Response** - Every interaction should respond within 100ms
2. **Purposeful Motion** - Animations guide attention and communicate state
3. **Consistent Timing** - Similar interactions use similar durations
4. **Interruptible** - Animations can be cancelled by user action
5. **Accessible** - Respect reduced motion preferences

---

## 2. Card Flip Interactions

### 2.1 Prefix/Suffix Card Flip

**Trigger:** Tap or click on prefix/suffix card

**Animation Sequence:**
```
Timeline: 0ms ─────────────────────────────────── 300ms

Phase 1: Press feedback (0-50ms)
├── Scale: 1.0 → 0.98
├── Shadow: shadow-card → shadow-card-pressed
└── Easing: ease-out

Phase 2: Flip out (50-175ms)
├── Transform: rotateY(0deg) → rotateY(90deg)
├── Content: Current letter fades at 90deg
└── Easing: ease-in

Phase 3: Flip in (175-300ms)
├── Transform: rotateY(90deg) → rotateY(180deg)
├── Content: New letter fades in at 90deg
├── Scale: 0.98 → 1.0
└── Easing: ease-out
```

**CSS Implementation:**
```css
.prefix-card {
  transform-style: preserve-3d;
  transition: transform 300ms ease-in-out;
}

.prefix-card.flipping {
  transform: rotateY(180deg);
}

.prefix-card .front,
.prefix-card .back {
  backface-visibility: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
}

.prefix-card .back {
  transform: rotateY(180deg);
}
```

**Haptic Feedback (iOS):**
- Tap: Light impact
- Flip complete: Light impact

**Sound (Optional):**
- Soft "whoosh" on flip (disabled by default)

---

### 2.2 Center Card Flip (Main Sound)

**Trigger:** Tap or click on center sound card

**Animation Sequence:**
```
Timeline: 0ms ─────────────────────────────────── 400ms

Phase 1: Lift & prepare (0-100ms)
├── Scale: 1.0 → 1.02
├── Shadow: shadow-card-elevated → shadow-2xl
├── Border glow: primary-500 glow appears
└── Easing: ease-out

Phase 2: 3D Flip (100-350ms)
├── Transform: rotateY(0deg) → rotateY(180deg)
├── Perspective: 1000px (parent)
├── Content swap at 175ms (90deg point)
└── Easing: ease-in-out

Phase 3: Settle (350-400ms)
├── Scale: 1.02 → 1.0
├── Shadow: shadow-2xl → shadow-card-elevated
└── Easing: ease-out
```

**CSS Implementation:**
```css
.center-card-container {
  perspective: 1000px;
}

.center-card {
  transform-style: preserve-3d;
  transition:
    transform 300ms ease-in-out,
    box-shadow 150ms ease-out;
}

.center-card:active {
  transform: scale(0.98);
}

.center-card.flipped {
  transform: rotateY(180deg);
}

.center-card.lifting {
  transform: scale(1.02);
  box-shadow: var(--shadow-2xl);
}
```

**Front to Back Content:**
```
FRONT                          BACK
┌─────────────────┐           ┌─────────────────┐
│                 │           │                 │
│       aa        │    →→→    │      [aː]       │
│                 │           │                 │
│    ↻ tap        │           │  "Description"  │
│                 │           │  [🔊 Pronounce] │
└─────────────────┘           └─────────────────┘
```

---

### 2.3 Swipe Gesture (Mobile Alternative)

**Trigger:** Horizontal swipe on card

**Detection:**
```javascript
const SWIPE_THRESHOLD = 50; // pixels
const SWIPE_VELOCITY = 0.3; // pixels/ms

onTouchMove: track deltaX, deltaY
onTouchEnd:
  - if |deltaX| > SWIPE_THRESHOLD && velocity > SWIPE_VELOCITY
  - if |deltaX| > |deltaY| (horizontal bias)
  - then trigger flip
```

**Visual Feedback:**
```
Swipe Progress: 0% ──────────────────── 100%

0-30%: Card follows finger with slight rotation
├── Transform: translateX(deltaX * 0.3)
├── Rotation: rotateY(deltaX * 0.1deg)
└── Opacity: 1.0

30-100%: Commit to flip
├── Snap animation to complete flip
└── Spring easing for natural feel
```

**Cancel Behavior:**
- If swipe released before 30%, spring back to original position
- Duration: 200ms, ease-bounce

---

## 3. Button Interactions

### 3.1 Primary Button

**States & Transitions:**
```
DEFAULT → HOVER → ACTIVE → LOADING → SUCCESS/ERROR

Default State:
├── Background: primary-500
├── Shadow: shadow-sm
└── Transform: scale(1)

Hover State (100ms ease-out):
├── Background: primary-400
├── Shadow: shadow-md
└── Transform: scale(1.02)

Active/Pressed State (50ms):
├── Background: primary-600
├── Shadow: none
└── Transform: scale(0.98)

Loading State:
├── Background: primary-400
├── Content: Replace text with spinner
├── Pointer-events: none
└── Pulse animation on background

Success State (300ms):
├── Background: success-500
├── Icon: Checkmark appears
└── Scale: 1 → 1.1 → 1 (bounce)
```

**CSS Implementation:**
```css
.button-primary {
  transition:
    background-color 100ms ease-out,
    transform 100ms ease-out,
    box-shadow 100ms ease-out;
}

.button-primary:hover {
  background-color: var(--primary-400);
  transform: scale(1.02);
  box-shadow: var(--shadow-md);
}

.button-primary:active {
  background-color: var(--primary-600);
  transform: scale(0.98);
  box-shadow: none;
}

.button-primary.loading {
  pointer-events: none;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

---

### 3.2 Quiz Option Button

**States & Transitions:**
```
DEFAULT → HOVER → SELECTED → CORRECT/INCORRECT → DISABLED

Selection Animation Sequence (after tap):

0ms: User taps option
├── Transform: scale(0.98)
├── Border: primary-500
└── Background: primary-100

100ms: Processing indicator
├── Spinner appears in button
└── Other options disable

500ms: Result revealed
├── IF CORRECT:
│   ├── Background: success-100 → success-200 (pulse)
│   ├── Border: success-500
│   ├── Checkmark icon slides in from left
│   └── "+20" floats up from button
├── IF INCORRECT:
│   ├── Background: error-100
│   ├── Border: error-500
│   ├── X icon appears
│   └── Correct answer highlights (green pulse)
```

**Correct Answer Animation:**
```css
@keyframes correctPulse {
  0% {
    background-color: var(--success-100);
    transform: scale(1);
  }
  50% {
    background-color: var(--success-200);
    transform: scale(1.02);
  }
  100% {
    background-color: var(--success-100);
    transform: scale(1);
  }
}

.quiz-option.correct {
  animation: correctPulse 600ms ease-in-out;
}
```

**Incorrect Selection Animation:**
```css
@keyframes incorrectShake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
}

.quiz-option.incorrect {
  animation: incorrectShake 400ms ease-out;
}
```

---

### 3.3 Pronounce Button (TTS)

**States & Transitions:**
```
DEFAULT → PRESSED → PLAYING → COMPLETE

Default:
├── Icon: Speaker outline
├── Background: primary-500
└── Label: "Pronunciar" / "Pronounce"

Pressed (immediate):
├── Scale: 0.95
└── Background: primary-600

Playing:
├── Icon: Animated sound waves
├── Background: primary-400
├── Pulse animation
└── Label: "Playing..." (optional)

Complete (300ms):
├── Return to default
└── Brief checkmark flash (optional)
```

**Sound Wave Animation:**
```css
@keyframes soundWave {
  0% {
    transform: scaleY(0.5);
    opacity: 0.5;
  }
  50% {
    transform: scaleY(1);
    opacity: 1;
  }
  100% {
    transform: scaleY(0.5);
    opacity: 0.5;
  }
}

.sound-wave-bar {
  animation: soundWave 0.5s ease-in-out infinite;
}

.sound-wave-bar:nth-child(2) {
  animation-delay: 0.1s;
}

.sound-wave-bar:nth-child(3) {
  animation-delay: 0.2s;
}
```

**Disabled State (no Dutch voice):**
```
├── Background: gray-200
├── Icon: Speaker with X
├── Cursor: not-allowed
├── Tooltip on hover: "Dutch voice not available"
└── No animation
```

---

## 4. Points & Score Animations

### 4.1 Points Earned Animation (+20)

**Trigger:** Correct quiz answer

**Animation Sequence:**
```
Timeline: 0ms ─────────────────────────────────── 800ms

Phase 1: Appear (0-100ms)
├── "+20" text spawns at button center
├── Scale: 0 → 1.2
├── Opacity: 0 → 1
├── Color: primary-500
└── Easing: ease-out

Phase 2: Float up (100-600ms)
├── Transform: translateY(0) → translateY(-40px)
├── Opacity: 1 → 0.8
└── Easing: linear

Phase 3: Fade out (600-800ms)
├── Opacity: 0.8 → 0
├── Transform: continue upward
└── Easing: ease-in
```

**CSS Implementation:**
```css
@keyframes pointsFloat {
  0% {
    transform: translateY(0) scale(0);
    opacity: 0;
  }
  15% {
    transform: translateY(0) scale(1.2);
    opacity: 1;
  }
  25% {
    transform: translateY(-5px) scale(1);
  }
  80% {
    transform: translateY(-40px);
    opacity: 0.8;
  }
  100% {
    transform: translateY(-60px);
    opacity: 0;
  }
}

.points-earned {
  position: absolute;
  animation: pointsFloat 800ms ease-out forwards;
  font-weight: 700;
  font-size: 24px;
  color: var(--primary-500);
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

---

### 4.2 Header Points Counter Update

**Trigger:** Points added to total

**Animation Sequence:**
```
Timeline: 0ms ─────────────────────────────────── 600ms

Phase 1: Highlight (0-100ms)
├── Background: primary-50 → primary-100
├── Scale: 1 → 1.1
└── Easing: ease-out

Phase 2: Count up (100-400ms)
├── Number increments from old → new value
├── Duration scaled by difference (20pts = 200ms, 100pts = 400ms)
└── Easing: ease-out

Phase 3: Settle (400-600ms)
├── Scale: 1.1 → 1.0
├── Background: primary-100 → primary-50
└── Easing: ease-out
```

**JavaScript Counter:**
```javascript
function animateCounter(element, start, end, duration) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

    const current = Math.round(start + (end - start) * eased);
    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}
```

---

### 4.3 Perfect Score Bonus Animation

**Trigger:** 5/5 correct on quiz

**Animation Sequence:**
```
Timeline: 0ms ────────────────────────────────── 1500ms

Phase 1: Score reveal (0-300ms)
├── "5/5" scales up with bounce
├── Gold color tint
└── Sparkle particles appear

Phase 2: Bonus announcement (300-800ms)
├── "+50 BONUS!" text drops in
├── Golden burst effect
├── Sound: Victory chime (optional)
└── Confetti particles (subtle)

Phase 3: Combine with total (800-1500ms)
├── Bonus text floats to header
├── Counter does extended count-up
└── Header pulses gold briefly
```

---

## 5. Progress Indicators

### 5.1 Progress Bar Animation

**Trigger:** Word seen or quiz question answered

**Animation:**
```css
.progress-bar-fill {
  transition: width 400ms ease-out;
  background: linear-gradient(
    90deg,
    var(--success-400) 0%,
    var(--success-500) 50%,
    var(--success-400) 100%
  );
  background-size: 200% 100%;
  animation: progressShimmer 2s ease-in-out infinite;
}

@keyframes progressShimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

**Milestone Pulse (25%, 50%, 75%, 100%):**
```css
@keyframes milestonePulse {
  0% { box-shadow: 0 0 0 0 var(--success-300); }
  70% { box-shadow: 0 0 0 8px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}

.progress-bar.milestone {
  animation: milestonePulse 600ms ease-out;
}
```

---

### 5.2 Quiz Progress Dots

**Transition Between Questions:**
```
○ ○ ○ ○ ○  →  ● ○ ○ ○ ○  →  ● ● ○ ○ ○

Animation per dot:
├── Scale: 1 → 1.3 → 1
├── Fill: transparent → success-500 (correct) or error-500 (wrong)
├── Duration: 300ms
└── Easing: ease-bounce
```

**CSS Implementation:**
```css
.progress-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--gray-300);
  background: transparent;
  transition: all 300ms var(--ease-bounce);
}

.progress-dot.correct {
  border-color: var(--success-500);
  background: var(--success-500);
  transform: scale(1);
  animation: dotPop 300ms ease-out;
}

.progress-dot.incorrect {
  border-color: var(--error-400);
  background: var(--error-400);
}

@keyframes dotPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
```

---

## 6. Celebration Animations

### 6.1 Lesson Complete Celebration

**Trigger:** Pass quiz with 80%+

**Animation Sequence:**
```
Timeline: 0ms ────────────────────────────────── 2000ms

Phase 1: Screen transition (0-300ms)
├── Content fades to overlay
├── Dimmed background appears
└── Easing: ease-out

Phase 2: Trophy/Checkmark entrance (300-700ms)
├── Large checkmark or trophy icon
├── Scale: 0 → 1.2 → 1
├── Rotation: -10deg → 0deg
├── Bounce easing
└── Confetti particles spawn

Phase 3: Text entrance (700-1000ms)
├── "Lesson Complete!" text
├── Slide up + fade in
├── Stagger: 50ms between elements
└── Points summary fades in

Phase 4: Confetti (1000-2000ms)
├── Multiple colored particles
├── Fall with slight drift
├── Fade out at bottom
└── Duration: 1-2 seconds
```

**Confetti Implementation:**
```javascript
function createConfetti(count = 50) {
  const colors = ['#F97316', '#22C55E', '#3B82F6', '#A855F7', '#FBBF24'];
  const container = document.getElementById('confetti-container');

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';
    particle.style.cssText = `
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay: ${Math.random() * 500}ms;
      animation-duration: ${1000 + Math.random() * 1000}ms;
    `;
    container.appendChild(particle);

    setTimeout(() => particle.remove(), 2000);
  }
}
```

```css
.confetti-particle {
  position: absolute;
  top: -10px;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  animation: confettiFall linear forwards;
}

@keyframes confettiFall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}
```

---

### 6.2 Badge Unlock Animation

**Trigger:** Achievement criteria met

**Animation Sequence:**
```
Timeline: 0ms ────────────────────────────────── 2500ms

Phase 1: Overlay appears (0-200ms)
├── Background dims
├── Content pauses
└── Focus shifts to modal

Phase 2: Badge reveal (200-800ms)
├── Badge icon starts small (scale 0)
├── Glow ring expands from center
├── Scale: 0 → 1.3 → 1 (bounce)
├── Sparkle particles around badge
└── Sound: Achievement unlock

Phase 3: Badge details (800-1200ms)
├── Badge name slides up
├── Description fades in
├── Stagger timing: 100ms
└── Soft glow pulses on badge

Phase 4: Interaction ready (1200-2500ms)
├── "Awesome!" button fades in
├── Dismiss on tap or auto-dismiss after 3s
└── Badge slides to collection (optional)
```

**Badge Glow Animation:**
```css
@keyframes badgeGlow {
  0% {
    box-shadow: 0 0 0 0 var(--accent-300);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 30px 10px var(--accent-200);
    transform: scale(1.05);
  }
  100% {
    box-shadow: 0 0 20px 5px var(--accent-300);
    transform: scale(1);
  }
}

.badge-unlock {
  animation: badgeGlow 1.5s ease-in-out infinite;
}
```

---

## 7. Loading States

### 7.1 Initial App Load

**Animation:**
```
Logo pulse + progress indicator

┌─────────────────────────────────────┐
│                                     │
│              🇳🇱                   │  <- Pulse animation
│           Flip Cards                │
│                                     │
│            ● ○ ○                   │  <- Bouncing dots
│                                     │
└─────────────────────────────────────┘
```

**CSS Implementation:**
```css
@keyframes logoPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}

@keyframes loadingDots {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

.loading-dot:nth-child(1) { animation-delay: 0ms; }
.loading-dot:nth-child(2) { animation-delay: 150ms; }
.loading-dot:nth-child(3) { animation-delay: 300ms; }
```

---

### 7.2 Button Loading Spinner

**Animation:**
```css
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.button-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 800ms linear infinite;
}
```

---

### 7.3 Skeleton Loading (Content)

**Animation:**
```css
@keyframes skeletonShimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--gray-200) 25%,
    var(--gray-100) 50%,
    var(--gray-200) 75%
  );
  background-size: 200% 100%;
  animation: skeletonShimmer 1.5s ease-in-out infinite;
  border-radius: var(--rounded-md);
}
```

---

## 8. Transition Patterns

### 8.1 Screen Transitions

**Navigation (Push):**
```
Current screen slides left, new screen slides in from right

Duration: 300ms
Easing: ease-in-out

Current Screen:
├── Transform: translateX(0) → translateX(-30%)
├── Opacity: 1 → 0.5
└── Scale: 1 → 0.95

New Screen:
├── Transform: translateX(100%) → translateX(0)
├── Opacity: 0 → 1
└── Scale: 0.95 → 1
```

**Navigation (Pop/Back):**
```
Reverse of push - current slides right, previous slides in from left

Duration: 250ms (slightly faster for back)
Easing: ease-out
```

---

### 8.2 Modal Transitions

**Open:**
```
Timeline: 0ms ─────────────────────────────────── 300ms

Overlay:
├── Opacity: 0 → 1
└── Background: transparent → rgba(0,0,0,0.5)

Modal Content:
├── Transform: translateY(20px) scale(0.95) → translateY(0) scale(1)
├── Opacity: 0 → 1
└── Easing: ease-out
```

**Close:**
```
Timeline: 0ms ─────────────────────────────────── 200ms

Reverse of open with faster timing
Easing: ease-in
```

---

### 8.3 Content Transitions

**List Item Stagger:**
```css
.list-item {
  opacity: 0;
  transform: translateY(10px);
  animation: fadeSlideIn 300ms ease-out forwards;
}

.list-item:nth-child(1) { animation-delay: 0ms; }
.list-item:nth-child(2) { animation-delay: 50ms; }
.list-item:nth-child(3) { animation-delay: 100ms; }
/* ... continue pattern */

@keyframes fadeSlideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 9. Micro-Interactions

### 9.1 Toggle Switch (Language)

**Animation:**
```
┌─────────────────────────────────────┐
│  🇪🇸 ES  ●─────────○  EN 🇬🇧        │  <- Before
│  🇪🇸 ES  ○─────────●  EN 🇬🇧        │  <- After
└─────────────────────────────────────┘

Thumb movement:
├── Transform: translateX(0) → translateX(24px)
├── Duration: 200ms
├── Easing: ease-bounce
└── Background color transition

Label states:
├── Active: font-weight 600, full opacity
├── Inactive: font-weight 400, 60% opacity
└── Transition: 150ms
```

---

### 9.2 Star Rating Animation

**On Fill (Mastery Progress):**
```
Each star fills in sequence:

Star animation:
├── Scale: 1 → 1.3 → 1
├── Fill: transparent → gold
├── Rotation: -10deg → 0deg
├── Duration: 300ms per star
├── Stagger: 100ms between stars
└── Easing: ease-bounce
```

```css
@keyframes starFill {
  0% {
    transform: scale(1) rotate(-10deg);
    color: var(--gray-300);
  }
  50% {
    transform: scale(1.3) rotate(5deg);
    color: var(--warning-400);
  }
  100% {
    transform: scale(1) rotate(0deg);
    color: var(--warning-500);
  }
}
```

---

### 9.3 Difficulty Marking (Got it / Need practice)

**Button Selection:**
```
┌───────────────┐  ┌───────────────┐
│  👍 Got it!  │  │ 🤔 Practice  │
└───────────────┘  └───────────────┘

On tap:
├── Scale: 1 → 0.95 → 1
├── Background: white → selection color
├── Icon: subtle bounce
├── Haptic: light tap
└── Toast notification (optional)
```

**CSS Implementation:**
```css
.difficulty-button:active {
  transform: scale(0.95);
}

.difficulty-button.selected {
  background: var(--primary-100);
  border-color: var(--primary-500);
}

.difficulty-button.selected .icon {
  animation: iconBounce 300ms ease-out;
}

@keyframes iconBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
```

---

## 10. Error & Warning States

### 10.1 TTS Error Feedback

**Animation:**
```
Button shake + tooltip appearance

Button:
├── Animation: shake (translateX -4px, 4px alternating)
├── Duration: 400ms
├── Background: gray-200
└── Icon: speaker with X

Tooltip/Modal:
├── Fade in from button position
├── Duration: 200ms
└── Auto-dismiss after 5s or on tap
```

---

### 10.2 Form Validation Error

**Animation:**
```
Input field:
├── Border: gray-200 → error-500
├── Shake animation (subtle)
├── Error icon appears
└── Error message slides down

Duration: 300ms
```

---

## 11. Reduced Motion Support

### 11.1 Respecting User Preferences

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* Keep essential feedback */
  .button:active {
    transform: scale(0.98);
  }

  /* Disable parallax and complex animations */
  .confetti-particle,
  .sparkle-effect {
    display: none;
  }
}
```

### 11.2 Alternative Feedback

When motion is reduced:
- Use color changes instead of animations
- Instant state changes
- Maintain haptic feedback (iOS)
- Clear visual indicators for state

---

## 12. Performance Guidelines

### 12.1 Animation Performance

**Preferred Properties (Compositor-only):**
- `transform`
- `opacity`

**Avoid Animating:**
- `width`, `height`
- `top`, `left`, `right`, `bottom`
- `margin`, `padding`
- `border-radius` (during animation)

### 12.2 will-change Usage

```css
/* Apply only when needed */
.card-flipping {
  will-change: transform;
}

/* Remove after animation */
.card-flipping.complete {
  will-change: auto;
}
```

### 12.3 Frame Budget

Target: 60fps (16.67ms per frame)

| Animation Type | Target | Actual Budget |
|----------------|--------|---------------|
| Button press | <100ms response | <16ms |
| Card flip | 300ms total | 16ms per frame |
| Page transition | 300ms total | 16ms per frame |
| Celebration | 2000ms total | Can drop to 30fps |

---

## Document Control

**Version History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-29 | UI/UX Designer | Initial interaction patterns documentation |

**Related Documents:**
- `/docs/design/wireframes.md` - Screen layouts
- `/docs/design/design-system.md` - Visual specifications
- `/docs/design/user-flows.md` - User journey maps

---

## Appendix: Animation Timing Cheat Sheet

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Button press feedback | 50ms | ease-out |
| Button hover | 100ms | ease-out |
| Card flip | 300ms | ease-in-out |
| Modal open | 300ms | ease-out |
| Modal close | 200ms | ease-in |
| Page transition | 300ms | ease-in-out |
| Progress bar | 400ms | ease-out |
| Points counter | 400ms | ease-out |
| Confetti fall | 1-2s | linear |
| Badge unlock | 2.5s | (compound) |
| Skeleton shimmer | 1.5s | ease-in-out infinite |
| Loading spinner | 800ms | linear infinite |
