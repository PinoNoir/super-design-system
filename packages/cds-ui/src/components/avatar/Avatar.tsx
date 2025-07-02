import { clsx } from 'clsx';
import { forwardRef, ComponentPropsWithRef } from 'react';
import styles from './styles/Avatar.module.css';
import { Icon } from '@iconify/react';
import { useId } from '../../utilities/use-id';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends ComponentPropsWithRef<'img'> {
  /**
   * The content of the Avatar. If the user is not logged in, this will be displayed.
   */
  children?: React.ReactNode;
  /**
   * If the user is logged in, set to `true`. If the user is not logged in, set to `false`.
   */
  isLoggedIn?: boolean;
  /**
   * The username of the logged in user. If the user is logged in, the intials of the user will be displayed if specified.
   */
  username?: string;
  /**
   * The image source of the `<Avatar>`.
   */
  src?: string;
  /**
   * The size of the `<Avatar>`. Defaults to `md`.
   */
  size?: AvatarSize;
  /**
   * Optionally specify a custom CSS class to apply to the `<Avatar>`.
   */
  className?: string;
  /**
   * Optionally specify an automation id for testing purposes.
   */
  ['automation-id']?: string;
}

// Provides a visual representation of a user in the system. It can display the user's image or initials.
const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ children, isLoggedIn, username, size = 'md', src, className, ...props }, forwardedRef) => {
    const uniqueId = useId('avatar');
    const getInitials = (name: string) => {
      const names = name.split(' ');
      const initials = names.map((name) => name.charAt(0).toUpperCase());
      return initials.join('');
    };

    const initials = username ? (
      getInitials(username)
    ) : (
      <Icon icon="mdi:account-circle" color="var(--color-neutral-10)" />
    );

    const baseClasses = clsx(styles.avatar, styles[size], className);

    // If user is logged in and has an image, display the image
    if (isLoggedIn && src) {
      return (
        <img
          ref={forwardedRef}
          className={baseClasses}
          src={src}
          alt={username || 'User Avatar'}
          id={uniqueId}
          {...props}
        />
      );
    }

    // If user is logged in but has no image, display initials or default placeholder
    if (isLoggedIn) {
      return (
        <div
          ref={forwardedRef as React.Ref<HTMLDivElement>}
          className={clsx(baseClasses, styles.avatarPlaceholder)}
          role="img"
          aria-label={`${username}'s Avatar`}
          {...props}
        >
          <span className={styles.placeholderText}>{initials}</span>
        </div>
      );
    }

    // Default placeholder if not logged in
    return (
      <div
        ref={forwardedRef as React.Ref<HTMLDivElement>}
        className={clsx(baseClasses, styles.avatarPlaceholder)}
        role="img"
        aria-label="Default Avatar"
        {...props}
      >
        <span className={styles.placeholderText}>{children}</span>
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';

export default Avatar;
