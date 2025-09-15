import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateRangePopover, DateRangePopoverTrigger, DateRangePopoverContent } from '../Popover';

// Mock Radix UI Popover components
jest.mock('@radix-ui/react-popover', () => ({
  Root: ({ children, open, onOpenChange }: any) => (
    <div automation-id="popover-root" data-open={open}>
      {children}
    </div>
  ),
  Trigger: ({ children, asChild }: any) => (
    <div automation-id="popover-trigger" data-as-child={asChild}>
      {children}
    </div>
  ),
  Content: React.forwardRef(({ children, className, align, sideOffset, ...props }: any, ref: any) => (
    <div
      automation-id="popover-content"
      className={className}
      data-align={align}
      data-side-offset={sideOffset}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )),
  Portal: ({ children }: any) => children,
}));

describe('DateRangePopover Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('DateRangePopover Root', () => {
    it('renders with default props', () => {
      render(
        <DateRangePopover>
          <DateRangePopoverTrigger asChild>
            <button>Open</button>
          </DateRangePopoverTrigger>
          <DateRangePopoverContent>Content</DateRangePopoverContent>
        </DateRangePopover>,
      );

      expect(screen.getByTestId('popover-root')).toBeInTheDocument();
      expect(screen.getByTestId('popover-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    });

    it('handles open state', () => {
      render(
        <DateRangePopover open={true}>
          <DateRangePopoverTrigger asChild>
            <button>Open</button>
          </DateRangePopoverTrigger>
          <DateRangePopoverContent>Content</DateRangePopoverContent>
        </DateRangePopover>,
      );

      const root = screen.getByTestId('popover-root');
      expect(root).toHaveAttribute('data-open', 'true');
    });
  });

  describe('DateRangePopoverTrigger', () => {
    it('renders with asChild prop', () => {
      render(
        <DateRangePopover>
          <DateRangePopoverTrigger asChild>
            <button>Trigger</button>
          </DateRangePopoverTrigger>
          <DateRangePopoverContent>Content</DateRangePopoverContent>
        </DateRangePopover>,
      );

      const trigger = screen.getByTestId('popover-trigger');
      expect(trigger).toHaveAttribute('data-as-child', 'true');
      expect(screen.getByText('Trigger')).toBeInTheDocument();
    });
  });

  describe('DateRangePopoverContent', () => {
    it('renders content', () => {
      render(
        <DateRangePopover>
          <DateRangePopoverTrigger asChild>
            <button>Open</button>
          </DateRangePopoverTrigger>
          <DateRangePopoverContent>
            <div>Test Content</div>
          </DateRangePopoverContent>
        </DateRangePopover>,
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(
        <DateRangePopover>
          <DateRangePopoverTrigger asChild>
            <button>Open</button>
          </DateRangePopoverTrigger>
          <DateRangePopoverContent className="custom-class">Content</DateRangePopoverContent>
        </DateRangePopover>,
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveClass('custom-class');
    });
  });

  describe('Integration', () => {
    it('renders complete popover structure', () => {
      render(
        <DateRangePopover>
          <DateRangePopoverTrigger asChild>
            <button>Open Popover</button>
          </DateRangePopoverTrigger>
          <DateRangePopoverContent>
            <div>
              <h3>Popover Title</h3>
              <p>Popover description</p>
              <button>Action</button>
            </div>
          </DateRangePopoverContent>
        </DateRangePopover>,
      );

      expect(screen.getByText('Open Popover')).toBeInTheDocument();
      expect(screen.getByText('Popover Title')).toBeInTheDocument();
      expect(screen.getByText('Popover description')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
    });
  });
});
