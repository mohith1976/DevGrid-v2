/**
 * Problem Extractor Service
 * Extracts problem details from LeetCode problem page DOM
 */

import { TopicTag } from '../../domain/submission';

/**
 * Problem details extracted from page
 */
export interface ProblemDetails {
  description: string;
  examples: string[];
  constraints: string[];
  topics: TopicTag[];
}

/**
 * Extract problem details from current LeetCode problem page
 * 
 * @param problemSlug - Problem slug (e.g., "two-sum")
 * @returns Promise resolving to problem details
 */
export async function extractProblemDetails(problemSlug: string): Promise<ProblemDetails> {
  console.log('[ProblemExtractor] Extracting details for:', problemSlug);
  
  // We're on the submission page, extract from current page's DOM
  // LeetCode loads problem data in the page even on submission pages
  return extractFromCurrentPage();
}

/**
 * Extract from current page
 */
function extractFromCurrentPage(): ProblemDetails {
  const details: ProblemDetails = {
    description: '',
    examples: [],
    constraints: [],
    topics: [],
  };
  
  try {
    // Extract topics from topic tags - multiple possible selectors
    const topicSelectors = [
      'a[href^="/tag/"]',
      'a[href*="/tag/"]',
      '.topic-tag a',
      '[class*="topic"] a'
    ];
    
    for (const selector of topicSelectors) {
      const topicElements = document.querySelectorAll(selector);
      if (topicElements.length > 0) {
        details.topics = Array.from(topicElements).map((el, index) => {
          const href = el.getAttribute('href') || '';
          const slug = href.replace('/tag/', '').replace('/', '').trim();
          const name = el.textContent?.trim() || '';
          if (name && slug) {
            return {
              tagId: `topic-${index}`,
              slug,
              name,
            };
          }
          return null;
        }).filter((t): t is TopicTag => t !== null);
        
        if (details.topics.length > 0) {
          console.log('[ProblemExtractor] Found topics:', details.topics.length);
          break;
        }
      }
    }
    
    // Extract problem description - try multiple selectors
    const descriptionSelectors = [
      '[class*="elfjS"]',
      '[data-track-load="description_content"]',
      '.question-content',
      '[class*="content__"] [class*="description"]',
      '[class*="question-description"]'
    ];
    
    for (const selector of descriptionSelectors) {
      const descriptionEl = document.querySelector(selector);
      if (descriptionEl) {
        // Get text content, clean it up
        const text = descriptionEl.textContent?.trim() || '';
        if (text.length > 50) {
          // Extract just the problem statement (before "Example")
          const exampleIndex = text.indexOf('Example');
          if (exampleIndex > 0) {
            details.description = text.substring(0, exampleIndex).trim();
          } else {
            details.description = text;
          }
          console.log('[ProblemExtractor] Found description:', details.description.length, 'chars');
          break;
        }
      }
    }
    
    // Extract examples - look for pre tags
    const preElements = document.querySelectorAll('pre');
    preElements.forEach((pre) => {
      const text = pre.textContent?.trim() || '';
      // Check if it looks like an example (has Input: or Output:)
      if (text.includes('Input:') || text.includes('Output:')) {
        details.examples.push(text);
      }
    });
    
    console.log('[ProblemExtractor] Found examples:', details.examples.length);
    
    // Extract constraints - look for "Constraints:" section
    const allText = document.body.textContent || '';
    const constraintsMatch = allText.match(/Constraints?:([\s\S]*?)(?=\n\n|Example|Follow|$)/i);
    
    if (constraintsMatch) {
      const constraintsText = constraintsMatch[1];
      // Split by newlines and filter
      const constraints = constraintsText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && line.length < 200); // Reasonable constraint length
      
      details.constraints = constraints;
      console.log('[ProblemExtractor] Found constraints:', details.constraints.length);
    }
    
  } catch (error) {
    console.error('[ProblemExtractor] Extraction error:', error);
  }
  
  console.log('[ProblemExtractor] Extraction complete:', {
    topicsCount: details.topics.length,
    descriptionLength: details.description.length,
    examplesCount: details.examples.length,
    constraintsCount: details.constraints.length,
  });
  
  return details;
}

