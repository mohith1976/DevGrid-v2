/**
 * Content Script
 * Runs on LeetCode pages with SPA navigation support
 */

import { SubmissionDetector } from './submission-detector';
import { fetchSubmissionDetails } from '../services/leetcode/submission-service';
import { isAccepted } from '../domain/submission';

console.log('DevGrid content script loaded on:', window.location.href);

// Initialize submission detector
const detector = new SubmissionDetector();

/**
 * Check for submission and log result
 * PHASE 2 INTEGRATION TEST: Also fetch submission details
 */
async function checkSubmission(): Promise<void> {
  const result = detector.detect();

  if (result) {
    console.log('DevGrid: Submission detected:', result);

    // PHASE 2 INTEGRATION TEST: Fetch submission details
    try {
      console.log('[Integration Test] Fetching submission details...');
      const submission = await fetchSubmissionDetails(result.submissionId);

      console.log('[Integration Test] ✓ Submission fetched successfully:');
      console.log('[Integration Test] Submission Object:', submission);
      console.log('[Integration Test] Field Types:', {
        submissionId: typeof submission.submissionId,
        questionId: typeof submission.questionId,
        title: typeof submission.title,
        slug: typeof submission.slug,
        language: typeof submission.language,
        code: typeof submission.code,
        runtime: typeof submission.runtime,
        memory: typeof submission.memory,
        statusCode: typeof submission.statusCode,
      });
      console.log('[Integration Test] Is Accepted:', isAccepted(submission));

      if (isAccepted(submission)) {
        console.log(
          `[Integration Test] ✓ Accepted submission for: ${submission.title} (${submission.language})`
        );
        console.log(`[Integration Test] Runtime: ${submission.runtime}ms`);
        console.log(`[Integration Test] Memory: ${submission.memory} bytes`);
      }
    } catch (error) {
      console.error('[Integration Test] ✗ Failed to fetch submission:', error);
    }
  } else {
    console.log('DevGrid: Not a submission page');
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
