import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useEffect } from 'react';
import { Sidebar, SidebarItem, SidebarSectionStatic, SidebarMenu, useSidebar, SidebarLogo } from './';
import { Button, Flex, IconButton } from '../../components';
import SidebarExample from './SidebarExample';
import {
  LucideHome,
  Settings,
  User,
  MessageCircle,
  LogOut,
  CircleHelp,
  Search,
  FilePlus2,
  MoreVertical,
  Edit,
  Trash2,
  Star,
  Menu,
} from 'lucide-react';

const meta: Meta<typeof Sidebar> = {
  title: 'AI Components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A flexible sidebar component with support for navigation sections, collapsing, and extensive customization options. The component automatically adapts its behavior based on screen size, providing a push layout on desktop and an overlay layout on mobile devices.',
      },
    },
  },
  argTypes: {
    // Visual variants
    variant: {
      control: { type: 'select' },
      options: ['base', 'compact', 'minimal'],
      description: 'Visual variant of the sidebar',
    },

    // Collapsible functionality
    collapsible: {
      control: 'boolean',
      description: 'Whether the sidebar can be collapsed',
    },
    collapsed: {
      control: 'boolean',
      description: 'Whether the sidebar is currently collapsed',
    },

    // Function props - these prevent the "can't convert symbol to string" error
    onToggleCollapse: {
      action: 'collapsed',
      description: 'Called when the sidebar collapse state changes',
    },
    onSectionToggle: {
      action: 'section toggled',
      description: 'Called when a section expansion state changes',
    },
    onMobileToggle: {
      action: 'mobile toggled',
      description: 'Called when the mobile sidebar state changes',
    },

    // Section and item function props
    renderHeader: {
      control: false,
      description: 'Custom header render function',
    },
    renderNavItem: {
      control: false,
      description: 'Custom navigation item render function',
    },
    renderSection: {
      control: false,
      description: 'Custom section render function',
    },
    renderFooter: {
      control: false,
      description: 'Custom footer render function',
    },

    // Mobile responsive props
    mobileOpen: {
      control: 'boolean',
      description: 'Whether the mobile sidebar is open',
    },
    mobileBreakpoint: {
      control: { type: 'number' },
      description: 'Breakpoint for mobile behavior (in pixels)',
    },
    showBackdrop: {
      control: 'boolean',
      description: 'Whether to show backdrop on mobile',
    },

    // Section management
    defaultExpandedSections: {
      control: 'object',
      description: 'Default expanded sections configuration',
    },
    expandedSections: {
      control: 'object',
      description: 'Controlled expanded sections configuration',
    },
    sectionsCollapsible: {
      control: 'boolean',
      description: 'Whether sections can be collapsed by default',
    },
    lazyLoadSections: {
      control: 'boolean',
      description: 'Whether to lazy load section content',
    },

    // Styling props
    className: {
      control: 'text',
      description: 'Additional CSS classes for the sidebar',
    },
    headerClassName: {
      control: 'text',
      description: 'CSS classes for the header',
    },
    contentClassName: {
      control: 'text',
      description: 'CSS classes for the content area',
    },
    navClassName: {
      control: 'text',
      description: 'CSS classes for the navigation area',
    },
    footerClassName: {
      control: 'text',
      description: 'CSS classes for the footer',
    },
    sectionClassName: {
      control: 'text',
      description: 'CSS classes for sections',
    },
    sectionTitleClassName: {
      control: 'text',
      description: 'CSS classes for section titles',
    },
    navButtonClassName: {
      control: 'text',
      description: 'CSS classes for navigation buttons',
    },
    iconClassName: {
      control: 'text',
      description: 'CSS classes for icons',
    },
    labelClassName: {
      control: 'text',
      description: 'CSS classes for labels',
    },
    badgeClassName: {
      control: 'text',
      description: 'CSS classes for badges',
    },
    backdropClassName: {
      control: 'text',
      description: 'CSS classes for the backdrop',
    },

    // Other props
    hidden: {
      control: 'boolean',
      description: 'Whether the sidebar is hidden',
    },
    hideHeader: {
      control: 'boolean',
      description: 'Whether to hide the header',
    },
    as: {
      control: { type: 'select' },
      options: ['div', 'nav', 'aside'],
      description: 'HTML element to render as',
    },
    navItemAs: {
      control: { type: 'select' },
      options: ['button', 'a'],
      description: 'HTML element for navigation items',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const defaultSections = [
  {
    id: 'default',
    title: '',
    items: [
      {
        id: 'search',
        label: 'Search Chat',
        icon: <Search />,
        href: '#',
      },
      {
        id: 'new-conversation',
        label: 'New Conversation',
        icon: <FilePlus2 />,
        href: '#',
      },
    ],
  },
  {
    id: 'main',
    title: 'Pinned',
    items: [
      {
        id: 'chat-1',
        label: 'Chapter 7 Filing Strategy Analysis',
        icon: <MessageCircle />,
        href: '#',
        description: 'Detailed analysis of Chapter 7 bankruptcy filing strategies',
      },
      { id: 'chat-2', label: 'Asset Protection Research', icon: <MessageCircle />, href: '#' },
      { id: 'chat-3', label: 'Debt Discharge Case Review', icon: <MessageCircle />, href: '#' },
      { id: 'chat-4', label: 'Means Test Calculator Help', icon: <MessageCircle />, href: '#' },
    ],
  },
  {
    id: 'hisory',
    title: 'History',
    items: [
      { id: 'chat-5', label: 'Automatic Stay Analysis - Johnson Case', icon: <MessageCircle />, href: '#' },
      { id: 'chat-6', label: 'Ch. 13 Payment Plan Calculator', icon: <MessageCircle />, href: '#' },
    ],
  },
];

// ============================================================================
// BASIC USAGE STORIES
// ============================================================================

export const Default: Story = {
  args: {
    sections: defaultSections,
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', height: '100vh' }}>
      <Sidebar
        variant="base"
        sections={[
          {
            id: 'main',
            title: 'Default',
            items: [
              { id: 'home', label: 'Home', icon: <LucideHome />, isActive: true },
              { id: 'profile', label: 'Profile', icon: <User /> },
              { id: 'settings', label: 'Settings', icon: <Settings /> },
            ],
          },
        ]}
      />
      <Sidebar
        variant="compact"
        sections={[
          {
            id: 'main',
            title: 'Compact',
            items: [
              { id: 'home', label: 'Home', icon: <LucideHome />, isActive: true },
              { id: 'profile', label: 'Profile', icon: <User /> },
              { id: 'settings', label: 'Settings', icon: <Settings /> },
            ],
          },
        ]}
      />
      <Sidebar
        variant="minimal"
        sections={[
          {
            id: 'main',
            title: 'Minimal',
            items: [
              { id: 'home', label: 'Home', icon: <LucideHome />, isActive: true },
              { id: 'profile', label: 'Profile', icon: <User /> },
              { id: 'settings', label: 'Settings', icon: <Settings /> },
            ],
          },
        ]}
      />
    </div>
  ),
};

// ============================================================================
// COLLAPSIBLE FUNCTIONALITY STORIES
// ============================================================================

export const Collapsible: Story = {
  render: function Collapsible() {
    const [collapsed, setCollapsed] = useState(false);
    const [activeId, setActiveId] = useState('search');
    const { mobileProps, isMobile, toggleMobile, openMobile, closeMobile } = useSidebar();

    // Auto-expand sidebar when switching to mobile view
    useEffect(() => {
      if (isMobile && collapsed) {
        setCollapsed(false);
      }
    }, [isMobile, collapsed]);

    const sections = defaultSections.map((section) => ({
      ...section,
      items: section.items.map((item) => ({
        ...item,
        isActive: item.id === activeId,
        onClick: () => setActiveId(item.id),
      })),
    }));

    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top Header Bar */}
        <header
          style={{
            height: '60px',
            width: '100%',
            padding: '0 var(--space-16)',
            backgroundColor: 'var(--theme-color-foreground)',
            borderBlockEnd: '1px solid var(--theme-border-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 100,
          }}
        >
          {/* Left side - Sidebar toggle and branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-16)' }}>
            <IconButton
              fill="none"
              size="large"
              aria-label="Toggle Sidebar"
              shape="bevel"
              onClick={() => {
                if (isMobile) {
                  // Auto-expand when opening mobile sidebar
                  if (!mobileProps.mobileOpen) {
                    setCollapsed(false);
                  }
                  toggleMobile();
                } else {
                  setCollapsed(!collapsed);
                }
              }}
            >
              <Menu />
            </IconButton>
          </div>

          {/* Right side - User actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
            <Button variant="secondary" size="small">
              <Search size={16} />
              Search
            </Button>
            <Button variant="secondary" size="small">
              <Settings size={16} />
              Settings
            </Button>
            <div
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'var(--theme-color-component)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '2px solid var(--theme-border-base)',
              }}
            >
              <User size={16} />
            </div>
          </div>
        </header>

        {/* Main content area with sidebar and content */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Sidebar
            collapsible
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(!collapsed)}
            sections={sections}
            footer={
              <SidebarSectionStatic>
                <SidebarItem icon={<LogOut />} label="Sign Out" onClick={() => alert('Sign Out clicked!')} as="a" />
              </SidebarSectionStatic>
            }
            {...mobileProps}
            showBackdrop={true}
          />
          <div style={{ flex: 1, padding: '2rem', backgroundColor: 'var(--theme-color-background)', overflow: 'auto' }}>
            <h2>Collapsible Sidebar</h2>
            <p>
              This example demonstrates the collapsible functionality of the Sidebar component with a realistic app
              layout.
            </p>

            <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
              <h3>Controls:</h3>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button variant="base" onClick={() => setCollapsed(!collapsed)}>
                  {collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                </Button>
                <Button variant="secondary" onClick={() => setCollapsed(false)}>
                  Force Expand
                </Button>
                <Button variant="secondary" onClick={() => setCollapsed(true)}>
                  Force Collapse
                </Button>
              </div>
            </div>

            {/* Mobile Controls - Only show on mobile */}
            {isMobile && (
              <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
                <h3>Mobile Controls:</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Button variant="base" onClick={toggleMobile}>
                    {mobileProps.mobileOpen ? 'Close Mobile Sidebar' : 'Open Mobile Sidebar'}
                  </Button>
                  <Button variant="secondary" onClick={openMobile}>
                    Open Mobile
                  </Button>
                  <Button variant="secondary" onClick={closeMobile}>
                    Close Mobile
                  </Button>
                </div>
              </div>
            )}

            <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
              <h3>Current State:</h3>
              <pre
                style={{
                  backgroundColor: 'var(--theme-color-component)',
                  padding: '1rem',
                  borderRadius: '4px',
                  color: 'var(--theme-text-base)',
                }}
              >
                {JSON.stringify(
                  {
                    collapsed,
                    activeId,
                    isMobile,
                    mobileOpen: mobileProps.mobileOpen,
                    breakpoint: mobileProps.mobileBreakpoint,
                  },
                  null,
                  2,
                )}
              </pre>
            </div>

            <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
              <h3>Features:</h3>
              <ul>
                <li>Toggle between expanded and collapsed states</li>
                <li>Icon-only view when collapsed</li>
                <li>Maintains functionality in both states</li>
                <li>Custom footer with sign-out button</li>
                <li>Top header bar with unified sidebar control</li>
                <li>Realistic app layout and branding</li>
                <li>Mobile responsive behavior</li>
                <li>
                  <strong>Unified Control:</strong> SidebarLogo handles both collapsed and mobile states
                </li>
              </ul>
            </div>

            <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
              <h3>Layout Behavior:</h3>
              <ul>
                <li>
                  <strong>Expanded:</strong> Sidebar takes up space, content adjusts accordingly
                </li>
                <li>
                  <strong>Collapsed:</strong> Sidebar becomes narrow, more space for content
                </li>
                <li>
                  <strong>Header:</strong> Always visible at top, contains unified sidebar control
                </li>
                <li>
                  <strong>Responsive:</strong> Works well on different screen sizes
                </li>
                <li>
                  <strong>Mobile:</strong> Below 768px, sidebar overlays content
                </li>
              </ul>
            </div>

            <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
              <h3>Mobile Behavior:</h3>
              <p>
                <strong>💡 Tip:</strong> Resize your browser window to be narrower than 768px to see the mobile
                behavior. On mobile, the sidebar will overlay content and can be toggled with the unified logo control.
              </p>
              <ul>
                <li>
                  <strong>Desktop (&gt;768px):</strong> Sidebar pushes content (push layout)
                </li>
                <li>
                  <strong>Mobile (≤768px):</strong> Sidebar overlays content (overlay layout)
                </li>
                <li>
                  <strong>Collapsed State:</strong> Works on both desktop and mobile
                </li>
                <li>
                  <strong>Unified Control:</strong> SidebarLogo automatically adapts to context
                </li>
                <li>
                  <strong>Smart Behavior:</strong> Desktop = toggle collapse, Mobile = toggle overlay
                </li>
              </ul>
            </div>

            {/* Sample content to demonstrate layout */}
            <div style={{ marginTop: '2rem' }}>
              <h3>Sample Content</h3>
              <p>This area demonstrates how your main content will look alongside the sidebar.</p>

              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    padding: '1rem',
                    margin: '1rem 0',
                    backgroundColor: 'var(--theme-color-component)',
                    borderRadius: '8px',
                    border: '1px solid var(--theme-border-base)',
                  }}
                >
                  <h4>Content Section {i + 1}</h4>
                  <p>
                    This is sample content to help you visualize the layout. Notice how the content area adjusts when
                    you toggle the sidebar.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============================================================================
// RESPONSIVE BEHAVIOR STORIES
// ============================================================================

export const Responsive: Story = {
  render: function Responsive() {
    const { mobileProps, isMobile, toggleMobile, openMobile, closeMobile } = useSidebar();

    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* Mobile toggle button - only show on mobile */}
        {isMobile && (
          <button
            onClick={toggleMobile}
            style={{
              position: 'fixed',
              top: '1rem',
              left: '1rem',
              zIndex: 1001,
              padding: '0.5rem',
              background: 'var(--theme-color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            ☰ Menu
          </button>
        )}

        {/* Responsive sidebar */}
        <Sidebar sections={defaultSections} variant="base" collapsible={true} {...mobileProps} showBackdrop={true} />

        {/* Main content */}
        <main
          style={{
            flex: 1,
            padding: '2rem',
            background: 'var(--theme-color-background)',
            overflow: 'auto',
          }}
        >
          <h1>Responsive Sidebar</h1>
          <p>
            This example demonstrates the responsive behavior of the Sidebar component. The sidebar automatically adapts
            its behavior based on screen size.
          </p>

          <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
            <h3>Responsive Behavior:</h3>
            <ul>
              <li>
                <strong>Desktop (&gt;768px):</strong> Sidebar pushes content to the right
              </li>
              <li>
                <strong>Mobile/Tablet (≤768px):</strong> Sidebar overlays content and can be toggled
              </li>
              <li>
                <strong>Collapsed state:</strong> Sidebar collapses to icon-only view
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
            <h3>Mobile Controls:</h3>
            <p>These controls only work on mobile/tablet screens (≤768px):</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <Button variant="base" onClick={openMobile}>
                Open Mobile Sidebar
              </Button>
              <Button variant="secondary" onClick={closeMobile}>
                Close Mobile Sidebar
              </Button>
              <Button variant="secondary" onClick={toggleMobile}>
                Toggle Mobile Sidebar
              </Button>
            </div>
          </div>

          <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
            <h3>Current State:</h3>
            <pre
              style={{
                backgroundColor: 'var(--theme-color-component)',
                padding: '1rem',
                borderRadius: '4px',
                color: 'var(--theme-text-base)',
              }}
            >
              {JSON.stringify(
                {
                  isMobile,
                  mobileOpen: mobileProps.mobileOpen,
                  breakpoint: mobileProps.mobileBreakpoint,
                },
                null,
                2,
              )}
            </pre>
          </div>

          <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
            <h3>Try it:</h3>
            <p>
              Resize your browser window to see the responsive behavior in action. On mobile-sized screens, the sidebar
              will overlay content and can be controlled with the buttons above.
            </p>
            <p
              style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: 'var(--theme-color-component)',
                borderRadius: '4px',
              }}
            >
              <strong>💡 Tip:</strong> Resize your browser window to be narrower than 768px to see the mobile behavior.
              You'll see a mobile menu button appear in the top-left corner, and the sidebar will overlay content
              instead of pushing it.
            </p>
          </div>
        </main>
      </div>
    );
  },
};

