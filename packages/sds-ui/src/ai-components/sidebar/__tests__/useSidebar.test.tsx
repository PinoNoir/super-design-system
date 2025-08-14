import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useSidebar } from '../useSidebar';

// Mock window.innerWidth and resize events
const mockWindowWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
};

const mockResizeEvent = (width: number) => {
  mockWindowWidth(width);
  window.dispatchEvent(new Event('resize'));
};

describe('useSidebar Hook', () => {
  beforeEach(() => {
    // Reset window width to desktop size
    mockWindowWidth(1024);
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('initializes with default values', () => {
      const { result } = renderHook(() => useSidebar());

      expect(result.current.isMobile).toBe(false);
      expect(result.current.isMobileOpen).toBe(false);
      expect(result.current.mobileProps.mobileOpen).toBe(false);
      expect(result.current.mobileProps.mobileBreakpoint).toBe(768);
      expect(typeof result.current.openMobile).toBe('function');
      expect(typeof result.current.closeMobile).toBe('function');
      expect(typeof result.current.toggleMobile).toBe('function');
    });

    it('initializes with custom defaultMobileOpen', () => {
      const { result } = renderHook(() => useSidebar({ defaultMobileOpen: true }));

      expect(result.current.isMobileOpen).toBe(true);
      expect(result.current.mobileProps.mobileOpen).toBe(true);
    });

    it('initializes with custom mobileBreakpoint', () => {
      const { result } = renderHook(() => useSidebar({ mobileBreakpoint: 1024 }));

      expect(result.current.mobileProps.mobileBreakpoint).toBe(1024);
    });
  });

  describe('Mobile Detection', () => {
    it('detects mobile viewport on mount', () => {
      mockWindowWidth(600);
      const { result } = renderHook(() => useSidebar());

      expect(result.current.isMobile).toBe(true);
    });

    it('detects desktop viewport on mount', () => {
      mockWindowWidth(1024);
      const { result } = renderHook(() => useSidebar());

      expect(result.current.isMobile).toBe(false);
    });

    it('updates mobile state on resize', () => {
      const { result } = renderHook(() => useSidebar());

      // Start with desktop
      expect(result.current.isMobile).toBe(false);

      // Resize to mobile
      act(() => {
        mockResizeEvent(600);
      });

      expect(result.current.isMobile).toBe(true);

      // Resize back to desktop
      act(() => {
        mockResizeEvent(1024);
      });

      expect(result.current.isMobile).toBe(false);
    });

    it('uses custom breakpoint for mobile detection', () => {
      const { result } = renderHook(() => useSidebar({ mobileBreakpoint: 1024 }));

      // At 1024px, should be considered mobile
      expect(result.current.isMobile).toBe(true);

      // At 1200px, should be considered desktop
      act(() => {
        mockResizeEvent(1200);
      });

      expect(result.current.isMobile).toBe(false);
    });
  });

  describe('Mobile State Management', () => {
    it('opens mobile sidebar', () => {
      const { result } = renderHook(() => useSidebar());

      act(() => {
        result.current.openMobile();
      });

      expect(result.current.isMobileOpen).toBe(true);
      expect(result.current.mobileProps.mobileOpen).toBe(true);
    });

    it('closes mobile sidebar', () => {
      const { result } = renderHook(() => useSidebar({ defaultMobileOpen: true }));

      act(() => {
        result.current.closeMobile();
      });

      expect(result.current.isMobileOpen).toBe(false);
      expect(result.current.mobileProps.mobileOpen).toBe(false);
    });

    it('toggles mobile sidebar', () => {
      const { result } = renderHook(() => useSidebar());

      // Toggle from closed to open
      act(() => {
        result.current.toggleMobile();
      });

      expect(result.current.isMobileOpen).toBe(true);

      // Toggle from open to closed
      act(() => {
        result.current.toggleMobile();
      });

      expect(result.current.isMobileOpen).toBe(false);
    });

    it('handles controlled mobile state with onMobileToggle callback', () => {
      const onMobileToggle = jest.fn();
      const { result } = renderHook(() => useSidebar({ onMobileToggle }));

      act(() => {
        result.current.openMobile();
      });

      expect(onMobileToggle).toHaveBeenCalledWith(true);
      expect(result.current.isMobileOpen).toBe(false); // Controlled by parent

      act(() => {
        result.current.closeMobile();
      });

      expect(onMobileToggle).toHaveBeenCalledWith(false);
    });

    it('handles uncontrolled mobile state without callback', () => {
      const { result } = renderHook(() => useSidebar());

      act(() => {
        result.current.openMobile();
      });

      expect(result.current.isMobileOpen).toBe(true); // Controlled internally
    });
  });

  describe('Responsive Behavior', () => {
    it('auto-closes mobile sidebar when switching to desktop', () => {
      // Start with mobile viewport and open sidebar
      mockWindowWidth(600);
      const { result } = renderHook(() => useSidebar({ defaultMobileOpen: true }));

      expect(result.current.isMobile).toBe(true);
      expect(result.current.isMobileOpen).toBe(true);

      // Switch to desktop viewport
      act(() => {
        mockResizeEvent(1024);
      });

      expect(result.current.isMobile).toBe(false);
      expect(result.current.isMobileOpen).toBe(false);
    });

    it('does not auto-close when controlled by parent', () => {
      const onMobileToggle = jest.fn();
      mockWindowWidth(600);
      const { result } = renderHook(() =>
        useSidebar({
          defaultMobileOpen: true,
          onMobileToggle,
        }),
      );

      expect(result.current.isMobile).toBe(true);
      expect(result.current.isMobileOpen).toBe(true);

      // Switch to desktop viewport
      act(() => {
        mockResizeEvent(1024);
      });

      expect(result.current.isMobile).toBe(false);
      // Should call parent callback instead of auto-closing
      expect(onMobileToggle).toHaveBeenCalledWith(false);
    });
  });

  describe('Keyboard Support', () => {
    it('closes mobile sidebar on escape key', () => {
      const { result } = renderHook(() => useSidebar({ defaultMobileOpen: true }));

      expect(result.current.isMobileOpen).toBe(true);

      // Simulate escape key press
      act(() => {
        const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(escapeEvent);
      });

      expect(result.current.isMobileOpen).toBe(false);
    });

    it('only handles escape key when mobile sidebar is open', () => {
      const { result } = renderHook(() => useSidebar());

      expect(result.current.isMobileOpen).toBe(false);

      // Simulate escape key press when sidebar is closed
      act(() => {
        const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(escapeEvent);
      });

      // Should not change state
      expect(result.current.isMobileOpen).toBe(false);
    });

    it('ignores other key presses', () => {
      const { result } = renderHook(() => useSidebar({ defaultMobileOpen: true }));

      expect(result.current.isMobileOpen).toBe(true);

      // Simulate other key press
      act(() => {
        const otherEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        document.dispatchEvent(otherEvent);
      });

      // Should not change state
      expect(result.current.isMobileOpen).toBe(true);
    });
  });

  describe('Mobile Props Object', () => {
    it('provides correct mobileProps structure', () => {
      const { result } = renderHook(() =>
        useSidebar({
          defaultMobileOpen: true,
          mobileBreakpoint: 1024,
        }),
      );

      expect(result.current.mobileProps).toEqual({
        mobileOpen: true,
        onMobileToggle: expect.any(Function),
        mobileBreakpoint: 1024,
      });
    });

    it('updates mobileProps when mobile state changes', () => {
      const { result } = renderHook(() => useSidebar());

      expect(result.current.mobileProps.mobileOpen).toBe(false);

      act(() => {
        result.current.openMobile();
      });

      expect(result.current.mobileProps.mobileOpen).toBe(true);
    });

    it('provides working onMobileToggle callback in mobileProps', () => {
      const { result } = renderHook(() => useSidebar());

      act(() => {
        result.current.mobileProps.onMobileToggle(true);
      });

      expect(result.current.isMobileOpen).toBe(true);

      act(() => {
        result.current.mobileProps.onMobileToggle(false);
      });

      expect(result.current.isMobileOpen).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid resize events', () => {
      const { result } = renderHook(() => useSidebar());

      act(() => {
        mockResizeEvent(600);
        mockResizeEvent(1024);
        mockResizeEvent(600);
      });

      expect(result.current.isMobile).toBe(true);
    });

    it('handles undefined options gracefully', () => {
      const { result } = renderHook(() => useSidebar(undefined));

      expect(result.current.isMobile).toBe(false);
      expect(result.current.isMobileOpen).toBe(false);
      expect(typeof result.current.openMobile).toBe('function');
    });

    it('handles empty options object gracefully', () => {
      const { result } = renderHook(() => useSidebar({}));

      expect(result.current.isMobile).toBe(false);
      expect(result.current.isMobileOpen).toBe(false);
      expect(typeof result.current.openMobile).toBe('function');
    });
  });

  describe('Cleanup', () => {
    it('removes event listeners on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      const documentRemoveEventListenerSpy = jest.spyOn(document, 'removeEventListener');

      const { unmount } = renderHook(() => useSidebar({ defaultMobileOpen: true }));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(documentRemoveEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('removes only keydown listener when mobile sidebar is closed', () => {
      const documentRemoveEventListenerSpy = jest.spyOn(document, 'removeEventListener');

      const { unmount } = renderHook(() => useSidebar({ defaultMobileOpen: false }));

      unmount();

      // Should not have added keydown listener since sidebar was never open
      expect(documentRemoveEventListenerSpy).not.toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });
});
