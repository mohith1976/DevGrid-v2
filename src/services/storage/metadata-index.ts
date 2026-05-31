/**
 * Metadata Index Service
 * Manages .devgrid/index.json on GitHub as single source of truth
 */

import { Submission, TopicTag } from '../../domain/submission';

/**
 * Submission metadata stored in index
 */
export interface SubmissionMetadata {
  questionId: string;
  title: string;
  slug: string;
  difficulty: string;
  language: string;
  runtime: number;
  memory: number;
  topics: TopicTag[];
  folderName: string;
  lastUpdated: number;
}

/**
 * Metadata index structure
 */
export interface MetadataIndex {
  submissions: Record<string, SubmissionMetadata>; // key: questionId-language
  lastUpdated: number;
  version: string;
}

/**
 * Create empty metadata index
 */
export function createEmptyIndex(): MetadataIndex {
  return {
    submissions: {},
    lastUpdated: Date.now(),
    version: '1.0.0',
  };
}

/**
 * Add or update submission in index
 *
 * @param index - Current metadata index
 * @param submission - Submission to add/update
 * @param folderName - Folder name where submission is stored
 * @returns Updated metadata index
 */
export function updateSubmissionInIndex(
  index: MetadataIndex,
  submission: Submission,
  folderName: string
): MetadataIndex {
  const key = `${submission.questionId}-${submission.language}`;

  const metadata: SubmissionMetadata = {
    questionId: submission.questionId,
    title: submission.title,
    slug: submission.slug,
    difficulty: submission.difficulty,
    language: submission.language,
    runtime: submission.runtime,
    memory: submission.memory,
    topics: submission.topics,
    folderName,
    lastUpdated: Date.now(),
  };

  return {
    ...index,
    submissions: {
      ...index.submissions,
      [key]: metadata,
    },
    lastUpdated: Date.now(),
  };
}

/**
 * Get all submissions from index
 *
 * @param index - Metadata index
 * @returns Array of submission metadata
 */
export function getAllSubmissions(index: MetadataIndex): SubmissionMetadata[] {
  return Object.values(index.submissions);
}

/**
 * Calculate statistics from index
 */
export interface IndexStatistics {
  totalSolved: number;
  uniqueProblems: number;
  difficultyBreakdown: Record<string, number>;
  languageBreakdown: Record<string, number>;
  topicBreakdown: Record<string, number>;
}

/**
 * Calculate statistics from metadata index
 *
 * @param index - Metadata index
 * @returns Statistics object
 */
export function calculateStatistics(index: MetadataIndex): IndexStatistics {
  const submissions = getAllSubmissions(index);

  const totalSolved = submissions.length;

  // Count unique problems
  const problemsById: Record<string, SubmissionMetadata> = {};
  for (const sub of submissions) {
    problemsById[sub.questionId] = sub;
  }
  const uniqueProblems = Object.keys(problemsById).length;

  // Count by difficulty
  const difficultyBreakdown: Record<string, number> = {};
  for (const sub of submissions) {
    difficultyBreakdown[sub.difficulty] = (difficultyBreakdown[sub.difficulty] || 0) + 1;
  }

  // Count by language
  const languageBreakdown: Record<string, number> = {};
  for (const sub of submissions) {
    languageBreakdown[sub.language] = (languageBreakdown[sub.language] || 0) + 1;
  }

  // Count by topic
  const topicBreakdown: Record<string, number> = {};
  for (const sub of submissions) {
    for (const topic of sub.topics) {
      topicBreakdown[topic.name] = (topicBreakdown[topic.name] || 0) + 1;
    }
  }

  return {
    totalSolved,
    uniqueProblems,
    difficultyBreakdown,
    languageBreakdown,
    topicBreakdown,
  };
}

/**
 * Get recent submissions sorted by lastUpdated
 *
 * @param index - Metadata index
 * @param limit - Maximum number of submissions to return
 * @returns Array of recent submissions
 */
export function getRecentSubmissions(
  index: MetadataIndex,
  limit: number
): SubmissionMetadata[] {
  return getAllSubmissions(index)
    .sort((a, b) => b.lastUpdated - a.lastUpdated)
    .slice(0, limit);
}

/**
 * Serialize index to JSON string
 *
 * @param index - Metadata index
 * @returns JSON string
 */
export function serializeIndex(index: MetadataIndex): string {
  return JSON.stringify(index, null, 2);
}

/**
 * Parse index from JSON string
 *
 * @param json - JSON string
 * @returns Metadata index
 */
export function parseIndex(json: string): MetadataIndex {
  try {
    const parsed = JSON.parse(json);
    
    // Validate structure
    if (!parsed.submissions || !parsed.lastUpdated || !parsed.version) {
      throw new Error('Invalid index structure');
    }
    
    return parsed as MetadataIndex;
  } catch (error) {
    // If parsing fails, return empty index
    return createEmptyIndex();
  }
}