export const useSidebarHook: Story = {
  render: function UseSidebarHook() {
    const { mobileProps, isMobile, toggleMobile } = useSidebar();

    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* Mobile toggle button - only show on mobile */}
        {isMobile && (
          <button
            onClick={toggleMobile}
            style={{
              position: 'fixed',
              top: '1rem',
              left: '1rem',
              zIndex: 1001,
              padding: '0.5rem',
              background: 'var(--theme-color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            ☰ Menu
          </button>
        )}

        {/* Responsive sidebar */}
        <Sidebar sections={defaultSections} variant="base" collapsible={true} {...mobileProps} showBackdrop={true} />

        {/* Main content */}
        <main
          style={{
            flex: 1,
            padding: '2rem',
            background: 'var(--theme-color-background)',
            overflow: 'auto',
          }}
        >
          <h1>useSidebar Hook Example</h1>
          <p>
            This example demonstrates how to use the <code>useSidebar</code> hook for responsive behavior:
          </p>

          <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
            <h3>Hook Usage:</h3>
            <pre
              style={{
                backgroundColor: 'var(--theme-color-component)',
                padding: '1rem',
                borderRadius: '4px',
                color: 'var(--theme-text-base)',
                overflow: 'auto',
              }}
            >
              {`const { mobileProps, isMobile, toggleMobile } = useSidebar();

// mobileProps automatically provides:
// - mobileOpen: boolean
// - onMobileToggle: (open: boolean) => void
// - mobileBreakpoint: number

// Spread into Sidebar component
<Sidebar {...mobileProps} showBackdrop={true} />`}
            </pre>
          </div>

          <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
            <h3>Current State:</h3>
            <pre
              style={{
                backgroundColor: 'var(--theme-color-component)',
                padding: '1rem',
                borderRadius: '4px',
                color: 'var(--theme-text-base)',
              }}
            >
              {JSON.stringify({ isMobile, mobileOpen: mobileProps.mobileOpen }, null, 2)}
            </pre>
          </div>

          <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
            <h3>Benefits:</h3>
            <ul>
              <li>Automatic mobile detection</li>
              <li>Simplified state management</li>
              <li>Built-in responsive behavior</li>
              <li>Clean, declarative API</li>
            </ul>
          </div>
        </main>
      </div>
    );
  },
};

