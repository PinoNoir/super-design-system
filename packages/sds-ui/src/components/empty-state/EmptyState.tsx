import { ComponentPropsWithoutRef, ReactNode } from 'react';
import { clsx } from 'clsx';
import styles from './styles/EmptyState.module.css';
import { useId } from '../../utilities/use-id';
import Text from '../text/Text';
import { Loader } from '../loader';
import { AlertIcon, EmptyInboxIcon, ErrorIcon, NoSearchResultIcon } from '../icon';

// Define common illustration types
export type IllustrationType = 'search' | 'empty-data' | 'error' | 'no-results' | 'loading' | 'custom';

// Size variants for different contexts
export type EmptyStateSize = 'small' | 'medium' | 'large';

export interface EmptyStateProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * The title of the empty state.
   */
  title: string;

  /**
   * The description of the empty state.
   */
  description?: string;

  /**
   * Pass in children to the empty state. For example Buttons or Icons.
   */
  children?: ReactNode;

  /**
   * Set external styling to the empty state.
   */
  className?: string;

  /**
   * Optionally specify an automation id for testing purposes.
   */
  ['automation-id']?: string;

  /**
   * Illustration to display above the content.
   * Can be a predefined type, custom ReactNode, or null to hide.
   */
  illustration?: IllustrationType | ReactNode | null;

  /**
   * Custom illustration component when illustration type is 'custom'.
   * This allows for more complex custom illustrations with props.
   */
  customIllustration?: ReactNode;

  /**
   * Size variant of the empty state.
   * @default 'medium'
   */
  size?: EmptyStateSize;

  /**
   * Whether to center the content horizontally.
   * @default true
   */
  centered?: boolean;

  /**
   * Optional icon to display inline with the title.
   */
  titleIcon?: ReactNode;

  /**
   * Custom action area instead of using children.
   * Useful for more complex action layouts.
   */
  actions?: ReactNode;
}

// Default illustrations - you would import these from your icon library
const DefaultIllustrations = {
  search: <NoSearchResultIcon />,
  'empty-data': <AlertIcon />,
  error: <ErrorIcon />,
  'no-results': <NoSearchResultIcon />,
  loading: <Loader />,
  custom: null, // Will use customIllustration prop
};

/**
 * Empty states provide a meaningful display or message
 * when there is no data or content to show in a particular section of the application.
 * For maximum usefulness, provide guidance or actions for users to populate the empty area.
 */
const EmptyState = ({
  title,
  description,
  children,
  className,
  illustration = 'empty-data',
  customIllustration,
  size = 'medium',
  centered = true,
  titleIcon,
  actions,
  ...rest
}: EmptyStateProps) => {
  const uniqueId = useId('empty-state');

  const baseStyles = clsx(
    styles.container,
    styles[`size-${size}`],
    {
      [styles.centered]: centered,
    },
    className,
  );

  // Determine which illustration to render
  const renderIllustration = () => {
    if (illustration === null) return null;

    if (typeof illustration === 'string') {
      if (illustration === 'custom') {
        return customIllustration;
      }
      return DefaultIllustrations[illustration];
    }

    // illustration is a ReactNode
    return illustration;
  };

  const illustrationElement = renderIllustration();

  return (
    <div className={baseStyles} automation-id={uniqueId} role="status" {...rest}>
      {illustrationElement && <div className={styles.illustration}>{illustrationElement}</div>}

      <div className={styles.content}>
        <div className={styles.titleSection}>
          <div className={styles.titleWrapper}>
            {titleIcon && <span className={styles.titleIcon}>{titleIcon}</span>}
            <Text as="h3">{title}</Text>
          </div>
          {description && (
            <Text as="p" color="neutral80" weight="medium">
              {description}
            </Text>
          )}
        </div>

        {(children || actions) && <div className={styles.actionButtons}>{actions || children}</div>}
      </div>
    </div>
  );
};

export default EmptyState;
