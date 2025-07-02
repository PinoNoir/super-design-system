import React, { useState } from 'react';
import styles from './styles/DataTableSSNCell.module.css';
import { Icon } from '@iconify/react';

interface SSNCellProps {
  ssn: string;
}

const SSNCell: React.FC<SSNCellProps> = ({ ssn }) => {
  const [isMasked, setIsMasked] = useState(true);

  const toggleMask = (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsMasked(!isMasked);
  };

  const maskedSSN = `***-**-${ssn.slice(-4)}`;

  return (
    <div
      className={styles.ssnContainer}
      onClick={toggleMask}
      role="button"
      tabIndex={0}
      aria-label={isMasked ? 'Show full SSN' : 'Hide full SSN'}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          toggleMask(e);
        }
      }}
    >
      <Icon icon={isMasked ? 'mdi:eye' : 'mdi:eye-off'} width="20px" />
      <span className={styles.ssnText}>{isMasked ? maskedSSN : ssn}</span>
    </div>
  );
};

export default SSNCell;
