import React from 'react';
import clsx from 'clsx';
import { Icon } from '@iconify/react';
import styles from './styles/Sidebar.module.css';
import { NavItem, NavSection, SidebarProps } from './Sidebar';

export interface SidebarSectionProps {
  section: NavSection;
  collapsed: boolean;
  sectionClassName?: string;
  sectionTitleClassName?: string;
  renderNavItem?: SidebarProps['renderNavItem'];
  toggleSection: (id: string) => void;
  isExpanded: boolean;
  renderDefaultNavItem: (item: NavItem) => React.ReactNode;
  collapsible?: boolean;
  shouldRenderItems?: boolean;
}

const SidebarSection = ({
  section,
  collapsed,
  sectionClassName,
  sectionTitleClassName,
  renderNavItem,
  toggleSection,
  isExpanded,
  renderDefaultNavItem,
  collapsible = true,
  shouldRenderItems = true,
}: SidebarSectionProps) => {
  const contentId = `section-${section.id}`;

  // Use section's own collapsible setting if provided, otherwise use global setting
  const sectionIsCollapsible = section.collapsible !== undefined ? section.collapsible : collapsible;
  const hasTitle = section.title;
  const canToggle = hasTitle && sectionIsCollapsible;
  const showContent = !canToggle || isExpanded;
  const showHeader = hasTitle;

  const renderSectionItems = () => {
    if (!shouldRenderItems || !showContent) return null;

    return section.items.map((item) => {
      const defaultRender = renderDefaultNavItem(item);
      let renderedItem;

      if (section.renderItem) {
        renderedItem = section.renderItem(item, defaultRender);
      } else if (renderNavItem) {
        renderedItem = renderNavItem(item, defaultRender);
      } else {
        renderedItem = defaultRender;
      }

      return <li key={item.id}>{renderedItem}</li>;
    });
  };

  const renderSectionHeader = () => {
    if (!showHeader) return null;

    if (canToggle) {
      return (
        <button
          id={`${section.id}-title`}
          automation-id="section-title"
          className={clsx(styles.sectionHeader, styles.sectionHeaderCollapsible)}
          onClick={() => toggleSection(section.id)}
          aria-expanded={isExpanded}
          aria-controls={contentId}
          type="button"
        >
          {!collapsed && <h3 className={clsx(styles.sectionTitle, sectionTitleClassName)}>{section.title}</h3>}
          <Icon
            icon="mdi:chevron-right"
            className={clsx(styles.sectionToggleIcon, {
              [styles.rotate]: !isExpanded,
            })}
            automation-id="section-toggle-icon"
            aria-hidden="true"
          />
        </button>
      );
    }

    return (
      <h3
        id={`${section.id}-title`}
        automation-id="section-title"
        className={clsx(styles.sectionTitle, styles.sectionHeader, sectionTitleClassName)}
      >
        {!collapsed && section.title}
      </h3>
    );
  };

  return (
    <nav
      className={clsx(styles.sidebarSection, styles.navSection, sectionClassName, section.className)}
      role="navigation"
      aria-labelledby={hasTitle ? `${section.id}-title` : undefined}
    >
      {renderSectionHeader()}

      {showContent && (
        <div
          id={contentId}
          className={clsx(styles.sectionContent, {
            [styles.sectionContentAnimated]: canToggle,
            [styles.sectionContentExpanded]: isExpanded || !canToggle,
          })}
        >
          <ul className={styles.sectionContentItems}>{renderSectionItems()}</ul>
        </div>
      )}
    </nav>
  );
};

SidebarSection.displayName = 'SidebarSection';

export default SidebarSection;
