import React from 'react';
import BaseInput, { BaseInputProps } from './BaseInput';
import { INPUT_FIELD_FORMAT_TYPES } from '../constants/input-constants';

export interface PercentInputProps extends Omit<BaseInputProps, 'formatType' | 'type'> {
  decimalPlaces?: number;
  allowNegative?: boolean;
}

const PercentInput = React.forwardRef<HTMLInputElement, PercentInputProps>(
  ({ decimalPlaces = 2, allowNegative = false, placeholder, ...props }, ref) => {
    // Format string based on the number of decimal places
    const decimalFormatPart = decimalPlaces > 0 ? `.${Array(decimalPlaces).fill('9').join('')}` : '';
    const formatString = `${allowNegative ? '-?' : ''}999${decimalFormatPart}%`;

    // Placeholder based on the number of decimal places
    const defaultPlaceholder = decimalPlaces > 0 ? `0${decimalFormatPart.replace(/9/g, '0')}%` : '0%';

    return (
      <BaseInput
        {...props}
        ref={ref}
        type="text"
        formatType={INPUT_FIELD_FORMAT_TYPES.Percent}
        customFormat={formatString}
        placeholder={placeholder || defaultPlaceholder}
        inputMode="decimal"
      />
    );
  },
);

PercentInput.displayName = 'PercentInput';

export default PercentInput;
