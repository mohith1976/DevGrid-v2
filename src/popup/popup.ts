/**
 * Popup Script
 * Handles extension popup UI and user interactions
 */

import { validateAndSaveConfig, getCurrentConfig, disconnect } from '../services/github/github-config-service';
import { GitHubConfig } from '../domain/github-config';
import { getAllSyncedSubmissions } from '../services/storage/submission-tracking';

// DOM Elements
const connectedState = document.getElementById('connected-state')!;
const disconnectedState = document.getElementById('disconnected-state')!;
const loadingState = document.getElementById('loading-state')!;

const repoNameEl = document.getElementById('repo-name')!;
const statTotal = document.getElementById('stat-total')!;
const statEasy = document.getElementById('stat-easy')!;
const statMedium = document.getElementById('stat-medium')!;
const statHard = document.getElementById('stat-hard')!;
const syncMessage = document.getElementById('sync-message')!;

const configForm = document.getElementById('config-form') as HTMLFormElement;
const usernameInput = document.getElementById('github-username') as HTMLInputElement;
const repoInput = document.getElementById('repo-name-input') as HTMLInputElement;
const tokenInput = document.getElementById('github-token') as HTMLInputElement;
const errorMessage = document.getElementById('error-message')!;
const connectBtn = document.getElementById('connect-btn') as HTMLButtonElement;

const openRepoBtn = document.getElementById('open-repo-btn')!;
const disconnectBtn = document.getElementById('disconnect-btn')!;

/**
 * Show specific state
 */
function showState(state: 'connected' | 'disconnected' | 'loading') {
  connectedState.style.display = 'none';
  disconnectedState.style.display = 'none';
  loadingState.style.display = 'none';

  switch (state) {
    case 'connected':
      connectedState.style.display = 'block';
      break;
    case 'disconnected':
      disconnectedState.style.display = 'block';
      break;
    case 'loading':
      loadingState.style.display = 'block';
      break;
  }
}

/**
 * Show error message
 */
function showError(message: string) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}

/**
 * Hide error message
 */
function hideError() {
  errorMessage.style.display = 'none';
}

/**
 * Load and display connected state
 */
async function loadConnectedState(config: GitHubConfig) {
  // Display repository info
  repoNameEl.textContent = `${config.owner}/${config.repo}`;

  // Load statistics
  try {
    const submissions = await getAllSyncedSubmissions();
    
    // Calculate statistics
    const total = submissions.length;
    const easy = submissions.filter(s => s.difficulty === 'Easy').length;
    const medium = submissions.filter(s => s.difficulty === 'Medium').length;
    const hard = submissions.filter(s => s.difficulty === 'Hard').length;

    // Update UI
    statTotal.textContent = total.toString();
    statEasy.textContent = easy.toString();
    statMedium.textContent = medium.toString();
    statHard.textContent = hard.toString();

    // Update sync status
    if (submissions.length > 0) {
      const lastSync = Math.max(...submissions.map(s => s.syncedAt));
      const now = Date.now();
      const diffMs = now - lastSync;
      const diffMins = Math.floor(diffMs / 60000);
      
      let timeAgo = '';
      if (diffMins < 1) {
        timeAgo = 'Just now';
      } else if (diffMins < 60) {
        timeAgo = `${diffMins}m ago`;
      } else {
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) {
          timeAgo = `${diffHours}h ago`;
        } else if (diffHours < 48) {
          timeAgo = 'Yesterday';
        } else {
          const diffDays = Math.floor(diffHours / 24);
          timeAgo = `${diffDays}d ago`;
        }
      }
      
      syncMessage.textContent = `Last synced ${timeAgo}`;
    } else {
      syncMessage.textContent = 'No successful sync yet';
    }
  } catch (error) {
    console.error('Failed to load statistics:', error);
    syncMessage.textContent = 'Failed to load statistics';
  }

  showState('connected');
}

/**
 * Initialize popup
 */
async function init() {
  showState('loading');

  try {
    const config = await getCurrentConfig();

    if (config) {
      // User is connected
      await loadConnectedState(config);
    } else {
      // User is not connected
      showState('disconnected');
    }
  } catch (error) {
    console.error('Failed to initialize popup:', error);
    showState('disconnected');
  }
}

/**
 * Handle form submission
 */
configForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError();

  const username = usernameInput.value.trim();
  const repo = repoInput.value.trim();
  const token = tokenInput.value.trim();

  // Validation
  if (!username || !repo || !token) {
    showError('All fields are required');
    return;
  }

  if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
    showError('Invalid token format. Token should start with "ghp_" or "github_pat_"');
    return;
  }

  // Show loading
  connectBtn.disabled = true;
  connectBtn.textContent = 'Connecting...';
  showState('loading');

  try {
    const config: GitHubConfig = {
      owner: username,
      repo: repo,
      token: token,
    };

    // Validate and save
    await validateAndSaveConfig(config);

    // Success - load connected state
    await loadConnectedState(config);

    // Clear form
    configForm.reset();
  } catch (error) {
    // Show error
    showState('disconnected');
    connectBtn.disabled = false;
    connectBtn.textContent = 'Connect';

    if (error instanceof Error) {
      showError(error.message);
    } else {
      showError('Failed to connect. Please check your credentials.');
    }
  }
});

/**
 * Handle open repository button
 */
openRepoBtn.addEventListener('click', async () => {
  try {
    const config = await getCurrentConfig();
    if (config) {
      const url = `https://github.com/${config.owner}/${config.repo}`;
      chrome.tabs.create({ url });
    }
  } catch (error) {
    console.error('Failed to open repository:', error);
  }
});

/**
 * Handle disconnect button
 */
disconnectBtn.addEventListener('click', async () => {
  if (confirm('Are you sure you want to disconnect? Your repository data will not be deleted.')) {
    try {
      await disconnect();
      showState('disconnected');
    } catch (error) {
      console.error('Failed to disconnect:', error);
      alert('Failed to disconnect. Please try again.');
    }
  }
});

// Initialize on load
init();
