import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import Navbar from './Navbar';
import NavbarAlerts from './NabarAlerts';
import NavbarQuickActions from './NavbarQuickActions';
import NavbarMenu from './NavbarMenu';
import { DropdownItem } from '../dropdown';

const meta: Meta<typeof Navbar> = {
  title: 'Experimental/Navbar',
  component: Navbar,
  parameters: {
    controls: { expanded: true },
  },
};
export default meta;

type Story = StoryObj<typeof Navbar>;

const links = [
  { label: 'Home', url: '#' },
  { label: 'Clients', url: '#' },
  { label: 'Calendar', url: '#' },
  { label: 'Court Notices', url: '#' },
  { label: 'Credit Reports & Courses', url: '#' },
  { label: 'Documents', url: '#' },
  { label: 'Legal Noticing', url: '#' },
];

// Common navbar content component to reduce duplication
const NavbarContent = ({ username, notificationCount, isLoggedIn, handleLogout }) => (
  <>
    {notificationCount > 0 && <NavbarAlerts count={notificationCount} />}
    <NavbarQuickActions onClick={() => {}} />
    {isLoggedIn && (
      <NavbarMenu username={username} onLogout={handleLogout}>
        <DropdownItem onClick={() => console.log('Account clicked')}>Account Information</DropdownItem>
        <DropdownItem onClick={() => console.log('Settings clicked')}>Settings</DropdownItem>
        <DropdownItem onClick={() => console.log('Help clicked')}>Help</DropdownItem>
        <DropdownItem onClick={() => console.log('Support clicked')}>Remote Support</DropdownItem>
      </NavbarMenu>
    )}
  </>
);

// Basic example with links array
export const Default: Story = {
  render: function Default() {
    const [username, setUsername] = React.useState<string>('John Doe');
    const [notificationCount, setNotificationCount] = React.useState<number>(3);
    const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(true);

    const handleLogout = () => {
      console.log('CustomLinks: User logged out');
      setIsLoggedIn(false);
      setUsername('');
      setNotificationCount(0);
    };

    return (
      <Navbar logoSrc="/symbol.svg" logoLinkUrl="#" links={links} username={username}>
        <NavbarContent
          username={username}
          notificationCount={notificationCount}
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
        />
      </Navbar>
    );
  },
};

// Example with custom link components
export const CustomLinks: Story = {
  render: function CustomLinks() {
    const [username, setUsername] = React.useState<string>('John Doe');
    const [notificationCount, setNotificationCount] = React.useState<number>(3);
    const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(true);

    const handleLogout = () => {
      setIsLoggedIn(false);
      setUsername('');
      setNotificationCount(0);
    };

    return (
      <Navbar
        logoSrc="/symbol.svg"
        logoLinkUrl="#"
        username={username}
        linkComponents={
          <>
            {links.map((link) => (
              <li key={link.label}>
                <a href={link.url}>{link.label}</a>
              </li>
            ))}
          </>
        }
      >
        <NavbarContent
          username={username}
          notificationCount={notificationCount}
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
        />
      </Navbar>
    );
  },
};
