import Button, { ButtonProps, ButtonSizes } from '../button/Button';
import { Dropdown, DropdownMenu, DropdownItem, DropdownTrigger } from '../dropdown';
import { Icon } from '@iconify/react';
import styles from './styles/SplitButton.module.css';
import { clsx } from 'clsx';

export interface SplitButtonProps extends ButtonProps {
  variant: 'base' | 'primary' | 'secondary' | 'tertiary';
  triggerDisabled?: boolean;
  size?: ButtonSizes;

  dropdownItems: {
    type?: 'item' | 'heading';
    heading?: string;
    label?: string;
    onClick?: () => void;
    icon?: React.ReactElement;
  }[];

  ['automation-id']?: string;
}

const SplitButton = ({
  dropdownItems,
  variant,
  onClick,
  size = 'medium',
  triggerDisabled,
  ...props
}: SplitButtonProps) => {
  return (
    <div className={styles.wrapper}>
      <Dropdown>
        <Button
          {...props}
          size={size}
          variant={variant}
          onClick={onClick}
          className={styles.split}
          automation-id="main-button"
        />
        <DropdownTrigger>
          <Button
            variant={variant}
            size={size}
            disabled={triggerDisabled}
            className={clsx(styles.splitTrigger, styles[variant], styles[size], {
              [styles.disabled]: triggerDisabled,
            })}
            aria-label="Open menu"
          >
              <Icon icon="mdi:chevron-down" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          {dropdownItems.map((item) => (
            <DropdownItem key={item.label} onClick={item.onClick}>
              {item.icon && <span className={styles.iconWrapper}>{item.icon}</span>}
              {item.heading && <span className={styles.inlineHeading}>{item.heading}</span>}
              <span className={styles.label}>{item.label}</span>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

SplitButton.displayName = 'SplitButton';

export default SplitButton;
