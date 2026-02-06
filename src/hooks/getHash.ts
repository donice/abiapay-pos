const encodeMap: { [key: string]: string } = {
  "0": "Zm",
  "1": "Y0",
  "2": "E!",
  "3": "H_",
  "4": "Az",
  "5": "K9",
  "6": "Dc",
  "7": "Jc",
  "8": "Fu",
  "9": "Gxx",
};

const decodeMap: { [key: string]: string } = Object.fromEntries(
  Object.entries(encodeMap).flatMap(([key, value]) => 
    [value].map(v => [v, key])
  )
);

export const getHash = (input: string | null): string => {
  if (!input) return "";
  return input
    .split("")
    .map((char) => encodeMap[char] || char)
    .join("");
};

export const decodeHash = (input: string | null): string => {
  if (!input) return "";
  let result = "";
  let buffer = "";

  for (const char of input) {
    buffer += char;
    const matchedKey = Object.keys(decodeMap).find(key => buffer.endsWith(decodeMap[key]));
    if (matchedKey) {
      result += matchedKey;
      buffer = '';
    }
  }

  return result;
};
