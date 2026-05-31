/**
 * Submission Domain Model
 * Central object for the entire application
 */

/**
 * Topic tag for a problem
 */
export interface TopicTag {
  /** Tag identifier */
  tagId: string;
  
  /** Tag slug (e.g., "array", "two-pointers") */
  slug: string;
  
  /** Tag display name (e.g., "Array", "Two Pointers") */
  name: string;
}

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

  /** Runtime percentile (0-100) */
  runtimePercentile?: number;

  /** Memory usage in bytes */
  memory: number;

  /** Memory percentile (0-100) */
  memoryPercentile?: number;

  /** Status code (10 = Accepted) */
  statusCode: number;

  /** Problem difficulty (Easy, Medium, Hard) */
  difficulty: string;

  /** Topic tags for the problem */
  topics: TopicTag[];

  /** Problem description */
  description?: string;

  /** Problem examples */
  examples?: string[];

  /** Problem constraints */
  constraints?: string[];
}

/**
 * Check if a submission is accepted
 * @param submission - The submission to check
 * @returns true if submission is accepted (statusCode === 10)
 */
export function isAccepted(submission: Submission): boolean {
  return submission.statusCode === 10;
}
