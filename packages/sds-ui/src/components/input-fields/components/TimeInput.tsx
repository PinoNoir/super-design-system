import React from 'react';
import BaseInput, { BaseInputProps } from './BaseInput';
import { INPUT_FIELD_FORMAT_TYPES } from '../constants/input-constants';

export interface TimeInputProps extends Omit<BaseInputProps, 'formatType' | 'type'> {
  format24Hour?: boolean;
}

const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  ({ format24Hour = false, placeholder, ...props }, ref) => (
    <BaseInput
      {...props}
      ref={ref}
      type="text"
      formatType={INPUT_FIELD_FORMAT_TYPES.Time}
      customFormat={format24Hour ? '99:99' : '99:99 AA'}
      placeholder={placeholder || (format24Hour ? 'HH:MM' : 'HH:MM AM/PM')}
      inputMode="numeric"
    />
  ),
);

TimeInput.displayName = 'TimeInput';

export default TimeInput;
