import React from 'react';
import { Avatar } from '../avatar';
import { Button } from '../button';
import { Dropdown, DropdownMenu, DropdownTrigger } from '../dropdown';
import { Icon } from '@iconify/react';
import styles from './styles/Navbar.module.css';
import { Divider } from '../divider';

export interface NavbarMenuProps {
  username?: string;
  onLogout?: () => void;
  children?: React.ReactNode;
}

const NavbarMenu: React.FC<NavbarMenuProps> = ({ username, onLogout, children }) => {
  return (
    <Dropdown>
      <DropdownTrigger className={styles.avatarTrigger}>
        <div className={styles.navAvatar}>
          <Avatar isLoggedIn={!!username} src={null} username={username} />
          <Icon width="20px" icon="mdi:chevron-down" color="var(--theme-icon-base)" />
        </div>
      </DropdownTrigger>
      <DropdownMenu>
        {children}
        <Divider orientation="horizontal" thickness="thin" color="onLight" />
        <div className={styles.logoutButtonWrapper}>
          <Button variant="primary" onClick={onLogout}>
            Log Out
          </Button>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

NavbarMenu.displayName = 'NavbarMenu';

export default NavbarMenu;
