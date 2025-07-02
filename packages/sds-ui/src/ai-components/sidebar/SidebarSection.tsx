import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { Icon } from '@iconify/react';
import styles from './styles/Sidebar.module.css';
import { NavItem, NavSection, SidebarProps } from './Sidebar';

export interface SidebarSectionProps {
  section: NavSection;
  collapsed: boolean;
  sectionClassName?: string;
  sectionTitleClassName?: string;
  navButtonClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
  badgeClassName?: string;
  renderNavItem?: SidebarProps['renderNavItem'];
  toggleSection: (id: string) => void;
  isExpanded: boolean;
  renderDefaultNavItem: (item: NavItem) => React.ReactNode;
}

const SidebarSection = ({
  section,
  collapsed,
  sectionClassName,
  sectionTitleClassName,
  navButtonClassName,
  iconClassName,
  labelClassName,
  badgeClassName,
  renderNavItem,
  toggleSection,
  isExpanded,
  renderDefaultNavItem,
}: SidebarSectionProps) => {
  const contentId = `section-${section.id}`;

  return (
    <nav className={clsx(styles.sidebarSection, sectionClassName, section.className)}>
      {section.title && !collapsed && (
        <button
          className={clsx(styles.sectionHeader)}
          onClick={() => toggleSection(section.id)}
          aria-expanded={isExpanded}
          aria-controls={contentId}
        >
          <h3 className={clsx(styles.sectionTitle, sectionTitleClassName)}>{section.title}</h3>
          <Icon icon={isExpanded ? 'mdi:chevron-down' : 'mdi:chevron-right'} />
        </button>
      )}

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={contentId}
            layout
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={clsx(styles.sectionContent)}
            style={{ overflow: 'hidden' }}
          >
            <div>
              {section.items.map((item) => {
                const defaultRender = renderDefaultNavItem(item);
                if (section.renderItem) {
                  return <React.Fragment key={item.id}>{section.renderItem(item, defaultRender)}</React.Fragment>;
                }
                if (renderNavItem) {
                  return <React.Fragment key={item.id}>{renderNavItem(item, defaultRender)}</React.Fragment>;
                }
                return <React.Fragment key={item.id}>{defaultRender}</React.Fragment>;
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

SidebarSection.displayName = 'SidebarSection';

export default SidebarSection;
