import React from 'react';
import styles from '../../styles/StrengthIndicator.module.css';

interface PasswordStrengthIndicatorProps {
  password: string | number;
}

interface StrengthCheck {
  regex: RegExp;
  description: string;
}

const strengthChecks: StrengthCheck[] = [
  { regex: /.{8,}/, description: 'At least 8 characters' },
  { regex: /[A-Z]/, description: 'At least one uppercase letter' },
  { regex: /[a-z]/, description: 'At least one lowercase letter' },
  { regex: /\d/, description: 'At least one number' },
  { regex: /[^A-Za-z0-9]/, description: 'At least one special character' },
];

const calculateStrength = (password: string): number => {
  if (!password) return 0;
  return strengthChecks.reduce((score, check) => score + (check.regex.test(password) ? 1 : 0), 0);
};

const getStrengthLabel = (strength: number): string => {
  if (strength === 0) return 'Very Weak';
  if (strength === 1) return 'Weak';
  if (strength === 2) return 'Fair';
  if (strength === 3) return 'Good';
  if (strength === 4) return 'Strong';
  return 'Very Strong';
};

const getStrengthColor = (strength: number): string => {
  if (strength <= 1) return 'var(--color-error)';
  if (strength === 2) return 'var(--color-warning)';
  if (strength === 3) return 'var(--color-success-light)';
  return 'var(--color-success)';
};

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const strength = calculateStrength(password.toString());
  const strengthPercentage = (strength / strengthChecks.length) * 100;

  return (
    <div className={styles.strengthIndicator}>
      <div className={styles.strengthBar}>
        <div
          className={styles.strengthFill}
          style={{
            width: `${strengthPercentage}%`,
            backgroundColor: getStrengthColor(strength),
          }}
        />
      </div>
      <div className={styles.strengthLabel}>{getStrengthLabel(strength)}</div>
      <ul className={styles.strengthChecklist}>
        {strengthChecks.map(({ regex, description }) => (
          <li key={description} className={regex.test(password.toString()) ? styles.checkPassed : styles.checkFailed}>
            {description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrengthIndicator;
