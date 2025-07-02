import styles from './styles/Sidebar.module.css';
import clsx from 'clsx';
import React, { forwardRef, useState } from 'react';
import SidebarLogo from './SidebarLogo';
import SidebarSection from './SidebarSection';

export interface NavItem {
  id: string;
  icon?: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
  active?: boolean;
  disabled?: boolean;
  badge?: React.ReactNode;
}

export interface NavSection {
  id: string;
  title?: string;
  items: NavItem[];
  className?: string;
  renderItem?: (item: NavItem, defaultRender: React.ReactNode) => React.ReactNode;
}

export interface SidebarProps {
  header?: React.ReactNode;
  logo?: React.ReactNode;
  sections?: NavSection[];
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  navClassName?: string;
  footerClassName?: string;
  sectionClassName?: string;
  sectionTitleClassName?: string;
  navButtonClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
  badgeClassName?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  variant?: 'base' | 'compact' | 'minimal';
  renderHeader?: (defaultHeader: React.ReactNode) => React.ReactNode;
  renderNavItem?: (item: NavItem, defaultRender: React.ReactNode) => React.ReactNode;
  renderSection?: (section: NavSection, defaultRender: React.ReactNode) => React.ReactNode;
  renderFooter?: (defaultFooter: React.ReactNode) => React.ReactNode;
  as?: React.ElementType;
  navItemAs?: React.ElementType;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      header,
      logo,
      sections = [],
      footer,
      className,
      headerClassName,
      contentClassName,
      navClassName,
      footerClassName,
      sectionClassName,
      sectionTitleClassName,
      navButtonClassName,
      iconClassName,
      labelClassName,
      badgeClassName,
      collapsible = false,
      collapsed = false,
      onToggleCollapse,
      variant = 'base',
      renderHeader,
      renderNavItem,
      renderSection,
      renderFooter,
      as: Component = 'div',
      navItemAs: NavItemComponent = 'button',
      ...props
    },
    ref,
  ) => {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
      const initialState: Record<string, boolean> = {};
      sections.forEach((section) => {
        initialState[section.id] = true;
      });
      return initialState;
    });

    const toggleSection = (id: string) => {
      setExpandedSections((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    };

    const renderDefaultNavItem = (item: NavItem) => {
      const ItemComponent = item.href ? 'a' : NavItemComponent;
      const itemProps = item.href ? { href: item.href } : { onClick: item.onClick };

      return (
        <ItemComponent
          automation-id={`nav-${item.id}`}
          className={clsx(
            styles.navButton,
            {
              [styles.active]: item.isActive || item.active,
              [styles.disabled]: item.disabled,
            },
            navButtonClassName,
            item.className,
          )}
          disabled={item.disabled}
          {...itemProps}
        >
          {item.icon && <span className={clsx(styles.iconButton, iconClassName)}>{item.icon}</span>}
          {!collapsed && (
            <>
              <span className={clsx(styles.navLabel, labelClassName)}>{item.label}</span>
              {item.badge && <span className={clsx(styles.navBadge, badgeClassName)}>{item.badge}</span>}
            </>
          )}
        </ItemComponent>
      );
    };

    const defaultHeader = header || (
      <div className={styles.brand}>
        {logo || <SidebarLogo collapsible={collapsible} collapsed={collapsed} onToggleCollapse={onToggleCollapse} />}
      </div>
    );

    const defaultFooter = footer && <div className={clsx(styles.sidebarFooter, footerClassName)}>{footer}</div>;

    return (
      <Component
        ref={ref}
        className={clsx(
          styles.sidebar,
          styles[variant],
          {
            [styles.collapsed]: collapsed,
          },
          className,
        )}
        role="navigation"
        aria-label="Sidebar navigation"
        {...props}
      >
        <div className={clsx(styles.sidebarHeader, headerClassName)}>
          {renderHeader ? renderHeader(defaultHeader) : defaultHeader}
        </div>
        <div className={clsx(styles.sidebarContent, contentClassName)}>
          <div className={clsx(styles.sidebarNav, navClassName)}>
            {sections.map((section) => {
              const isExpanded = expandedSections[section.id] ?? false;
              const defaultRender = (
                <SidebarSection
                  key={section.id}
                  section={section}
                  collapsed={collapsed}
                  sectionClassName={sectionClassName}
                  sectionTitleClassName={sectionTitleClassName}
                  navButtonClassName={navButtonClassName}
                  iconClassName={iconClassName}
                  labelClassName={labelClassName}
                  badgeClassName={badgeClassName}
                  renderNavItem={renderNavItem}
                  toggleSection={toggleSection}
                  isExpanded={isExpanded}
                  renderDefaultNavItem={renderDefaultNavItem}
                />
              );

              return (
                <React.Fragment key={section.id}>
                  {renderSection ? renderSection(section, defaultRender) : defaultRender}
                </React.Fragment>
              );
            })}
          </div>
        </div>
        {renderFooter ? renderFooter(defaultFooter) : defaultFooter}
      </Component>
    );
  },
);

Sidebar.displayName = 'Sidebar';

export default Sidebar;
