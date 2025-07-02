import React from 'react';
import BaseInput, { BaseInputProps } from './BaseInput';

export type TextInputProps = BaseInputProps;

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>((props, ref) => (
  <BaseInput {...props} ref={ref} type="text" inputMode="text" />
));

TextInput.displayName = 'TextInput';

export default TextInput;
