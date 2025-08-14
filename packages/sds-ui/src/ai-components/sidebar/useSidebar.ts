import { useState, useCallback, useEffect, useRef } from 'react';

export interface UseSidebarOptions {
  defaultMobileOpen?: boolean;
  mobileBreakpoint?: number;
  onMobileToggle?: (open: boolean) => void;
}

export interface UseSidebarReturn {
  isMobileOpen: boolean;
  isMobile: boolean;
  openMobile: () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
  mobileProps: {
    mobileOpen: boolean;
    onMobileToggle: (open: boolean) => void;
    mobileBreakpoint: number;
  };
}

export function useSidebar(options: UseSidebarOptions = {}): UseSidebarReturn {
  const { defaultMobileOpen = false, mobileBreakpoint = 768, onMobileToggle } = options;

  const [isMobileOpen, setIsMobileOpen] = useState(defaultMobileOpen);
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth <= mobileBreakpoint : false;
  });

  // Track if this is the initial mount to avoid auto-closing on mount
  const isInitialMount = useRef(true);

  // Handle mobile toggle
  const handleMobileToggle = useCallback(
    (open: boolean) => {
      if (onMobileToggle) {
        onMobileToggle(open);
      } else {
        setIsMobileOpen(open);
      }
    },
    [onMobileToggle],
  );

  // Check if we're in mobile view
  const checkMobile = useCallback(() => {
    const mobileView = window.innerWidth <= mobileBreakpoint;
    const wasMobile = isMobile;
    setIsMobile(mobileView);

    // Auto-close mobile sidebar when switching from mobile to desktop
    // Don't auto-close on initial mount
    if (!isInitialMount.current && wasMobile && !mobileView && isMobileOpen) {
      handleMobileToggle(false);
    }

    // Mark that we're no longer on initial mount
    isInitialMount.current = false;
  }, [mobileBreakpoint, isMobile, isMobileOpen, handleMobileToggle]);

  // Check mobile state on mount and resize
  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, [checkMobile]);

  // Close mobile sidebar on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileOpen) {
        handleMobileToggle(false);
      }
    };

    if (isMobileOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMobileOpen, handleMobileToggle]);

  const openMobile = useCallback(() => handleMobileToggle(true), [handleMobileToggle]);
  const closeMobile = useCallback(() => handleMobileToggle(false), [handleMobileToggle]);
  const toggleMobile = useCallback(() => handleMobileToggle(!isMobileOpen), [handleMobileToggle, isMobileOpen]);

  return {
    isMobileOpen,
    isMobile,
    openMobile,
    closeMobile,
    toggleMobile,
    mobileProps: {
      mobileOpen: isMobileOpen,
      onMobileToggle: handleMobileToggle,
      mobileBreakpoint,
    },
  };
}
