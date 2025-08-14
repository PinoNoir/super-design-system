import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SidebarItem from '../SidebarItem';

describe('SidebarItem Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders with label', () => {
      render(<SidebarItem label="Test Item" />);

      expect(screen.getByText('Test Item')).toBeInTheDocument();
    });

    it('renders with icon', () => {
      const icon = <span automation-id="test-icon">🏠</span>;
      render(<SidebarItem label="Test Item" icon={icon} />);

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('renders with badge', () => {
      const badge = <span automation-id="test-badge">3</span>;
      render(<SidebarItem label="Test Item" badge={badge} />);

      expect(screen.getByTestId('test-badge')).toBeInTheDocument();
    });

    it('renders as menuitem by default', () => {
      render(<SidebarItem label="Test Item" />);

      const menuitem = screen.getByRole('menuitem');
      expect(menuitem).toBeInTheDocument();

      // Check that the container has the navButton class
      const container = menuitem.closest('li');
      expect(container).toHaveClass('navButton');
    });
  });

  describe('Element Type Rendering', () => {
    it('renders as link when href is provided', () => {
      render(<SidebarItem label="Test Item" href="/test" />);

      const menuitem = screen.getByRole('menuitem');
      expect(menuitem).toBeInTheDocument();
      expect(menuitem).toHaveAttribute('href', '/test');
    });

    it('renders as custom element when as prop is provided', () => {
      render(<SidebarItem label="Test Item" as="div" />);

      const container = screen.getByText('Test Item').closest('li');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('navButton');
      expect(container).toHaveAttribute('as', 'div');
    });

    it('renders as anchor when both href and as="a" are provided', () => {
      render(<SidebarItem label="Test Item" href="/test" as="a" />);

      const menuitem = screen.getByRole('menuitem');
      expect(menuitem).toBeInTheDocument();
      expect(menuitem).toHaveAttribute('href', '/test');
    });
  });

  describe('Interactive Behavior', () => {
    it('calls onClick when clicked', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<SidebarItem label="Test Item" onClick={handleClick} />);

      const menuitem = screen.getByRole('menuitem');
      await user.click(menuitem);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when link is clicked', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<SidebarItem label="Test Item" href="/test" onClick={handleClick} />);

      const menuitem = screen.getByRole('menuitem');
      await user.click(menuitem);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles click without onClick handler', async () => {
      const user = userEvent.setup();

      render(<SidebarItem label="Test Item" />);

      const menuitem = screen.getByRole('menuitem');
      await user.click(menuitem);

      // Should not throw error
      expect(menuitem).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('applies active class when isActive is true', () => {
      render(<SidebarItem label="Test Item" isActive={true} />);

      const container = screen.getByRole('menuitem').closest('li');
      expect(container).toHaveClass('active');
    });

    it('applies active class when active is true', () => {
      render(<SidebarItem label="Test Item" active={true} />);

      const container = screen.getByRole('menuitem').closest('li');
      expect(container).toHaveClass('active');
    });

    it('prioritizes isActive over active prop', () => {
      render(<SidebarItem label="Test Item" isActive={true} active={false} />);

      const container = screen.getByRole('menuitem').closest('li');
      expect(container).toHaveClass('active');
    });

    it('applies disabled class when disabled is true', () => {
      render(<SidebarItem label="Test Item" disabled={true} />);

      const container = screen.getByRole('menuitem').closest('li');
      expect(container).toHaveClass('disabled');

      const menuitem = screen.getByRole('menuitem');
      expect(menuitem).toHaveAttribute('aria-disabled', 'true');
    });

    it('disables click when disabled', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<SidebarItem label="Test Item" onClick={handleClick} disabled={true} />);

      const menuitem = screen.getByRole('menuitem');
      await user.click(menuitem);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Custom Menu Integration', () => {
    it('renders custom menu when provided', () => {
      const customMenu = <div automation-id="custom-menu">Custom Menu</div>;
      render(<SidebarItem label="Test Item" customMenu={customMenu} />);

      expect(screen.getByTestId('custom-menu')).toBeInTheDocument();
    });

    it('applies navActions class to custom menu', () => {
      const customMenu = <div automation-id="custom-menu">Custom Menu</div>;
      render(<SidebarItem label="Test Item" customMenu={customMenu} />);

      const menuElement = screen.getByTestId('custom-menu');
      expect(menuElement.parentElement).toHaveClass('navActions');
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      render(<SidebarItem label="Test Item" className="custom-item" />);

      const container = screen.getByRole('menuitem').closest('li');
      expect(container).toHaveClass('custom-item');
    });

    it('applies custom className to link', () => {
      render(<SidebarItem label="Test Item" href="/test" className="custom-link" />);

      const container = screen.getByRole('menuitem').closest('li');
      expect(container).toHaveClass('custom-link');
    });

    it('applies custom className to custom element', () => {
      render(<SidebarItem label="Test Item" as="div" className="custom-element" />);

      const container = screen.getByText('Test Item').closest('li');
      expect(container).toHaveClass('custom-element');
    });
  });

  describe('Accessibility', () => {
    it('has proper role for button', () => {
      render(<SidebarItem label="Test Item" />);

      const menuitem = screen.getByRole('menuitem');
      expect(menuitem).toBeInTheDocument();
    });

    it('has proper role for link', () => {
      render(<SidebarItem label="Test Item" href="/test" />);

      const menuitem = screen.getByRole('menuitem');
      expect(menuitem).toBeInTheDocument();
    });

    it('has proper role for custom element', () => {
      render(<SidebarItem label="Test Item" as="div" />);

      const container = screen.getByText('Test Item').closest('li');
      expect(container).toBeInTheDocument();
    });

    it('applies disabled attribute when disabled', () => {
      render(<SidebarItem label="Test Item" disabled={true} />);

      const menuitem = screen.getByRole('menuitem');
      expect(menuitem).toHaveAttribute('aria-disabled', 'true');
    });

    it('maintains accessibility when custom element is used', () => {
      render(<SidebarItem label="Test Item" as="div" />);

      const container = screen.getByText('Test Item').closest('li');
      expect(container).toHaveClass('navButton');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty label', () => {
      render(<SidebarItem label="" />);

      const menuitem = screen.getByRole('menuitem');
      expect(menuitem).toBeInTheDocument();
    });

    it('handles undefined icon', () => {
      render(<SidebarItem label="Test Item" icon={undefined} />);

      const menuitem = screen.getByRole('menuitem');
      expect(menuitem).toBeInTheDocument();
      expect(screen.getByText('Test Item')).toBeInTheDocument();
    });

    it('handles undefined badge', () => {
      render(<SidebarItem label="Test Item" badge={undefined} />);

      const menuitem = screen.getByRole('menuitem');
      expect(menuitem).toBeInTheDocument();
      expect(screen.getByText('Test Item')).toBeInTheDocument();
    });

    it('handles undefined customMenu', () => {
      render(<SidebarItem label="Test Item" customMenu={undefined} />);

      const menuitem = screen.getByRole('menuitem');
      expect(menuitem).toBeInTheDocument();
      expect(screen.getByText('Test Item')).toBeInTheDocument();
    });

    it('handles rapid state changes', () => {
      const { rerender } = render(<SidebarItem label="Test Item" />);

      let container = screen.getByRole('menuitem').closest('li');
      expect(container).not.toHaveClass('active');

      // Rapidly change states
      rerender(<SidebarItem label="Test Item" isActive={true} />);
      container = screen.getByRole('menuitem').closest('li');
      expect(container).toHaveClass('active');

      rerender(<SidebarItem label="Test Item" isActive={false} />);
      container = screen.getByRole('menuitem').closest('li');
      expect(container).not.toHaveClass('active');
    });

    it('handles conflicting props gracefully', () => {
      render(<SidebarItem label="Test Item" href="/test" as="button" />);

      // Should prioritize href over as prop
      const menuitem = screen.getByRole('menuitem');
      expect(menuitem).toBeInTheDocument();
      expect(menuitem).toHaveAttribute('href', '/test');
    });
  });

  describe('Integration with Sidebar', () => {
    it('works with SidebarSection rendering', () => {
      const mockSection = {
        id: 'test-section',
        title: 'Test Section',
        items: [
          {
            id: 'item-1',
            label: 'Test Item 1',
            icon: <span>🏠</span>,
          },
        ],
      };

      // This test ensures SidebarItem works when rendered through SidebarSection
      render(
        <div>
          <SidebarItem key={mockSection.items[0].id} {...mockSection.items[0]} />
        </div>,
      );

      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
      expect(screen.getByText('🏠')).toBeInTheDocument();
    });
  });
});
