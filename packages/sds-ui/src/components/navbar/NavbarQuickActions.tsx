import React from 'react';
import { IconButton } from '../icon-button';
import { Icon } from '@iconify/react';

export interface NavbarQuickActionsProps {
  /**
   * Specify the children to be rendered
   */
  children?: React.ReactNode;
  /**
   * Specify the function to be called when the user clicks on the quick actions button
   */
  onClick: () => void;
}

const NavbarQuickActions: React.FC<NavbarQuickActionsProps> = ({ children, onClick }) => {
  return (
    <>
      <IconButton variant="secondary" onClick={() => onClick} aria-label="Quick Actions">
        <Icon width="24px" icon="mdi:plus-circle" color="var(--color-neutral-100)" />
      </IconButton>
      {children}
    </>
  );
};

export default NavbarQuickActions;
