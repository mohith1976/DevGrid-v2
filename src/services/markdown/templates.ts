/**
 * Markdown Templates
 * Contains all markdown formatting templates
 */

/**
 * Main markdown template for a submission
 *
 * @param title - Problem title
 * @param problemUrl - LeetCode problem URL
 * @param difficulty - Problem difficulty (Easy, Medium, Hard)
 * @param topics - Array of topic names
 * @param language - Programming language
 * @param runtime - Runtime in milliseconds
 * @param memory - Formatted memory string
 * @param submissionDate - Submission date string
 * @param code - Solution code
 * @param languageFence - Language identifier for code fence
 * @returns Complete markdown document
 */
export function submissionTemplate(
  title: string,
  problemUrl: string,
  difficulty: string,
  topics: string[],
  language: string,
  runtime: string,
  memory: string,
  submissionDate: string,
  code: string,
  languageFence: string
): string {
  const difficultyBadge = getDifficultyBadge(difficulty);
  const topicBadges = topics.map(topic => `\`${topic}\``).join(' ');
  
  return `# ${title}

${difficultyBadge}

## Problem

[View on LeetCode](${problemUrl})

## Difficulty

**${difficulty}**

## Topics

${topicBadges}

## Language

${language}

## Performance

- **Runtime**: ${runtime}
- **Memory**: ${memory}

## Submission Date

${submissionDate}

## Solution

\`\`\`${languageFence}
${code}
\`\`\`
`;
}

/**
 * Get difficulty badge for markdown
 */
function getDifficultyBadge(difficulty: string): string {
  switch (difficulty) {
    case 'Easy':
      return '![Difficulty](https://img.shields.io/badge/Difficulty-Easy-success)';
    case 'Medium':
      return '![Difficulty](https://img.shields.io/badge/Difficulty-Medium-yellow)';
    case 'Hard':
      return '![Difficulty](https://img.shields.io/badge/Difficulty-Hard-red)';
    default:
      return '![Difficulty](https://img.shields.io/badge/Difficulty-Unknown-lightgrey)';
  }
}
