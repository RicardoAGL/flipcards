# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dutch Pronunciation Flip Cards - Interactive learning app for Dutch vowel pronunciation designed for Spanish speakers. Uses vanilla JavaScript with JSDoc types (checked via TypeScript's `--noEmit`).

## Commands

```bash
npm run dev          # Start dev server (localhost:5173, auto-opens)
npm run build        # Production build
npm run lint         # ESLint (strict, max-warnings 0)
npm run lint:fix     # Auto-fix ESLint violations
npm run typecheck    # TypeScript type checking (noEmit)
npm test             # Run tests (Vitest)
npm run test:watch   # Tests in watch mode
```

## Architecture

### Component Pattern
All components use a factory function pattern that returns an object with methods:
- `FlipCard.js` - 3-section flip card (prefix | sound | suffix), integrates Web Speech API for TTS
- `Quiz.js` - Multiple choice quiz with progress dots and scoring
- `QuizResults.js` - Score display with breakdown

Components return APIs like `{destroy, mount, getState, ...}` for lifecycle management.

### Data Layer
- **Lesson schema** (`src/data/schema.js`): JSDoc types with validators (`validateLesson()`, `validateWord()`)
- **Lessons** (`src/data/lessons/`): JSON files named `P[phase]-[SOUND]-[LEVEL]` (e.g., `P1-AA-BEG`)
- **Lesson index** (`src/data/lessons/index.js`): Exports `lessonsById`, `lessonOrder`, `lessonsBySound`

### Utilities
- `src/lib/tts.js` - Web Speech Synthesis wrapper for Dutch pronunciation
- `src/lib/quizHelpers.js` - Quiz generation with distractor selection strategy
- `src/lib/lessonLoader.js` - Lesson querying and navigation

### Styling
CSS custom properties in `src/styles/main.css` define design tokens (colors, spacing, animations). Components use BEM-inspired naming.

### Path Alias
`@` maps to `src/` (configured in vite.config.js and tsconfig.json)

## Code Style

- Conventional commits: `feat(scope): message`, `fix(scope): message`
- Branch naming: `feature/`, `fix/`, `enhance/`, `refactor/`, `docs/`, `test/`, `chore/`, `content/`
- ESLint enforces: const/let only, semicolons, single quotes, template literals, strict equality
- No `console.log` (warns on other console methods)

## CI/CD

GitHub Actions runs on PRs: lint → typecheck → test → build. Merges to main auto-deploy to GitHub Pages.
