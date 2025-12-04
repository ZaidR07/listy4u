/**
 * Convert number to Indian currency words (Lakhs, Crores system)
 */
export const numberToIndianWords = (num: number): string => {
  if (num === 0) return 'Zero';
  if (isNaN(num)) return '';

  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertLessThanOneThousand = (n: number): string => {
    if (n === 0) return '';
    if (n < 10) return units[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + units[n % 10] : '');
    return units[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanOneThousand(n % 100) : '');
  };

  let words = '';
  
  // Crores
  if (num >= 10000000) {
    const crores = Math.floor(num / 10000000);
    words += convertLessThanOneThousand(crores) + ' Crore ';
    num %= 10000000;
  }

  // Lakhs
  if (num >= 100000) {
    const lakhs = Math.floor(num / 100000);
    words += convertLessThanOneThousand(lakhs) + ' Lakh ';
    num %= 100000;
  }

  // Thousands
  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    words += convertLessThanOneThousand(thousands) + ' Thousand ';
    num %= 1000;
  }

  // Less than thousand
  if (num > 0) {
    words += convertLessThanOneThousand(num);
  }

  return words.trim();
};

/**
 * Format price with Indian words
 */
export const formatPriceWithWords = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice) || numPrice <= 0) return '';
  
  const words = numberToIndianWords(numPrice);
  return words ? `₹${numPrice.toLocaleString('en-IN')} (${words} Rupees)` : `₹${numPrice.toLocaleString('en-IN')}`;
};
