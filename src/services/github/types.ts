/**
 * GitHub Service Types
 * Type definitions for GitHub API interactions
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
 * GitHub user information
 */
export interface GitHubUser {
  /** GitHub username */
  login: string;

  /** GitHub user ID */
  id: number;
}

/**
 * Repository information
 */
export interface RepositoryInfo {
  /** Repository name */
  name: string;

  /** Repository owner */
  owner: string;

  /** Whether repository is private */
  private: boolean;

  /** Repository description */
  description: string | null;
}

/**
 * File upload request
 */
export interface FileUploadRequest {
  /** File path in repository (e.g., "problems/two-sum.md") */
  path: string;

  /** File content (plain text) */
  content: string;

  /** Commit message */
  message: string;
}
