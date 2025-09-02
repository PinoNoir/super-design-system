import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover, PopoverTrigger, PopoverContent } from '../Popover';

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

describe('Popover Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Popover Root', () => {
    it('renders with default props', () => {
      render(
        <Popover>
          <PopoverTrigger asChild>
            <button>Open</button>
          </PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>,
      );

      expect(screen.getByTestId('popover-root')).toBeInTheDocument();
      expect(screen.getByTestId('popover-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    });

    it('handles open state', () => {
      render(
        <Popover open={true}>
          <PopoverTrigger asChild>
            <button>Open</button>
          </PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>,
      );

      const root = screen.getByTestId('popover-root');
      expect(root).toHaveAttribute('data-open', 'true');
    });
  });

  describe('PopoverTrigger', () => {
    it('renders with asChild prop', () => {
      render(
        <Popover>
          <PopoverTrigger asChild>
            <button>Trigger</button>
          </PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>,
      );

      const trigger = screen.getByTestId('popover-trigger');
      expect(trigger).toHaveAttribute('data-as-child', 'true');
      expect(screen.getByText('Trigger')).toBeInTheDocument();
    });
  });

  describe('PopoverContent', () => {
    it('renders content', () => {
      render(
        <Popover>
          <PopoverTrigger asChild>
            <button>Open</button>
          </PopoverTrigger>
          <PopoverContent>
            <div>Test Content</div>
          </PopoverContent>
        </Popover>,
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(
        <Popover>
          <PopoverTrigger asChild>
            <button>Open</button>
          </PopoverTrigger>
          <PopoverContent className="custom-class">Content</PopoverContent>
        </Popover>,
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveClass('custom-class');
    });
  });

  describe('Integration', () => {
    it('renders complete popover structure', () => {
      render(
        <Popover>
          <PopoverTrigger asChild>
            <button>Open Popover</button>
          </PopoverTrigger>
          <PopoverContent>
            <div>
              <h3>Popover Title</h3>
              <p>Popover description</p>
              <button>Action</button>
            </div>
          </PopoverContent>
        </Popover>,
      );

      expect(screen.getByText('Open Popover')).toBeInTheDocument();
      expect(screen.getByText('Popover Title')).toBeInTheDocument();
      expect(screen.getByText('Popover description')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
    });
  });
});
