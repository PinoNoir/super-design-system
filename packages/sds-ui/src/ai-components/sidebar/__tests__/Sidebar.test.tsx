import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar, SidebarItem, SidebarSectionStatic } from '../';
import type { NavSection } from '../Sidebar';

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

// Mock CSS modules
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

      const messagesButton = screen.getByRole('link', { name: /messages/i });
      expect(within(messagesButton).getByText('3')).toBeInTheDocument();
    });

    it('renders links for items with href', () => {
      render(<Sidebar sections={mockSections} defaultExpandedSections={{ main: true, settings: true }} />);

      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink).toHaveAttribute('href', '/');

      const messagesLink = screen.getByRole('link', { name: /messages/i });
      expect(messagesLink).toHaveAttribute('href', '/messages');
    });

    it('renders buttons for items with onClick', () => {
      render(<Sidebar sections={mockSections} defaultExpandedSections={{ main: true, settings: true }} />);

      const dashboardButton = screen.getByRole('button', { name: /dashboard/i });
      expect(dashboardButton).toBeInTheDocument();
    });
  });

  describe('Item States', () => {
    it('applies active class to active items', () => {
      render(<Sidebar sections={mockSections} defaultExpandedSections={{ main: true, settings: true }} />);

      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink).toHaveClass('active');
    });

    it('applies disabled state to disabled items', () => {
      render(<Sidebar sections={mockSections} defaultExpandedSections={{ main: true, settings: true }} />);

      const profileButton = screen.getByRole('button', { name: /profile/i });
      expect(profileButton).toBeDisabled();
      expect(profileButton).toHaveClass('disabled');
    });

    it('handles click events on navigation items', async () => {
      const user = userEvent.setup();
      render(<Sidebar sections={mockSections} defaultExpandedSections={{ main: true, settings: true }} />);

      const dashboardButton = screen.getByRole('button', { name: /dashboard/i });
      await user.click(dashboardButton);

      expect(mockSections[0].items[1].onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Collapsible Functionality', () => {
    it('renders collapse button when collapsible is true', () => {
      render(<Sidebar collapsible />);

      const collapseButton = screen.getByRole('button', { name: /collapse sidebar/i });
      expect(collapseButton).toBeInTheDocument();
    });

    it('does not render collapse button when collapsible is false', () => {
      render(<Sidebar collapsible={false} />);

      const collapseButton = screen.queryByRole('button', { name: /collapse sidebar/i });
      expect(collapseButton).not.toBeInTheDocument();
    });

    it('calls onToggleCollapse when collapse button is clicked', async () => {
      const user = userEvent.setup();
      const onToggleCollapse = jest.fn();

      render(<Sidebar collapsible onToggleCollapse={onToggleCollapse} />);

      const collapseButton = screen.getByRole('button', { name: /collapse sidebar/i });
      await user.click(collapseButton);

      expect(onToggleCollapse).toHaveBeenCalledTimes(1);
    });

    it('applies collapsed class when collapsed is true', () => {
      render(<Sidebar collapsed />);

      const sidebar = screen.getByRole('navigation');
      expect(sidebar).toHaveClass('collapsed');
    });

    it('hides section titles when collapsed', () => {
      render(<Sidebar sections={mockSections} collapsed defaultExpandedSections={{ main: true, settings: true }} />);

      // Section titles should not be rendered when collapsed
      expect(screen.queryByText('Main Navigation')).not.toBeInTheDocument();
      expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    });

    it('updates aria-label based on collapsed state', () => {
      const { rerender } = render(<Sidebar collapsible collapsed={false} />);

      expect(screen.getByRole('button', { name: /collapse sidebar/i })).toBeInTheDocument();

      rerender(<Sidebar collapsible collapsed={true} />);

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

    it('applies custom className to navigation buttons', () => {
      render(
        <Sidebar
          sections={mockSections}
          navButtonClassName="custom-button"
          defaultExpandedSections={{ main: true, settings: true }}
        />,
      );

      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink).toHaveClass('custom-button');
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

      render(<Sidebar sections={sectionsWithCustomClass} />);

      const homeButton = screen.getByRole('button', { name: /home/i });
      expect(homeButton).toHaveClass('special-item');
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

      render(<Sidebar sections={sectionsWithCustomRender} />);

      expect(screen.getByTestId('section-custom-render')).toBeInTheDocument();
    });
  });

  describe('Element Customization', () => {
    it('renders with custom root element', () => {
      render(<Sidebar as="aside" />);

      const sidebar = screen.getByRole('navigation');
      expect(sidebar.tagName).toBe('ASIDE');
    });

    it('renders navigation items with custom element', () => {
      render(
        <Sidebar sections={mockSections} navItemAs="div" defaultExpandedSections={{ main: true, settings: true }} />,
      );

      // Items with onClick should render as custom element instead of button
      const dashboardItem = screen.getByText('Dashboard').closest('div');
      expect(dashboardItem).toHaveClass('navButton');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for collapse button', () => {
      render(<Sidebar collapsible collapsed={false} />);

      const collapseButton = screen.getByRole('button', { name: 'Collapse sidebar' });
      expect(collapseButton).toHaveAttribute('aria-label', 'Collapse sidebar');
    });

    it('uses semantic navigation elements', () => {
      render(<Sidebar sections={mockSections} defaultExpandedSections={{ main: true, settings: true }} />);

      const navElements = screen.getAllByRole('navigation');
      expect(navElements).toHaveLength(3);
    });

    it('maintains focus management for keyboard navigation', () => {
      render(<Sidebar sections={mockSections} defaultExpandedSections={{ main: true, settings: true }} />);

      const firstButton = screen.getByRole('link', { name: /home/i });
      firstButton.focus();
      expect(firstButton).toHaveFocus();
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

      render(<Sidebar sections={sectionsWithoutIcons} />);
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });

  describe('Forward Ref', () => {
    it('forwards ref to the root element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Sidebar ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveClass('sidebar');
    });
  });
});
