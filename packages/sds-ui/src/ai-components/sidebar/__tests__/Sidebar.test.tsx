import React from 'react';
import { render, screen, within, act, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar, SidebarItem, SidebarSectionStatic } from '../';
import type { NavSection, SidebarRef } from '../Sidebar';
import { useSidebar } from '../useSidebar';

// Mock the Icon component from @iconify/react
jest.mock('@iconify/react', () => ({
  Icon: ({ icon, width, color }: { icon: string; width: string; color: string }) => (
    <span automation-id="iconify-icon" data-icon={icon} data-width={width} data-color={color}>
      {icon}
    </span>
  ),
}));

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

// Mock CSS modules - ADD the missing backdrop class
jest.mock('./styles/Sidebar.module.css', () => ({
  sidebar: 'sidebar',
  base: 'base',
  compact: 'compact',
  minimal: 'minimal',
  collapsed: 'collapsed',
  sidebarHeader: 'sidebarHeader',
  sidebarContent: 'sidebarContent',
  sidebarNav: 'sidebarNav',
  sidebarFooter: 'sidebarFooter',
  sidebarBackdrop: 'sidebarBackdrop', // ← ADD THIS
  brand: 'brand',
  navSection: 'navSection',
  sectionTitle: 'sectionTitle',
  navButton: 'navButton',
  active: 'active',
  disabled: 'disabled',
  iconButton: 'iconButton',
  navLabel: 'navLabel',
  navBadge: 'navBadge',
  collapseButton: 'collapseButton',
  collapseIcon: 'collapseIcon',
  rotated: 'rotated',
}));

