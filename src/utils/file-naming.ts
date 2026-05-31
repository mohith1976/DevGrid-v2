/**
 * File Naming Utilities
 * Generates LeetHub-style folder and file names
 */

/**
 * Language to file extension mapping
 */
const LANGUAGE_EXTENSIONS: Record<string, string> = {
  java: '.java',
  python: '.py',
  python3: '.py',
  javascript: '.js',
  typescript: '.ts',
  cpp: '.cpp',
  c: '.c',
  csharp: '.cs',
  go: '.go',
  rust: '.rs',
  kotlin: '.kt',
  swift: '.swift',
  ruby: '.rb',
  php: '.php',
};

/**
 * Generate folder name from question ID and slug
 * Format: <4-digit-question-id>-<slug>
 *
 * @param questionId - Question ID (e.g., "2")
 * @param slug - Question slug (e.g., "add-two-numbers")
 * @returns Folder name (e.g., "0002-add-two-numbers")
 */
export function generateFolderName(questionId: string, slug: string): string {
  const paddedId = questionId.padStart(4, '0');
  return `${paddedId}-${slug}`;
}

/**
 * Generate solution file name
 * Format: <4-digit-question-id>-<slug>.<ext>
 *
 * @param questionId - Question ID (e.g., "2")
 * @param slug - Question slug (e.g., "add-two-numbers")
 * @param language - Programming language (e.g., "java")
 * @returns File name (e.g., "0002-add-two-numbers.java")
 */
export function generateSolutionFileName(
  questionId: string,
  slug: string,
  language: string
): string {
  const paddedId = questionId.padStart(4, '0');
  const extension = getFileExtension(language);
  return `${paddedId}-${slug}${extension}`;
}

/**
 * Get file extension for a programming language
 *
 * @param language - Programming language
 * @returns File extension (e.g., ".java")
 */
function getFileExtension(language: string): string {
  const normalizedLang = language.toLowerCase().trim();
  return LANGUAGE_EXTENSIONS[normalizedLang] || `.${normalizedLang}`;
}
