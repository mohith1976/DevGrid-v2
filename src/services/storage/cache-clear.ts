/**
 * Cache Clear Service
 * Handles clearing all statistics and cached data
 */

import { getCurrentConfig } from '../github/github-config-service';
import { GitHubClient } from '../github/github-client';
import { generateRepositoryReadme } from '../markdown/repository-readme-generator';

/**
 * Clear all statistics and cached data
 * Does NOT clear GitHub configuration or token
 * 
 * @returns Promise that resolves when all caches are cleared
 */
export async function clearAllStatistics(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Keys to clear (everything except github_config)
    const keysToRemove = [
      'synced_submissions',              // Submission tracking cache
      'metadata_index',                  // Metadata index
      'github_repo_info',                // Repository info cache
      'last_cache_recovery',             // Cache recovery timestamp
      'github_repo_metadata_updated',    // Repository metadata update flag
    ];

    chrome.storage.local.remove(keysToRemove, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(`Failed to clear statistics: ${chrome.runtime.lastError.message}`));
      } else {
        console.log('[CacheClear] All statistics cleared successfully');
        resolve();
      }
    });
  });
}

/**
 * Clear all statistics and update GitHub README
 * Clears local cache and pushes updated README to GitHub showing zero stats
 * 
 * @returns Promise that resolves when cache is cleared and README is updated
 */
export async function clearAllStatisticsAndUpdateReadme(): Promise<void> {
  // Step 1: Clear local cache
  await clearAllStatistics();
  
  // Step 2: Get GitHub config
  const config = await getCurrentConfig();
  if (!config) {
    throw new Error('No GitHub configuration found');
  }
  
  // Step 3: Generate fresh README with zero stats
  const repositoryReadme = await generateRepositoryReadme();
  
  // Step 4: Upload to GitHub
  const client = new GitHubClient(config);
  await client.createOrUpdateFile({
    path: 'README.md',
    content: repositoryReadme,
    message: 'Reset repository statistics',
  });
  
  console.log('[CacheClear] Repository README updated with zero statistics');
}
