/**
 * Content Script
 * Runs on LeetCode pages with SPA navigation support
 */

import { SubmissionDetector } from './submission-detector';
import { fetchSubmissionDetails } from '../services/leetcode/submission-service';
import { isAccepted } from '../domain/submission';
import { generateMarkdown } from '../services/markdown/markdown-generator';

console.log('DevGrid content script loaded on:', window.location.href);

// Initialize submission detector
const detector = new SubmissionDetector();

/**
 * Check for submission and process if accepted
 */
async function checkSubmission(): Promise<void> {
  const result = detector.detect();

  if (result) {
    console.log('DevGrid: Submission detected:', result.submissionId);

    try {
      const submission = await fetchSubmissionDetails(result.submissionId);

      if (isAccepted(submission)) {
        console.log(`DevGrid: Accepted submission - ${submission.title} (${submission.language})`);

        // Generate markdown
        generateMarkdown(submission);

        // TODO: Phase 4 - Send to GitHub
        console.log('DevGrid: Markdown generated, ready for GitHub sync');
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
