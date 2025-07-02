import React from 'react';
import clsx from 'clsx';
import styles from './styles/Sidebar.module.css';

export interface SidebarSectionStaticProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  collapsed?: boolean;
  [key: string]: any;
}

const SidebarSectionStatic = ({
  children,
  title,
  className,
  collapsed = false,
  ...props
}: SidebarSectionStaticProps) => (
  <nav className={clsx(styles.sidebarSection, className)} {...props}>
    {title && !collapsed && <h3 className={styles.sectionTitle}>{title}</h3>}
    {children}
  </nav>
);

SidebarSectionStatic.displayName = 'SidebarSectionStatic';

export default SidebarSectionStatic;
