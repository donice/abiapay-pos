/**
 * Function to get the last path segment from a URL.
 * @param url - The URL string to extract the last path segment from.
 * @returns The last path segment as a string.
 */
export const getLastPathSegment = (url: string): string => {
  const segments = url.split('/').filter(Boolean);
  return segments[segments.length - 1];
};