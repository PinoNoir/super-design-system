import React from 'react';
import BaseInput, { BaseInputProps } from './BaseInput';
import { INPUT_FIELD_FORMAT_TYPES } from '../constants/input-constants';
import styles from '../styles/CCInput.module.css';
import { detectCCType } from '../utils/cc-utils';
import CardTypeIcon from './sub-components/CardTypeIcon';

export interface CCInputProps extends Omit<BaseInputProps, 'formatType' | 'type'> {
  showCardType?: boolean;
}

const CCInput = React.forwardRef<HTMLInputElement, CCInputProps>(({ showCardType = true, ...props }, ref) => {
  const [cardType, setCardType] = React.useState<string>('unknown');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const detectedType = detectCCType(value);
    setCardType(detectedType);

    const formattedEvent = {
      ...e,
      target: {
        ...e.target,
      },
    };
    props.onChange?.(formattedEvent);
  };

  return (
    <div className={styles.wrapper}>
      <BaseInput
        {...props}
        ref={ref}
        type="text"
        formatType={INPUT_FIELD_FORMAT_TYPES.CCNumber}
        customFormat="9999 9999 9999 9999"
        placeholder="xxxx xxxx xxxx xxxx"
        inputMode="numeric"
        autoComplete="cc-number"
        onChange={handleChange}
      />
      {showCardType && cardType !== 'unknown' && (
        <div className={styles.cardTypeIcon}>
          <CardTypeIcon cardType={cardType} />
        </div>
      )}
    </div>
  );
});

CCInput.displayName = 'CCInput';

export default CCInput;
