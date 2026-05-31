/**
 * Content Script
 * Runs on LeetCode pages with SPA navigation support
 */

import { SubmissionDetector } from './submission-detector';
import { fetchSubmissionDetails } from '../services/leetcode/submission-service';
import { isAccepted } from '../domain/submission';
import { syncSubmissionToGitHub } from '../services/github/github-sync-service';
import { recoverCacheIfNeeded } from '../services/storage/cache-recovery';

console.log('DevGrid content script loaded on:', window.location.href);

/**
 * Sync Status Overlay
 * Shows sync progress on LeetCode submission pages
 */
interface SyncOverlayState {
  status: 'uploading' | 'success' | 'error';
  message: string;
}

class SyncOverlay {
  private overlay: HTMLDivElement | null = null;
  private timeout: number | null = null;

  show(state: SyncOverlayState) {
    this.remove();
    this.create(state);
    
    // Auto-dismiss success after 3 seconds
    if (state.status === 'success') {
      this.timeout = window.setTimeout(() => {
        this.remove();
      }, 3000);
    }
  }

  private create(state: SyncOverlayState) {
    this.overlay = document.createElement('div');
    this.overlay.id = 'devgrid-sync-overlay';
    
    const icon = state.status === 'uploading' ? '↻' : 
                 state.status === 'success' ? '✓' : '✗';
    
    const statusClass = `devgrid-overlay-${state.status}`;
    
    this.overlay.innerHTML = `
      <div class="devgrid-overlay-content ${statusClass}">
        <span class="devgrid-overlay-icon">${icon}</span>
        <span class="devgrid-overlay-message">${state.message}</span>
        ${state.status === 'error' ? '<button class="devgrid-overlay-dismiss">×</button>' : ''}
      </div>
    `;
    
    // Add styles
    this.injectStyles();
    
    // Add dismiss handler for errors
    if (state.status === 'error') {
      const dismissBtn = this.overlay.querySelector('.devgrid-overlay-dismiss');
      dismissBtn?.addEventListener('click', () => this.remove());
    }
    
    document.body.appendChild(this.overlay);
  }

  private injectStyles() {
    if (document.getElementById('devgrid-overlay-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'devgrid-overlay-styles';
    style.textContent = `
      #devgrid-sync-overlay {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        animation: devgrid-slide-in 0.2s ease-out;
      }
      
      @keyframes devgrid-slide-in {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      .devgrid-overlay-content {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border: 1px solid #e5e5e5;
        min-width: 280px;
      }
      
      .devgrid-overlay-uploading {
        border-left: 3px solid #3b82f6;
      }
      
      .devgrid-overlay-success {
        border-left: 3px solid #10b981;
      }
      
      .devgrid-overlay-error {
        border-left: 3px solid #ef4444;
      }
      
      .devgrid-overlay-icon {
        font-size: 18px;
        line-height: 1;
      }
      
      .devgrid-overlay-uploading .devgrid-overlay-icon {
        animation: devgrid-spin 1s linear infinite;
        color: #3b82f6;
      }
      
      @keyframes devgrid-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      .devgrid-overlay-success .devgrid-overlay-icon {
        color: #10b981;
      }
      
      .devgrid-overlay-error .devgrid-overlay-icon {
        color: #ef4444;
      }
      
      .devgrid-overlay-message {
        flex: 1;
        font-size: 13px;
        color: #1a1a1a;
        font-weight: 500;
      }
      
      .devgrid-overlay-dismiss {
        background: none;
        border: none;
        font-size: 20px;
        color: #737373;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.15s ease;
      }
      
      .devgrid-overlay-dismiss:hover {
        background: #f5f5f5;
        color: #1a1a1a;
      }
    `;
    
    document.head.appendChild(style);
  }

  remove() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
  }
}

const syncOverlay = new SyncOverlay();

// Initialize submission detector
const detector = new SubmissionDetector();

// Attempt cache recovery on startup
recoverCacheIfNeeded().catch((error) => {
  console.error('DevGrid: Cache recovery failed:', error);
});

/**
 * Check for submission and process if accepted
 */
async function checkSubmission(): Promise<void> {
  const result = detector.detect();

  if (result) {
    console.log('DevGrid: Submission detected:', result.submissionId);

    try {
      // Poll for submission details until they're ready
      const maxAttempts = 10;
      const delayMs = 2000;
      let submission = null;
      
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        submission = await fetchSubmissionDetails(result.submissionId);
        
        // Check if submission details are ready
        const isReady = submission.runtime !== null && 
                       submission.memory !== null && 
                       submission.statusCode !== 16;
        
        if (isReady) {
          break;
        }
        
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
      
      if (!submission) {
        return;
      }

      if (isAccepted(submission)) {
        console.log(`DevGrid: Accepted submission - ${submission.title} (${submission.language})`);
        
        try {
          // Show uploading overlay
          syncOverlay.show({
            status: 'uploading',
            message: 'Syncing to GitHub...'
          });
          
          await syncSubmissionToGitHub(submission);
          
          // Show success overlay
          syncOverlay.show({
            status: 'success',
            message: 'Successfully synced to GitHub'
          });
        } catch (syncError) {
          // Show error overlay
          syncOverlay.show({
            status: 'error',
            message: 'GitHub sync failed'
          });
          throw syncError;
        }
      }
    } catch (error) {
      console.error('DevGrid: Failed to fetch submission:', error);
    }
  }
}

/**
 * Setup SPA navigation monitoring using MutationObserver
 * This works in Chrome extension content scripts (isolated world)
 */
function setupNavigationMonitoring(): void {
  // Track current URL to detect changes
  let lastUrl = window.location.href;

  /**
   * Check if URL has changed and handle it
   */
  const checkUrlChange = (): void => {
    const currentUrl = window.location.href;

    if (currentUrl !== lastUrl) {
      console.log('DevGrid: URL changed to:', currentUrl);
      lastUrl = currentUrl;
      checkSubmission();
    }
  };

  // Use MutationObserver to detect DOM changes that indicate navigation
  // React SPAs update the DOM when navigating, which we can observe
  const observer = new MutationObserver(() => {
    checkUrlChange();
  });

  // Observe the document body for changes
  // This will trigger on React re-renders during navigation
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Also listen to popstate for browser back/forward buttons
  window.addEventListener('popstate', checkUrlChange);

  console.log('DevGrid: SPA navigation monitoring enabled (MutationObserver)');
}

// Verify content script is running on LeetCode
if (window.location.hostname === 'leetcode.com') {
  console.log('DevGrid: Running on LeetCode');

  // Initial detection on page load
  checkSubmission();

  // Setup SPA navigation monitoring
  setupNavigationMonitoring();
}

// Message passing to background worker
chrome.runtime.sendMessage({ type: 'CONTENT_SCRIPT_READY' }, (response) => {
  console.log('Background response:', response);
});
