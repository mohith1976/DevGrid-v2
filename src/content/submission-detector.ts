/**
 * Submission Detector
 * Detects and extracts submission ID from LeetCode submission URLs
 */

/**
 * Result of submission detection
 */
export interface SubmissionDetectionResult {
  submissionId: string;
}

/**
 * Extracts submission ID from a LeetCode submission URL
 * URL format: https://leetcode.com/problems/<slug>/submissions/<submission-id>/
 *
 * @param url - The URL to parse
 * @returns Submission ID if valid, null otherwise
 */
export function extractSubmissionId(url: string): string | null {
  try {
    const urlObj = new URL(url);

    // Verify hostname is leetcode.com
    if (urlObj.hostname !== 'leetcode.com') {
      return null;
    }

    // Match pattern: /problems/<slug>/submissions/<submission-id>/
    const pathPattern = /^\/problems\/[^/]+\/submissions\/(\d+)\/?$/;
    const match = urlObj.pathname.match(pathPattern);

    if (!match || !match[1]) {
      return null;
    }

    const submissionId = match[1];

    // Validate submission ID is numeric
    if (!/^\d+$/.test(submissionId)) {
      return null;
    }

    return submissionId;
  } catch (error) {
    // Invalid URL
    return null;
  }
}

/**
 * Validates if a submission ID is valid
 *
 * @param submissionId - The submission ID to validate
 * @returns true if valid, false otherwise
 */
export function isValidSubmissionId(submissionId: string): boolean {
  return /^\d+$/.test(submissionId) && submissionId.length > 0;
}

/**
 * SubmissionDetector class
 * Responsible for detecting LeetCode submission pages and extracting submission IDs
 */
export class SubmissionDetector {
  /**
   * Detects if the current page is a LeetCode submission page
   * and extracts the submission ID
   *
   * @param url - The current page URL (defaults to window.location.href)
   * @returns Detection result with submission ID, or null if not a submission page
   */
  detect(url: string = window.location.href): SubmissionDetectionResult | null {
    const submissionId = extractSubmissionId(url);

    if (!submissionId) {
      return null;
    }

    return {
      submissionId,
    };
  }

  /**
   * Checks if the current page is a submission page
   *
   * @param url - The URL to check (defaults to window.location.href)
   * @returns true if submission page, false otherwise
   */
  isSubmissionPage(url: string = window.location.href): boolean {
    return extractSubmissionId(url) !== null;
  }

  /**
   * Gets the submission ID from the current page
   *
   * @param url - The URL to parse (defaults to window.location.href)
   * @returns Submission ID or null if not a submission page
   */
  getSubmissionId(url: string = window.location.href): string | null {
    return extractSubmissionId(url);
  }
}
