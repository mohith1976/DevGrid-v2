# DevGrid

**Automatic LeetCode → GitHub synchronization for developers**

DevGrid is a Chrome extension that automatically syncs your accepted LeetCode solutions to GitHub. Every time you solve a problem, DevGrid captures your solution, generates comprehensive documentation, and pushes it to your repository—no manual work required.

---

## Features

### 🚀 Automatic Synchronization
- **Zero-touch workflow**: Submit on LeetCode, auto-sync to GitHub
- **Real-time detection**: Captures accepted submissions instantly
- **SPA navigation support**: Works seamlessly with LeetCode's single-page app
- **Resubmission handling**: Updates existing solutions when you improve them

### 📝 Rich Documentation
- **Problem READMEs**: Full problem description, examples, constraints, and solution
- **Repository README**: Auto-generated statistics, language breakdown, topic tracking
- **Clean formatting**: Professional markdown with syntax highlighting
- **Performance metrics**: Runtime and memory percentiles included

### 📊 Statistics Tracking
- **Difficulty breakdown**: Easy, Medium, Hard problem counts
- **Language tracking**: Solutions organized by programming language
- **Topic analysis**: Automatic topic extraction and categorization
- **Recent activity**: Last 10 synced problems with timestamps

### 🎨 User Experience
- **Sync status overlay**: Visual feedback on LeetCode pages
- **Synced problem indicators**: See which problems are already backed up
- **Extension popup**: Quick stats and repository access
- **Reset statistics**: Clear cache and start fresh anytime

### 🔧 GitHub Integration
- **Personal Access Token**: Secure authentication
- **Repository metadata**: Auto-sets description, homepage, and topics
- **Folder structure**: Organized by problem number and slug
- **Commit messages**: Detailed performance metrics in every commit

---



## Installation

### Prerequisites
- Google Chrome browser (version 88+)
- GitHub account
- GitHub Personal Access Token with `repo` scope

### Steps

1. **Download the extension**
   ```bash
   git clone https://github.com/mohith1976/DevGrid-v2.git
   cd DevGrid-v2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the `dist` folder from the project directory

5. **Generate GitHub Token**
   - Go to [GitHub Settings → Tokens](https://github.com/settings/tokens/new)
   - Click "Generate new token (classic)"
   - Give it a name (e.g., "DevGrid")
   - Select scope: `repo` (Full control of private repositories)
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again)

6. **Configure DevGrid**
   - Click the DevGrid extension icon in Chrome
   - Enter your GitHub username
   - Enter your repository name (e.g., `leetcode-solutions`)
   - Paste your Personal Access Token
   - Click "Connect to GitHub"

---

## Configuration

### First-Time Setup

1. **Create or select a repository**
   - Use an existing repository, or
   - DevGrid will create it automatically on first sync

2. **Connect DevGrid**
   - Open the extension popup
   - Fill in the configuration form:
     - **GitHub Username**: Your GitHub username
     - **Repository Name**: Where solutions will be stored
     - **Personal Access Token**: Token with `repo` scope

3. **Verify connection**
   - Extension will validate credentials
   - Shows "Connected" status on success
   - Displays repository information

### Using DevGrid

1. **Solve problems on LeetCode**
   - Navigate to any problem
   - Write and submit your solution
   - Wait for "Accepted" status

2. **Automatic sync**
   - DevGrid detects the accepted submission
   - Shows "Syncing to GitHub..." overlay
   - Uploads solution and README to GitHub
   - Shows "Successfully synced to GitHub" confirmation

3. **View on GitHub**
   - Click "Open Repository" in popup
   - Browse your organized solutions
   - Share your repository with others

---

## Architecture

### High-Level Overview

```
┌─────────────────┐
│   LeetCode      │
│   Website       │
└────────┬────────┘
         │
         │ (Content Script)
         │
┌────────▼────────┐
│  DevGrid        │
│  Extension      │
│                 │
│  ┌───────────┐  │
│  │ Detector  │  │
│  └─────┬─────┘  │
│        │        │
│  ┌─────▼─────┐  │
│  │ GraphQL   │  │
│  │ Client    │  │
│  └─────┬─────┘  │
│        │        │
│  ┌─────▼─────┐  │
│  │ Markdown  │  │
│  │ Generator │  │
│  └─────┬─────┘  │
│        │        │
│  ┌─────▼─────┐  │
│  │  GitHub   │  │
│  │  Client   │  │
│  └─────┬─────┘  │
└────────┼────────┘
         │
         │ (GitHub API)
         │
