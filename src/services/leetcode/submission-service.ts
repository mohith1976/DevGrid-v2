/**
 * Submission Service
 * Handles fetching and mapping LeetCode submission data
 */

import { Submission } from '../../domain/submission';
import { executeGraphQLQuery } from './graphql-client';
import { SUBMISSION_DETAILS_QUERY, SubmissionDetailsResponse } from './queries';

/**
 * Fetch submission details from LeetCode GraphQL API
 *
 * @param submissionId - The submission ID to fetch
 * @returns Promise resolving to a Submission domain object
 * @throws Error if the request fails or data is invalid
 */
export async function fetchSubmissionDetails(submissionId: string): Promise<Submission> {
  console.log(`[SubmissionService] Fetching details for submission: ${submissionId}`);

  try {
    // Convert submissionId to number for GraphQL
    const submissionIdNum = parseInt(submissionId, 10);

    if (isNaN(submissionIdNum)) {
      throw new Error(`Invalid submission ID: ${submissionId}`);
    }

    // Execute GraphQL query
    const response = await executeGraphQLQuery<SubmissionDetailsResponse['data']>(
      SUBMISSION_DETAILS_QUERY,
      { submissionId: submissionIdNum },
      'submissionDetails'
    );

    // Map GraphQL response to domain model
    const submission = mapToSubmission(submissionId, response);

    console.log('[SubmissionService] Successfully fetched submission:', {
      submissionId: submission.submissionId,
      title: submission.title,
      language: submission.language,
      statusCode: submission.statusCode,
    });

    return submission;
  } catch (error) {
    console.error('[SubmissionService] Failed to fetch submission:', error);
    throw error;
  }
}

/**
 * Map GraphQL response to Submission domain model
 *
 * @param submissionId - The submission ID
 * @param data - GraphQL response data
 * @returns Submission domain object
 * @throws Error if required fields are missing
 */
function mapToSubmission(
  submissionId: string,
  data: SubmissionDetailsResponse['data']
): Submission {
  const details = data.submissionDetails;

  if (!details) {
    throw new Error('Submission details not found in response');
  }

  if (!details.question) {
    throw new Error('Question details not found in response');
  }

  if (!details.lang) {
    throw new Error('Language details not found in response');
  }

  // Extract language name from lang object
  const language = details.lang.name;

  // Runtime and memory are already numbers in the response
  const runtime = details.runtime;
  const memory = details.memory;

  // Generate title from titleSlug (convert "two-sum" to "Two Sum")
  const title = generateTitleFromSlug(details.question.titleSlug);

  console.log('[SubmissionService] Mapping response:', {
    questionId: details.question.questionId,
    titleSlug: details.question.titleSlug,
    generatedTitle: title,
    langType: typeof details.lang,
    langValue: details.lang,
    runtimeType: typeof details.runtime,
    runtimeValue: details.runtime,
    memoryType: typeof details.memory,
    memoryValue: details.memory,
    statusCode: details.statusCode,
  });

  return {
    submissionId,
    questionId: details.question.questionId,
    title,
    slug: details.question.titleSlug,
    language,
    code: details.code,
    runtime,
    memory,
    statusCode: details.statusCode,
  };
}

/**
 * Generate a title from a slug
 * Converts "two-sum" to "Two Sum"
 *
 * @param slug - The question slug
 * @returns Formatted title
 */
function generateTitleFromSlug(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
