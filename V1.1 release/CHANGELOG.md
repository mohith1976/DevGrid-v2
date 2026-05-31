# Changelog

All notable changes to DevGrid will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2024-12-XX

### Added
- **Reset Statistics Feature**: New button in popup to clear all cached data while preserving GitHub connection
  - Clears submission tracking cache
  - Clears metadata index
  - Clears repository info cache
  - Updates GitHub README to show zero statistics
  - Confirmation dialog before clearing
  - Success feedback after completion
- **Repository Metadata Auto-Setup**: Automatically sets repository description, homepage, and topics after first sync
  - Description: "LeetCode solutions synchronized automatically using DevGrid."
  - Homepage: `https://github.com/mohith1976/DevGrid-v2`
  - Topics: `leetcode`, `algorithms`, `dsa`, `chrome-extension`, `typescript`, `devgrid`
  - Only updates if description is empty
  - Never overwrites user customizations
- **Rich Problem READMEs**: Problem READMEs now include full problem details
  - Complete problem description
  - All examples with input/output
  - All constraints
  - Topics (when available)
  - Runtime and memory percentiles
- **Synced Problem Indicators**: Visual indicators on LeetCode problem pages
  - Shows "✓ Synced to GitHub" for already-synced problems
  - Includes GitHub icon and "View" link
  - Survives SPA navigation
  - Uses local cache (no GitHub API calls)
- **Repository About Section**: Extension popup now displays repository description
  - Shows repository description if available
  - Fallback text for empty descriptions
  - Fetched during GitHub connection
- **New Professional Icons**: Rocket + grid design representing speed and organization
  - 16×16, 48×48, 128×128 pixel sizes
  - Clean, modern aesthetic
  - High contrast for visibility

### Changed
- **Commit Message Format**: Updated to include performance percentiles
  - Old: `Add Two Sum (Python)`
  - New: `Time: 45 ms (95.23%), Space: 14.2 MB (87.45%) - DevGrid`
- **Topic Extraction**: Improved topic extraction with multi-tier fallback
  - Priority 1: GraphQL API topics
  - Priority 2: DOM extraction from problem page
  - Priority 3: Hide Topics section if unavailable
  - Never shows "Topics: None"
- **Popup UI**: Redesigned for minimalist, professional appearance
  - Removed purple gradients and emojis
  - Clean black/white/gray color system
  - Reduced font size to 13px
  - Improved spacing and hierarchy
  - Professional developer-tool aesthetic
- **Sync Status Overlay**: Improved visual design
  - Three states: uploading (blue), success (green), error (red)
  - Non-blocking, top-right corner placement
  - Auto-dismiss for success (3 seconds)
  - Manual dismiss for errors
  - Smooth animations
- **Repository README**: Redesigned for clean, professional look
  - Removed emoji spam and decorative ASCII
  - Clean sections: Statistics, Languages, Top Topics, Recent Activity
  - Visual language bars
  - Consistent formatting
- **Problem README Template**: Simplified and cleaned up
  - Removed excessive badges
  - Clean structure: Title, Link, Details, Submission, Solution
  - Includes performance percentiles
  - Professional appearance

### Fixed
- **Invalid Time Value Error**: Fixed "Invalid time value" error in repository README generation
  - Added timestamp validation before creating Date objects
  - Migration logic for old cached data
  - Default to current time if invalid
- **Last Sync Display**: Fixed "NaN days ago" error in popup
  - Changed from `new Date().getTime()` to `Date.now()`
  - Improved time format: "5m ago", "2h ago", "Yesterday", "3d ago"
  - Added "No successful sync yet" for empty state
- **Popup About Section**: Fixed text overflow and layout issues
  - Added responsive text wrapping with word-break
  - Truncates long descriptions to 100 characters
  - Improved spacing and alignment
  - Better readability with proper line height
- **Build Configuration**: Fixed ES module issues in content script
  - Created separate Vite configurations for each entry point
  - Content script and popup bundled as IIFE
  - Background script as ES module
  - Proper file copying automation

