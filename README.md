# DevGrid

Chrome Extension that automatically synchronizes accepted LeetCode submissions to GitHub.

## Phase 0: Foundation Setup

This is the initial foundation setup with minimal configuration.

## Build Commands

```bash
# Install dependencies
npm install

# Build the extension
npm run build

# Run linter
npm run lint

# Format code
npm run format
```

## Loading the Extension

1. Run `npm run build`
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `dist` folder

## Project Structure

```
src/
├── background/          # Background service worker
├── content/             # Content scripts for LeetCode
├── services/
│   ├── leetcode/       # LeetCode GraphQL integration
│   ├── github/         # GitHub API integration
│   └── storage/        # Chrome storage wrapper
├── domain/             # Core domain models
├── shared/             # Shared constants and types
└── utils/              # Utility functions
```

## Technology Stack

- **Language**: TypeScript
- **Build Tool**: Vite
- **Extension**: Chrome Manifest V3
- **Linting**: ESLint
- **Formatting**: Prettier
