export const isValidDate = (dateString: string, format: string = 'MM/DD/YYYY'): boolean => {
  // Removes leading/trailing whitespace and checks basic format
  const trimmedDateString = dateString.trim();
  const dateParts = trimmedDateString.split(/[-/]/);

  // Validate basic structure
  if (dateParts.length !== 3) return false;

  // Ensure all parts are numeric
  const parts = dateParts.map((part) => {
    const num = parseInt(part, 10);
    return isNaN(num) ? NaN : num;
  });

  // Check for any NaN values
  if (parts.some(isNaN)) return false;

  let year: number, month: number, day: number;

  switch (format) {
    case 'DD/MM/YYYY':
      [day, month, year] = parts;
      break;
    case 'YYYY-MM-DD':
      [year, month, day] = parts;
      break;
    default: // MM/DD/YYYY
      [month, day, year] = parts;
  }

  // Additional validation
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;

  // Create date object (using month - 1 as JS months are 0-indexed)
  const date = new Date(year, month - 1, day);

  // Strict validation to catch edge cases like invalid dates
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

export const formatDate = (date: Date, format: string = 'MM/DD/YYYY'): string => {
  const pad = (num: number) => num.toString().padStart(2, '0');

  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const year = date.getFullYear();

  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    default:
      return `${month}/${day}/${year}`;
  }
};