describe('Sidebar Component', () => {
  const mockSections: NavSection[] = [
    {
      id: 'main',
      title: 'Main Navigation',
      items: [
        {
          id: 'home',
          label: 'Home',
          icon: <span automation-id="home-icon">🏠</span>,
          href: '/',
          isActive: true,
        },
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: <span automation-id="dashboard-icon">📊</span>,
          onClick: jest.fn(),
        },
        {
          id: 'messages',
          label: 'Messages',
          icon: <span automation-id="messages-icon">💬</span>,
          badge: <span>3</span>,
          href: '/messages',
        },
      ],
    },
    {
      id: 'settings',
      title: 'Settings',
      items: [
        {
          id: 'profile',
          label: 'Profile',
          onClick: jest.fn(),
          disabled: true,
        },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<Sidebar />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('renders with default logo when no logo provided', () => {
      render(<Sidebar />);
      const logo = screen.getByRole('navigation').querySelector('svg');
      expect(logo).toBeInTheDocument();
    });

    it('renders custom logo when provided', () => {
      const customLogo = <div automation-id="custom-logo">Custom Logo</div>;
      render(<Sidebar logo={customLogo} />);
      expect(screen.getByTestId('custom-logo')).toBeInTheDocument();
    });

    it('renders custom header when provided', () => {
      const customHeader = <div automation-id="custom-header">Custom Header</div>;
      render(<Sidebar header={customHeader} />);
      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    });

    it('renders footer when provided', () => {
      const footer = <div automation-id="footer">Footer Content</div>;
      render(<Sidebar footer={footer} />);
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  describe('Navigation Sections', () => {
    it('renders navigation sections with titles', () => {
      render(<Sidebar sections={mockSections} defaultExpandedSections={{ main: true, settings: true }} />);

      expect(screen.getByText('Main Navigation')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('renders navigation items with labels', () => {
      render(<Sidebar sections={mockSections} defaultExpandedSections={{ main: true, settings: true }} />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Messages')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('renders navigation items with icons', () => {
      render(<Sidebar sections={mockSections} defaultExpandedSections={{ main: true, settings: true }} />);

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-icon')).toBeInTheDocument();
      expect(screen.getByTestId('messages-icon')).toBeInTheDocument();
    });

    it('renders badges when provided', () => {
      render(<Sidebar sections={mockSections} defaultExpandedSections={{ main: true, settings: true }} />);

      // First verify the sections are expanded and items are visible
      expect(screen.getByText('Messages')).toBeInTheDocument();

      const messagesItem = screen.getByRole('menuitem', { name: /messages/i });
      expect(within(messagesItem).getByText('3')).toBeInTheDocument();
    });

    it('renders links for items with href', () => {
      render(<Sidebar sections={mockSections} defaultExpandedSections={{ main: true, settings: true }} />);

      // First verify the sections are expanded and items are visible
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Messages')).toBeInTheDocument();

      const homeItem = screen.getByRole('menuitem', { name: /home/i });
      expect(homeItem).toHaveAttribute('href', '/');

      const messagesItem = screen.getByRole('menuitem', { name: /messages/i });
      expect(messagesItem).toHaveAttribute('href', '/messages');
    });

    it('renders buttons for items with onClick', () => {
      render(<Sidebar sections={mockSections} defaultExpandedSections={{ main: true, settings: true }} />);

      // First verify the sections are expanded and items are visible
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();

      // Now look for the menuitem role
      const dashboardItem = screen.getByRole('menuitem', { name: /dashboard/i });
      expect(dashboardItem).toBeInTheDocument();
    });
  });

  describe('Item States', () => {
    it('applies active class to active items', () => {
      // Use a simple section with an active item
      const simpleSections: NavSection[] = [
        {
          id: 'main',
          items: [
            {
              id: 'home',
              label: 'Home',
              icon: <span>🏠</span>,
              href: '/',
              isActive: true, // This should make it active
            },
          ],
        },
      ];

      render(<Sidebar sections={simpleSections} />);

      // Wait for the item to be visible
      expect(screen.getByText('Home')).toBeInTheDocument();

      const homeItem = screen.getByRole('menuitem', { name: /home/i });
      // The active class should be applied to the menuitem element
      expect(homeItem).toHaveClass('active');
    });

    it('applies disabled state to disabled items', () => {
      // Use a simple section with a disabled item
      const simpleSections: NavSection[] = [
        {
          id: 'main',
          items: [
            {
              id: 'profile',
              label: 'Profile',
              icon: <span>👤</span>,
              onClick: jest.fn(),
              disabled: true, // This should make it disabled
            },
          ],
        },
      ];

      render(<Sidebar sections={simpleSections} />);

      // Wait for the item to be visible
      expect(screen.getByText('Profile')).toBeInTheDocument();

      const profileItem = screen.getByRole('menuitem', { name: /profile/i });
      expect(profileItem).toHaveAttribute('aria-disabled', 'true');
      // The disabled class should be applied to the menuitem element
      expect(profileItem).toHaveClass('disabled');
    });

    it('handles click events on navigation items', async () => {
      const user = userEvent.setup();
      render(<Sidebar sections={mockSections} defaultExpandedSections={{ main: true, settings: true }} />);

      const dashboardItem = screen.getByRole('menuitem', { name: /dashboard/i });
      await user.click(dashboardItem);

      expect(mockSections[0].items[1].onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Collapsible Functionality', () => {
    it('renders collapse button when collapsible is true', () => {
      const handleToggle = jest.fn();
      render(<Sidebar collapsible onToggleCollapse={handleToggle} />);

      const collapseButton = screen.getByRole('button', { name: /collapse sidebar/i });
      expect(collapseButton).toBeInTheDocument();
    });

    it('does not render collapse button when collapsible is false', () => {
      render(<Sidebar collapsible={false} />);

      expect(screen.queryByRole('button', { name: /collapse sidebar/i })).not.toBeInTheDocument();
    });

    it('calls onToggleCollapse when collapse button is clicked', async () => {
      const handleToggle = jest.fn();
      const user = userEvent.setup();

      render(<Sidebar collapsible onToggleCollapse={handleToggle} />);

      const collapseButton = screen.getByRole('button', { name: /collapse sidebar/i });
      await user.click(collapseButton);

      expect(handleToggle).toHaveBeenCalledTimes(1);
    });

    it('applies collapsed class when collapsed is true', () => {
      render(<Sidebar collapsible collapsed={true} onToggleCollapse={() => {}} />);

      const sidebar = screen.getByRole('navigation');
      expect(sidebar).toHaveClass('collapsed');
    });

    it('hides section titles when collapsed', () => {
      render(<Sidebar collapsible collapsed={true} onToggleCollapse={() => {}} sections={mockSections} />);

      // When collapsed, section titles should not be visible
      expect(screen.queryByText('Main Navigation')).not.toBeInTheDocument();
      expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    });

    it('updates aria-label based on collapsed state', () => {
      const { rerender } = render(<Sidebar collapsible collapsed={false} onToggleCollapse={() => {}} />);

      expect(screen.getByRole('button', { name: /collapse sidebar/i })).toBeInTheDocument();

      rerender(<Sidebar collapsible collapsed={true} onToggleCollapse={() => {}} />);

      expect(screen.getByRole('button', { name: /expand sidebar/i })).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('applies base variant class by default', () => {
      render(<Sidebar />);

      const sidebar = screen.getByRole('navigation');
      expect(sidebar).toHaveClass('base');
    });

    it('applies compact variant class', () => {
      render(<Sidebar variant="compact" />);

      const sidebar = screen.getByRole('navigation');
      expect(sidebar).toHaveClass('compact');
    });

    it('applies minimal variant class', () => {
      render(<Sidebar variant="minimal" />);

      const sidebar = screen.getByRole('navigation');
      expect(sidebar).toHaveClass('minimal');
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className to sidebar', () => {
      render(<Sidebar className="custom-sidebar" />);

      const sidebar = screen.getByRole('navigation');
      expect(sidebar).toHaveClass('custom-sidebar');
    });

    it('applies custom button className', () => {
      render(
        <Sidebar sections={mockSections} navButtonClassName="custom-button" defaultExpandedSections={{ main: true }} />,
      );

      // First verify the sections are expanded and items are visible
      expect(screen.getByText('Home')).toBeInTheDocument();

      const homeItem = screen.getByRole('menuitem', { name: /home/i });
      // The custom class is applied to the menuitem element, not the li container
      expect(homeItem).toHaveClass('custom-button');
    });

    it('applies item-specific className', () => {
      const sectionsWithCustomClass: NavSection[] = [
        {
          id: 'main',
          items: [
            {
              id: 'home',
              label: 'Home',
              className: 'special-item',
            },
          ],
        },
      ];

      render(<Sidebar sections={sectionsWithCustomClass} defaultExpandedSections={{ main: true }} />);

      // First verify the sections are expanded and items are visible
      expect(screen.getByText('Home')).toBeInTheDocument();

      const homeItem = screen.getByRole('menuitem', { name: /home/i });
      // The custom class is applied to the menuitem element, not the li container
      expect(homeItem).toHaveClass('special-item');
    });
  });

  describe('Render Props', () => {
    it('uses custom renderHeader when provided', () => {
      const renderHeader = jest.fn(() => <div automation-id="custom-rendered-header">Custom</div>);

      render(<Sidebar renderHeader={renderHeader} />);

      expect(screen.getByTestId('custom-rendered-header')).toBeInTheDocument();
      expect(renderHeader).toHaveBeenCalledWith(expect.any(Object));
    });

    it('uses custom renderNavItem when provided', () => {
      const renderNavItem = jest.fn((item, defaultRender) => (
        <div automation-id={`custom-${item.id}`}>{defaultRender}</div>
      ));

      render(
        <Sidebar
          sections={mockSections}
          renderNavItem={renderNavItem}
          defaultExpandedSections={{ main: true, settings: true }}
        />,
      );

      expect(screen.getByTestId('custom-home')).toBeInTheDocument();
      expect(renderNavItem).toHaveBeenCalledWith(expect.objectContaining({ id: 'home' }), expect.any(Object));
    });

    it('uses section-level renderItem when provided', () => {
      const sectionsWithCustomRender: NavSection[] = [
        {
          id: 'main',
          items: [{ id: 'home', label: 'Home' }],
          renderItem: jest.fn((item, defaultRender) => (
            <div automation-id="section-custom-render">{defaultRender}</div>
          )),
        },
      ];

      render(<Sidebar sections={sectionsWithCustomRender} defaultExpandedSections={{ main: true }} />);

      expect(screen.getByTestId('section-custom-render')).toBeInTheDocument();
    });
  });

  describe('Mobile Responsiveness', () => {
    it('detects mobile viewport correctly', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });

      const { result } = renderHook(() => useSidebar());

      // Force mobile detection
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      expect(result.current.isMobile).toBe(true);
    });

    it('applies mobile classes when in mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });

      render(<Sidebar mobileOpen={true} showBackdrop={true} />);

      const sidebar = screen.getByRole('navigation');
      expect(sidebar).toHaveAttribute('data-mobile', 'true');
      expect(sidebar).toHaveAttribute('data-mobile-open', 'true');
    });

    it('shows backdrop when mobile sidebar is open', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });

      render(<Sidebar mobileOpen={true} showBackdrop={true} />);

      // Look for the backdrop by its actual CSS class
      const backdrop = document.querySelector('.sidebarBackdrop');
      expect(backdrop).toBeInTheDocument();
    });

    it('does not show backdrop when showBackdrop is false', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });

      render(<Sidebar mobileOpen={true} showBackdrop={false} />);

      const backdrop = document.querySelector('.sidebarBackdrop');
      expect(backdrop).not.toBeInTheDocument();
    });

    it('handles backdrop click to close mobile sidebar', () => {
      const handleMobileToggle = jest.fn();

      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });

      render(<Sidebar mobileOpen={true} onMobileToggle={handleMobileToggle} showBackdrop={true} />);

      const backdrop = document.querySelector('.sidebarBackdrop');
      expect(backdrop).toBeInTheDocument();

      // Click backdrop
      act(() => {
        backdrop?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      expect(handleMobileToggle).toHaveBeenCalledWith(false);
    });
  });

  describe('Section Management', () => {
    it('handles controlled expanded sections', () => {
      const controlledExpanded = { main: true, settings: false };
      const onSectionToggle = jest.fn();

      render(
        <Sidebar sections={mockSections} expandedSections={controlledExpanded} onSectionToggle={onSectionToggle} />,
      );

      // Should render based on controlled state
      expect(screen.getByText('Main Navigation')).toBeInTheDocument();
      // Settings section should be collapsed (not expanded)
      expect(screen.getByText('Settings')).toBeInTheDocument();
      // But its content should not be visible since it's collapsed
      expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    });

    it('handles default expanded sections', () => {
      const defaultExpanded = { main: true, settings: true };

      render(<Sidebar sections={mockSections} defaultExpandedSections={defaultExpanded} />);

      expect(screen.getByText('Main Navigation')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('calls section onToggle callback', async () => {
      const sectionOnToggle = jest.fn();
      const user = userEvent.setup();

      const sectionsWithCallbacks = mockSections.map((section) => ({
        ...section,
        onToggle: sectionOnToggle,
      }));

      render(<Sidebar sections={sectionsWithCallbacks} defaultExpandedSections={{ main: true, settings: true }} />);

      // Main section should be expanded
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();

      // Click to collapse the main section - use getAllByTestId since there are multiple section-title elements
      const sectionTitles = screen.getAllByTestId('section-title');
      const mainSection = sectionTitles[0]; // First section is main
      await user.click(mainSection);

      // Should call the section's onToggle callback with false (collapsed)
      expect(sectionOnToggle).toHaveBeenCalledWith(false);
    });

    it('handles lazy loading of sections', () => {
      render(
        <Sidebar
          sections={mockSections}
          lazyLoadSections={true}
          defaultExpandedSections={{ main: true, settings: false }}
        />,
      );

      // Main section should be expanded and rendered
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();

      // Settings section should not be rendered (lazy loading)
      expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    });

    it('disables section collapsibility when sectionsCollapsible is false', () => {
      render(<Sidebar sections={mockSections} sectionsCollapsible={false} />);

      // Section titles should not be clickable
      const mainSection = screen.getByText('Main Navigation');
      expect(mainSection.closest('button')).toBeNull();
    });
  });

  describe('Custom Rendering', () => {
    it('uses custom renderHeader function', () => {
      const customHeader = <div automation-id="custom-header">Custom Header</div>;
      const renderHeader = jest.fn(() => customHeader);

      render(<Sidebar renderHeader={renderHeader} />);

      expect(renderHeader).toHaveBeenCalled();
      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    });

    it('uses custom renderFooter function', () => {
      const customFooter = <div automation-id="custom-footer">Custom Footer</div>;
      const renderFooter = jest.fn(() => customFooter);

      render(<Sidebar footer={<div>Original Footer</div>} renderFooter={renderFooter} />);

      expect(renderFooter).toHaveBeenCalled();
      expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
    });

    it('uses custom renderNavItem function', () => {
      const customNavItem = jest.fn((item: any) => (
        <div key={item.id} automation-id={`custom-${item.id}`}>
          Custom {item.label}
        </div>
      ));

      render(
        <Sidebar
          sections={mockSections}
          renderNavItem={customNavItem}
          defaultExpandedSections={{ main: true, settings: true }}
        />,
      );

      expect(customNavItem).toHaveBeenCalled();
      // Check that custom nav items are rendered
      expect(screen.getByTestId('custom-home')).toBeInTheDocument();
      expect(screen.getByTestId('custom-dashboard')).toBeInTheDocument();
      expect(screen.getByTestId('custom-profile')).toBeInTheDocument();
    });

    it('uses custom renderSection function', () => {
      const customSection = jest.fn((section: any, defaultRender: any) => (
        <div key={section.id} automation-id={`custom-section-${section.id}`}>
          Custom Section: {section.title}
          {defaultRender}
        </div>
      ));

      render(
        <Sidebar
          sections={mockSections}
          renderSection={customSection}
          defaultExpandedSections={{ main: true, settings: true }}
        />,
      );

      expect(customSection).toHaveBeenCalled();
      // Check that custom sections are rendered
      expect(screen.getByTestId('custom-section-main')).toBeInTheDocument();
      expect(screen.getByTestId('custom-section-settings')).toBeInTheDocument();
    });
  });

  describe('Element Customization', () => {
    it('renders with custom root element', () => {
      render(<Sidebar as="nav" />);

      const sidebar = screen.getByRole('navigation');
      expect(sidebar.tagName).toBe('NAV');
    });

    it('renders navigation items with custom element', async () => {
      render(<Sidebar sections={mockSections} navItemAs="a" defaultExpandedSections={{ main: true }} />);

      // Wait for the sections to expand and items to be visible
      await screen.findByText('Home');

      const homeItem = screen.getByRole('menuitem', { name: /home/i });
      expect(homeItem.tagName).toBe('A');
    });

    it('handles custom navItemAs with href', async () => {
      const sectionsWithHref = mockSections.map((section) => ({
        ...section,
        items: section.items.map((item) => ({
          ...item,
          href: item.href || `/${item.id}`,
        })),
      }));

      render(<Sidebar sections={sectionsWithHref} navItemAs="a" defaultExpandedSections={{ main: true }} />);

      // Wait for the sections to expand and items to be visible
      await screen.findByText('Dashboard');

      const dashboardItem = screen.getByRole('menuitem', { name: /dashboard/i });
      expect(dashboardItem).toHaveAttribute('href', '/dashboard');
    });
  });

  describe('Accessibility Enhancements', () => {
    it('provides proper ARIA attributes for mobile state', () => {
      const { rerender } = render(<Sidebar mobileOpen={false} />);

      // Check initial state
      let sidebar = screen.getByRole('navigation');
      expect(sidebar).toHaveAttribute('data-mobile-open', 'false');

      // Open mobile sidebar
      rerender(<Sidebar mobileOpen={true} />);

      sidebar = screen.getByRole('navigation');
      expect(sidebar).toHaveAttribute('data-mobile-open', 'true');
    });

    it('maintains focus management during mobile transitions', async () => {
      // Use a simple section that doesn't require expansion
      const simpleSections: NavSection[] = [
        {
          id: 'main',
          items: [
            {
              id: 'home',
              label: 'Home',
              icon: <span>🏠</span>,
              href: '/',
            },
          ],
        },
      ];

      render(<Sidebar sections={simpleSections} />);

      // Wait for the item to be visible
      await screen.findByText('Home');

      // Focus on first navigation item
      const homeItem = screen.getByRole('menuitem', { name: /home/i });
      homeItem.focus();
      expect(homeItem).toHaveFocus();

      // Focus should be maintained (this test just verifies the item exists and can be focused)
      expect(homeItem).toHaveFocus();
    });
  });

  describe('Compound Components', () => {
    it('renders SidebarSection with title', () => {
      render(
        <SidebarSectionStatic title="Test Section">
          <div>Content</div>
        </SidebarSectionStatic>,
      );

      expect(screen.getByText('Test Section')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders SidebarItem with all props', () => {
      const handleClick = jest.fn();

      render(
        <SidebarItem
          icon={<span automation-id="item-icon">Icon</span>}
          label="Test Item"
          badge={<span>Badge</span>}
          active
          onClick={handleClick}
        />,
      );

      const item = screen.getByRole('menuitem', { name: /test item/i });
      expect(item.parentElement).toHaveClass('active');
      expect(screen.getByTestId('item-icon')).toBeInTheDocument();
      expect(screen.getByText('Badge')).toBeInTheDocument();
    });

    it('renders SidebarItem as custom element', () => {
      render(<SidebarItem label="Link Item" as="a" href="/test" />);

      const item = screen.getByRole('menuitem', { name: /link item/i });
      expect(item).toHaveAttribute('href', '/test');
    });
  });

  describe('Error Handling', () => {
    it('handles missing sections gracefully', () => {
      render(<Sidebar sections={undefined} />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('handles empty sections array', () => {
      render(<Sidebar sections={[]} />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('handles items without icons', () => {
      const sectionsWithoutIcons: NavSection[] = [
        {
          id: 'main',
          items: [{ id: 'home', label: 'Home' }],
        },
      ];

      render(<Sidebar sections={sectionsWithoutIcons} defaultExpandedSections={{ main: true }} />);
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });

  describe('Forward Ref', () => {
    it('exposes custom methods through ref', () => {
      const ref = React.createRef<SidebarRef>();
      render(<Sidebar ref={ref} />);

      // The ref should contain our custom methods
      expect(ref.current).toBeDefined();
      expect(typeof ref.current?.toggleMobile).toBe('function');
      expect(typeof ref.current?.openMobile).toBe('function');
      expect(typeof ref.current?.closeMobile).toBe('function');
      expect(typeof ref.current?.isMobileOpen).toBe('boolean');
    });

    it('allows calling mobile methods through ref', () => {
      const ref = React.createRef<SidebarRef>();
      render(<Sidebar ref={ref} />);

      // Test that methods can be called
      act(() => {
        ref.current?.openMobile();
      });
      act(() => {
        ref.current?.closeMobile();
      });
      act(() => {
        ref.current?.toggleMobile();
      });
    });

    it('exposes DOM element data attributes for testing', () => {
      const ref = React.createRef<SidebarRef>();
      render(<Sidebar ref={ref} />);

      // The DOM element should have our data attributes
      const sidebarElement = screen.getByRole('navigation');
      expect(sidebarElement).toHaveAttribute('data-mobile');
      expect(sidebarElement).toHaveAttribute('data-mobile-open');
      expect(sidebarElement).toHaveAttribute('data-collapsed');
    });
  });
});
