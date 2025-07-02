import React, { useCallback, useState } from 'react';
import CloseIcon from '../icon/svg/CloseIcon';
import CheckIcon from '../icon/svg/CheckIcon';
import styles from './styles/Chip.module.css';
import { clsx } from 'clsx';

type ChipVariant = 'base' | 'outline' | 'primary';

export interface ChipProps {
  id?: string;
  className?: string;
  avatar?: React.ReactNode;
  label: React.ReactNode;
  variant?: ChipVariant;
  active?: boolean;
  icon?: React.ReactElement;
  deleteIcon?: React.ReactElement;
  component?: React.ElementType;
  href?: string;
  target?: string;
  rel?: string;
  isFilterChip?: boolean;
  isDismissible?: boolean;
  onActiveChange?: (active: boolean) => void;
  onDelete?: () => void;
  onClick?: () => void;
  disabled?: boolean;
}

const Chip: React.FC<ChipProps> = ({
  id,
  className,
  avatar,
  label,
  variant = 'base',
  active = false,
  onActiveChange,
  onDelete,
  onClick,
  icon,
  deleteIcon,
  component: Component = 'div',
  href,
  rel,
  target,
  isFilterChip = false,
  isDismissible = false,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const chipClasses = clsx(styles.chip, styles[variant], className, {
    [styles.active]: isFilterChip && active,
  });

  const handleClick = useCallback(() => {
    if (disabled) return;

    if (isFilterChip && onActiveChange) {
      onActiveChange(!active);
    }
    if (onClick) {
      onClick();
    }
  }, [isFilterChip, onActiveChange, active, onClick, disabled]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (disabled) return;

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
      }
    },
    [handleClick, disabled],
  );

  const handleDelete = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (disabled) return;

      event.stopPropagation();

      // Set the chip to not visible if it's dismissible
      if (isDismissible) {
        setIsVisible(false);
      }

      if (onDelete) {
        onDelete();
      }
    },
    [onDelete, isDismissible, disabled],
  );

  // If the chip has been dismissed and is dismissible, don't render it
  if (isDismissible && !isVisible) {
    return null;
  }

  const content = (
    <>
      {avatar && <div className={styles.chipAvatar}>{avatar}</div>}
      {icon && <span className={styles.customIconWrapper}>{icon}</span>}
      <span className={styles.label}>{label}</span>
      {isFilterChip && active && <CheckIcon />}
      {isDismissible && onDelete && (
        <button
          className={styles.iconWrapper}
          onClick={handleDelete}
          automation-id="delete-icon"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => e.key === 'Enter' && handleDelete(e as unknown as React.MouseEvent<HTMLElement>)}
          aria-disabled={disabled}
          aria-label="Delete"
        >
          {deleteIcon || <CloseIcon className={styles.deleteIcon} />}
        </button>
      )}
    </>
  );

  const chipProps = {
    className: chipClasses,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    role: 'button',
    tabIndex: disabled ? -1 : 0,
    'data-disabled': disabled || undefined,
    'data-variant': variant === 'outline' ? 'outlined' : undefined,
    'data-clickable': ((!!onClick || isFilterChip) && !disabled) || undefined,
    'aria-disabled': disabled || undefined,
  };

  if (href && !disabled) {
    return (
      <a href={href} rel={rel} target={target} {...chipProps}>
        {content}
      </a>
    );
  }

  return (
    <Component id={id} {...chipProps}>
      {content}
    </Component>
  );
};

export default Chip;
