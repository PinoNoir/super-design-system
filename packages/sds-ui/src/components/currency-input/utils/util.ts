import React from 'react';

export function useRunAfterUpdate() {
  const afterPaintRef = React.useRef({
    active: false,
    callback: () => {},
  });
  React.useLayoutEffect(() => {
    if (afterPaintRef.current.active) {
      afterPaintRef.current.callback();
      afterPaintRef.current = {
        active: false,
        callback: () => {},
      };
    }
  });
  return (fn: () => void) => {
    afterPaintRef.current.active = true;
    afterPaintRef.current.callback = fn;
  };
}

function formatNumberWithCommas(num: string): string {
  const parts = num.split('.');
  const integerPart = parts[0].replace(/\d(?=(?:\d{3})+$)/g, '$&,');
  const decimalPart = parts.length > 1 ? '.' + parts[1] : '';

  return integerPart + decimalPart;
}

export function formatStringAsCurrency(value: string, showDollarSign: boolean, setZeroIfEmpty: boolean): string {
  let formattedValue = value;

  const regexNSlashA = /^[nN]\/?[aA]$/;

  if (regexNSlashA.test(formattedValue)) {
    return formattedValue.toUpperCase();
  } else if ((formattedValue.startsWith('N') || formattedValue.startsWith('n')) && !regexNSlashA.test(formattedValue)) {
    formattedValue = '';
  }

  if (setZeroIfEmpty && formattedValue === '') {
    formattedValue = '0';
  } else if (formattedValue === '') {
    return formattedValue;
  }

  formattedValue = formattedValue.split(',').join('');
  const decimalIndex = formattedValue.indexOf('.');

  if (decimalIndex !== -1) {
    const missingDecimalPlaces = 3 + decimalIndex - formattedValue.length;
    formattedValue = formattedValue.padEnd(formattedValue.length + missingDecimalPlaces, '0');
  } else {
    formattedValue = formattedValue + '.00';
  }

  if ('0' !== formattedValue && '$0' !== formattedValue) {
    formattedValue = formattedValue.replace(/^(\$)?0+(?!\.)/g, '');
  }

  if (showDollarSign && !formattedValue.startsWith('$')) {
    formattedValue = '$' + formattedValue;
  }

  return formatNumberWithCommas(formattedValue);
}

export function formatValueAsBigDecimal(value: string): number | null {
  if (!value || value === 'NA' || value === 'N/A') {
    return null;
  }
  return Number(value.split(',').join('').replace('$', ''));
}

export function onlyNumbersAndDot(
  originalValue: string,
  currentValue: string,
  allowNa: boolean,
  acceptNaWithSlashFormat: boolean,
): string {
  if (currentValue === '' || currentValue === '$') {
    return '';
  }

  const regex = /^(\$)?\d+(,\d+)*(\.)?\d{0,2}$/;

  const nonDecimalNumbers = currentValue.split('.')[0];
  const nonDecimalNumbersCount = (nonDecimalNumbers.match(/\d/g) || []).length;

  if (!regex.test(currentValue) && allowNa) {
    return validateNaValue(originalValue, currentValue, acceptNaWithSlashFormat);
  } else if (!regex.test(currentValue) || nonDecimalNumbersCount > 10) {
    return originalValue;
  }
  return currentValue;
}

export function validateNaValue(originalValue: string, currentValue: string, acceptNaWithSlashFormat: boolean): string {
  const regexNa = /^[nN][aA]?$/;
  const regexNSlashA = /^[nN]\/?[aA]?$/;

  if (regexNa.test(currentValue)) {
    return currentValue;
  }

  if (acceptNaWithSlashFormat && regexNSlashA.test(currentValue)) {
    return currentValue;
  }

  return originalValue;
}

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
 * @param {{sharedNumberInputProps: object, invalid?: boolean, invalidId?: string, warn?: boolean, warnId?: string, hasHelper?: boolean, helperId?: string}} config
 * @returns {object}
 */
export const numberInputProps = ({
  sharedNumberInputProps,
  invalid,
  invalidId,
  warn,
  warnId,
  hasHelper,
  helperId,
  value,
}: {
  sharedNumberInputProps: object;
  invalid?: boolean;
  invalidId?: string;
  warn?: boolean;
  warnId?: string;
  hasHelper?: boolean;
  helperId?: string;
  value?: string;
}): object => ({
  ...sharedNumberInputProps,
  type: 'text',
  inputMode: 'decimal',
  autoComplete: 'off',
  pattern: value?.includes('%')
    ? '^\\d+(\\.\\d+)?%?$' // Percentage pattern
    : (() => {
        let pattern;
        if (value === 'NA' || value === 'N/A') {
          pattern = '.*'; // Allow any value for N/A
        } else {
          pattern = '^\\d+(\\.\\d{2})?$'; // Regular currency pattern
        }
        return pattern;
      })(),
  ...(invalid ? invalidProps(invalidId) : {}),
  ...(warn ? warnProps(warnId) : {}),
  ...(hasHelper ? helperProps(helperId) : {}),
});
