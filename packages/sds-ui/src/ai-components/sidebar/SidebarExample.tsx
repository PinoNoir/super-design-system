import React, { useRef } from 'react';
import { Sidebar, useSidebar, SidebarRef } from './index';
import { Icon } from '@iconify/react';

// Example navigation items
const exampleSections = [
  {
    id: 'main',
    title: 'Main Navigation',
    items: [
      {
        id: 'dashboard',
        icon: <Icon icon="mdi:view-dashboard" />,
        label: 'Dashboard',
        href: '/dashboard',
      },
      {
        id: 'analytics',
        icon: <Icon icon="mdi:chart-line" />,
        label: 'Analytics',
        href: '/analytics',
      },
      {
        id: 'users',
        icon: <Icon icon="mdi:account-group" />,
        label: 'Users',
        href: '/users',
      },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    items: [
      {
        id: 'profile',
        icon: <Icon icon="mdi:account-cog" />,
        label: 'Profile',
        href: '/profile',
      },
      {
        id: 'preferences',
        icon: <Icon icon="mdi:cog" />,
        label: 'Preferences',
        href: '/preferences',
      },
    ],
  },
];

export const SidebarExample: React.FC = () => {
  const sidebarRef = useRef<SidebarRef>(null);
  const { mobileProps, isMobile, toggleMobile } = useSidebar();

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar with unified logo control */}
      <Sidebar
        ref={sidebarRef}
        sections={exampleSections}
        variant="base"
        collapsible={true}
        onToggleCollapse={() => {}}
        {...mobileProps}
        showBackdrop={true}
      />

      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: '2rem',
          background: '#f8f9fa',
          overflow: 'auto',
        }}
      >
        <h1>Responsive Sidebar Example</h1>
        <p>This example demonstrates the responsive behavior of the Sidebar component with unified controls:</p>
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
          <li>
            <strong>Unified Control:</strong> SidebarLogo automatically adapts to context
          </li>
        </ul>

        <div style={{ marginTop: '2rem' }}>
          <h3>Smart Logo Control</h3>
          <p>The SidebarLogo automatically adapts its behavior based on the viewport:</p>
          <ul>
            <li>
              <strong>Desktop:</strong> Click logo to toggle between collapsed/expanded states
            </li>
            <li>
              <strong>Mobile:</strong> Click logo to toggle mobile overlay (regardless of collapsed state)
            </li>
            <li>
              <strong>Seamless:</strong> No need for separate mobile toggle buttons
            </li>
          </ul>

          <h3>Ref Methods</h3>
          <p>You can also control the sidebar programmatically:</p>
          <button onClick={() => sidebarRef.current?.openMobile()} style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}>
            Open Mobile Sidebar
          </button>
          <button
            onClick={() => sidebarRef.current?.closeMobile()}
            style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}
          >
            Close Mobile Sidebar
          </button>
          <button
            onClick={() => sidebarRef.current?.toggleMobile()}
            style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}
          >
            Toggle Mobile Sidebar
          </button>
        </div>

        {/* Add some content to demonstrate scrolling */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} style={{ margin: '1rem 0', padding: '1rem', background: 'white', borderRadius: '4px' }}>
            <h4>Content Section {i + 1}</h4>
            <p>This is some sample content to demonstrate the layout and scrolling behavior.</p>
          </div>
        ))}
      </main>
    </div>
  );
};

export default SidebarExample;
