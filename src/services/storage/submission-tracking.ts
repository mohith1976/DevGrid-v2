/**
 * Submission Tracking Service
 * Tracks synced submissions for statistics and duplicate detection
 */

import { Submission } from '../../domain/submission';

/**
 * Synced submission metadata
 */
export interface SyncedSubmission {
  submissionId: string;
  questionId: string;
  title: string;
  slug: string;
  language: string;
  runtime: number;
  memory: number;
  syncedAt: number;
  folderName: string;
}

/**
 * Submission cache structure
 */
interface SubmissionCache {
  submissions: Record<string, SyncedSubmission>; // key: questionId-language
  lastUpdated: number;
}

/**
 * Storage key for submission cache
 */
const SUBMISSION_CACHE_KEY = 'synced_submissions';

/**
 * Track a synced submission
 *
 * @param submission - Submission to track
 * @param folderName - Folder name where submission was synced
 */
export async function trackSubmission(
  submission: Submission,
  folderName: string
): Promise<void> {
  const cache = await getCache();
  
  const key = `${submission.questionId}-${submission.language}`;
  
  cache.submissions[key] = {
    submissionId: submission.submissionId,
    questionId: submission.questionId,
    title: submission.title,
    slug: submission.slug,
    language: submission.language,
    runtime: submission.runtime,
    memory: submission.memory,
    syncedAt: Date.now(),
    folderName,
  };
  
  cache.lastUpdated = Date.now();
  
  await saveCache(cache);
}

/**
 * Get all synced submissions
 *
 * @returns Array of synced submissions
 */
export async function getAllSyncedSubmissions(): Promise<SyncedSubmission[]> {
  const cache = await getCache();
  return Object.values(cache.submissions);
}

/**
 * Check if submission already synced
 *
 * @param questionId - Question ID
 * @param language - Programming language
 * @returns True if already synced
 */
export async function isSubmissionSynced(
  questionId: string,
  language: string
): Promise<boolean> {
  const cache = await getCache();
  const key = `${questionId}-${language}`;
  return key in cache.submissions;
}

/**
 * Get cache from storage
 */
async function getCache(): Promise<SubmissionCache> {
  return new Promise((resolve) => {
    chrome.storage.local.get([SUBMISSION_CACHE_KEY], (result) => {
      const cache = result[SUBMISSION_CACHE_KEY] as SubmissionCache | undefined;
      resolve(cache || { submissions: {}, lastUpdated: Date.now() });
    });
  });
}

/**
 * Save cache to storage
 */
async function saveCache(cache: SubmissionCache): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [SUBMISSION_CACHE_KEY]: cache }, () => {
      resolve();
    });
  });
}