// ============================================================================
// SECTION CONTROL STORIES
// ============================================================================

export const ControlledSections: Story = {
  render: function ControlledSections() {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
      main: true,
      history: false,
    });

    const handleSectionToggle = (sectionId: string, expanded: boolean) => {
      setExpandedSections((prev) => ({
        ...prev,
        [sectionId]: expanded,
      }));
      console.log(`Section ${sectionId} ${expanded ? 'expanded' : 'collapsed'}`);
    };

    const sections = [
      {
        id: 'main',
        title: 'Main Navigation',
        items: [
          { id: 'home', label: 'Home', icon: <LucideHome />, isActive: true },
          { id: 'dashboard', label: 'Dashboard', icon: <Search /> },
          { id: 'messages', label: 'Messages', icon: <MessageCircle />, badge: '3' },
        ],
      },
      {
        id: 'history',
        title: 'History',
        items: [
          { id: 'recent-1', label: 'Recent Chat 1', icon: <MessageCircle /> },
          { id: 'recent-2', label: 'Recent Chat 2', icon: <MessageCircle /> },
          { id: 'recent-3', label: 'Recent Chat 3', icon: <MessageCircle /> },
        ],
      },
      {
        id: 'settings',
        title: 'Settings',
        items: [
          { id: 'profile', label: 'Profile', icon: <User /> },
          { id: 'preferences', label: 'Preferences', icon: <Settings /> },
        ],
      },
    ];

    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar
          sections={sections}
          expandedSections={expandedSections}
          onSectionToggle={handleSectionToggle}
          sectionsCollapsible={true}
        />
        <div style={{ flex: 1, padding: '2rem', backgroundColor: 'var(--theme-color-background)' }}>
          <h2>Controlled Sections</h2>
          <p>This example demonstrates how to control which sections are expanded/collapsed.</p>

          <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
            <h3>Current State:</h3>
            <pre
              style={{
                backgroundColor: 'var(--theme-color-component)',
                padding: '1rem',
                borderRadius: '4px',
                color: 'var(--theme-text-base)',
              }}
            >
              {JSON.stringify(expandedSections, null, 2)}
            </pre>
          </div>

          <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
            <h3>Controls:</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {Object.keys(expandedSections).map((sectionId) => (
                <Button
                  key={sectionId}
                  variant="secondary"
                  onClick={() => handleSectionToggle(sectionId, !expandedSections[sectionId])}
                >
                  {expandedSections[sectionId] ? 'Collapse' : 'Expand'} {sectionId}
                </Button>
              ))}
              <Button variant="base" onClick={() => setExpandedSections({ main: true, history: true, settings: true })}>
                Expand All
              </Button>
              <Button
                variant="secondary"
                onClick={() => setExpandedSections({ main: false, history: false, settings: false })}
              >
                Collapse All
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const DefaultExpandedSections: Story = {
  render: function DefaultExpandedSections() {
    const sections = [
      {
        id: 'main',
        title: 'Main Navigation',
        items: [
          { id: 'home', label: 'Home', icon: <LucideHome />, isActive: true },
          { id: 'dashboard', label: 'Dashboard', icon: <Search /> },
        ],
      },
      {
        id: 'history',
        title: 'History',
        items: [
          { id: 'recent-1', label: 'Recent Chat 1', icon: <MessageCircle /> },
          { id: 'recent-2', label: 'Recent Chat 2', icon: <MessageCircle /> },
        ],
      },
      {
        id: 'settings',
        title: 'Settings',
        items: [
          { id: 'profile', label: 'Profile', icon: <User /> },
          { id: 'preferences', label: 'Preferences', icon: <Settings /> },
        ],
      },
    ];

    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar
          sections={sections}
          defaultExpandedSections={{
            main: true, // Main section expanded by default
            history: false, // History section collapsed by default
            settings: true, // Settings section expanded by default
          }}
        />
        <div style={{ flex: 1, padding: '2rem', backgroundColor: 'var(--theme-color-background)' }}>
          <h2>Default Expanded Sections</h2>
          <p>
            This example shows how to set default expanded states for sections using the \`defaultExpandedSections\`
            prop.
          </p>

          <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
            <h3>Configuration:</h3>
            <pre
              style={{
                backgroundColor: 'var(--theme-color-component)',
                padding: '1rem',
                borderRadius: '4px',
                color: 'var(--theme-text-base)',
              }}
            >
              {`defaultExpandedSections={{
                main: true,     // Main section expanded by default
                history: false, // History section collapsed by default
                settings: true, // Settings section expanded by default
              }}`}
            </pre>
          </div>

          <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
            <h3>Benefits:</h3>
            <ul>
              <li>Control initial state without managing controlled state</li>
              <li>Improve performance by not expanding all sections by default</li>
              <li>Provide better UX by showing most important sections first</li>
              <li>Reduce content loading issues in complex applications</li>
            </ul>
          </div>
        </div>
      </div>
    );
  },
};

export const LazyLoadingSections: Story = {
  render: function LazyLoadingSections() {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
      main: true,
      history: false,
      settings: false,
    });

    const handleSectionToggle = (sectionId: string, expanded: boolean) => {
      setExpandedSections((prev) => ({
        ...prev,
        [sectionId]: expanded,
      }));
    };

    const sections = [
      {
        id: 'main',
        title: 'Main Navigation',
        items: [
          { id: 'home', label: 'Home', icon: <LucideHome />, isActive: true },
          { id: 'dashboard', label: 'Dashboard', icon: <Search /> },
          { id: 'messages', label: 'Messages', icon: <MessageCircle />, badge: '3' },
        ],
      },
      {
        id: 'history',
        title: 'History (Lazy Loaded)',
        items: [
          { id: 'recent-1', label: 'Recent Chat 1', icon: <MessageCircle /> },
          { id: 'recent-2', label: 'Recent Chat 2', icon: <MessageCircle /> },
          { id: 'recent-3', label: 'Recent Chat 3', icon: <MessageCircle /> },
          { id: 'recent-4', label: 'Recent Chat 4', icon: <MessageCircle /> },
          { id: 'recent-5', label: 'Recent Chat 5', icon: <MessageCircle /> },
        ],
      },
      {
        id: 'settings',
        title: 'Settings (Lazy Loaded)',
        items: [
          { id: 'profile', label: 'Profile', icon: <User /> },
          { id: 'preferences', label: 'Preferences', icon: <Settings /> },
          { id: 'security', label: 'Security', icon: <Settings /> },
          { id: 'notifications', label: 'Notifications', icon: <Settings /> },
        ],
      },
    ];

    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar
          sections={sections}
          expandedSections={expandedSections}
          onSectionToggle={handleSectionToggle}
          lazyLoadSections={true}
          sectionsCollapsible={true}
        />
        <div style={{ flex: 1, padding: '2rem', backgroundColor: 'var(--theme-color-background)' }}>
          <h2>Lazy Loading Sections</h2>
          <p>
            This example demonstrates lazy loading of section content. Content is only rendered when sections are
            expanded.
          </p>

          <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
            <h3>Performance Benefits:</h3>
            <ul>
              <li>
                <strong>Faster Initial Load:</strong> Only render visible content
              </li>
              <li>
                <strong>Reduced Memory Usage:</strong> DOM elements created on-demand
              </li>
              <li>
                <strong>Better Performance:</strong> Fewer components to manage
              </li>
              <li>
                <strong>Scalable:</strong> Works well with large numbers of sections
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
            <h3>Current State:</h3>
            <pre
              style={{
                backgroundColor: 'var(--theme-color-component)',
                padding: '1rem',
                borderRadius: '4px',
                color: 'var(--theme-text-base)',
              }}
            >
              {JSON.stringify(expandedSections, null, 2)}
            </pre>
          </div>

          <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
            <h3>Try it:</h3>
            <p>
              Expand the "History" or "Settings" sections to see lazy loading in action. The content will only be
              rendered when you expand the section.
            </p>
          </div>
        </div>
      </div>
    );
  },
};

// ============================================================================
// CUSTOMIZATION STORIES
// ============================================================================

export const WithCustomHeader: Story = {
  args: {
    header: (
      <div>
        <h2 style={{ margin: 0, fontSize: '1rem', color: 'var(--theme-text-base)' }}>My App</h2>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.675rem', color: 'var(--theme-text-muted)' }}>v2.0.1</p>
      </div>
    ),
    sections: defaultSections,
  },
};

export const WithCustomFooter: Story = {
  args: {
    sections: defaultSections,
    footer: (
      <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem' }}>
        <Button variant="secondary" icon={<LogOut />} iconPosition="right">
          Sign Out
        </Button>
      </div>
    ),
  },
};

export const WithCustomMenu: Story = {
  render: function WithCustomMenu() {
    const sectionsWithCustomMenu = [
      {
        id: 'main',
        title: 'Pinned',
        items: [
          {
            id: 'chat-1',
            label: 'Chapter 7 Filing Strategy Analysis',
            icon: <MessageCircle />,
            href: '#',
            customMenu: (
              <SidebarMenu trigger={<MoreVertical size={20} />}>
                <SidebarMenu.Item icon={<Edit size={20} />} onClick={() => console.log('Rename clicked!')}>
                  Rename
                </SidebarMenu.Item>
                <SidebarMenu.Item icon={<Star size={20} />} onClick={() => console.log('Pin clicked!')}>
                  Pin Conversation
                </SidebarMenu.Item>
                <SidebarMenu.Item icon={<Trash2 size={20} />} onClick={() => console.log('Delete clicked!')}>
                  Delete
                </SidebarMenu.Item>
              </SidebarMenu>
            ),
          },
          {
            id: 'chat-2',
            label: 'Asset Protection Research',
            icon: <MessageCircle />,
            href: '#',
            customMenu: (
              <SidebarMenu trigger={<MoreVertical size={20} />}>
                <SidebarMenu.Item icon={<Edit size={16} />} onClick={() => alert('Rename clicked!')}>
                  Rename
                </SidebarMenu.Item>
                <SidebarMenu.Item icon={<Star size={16} />} onClick={() => alert('Pin clicked!')}>
                  Pin Conversation
                </SidebarMenu.Item>
                <SidebarMenu.Item icon={<Trash2 size={16} />} onClick={() => alert('Delete clicked!')}>
                  Delete
                </SidebarMenu.Item>
              </SidebarMenu>
            ),
          },
        ],
      },
    ];

    return <Sidebar sections={sectionsWithCustomMenu} />;
  },
};

export const WithDisabledItems: Story = {
  args: {
    sections: [
      {
        id: 'main',
        items: [
          { id: 'home', label: 'Home', icon: <LucideHome />, isActive: true },
          { id: 'search', label: 'Search', icon: <Search /> },
          { id: 'messages', label: 'Messages (Coming Soon)', icon: <MessageCircle />, disabled: true },
          { id: 'settings', label: 'Settings', icon: <Settings /> },
        ],
      },
    ],
  },
};

export const WithTooltips: Story = {
  render: function WithTooltips() {
    const [collapsed, setCollapsed] = useState(false);

    const sectionsWithTooltips = [
      {
        id: 'main',
        title: 'Navigation',
        items: [
          {
            id: 'home',
            label: 'Home',
            icon: <LucideHome />,
            isActive: true,
            description: 'Navigate to the main dashboard and overview',
          },
          {
            id: 'search',
            label: 'Search',
            icon: <Search />,
            description: 'Search through all your conversations and content',
          },
          {
            id: 'messages',
            label: 'Messages',
            icon: <MessageCircle />,
            description: 'View and manage all your chat conversations',
          },
          {
            id: 'settings',
            label: 'Settings',
            icon: <Settings />,
            description: 'Configure application preferences and account settings',
          },
        ],
      },
      {
        id: 'recent',
        title: 'Recent Chats',
        items: [
          {
            id: 'chat-1',
            label: 'Legal Strategy Discussion',
            icon: <MessageCircle />,
            description: 'Chapter 7 bankruptcy filing strategy analysis for Johnson case',
          },
          {
            id: 'chat-2',
            label: 'Asset Protection',
            icon: <MessageCircle />,
            description: 'Research on asset protection strategies and exemption planning',
          },
        ],
      },
    ];

    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar
          collapsible
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          sections={sectionsWithTooltips}
        />
        <div style={{ flex: 1, padding: '2rem', backgroundColor: 'var(--theme-color-background)' }}>
          <h2>Sidebar with Tooltips</h2>
          <p>
            This example demonstrates how to add tooltips to sidebar items using the <code>description</code> prop.
            Tooltips are especially useful when the sidebar is collapsed or when you want to provide additional context.
          </p>

          <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
            <h3>Usage:</h3>
            <pre
              style={{
                backgroundColor: 'var(--theme-color-component)',
                padding: '1rem',
                borderRadius: '4px',
                color: 'var(--theme-text-base)',
                overflow: 'auto',
              }}
            >
              {`{
  id: 'home',
  label: 'Home',
  icon: <HomeIcon />,
  description: 'Navigate to the main dashboard and overview'
}`}
            </pre>
          </div>

          <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
            <h3>Controls:</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Button variant="base" onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              </Button>
            </div>
          </div>

          <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
            <h3>Features:</h3>
            <ul>
              <li>Hover over any sidebar item to see its tooltip</li>
              <li>Tooltips appear on the right side of sidebar items</li>
              <li>Tooltips work in both expanded and collapsed states</li>
              <li>
                Optional - only items with <code>description</code> prop show tooltips
              </li>
              <li>Uses your existing Tooltip component for consistency</li>
            </ul>
          </div>

          <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
            <h3>Try it:</h3>
            <p>
              <strong>💡 Tip:</strong> Collapse the sidebar to see how tooltips provide context when labels are hidden.
              Hover over the icons to see the descriptive tooltips.
            </p>
          </div>
        </div>
      </div>
    );
  },
};

export const WithCustomRendering: Story = {
  args: {
    sections: defaultSections,
    renderNavItem: (item, defaultRender) => {
      if (item.id === 'messages') {
        return (
          <div key={item.id} style={{ position: 'relative' }}>
            {defaultRender}
            <div
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                width: '10px',
                height: '10px',
                backgroundColor: 'var(--theme-color-error)',
                border: '2px solid var(--color-white)',
                borderRadius: '50%',
              }}
            />
          </div>
        );
      }
      return defaultRender;
    },
  },
};

export const CompoundComponents: Story = {
  args: {
    header: (
      <div style={{ padding: '1rem', textAlign: 'center' }}>
        <h3 style={{ margin: 0 }}>Compound Example</h3>
      </div>
    ),
    sections: [
      {
        title: 'Main Navigation',
        id: 'main-nav',
        items: [
          {
            id: 'dashboard',
            icon: <LucideHome />,
            label: 'Dashboard',
            isActive: true,
            onClick: () => console.log('Dashboard clicked'),
          },
          {
            id: 'search',
            icon: <Search />,
            label: 'Search',
            badge: 'New',
            href: '/analytics',
          },
          {
            id: 'messages',
            icon: <MessageCircle />,
            label: 'Messages',
            badge: '5',
            onClick: () => console.log('Messages clicked'),
          },
        ],
      },
      {
        title: 'Account',
        id: 'account',
        items: [
          {
            id: 'profile',
            icon: <User />,
            label: 'Profile',
            href: '/profile',
          },
          {
            id: 'settings',
            icon: <Settings />,
            label: 'Settings',
            href: '/settings',
          },
        ],
      },
    ],
  },
};

// ============================================================================
// REAL-WORLD EXAMPLE STORIES
// ============================================================================

export const RealWorldExample: Story = {
  render: function RealWorldExample() {
    const [collapsed, setCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');

    const sections = [
      {
        id: 'main',
        title: 'Main',
        items: [
          {
            id: 'search',
            label: 'Search',
            icon: <Search />,
            isActive: activeSection === 'search',
            onClick: () => setActiveSection('search'),
          },
          {
            id: 'users',
            label: 'Users',
            icon: <User />,
            isActive: activeSection === 'users',
            onClick: () => setActiveSection('users'),
            badge: '24',
          },
          {
            id: 'messages',
            label: 'Messages',
            icon: <MessageCircle />,
            isActive: activeSection === 'messages',
            onClick: () => setActiveSection('messages'),
            badge: '3',
          },
        ],
      },
      {
        id: 'settings',
        title: 'Configuration',
        items: [
          {
            id: 'settings',
            label: 'Settings',
            icon: <Settings />,
            isActive: activeSection === 'settings',
            onClick: () => setActiveSection('settings'),
          },
        ],
      },
    ];

    return (
      <Sidebar
        collapsible
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        sections={sections}
        header={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#007bff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              A
            </div>
            {!collapsed && (
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>Admin Panel</div>
                <div style={{ fontSize: '0.675rem', color: '#666' }}>v3.2.1</div>
              </div>
            )}
          </div>
        }
        footer={
          <Flex flexDirection="column" gap="8px">
            <SidebarItem
              icon={<CircleHelp />}
              label="Help & Support"
              onClick={() => alert('Help clicked!')}
              as="button"
            />
          </Flex>
        }
      />
    );
  },
};

export const CompleteExample: Story = {
  render: function CompleteExample() {
    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <SidebarExample />
        <div style={{ flex: 1, padding: '2rem', backgroundColor: 'var(--theme-color-background)' }}>
          <h2>Complete Responsive Example</h2>
          <p>This is the complete SidebarExample component that demonstrates all the responsive features:</p>

          <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
            <h3>Features Demonstrated:</h3>
            <ul>
              <li>Automatic responsive behavior switching</li>
              <li>Mobile toggle button with backdrop</li>
              <li>useSidebar hook for state management</li>
              <li>Ref-based programmatic control</li>
              <li>Proper layout structure for all screen sizes</li>
              <li>Working controls for mobile sidebar</li>
            </ul>
          </div>

          <div style={{ marginTop: '2rem', color: 'var(--theme-text-base)' }}>
            <h3>Try it:</h3>
            <p>
              Resize your browser window to see the responsive behavior in action. On mobile-sized screens, the sidebar
              will overlay content and can be controlled with the buttons in the example.
            </p>
          </div>
        </div>
      </div>
    );
  },
};
