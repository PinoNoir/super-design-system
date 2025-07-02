import React from 'react';
import styles from './styles/IconButton.module.css';
import { clsx } from 'clsx';

type IconButtonVariants = 'base' | 'primary' | 'secondary' | 'tertiary';
type IconButtonSizes = 'small' | 'medium' | 'large';
type IconButtonFills = 'none' | 'outline' | 'filled';
type IconButtonShapes = 'square' | 'bevel' | 'round';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: IconButtonVariants;
  size?: IconButtonSizes;
  fill?: IconButtonFills;
  shape?: IconButtonShapes;
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  ['automation-id']?: string;
}

/* Icon Buttons can be used in nav bars and utility menus */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    children,
    className,
    size = 'medium',
    variant = 'secondary',
    fill = 'filled',
    shape = 'round',
    onClick,
    disabled,
    ariaLabel = 'icon button',
    ...props
  },
  forwardedRef,
) {
  const iconButtonClasses = clsx(className, styles.iconButton, {
    [styles.base]: variant === 'base',
    [styles.primary]: variant === 'primary',
    [styles.secondary]: variant === 'secondary',
    [styles.tertiary]: variant === 'tertiary',
    [styles.small]: size === 'small',
    [styles.medium]: size === 'medium',
    [styles.large]: size === 'large',
    [styles.none]: fill === 'none',
    [styles.outline]: fill === 'outline',
    [styles.filled]: fill === 'filled',
    [styles.square]: shape === 'square',
    [styles.bevel]: shape === 'bevel',
    [styles.round]: shape === 'round',
  });

  return (
    <button
      ref={forwardedRef}
      aria-label={ariaLabel}
      className={iconButtonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

IconButton.displayName = 'IconButton';

export default IconButton;
