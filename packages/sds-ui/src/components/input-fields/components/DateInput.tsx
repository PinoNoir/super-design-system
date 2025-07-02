import React from 'react';
import BaseInput, { BaseInputProps } from './BaseInput';
import { INPUT_FIELD_FORMAT_TYPES } from '../constants/input-constants';

export interface DateInputProps extends Omit<BaseInputProps, 'formatType' | 'type'> {
  /**
   * Minimum allowed date
   */
  minDate?: string;

  /**
   * Maximum allowed date
   */
  maxDate?: string;

  /**
   * Date format to display (defaults to MM/DD/YYYY)
   */
  dateFormat?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
}

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ minDate, maxDate, dateFormat = 'MM/DD/YYYY', placeholder, ...props }, ref) => {
    const getPlaceholder = () => {
      switch (dateFormat) {
        case 'DD/MM/YYYY':
          return 'DD/MM/YYYY';
        case 'YYYY-MM-DD':
          return 'YYYY-MM-DD';
        default:
          return 'MM/DD/YYYY';
      }
    };

    // Get mask based on date format
    const getMaskFromFormat = () => {
      switch (dateFormat) {
        case 'DD/MM/YYYY':
          return '99/99/9999';
        case 'YYYY-MM-DD':
          return '9999-99-99';
        default:
          return '99/99/9999';
      }
    };

    return (
      <BaseInput
        {...props}
        ref={ref}
        type="text" // Use text type for masked input
        formatType={INPUT_FIELD_FORMAT_TYPES.Date}
        customFormat={getMaskFromFormat()}
        placeholder={placeholder || getPlaceholder()}
        min={minDate}
        max={maxDate}
        inputMode="numeric" // Shows numeric keyboard on mobile
        autoComplete="bday" // Helps browsers understand this is a date field
      />
    );
  },
);

DateInput.displayName = 'DateInput';

export default DateInput;
