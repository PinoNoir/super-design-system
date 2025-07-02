import React from 'react';
import { clsx } from 'clsx';
import styles from './styles/Card.module.css';
import { Loader } from '../loader';

// Base props that all card components share
interface BaseCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// Main Card props
interface CardProps extends BaseCardProps {
  variant?: 'base' | 'bordered';
  isLoading?: boolean;
}

interface CardContentProps extends BaseCardProps {
  fallback?: React.ReactNode;
}

interface CardFooterProps extends BaseCardProps {
  align?: 'start' | 'center' | 'end';
}

interface CardTitleProps extends BaseCardProps {
  hasDivider?: boolean;
}

const CardTitle: React.FC<CardTitleProps> = ({ children, className, hasDivider, ...props }) => {
  return (
    <>
      <h3 className={clsx(styles.cardTitle, className)} {...props}>
        {children}
      </h3>
      {hasDivider && <hr className={styles.divider} />}
    </>
  );
};
CardTitle.displayName = 'Card.Title';

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, fallback = <Loader />, ...props }, ref) => {
    return (
      <div ref={ref} className={clsx(styles.cardContent, className)} {...props}>
        <React.Suspense fallback={fallback}>{children}</React.Suspense>
      </div>
    );
  },
);
CardContent.displayName = 'Card.Content';

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, align = 'start', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          styles.cardFooter,
          styles[`footer${align.charAt(0).toUpperCase()}${align.slice(1)}`],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
CardFooter.displayName = 'Card.Footer';

type CardComponent = React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>> & {
  Title: typeof CardTitle;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, variant = 'base', isLoading = false, ...props }, ref) => {
    const cardBaseStyles = clsx(
      styles.card,
      styles[variant],
      {
        [styles.cardLoading]: isLoading,
      },
      className,
    );

    return (
      <div ref={ref} className={cardBaseStyles} {...props}>
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <Loader withOverlay={true} />
          </div>
        )}
        {children}
      </div>
    );
  },
) as CardComponent;

// Attach subcomponents to Card
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

Card.displayName = 'Card';

export type { CardProps, CardContentProps, CardFooterProps };
export default Card;
