import { AriaAttributes, forwardRef, PropsWithChildren } from 'react';
import { clsx } from 'clsx';
import Link from '../link/Link';
import { ForwardRefReturn } from '../../global-types/common';
import styles from './styles/Breadcrumb.module.css';

export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {
  'aria-current'?: AriaAttributes['aria-current'];

  /**
   * Specify an optional className to be applied to the container node
   */
  className?: string;

  /**
   * Optional string representing the link location for the BreadcrumbItem
   */
  href?: string;

  /**
   * Provide if this breadcrumb item represents the current page
   */
  isCurrentPage?: boolean;
}

const BreadcrumbItem: ForwardRefReturn<HTMLLIElement, BreadcrumbItemProps> = forwardRef(function BreadcrumbItem(
  {
    'aria-current': ariaCurrent,
    children,
    className: customClassName = '',
    href,
    isCurrentPage,
    ...rest
  }: PropsWithChildren<BreadcrumbItemProps>,
  ref: React.Ref<HTMLLIElement>,
) {
  const className = clsx({
    [styles.breadcrumbItem]: true,
    [styles.current]: isCurrentPage || ariaCurrent === 'page',
    [customClassName]: !!customClassName,
  });

  return (
    <li className={className} ref={ref} {...rest}>
      {href && !isCurrentPage ? (
        <Link href={href} className={styles.link}>
          {children}
        </Link>
      ) : (
        <span className={styles.link}>{children}</span>
      )}
    </li>
  );
});

BreadcrumbItem.displayName = 'BreadcrumbItem';

export default BreadcrumbItem;
