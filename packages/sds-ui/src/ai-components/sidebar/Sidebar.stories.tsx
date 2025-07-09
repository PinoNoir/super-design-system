import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Sidebar, SidebarItem, SidebarSectionStatic } from './';
import { Button, Flex } from '../../components';
import { LucideHome, Settings, User, MessageCircle, LogOut, CircleHelp, Search, FilePlus2 } from 'lucide-react';

const meta: Meta<typeof Sidebar> = {
  title: 'AI Components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A flexible sidebar component with support for navigation sections, collapsing, and extensive customization options. See the documentation for detailed usage examples and API reference.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['base', 'compact', 'minimal'],
      description: 'Visual variant of the sidebar',
    },
    collapsible: {
      control: 'boolean',
      description: 'Whether the sidebar can be collapsed',
    },
    collapsed: {
      control: 'boolean',
      description: 'Whether the sidebar is currently collapsed',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex' }}>
        <Story />
        <div
          style={{
            color: 'var(--theme-text-base)',
            flex: 1,
            padding: '2rem',
            backgroundColor: 'var(--theme-color-background)',
          }}
        >
          <h2>Main Content Area</h2>
          <p>This simulates the main application content alongside the sidebar.</p>
        </div>
      </div>
    ),
  ],
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
        active: true,
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
      { id: 'chat-1', label: 'Chapter 7 Filing Strategy Analysis', icon: <MessageCircle />, href: '#' },
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

export const Default: Story = {
  args: {
    sections: defaultSections,
  },
};

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

export const Collapsible: Story = {
  render: function Collapsible() {
    const [collapsed, setCollapsed] = useState(false);

    return (
      <Sidebar
        collapsible
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        sections={defaultSections}
        footer={
          <SidebarSectionStatic>
            <SidebarItem icon={<LogOut />} label="Sign Out" onClick={() => alert('Sign Out clicked!')} as="a" />
          </SidebarSectionStatic>
        }
      />
    );
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

export const ControlledSidebar: Story = {
  render: function ControlledSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <Button variant="base" onClick={() => setIsOpen(true)} style={{ margin: '1rem' }}>
          Open Sidebar
        </Button>

        {/* Overlay */}
        {isOpen && (
          <div
            role="button"
            tabIndex={0}
            onKeyDown={() => {}}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
          />
        )}

        {/* Sidebar */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: isOpen ? 0 : '-260px',
            height: '100vh',
            width: '260px',
            backgroundColor: 'var(--theme-color-foreground)',
            boxShadow: '2px 0 8px rgba(0,0,0,0.2)',
            transition: 'left 300ms ease-in-out',
            zIndex: 1000,
          }}
        >
          <Sidebar
            sections={defaultSections}
            footer={
              <SidebarSectionStatic>
                <SidebarItem icon={<LogOut />} label="Close Sidebar" onClick={() => setIsOpen(false)} as="button" />
              </SidebarSectionStatic>
            }
          />
        </div>
      </div>
    );
  },
};

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
          <h2>Controlled Sections Example</h2>
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
