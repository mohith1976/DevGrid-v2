/**
 * Repository README Generator
 * Generates repository-level README with statistics
 */

import { getAllSyncedSubmissions, SyncedSubmission } from '../storage/submission-tracking';

/**
 * Generate repository-level README
 *
 * @returns Repository README content
 */
export async function generateRepositoryReadme(): Promise<string> {
  const submissions = await getAllSyncedSubmissions();
  
  if (submissions.length === 0) {
    return generateEmptyReadme();
  }
  
  const stats = calculateStatistics(submissions);
  const recentSubmissions = getRecentSubmissions(submissions, 10);
  
  return formatRepositoryReadme(stats, recentSubmissions, submissions);
}

/**
 * Calculate repository statistics
 */
function calculateStatistics(submissions: SyncedSubmission[]) {
  const totalSolved = submissions.length;
  
  const difficultyBreakdown: Record<string, number> = {};
  const languageBreakdown: Record<string, number> = {};
  const topicBreakdown: Record<string, number> = {};
  const problemsById: Record<string, SyncedSubmission> = {};
  
  for (const sub of submissions) {
    // Count difficulties
    difficultyBreakdown[sub.difficulty] = (difficultyBreakdown[sub.difficulty] || 0) + 1;
    
    // Count languages
    languageBreakdown[sub.language] = (languageBreakdown[sub.language] || 0) + 1;
    
    // Count topics (ensure topics is an array)
    const topics = Array.isArray(sub.topics) ? sub.topics : [];
    for (const topic of topics) {
      topicBreakdown[topic.name] = (topicBreakdown[topic.name] || 0) + 1;
    }
    
    // Track unique problems
    problemsById[sub.questionId] = sub;
  }
  
  const uniqueProblems = Object.keys(problemsById).length;
  
  return {
    totalSolved,
    uniqueProblems,
    difficultyBreakdown,
    languageBreakdown,
    topicBreakdown,
  };
}

/**
 * Get recent submissions
 */
function getRecentSubmissions(
  submissions: SyncedSubmission[],
  limit: number
): SyncedSubmission[] {
  return submissions
    .filter(sub => sub.syncedAt && !isNaN(sub.syncedAt)) // Filter out invalid timestamps
    .sort((a, b) => b.syncedAt - a.syncedAt)
    .slice(0, limit);
}

/**
 * Format repository README
 * Minimalist, elegant design
 */
function formatRepositoryReadme(
  stats: ReturnType<typeof calculateStatistics>,
  recentSubmissions: SyncedSubmission[],
  _allSubmissions: SyncedSubmission[]
): string {
  // Difficulty counts
  const easyCount = stats.difficultyBreakdown['Easy'] || 0;
  const mediumCount = stats.difficultyBreakdown['Medium'] || 0;
  const hardCount = stats.difficultyBreakdown['Hard'] || 0;
  
  // Language statistics with visual bars
  const languageStats = Object.entries(stats.languageBreakdown)
    .sort((a, b) => b[1] - a[1])
    .map(([lang, count]) => {
      const percentage = ((count / stats.totalSolved) * 100).toFixed(1);
      const barLength = Math.round((count / stats.totalSolved) * 20);
      const bar = '█'.repeat(barLength) + '░'.repeat(20 - barLength);
      return `${lang.padEnd(15)} ${bar} ${percentage}%`;
    })
    .join('\n');
  
  // Top topics (top 10)
  const topTopics = Object.entries(stats.topicBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([topic, count], idx) => `${(idx + 1).toString().padStart(2)}. ${topic.padEnd(30)} ${count}`)
    .join('\n');
  
  // Recent submissions table
  const recentTable = recentSubmissions
    .map((sub) => {
      const diffEmoji = getDifficultyEmoji(sub.difficulty);
      // Validate syncedAt timestamp
      const timestamp = sub.syncedAt && !isNaN(sub.syncedAt) ? sub.syncedAt : Date.now();
      const date = new Date(timestamp).toISOString().split('T')[0];
      return `| ${diffEmoji} | [${sub.title}](./${sub.folderName}) | ${sub.language} | ${date} |`;
    })
    .join('\n');
  
  const lastUpdated = new Date().toISOString().split('T')[0];
  
  return `# DevGrid LeetCode Archive

Automated LeetCode solutions synchronized to GitHub.

## Statistics

\`\`\`
Total Solved    ${stats.totalSolved}
Easy            ${easyCount}
Medium          ${mediumCount}
Hard            ${hardCount}
\`\`\`

## Languages

\`\`\`
${languageStats}
\`\`\`

## Top Topics

\`\`\`
${topTopics}
\`\`\`

## Recent Activity

|   | Problem | Language | Date |
|---|---------|----------|------|
${recentTable}

## Repository Structure

Problems are organized by ID and slug:

\`\`\`
<id>-<slug>/
  ├── README.md
  └── <id>-<slug>.<ext>
\`\`\`

Example: \`0001-two-sum/README.md\`

---

Last updated: ${lastUpdated}
`;
}

/**
 * Get difficulty emoji (minimal)
 */
function getDifficultyEmoji(difficulty: string): string {
  switch (difficulty) {
    case 'Easy':
      return '●';
    case 'Medium':
      return '●';
    case 'Hard':
      return '●';
    default:
      return '○';
  }
}

/**
 * Generate empty README for new repository
 */
function generateEmptyReadme(): string {
  const lastUpdated = new Date().toISOString().split('T')[0];
  
  return `# DevGrid LeetCode Archive

Automated LeetCode solutions synchronized to GitHub.

## Statistics

\`\`\`
Total Solved    0
Easy            0
Medium          0
Hard            0
\`\`\`

Start solving problems on LeetCode to populate this repository.

---

Last updated: ${lastUpdated}
`;
}
