import React from 'react';
import BaseInput, { BaseInputProps } from './BaseInput';
import { INPUT_FIELD_FORMAT_TYPES } from '../constants/input-constants';

export interface CurrencyInputProps extends Omit<BaseInputProps, 'formatType' | 'type'> {
  currency?: string;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(({ currency = '$', ...props }, ref) => (
  <BaseInput
    {...props}
    ref={ref}
    type="text"
    formatType={INPUT_FIELD_FORMAT_TYPES.Currency}
    placeholder={props.placeholder || `${currency}0.00`}
  />
));

CurrencyInput.displayName = 'CurrencyInput';

export default CurrencyInput;
