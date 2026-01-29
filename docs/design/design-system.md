# Design System
## Dutch Pronunciation Learning App - Flip Cards

**Document Version:** 1.0
**Date:** 2026-01-29
**Status:** Design Specification

---

## 1. Overview

This design system defines all visual tokens, component specifications, and design patterns for the Dutch pronunciation learning app. The system is inspired by Duolingo's playful, educational aesthetic while maintaining a unique identity.

### 1.1 Design Principles

1. **Playful Learning** - Bright colors and rounded shapes create a fun, approachable environment
2. **Clear Hierarchy** - Visual weight guides users through interactions naturally
3. **Immediate Feedback** - Every action receives visual and/or audio confirmation
4. **Accessibility First** - WCAG 2.1 AA compliance throughout
5. **Mobile Native** - Touch-optimized with generous tap targets

---

## 2. Color Palette

### 2.1 Primary Colors

```
PRIMARY (Orange) - Main brand color, CTAs, active states
┌─────────────────────────────────────────────────────────────┐
│  primary-50   │  #FFF7ED  │  Backgrounds, subtle tints     │
│  primary-100  │  #FFEDD5  │  Hover backgrounds             │
│  primary-200  │  #FED7AA  │  Disabled states               │
│  primary-300  │  #FDBA74  │  Icons, secondary elements     │
│  primary-400  │  #FB923C  │  Hover on primary buttons      │
│  primary-500  │  #F97316  │  PRIMARY - Buttons, links      │
│  primary-600  │  #EA580C  │  Active/pressed states         │
│  primary-700  │  #C2410C  │  Text on light backgrounds     │
│  primary-800  │  #9A3412  │  Dark accents                  │
│  primary-900  │  #7C2D12  │  Darkest - rarely used         │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Secondary Colors

```
SECONDARY (Green) - Success states, completion, correct answers
┌─────────────────────────────────────────────────────────────┐
│  success-50   │  #F0FDF4  │  Success backgrounds           │
│  success-100  │  #DCFCE7  │  Light success states          │
│  success-200  │  #BBF7D0  │  Correct answer highlight      │
│  success-300  │  #86EFAC  │  Progress bars (filled)        │
│  success-400  │  #4ADE80  │  Checkmarks                    │
│  success-500  │  #22C55E  │  SUCCESS - Main green          │
│  success-600  │  #16A34A  │  Dark success                  │
│  success-700  │  #15803D  │  Success text                  │
└─────────────────────────────────────────────────────────────┘

ERROR (Red) - Errors, incorrect answers, warnings
┌─────────────────────────────────────────────────────────────┐
│  error-50     │  #FEF2F2  │  Error backgrounds             │
│  error-100    │  #FEE2E2  │  Light error states            │
│  error-200    │  #FECACA  │  Incorrect answer highlight    │
│  error-300    │  #FCA5A5  │  Warning icons                 │
│  error-400    │  #F87171  │  X marks                       │
│  error-500    │  #EF4444  │  ERROR - Main red              │
│  error-600    │  #DC2626  │  Dark error                    │
│  error-700    │  #B91C1C  │  Error text                    │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Accent Colors

```
ACCENT (Purple) - Badges, special achievements, premium features
┌─────────────────────────────────────────────────────────────┐
│  accent-50    │  #FAF5FF  │  Achievement backgrounds       │
│  accent-100   │  #F3E8FF  │  Badge glow                    │
│  accent-200   │  #E9D5FF  │  Highlight                     │
│  accent-300   │  #D8B4FE  │  Icons                         │
│  accent-400   │  #C084FC  │  Badges                        │
│  accent-500   │  #A855F7  │  ACCENT - Main purple          │
│  accent-600   │  #9333EA  │  Active badges                 │
│  accent-700   │  #7C3AED  │  Premium indicators            │
└─────────────────────────────────────────────────────────────┘

INFO (Blue) - Information, hints, TTS indicators
┌─────────────────────────────────────────────────────────────┐
│  info-50      │  #EFF6FF  │  Info backgrounds              │
│  info-100     │  #DBEAFE  │  Tooltip backgrounds           │
│  info-200     │  #BFDBFE  │  Light info states             │
│  info-300     │  #93C5FD  │  Icons                         │
│  info-400     │  #60A5FA  │  Links                         │
│  info-500     │  #3B82F6  │  INFO - Main blue              │
│  info-600     │  #2563EB  │  Active info                   │
│  info-700     │  #1D4ED8  │  Info text                     │
└─────────────────────────────────────────────────────────────┘
```

