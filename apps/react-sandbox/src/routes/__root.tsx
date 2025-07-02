import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import React from 'react';
import { Navbar, NavbarAlerts, NavbarMenu, DropdownItem, Flex } from 'sds-ui';
import ThemeToggle from '../components/theme-toggle/ThemeToggle';

const links = [
  { label: 'Home', url: '/' },
  { label: 'Clients', url: '/clients' },
  { label: 'Calendar', url: '/calendar' },
  { label: 'Settings', url: '/WrapperExamples' },
];

const NavLink = ({ to, children }) => (
  <Link to={to} activeOptions={{ exact: true }}>
    {children}
  </Link>
);

function RootComponent() {
  const [username] = React.useState('User');
  const [notificationCount] = React.useState(0);
  const [isLoggedIn] = React.useState(true);

  const handleLogout = () => {
    console.log('Logging out...');
  };

  return (
    <>
      <Navbar
        logoSrc="/stretto-symbol.svg"
        logoLinkUrl="/"
        username={username}
        linkComponents={
          <Flex alignItems="center" justifyContent="space-between">
            <Flex justifyContent="flex-start" gap="16px">
              {links.map((link) => (
                <li key={link.label}>
                  <NavLink to={link.url}>{link.label}</NavLink>
                </li>
              ))}
            </Flex>
          </Flex>
        }
      >
        <Flex justifyContent="flex-end">
          <ThemeToggle />
        </Flex>
        {notificationCount > 0 && <NavbarAlerts count={notificationCount} />}
        {isLoggedIn && (
          <NavbarMenu username={username} onLogout={handleLogout}>
            <DropdownItem onClick={() => console.log('Account clicked')}>Account Information</DropdownItem>
            <DropdownItem onClick={() => console.log('Settings clicked')}>Settings</DropdownItem>
            <DropdownItem onClick={() => console.log('Help clicked')}>Help</DropdownItem>
            <DropdownItem onClick={() => console.log('Support clicked')}>Remote Support</DropdownItem>
          </NavbarMenu>
        )}
      </Navbar>
      <Outlet />
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
