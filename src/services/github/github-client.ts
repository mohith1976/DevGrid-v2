/**
 * GitHub Client
 * Handles communication with GitHub REST API
 */

import {
  GitHubConfig,
  GitHubUser,
  RepositoryInfo,
  FileUploadRequest,
} from './types';

/**
 * GitHub API base URL
 */
const GITHUB_API_BASE = 'https://api.github.com';

/**
 * GitHub API response for user endpoint
 */
interface GitHubUserResponse {
  login: string;
  id: number;
  [key: string]: unknown;
}

/**
 * GitHub API response for repository endpoint
 */
interface GitHubRepositoryResponse {
  name: string;
  owner: {
    login: string;
  };
  private: boolean;
  description: string | null;
  [key: string]: unknown;
}

/**
 * GitHub API response for contents endpoint (get file)
 */
interface GitHubContentsResponse {
  sha: string;
  [key: string]: unknown;
}

/**
 * GitHub Client
 * Provides methods to interact with GitHub REST API
 */
export class GitHubClient {
  private owner: string;
  private repo: string;
  private token: string;

  /**
   * Create a new GitHub client
   *
   * @param config - GitHub configuration
   */
  constructor(config: GitHubConfig) {
    this.owner = config.owner;
    this.repo = config.repo;
    this.token = config.token;
  }

  /**
   * Validate GitHub token and get user information
   *
   * @returns Promise resolving to GitHub user information
   * @throws Error if token is invalid or request fails
   */
  async validateToken(): Promise<GitHubUser> {
    console.log('[GitHub] Validating token');

    try {
      const response = await fetch(`${GITHUB_API_BASE}/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (response.status === 401) {
        throw new Error('Invalid GitHub token - Unauthorized');
      }

      if (response.status === 403) {
        throw new Error('GitHub token forbidden - Check token permissions');
      }

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const data: GitHubUserResponse = await response.json();

      return {
        login: data.login,
        id: data.id,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network failure while validating GitHub token');
    }
  }

  /**
   * Get repository information
   *
   * @returns Promise resolving to repository information
   * @throws Error if repository not found or request fails
   */
  async getRepository(): Promise<RepositoryInfo> {
    console.log('[GitHub] Repository verified');

    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      if (response.status === 404) {
        throw new Error(`Repository not found: ${this.owner}/${this.repo}`);
      }

      if (response.status === 403) {
        throw new Error(`Permission denied to repository: ${this.owner}/${this.repo}`);
      }

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const data: GitHubRepositoryResponse = await response.json();

      return {
        name: data.name,
        owner: data.owner.login,
        private: data.private,
        description: data.description,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network failure while fetching repository information');
    }
  }

  /**
   * Update repository metadata (description, homepage, topics)
   * Only updates if fields are empty
   *
   * @returns Promise that resolves when update is complete
   * @throws Error if update fails
   */
  async updateRepositoryMetadata(): Promise<void> {
    console.log('[GitHub] Updating repository metadata');

    try {
      // First, get current repository info
      const repoInfo = await this.getRepository();

      // Only update if description is empty
      if (repoInfo.description && repoInfo.description.trim().length > 0) {
        console.log('[GitHub] Repository already has description, skipping update');
        return;
      }

      // Update repository with description, homepage, and topics
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description: 'LeetCode solutions synchronized automatically using DevGrid.',
            homepage: 'https://github.com/mohith1976/DevGrid-v2',
            topics: ['leetcode', 'algorithms', 'dsa', 'chrome-extension', 'typescript', 'devgrid'],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update repository metadata: ${response.status} ${response.statusText}`);
      }

      console.log('[GitHub] Repository metadata updated successfully');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network failure while updating repository metadata');
    }
  }

  /**
   * Create or update a file in the repository
   *
   * @param request - File upload request
   * @throws Error if operation fails
   */
  async createOrUpdateFile(request: FileUploadRequest): Promise<void> {
    try {
      // Check if file exists
      const existingSha = await this.getFileSha(request.path);

      if (existingSha) {
        // File exists - update it
        console.log('[GitHub] Updating file');
        await this.updateFile(request, existingSha);
      } else {
        // File does not exist - create it
        console.log('[GitHub] Creating file');
        await this.createFile(request);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network failure while creating/updating file');
    }
  }

  /**
   * Get file SHA if it exists
   *
   * @param path - File path
   * @returns Promise resolving to SHA or null if file doesn't exist
   */
  private async getFileSha(path: string): Promise<string | null> {
    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}/contents/${path}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      if (response.status === 404) {
        // File does not exist
        return null;
      }

      if (!response.ok) {
        throw new Error(`Failed to check file existence: ${response.status}`);
      }

      const data: GitHubContentsResponse = await response.json();
      return data.sha;
    } catch (error) {
      // If error is 404, file doesn't exist
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get file content from repository
   *
   * @param path - File path
   * @returns Promise resolving to file content as string
   * @throws Error if file doesn't exist or request fails
   */
  async getFileContent(path: string): Promise<string> {
    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}/contents/${path}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      if (response.status === 404) {
        throw new Error(`File not found: ${path}`);
      }

      if (!response.ok) {
        throw new Error(`Failed to get file content: ${response.status}`);
      }

      const data: { content: string; encoding: string } = await response.json();

      // Decode base64 content
      if (data.encoding === 'base64') {
        return decodeURIComponent(escape(atob(data.content.replace(/\n/g, ''))));
      }

      return data.content;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network failure while fetching file content');
    }
  }

  /**
   * Create a new file
   *
   * @param request - File upload request
   */
  private async createFile(request: FileUploadRequest): Promise<void> {
    const content = btoa(unescape(encodeURIComponent(request.content)));

    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}/contents/${request.path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: request.message,
          content,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create file: ${response.status} ${response.statusText}`);
    }
  }

  /**
   * Update an existing file
   *
   * @param request - File upload request
   * @param sha - Current file SHA
   */
  private async updateFile(request: FileUploadRequest, sha: string): Promise<void> {
    const content = btoa(unescape(encodeURIComponent(request.content)));

    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}/contents/${request.path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: request.message,
          content,
          sha,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update file: ${response.status} ${response.statusText}`);
    }
  }
}
