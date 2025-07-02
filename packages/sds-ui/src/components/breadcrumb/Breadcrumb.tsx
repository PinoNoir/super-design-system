import { forwardRef, PropsWithChildren } from 'react';
import { clsx } from 'clsx';
import { ForwardRefReturn } from '../../global-types/common';
import styles from './styles/Breadcrumb.module.css';

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Specify the label for the breadcrumb container
   */
  'aria-label'?: string;

  /**
   * Specify an optional className to be applied to the container node
   */
  className?: string;

  /**
   * Optional prop to omit the trailing slash for the breadcrumbs
   */
  noTrailingSlash?: boolean;
}

// A breadcrumb is a secondary navigation scheme that allows the user to see where the current page is in relation to the site's hierarchy.
const Breadcrumb: ForwardRefReturn<HTMLElement, BreadcrumbProps> = forwardRef(function Breadcrumb(
  {
    'aria-label': ariaLabel,
    children,
    className: customClassNameNav,
    noTrailingSlash,
    ...rest
  }: PropsWithChildren<BreadcrumbProps>,
  forwardedRef: React.Ref<HTMLElement>,
) {
  const className = clsx({
    [styles.breadcrumb]: true,
    [styles.noTrailingSlash]: noTrailingSlash,
  });

  return (
    <nav
      ref={forwardedRef}
      className={customClassNameNav}
      aria-label={ariaLabel || 'Breadcrumb'}
      automation-id="Breadcrumb"
      {...rest}
    >
      <ol className={className}>{children}</ol>
    </nav>
  );
});

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
