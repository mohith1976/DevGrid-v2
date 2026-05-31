/**
 * LeetCode GraphQL Client
 * Handles communication with LeetCode's GraphQL API
 */

/**
 * LeetCode GraphQL endpoint
 */
const LEETCODE_GRAPHQL_ENDPOINT = 'https://leetcode.com/graphql';

/**
 * Extract CSRF token from cookies
 * LeetCode stores the CSRF token in a cookie named 'csrftoken'
 *
 * @returns CSRF token or null if not found
 */
function getCsrfToken(): string | null {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrftoken') {
      return value;
    }
  }
  return null;
}

/**
 * GraphQL request variables
 */
export interface GraphQLVariables {
  [key: string]: string | number | boolean | null;
}

/**
 * GraphQL error response
 */
export interface GraphQLError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: string[];
}

/**
 * GraphQL response wrapper
 */
export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

/**
 * Execute a GraphQL query against LeetCode's API
 *
 * @param query - The GraphQL query string
 * @param variables - Query variables
 * @param operationName - Optional operation name for the query
 * @returns Promise resolving to the response data
 * @throws Error if the request fails or returns errors
 */
export async function executeGraphQLQuery<T>(
  query: string,
  variables: GraphQLVariables = {},
  operationName?: string
): Promise<T> {
  console.log('[GraphQL] Executing query with variables:', variables);

  try {
    // Extract CSRF token from cookies if available
    const csrfToken = getCsrfToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Referer': 'https://leetcode.com/',
    };

    // Add CSRF token if available
    if (csrfToken) {
      headers['x-csrftoken'] = csrfToken;
    }

    // Build request payload
    const payload: {
      query: string;
      variables: GraphQLVariables;
      operationName?: string;
    } = {
      query,
      variables,
    };

    // Add operationName if provided
    if (operationName) {
      payload.operationName = operationName;
    }

    // Debug logging
    console.log('[GraphQL] Payload:', {
      operationName: payload.operationName,
      query: payload.query,
      variables: payload.variables,
    });

    const response = await fetch(LEETCODE_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
    }

    const result: GraphQLResponse<T> = await response.json();

    console.log('[GraphQL] Response received:', result);

    // Check for GraphQL errors
    if (result.errors && result.errors.length > 0) {
      const errorMessages = result.errors.map((err) => err.message).join(', ');
      throw new Error(`GraphQL errors: ${errorMessages}`);
    }

    // Check if data exists
    if (!result.data) {
      throw new Error('GraphQL response contains no data');
    }

    return result.data;
  } catch (error) {
    console.error('[GraphQL] Request failed:', error);
    throw error;
  }
}