### Technical
- **New Services**:
  - `cache-clear.ts`: Statistics clearing and README regeneration
  - `problem-extractor.ts`: DOM-based problem detail extraction
- **Enhanced Services**:
  - `github-client.ts`: Added repository metadata update method
  - `github-storage.ts`: Added metadata update tracking
  - `github-sync-service.ts`: Integrated metadata update after first sync
  - `submission-service.ts`: Added percentile mapping
- **Build Output**:
  - Content script: 28.59 kB (gzip: 9.11 kB)
  - Popup script: 14.57 kB (gzip: 4.32 kB)
  - Background script: 0.37 kB (gzip: 0.22 kB)

---

## [1.0.0] - 2024-11-XX

### Added
- **Core Functionality**:
  - Automatic LeetCode submission detection
  - Real-time sync to GitHub
  - SPA navigation support
  - GraphQL integration for submission data
  - Polling mechanism for submission status
  
- **Markdown Generation**:
  - Problem README generation
  - Repository README generation
  - Statistics tracking (difficulty, language, topics)
  - Recent activity tracking
  
- **GitHub Integration**:
  - Personal Access Token authentication
  - Repository structure generation
  - File upload (README + solution)
  - Commit message generation
  - Metadata index (`.devgrid/index.json`)
  
- **User Interface**:
  - Extension popup with statistics
  - Configuration management
  - Sync status display
  - Repository access button
  - Disconnect functionality
  
- **Storage & Caching**:
  - Submission tracking in chrome.storage.local
  - Metadata index caching
  - Cache recovery mechanism
  - Resubmission handling
  
- **Content Script Features**:
  - Submission detector
  - SPA navigation monitoring (MutationObserver)
  - Accepted submission filtering
  - Automatic sync trigger

### Technical
- **Architecture**:
  - TypeScript codebase
  - Vite build system
  - Modular service architecture
  - Domain-driven design
  
- **Services**:
  - LeetCode GraphQL client
  - GitHub REST API client
  - Markdown template engine
  - Storage abstraction layer
  - File naming utilities
  
- **Build System**:
  - Separate Vite configs for background, content, popup
  - TypeScript compilation
  - File copying automation
  - Production optimization

---

## [0.1.0] - 2024-10-XX (Internal)

### Added
- Initial project setup
- Basic Chrome extension structure
- Proof of concept for submission detection
- GitHub API integration prototype

---

## Version History Summary

| Version | Release Date | Key Features |
|---------|--------------|--------------|
| 1.1.0   | 2024-12-XX   | Reset statistics, repository metadata, rich READMEs, synced indicators |
| 1.0.0   | 2024-11-XX   | Core functionality, automatic sync, statistics tracking |
| 0.1.0   | 2024-10-XX   | Initial prototype (internal) |

---

## Upgrade Guide

### From 1.0.0 to 1.1.0

**No breaking changes**. Simply reload the extension:

1. Navigate to `chrome://extensions/`
2. Find DevGrid
3. Click the reload icon
4. Existing configuration and data preserved

**New Features Available**:
- Reset Statistics button in popup
- Repository metadata auto-setup on next sync
- Rich problem details in READMEs
- Synced problem indicators on LeetCode

**Optional Actions**:
- Reset statistics to trigger repository metadata update
- Resubmit old problems to get rich READMEs with full details

---

## Future Roadmap

### Planned for 1.2.0
- OAuth authentication
- Multi-browser support (Firefox, Edge)
- Offline sync queue
- Rate limit handling
- Error retry logic

### Planned for 2.0.0
- Multi-repository support
- Custom README templates
- Advanced statistics and analytics
- Conflict resolution
- Backup and export features

---

## Links

- **Repository**: https://github.com/mohith1976/DevGrid-v2
- **Issues**: https://github.com/mohith1976/DevGrid-v2/issues
- **Releases**: https://github.com/mohith1976/DevGrid-v2/releases

---

**Note**: This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality (backward compatible)
- **PATCH** version for backward compatible bug fixes
