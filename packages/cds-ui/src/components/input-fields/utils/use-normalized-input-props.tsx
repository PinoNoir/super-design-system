import { AlertIcon, AlertCircleIcon, CheckCircleIcon } from '../../icon';
import styles from '../../text-input/styles/TextInput.module.css';
/**
 * @typedef {object} InputProps
 * @property {string} id - The input's id
 * @property {boolean | undefined} readOnly - Whether the input should be readonly
 * @property {boolean} disabled - Whether the input should be disabled
 * @property {boolean} invalid - Whether the input should be marked as invalid
 * @property {React.ReactNode | FieldError | undefined} invalidText - The validation message displayed in case the input is considered invalid
 * @property {boolean} warn - Whether the input should be in warning state
 * @property {React.ReactNode | undefined} warnText - The validation message displayed in case the input is in warning state
 * @property {React.ReactNode | undefined} required - The indicator that the input is required
 */

/**
 * @typedef {object} NormalizedInputProps
 * @property {boolean} disabled - Whether the input is disabled
 * @property {boolean} invalid - Whether the input is invalid (takes precedence over warn)
 * @property {string} invalidId - The invalid message's id
 * @property {string} helperId - id used for helper text
 * @property {React.ReactNode | undefined} required - The indicator that the input is required
 * @property {boolean} warn - Whether the input is in warning state
 * @property {string} warnId - The warning message's id
 * @property {React.ReactNode | null} validation – React node rendering the appropriate validation message (if any)
 * @property {React.ReactNode | null} icon – React node rendering the appropriate accompanying icon (if any)
 */

/**
 * Returns an object containing non-colliding props and additional, generated ones.
 * This hook ensures that only either "invalid" or "warn" is true but never both at
 * the same time. Regardless whether "invalid" or "warn", the appropriate validation
 * message is passed as "validation". If the input should be accompanied by an icon
 * (to visually represent a readonly, invalid or warning state), the appropriate icon
 * is passed as "icon".
 * It also ensure that neither "invalid", nor "warn", nor "disabled" are enabled when
 * "readonly" is passed as "readonly" takes precedence over these variants.
 *
 * @param {InputProps} props - The props passed to the component
 * @returns {NormalizedInputProps}
 */
export function useNormalizedInputProps({
  id,
  readOnly,
  disabled,
  invalid,
  invalidText,
  warn,
  warnText,
  required,
  success,
  successText,
}) {
  const normalizedProps = {
    disabled: !readOnly && disabled,
    invalid: !readOnly && invalid,
    invalidId: `${id}-error-msg`,
    warn: !readOnly && !invalid && warn,
    required: !!required,
    warnId: `${id}-warn-msg`,
    success: !readOnly && !invalid && !warn && success,
    successId: `${id}-success-msg`,
    validation: null,
    icon: null,
    helperId: `${id}-helper-text`,
  };

  if (normalizedProps.invalid) {
    normalizedProps.icon = <AlertCircleIcon focusable="false" className={styles.errorIcon} />;
    normalizedProps.validation = (
      <div className={styles.formRequirement} id={normalizedProps.invalidId}>
        {invalidText}
      </div>
    );
  } else if (normalizedProps.warn) {
    normalizedProps.icon = <AlertIcon focusable="false" className={styles.warningIcon} />;
    normalizedProps.validation = (
      <div className={styles.formRequirement} id={normalizedProps.warnId}>
        {warnText}
      </div>
    );
  } else if (normalizedProps.success) {
    normalizedProps.icon = <CheckCircleIcon focusable="false" className={styles.successIcon} />;
    normalizedProps.validation = (
      <div className={styles.formRequirement} id={normalizedProps.successId}>
        {successText}
      </div>
    );
  }

  return normalizedProps;
}