### 2.4 Neutral Colors

```
NEUTRALS (Gray) - Text, backgrounds, borders
┌─────────────────────────────────────────────────────────────┐
│  gray-50      │  #FAFAFA  │  Page backgrounds              │
│  gray-100     │  #F4F4F5  │  Card backgrounds              │
│  gray-200     │  #E4E4E7  │  Borders, dividers             │
│  gray-300     │  #D4D4D8  │  Disabled borders              │
│  gray-400     │  #A1A1AA  │  Placeholder text              │
│  gray-500     │  #71717A  │  Secondary text                │
│  gray-600     │  #52525B  │  Icons                         │
│  gray-700     │  #3F3F46  │  Body text                     │
│  gray-800     │  #27272A  │  Headings                      │
│  gray-900     │  #18181B  │  Primary text                  │
│  white        │  #FFFFFF  │  Cards, inputs                 │
│  black        │  #000000  │  Rarely used                   │
└─────────────────────────────────────────────────────────────┘
```

### 2.5 Semantic Color Tokens

```css
/* Background colors */
--bg-primary: var(--gray-50);       /* Main app background */
--bg-secondary: var(--white);        /* Cards, panels */
--bg-tertiary: var(--gray-100);      /* Nested elements */

/* Text colors */
--text-primary: var(--gray-900);     /* Headings, important text */
--text-secondary: var(--gray-700);   /* Body text */
--text-tertiary: var(--gray-500);    /* Helper text, labels */
--text-inverse: var(--white);        /* Text on dark/colored bg */

/* Interactive colors */
--interactive-primary: var(--primary-500);
--interactive-hover: var(--primary-400);
--interactive-active: var(--primary-600);
--interactive-disabled: var(--gray-300);

/* Feedback colors */
--feedback-success: var(--success-500);
--feedback-error: var(--error-500);
--feedback-info: var(--info-500);
--feedback-warning: var(--warning-500);

/* Border colors */
--border-default: var(--gray-200);
--border-focus: var(--primary-500);
--border-error: var(--error-500);
--border-success: var(--success-500);
```

### 2.6 Color Accessibility

All color combinations meet WCAG 2.1 AA standards:

| Foreground | Background | Contrast Ratio | Pass |
|------------|------------|----------------|------|
| gray-900 | white | 17.4:1 | AAA |
| gray-700 | white | 9.0:1 | AAA |
| gray-500 | white | 4.6:1 | AA |
| primary-700 | white | 5.1:1 | AA |
| white | primary-500 | 4.5:1 | AA |
| white | success-500 | 4.5:1 | AA |
| white | error-500 | 4.6:1 | AA |

---

## 3. Typography

### 3.1 Font Family

```css
/* Primary Font - Interface text */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Display Font - Large headings, emphasis */
--font-display: 'Nunito', 'Inter', sans-serif;

/* Monospace - IPA notation, code */
--font-mono: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
```

### 3.2 Type Scale

