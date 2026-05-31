/**
 * GitHub Configuration Domain Model
 * Represents GitHub connection configuration
 */

/**
 * GitHub configuration
 */
export interface GitHubConfig {
  /** Repository owner (username or organization) */
  owner: string;

  /** Repository name */
  repo: string;

  /** GitHub Personal Access Token */
  token: string;
}

/**
 * GitHub connection status
 */
export interface GitHubConnectionStatus {
  /** Whether GitHub is connected */
  connected: boolean;

  /** Repository owner (if connected) */
  owner?: string;

  /** Repository name (if connected) */
  repo?: string;
}
