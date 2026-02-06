export function CamelCaseToTitleCase(s: string | null | undefined): string {
  if (s == null) {
    return "";
  }

  s = s.replace(/_/g, " ");
  s = s.replace(/\b\w/g, (str) => str.toUpperCase());
  s = s.replace(/([a-z])([A-Z])/g, "$1 $2");

  const specialCases: { [key: string]: string } = {
    "Agent Email": "Agent Email",
  };

  const words = s.split(" ");
  for (let i = 0; i < words.length; i++) {
    const key = words.slice(i).join(" ");
    if (specialCases[key]) {
      words.splice(i, words.length - i, ...specialCases[key].split(" "));
      break;
    }
  }

  return words.join(" ");
}

export const getErrorMessages = (errors: Record<string, string> | null | undefined): string => {
  if (errors == null) {
    return "";
  }

  return Object.values(errors).join(', ');
}