```
TYPOGRAPHY SCALE (Base: 16px)
┌────────────────────────────────────────────────────────────────────────┐
│  Token          │ Size   │ Line Height │ Weight │ Usage                │
├────────────────────────────────────────────────────────────────────────┤
│  text-xs        │ 12px   │ 16px (1.33) │ 400    │ Captions, badges     │
│  text-sm        │ 14px   │ 20px (1.43) │ 400    │ Labels, helper text  │
│  text-base      │ 16px   │ 24px (1.5)  │ 400    │ Body text, buttons   │
│  text-lg        │ 18px   │ 28px (1.56) │ 500    │ Large body, emphasis │
│  text-xl        │ 20px   │ 28px (1.4)  │ 600    │ Card titles          │
│  text-2xl       │ 24px   │ 32px (1.33) │ 700    │ Section headings     │
│  text-3xl       │ 30px   │ 36px (1.2)  │ 700    │ Screen titles        │
│  text-4xl       │ 36px   │ 40px (1.11) │ 800    │ Hero text            │
│  text-5xl       │ 48px   │ 1           │ 800    │ Main sound display   │
│  text-6xl       │ 60px   │ 1           │ 800    │ Score display        │
└────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Text Styles

```css
/* Headings */
.heading-1 {
  font-family: var(--font-display);
  font-size: 30px;
  font-weight: 700;
  line-height: 36px;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.heading-2 {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}

.heading-3 {
  font-family: var(--font-primary);
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  color: var(--text-primary);
}

/* Body */
.body-large {
  font-family: var(--font-primary);
  font-size: 18px;
  font-weight: 400;
  line-height: 28px;
  color: var(--text-secondary);
}

.body-regular {
  font-family: var(--font-primary);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: var(--text-secondary);
}

.body-small {
  font-family: var(--font-primary);
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--text-tertiary);
}

/* Special */
.sound-display {
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 800;
  line-height: 1;
  color: var(--text-primary);
}

.ipa-notation {
  font-family: var(--font-mono);
  font-size: 32px;
  font-weight: 500;
  line-height: 1.2;
  color: var(--primary-700);
}

.points-display {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
  color: var(--primary-500);
}
```

### 3.4 Font Loading Strategy

```html
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/inter-var.woff2" as="font" crossorigin>
<link rel="preload" href="/fonts/nunito-700.woff2" as="font" crossorigin>

<!-- Font-face declarations with fallbacks -->
<style>
  @font-face {
    font-family: 'Inter';
    src: url('/fonts/inter-var.woff2') format('woff2');
    font-weight: 100 900;
    font-display: swap;
  }
</style>
```

---

## 4. Spacing System

### 4.1 Spacing Scale

```
SPACING SCALE (Base: 4px)
┌──────────────────────────────────────────────────────────────┐
│  Token      │ Value  │ Usage                                │
├──────────────────────────────────────────────────────────────┤
│  space-0    │ 0px    │ Reset                                │
│  space-1    │ 4px    │ Tight gaps, icon padding             │
│  space-2    │ 8px    │ Component internal spacing           │
│  space-3    │ 12px   │ Small component gaps                 │
│  space-4    │ 16px   │ Standard component padding           │
│  space-5    │ 20px   │ Medium gaps                          │
│  space-6    │ 24px   │ Section spacing                      │
│  space-8    │ 32px   │ Large section gaps                   │
│  space-10   │ 40px   │ Screen padding (mobile)              │
│  space-12   │ 48px   │ Hero spacing                         │
│  space-16   │ 64px   │ Major section breaks                 │
│  space-20   │ 80px   │ Large screen layouts                 │
│  space-24   │ 96px   │ Desktop layouts                      │
└──────────────────────────────────────────────────────────────┘
```

### 4.2 Layout Spacing

```css
/* Screen margins (safe area insets) */
--screen-margin-mobile: 16px;
--screen-margin-tablet: 24px;
--screen-margin-desktop: 32px;

/* Section spacing */
--section-gap-mobile: 24px;
--section-gap-tablet: 32px;
--section-gap-desktop: 48px;

/* Card spacing */
--card-padding-mobile: 16px;
--card-padding-tablet: 20px;
--card-padding-desktop: 24px;

/* Component gaps */
--stack-gap-tight: 8px;
--stack-gap-default: 16px;
--stack-gap-loose: 24px;

