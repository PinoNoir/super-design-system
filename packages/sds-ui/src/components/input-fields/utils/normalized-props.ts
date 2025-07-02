const invalidProps = (invalidId: string) => ({
  'data-invalid': true,
  'aria-invalid': true,
  'aria-describedby': invalidId,
});

const warnProps = (warnId: string) => ({
  'aria-describedby': warnId,
});

const helperProps = (helperId: string) => ({
  'aria-describedby': helperId,
});

/**
 * @param {{sharedTextInputProps: object, required?: boolean, invalid?: boolean, invalidId?: string, warn?: boolean, warnId?: string, success: boolean, successId: string, hasHelper?: boolean, helperId?: string}} config
 * @returns {object}
 */
export const textInputProps = ({
  sharedTextInputProps,
  required,
  invalid,
  invalidId,
  warn,
  warnId,
  hasHelper,
  helperId,
}: {
  sharedTextInputProps: object;
  required?: boolean;
  invalid?: boolean;
  invalidId?: string;
  warn?: boolean;
  warnId?: string;
  success: boolean;
  successId: string;
  hasHelper?: boolean;
  helperId?: string;
}): object => ({
  ...sharedTextInputProps,
  ...(invalid ? invalidProps(invalidId) : {}),
  ...(warn ? warnProps(warnId) : {}),
  ...(hasHelper ? helperProps(helperId) : {}),
});
