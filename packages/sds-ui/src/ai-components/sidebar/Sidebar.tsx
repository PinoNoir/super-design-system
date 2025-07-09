import styles from './styles/Sidebar.module.css';
import clsx from 'clsx';
import React, { forwardRef, useState, useCallback, useMemo } from 'react';
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
  // New section-level properties
  defaultExpanded?: boolean;
  collapsible?: boolean;
  onToggle?: (expanded: boolean) => void;
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

  // New props for better control
  defaultExpandedSections?: Record<string, boolean>;
  expandedSections?: Record<string, boolean>;
  onSectionToggle?: (sectionId: string, expanded: boolean) => void;
  sectionsCollapsible?: boolean;
  lazyLoadSections?: boolean;
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
      defaultExpandedSections,
      expandedSections: controlledExpandedSections,
      onSectionToggle,
      sectionsCollapsible = true,
      lazyLoadSections = false,
      ...props
    },
    ref,
  ) => {
    // Initialize expanded sections based on props or defaults
    const [internalExpandedSections, setInternalExpandedSections] = useState<Record<string, boolean>>(() => {
      if (controlledExpandedSections) {
        return controlledExpandedSections;
      }

      const initialState: Record<string, boolean> = {};
      sections.forEach((section) => {
        initialState[section.id] = section.defaultExpanded ?? defaultExpandedSections?.[section.id] ?? false;
      });
      return initialState;
    });

    // Use controlled state if provided, otherwise use internal state
    const expandedSections = controlledExpandedSections || internalExpandedSections;

    const toggleSection = useCallback(
      (id: string) => {
        const newExpanded = !expandedSections[id];

        if (controlledExpandedSections) {
          // In controlled mode, just notify parent
          onSectionToggle?.(id, newExpanded);
        } else {
          // In uncontrolled mode, update internal state
          setInternalExpandedSections((prev) => ({
            ...prev,
            [id]: newExpanded,
          }));
        }

        // Find section and call its onToggle callback
        const section = sections.find((s) => s.id === id);
        section?.onToggle?.(newExpanded);

        // Always call the global callback
        onSectionToggle?.(id, newExpanded);
      },
      [expandedSections, controlledExpandedSections, onSectionToggle, sections],
    );

    const renderDefaultNavItem = useCallback(
      (item: NavItem) => {
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
      },
      [collapsed, NavItemComponent, navButtonClassName, iconClassName, labelClassName, badgeClassName],
    );

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
              const isSectionCollapsible = sectionsCollapsible && section.collapsible !== false;

              // Lazy loading: only render section content if expanded or lazy loading is disabled
              const shouldRenderItems = !lazyLoadSections || isExpanded;

              const defaultRender = (
                <SidebarSection
                  key={section.id}
                  section={section}
                  collapsed={collapsed}
                  sectionClassName={sectionClassName}
                  sectionTitleClassName={sectionTitleClassName}
                  renderNavItem={renderNavItem}
                  toggleSection={toggleSection}
                  isExpanded={isExpanded}
                  renderDefaultNavItem={renderDefaultNavItem}
                  collapsible={isSectionCollapsible}
                  shouldRenderItems={shouldRenderItems}
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
