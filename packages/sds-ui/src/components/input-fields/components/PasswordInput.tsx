import React from 'react';
import BaseInput, { BaseInputProps } from './BaseInput';
import { INPUT_FIELD_FORMAT_TYPES } from '../constants/input-constants';
import styles from '../styles/PasswordInput.module.css';
import StrengthIndicator from './sub-components/StrengthIndicator';

export interface PasswordInputProps extends Omit<BaseInputProps, 'formatType' | 'type'> {
  showPasswordToggle?: boolean;
  strengthIndicator?: boolean;
  value?: string | number;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showPasswordToggle = true, strengthIndicator = false, value, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div style={{ position: 'relative' }}>
        <BaseInput
          {...props}
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          formatType={INPUT_FIELD_FORMAT_TYPES.Password}
          autoComplete="current-password"
          value={value}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.passwordToggle}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
        {strengthIndicator && value && <StrengthIndicator password={value.toString()} />}
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
