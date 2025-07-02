import React from 'react';
import styles from './styles/ValidationMessage.module.css';
import { FieldError, FieldErrors } from 'react-hook-form';
import { getDisplayErrorMessage } from '../../utilities/get-display-error-message';

export interface ValidationMessageProps {
  readOnly?: boolean;
  invalid?: boolean;
  invalidText?: React.ReactNode | FieldError | FieldErrors;
  warn?: boolean;
  warnText?: React.ReactNode | FieldError | FieldErrors;
  success?: boolean;
  successText?: React.ReactNode;
  ['automation-id']?: string;
}

const ValidationMessage: React.FC<ValidationMessageProps> = ({
  readOnly,
  invalid,
  invalidText,
  warn,
  warnText,
  success,
  successText,
  ...props
}) => {
  const hasError = invalid && invalidText;
  const hasWarning = warn && warnText;
  const hasSuccess = success && successText;

  if (!hasError && !hasWarning && !hasSuccess) {
    return null;
  }

  return (
    <div
      className={styles.validationMsg}
      {...props}
      automation-id={props['automation-id'] || 'validation-message'}
      role="alert"
    >
      {!readOnly && hasError && (
        <div className={styles.formRequirementInvalid}>{getDisplayErrorMessage(invalidText)}</div>
      )}
      {hasWarning && <div className={styles.formRequirementWarning}>{getDisplayErrorMessage(warnText)}</div>}
      {hasSuccess && <div className={styles.formRequirementSuccess}>{successText}</div>}
    </div>
  );
};

export default ValidationMessage;