┌────────▼────────┐
│   GitHub        │
│   Repository    │
└─────────────────┘
```

### Components

#### Content Script (`src/content/`)
- Runs on LeetCode pages
- Detects accepted submissions
- Extracts problem details from DOM
- Shows sync status overlay
- Displays synced problem indicators

#### Services (`src/services/`)
- **LeetCode Service**: GraphQL queries, submission fetching, problem extraction
- **GitHub Service**: Repository operations, file uploads, metadata management
- **Markdown Service**: README generation, template rendering
- **Storage Service**: Chrome storage, cache management, submission tracking

#### Popup (`src/popup/`)
- Extension UI
- Configuration management
- Statistics display
- Repository access

#### Background (`src/background/`)
- Service worker
- Message passing
- Extension lifecycle management

---

## Folder Structure

### Generated Repository Structure

```
leetcode-solutions/
├── README.md                          # Repository statistics and problem list
├── .devgrid/
│   └── index.json                     # Metadata index
├── 0001-two-sum/
│   ├── README.md                      # Problem description and solution
│   └── 0001-two-sum.py                # Solution code
├── 0015-3sum/
│   ├── README.md
│   └── 0015-3sum.cpp
└── 0042-trapping-rain-water/
    ├── README.md
    └── 0042-trapping-rain-water.java
```

### Problem Folder Naming
- Format: `{questionId}-{slug}`
- Example: `0001-two-sum`, `0042-trapping-rain-water`
- Consistent, sortable, URL-friendly

### Solution File Naming
- Format: `{questionId}-{slug}.{extension}`
- Example: `0001-two-sum.py`, `0042-trapping-rain-water.java`
- Matches folder name for consistency

---

## Known Limitations

### Current Limitations

1. **Chrome Only**
   - Only works in Google Chrome
   - Firefox/Edge support not yet implemented

2. **Manual Token Management**
   - No OAuth flow
   - Users must generate and manage tokens manually
   - Token stored in chrome.storage.local (not encrypted)

3. **Single Repository**
   - Can only sync to one repository at a time
   - No multi-repository support

4. **No Conflict Resolution**
   - If you manually edit files on GitHub, DevGrid will overwrite them
   - No merge conflict detection

5. **Topic Extraction**
   - Topics may be missing for some problems
   - Depends on LeetCode's GraphQL API and DOM structure

6. **Performance Metrics**
   - Percentiles may show as "N/A" for some submissions
   - Depends on LeetCode's API response

7. **Rate Limiting**
   - No rate limit handling for GitHub API
   - Rapid submissions may hit GitHub's rate limits

8. **Network Dependency**
   - Requires active internet connection
   - No offline queue for failed syncs

---

## Development

### Build Commands

```bash
# Install dependencies
npm install

# Development build
npm run build

# Type checking
npm run type-check

# Lint code
npm run lint
```

### Project Structure

```
DevGrid-v2/
├── src/
│   ├── background/       # Service worker
│   ├── content/          # Content script
│   ├── popup/            # Extension popup
│   ├── services/         # Business logic
│   ├── domain/           # Domain models
│   └── utils/            # Utilities
├── dist/                 # Build output
├── icons/                # Extension icons
├── Instruction/          # Documentation
└── V1.1 release/         # Release documentation
```

### Technology Stack

- **TypeScript**: Type-safe development
- **Vite**: Fast build tool
- **Chrome Extension APIs**: Browser integration
- **GitHub REST API**: Repository operations
- **GraphQL API**: Submission data

---

## Troubleshooting

### Extension not detecting submissions
- Refresh the LeetCode page
- Reload the extension in `chrome://extensions`
- Check browser console for errors (F12)

### GitHub sync failing
- Verify your Personal Access Token is valid
- Check token has `repo` scope
- Ensure repository exists and is accessible
- Check network connection

### Statistics not updating
- Click "Reset Statistics" in popup
- Reload extension
- Submit a new problem to rebuild stats

### Repository README not updating
- Wait a few seconds after submission
- Check GitHub for recent commits
- Use "Reset Statistics" to force regeneration

---

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Areas for Contribution
- Firefox/Edge support
- OAuth authentication
- Offline sync queue
- Multi-repository support
- Conflict resolution
- Rate limit handling
- Check TECH_DEBT_AUDIT.md for more..

---


## Support

**Issues**: https://github.com/mohith1976/DevGrid-v2/issues  
**Discussions**: https://github.com/mohith1976/DevGrid-v2/discussions  

---



**DevGrid  - Automatic LeetCode → GitHub Synchronization**

*Made with frustration for students who wants to maintain both github and leetcode*