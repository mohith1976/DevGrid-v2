/**
 * GitHub Storage Service
 * Handles persistent storage of GitHub configuration using chrome.storage.local
 */

import { GitHubConfig } from '../../domain/github-config';

/**
 * Storage key for GitHub configuration
 */
const GITHUB_CONFIG_KEY = 'github_config';

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
