export function randomInvoiceGenerator() {
  const randomNumber = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
  
  const randomLetters = String.fromCharCode(
    65 + Math.floor(Math.random() * 26),
    65 + Math.floor(Math.random() * 26)
  );
  
  const now = new Date();
  const year = String(now.getFullYear()).slice(2); // Get last two digits of the year
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  
  const dateTimeString = `${year}${month}${day}${hour}${minute}`;
  
  return randomNumber + randomLetters + dateTimeString;
}