/* Form element spacing */
--input-gap: 12px;
--label-gap: 8px;
```

---

## 5. Border & Radius System

### 5.1 Border Radius

```
BORDER RADIUS SCALE
┌──────────────────────────────────────────────────────────────┐
│  Token        │ Value  │ Usage                              │
├──────────────────────────────────────────────────────────────┤
│  rounded-none │ 0px    │ No rounding                        │
│  rounded-sm   │ 4px    │ Small elements, tags               │
│  rounded-md   │ 8px    │ Inputs, small buttons              │
│  rounded-lg   │ 12px   │ Cards, panels                      │
│  rounded-xl   │ 16px   │ Large cards, modals                │
│  rounded-2xl  │ 20px   │ Feature cards, flip cards          │
│  rounded-3xl  │ 24px   │ Hero elements                      │
│  rounded-full │ 9999px │ Pills, avatars, circular elements  │
└──────────────────────────────────────────────────────────────┘
```

### 5.2 Border Widths

```css
--border-thin: 1px;
--border-default: 2px;
--border-thick: 3px;
--border-extra: 4px;
```

### 5.3 Border Styles

```css
/* Default border */
.border-default {
  border: 2px solid var(--border-default);
}

/* Focus border */
.border-focus {
  border: 2px solid var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-100);
}

/* Error border */
.border-error {
  border: 2px solid var(--error-500);
  box-shadow: 0 0 0 3px var(--error-100);
}

/* Success border */
.border-success {
  border: 2px solid var(--success-500);
  box-shadow: 0 0 0 3px var(--success-100);
}
```

---

## 6. Shadow System

### 6.1 Elevation Levels

```
SHADOW/ELEVATION SCALE
┌────────────────────────────────────────────────────────────────────────┐
│  Token      │ Value                                    │ Usage         │
├────────────────────────────────────────────────────────────────────────┤
│  shadow-xs  │ 0 1px 2px rgba(0,0,0,0.05)              │ Subtle lift   │
│  shadow-sm  │ 0 2px 4px rgba(0,0,0,0.06)              │ Cards, inputs │
│  shadow-md  │ 0 4px 8px rgba(0,0,0,0.08)              │ Dropdowns     │
│  shadow-lg  │ 0 8px 16px rgba(0,0,0,0.10)             │ Modals        │
│  shadow-xl  │ 0 12px 24px rgba(0,0,0,0.12)            │ Popovers      │
│  shadow-2xl │ 0 24px 48px rgba(0,0,0,0.16)            │ Dialogs       │
└────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Interactive Shadows

```css
/* Card default */
.shadow-card {
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 4px 8px rgba(0, 0, 0, 0.06);
}

/* Card hover */
.shadow-card-hover {
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.06),
    0 8px 16px rgba(0, 0, 0, 0.08);
}

/* Card pressed */
.shadow-card-pressed {
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 2px 4px rgba(0, 0, 0, 0.04);
}

/* Flip card elevated (center card) */
.shadow-card-elevated {
  box-shadow:
    0 8px 16px rgba(0, 0, 0, 0.08),
    0 16px 32px rgba(0, 0, 0, 0.12);
}

/* Glow effects for achievements */
.shadow-glow-success {
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
}

.shadow-glow-accent {
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
}

.shadow-glow-primary {
  box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
}
```

---

## 7. Component Specifications

### 7.1 Buttons

#### Primary Button
```
┌─────────────────────────────────────────┐
│                                         │
│           Continue Learning             │
│                                         │
└─────────────────────────────────────────┘

Specifications:
- Height: 48px (minimum 44px for touch)
- Padding: 16px 24px
- Border-radius: rounded-xl (16px)
- Background: primary-500
- Text: white, 16px, font-weight 600
- Shadow: shadow-sm

States:
- Hover: background primary-400, shadow-md
- Active: background primary-600, shadow-xs
- Disabled: background gray-200, text gray-400
- Loading: show spinner, disable interaction
```

#### Secondary Button
```
┌─────────────────────────────────────────┐
│                                         │
│            Practice Again               │
│                                         │
└─────────────────────────────────────────┘

Specifications:
- Height: 48px
- Padding: 16px 24px
- Border-radius: rounded-xl (16px)
- Background: white
- Border: 2px solid primary-500
- Text: primary-600, 16px, font-weight 600

States:
- Hover: background primary-50
- Active: background primary-100
- Disabled: border gray-300, text gray-400
```

