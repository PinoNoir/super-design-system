import { useMemo } from 'react';
import type { ComponentType, SVGProps } from 'react';
import { AlertCircleIcon, AlertIcon, CheckCircleIcon } from '../components/icon';

export type FieldStatus = 'invalid' | 'warn' | 'success' | null;

export interface UseFieldStatusOptions {
  /** Used to derive this field's message/icon element ids. */
  id: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  warn?: boolean;
  success?: boolean;
}

export interface FieldStatusResult {
  /**
   * The single active status, applying the standard precedence: readOnly
   * suppresses everything; otherwise invalid > warn > success.
   */
  status: FieldStatus;
  disabled: boolean;
  required: boolean;
  invalid: boolean;
  warn: boolean;
  success: boolean;
  /**
   * Icon component for the active status, or null for none. Unstyled - the
   * consumer applies its own className/aria attributes.
   */
  StatusIcon: ComponentType<SVGProps<SVGSVGElement>> | null;
  /** Ids for wiring aria-describedby to the right message/helper element. */
  invalidId: string;
  warnId: string;
  successId: string;
  helperId: string;
}

const STATUS_ICONS: Record<Exclude<FieldStatus, null>, ComponentType<SVGProps<SVGSVGElement>>> = {
  invalid: AlertCircleIcon,
  warn: AlertIcon,
  success: CheckCircleIcon,
};

/**
 * Normalizes the invalid/warn/success/disabled/required state shared by
 * form-field-like components (text inputs, text areas, selects, search),
 * so each one doesn't reinvent the same precedence rules and id-generation
 * independently. Pairs with `ValidationMessage`, which renders the actual
 * message text from the same raw props.
 */
export function useFieldStatus({
  id,
  disabled = false,
  readOnly = false,
  required = false,
  invalid = false,
  warn = false,
  success = false,
}: UseFieldStatusOptions): FieldStatusResult {
  return useMemo(() => {
    const normalizedInvalid = !readOnly && invalid;
    const normalizedWarn = !readOnly && !normalizedInvalid && warn;
    const normalizedSuccess = !readOnly && !normalizedInvalid && !normalizedWarn && success;
    const status: FieldStatus = normalizedInvalid
      ? 'invalid'
      : normalizedWarn
        ? 'warn'
        : normalizedSuccess
          ? 'success'
          : null;

    return {
      status,
      disabled: !readOnly && disabled,
      required,
      invalid: normalizedInvalid,
      warn: normalizedWarn,
      success: normalizedSuccess,
      StatusIcon: status ? STATUS_ICONS[status] : null,
      invalidId: `${id}-error-msg`,
      warnId: `${id}-warn-msg`,
      successId: `${id}-success-msg`,
      helperId: `${id}-helper-text`,
    };
  }, [id, disabled, readOnly, required, invalid, warn, success]);
}

export default useFieldStatus;
