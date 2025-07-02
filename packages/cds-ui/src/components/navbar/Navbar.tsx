import React, { ComponentPropsWithoutRef, ReactNode } from 'react';
import styles from './styles/Navbar.module.css';
import { clsx } from 'clsx';

export type WrapperComponent = 'div' | 'header';

export interface Link {
  label: string;
  url: string;
  target?: string;
}

export interface NavbarProps extends ComponentPropsWithoutRef<'nav'> {
  /**
   * Specify the children to be rendered
   */
  children?: ReactNode;

  /**
   * Specify custom link components to override the default link rendering
   */
  linkComponents?: ReactNode;

  /**
   * Specify the id for the navbar
   */
  id?: string;

  /**
   * Specify a custom logo component to be displayed
   * If provided, logoSrc will be ignored
   */
  logo?: ReactNode;

  /**
   * Specify the URL where the logo links to (typically home page)
   */
  logoLinkUrl: string;

  /**
   * Specify the title attribute for the logo link
   */
  logoLinkTitle?: string;

  /**
   * Specify the source URL for the logo image
   * Only used when no custom logo component is provided
   */
  logoSrc?: string;

  /**
   * Specify the logo alt text (only used when no custom logo is provided)
   */
  logoAlt?: string;

  /**
   * Specify an array of links to be rendered in the navbar
   * This will be ignored if linkComponents is provided
   */
  links?: Array<Link>;

  /**
   * Specify the username to be displayed
   */
  username?: string;

  /**
   * Specify a custom CSS class for the parent element
   */
  className?: string;

  /**
   * Optionally specify a wrapper component
   */
  wrapperComponent?: WrapperComponent;

  /**
   * Optionally specify an automation id for testing purposes.
   */
  ['automation-id']?: string;
}

const Navbar: React.FunctionComponent<NavbarProps> = ({
  children,
  linkComponents,
  id,
  logo,
  logoLinkUrl,
  logoLinkTitle = 'Home',
  logoSrc,
  logoAlt = 'Company logo',
  links = [],
  username,
  className,
  wrapperComponent = 'header',
  ...props
}) => {
  const Wrapper = wrapperComponent;

  // Only create a default logo if logoSrc is provided and no custom logo is given
  const defaultLogo = logoSrc ? <img src={logoSrc} alt={logoAlt} /> : null;

  // Use the custom logo, or fallback to the default logo if available
  const logoElement = logo || defaultLogo;

  const renderLinks = () => {
    if (linkComponents) {
      return <ul className={clsx(className, styles.navLinks)}>{linkComponents}</ul>;
    }

    return (
      <ul className={clsx(className, styles.navLinks)}>
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.url} target={link.target}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Wrapper>
      <nav id={id} className={styles.nav} {...props}>
        {logoElement && (
          <a className={styles.navLogo} href={logoLinkUrl} title={logoLinkTitle}>
            {logoElement}
          </a>
        )}
        {renderLinks()}
        {username && <div className={styles.additionalContentContainer}>{children}</div>}
      </nav>
    </Wrapper>
  );
};

Navbar.displayName = 'Navbar';

export default Navbar;
