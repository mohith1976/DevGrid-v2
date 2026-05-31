/**
 * Markdown Templates
 * Contains all markdown formatting templates
 */

/**
 * Main markdown template for a submission
 *
 * @param title - Problem title
 * @param problemUrl - LeetCode problem URL
 * @param language - Programming language
 * @param runtime - Runtime in milliseconds
 * @param memory - Formatted memory string
 * @param code - Solution code
 * @param languageFence - Language identifier for code fence
 * @returns Complete markdown document
 */
export function submissionTemplate(
  title: string,
  problemUrl: string,
  language: string,
  runtime: string,
  memory: string,
  code: string,
  languageFence: string
): string {
  return `# ${title}

## Problem

${problemUrl}

## Language

${language}

## Runtime

${runtime}

## Memory

${memory}

## Solution

\`\`\`${languageFence}
${code}
\`\`\`
`;
}
