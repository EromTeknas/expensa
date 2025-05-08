// utils/formatRupee.ts
export const formatRupee = (
  value: number | string,
  decimalPlaces: 0 | 1 | 2 = 0,
): string => {
  // Convert the value to a number if it is a string
  const num = typeof value === 'string' ? parseFloat(value) : value;

  // Handle invalid numbers
  if (isNaN(num)) {
    return '0';
  }

  // Format the number with commas and decimal places
  return num
    .toFixed(decimalPlaces) // Fix to the specified decimal places
    .replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas
};

// Usage
// console.log(formatRupee(10000));       // "10,000"
// console.log(formatRupee(10000.5, 1));  // "10,000.5"
// console.log(formatRupee(10000.52, 2)); // "10,000.52"
// console.log(formatRupee('2500000', 0)); // "25,00,000"
// console.log(formatRupee(1234.5678, 1)); // "1,234.6"
