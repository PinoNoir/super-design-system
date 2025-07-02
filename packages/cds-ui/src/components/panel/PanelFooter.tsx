import React from 'react';
import styles from './styles/Panel.module.css';
import { clsx } from 'clsx';

export interface PanelFooterProps {
  className?: string;
  footer: React.ReactNode;
  footerDivider?: boolean;
  ['automation-id']?: string;
}

const PanelFooter: React.FC<PanelFooterProps> = ({ footer, footerDivider, className, ...props }) => {
  return (
    <>
      {footerDivider && <div className={styles.footerDivider} />}
      <div className={clsx(styles.panelFooter, className)} {...props}>
        {footer}
      </div>
    </>
  );
};

export default PanelFooter;
