import React from 'react';
import BaseInput, { BaseInputProps } from './BaseInput';
import { INPUT_FIELD_FORMAT_TYPES } from '../constants/input-constants';

export type PhoneInputProps = Omit<BaseInputProps, 'formatType' | 'type'>;

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(({ ...props }, ref) => {
  return (
    <BaseInput
      {...props}
      ref={ref}
      formatType={INPUT_FIELD_FORMAT_TYPES.PhoneNumber}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      placeholder={props.placeholder || '(xxx) xxx-xxxx'}
    />
  );
});

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
