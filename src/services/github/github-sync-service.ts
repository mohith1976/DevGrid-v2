/**
 * GitHub Sync Service
 * Orchestrates end-to-end workflow: submission → markdown → GitHub upload
 */

import { Submission } from '../../domain/submission';
import { generateMarkdown } from '../markdown/markdown-generator';
import { getCurrentConfig } from './github-config-service';
import { GitHubClient } from './github-client';
import { generateFolderName, generateSolutionFileName } from '../../utils/file-naming';

/**
 * Sync accepted submission to GitHub
 *
 * Orchestrates the complete workflow:
 * 1. Load GitHub configuration
 * 2. Generate folder name
 * 3. Generate markdown
 * 4. Upload README.md to problem folder
 * 5. Upload solution file to problem folder
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

    // Step 2: Generate folder name
    const folderName = generateFolderName(submission.questionId, submission.slug);

    // Step 3: Generate markdown
    const markdown = generateMarkdown(submission);

    // Step 4: Generate solution file name
    const solutionFileName = generateSolutionFileName(
      submission.questionId,
      submission.slug,
      submission.language
    );

    // Step 5: Upload files
    const client = new GitHubClient(config);

    // Upload README.md
    await client.createOrUpdateFile({
      path: `${folderName}/README.md`,
      content: markdown,
      message: `Add solution: ${submission.title}`,
    });

    // Upload solution file
    await client.createOrUpdateFile({
      path: `${folderName}/${solutionFileName}`,
      content: submission.code,
      message: `Add solution: ${submission.title}`,
    });

    console.log('[GitHub Sync] README uploaded');
    console.log('[GitHub Sync] Solution file uploaded');
    console.log('[GitHub Sync] Upload complete');
  } catch (error) {
    if (error instanceof Error) {
      console.error('[GitHub Sync] Upload failed:', error.message);
    } else {
      console.error('[GitHub Sync] Upload failed: Unknown error');
    }
  }
}
