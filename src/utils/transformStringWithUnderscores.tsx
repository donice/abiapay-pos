export const transformStringWithUnderscores = (input: string): string =>
  input.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
