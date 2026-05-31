/**
 * Cache Recovery Service
 * Handles recovery of local cache from GitHub backup
 */

import { GitHubClient } from '../github/github-client';
import { getCurrentConfig } from '../github/github-config-service';
import { parseIndex, MetadataIndex } from './metadata-index';

/**
 * Storage key for submission cache
 */
const SUBMISSION_CACHE_KEY = 'synced_submissions';

/**
 * Check if local cache exists
 *
 * @returns Promise resolving to true if cache exists
 */
async function hasLocalCache(): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.storage.local.get([SUBMISSION_CACHE_KEY], (result) => {
      const cache = result[SUBMISSION_CACHE_KEY];
      resolve(cache !== undefined && cache !== null);
    });
  });
}

/**
 * Rebuild local cache from GitHub index
 *
 * @param index - Metadata index from GitHub
 */
async function rebuildLocalCache(index: MetadataIndex): Promise<void> {
  // Convert metadata index to submission cache format
  const cache = {
    submissions: index.submissions,
    lastUpdated: index.lastUpdated,
  };

  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [SUBMISSION_CACHE_KEY]: cache }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(`Failed to rebuild cache: ${chrome.runtime.lastError.message}`));
      } else {
        console.log('[Cache Recovery] Local cache rebuilt from GitHub backup');
        resolve();
      }
    });
  });
}

/**
 * Attempt to recover cache from GitHub backup
 *
 * Startup flow:
 * 1. Check if local cache exists
 * 2. If exists: use local cache (fast path)
 * 3. If missing: read .devgrid/index.json from GitHub
 * 4. Rebuild local cache from GitHub backup
 * 5. Continue normally
 *
 * @returns Promise resolving to true if recovery was needed and successful
 */
export async function recoverCacheIfNeeded(): Promise<boolean> {
  try {
    // Check if local cache exists
    const cacheExists = await hasLocalCache();

    if (cacheExists) {
      // Fast path: local cache exists, no recovery needed
      console.log('[Cache Recovery] Local cache exists, no recovery needed');
      return false;
    }

    console.log('[Cache Recovery] Local cache missing, attempting recovery from GitHub...');

    // Get GitHub configuration
    const config = await getCurrentConfig();

    if (!config) {
      console.log('[Cache Recovery] No GitHub configuration found, cannot recover');
      return false;
    }

    // Create GitHub client
    const client = new GitHubClient(config);

    // Try to fetch .devgrid/index.json from GitHub
    try {
      const indexContent = await client.getFileContent('.devgrid/index.json');
      const index = parseIndex(indexContent);

      // Rebuild local cache from GitHub backup
      await rebuildLocalCache(index);

      console.log('[Cache Recovery] ✓ Cache recovered successfully from GitHub backup');
      console.log(`[Cache Recovery] Restored ${Object.keys(index.submissions).length} submissions`);

      return true;
    } catch (error) {
      // Index doesn't exist on GitHub yet (new user)
      console.log('[Cache Recovery] No backup found on GitHub (new user or first sync)');
      return false;
    }
  } catch (error) {
    console.error('[Cache Recovery] Recovery failed:', error);
    return false;
  }
}

/**
 * Manually trigger cache recovery (for testing or user-initiated recovery)
 *
 * @returns Promise resolving to true if recovery was successful
 */
export async function forceRecoverCache(): Promise<boolean> {
  console.log('[Cache Recovery] Force recovery initiated...');

  try {
    // Get GitHub configuration
    const config = await getCurrentConfig();

    if (!config) {
      throw new Error('No GitHub configuration found');
    }

    // Create GitHub client
    const client = new GitHubClient(config);

    // Fetch .devgrid/index.json from GitHub
    const indexContent = await client.getFileContent('.devgrid/index.json');
    const index = parseIndex(indexContent);

    // Rebuild local cache from GitHub backup
    await rebuildLocalCache(index);

    console.log('[Cache Recovery] ✓ Force recovery successful');
    console.log(`[Cache Recovery] Restored ${Object.keys(index.submissions).length} submissions`);

    return true;
  } catch (error) {
    console.error('[Cache Recovery] Force recovery failed:', error);
    throw error;
  }
}

