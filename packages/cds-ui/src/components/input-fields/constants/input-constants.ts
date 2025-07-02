export const INPUT_FIELD_FORMAT_TYPES = {
  CCNumber: 'CCNumber',
  SSNumber: 'SSNumber',
  PhoneNumber: 'PhoneNumber',
  ZipCode: 'ZipCode',
  Currency: 'Currency',
  Percent: 'Percent',
  Date: 'Date',
  DateTime: 'DateTime',
  Time: 'Time',
  Email: 'Email',
  URL: 'URL',
  AlphaNumeric: 'AlphaNumeric',
  Alpha: 'Alpha',
  Numeric: 'Numeric',
  Password: 'Password',
  Custom: 'Custom',
} as const;

export type FormatType = (typeof INPUT_FIELD_FORMAT_TYPES)[keyof typeof INPUT_FIELD_FORMAT_TYPES];

export const VALIDATION_PATTERNS = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  phone: {
    US: /^\(\d{3}\) \d{3}-\d{4}$/,
    UK: /^\+44 \d{4} \d{6}$/,
  },
  zipCode: /^\d{5}$/,
  currency: /^\$?(\d{1,3},?(\d{3},?)*\d{3}(\.\d{1,2})?|\d{1,3}(\.\d{1,2})?)$/,
  ssn: /^\d{3}-\d{2}-\d{4}$/,
  date: {
    'MM/DD/YYYY': /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/,
    'DD/MM/YYYY': /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
    'YYYY-MM-DD': /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  },
  ccNumber: /^\d{4} \d{4} \d{4} \d{4}$/,
  time24: /^([01]?\d|2[0-3]):[0-5]\d$/,
  time12: /^(0?[1-9]|1[0-2]):[0-5]\d (AM|PM)$/,
  percent: /^-?\d+(\.\d{1,2})?%$/,
} as const;