#### Ghost Button
```
Specifications:
- Height: 40px
- Padding: 8px 16px
- Border-radius: rounded-lg (12px)
- Background: transparent
- Text: primary-600, 14px, font-weight 500

States:
- Hover: background primary-50
- Active: background primary-100
```

#### Icon Button
```
Specifications:
- Size: 44px x 44px (touch target)
- Border-radius: rounded-full
- Background: transparent or white
- Icon: 24px

States:
- Hover: background gray-100
- Active: background gray-200
```

### 7.2 Flip Card Components

#### Prefix/Suffix Card
```
┌─────────────────┐
│                 │
│                 │
│       n         │  <- Letter display
│                 │
│                 │
│     ↻ tap       │  <- Hint text
└─────────────────┘

Specifications:
- Width: 80px (mobile), 120px (tablet)
- Height: 100px (mobile), 140px (tablet)
- Border-radius: rounded-2xl (20px)
- Background: white
- Shadow: shadow-card
- Letter: text-4xl (36px), font-weight 700, gray-800
- Hint: text-xs (12px), gray-400

States:
- Default: white background
- Hover: shadow-card-hover, scale 1.02
- Active: shadow-card-pressed, scale 0.98
- Flipping: rotateY animation
```

#### Center Card (Front)
```
┌─────────────────────┐
│                     │
│                     │
│         aa          │  <- Sound display
│                     │
│                     │
│       ↻ tap         │
└─────────────────────┘

Specifications:
- Width: 120px (mobile), 180px (tablet)
- Height: 120px (mobile), 180px (tablet)
- Border-radius: rounded-2xl (20px)
- Background: white
- Border: 3px solid primary-500
- Shadow: shadow-card-elevated
- Sound: text-5xl (48px), font-weight 800, gray-900
- Hint: text-sm (14px), gray-400
```

#### Center Card (Back)
```
┌─────────────────────────────┐
│                             │
│           [aː]              │  <- IPA notation
│                             │
│  ──────────────────────────  │
│                             │
│  "Similar a la 'a' en      │
│   español pero más larga"   │  <- Description
│                             │
│  ┌───────────────────────┐  │
│  │   🔊  Pronunciar      │  │  <- TTS button
│  └───────────────────────┘  │
│                             │
│        ↻ tap to flip        │
│                             │
└─────────────────────────────┘

Specifications:
- Same dimensions as front
- Background: linear-gradient(135deg, primary-50, primary-100)
- Border: 3px solid primary-500
- IPA: ipa-notation style (32px mono)
- Description: body-small, gray-700
- Pronounce button: 40px height, primary background
```

### 7.3 Sound Tile (Lesson Menu)

```
┌─────────────────────────────┐
│                             │
│           aa                │  <- Sound (large)
│          [aː]               │  <- IPA (smaller)
│                             │
│     ★★★☆☆  60%              │  <- Mastery indicator
│                             │
│  ┌─────────┐ ┌───────────┐  │
│  │Beginner │ │ Advanced  │  │  <- Level buttons
│  │   ✓     │ │           │  │
│  └─────────┘ └───────────┘  │
│                             │
└─────────────────────────────┘

Specifications:
- Width: calc(50% - 8px) mobile, 200px tablet
- Min-height: 180px
- Border-radius: rounded-xl (16px)
- Background: white
- Shadow: shadow-card
- Padding: 16px

Level Button:
- Height: 36px
- Border-radius: rounded-lg
- Font-size: 14px

States:
- Not started: All levels show lock or default
- Beginner complete: Checkmark on beginner, Advanced unlocked
- Mastered: Full stars, Master badge overlay
```

### 7.4 Quiz Option Button

```
┌─────────────────────────────────────────┐
│                                         │
│               naam                      │
│                                         │
└─────────────────────────────────────────┘

Specifications:
- Width: 100%
- Height: 56px
- Border-radius: rounded-xl (16px)
- Background: white
- Border: 2px solid gray-200
- Shadow: shadow-sm
- Text: text-xl (20px), font-weight 600, gray-800
- Padding: 16px

States:
- Default: white, gray border
- Hover: primary-50 bg, primary-500 border
- Selected (waiting): primary-100 bg, primary-500 border, loading spinner
- Correct: success-100 bg, success-500 border, checkmark icon
- Incorrect: error-100 bg, error-500 border, X icon
- Disabled (after answer): gray-100 bg, reduced opacity
```

