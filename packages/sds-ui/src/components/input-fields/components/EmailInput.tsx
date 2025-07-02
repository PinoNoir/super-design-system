import React from 'react';
import BaseInput, { BaseInputProps } from './BaseInput';
import { INPUT_FIELD_FORMAT_TYPES } from '../constants/input-constants';

export type EmailInputProps = Omit<BaseInputProps, 'formatType' | 'type'>;

const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>((props, ref) => (
  <BaseInput
    {...props}
    ref={ref}
    formatType={INPUT_FIELD_FORMAT_TYPES.Email}
    type="email"
    inputMode="email"
    autoComplete="email"
    placeholder={props.placeholder || 'example@domain.com'}
  />
));

EmailInput.displayName = 'EmailInput';

export default EmailInput;
