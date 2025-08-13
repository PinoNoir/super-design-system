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
  const hasTitle = section.title && !collapsed;
  const canToggle = hasTitle && collapsible;

  const renderSectionItems = () => {
    if (!shouldRenderItems) return null;

    return section.items.map((item) => {
      const defaultRender = renderDefaultNavItem(item);
      if (section.renderItem) {
        return <React.Fragment key={item.id}>{section.renderItem(item, defaultRender)}</React.Fragment>;
      }
      if (renderNavItem) {
        return <React.Fragment key={item.id}>{renderNavItem(item, defaultRender)}</React.Fragment>;
      }
      return <React.Fragment key={item.id}>{defaultRender}</React.Fragment>;
    });
  };

  return (
    <nav
      className={clsx(styles.sidebarSection, sectionClassName, section.className)}
      role="navigation"
      aria-labelledby={hasTitle ? `${section.id}-title` : undefined}
    >
      {hasTitle && (
        <button
          id={`${section.id}-title`}
          className={clsx(styles.sectionHeader, { [styles.sectionHeaderCollapsible]: canToggle })}
          onClick={canToggle ? () => toggleSection(section.id) : undefined}
          aria-expanded={canToggle ? isExpanded : undefined}
          aria-controls={canToggle ? contentId : undefined}
          disabled={!canToggle}
          type="button"
        >
          <h3 className={clsx(styles.sectionTitle, sectionTitleClassName)}>{section.title}</h3>
          {canToggle && (
            <Icon
              icon={isExpanded ? 'mdi:chevron-down' : 'mdi:chevron-right'}
              className={clsx(styles.sectionToggleIcon)}
              aria-hidden="true"
            />
          )}
        </button>
      )}

      {!hasTitle && (
        <ul className={clsx(styles.sectionContent, styles.sectionContentItems)}>
          <li>{renderSectionItems()}</li>
        </ul>
      )}

      {hasTitle && (
        <div
          id={contentId}
          className={clsx(styles.sectionContent, styles.sectionContentAnimated, {
            [styles.sectionContentExpanded]: isExpanded || !canToggle,
          })}
        >
          <ul className={styles.sectionContentItems}>
            <li>{renderSectionItems()}</li>
          </ul>
        </div>
      )}
    </nav>
  );
};

SidebarSection.displayName = 'SidebarSection';

export default SidebarSection;
