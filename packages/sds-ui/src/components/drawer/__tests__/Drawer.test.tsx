import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

import Drawer, { DrawerHandle } from '../Drawer';

// Mock framer-motion to make animations testable
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: React.forwardRef(({ children, 'automation-id': testId, className, ...props }: any, ref) => (
        <div ref={ref} automation-id={testId ?? 'motion-div'} className={className} {...props}>
          {children}
        </div>
      )),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

// Mock the Icon component
jest.mock('@iconify/react', () => ({
  Icon: () => <div automation-id="mock-icon" />,
}));

describe('Drawer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should not render when closed', () => {
      render(<Drawer>Drawer Content</Drawer>);

      expect(screen.queryByText('Drawer Content')).not.toBeInTheDocument();
    });

    it('should render when defaultOpen is true', () => {
      render(<Drawer defaultOpen>Drawer Content</Drawer>);

      expect(screen.getByText('Drawer Content')).toBeInTheDocument();
      expect(screen.getByLabelText('Close drawer')).toBeInTheDocument();
    });

    it('should render when controlled open prop is true', () => {
      render(<Drawer open>Drawer Content</Drawer>);

      expect(screen.getByText('Drawer Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Drawer open className="custom-class">
          Drawer Content
        </Drawer>,
      );

      const drawerElement = screen.getByTestId('drawer-container');
      expect(drawerElement).toHaveClass('custom-class');
    });
  });

  describe('Controlled Mode', () => {
    it('should open when open prop changes to true', async () => {
      const { rerender } = render(<Drawer open={false}>Drawer Content</Drawer>);

      expect(screen.queryByText('Drawer Content')).not.toBeInTheDocument();

      rerender(<Drawer open={true}>Drawer Content</Drawer>);

      expect(screen.getByText('Drawer Content')).toBeInTheDocument();
    });

    it('should close when open prop changes to false', async () => {
      const { rerender } = render(<Drawer open={true}>Drawer Content</Drawer>);

      expect(screen.getByText('Drawer Content')).toBeInTheDocument();

      rerender(<Drawer open={false}>Drawer Content</Drawer>);

      expect(screen.queryByText('Drawer Content')).not.toBeInTheDocument();
    });

    it('should call onOpenChange when close button is clicked', async () => {
      const onOpenChangeMock = jest.fn();
      const onCloseMock = jest.fn();

      render(
        <Drawer open={true} onOpenChange={onOpenChangeMock} onClose={onCloseMock}>
          Drawer Content
        </Drawer>,
      );

      const closeButton = screen.getByLabelText('Close drawer');
      fireEvent.click(closeButton);

      expect(onOpenChangeMock).toHaveBeenCalledWith(false);
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  describe('Uncontrolled Mode', () => {
    it('should open by default when defaultOpen is true', () => {
      render(<Drawer defaultOpen={true}>Drawer Content</Drawer>);

      expect(screen.getByText('Drawer Content')).toBeInTheDocument();
    });

    it('should close when close button is clicked', async () => {
      render(<Drawer defaultOpen={true}>Drawer Content</Drawer>);

      const closeButton = screen.getByLabelText('Close drawer');
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('Drawer Content')).not.toBeInTheDocument();
      });
    });

    it('should call onOpenChange when close button is clicked', async () => {
      const onOpenChangeMock = jest.fn();

      render(
        <Drawer defaultOpen={true} onOpenChange={onOpenChangeMock}>
          Drawer Content
        </Drawer>,
      );

      const closeButton = screen.getByLabelText('Close drawer');
      fireEvent.click(closeButton);

      expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    });
  });

  describe('Ref API', () => {
    it('should expose open method through ref', async () => {
      const drawerRef = React.createRef<DrawerHandle>();

      render(<Drawer ref={drawerRef}>Drawer Content</Drawer>);

      expect(screen.queryByText('Drawer Content')).not.toBeInTheDocument();

      // Call open method through ref
      act(() => {
        drawerRef.current?.open();
      });

      await waitFor(() => {
        expect(screen.getByText('Drawer Content')).toBeInTheDocument();
      });
    });

    it('should expose close method through ref', async () => {
      const drawerRef = React.createRef<DrawerHandle>();

      render(
        <Drawer ref={drawerRef} defaultOpen>
          Drawer Content
        </Drawer>,
      );

      expect(screen.getByText('Drawer Content')).toBeInTheDocument();

      // Call close method through ref
      act(() => {
        drawerRef.current?.close();
      });

      await waitFor(() => {
        expect(screen.queryByText('Drawer Content')).not.toBeInTheDocument();
      });
    });

    it('should expose toggle method through ref', async () => {
      const drawerRef = React.createRef<DrawerHandle>();

      render(<Drawer ref={drawerRef}>Drawer Content</Drawer>);

      expect(screen.queryByText('Drawer Content')).not.toBeInTheDocument();

      // Toggle open
      act(() => {
        drawerRef.current?.toggle();
      });

      await waitFor(() => {
        expect(screen.getByText('Drawer Content')).toBeInTheDocument();
      });

      // Toggle closed
      act(() => {
        drawerRef.current?.toggle();
      });

      await waitFor(() => {
        expect(screen.queryByText('Drawer Content')).not.toBeInTheDocument();
      });
    });

    it('should expose isOpen method through ref', async () => {
      const drawerRef = React.createRef<DrawerHandle>();

      render(
        <Drawer ref={drawerRef} defaultOpen>
          Drawer Content
        </Drawer>,
      );

      expect(drawerRef.current?.isOpen()).toBe(true);

      // Close drawer
      act(() => {
        drawerRef.current?.close();
      });

      await waitFor(() => {
        expect(drawerRef.current?.isOpen()).toBe(false);
      });
    });

    it('should handle controlled state through ref methods', async () => {
      const drawerRef = React.createRef<DrawerHandle>();
      const onOpenChangeMock = jest.fn();

      const { rerender } = render(
        <Drawer ref={drawerRef} open={false} onOpenChange={onOpenChangeMock}>
          Drawer Content
        </Drawer>,
      );

      // Call open method through ref in controlled mode
      act(() => {
        drawerRef.current?.open();
      });

      // Verify onOpenChange was called, but drawer remains closed
      expect(onOpenChangeMock).toHaveBeenCalledWith(true);
      expect(screen.queryByText('Drawer Content')).not.toBeInTheDocument();

      // Update the controlled prop
      rerender(
        <Drawer ref={drawerRef} open={true} onOpenChange={onOpenChangeMock}>
          Drawer Content
        </Drawer>,
      );

      // Now drawer should be open
      expect(screen.getByText('Drawer Content')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria attributes', () => {
      render(<Drawer open>Drawer Content</Drawer>);

      const closeButton = screen.getByLabelText('Close drawer');
      expect(closeButton).toHaveAttribute('aria-label', 'Close drawer');
    });

    it('should have automation-id attribute for testing', () => {
      render(<Drawer open>Drawer Content</Drawer>);

      const closeButton = screen.getByLabelText('Close drawer');
      expect(closeButton).toHaveAttribute('automation-id', 'close-button');
    });
  });

  describe('Animation', () => {
    it('should pass correct animation variants to motion components', () => {
      render(<Drawer open>Drawer Content</Drawer>);

      const outerMotionDiv = screen.getByTestId('drawer-container');
      expect(outerMotionDiv).toHaveAttribute('initial');
      expect(outerMotionDiv).toHaveAttribute('animate');
      expect(outerMotionDiv).toHaveAttribute('exit');

      const innerMotionDiv = screen.getByTestId('drawer-content-wrapper');
      expect(innerMotionDiv).toHaveAttribute('initial', 'hidden');
      expect(innerMotionDiv).toHaveAttribute('animate', 'visible');
      expect(innerMotionDiv).toHaveAttribute('exit', 'exit');
    });
  });
});
