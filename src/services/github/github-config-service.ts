/**
 * GitHub Configuration Service
 * Handles validation and management of GitHub configuration
 */

import { GitHubConfig, GitHubConnectionStatus } from '../../domain/github-config';
import { GitHubClient } from './github-client';
import * as githubStorage from '../storage/github-storage';

/**
 * Validate and save GitHub configuration
 *
 * Validates token and repository before saving
 *
 * @param config - GitHub configuration to validate and save
 * @returns Promise that resolves when config is validated and saved
 * @throws Error if validation fails
 */
export async function validateAndSaveConfig(config: GitHubConfig): Promise<void> {
  console.log('[GitHub Config] Validating configuration...');

  // Create GitHub client
  const client = new GitHubClient(config);

  try {
    // Step 1: Validate token
    console.log('[GitHub Config] Validating token...');
    const user = await client.validateToken();
    console.log('[GitHub Config] ✓ Token valid:', user.login);

    // Step 2: Validate repository
    console.log('[GitHub Config] Validating repository...');
    const repo = await client.getRepository();
    console.log('[GitHub Config] ✓ Repository accessible:', `${repo.owner}/${repo.name}`);

    // Step 3: Save configuration
    console.log('[GitHub Config] Saving configuration...');
    await githubStorage.saveConfig(config);
    console.log('[GitHub Config] ✓ Configuration saved');
  } catch (error) {
    if (error instanceof Error) {
      console.error('[GitHub Config] ✗ Validation failed:', error.message);
      throw new Error(`Configuration validation failed: ${error.message}`);
    }
    throw new Error('Configuration validation failed: Unknown error');
  }
}

/**
 * Get current GitHub configuration
 *
 * @returns Promise resolving to GitHub configuration or null if not configured
 */
export async function getCurrentConfig(): Promise<GitHubConfig | null> {
  const config = await githubStorage.getConfig();

  if (config) {
    console.log('[GitHub Config] Configuration found:', `${config.owner}/${config.repo}`);
  } else {
    console.log('[GitHub Config] No configuration found');
  }

  return config;
}

/**
 * Get GitHub connection status
 *
 * @returns Promise resolving to connection status
 */
export async function getConnectionStatus(): Promise<GitHubConnectionStatus> {
  const config = await githubStorage.getConfig();

  if (config) {
    return {
      connected: true,
      owner: config.owner,
      repo: config.repo,
    };
  }

  return {
    connected: false,
  };
}

/**
 * Disconnect GitHub (clear configuration)
 *
 * @returns Promise that resolves when disconnected
 */
export async function disconnect(): Promise<void> {
  console.log('[GitHub Config] Disconnecting...');
  await githubStorage.clearConfig();
  console.log('[GitHub Config] ✓ Disconnected');
}
