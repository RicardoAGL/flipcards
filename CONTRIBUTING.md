# Contributing to Dutch Pronunciation Flip Cards

Thank you for your interest in contributing to this project. This document provides guidelines and instructions for contributing.

## Table of Contents

- [Development Setup](#development-setup)
- [Branch Naming Conventions](#branch-naming-conventions)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Requirements](#testing-requirements)
- [Commit Message Format](#commit-message-format)

## Development Setup

### Prerequisites

- Node.js 20.x or later
- npm 10.x or later
- Git

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/flipcards.git
   cd flipcards
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

4. **Run tests**
   ```bash
   npm test
   ```

5. **Build for production**
   ```bash
   npm run build
   npm run preview  # Preview the production build locally
   ```

### IDE Setup

We recommend using VS Code with the following extensions:
- ESLint
- Prettier (if using)
- EditorConfig

## Branch Naming Conventions

Use the following prefixes for branch names:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feature/` | New features | `feature/quiz-mode` |
| `fix/` | Bug fixes | `fix/tts-ios-safari` |
| `enhance/` | Improvements to existing features | `enhance/card-animations` |
| `refactor/` | Code refactoring (no functional change) | `refactor/state-management` |
| `docs/` | Documentation updates | `docs/api-reference` |
| `test/` | Test additions or updates | `test/quiz-coverage` |
| `chore/` | Build, CI, dependencies | `chore/update-dependencies` |
| `content/` | Lesson content updates | `content/phase1-uu-words` |

### Branch Name Format

```
<prefix>/<short-description>
```

- Use lowercase letters
- Use hyphens to separate words
- Keep descriptions concise but descriptive
- Include issue number if applicable: `feature/123-quiz-mode`

## Pull Request Process

1. **Create a feature branch** from `main`
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the code style guidelines

3. **Write or update tests** for your changes

4. **Run the full test suite** to ensure nothing is broken
   ```bash
   npm run lint
   npm run typecheck
   npm test
   npm run build
   ```

5. **Commit your changes** following the commit message format

6. **Push your branch** and create a Pull Request
   ```bash
   git push -u origin feature/your-feature-name
   ```

7. **Fill out the PR template** completely

8. **Address review feedback** by pushing additional commits

9. **Once approved**, the PR will be merged by a maintainer

### PR Requirements

- All CI checks must pass
- At least one approval from a maintainer
- No merge conflicts with `main`
- PR description clearly explains the changes

## Code Style Guidelines

### General Principles

- Write clear, self-documenting code
- Prefer readability over cleverness
- Keep functions small and focused
- Use meaningful variable and function names

### JavaScript/TypeScript

- Use ES6+ features (const/let, arrow functions, destructuring)
- Prefer `const` over `let` when the variable is not reassigned
- Use template literals for string interpolation
- Use async/await over raw Promises when possible

### CSS

- Use CSS custom properties (variables) for theming
- Follow mobile-first responsive design
- Use semantic class names
- Keep specificity low (avoid !important)

### HTML

- Use semantic HTML elements
- Include proper ARIA attributes for accessibility
- Ensure all interactive elements are keyboard accessible

### File Organization

```
src/
  components/     # Reusable UI components
  data/          # Static data (lessons, translations)
  styles/        # Global styles and CSS variables
  utils/         # Utility functions
  main.js        # Application entry point
public/          # Static assets (images, fonts)
tests/           # Test files
```

## Testing Requirements

### Test Coverage

- All new features must include tests
- Bug fixes should include regression tests
- Aim for meaningful coverage, not just high percentages

### Test Types

1. **Unit Tests** - Test individual functions and utilities
2. **Component Tests** - Test UI components in isolation
3. **Integration Tests** - Test feature workflows

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Commit Message Format

Follow conventional commit format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, no logic change) |
| `refactor` | Code refactoring |
| `test` | Adding or updating tests |
| `chore` | Build, CI, dependencies |
| `perf` | Performance improvements |

### Examples

```
feat(quiz): add multiple choice question display

fix(tts): handle missing Dutch voice on iOS Safari

docs(readme): add development setup instructions

chore(deps): update vite to v5.0.0
```

### Rules

- Subject line: max 72 characters, imperative mood ("add" not "added")
- Body: explain what and why, not how
- Footer: reference issues with "Fixes #123" or "Closes #123"

## Questions?

If you have questions about contributing, please open an issue for discussion.

---

Thank you for contributing to Dutch Pronunciation Flip Cards!
