import clsx from 'clsx';
import styles from './styles/Sidebar.module.css';

export interface SidebarLogoProps {
  collapsible?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  hidden?: boolean;
  className?: string;
}

const SidebarLogo = ({
  collapsible = false,
  collapsed = false,
  onToggleCollapse,
  className,
  hidden = false,
}: SidebarLogoProps) => {
  if (hidden) return null; // <-- Bail out early

  const logoContent = (
    <svg viewBox="0 0 50 50" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.491 17.8175L17.7472 11.6667H44.6489L39.0183 17.8175H11.491Z" />
      <path d="M5.35081 37.5L11.607 31.3492H38.5087L32.8781 37.5H5.35081Z" />
      <path d="M7.97293 21.508L1.66663 27.6587H42.6576L48.3333 21.508H7.97293Z" />
    </svg>
  );

  if (collapsible) {
    return (
      <button
        className={clsx(styles.logoButton, className)}
        onClick={onToggleCollapse}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        type="button"
      >
        {logoContent}
      </button>
    );
  }

  return <div className={clsx(styles.logoContainer, className)}>{logoContent}</div>;
};

SidebarLogo.displayName = 'SidebarLogo';

export default SidebarLogo;
