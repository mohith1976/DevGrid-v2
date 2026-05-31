/**
 * GitHub Sync Service
 * Orchestrates end-to-end workflow: submission → markdown → GitHub upload
 */

import { Submission } from '../../domain/submission';
import { generateMarkdown, formatMemory } from '../markdown/markdown-generator';
import { getCurrentConfig } from './github-config-service';
import { GitHubClient } from './github-client';
import { generateFolderName, generateSolutionFileName } from '../../utils/file-naming';
import { trackSubmission, isSubmissionSynced } from '../storage/submission-tracking';
import { generateRepositoryReadme } from '../markdown/repository-readme-generator';

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
 * 7. Track submission
 * 8. Update repository README
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
      submission.memory
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

    // Step 8: Track submission
    await trackSubmission(submission, folderName);

    // Step 9: Update repository README
    const repositoryReadme = await generateRepositoryReadme();
    await client.createOrUpdateFile({
      path: 'README.md',
      content: repositoryReadme,
      message: `Update repository statistics`,
    });

    console.log('[GitHub Sync] Repository README updated');
    console.log('[GitHub Sync] Upload complete');
  } catch (error) {
    if (error instanceof Error) {
      console.error('[GitHub Sync] Upload failed:', error.message);
    } else {
      console.error('[GitHub Sync] Upload failed: Unknown error');
    }
  }
}

/**
 * Generate commit message with runtime and memory statistics
 *
 * @param operation - "Add" or "Update"
 * @param title - Problem title
 * @param language - Programming language
 * @param runtime - Runtime in milliseconds
 * @param memory - Memory in bytes
 * @returns Formatted commit message
 */
function generateCommitMessage(
  operation: 'Add' | 'Update',
  title: string,
  language: string,
  runtime: number,
  memory: number
): string {
  const runtimeStr = `${runtime}ms`;
  const memoryStr = formatMemory(memory);
  return `${operation}: ${title} [${language}] | Runtime: ${runtimeStr} | Memory: ${memoryStr}`;
}
