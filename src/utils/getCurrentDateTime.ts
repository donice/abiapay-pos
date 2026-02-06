export function getCurrentDateTime(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = padNumber(now.getMonth() + 1); // Months are zero-indexed
  const day = padNumber(now.getDate());
  const hours = padNumber(now.getHours());
  const minutes = padNumber(now.getMinutes());
  const seconds = padNumber(now.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function padNumber(num: number): string {
  return num.toString().padStart(2, '0');
}
