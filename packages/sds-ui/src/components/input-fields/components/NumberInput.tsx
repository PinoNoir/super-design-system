import React from 'react';
import BaseInput, { BaseInputProps } from './BaseInput';
import { INPUT_FIELD_FORMAT_TYPES } from '../constants/input-constants';

export interface NumberInputProps extends Omit<BaseInputProps, 'formatType' | 'type'> {
  min?: number;
  max?: number;
  step?: number;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>((props, ref) => (
  <BaseInput {...props} ref={ref} type="text" formatType={INPUT_FIELD_FORMAT_TYPES.Numeric} />
));

NumberInput.displayName = 'NumberInput';

export default NumberInput;
