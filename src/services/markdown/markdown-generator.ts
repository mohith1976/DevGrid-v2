/**
 * Markdown Generator
 * Generates markdown content from Submission domain objects
 */

import { Submission } from '../../domain/submission';
import { submissionTemplate } from './templates';

/**
 * Language mapping for markdown code fences
 * Maps LeetCode language identifiers to markdown code fence identifiers
 */
const LANGUAGE_FENCE_MAP: Record<string, string> = {
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  'c++': 'cpp',
  python: 'python',
  python3: 'python',
  javascript: 'javascript',
  typescript: 'typescript',
  csharp: 'csharp',
  'c#': 'csharp',
  go: 'go',
  golang: 'go',
  rust: 'rust',
  ruby: 'ruby',
  swift: 'swift',
  kotlin: 'kotlin',
  scala: 'scala',
  php: 'php',
  mysql: 'sql',
  mssql: 'sql',
  oraclesql: 'sql',
  postgresql: 'sql',
  bash: 'bash',
  shell: 'bash',
};

/**
 * Format memory from bytes to human-readable string
 *
 * @param bytes - Memory in bytes
 * @returns Formatted memory string (e.g., "47.3 MB")
 */
export function formatMemory(bytes: number): string {
  if (bytes === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;

  // Find the appropriate unit
  let unitIndex = 0;
  let value = bytes;

  while (value >= k && unitIndex < units.length - 1) {
    value /= k;
    unitIndex++;
  }

  // Format with 1 decimal place for MB/GB, no decimals for B/KB
  const formatted = unitIndex >= 2 ? value.toFixed(1) : Math.round(value).toString();

  return `${formatted} ${units[unitIndex]}`;
}

/**
 * Get markdown code fence language identifier
 *
 * @param language - LeetCode language identifier
 * @returns Markdown code fence language
 */
function getLanguageFence(language: string): string {
  const normalized = language.toLowerCase().trim();
  return LANGUAGE_FENCE_MAP[normalized] || normalized;
}

/**
 * Generate problem URL from slug
 *
 * @param slug - Problem slug (e.g., "two-sum")
 * @returns Full LeetCode problem URL
 */
function generateProblemUrl(slug: string): string {
  return `https://leetcode.com/problems/${slug}/`;
}

/**
 * Generate markdown content from a Submission object
 *
 * @param submission - Submission domain object
 * @returns Markdown content as string
 */
export function generateMarkdown(submission: Submission): string {
  try {
    // Format data
    const problemUrl = generateProblemUrl(submission.slug);
    const languageFence = getLanguageFence(submission.language);
    const topics = submission.topics.map(t => t.name);
    const submissionDate = new Date().toISOString().split('T')[0];

    // Generate markdown using template
    const markdown = submissionTemplate(
      submission.title,
      problemUrl,
      submission.difficulty,
      topics,
      submission.language,
      submission.runtime,
      submission.runtimePercentile,
      submission.memory,
      submission.memoryPercentile,
      submissionDate,
      submission.code,
      languageFence
    );

    return markdown;
  } catch (error) {
    console.error('[MarkdownGenerator] Failed to generate markdown:', error);
    throw error;
  }
}
