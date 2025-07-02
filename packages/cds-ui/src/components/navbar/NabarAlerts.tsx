import React from 'react';
import { Badge } from '../badge';
import styles from './styles/Navbar.module.css';
import { Icon } from '@iconify/react';
import { IconButton } from '../icon-button';

export interface NavbarAlertProps {
  /**
   * Specify the number of alerts the user has
   */
  count: number;

  /**
   * Specify the url to navigate to when the user clicks on the alert button
   */
  onClick?: () => void;
}

const NavbarAlerts: React.FC<NavbarAlertProps> = ({ count, onClick }) => {
  return (
    <div className={styles.alertContainer}>
      <IconButton onClick={onClick} aria-label="View alerts">
        <Icon width="24px" icon="mdi:bell" color="var(--color-neutral-100)" />
      </IconButton>
      <div className={styles.alertBadge}>
        <Badge variant="warning" color="warning">
          {count}
        </Badge>
      </div>
    </div>
  );
};

export default NavbarAlerts;
