import { Icon as Loader } from '@iconify/react';
import { clsx } from 'clsx';
import { Box } from '../box';
import { forwardRef } from 'react';
import styles from './styles/Button.module.css';

export type ButtonVariants = 'base' | 'primary' | 'secondary' | 'tertiary' | 'accent' | 'danger';
export type ButtonSizes = 'small' | 'medium' | 'large';
export type ButtonFill = 'none' | 'outline' | 'filled';
export type ButtonShape = 'square' | 'bevel' | 'round';
export type ButtonIconPosition = 'left' | 'right';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Specify a custom id for the `<button>`
   */
  id?: string;

  /**
   * Can only be used when href is defined. Adds the download attribute to the the anchor element
   */
  download?: boolean | string;

  /**
   * The URL of the link to open when `<button>` is clicked
   */
  href?: string;

  /**
   * Specify a custom CSS class
   */
  className?: string;

  /**
   * Variant options for different application use cases
   */
  variant: ButtonVariants;

  /**
   * `<button>` size can be controlled with the size prop
   */
  size?: ButtonSizes;

  /**
   * Choose a filled or transparent fill with an outline
   */
  fill?: ButtonFill;

  /**
   * If true, the `<button>` will be disabled
   */
  isDisabled?: boolean;

  /**
   * If true, the loading spinner will be displayed
   */
  isLoading?: boolean;

  /**
   * Pass in the children for your `<button>`
   */
  children?: React.ReactNode;

  /**
   * Pass in an optional icon for additional context
   */
  icon?: React.ReactElement;

  /**
   * Specify the position of the icon in relation to the button text. Default is 'left'.
   */
  iconPosition?: ButtonIconPosition;

  /**
   * Shape options based on app requirements
   */
  shape?: ButtonShape;

  /**
   * Callback function when the `<button>` is clicked
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;

  /**
   * Optionally specify an automation id for testing purposes.
   */
  ['automation-id']?: string;
}

/**
 * Used to call attention, perform an action, or to navigate.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = 'primary',
    size = 'medium',
    fill = 'filled',
    isDisabled = false,
    isLoading = false,
    children,
    icon,
    iconPosition = 'left',
    shape = 'bevel',
    onBlur,
    onClick,
    onFocus,
    onSubmit,
    onMouseEnter,
    onMouseLeave,
    ...props
  },
  forwardedRef,
) {
  const buttonContent = (
    <>
      {iconPosition === 'left' && icon && (
        <Box display="flex" alignItems="center" mr="4">
          {icon}
        </Box>
      )}
      {isLoading && <Loader icon="mdi:loading" width="24px" className={styles.spinner} />}
      {children}
      {iconPosition === 'right' && icon && (
        <Box display="flex" alignItems="center" ml="4">
          {icon}
        </Box>
      )}
    </>
  );

  const buttonClasses = clsx(className, styles.button, {
    [styles.base]: variant === 'base',
    [styles.primary]: variant === 'primary',
    [styles.secondary]: variant === 'secondary',
    [styles.tertiary]: variant === 'tertiary',
    [styles.accent]: variant === 'accent',
    [styles.danger]: variant === 'danger',
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
      className={buttonClasses}
      onClick={onClick}
      onSubmit={onSubmit}
      disabled={isDisabled || isLoading}
      onBlur={onBlur}
      onFocus={onFocus}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      {buttonContent}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
