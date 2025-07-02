import { clsx } from 'clsx';
import { forwardRef, HTMLAttributes } from 'react';
import styles from './styles/Badge.module.css';

type BadgeVariant = 'base' | 'info' | 'success' | 'accent' | 'warning' | 'error';
type BadgeShape = 'square' | 'bevel' | 'round';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Variant options to indicate system status
   */
  variant?: BadgeVariant;

  /**
   * Shape options based on app requirements
   */
  shape?: BadgeShape;

  /**
   * Pass in the children for the `<Badge>`
   */
  children: React.ReactNode;

  /**
   * Badges can also contain an optional icon for added context
   */
  icon?: React.ReactElement;

  /**
   * Optionally specify an automation id for testing purposes.
   */
  ['automation-id']?: string;
}

/** A badge is a highly visual way to draw attention to content. */
const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'base', shape = 'round', children, icon, ...props }, forwardedRef) => {
    return (
      <span ref={forwardedRef} className={clsx(styles.badge, styles[shape], styles[variant], className)} {...props}>
        {icon && <span className={styles.iconContainer}>{icon}</span>}
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';

export default Badge;
