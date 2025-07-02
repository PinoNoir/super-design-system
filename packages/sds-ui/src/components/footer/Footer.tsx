import { Icon } from '@iconify/react';
import React, { ComponentPropsWithoutRef } from 'react';
import { Stack } from '../stack';
import styles from './styles/Footer.module.css';

export interface FooterProps extends ComponentPropsWithoutRef<'footer'> {
  /**
   * Specify a custom CSS class
   */
  className?: string;

  /**
   * An array of link objects for the <footer>. Each object should have a label (text to display), a URL (destination of the link), and optional target.
   */
  links: Array<{ label: string; url: string; target?: string }>;

  /**
   * Accepts a string for a customer support phone number.
   */
  supportPhone: string;

  /**
   * Optionally specify a background color for the footer.
   */
  backgroundColor?: string;

  /**
   * Optionally specify a border for the footer.
   */
  borderTop?: string;

  /**
   * Optionally specify an automation id for testing purposes.
   */
  ['automation-id']?: string;
}

/**
 * Represents the footer section of standard Best Case Cloud webpage.
 */
const Footer: React.FC<FooterProps> = ({ links, supportPhone, backgroundColor, borderTop, ...props }) => {
  const year = new Date().getFullYear();
  const style: React.CSSProperties = {
    backgroundColor: backgroundColor,
    borderTop: borderTop,
  };

  return (
    <footer className={styles.footer} style={style} {...props} automation-id="footer">
      <Stack flexDirection="column" gap="8px">
        <div className={styles.footerIcons}>
          <Icon width="24px" icon="mdi:headphones" color="var(--theme-icon-base)" />
          <Icon width="24px" icon="mdi:heart" color="var(--color-orange)" />
          <Icon width="24px" icon="mdi:account-group" color="var(--theme-icon-base)" />
        </div>
        <div className={styles.contactSection}>
          <span>Need assistance? We&apos;d love to help.</span>
          <span>{'Contact Support at ' + supportPhone}</span>
        </div>
        <div className={styles.footerLinks}>
          {links.map((link) => (
            <li className={styles.footerList} key={link.label}>
              <a className={styles.footerLink} href={link.url} target={link.target}>
                {link.label}
              </a>
            </li>
          ))}
        </div>
        <span className={styles.copyrightSection}>{'© ' + year + ' SDS. All rights reserved.'}</span>
        <Stack flexDirection="row" justifyContent="center" gap="16px">
          <a className={styles.socialLinks} href="https://twitter.com/BestCaseTweet/">
            <Icon icon="mdi:twitter" width="24px" />
          </a>
          <a className={styles.socialLinks} href="https://www.linkedin.com/showcase/bestcase/">
            <Icon icon="mdi:linkedin" width="24px" />
          </a>
        </Stack>
      </Stack>
    </footer>
  );
};

export default Footer;
