import styles from './styles/Sidebar.module.css';
import clsx from 'clsx';
import React, { forwardRef, useState, useCallback, useEffect, useImperativeHandle } from 'react';
import SidebarLogo from './SidebarLogo';
import SidebarSection from './SidebarSection';
import { Tooltip } from '../../components';

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
  customMenu?: React.ReactNode;
  description?: React.ReactNode;
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
  hidden?: boolean;
  hideHeader?: boolean;
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

  // Mobile responsive props
  mobileOpen?: boolean;
  onMobileToggle?: (open: boolean) => void;
  mobileBreakpoint?: number;
  showBackdrop?: boolean;
  backdropClassName?: string;
}

export interface SidebarRef {
  toggleMobile: () => void;
  openMobile: () => void;
  closeMobile: () => void;
  isMobileOpen: boolean;
}

const Sidebar = forwardRef<SidebarRef, SidebarProps>(
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
      hidden = false,
      hideHeader = false,
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
      mobileOpen,
      onMobileToggle,
      mobileBreakpoint = 768, // Default to 768px (tablet)
      showBackdrop = true,
      backdropClassName,
      ...props
    },
    ref,
  ) => {
    // Mobile state management
    const [internalMobileOpen, setInternalMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Use controlled mobile state if provided, otherwise use internal state
    const isMobileOpen = mobileOpen !== undefined ? mobileOpen : internalMobileOpen;

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

    // Sync internal state when controlled state changes
    useEffect(() => {
      if (controlledExpandedSections) {
        setInternalExpandedSections(controlledExpandedSections);
      }
    }, [controlledExpandedSections]);

    // Handle mobile toggle
    const handleMobileToggle = useCallback(
      (open: boolean) => {
        if (onMobileToggle) {
          onMobileToggle(open);
        } else {
          setInternalMobileOpen(open);
        }
      },
      [onMobileToggle],
    );

    // Mobile detection and responsive behavior
    useEffect(() => {
      const checkMobile = () => {
        const isMobileView = window.innerWidth <= mobileBreakpoint;
        setIsMobile(isMobileView);

        // Auto-close mobile sidebar when switching to desktop view
        if (!isMobileView && isMobileOpen) {
          handleMobileToggle(false);
        }
      };

      checkMobile();
      window.addEventListener('resize', checkMobile);

      return () => window.removeEventListener('resize', checkMobile);
    }, [mobileBreakpoint, isMobileOpen, handleMobileToggle]);

    // Close mobile sidebar when clicking backdrop
    const handleBackdropClick = useCallback(() => {
      handleMobileToggle(false);
    }, [handleMobileToggle]);

    // Close mobile sidebar on escape key
    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isMobileOpen) {
          handleMobileToggle(false);
        }
      };

      if (isMobileOpen) {
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }
    }, [isMobileOpen, handleMobileToggle]);

    // Expose mobile functionality through ref
    useImperativeHandle(
      ref,
      () => ({
        toggleMobile: () => handleMobileToggle(!isMobileOpen),
        openMobile: () => handleMobileToggle(true),
        closeMobile: () => handleMobileToggle(false),
        isMobileOpen,
      }),
      [isMobileOpen, handleMobileToggle],
    );

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

        const itemContent = (
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
            aria-disabled={item.disabled}
            role="menuitem"
            {...itemProps}
          >
            {item.icon && <span className={clsx(styles.iconButton, iconClassName)}>{item.icon}</span>}
            {!collapsed && (
              <>
                <span className={clsx(styles.navLabel, labelClassName)}>{item.label}</span>
                {item.badge && <span className={clsx(styles.navBadge, badgeClassName)}>{item.badge}</span>}
                {item.customMenu && <span className={styles.navActions}>{item.customMenu}</span>}
              </>
            )}
          </ItemComponent>
        );

        // Wrap with tooltip if description is provided
        return item.description ? (
          <Tooltip description={item.description} side="right" align="start" delayDuration={0}>
            {itemContent}
          </Tooltip>
        ) : (
          itemContent
        );
      },
      [collapsed, NavItemComponent, navButtonClassName, iconClassName, labelClassName, badgeClassName],
    );

    const defaultHeader = header || (
      <div className={styles.brand}>
        {logo || (
          <SidebarLogo
            collapsible={collapsible}
            collapsed={collapsed}
            onToggleCollapse={onToggleCollapse}
            hidden={hidden}
            isMobile={isMobile}
            mobileOpen={isMobileOpen}
            onMobileToggle={handleMobileToggle}
          />
        )}
      </div>
    );

    const defaultFooter = footer && <div className={clsx(styles.sidebarFooter, footerClassName)}>{footer}</div>;

    return (
      <>
        {/* Mobile backdrop */}
        {showBackdrop && isMobile && isMobileOpen && (
          <div
            className={clsx(styles.sidebarBackdrop, backdropClassName)}
            onClick={handleBackdropClick}
            aria-hidden="true"
          />
        )}

        <Component
          className={clsx(
            styles.sidebar,
            styles[variant],
            {
              [styles.collapsed]: collapsed,
              [styles.mobileOpen]: isMobile && isMobileOpen,
            },
            className,
          )}
          role="navigation"
          aria-label="Sidebar navigation"
          data-mobile={isMobile}
          data-mobile-open={isMobileOpen}
          data-collapsed={collapsed}
          {...props}
        >
          {!hideHeader && (
            <div className={styles.sidebarHeader}>{renderHeader ? renderHeader(defaultHeader) : defaultHeader}</div>
          )}
          <div className={clsx(styles.sidebarContent, contentClassName)}>
            <div className={clsx(styles.sidebarNav, navClassName, { [styles.withHeaderHidden]: hideHeader })}>
              {sections.map((section) => {
                const isExpanded = expandedSections[section.id] ?? false;
                const isSectionCollapsible = sectionsCollapsible && section.collapsible !== false;

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
      </>
    );
  },
);

Sidebar.displayName = 'Sidebar';

export default Sidebar;
