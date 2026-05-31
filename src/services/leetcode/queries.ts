/**
 * LeetCode GraphQL Queries
 * Contains all GraphQL operations for LeetCode API
 */

/**
 * GraphQL query to fetch submission details
 * This is the EXACT query from LeetCode's actual network traffic
 */
export const SUBMISSION_DETAILS_QUERY = `
  query submissionDetails($submissionId: Int!) {
    submissionDetails(submissionId: $submissionId) {
      runtime
      runtimeDisplay
      runtimePercentile
      runtimeDistribution
      memory
      memoryDisplay
      memoryPercentile
      memoryDistribution
      code
      timestamp
      statusCode
      aiJudgeMessage
      isCompiledLang
      lang {
        name
        verboseName
      }
      aiRecheckSubmitted
      user {
        username
        profile {
          realName
          userAvatar
        }
      }
      question {
        questionId
        titleSlug
        hasFrontendPreview
      }
      notes
      flagType
      topicTags {
        tagId
        slug
        name
      }
      runtimeError
      compileError
      lastTestcase
      codeOutput
      expectedOutput
      totalCorrect
      totalTestcases
      fullCodeOutput
      testDescriptions
      testBodies
      testInfo
      stdOutput
    }
  }
`;

/**
 * Language object from LeetCode response
 */
export interface LeetCodeLanguage {
  name: string;
  verboseName: string;
}

/**
 * User profile from LeetCode response
 */
export interface LeetCodeUserProfile {
  realName: string;
  userAvatar: string;
}

/**
 * User object from LeetCode response
 */
export interface LeetCodeUser {
  username: string;
  profile: LeetCodeUserProfile;
}

/**
 * Question object from LeetCode response
 */
export interface LeetCodeQuestion {
  questionId: string;
  titleSlug: string;
  hasFrontendPreview: boolean;
}

/**
 * Topic tag object from LeetCode response
 */
export interface LeetCodeTopicTag {
  tagId: string;
  slug: string;
  name: string;
}

/**
 * GraphQL response type for submissionDetails query
 * Updated to match actual LeetCode API response schema
 */
export interface SubmissionDetailsResponse {
  data: {
    submissionDetails: {
      runtime: number;
      runtimeDisplay: string;
      runtimePercentile: number;
      runtimeDistribution: string;
      memory: number;
      memoryDisplay: string;
      memoryPercentile: number;
      memoryDistribution: string;
      code: string;
      timestamp: string;
      statusCode: number;
      aiJudgeMessage: string | null;
      isCompiledLang: boolean;
      lang: LeetCodeLanguage;
      aiRecheckSubmitted: boolean | null;
      user: LeetCodeUser;
      question: LeetCodeQuestion;
      notes: string;
      flagType: string | null;
      topicTags: LeetCodeTopicTag[];
      runtimeError: string | null;
      compileError: string | null;
      lastTestcase: string;
      codeOutput: string[];
      expectedOutput: string[];
      totalCorrect: number;
      totalTestcases: number;
      fullCodeOutput: string[];
      testDescriptions: string;
      testBodies: string;
      testInfo: string;
      stdOutput: string[];
    };
  };
}
