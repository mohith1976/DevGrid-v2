/**
 * GitHub Sync Service
 * Orchestrates end-to-end workflow: submission → markdown → GitHub upload
 */

import { Submission } from '../../domain/submission';
import { generateMarkdown } from '../markdown/markdown-generator';
import { getCurrentConfig } from './github-config-service';
import { GitHubClient } from './github-client';
import { generateFolderName, generateSolutionFileName } from '../../utils/file-naming';
import { trackSubmission, isSubmissionSynced } from '../storage/submission-tracking';
import { generateRepositoryReadme } from '../markdown/repository-readme-generator';
import {
  createEmptyIndex,
  updateSubmissionInIndex,
  serializeIndex,
  parseIndex,
  MetadataIndex,
} from '../storage/metadata-index';
import {
  hasRepositoryMetadataBeenUpdated,
  markRepositoryMetadataAsUpdated,
  saveRepositoryInfo,
} from '../storage/github-storage';

/**
 * Sync accepted submission to GitHub
 *
 * Orchestrates the complete workflow:
 * 1. Load GitHub configuration
 * 2. Check if submission already synced (determine Add vs Update)
 * 3. Generate folder name
 * 4. Generate markdown
 * 5. Upload README.md to problem folder
 * 6. Upload solution file to problem folder
 * 7. Track submission in local cache
 * 8. Update .devgrid/index.json on GitHub
 * 9. Update repository README
 *
 * @param submission - Accepted submission to sync
 * @returns Promise that resolves when sync is complete
 */
export async function syncSubmissionToGitHub(submission: Submission): Promise<void> {
  console.log('[GitHub Sync] Starting upload');

  try {
    // Step 1: Load GitHub configuration
    const config = await getCurrentConfig();

    if (!config) {
      console.log('[GitHub Sync] No GitHub configuration found');
      return;
    }

    console.log('[GitHub Sync] Configuration loaded:', `${config.owner}/${config.repo}`);

    // Step 2: Check if already synced
    const alreadySynced = await isSubmissionSynced(submission.questionId, submission.language);
    const operation = alreadySynced ? 'Update' : 'Add';

    // Step 3: Generate folder name
    const folderName = generateFolderName(submission.questionId, submission.slug);

    // Step 4: Generate markdown
    const markdown = generateMarkdown(submission);

    // Step 5: Generate solution file name
    const solutionFileName = generateSolutionFileName(
      submission.questionId,
      submission.slug,
      submission.language
    );

    // Step 6: Generate commit message
    const commitMessage = generateCommitMessage(
      operation,
      submission.title,
      submission.language,
      submission.runtime,
      submission.runtimePercentile,
      submission.memory,
      submission.memoryPercentile
    );

    // Step 7: Upload files
    const client = new GitHubClient(config);

    // Upload README.md
    await client.createOrUpdateFile({
      path: `${folderName}/README.md`,
      content: markdown,
      message: commitMessage,
    });

    // Upload solution file
    await client.createOrUpdateFile({
      path: `${folderName}/${solutionFileName}`,
      content: submission.code,
      message: commitMessage,
    });

    console.log('[GitHub Sync] README uploaded');
    console.log('[GitHub Sync] Solution file uploaded');

    // Step 8: Track submission in local cache
    await trackSubmission(submission, folderName);

    // Step 9: Update .devgrid/index.json on GitHub
    await updateMetadataIndex(client, submission, folderName);

    // Step 10: Update repository README
    // Delay to ensure chrome.storage.local write completes
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const repositoryReadme = await generateRepositoryReadme();
    await client.createOrUpdateFile({
      path: 'README.md',
      content: repositoryReadme,
      message: `Update repository statistics`,
    });

    console.log('[GitHub Sync] Repository README updated');
    console.log('[GitHub Sync] Upload complete');
    
    // Step 11: Update repository metadata (description, homepage, topics) after first sync
    await updateRepositoryMetadataIfNeeded(client);
  } catch (error) {
    if (error instanceof Error) {
      console.error('[GitHub Sync] Upload failed:', error.message);
    } else {
      console.error('[GitHub Sync] Upload failed: Unknown error');
    }
  }
}