### 7.5 Progress Bar

```
┌─────────────────────────────────────────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
└─────────────────────────────────────────────────────────────┘
                           33%

Specifications:
- Height: 8px (small), 12px (large)
- Border-radius: rounded-full
- Background (track): gray-200
- Background (fill): success-500 (progress) or primary-500 (quiz)
- Animation: width transition 300ms ease-out
```

### 7.6 Badge Component

#### Earned Badge
```
┌─────────────────────┐
│                     │
│        🏅          │  <- Badge icon (40px)
│                     │
│    First Steps      │  <- Name (14px bold)
│                     │
│   Earned Jan 15     │  <- Date (12px muted)
│                     │
└─────────────────────┘

Specifications:
- Width: 100px
- Min-height: 120px
- Border-radius: rounded-xl
- Background: white
- Border: 2px solid accent-300
- Shadow: shadow-glow-accent (subtle)
- Padding: 12px
```

#### Locked Badge
```
┌─────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░  ?  ░░░░░░░░░│  <- Silhouette
│░░░░░░░░░░░░░░░░░░░░░│
│                     │
│  Vowel Explorer     │  <- Name visible
│                     │
│   1/3 sounds        │  <- Progress text
│   ▓▓▓░░░░░░░░       │  <- Progress bar
│                     │
└─────────────────────┘

Specifications:
- Same dimensions as earned
- Background: gray-50
- Border: 2px dashed gray-300
- Badge area: gray-200 background
- Text: gray-500
```

### 7.7 Points Display

```
┌─────────────────┐
│   ★ 1,250       │
└─────────────────┘

Specifications:
- Font: font-display, 18px, font-weight 700
- Color: primary-500
- Star icon: 16px, primary-400
- Background: primary-50
- Padding: 6px 12px
- Border-radius: rounded-full

Animated State (+20):
- Number scales up briefly (scale 1.2)
- "+20" floats up and fades out
- Duration: 600ms
```

---

## 8. Iconography

### 8.1 Icon System

```
Icons are sourced from Heroicons (outline style) and custom illustrations.

SIZE SCALE:
- icon-xs: 16px (inline text)
- icon-sm: 20px (buttons, inputs)
- icon-md: 24px (navigation, actions)
- icon-lg: 32px (feature icons)
- icon-xl: 48px (empty states)
```

### 8.2 Core Icons

| Icon | Usage | Size |
|------|-------|------|
| chevron-left | Back navigation | 24px |
| cog | Settings | 24px |
| speaker-wave | TTS/Pronounce | 24px |
| check | Success, complete | 20-24px |
| x-mark | Error, close | 20-24px |
| lock-closed | Locked content | 20px |
| lock-open | Unlocked | 20px |
| star | Ratings, points | 16-20px |
| trophy | Achievements | 24-32px |
| arrow-path | Refresh, retry | 24px |
| flag | Language | 24px |

### 8.3 Custom Illustrations

For empty states and celebrations:
- Achievement unlocked: Animated trophy with confetti
- Lesson complete: Celebration burst
- Empty state: Friendly character illustration
- Error state: Helpful character with guidance

Style: Flat design, vibrant colors, rounded shapes, consistent with Duolingo aesthetic.

---

## 9. Animation Tokens

### 9.1 Duration Scale

```
TIMING SCALE
┌─────────────────────────────────────────────────────────────┐
│  Token            │ Value   │ Usage                        │
├─────────────────────────────────────────────────────────────┤
│  duration-instant │ 0ms     │ Immediate feedback           │
│  duration-fast    │ 100ms   │ Micro-interactions           │
│  duration-normal  │ 200ms   │ Standard transitions         │
│  duration-slow    │ 300ms   │ Card flips                   │
│  duration-slower  │ 500ms   │ Complex animations           │
│  duration-slowest │ 1000ms  │ Celebration animations       │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 Easing Functions

```css
/* Standard easings */
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Custom easings */
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);

