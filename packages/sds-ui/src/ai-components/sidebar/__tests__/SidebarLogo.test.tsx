import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SidebarLogo from '../SidebarLogo';

describe('SidebarLogo Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders logo content', () => {
      render(<SidebarLogo />);

      const logo = document.querySelector('svg');
      expect(logo).toBeInTheDocument();
    });

    it('renders as div when not collapsible', () => {
      render(<SidebarLogo />);

      const logoContainer = document.querySelector('.logoContainer');
      expect(logoContainer).toBeInTheDocument();
    });

    it('renders as button when collapsible', () => {
      const handleToggle = jest.fn();
      render(<SidebarLogo collapsible onToggleCollapse={handleToggle} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('logoButton');
    });

    it('hides when hidden prop is true', () => {
      const { container } = render(<SidebarLogo hidden />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Collapsible Behavior', () => {
    it('calls onToggleCollapse when clicked', async () => {
      const handleToggle = jest.fn();
      const user = userEvent.setup();

      render(<SidebarLogo collapsible onToggleCollapse={handleToggle} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleToggle).toHaveBeenCalledTimes(1);
    });

    it('updates aria-label based on collapsed state', () => {
      const handleToggle = jest.fn();

      // Expanded state
      const { rerender } = render(<SidebarLogo collapsible collapsed={false} onToggleCollapse={handleToggle} />);

      let button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Collapse sidebar');

      // Collapsed state
      rerender(<SidebarLogo collapsible collapsed={true} onToggleCollapse={handleToggle} />);

      button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Expand sidebar');
    });

    it('requires onToggleCollapse to render as button', () => {
      render(<SidebarLogo collapsible />);

      // Should render as div when no onToggleCollapse provided
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(document.querySelector('div')).toBeInTheDocument();
    });
  });

  describe('Mobile Behavior', () => {
    it('renders as button when in mobile mode', () => {
      const handleMobileToggle = jest.fn();
      render(<SidebarLogo isMobile={true} mobileOpen={false} onMobileToggle={handleMobileToggle} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('logoButton');
    });

    it('calls onMobileToggle when clicked in mobile mode', async () => {
      const handleMobileToggle = jest.fn();
      const user = userEvent.setup();

      render(<SidebarLogo isMobile={true} mobileOpen={false} onMobileToggle={handleMobileToggle} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleMobileToggle).toHaveBeenCalledWith(true);
    });

    it('updates aria-label based on mobile state', () => {
      const handleMobileToggle = jest.fn();

      // Mobile closed state
      const { rerender } = render(
        <SidebarLogo isMobile={true} mobileOpen={false} onMobileToggle={handleMobileToggle} />,
      );

      let button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Open mobile sidebar');

      // Mobile open state
      rerender(<SidebarLogo isMobile={true} mobileOpen={true} onMobileToggle={handleMobileToggle} />);

      button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Close mobile sidebar');
    });

    it('requires onMobileToggle to render as button in mobile mode', () => {
      render(<SidebarLogo isMobile={true} mobileOpen={false} />);

      // Should render as div when no onMobileToggle provided
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(document.querySelector('.logoContainer')).toBeInTheDocument();
    });

    it('renders as button when mobile mode and onMobileToggle are provided', () => {
      const handleMobileToggle = jest.fn();
      render(<SidebarLogo isMobile={true} mobileOpen={false} onMobileToggle={handleMobileToggle} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('logoButton');
    });
  });

  describe('Priority and Context', () => {
    it('prioritizes mobile behavior over collapsible when both are true', async () => {
      const handleToggle = jest.fn();
      const handleMobileToggle = jest.fn();
      const user = userEvent.setup();

      render(
        <SidebarLogo
          collapsible
          collapsed={false}
          onToggleCollapse={handleToggle}
          isMobile={true}
          mobileOpen={false}
          onMobileToggle={handleMobileToggle}
        />,
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Open mobile sidebar');

      // Click should call mobile toggle, not collapsible toggle
      await user.click(button);
      expect(handleMobileToggle).toHaveBeenCalledWith(true);
      expect(handleToggle).not.toHaveBeenCalled();
    });

    it('falls back to collapsible behavior when not in mobile mode', async () => {
      const handleToggle = jest.fn();
      const user = userEvent.setup();

      render(
        <SidebarLogo
          collapsible
          collapsed={false}
          onToggleCollapse={handleToggle}
          isMobile={false}
          mobileOpen={false}
        />,
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Collapse sidebar');

      // Click should call collapsible toggle
      await user.click(button);
      expect(handleToggle).toHaveBeenCalledTimes(1);
    });

    it('renders as div when neither mobile nor collapsible', () => {
      render(<SidebarLogo />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(document.querySelector('.logoContainer')).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      render(<SidebarLogo className="custom-logo" />);

      const logoContainer = document.querySelector('.custom-logo');
      expect(logoContainer).toBeInTheDocument();
    });

    it('applies custom className to button when collapsible', () => {
      const handleToggle = jest.fn();
      render(<SidebarLogo collapsible onToggleCollapse={handleToggle} className="custom-button" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-button');
    });

    it('applies custom className to button when in mobile mode', () => {
      const handleMobileToggle = jest.fn();
      render(<SidebarLogo isMobile={true} onMobileToggle={handleMobileToggle} className="custom-mobile" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-mobile');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined onToggleCollapse gracefully', () => {
      render(<SidebarLogo collapsible />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('handles undefined onMobileToggle gracefully', () => {
      render(<SidebarLogo isMobile={true} />);

      // Should render as div when no onMobileToggle provided
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(document.querySelector('.logoContainer')).toBeInTheDocument();
    });

    it('handles rapid state changes', () => {
      const handleToggle = jest.fn();
      const { rerender } = render(<SidebarLogo collapsible onToggleCollapse={handleToggle} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Collapse sidebar');

      // Rapid state changes
      rerender(<SidebarLogo collapsible collapsed={true} onToggleCollapse={handleToggle} />);
      expect(button).toHaveAttribute('aria-label', 'Expand sidebar');

      rerender(<SidebarLogo collapsible collapsed={false} onToggleCollapse={handleToggle} />);
      expect(button).toHaveAttribute('aria-label', 'Collapse sidebar');
    });

    it('handles mobile state changes', () => {
      const handleMobileToggle = jest.fn();
      const { rerender } = render(
        <SidebarLogo isMobile={true} mobileOpen={false} onMobileToggle={handleMobileToggle} />,
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Open mobile sidebar');

      // Change mobile state
      rerender(<SidebarLogo isMobile={true} mobileOpen={true} onMobileToggle={handleMobileToggle} />);
      expect(button).toHaveAttribute('aria-label', 'Close mobile sidebar');
    });
  });
});