/**
 * Update metadata index on GitHub
 *
 * @param client - GitHub client
 * @param submission - Submission to add to index
 * @param folderName - Folder name where submission is stored
 */
async function updateMetadataIndex(
  client: GitHubClient,
  submission: Submission,
  folderName: string
): Promise<void> {
  try {
    // Try to fetch existing index
    let index: MetadataIndex;
    
    try {
      const existingContent = await client.getFileContent('.devgrid/index.json');
      index = parseIndex(existingContent);
    } catch {
      // Index doesn't exist, create new one
      index = createEmptyIndex();
    }

    // Update index with new submission
    index = updateSubmissionInIndex(index, submission, folderName);

    // Serialize and upload
    const indexContent = serializeIndex(index);
    await client.createOrUpdateFile({
      path: '.devgrid/index.json',
      content: indexContent,
      message: `Update metadata index`,
    });

    console.log('[GitHub Sync] Metadata index updated');
  } catch (error) {
    console.error('[GitHub Sync] Failed to update metadata index:', error);
    // Don't throw - this is not critical for the sync to succeed
  }
}

/**
 * Update repository metadata (description, homepage, topics) if not already done
 * Only runs once after the first successful sync
 *
 * @param client - GitHub client
 */
async function updateRepositoryMetadataIfNeeded(client: GitHubClient): Promise<void> {
  try {
    // Check if we've already updated the metadata
    const alreadyUpdated = await hasRepositoryMetadataBeenUpdated();
    
    if (alreadyUpdated) {
      console.log('[GitHub Sync] Repository metadata already updated, skipping');
      return;
    }

    console.log('[GitHub Sync] Updating repository metadata for first time');
    
    // Update repository metadata
    await client.updateRepositoryMetadata();
    
    // Mark as updated so we don't do it again
    await markRepositoryMetadataAsUpdated();
    
    // Refresh repository info in storage
    const repoInfo = await client.getRepository();
    await saveRepositoryInfo(repoInfo);
    
    console.log('[GitHub Sync] Repository metadata updated successfully');
  } catch (error) {
    console.error('[GitHub Sync] Failed to update repository metadata:', error);
    // Don't throw - this is not critical for the sync to succeed
  }
}

/**
 * Generate commit message with runtime and memory statistics
 * Format: Time: X ms (XX.XX%), Space: X MB (XX.XX%) - DevGrid
 *
 * @param _operation - "Add" or "Update" (unused but kept for API consistency)
 * @param _title - Problem title (unused but kept for API consistency)
 * @param _language - Programming language (unused but kept for API consistency)
 * @param runtime - Runtime in milliseconds
 * @param runtimePercentile - Runtime percentile (0-100)
 * @param memory - Memory in bytes
 * @param memoryPercentile - Memory percentile (0-100)
 * @returns Formatted commit message
 */
function generateCommitMessage(
  _operation: 'Add' | 'Update',
  _title: string,
  _language: string,
  runtime: number,
  runtimePercentile: number | undefined,
  memory: number,
  memoryPercentile: number | undefined
): string {
  const runtimeStr = `${runtime} ms`;
  const runtimePercent = runtimePercentile !== undefined ? `${runtimePercentile.toFixed(2)}%` : 'N/A';
  
  const memoryMB = (memory / (1024 * 1024)).toFixed(1);
  const memoryPercent = memoryPercentile !== undefined ? `${memoryPercentile.toFixed(2)}%` : 'N/A';
  
  return `Time: ${runtimeStr} (${runtimePercent}), Space: ${memoryMB} MB (${memoryPercent}) - DevGrid`;
}