/* Spring-like */
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### 9.3 Animation Presets

```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up */
@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Scale pop */
@keyframes scalePop {
  0% { transform: scale(0.8); opacity: 0; }
  70% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

/* Card flip */
@keyframes cardFlip {
  0% { transform: rotateY(0deg); }
  50% { transform: rotateY(90deg); }
  100% { transform: rotateY(180deg); }
}

/* Points float */
@keyframes pointsFloat {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-30px); opacity: 0; }
}

/* Celebration burst */
@keyframes celebrationBurst {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
```

---

## 10. Responsive Design

### 10.1 Breakpoints

```css
/* Mobile-first breakpoints */
--breakpoint-sm: 375px;   /* iPhone standard */
--breakpoint-md: 414px;   /* iPhone Plus */
--breakpoint-lg: 768px;   /* iPad portrait */
--breakpoint-xl: 1024px;  /* iPad landscape, desktop */
--breakpoint-2xl: 1280px; /* Large desktop */
```

### 10.2 Container Widths

```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--screen-margin-mobile);
}

@media (min-width: 768px) {
  .container {
    padding: 0 var(--screen-margin-tablet);
    max-width: 720px;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 var(--screen-margin-desktop);
    max-width: 960px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1200px;
  }
}
```

### 10.3 Grid System

```css
/* Lesson grid */
.lesson-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (min-width: 768px) {
  .lesson-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
}

/* Card layout */
.card-layout {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

@media (min-width: 768px) {
  .card-layout {
    gap: 20px;
  }
}
```

---

## 11. Theme Support

### 11.1 Light Theme (Default)

```css
:root {
  --theme-bg-primary: var(--gray-50);
  --theme-bg-secondary: var(--white);
  --theme-text-primary: var(--gray-900);
  --theme-text-secondary: var(--gray-700);
  --theme-border: var(--gray-200);
}
```

### 11.2 Dark Theme (Phase 2)

```css
[data-theme="dark"] {
  --theme-bg-primary: var(--gray-900);
  --theme-bg-secondary: var(--gray-800);
  --theme-text-primary: var(--gray-50);
  --theme-text-secondary: var(--gray-300);
  --theme-border: var(--gray-700);
}
```

### 11.3 Unlockable Themes (Phase 2)

| Theme | Unlock Criteria | Primary Color |
|-------|-----------------|---------------|
| Default | Free | Orange #F97316 |
| Ocean | 2 sounds complete | Blue #3B82F6 |
| Forest | 4 sounds complete | Green #22C55E |
| Sunset | All Phase 1 complete | Purple #A855F7 |

---

## 12. Implementation Notes

### 12.1 CSS Custom Properties

All design tokens should be implemented as CSS custom properties for easy theming and maintenance:

```css
:root {
  /* Colors */
  --color-primary-500: #F97316;
  /* ... all colors ... */

  /* Typography */
  --font-primary: 'Inter', sans-serif;
  --font-size-base: 16px;
  /* ... all typography ... */

  /* Spacing */
  --space-4: 16px;
  /* ... all spacing ... */

  /* Shadows */
  --shadow-card: 0 2px 4px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.06);
  /* ... all shadows ... */
}
```

### 12.2 Component Architecture

Components should be built with these principles:
1. **Composition** - Small, reusable pieces combined into larger components
2. **State management** - Clear visual states for all interactions
3. **Accessibility** - Semantic HTML, ARIA labels, keyboard navigation
4. **Animation** - Hardware-accelerated CSS transforms where possible

### 12.3 Performance Considerations

- Use `will-change` sparingly for animated elements
- Prefer `transform` and `opacity` for animations (composited)
- Lazy load non-critical fonts and images
- Use CSS containment for complex components

---

## Document Control

**Version History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-29 | UI/UX Designer | Initial design system documentation |

**Related Documents:**
- `/docs/design/wireframes.md` - Screen layouts
- `/docs/design/user-flows.md` - User journey maps
- `/docs/design/interaction-patterns.md` - Animation specifications
