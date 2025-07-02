import React from 'react';
import { clsx } from 'clsx';
import styles from './styles/Toggle.module.css';

export interface ToggleButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  className?: string;
  leftLabel: string;
  rightLabel: string;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  value?: 'left' | 'right';
  onToggle: (selected: 'left' | 'right') => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  variant = 'primary',
  className,
  leftLabel,
  rightLabel,
  rightIcon,
  leftIcon,
  value,
  onToggle,
}) => {
  const handleToggle = (button: 'left' | 'right') => {
    onToggle(button);
  };

  const renderToggleContent = (icon: React.ReactElement | undefined, label: string) => (
    <div className={styles.toggleContent}>
      {icon && <div className={styles.iconWrapper}>{icon}</div>}
      <div className={styles.labelWrapper}>{label}</div>
    </div>
  );

  const toggleClasses = clsx(className, styles.wrapper);

  const getToggleButtonClasses = (button: 'left' | 'right') =>
    clsx(
      styles.baseToggleStyle,
      styles[variant],
      button === 'left' ? styles.leftToggleButton : styles.rightToggleButton,
      value === button ? styles[`${variant}Selected`] : styles[`${variant}Unselected`],
    );

  return (
    <div className={toggleClasses}>
      <button
        className={getToggleButtonClasses('left')}
        onClick={() => handleToggle('left')}
        automation-id="left-button"
      >
        {renderToggleContent(leftIcon, leftLabel)}
      </button>
      <button
        className={getToggleButtonClasses('right')}
        onClick={() => handleToggle('right')}
        automation-id="right-button"
      >
        {renderToggleContent(rightIcon, rightLabel)}
      </button>
    </div>
  );
};

ToggleButton.displayName = 'ButtonToggle';

export default ToggleButton;
