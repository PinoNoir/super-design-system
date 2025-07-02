export const detectCCType = (ccNumber: string) => {
  if (!ccNumber) {
    return 'unknown';
  }

  // Remove all non-digit characters
  const cleanedNumber = ccNumber.replace(/\D/g, '');

  // Early return if empty after cleaning
  if (cleanedNumber.length === 0) {
    return 'unknown';
  }

  // Check card types based on prefix patterns
  // Visa starts with 4
  if (cleanedNumber.startsWith('4')) {
    return 'visa';
  }

  // Mastercard starts with 51-55
  if (/^5[1-5]/.test(cleanedNumber)) {
    return 'mastercard';
  }

  // Amex starts with 34 or 37
  if (/^3[47]/.test(cleanedNumber)) {
    return 'amex';
  }

  // Discover starts with 6011 or 65
  if (/^(6011|65)/.test(cleanedNumber)) {
    return 'discover';
  }

  return 'unknown';
};
