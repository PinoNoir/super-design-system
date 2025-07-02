import React from 'react';
import BaseInput, { BaseInputProps } from './BaseInput';
import { INPUT_FIELD_FORMAT_TYPES } from '../constants/input-constants';

export type SSNInputProps = Omit<BaseInputProps, 'formatType' | 'type'>;

const SSNInput = React.forwardRef<HTMLInputElement, SSNInputProps>(({ ...props }, ref) => (
  <BaseInput
    {...props}
    ref={ref}
    type="text"
    formatType={INPUT_FIELD_FORMAT_TYPES.SSNumber}
    placeholder={props.placeholder || 'xxx-xx-xxxx'}
    inputMode="numeric"
  />
));

SSNInput.displayName = 'SSNInput';

export default SSNInput;
