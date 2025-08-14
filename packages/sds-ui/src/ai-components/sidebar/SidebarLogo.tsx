import clsx from 'clsx';
import styles from './styles/Sidebar.module.css';

export interface SidebarLogoProps {
  collapsible?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  hidden?: boolean;
  className?: string;
  isMobile?: boolean;
  mobileOpen?: boolean;
  onMobileToggle?: (open: boolean) => void;
}

const SidebarLogo = ({
  collapsible = false,
  collapsed = false,
  onToggleCollapse,
  className,
  hidden = false,
  isMobile = false,
  mobileOpen = false,
  onMobileToggle,
}: SidebarLogoProps) => {
  if (hidden) return null;

  const logoContent = (
    <svg viewBox="0 0 50 50" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.491 17.8175L17.7472 11.6667H44.6489L39.0183 17.8175H11.491Z" />
      <path d="M5.35081 37.5L11.607 31.3492H38.5087L32.8781 37.5H5.35081Z" />
      <path d="M7.97293 21.508L1.66663 27.6587H42.6576L48.3333 21.508H7.97293Z" />
    </svg>
  );

  // Determine if we should render as a button
  // Priority: mobile behavior > collapsible behavior
  const shouldRenderAsButton = () => {
    if (isMobile && onMobileToggle) {
      return true;
    }
    if (!isMobile && collapsible && onToggleCollapse) {
      return true;
    }
    return false;
  };

  // Determine the click handler and aria label based on context
  const getClickHandler = () => {
    if (isMobile && onMobileToggle) {
      // On mobile, toggle mobile overlay
      return () => onMobileToggle(!mobileOpen);
    } else if (!isMobile && collapsible && onToggleCollapse) {
      // On desktop, toggle collapsed state
      return onToggleCollapse;
    }
    return undefined;
  };

  const getAriaLabel = () => {
    if (isMobile && onMobileToggle) {
      return mobileOpen ? 'Close mobile sidebar' : 'Open mobile sidebar';
    } else if (!isMobile && collapsible && onToggleCollapse) {
      return collapsed ? 'Expand sidebar' : 'Collapse sidebar';
    }
    return 'Sidebar logo';
  };

  if (shouldRenderAsButton()) {
    const clickHandler = getClickHandler();
    const ariaLabel = getAriaLabel();

    return (
      <button
        className={clsx(styles.logoButton, className)}
        onClick={clickHandler}
        aria-label={ariaLabel}
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
