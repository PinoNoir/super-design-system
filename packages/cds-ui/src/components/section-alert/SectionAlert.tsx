import { Icon } from '@iconify/react';
import { clsx } from 'clsx';
import React, { ComponentPropsWithoutRef } from 'react';
import styles from './styles/SectionAlert.module.css';
import { Link } from '../link';

export interface SectionAlertProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * CSS variant of SectionAlert (Warning, Success, Info, error)
   */
  variant: 'warning' | 'success' | 'info' | 'error' | 'global';

  /**
   * Message displayed inside of section alert
   */
  message: React.ReactNode;

  /**
   * Additional text for SectionAlert, always displayed as bold text (optional)
   */
  additionalBoldMessage?: string;

  /**
   * URL associated with Link text (optional)
   */
  link?: string;

  /**
   * Text for link (optional)
   */
  linkText?: string;

  /**
   * h5 text for SectionAlert (optional)
   */
  header?: string;

  /**
   * Show header for SectionAlert (optional)
   */
  hasHeader?: boolean;

  /**
   * tab for link to reference in URL (optional)
   */
  linkCurrentTab?: boolean;

  /**
   * additional className for SectionAlert render(optional)
   */
  className?: string;

  /**
   * Optionally specify an automation id for testing purposes.
   */
  ['automation-id']?: string;
}

const SectionAlert: React.FC<SectionAlertProps> = ({
  variant,
  message,
  additionalBoldMessage,
  link,
  linkText,
  header,
  hasHeader,
  linkCurrentTab,
  className,
  ...props
}) => {
  const getHeaderText = () => {
    if (header) return header;
    switch (variant) {
      case 'info':
        return 'Information';
      case 'success':
        return 'Success';
      case 'warning':
        return 'Warning';
      case 'error':
        return 'Error';
      default:
        return '';
    }
  };

  const getIcon = (variant: string) => {
    switch (variant) {
      case 'info':
        return <Icon icon="mdi:information" width="24px" color="var(--theme-icon-info)" data-name="info" />;
      case 'error':
        return <Icon icon="mdi:alert-rhombus" width="24px" color="var(--theme-icon-error)" data-name="error" />;
      case 'success':
        return <Icon icon="mdi:check-circle" width="24px" color="var(--theme-icon-success)" data-name="success" />;
      case 'warning':
        return <Icon icon="mdi:alert" width="24px" color="var(--theme-icon-warning)" data-name="warning" />;
      case 'global':
        return <Icon icon="mdi:information" width="24px" color="var(--theme-icon-base)" data-name="global" />;
      default:
        return <></>;
    }
  };

  const renderLink = () => {
    if (link && linkText) {
      const linkProps = linkCurrentTab ? {} : { target: '_blank' };
      return (
        <Link className={styles.sectionAlertMessageLink} href={link} {...linkProps}>
          {linkText}
        </Link>
      );
    }
    return null;
  };

  const headerText = hasHeader ? getHeaderText() : '';

  return (
    <div
      className={clsx(className, styles.baseSectionAlertStyle, styles[variant])}
      automation-id={props['automation-id'] || 'section-alert'}
      {...props}
    >
      <div className={styles.wrapper}>
        <div className={styles.sectionAlertIcon}>{getIcon(variant)}</div>
        {hasHeader ? (
          <h5 className={styles.sectionAlertMessageHeading}>{headerText}</h5>
        ) : (
          <React.Fragment>
            <div className={styles.sectionAlertMessage}>
              <div className={styles.layout1}>{message}</div>
            </div>
            {additionalBoldMessage && (
              <div className={styles.sectionAlertAdditionalMessage}>{additionalBoldMessage}</div>
            )}
          </React.Fragment>
        )}
      </div>
      {hasHeader && (
        <React.Fragment>
          <div className={styles.sectionAlertMessage}>
            <div className={styles.layout2}>{message}</div>
          </div>
          {additionalBoldMessage && <div className={styles.sectionAlertAdditionalMessage}>{additionalBoldMessage}</div>}
        </React.Fragment>
      )}
      {renderLink()}
    </div>
  );
};

export default SectionAlert;
