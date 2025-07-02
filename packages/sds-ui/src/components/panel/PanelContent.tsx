import React from 'react';
import styles from './styles/Panel.module.css';
import { clsx } from 'clsx';

export interface PanelContentProps {
  children: React.ReactNode;
  className?: string;
  ['automation-id']?: string;
}

const PanelContent: React.FC<PanelContentProps> = ({ children, className, ...props }) => {
  return (
    <div className={clsx(styles.panelContent, className)} {...props}>
      {children}
    </div>
  );
};

export default PanelContent;
