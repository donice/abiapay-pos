export const getLastPathSegment = (path?: string | null): string => {
  if (!path) {
    return "";
  }

  const segments = path.split("/");
  return segments[segments.length - 1] || "";
};
