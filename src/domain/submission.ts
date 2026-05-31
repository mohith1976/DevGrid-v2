/**
 * Submission Domain Model
 * Central object for the entire application
 */

/**
 * Submission represents a LeetCode submission with all its metadata
 */
export interface Submission {
  /** Unique submission identifier */
  submissionId: string;

  /** LeetCode question ID */
  questionId: string;

  /** Question title (e.g., "Two Sum") */
  title: string;

  /** Question slug (e.g., "two-sum") */
  slug: string;

  /** Programming language (e.g., "javascript", "python3") */
  language: string;

  /** Solution source code */
  code: string;

  /** Runtime in milliseconds */
  runtime: number;

  /** Memory usage in bytes */
  memory: number;

  /** Status code (10 = Accepted) */
  statusCode: number;
}

/**
 * Check if a submission is accepted
 * @param submission - The submission to check
 * @returns true if submission is accepted (statusCode === 10)
 */
export function isAccepted(submission: Submission): boolean {
  return submission.statusCode === 10;
}
