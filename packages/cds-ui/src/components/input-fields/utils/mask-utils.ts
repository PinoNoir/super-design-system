import { FormatType, INPUT_FIELD_FORMAT_TYPES } from '../constants/input-constants';

export const getMask = (formatType: FormatType | null | undefined, customFormat?: string): string => {
  if (!formatType) return '';

  switch (formatType) {
    case INPUT_FIELD_FORMAT_TYPES.CCNumber:
      return '9999 9999 9999 9999';
    case INPUT_FIELD_FORMAT_TYPES.SSNumber:
      return '999-99-9999';
    case INPUT_FIELD_FORMAT_TYPES.PhoneNumber:
      return '(999) 999-9999';
    case INPUT_FIELD_FORMAT_TYPES.ZipCode:
      return '99999';
    case INPUT_FIELD_FORMAT_TYPES.Currency:
      return ''; // Implement custom logic for currency
    case INPUT_FIELD_FORMAT_TYPES.Percent:
      return ''; // Implement custom logic for percent
    case INPUT_FIELD_FORMAT_TYPES.Date:
      return '99/99/9999';
    case INPUT_FIELD_FORMAT_TYPES.DateTime:
      return '99/99/9999 99:99';
    case INPUT_FIELD_FORMAT_TYPES.Time:
      return '99:99';
    case INPUT_FIELD_FORMAT_TYPES.Custom:
      return customFormat || '';
    default:
      return '';
  }
};

export const getMaskFromFormat = (format: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD') => {
  switch (format) {
    case 'MM/DD/YYYY':
      return '99/99/9999';
    case 'DD/MM/YYYY':
      return '99/99/9999';
    case 'YYYY-MM-DD':
      return '9999-99-99';
  }
};

export const applyMask = (value: string, maskPattern: string): string => {
  if (!maskPattern) return value;

  let maskedValue = '';
  let valueIndex = 0;

  for (const char of maskPattern) {
    if (char === '9' || char === '*') {
      if (value[valueIndex]) {
        maskedValue += value[valueIndex];
        valueIndex++;
      }
    } else {
      maskedValue += char;
    }
  }

  return maskedValue;
};
