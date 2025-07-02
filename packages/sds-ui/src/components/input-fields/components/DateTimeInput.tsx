import React from 'react';
import BaseInput, { BaseInputProps } from './BaseInput';
import { INPUT_FIELD_FORMAT_TYPES } from '../constants/input-constants';
import { getMaskFromFormat } from '../utils/mask-utils';

export interface DateTimeInputProps extends Omit<BaseInputProps, 'formatType' | 'type'> {
  dateFormat?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  format24Hour?: boolean;
}

export const DateTimeInput = React.forwardRef<HTMLInputElement, DateTimeInputProps>(
  ({ dateFormat = 'MM/DD/YYYY', format24Hour = false, placeholder, ...props }, ref) => (
    <BaseInput
      {...props}
      ref={ref}
      type="text"
      formatType={INPUT_FIELD_FORMAT_TYPES.DateTime}
      customFormat={`${getMaskFromFormat(dateFormat)} ${format24Hour ? '99:99' : '99:99 AA'}`}
      placeholder={placeholder || `${dateFormat} HH:MM${format24Hour ? '' : ' AM/PM'}`}
    />
  ),
);

DateTimeInput.displayName = 'DateTimeInput';

export default DateTimeInput;
