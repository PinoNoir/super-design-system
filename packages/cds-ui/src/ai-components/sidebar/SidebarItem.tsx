import clsx from 'clsx';
import styles from './styles/Sidebar.module.css';

export interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  badge?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  collapsed?: boolean;
  as?: React.ElementType;
  [key: string]: any;
}

const SidebarItem = ({
  icon,
  label,
  badge,
  active,
  disabled,
  className,
  collapsed = false,
  as: Component = 'button',
  ...props
}: SidebarItemProps) => (
  <Component
    className={clsx(
      styles.navButton,
      {
        [styles.active]: active,
        [styles.disabled]: disabled,
      },
      className,
    )}
    disabled={disabled}
    {...props}
  >
    {icon && <span className={styles.iconButton}>{icon}</span>}
    {!collapsed && (
      <>
        <span className={styles.navLabel}>{label}</span>
        {badge && <span className={styles.navBadge}>{badge}</span>}
      </>
    )}
  </Component>
);

SidebarItem.displayName = 'SidebarItem';

export default SidebarItem;
