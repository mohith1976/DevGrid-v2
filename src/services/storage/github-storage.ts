/**
 * GitHub Storage Service
 * Handles persistent storage of GitHub configuration using chrome.storage.local
 */

import { GitHubConfig } from '../../domain/github-config';
import { RepositoryInfo } from '../github/types';

/**
 * Storage key for GitHub configuration
 */
const GITHUB_CONFIG_KEY = 'github_config';

/**
 * Storage key for repository information
 */
const GITHUB_REPO_INFO_KEY = 'github_repo_info';

/**
 * Save GitHub configuration to chrome.storage.local
 *
 * @param config - GitHub configuration to save
 * @returns Promise that resolves when config is saved
 */
export async function saveConfig(config: GitHubConfig): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [GITHUB_CONFIG_KEY]: config }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(`Failed to save config: ${chrome.runtime.lastError.message}`));
      } else {
        console.log('[Storage] GitHub config saved:', `${config.owner}/${config.repo}`);
        resolve();
      }
    });
  });
}

/**
 * Get GitHub configuration from chrome.storage.local
 *
 * @returns Promise resolving to GitHub configuration or null if not found
 */
export async function getConfig(): Promise<GitHubConfig | null> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([GITHUB_CONFIG_KEY], (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(`Failed to get config: ${chrome.runtime.lastError.message}`));
      } else {
        const config = result[GITHUB_CONFIG_KEY] as GitHubConfig | undefined;
        if (config) {
          console.log('[Storage] GitHub config retrieved:', `${config.owner}/${config.repo}`);
        } else {
          console.log('[Storage] GitHub config retrieved: not found');
        }
        resolve(config || null);
      }
    });
  });
}

/**
 * Clear GitHub configuration from chrome.storage.local
 *
 * @returns Promise that resolves when config is cleared
 */
export async function clearConfig(): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove([GITHUB_CONFIG_KEY], () => {
      if (chrome.runtime.lastError) {
        reject(new Error(`Failed to clear config: ${chrome.runtime.lastError.message}`));
      } else {
        console.log('[Storage] GitHub config cleared');
        resolve();
      }
    });
  });
}

/**
 * Check if GitHub configuration exists
 *
 * @returns Promise resolving to true if config exists, false otherwise
 */
export async function hasConfig(): Promise<boolean> {
  const config = await getConfig();
  return config !== null;
}

/**
 * Save repository information to chrome.storage.local
 *
 * @param repoInfo - Repository information to save
 * @returns Promise that resolves when info is saved
 */
export async function saveRepositoryInfo(repoInfo: RepositoryInfo): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [GITHUB_REPO_INFO_KEY]: repoInfo }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(`Failed to save repository info: ${chrome.runtime.lastError.message}`));
      } else {
        console.log('[Storage] Repository info saved:', `${repoInfo.owner}/${repoInfo.name}`);
        resolve();
      }
    });
  });
}

/**
 * Get repository information from chrome.storage.local
 *
 * @returns Promise resolving to repository information or null if not found
 */
export async function getRepositoryInfo(): Promise<RepositoryInfo | null> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([GITHUB_REPO_INFO_KEY], (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(`Failed to get repository info: ${chrome.runtime.lastError.message}`));
      } else {
        const repoInfo = result[GITHUB_REPO_INFO_KEY] as RepositoryInfo | undefined;
        resolve(repoInfo || null);
      }
    });
  });
}
