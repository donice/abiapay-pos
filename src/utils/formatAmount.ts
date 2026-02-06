export const formatAmount = (input: number | string | undefined | null): string => {
    if (input === undefined || input === null) {
      return "0.00";
    }
  
    let num: number;
  
    if (typeof input === 'string') {
      const cleanedInput = input.replace(/,/g, '');
      num = parseFloat(cleanedInput);
    } else {
      num = input;
    }
  
    if (isNaN(num)) {
      return "~";
    }
  
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  