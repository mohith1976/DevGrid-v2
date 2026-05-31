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
  
  const languageBreakdown: Record<string, number> = {};
  const problemsById: Record<string, SyncedSubmission> = {};
  
  for (const sub of submissions) {
    // Count languages
    languageBreakdown[sub.language] = (languageBreakdown[sub.language] || 0) + 1;
    
    // Track unique problems
    problemsById[sub.questionId] = sub;
  }
  
  const uniqueProblems = Object.keys(problemsById).length;
  
  return {
    totalSolved,
    uniqueProblems,
    languageBreakdown,
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
  const languageTable = Object.entries(stats.languageBreakdown)
    .sort((a, b) => b[1] - a[1])
    .map(([lang, count]) => `| ${lang} | ${count} |`)
    .join('\n');
  
  const recentTable = recentSubmissions
    .map((sub, idx) => {
      const runtimeStr = `${sub.runtime}ms`;
      const memoryStr = formatMemory(sub.memory);
      return `${idx + 1}. [${sub.title}](./${sub.folderName}) - ${sub.language} - ${runtimeStr} - ${memoryStr}`;
    })
    .join('\n');
  
  const allProblemsTable = allSubmissions
    .sort((a, b) => parseInt(a.questionId) - parseInt(b.questionId))
    .map((sub) => {
      const runtimeStr = `${sub.runtime}ms`;
      const memoryStr = formatMemory(sub.memory);
      return `| ${sub.questionId} | [${sub.title}](./${sub.folderName}) | ${sub.language} | ${runtimeStr} | ${memoryStr} |`;
    })
    .join('\n');
  
  const lastUpdated = new Date().toISOString().split('T')[0];
  
  return `# LeetCode Solutions

![Total Solved](https://img.shields.io/badge/Total-${stats.totalSolved}-brightgreen)
![Unique Problems](https://img.shields.io/badge/Problems-${stats.uniqueProblems}-blue)
![Languages](https://img.shields.io/badge/Languages-${Object.keys(stats.languageBreakdown).length}-orange)

## 📊 Statistics

- **Total Solutions**: ${stats.totalSolved}
- **Unique Problems**: ${stats.uniqueProblems}

## 💻 Languages

| Language | Solutions |
|----------|-----------|
${languageTable}

## 🔥 Recent Submissions

${recentTable}

## 📁 All Problems

| # | Title | Language | Runtime | Memory |
|---|-------|----------|---------|--------|
${allProblemsTable}

---

*Last updated: ${lastUpdated}*
`;
}

/**
 * Generate empty README for new repository
 */
function generateEmptyReadme(): string {
  return `# LeetCode Solutions

![Total Solved](https://img.shields.io/badge/Total-0-brightgreen)

## 📊 Statistics

No solutions synced yet. Start solving problems on LeetCode!

---

*Last updated: ${new Date().toISOString().split('T')[0]}*
`;
}
