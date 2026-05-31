/**
 * Repository README Generator
 * Generates repository-level README with statistics
 */

import { getAllSyncedSubmissions, SyncedSubmission } from '../storage/submission-tracking';
import { formatMemory } from './markdown-generator';

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
    .sort((a, b) => b.syncedAt - a.syncedAt)
    .slice(0, limit);
}

/**
 * Format repository README
 */
function formatRepositoryReadme(
  stats: ReturnType<typeof calculateStatistics>,
  recentSubmissions: SyncedSubmission[],
  allSubmissions: SyncedSubmission[]
): string {
  // Difficulty badges
  const easyCount = stats.difficultyBreakdown['Easy'] || 0;
  const mediumCount = stats.difficultyBreakdown['Medium'] || 0;
  const hardCount = stats.difficultyBreakdown['Hard'] || 0;
  
  // Language statistics with percentages
  const languageStats = Object.entries(stats.languageBreakdown)
    .sort((a, b) => b[1] - a[1])
    .map(([lang, count]) => {
      const percentage = ((count / stats.totalSolved) * 100).toFixed(1);
      const dots = '.'.repeat(Math.max(1, 15 - lang.length));
      return `${lang} ${dots} ${percentage}% (${count})`;
    })
    .join('\n');
  
  // Top topics (top 10)
  const topTopics = Object.entries(stats.topicBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([topic, count]) => `- **${topic}** (${count})`)
    .join('\n');
  
  // Recent submissions
  const recentTable = recentSubmissions
    .map((sub, idx) => {
      const runtimeStr = `${sub.runtime}ms`;
      const memoryStr = formatMemory(sub.memory);
      const difficultyBadge = getDifficultyBadge(sub.difficulty);
      return `${idx + 1}. [${sub.title}](./${sub.folderName}) ${difficultyBadge} - ${sub.language} - ${runtimeStr} - ${memoryStr}`;
    })
    .join('\n');
  
  // All problems table
  const allProblemsTable = allSubmissions
    .sort((a, b) => parseInt(a.questionId) - parseInt(b.questionId))
    .map((sub) => {
      const runtimeStr = `${sub.runtime}ms`;
      const memoryStr = formatMemory(sub.memory);
      const difficultyBadge = getDifficultyBadge(sub.difficulty);
      const topics = Array.isArray(sub.topics) ? sub.topics : [];
      const topicsStr = topics.slice(0, 3).map(t => t.name).join(', ');
      return `| ${sub.questionId} | [${sub.title}](./${sub.folderName}) | ${difficultyBadge} | ${sub.language} | ${topicsStr} | ${runtimeStr} | ${memoryStr} |`;
    })
    .join('\n');
  
  const lastUpdated = new Date().toISOString().split('T')[0];
  
  return `# 🚀 LeetCode Solutions

![Total Solved](https://img.shields.io/badge/Total-${stats.totalSolved}-brightgreen)
![Unique Problems](https://img.shields.io/badge/Problems-${stats.uniqueProblems}-blue)
![Languages](https://img.shields.io/badge/Languages-${Object.keys(stats.languageBreakdown).length}-orange)
![Easy](https://img.shields.io/badge/Easy-${easyCount}-success)
![Medium](https://img.shields.io/badge/Medium-${mediumCount}-yellow)
![Hard](https://img.shields.io/badge/Hard-${hardCount}-red)

## 📊 Statistics

- **Total Solutions**: ${stats.totalSolved}
- **Unique Problems**: ${stats.uniqueProblems}
- **Easy**: ${easyCount}
- **Medium**: ${mediumCount}
- **Hard**: ${hardCount}

## 💻 Languages

\`\`\`
${languageStats}
\`\`\`

## 🏷️ Top Topics

${topTopics}

## 🔥 Recent Submissions

${recentTable}

## 📁 All Problems

| # | Title | Difficulty | Language | Topics | Runtime | Memory |
|---|-------|------------|----------|--------|---------|--------|
${allProblemsTable}

## 📂 Repository Structure

Each problem is organized in its own folder:
\`\`\`
<problem-id>-<problem-slug>/
├── README.md          # Problem description and solution details
└── <problem-id>-<problem-slug>.<ext>  # Solution code
\`\`\`

Example:
\`\`\`
0001-two-sum/
├── README.md
└── 0001-two-sum.java
\`\`\`

---

*Last updated: ${lastUpdated}*
*Auto-generated by [DevGrid](https://github.com/yourusername/devgrid)*
`;
}

/**
 * Get difficulty badge emoji
 */
function getDifficultyBadge(difficulty: string): string {
  switch (difficulty) {
    case 'Easy':
      return '🟢';
    case 'Medium':
      return '🟡';
    case 'Hard':
      return '🔴';
    default:
      return '⚪';
  }
}

/**
 * Generate empty README for new repository
 */
function generateEmptyReadme(): string {
  return `# 🚀 LeetCode Solutions

![Total Solved](https://img.shields.io/badge/Total-0-brightgreen)

## 📊 Statistics

No solutions synced yet. Start solving problems on LeetCode!

---

*Last updated: ${new Date().toISOString().split('T')[0]}*
*Auto-generated by [DevGrid](https://github.com/yourusername/devgrid)*
`;
}
