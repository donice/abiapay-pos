export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const transformDate = (
  dateString: string | undefined | null
): string => {
  if (!dateString) return "";
  const [a, b, c] = dateString.split(/[-/]/).map(Number);
  const year = a > 31 ? a : c > 31 ? c : b;
  const day = a > 12 ? b : b > 12 || c > 31 ? c : a;
  const month = [a, b, c].find((part) => part !== year && part !== day)!;

  return `${year}-${String(day).padStart(2,"0")}-${String(month).padStart(2, "0")}`;
};

export const submitDate = (dateString: string | undefined | null): string => {
  if (!dateString) return "";
  const [a, b, c] = dateString.split(/[-/]/).map(Number);
  const year = a > 31 ? a : c;
  const day = c > 31 ? a : b > 12 ? b : c;
  const month = [a, b, c].find((part) => part !== year && part !== day);

  return `${String(day).padStart(2,"0")}-${String(month).padStart(2, "0")}-${year}`;
};
