import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateRangePicker from '../DateRangePicker';
import type { DateRange } from 'react-day-picker';

// Mock react-day-picker with simplified behavior
jest.mock('react-day-picker', () => ({
  DayPicker: ({ onSelect, onMonthChange, onDayClick, mode, className }: any) => (
    <div automation-id="day-picker" data-mode={mode} className={className}>
      <button automation-id="prev-month" onClick={() => onMonthChange?.({ month: new Date(2024, 0, 1) })}>
        Previous Month
      </button>
      <button automation-id="next-month" onClick={() => onMonthChange?.({ month: new Date(2024, 2, 1) })}>
        Next Month
      </button>
      <button automation-id="day-1" onClick={() => onDayClick?.(new Date(2024, 1, 1), {}, new MouseEvent('click'))}>
        1
      </button>
      <button automation-id="day-15" onClick={() => onDayClick?.(new Date(2024, 1, 15), {}, new MouseEvent('click'))}>
        15
      </button>
      <button
        automation-id="select-range"
        onClick={() =>
          onSelect?.(
            {
              from: new Date(2024, 1, 1),
              to: new Date(2024, 1, 15),
            },
            new Date(2024, 1, 1),
            {},
            new MouseEvent('click'),
          )
        }
      >
        Select Range
      </button>
    </div>
  ),
}));

// Mock Radix UI Popover
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
  Content: ({ children }: any) => <div automation-id="popover-content">{children}</div>,
  Portal: ({ children }: any) => children,
}));

// Mock Calendar component
jest.mock('../Calendar', () => {
  return function MockCalendar({ onSelect, selected, className }: any) {
    return (
      <div automation-id="calendar" className={className}>
        <div automation-id="selected-display">{selected?.from ? 'Has Selection' : 'No Selection'}</div>
        <button
          automation-id="select-date"
          onClick={() =>
            onSelect?.({
              from: new Date(2024, 1, 1),
              to: new Date(2024, 1, 15),
            })
          }
        >
          Select Date
        </button>
      </div>
    );
  };
});

// Mock Popover component
jest.mock('../Popover', () => ({
  DateRangePopover: ({ children, open, onOpenChange }: any) => (
    <div automation-id="popover" data-open={open} onClick={() => onOpenChange?.(!open)}>
      {children}
    </div>
  ),
  DateRangePopoverTrigger: ({ children, asChild }: any) => (
    <div automation-id="popover-trigger" data-as-child={asChild}>
      {children}
    </div>
  ),
  DateRangePopoverContent: ({ children, className }: any) => (
    <div automation-id="popover-content" className={className}>
      {children}
    </div>
  ),
}));

describe('DateRangePicker Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Integration', () => {
    it('renders and allows basic interaction', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(<DateRangePicker placeholder="Select date range" onChange={onChange} />);

      // Check initial render
      expect(screen.getByPlaceholderText('Select date range')).toBeInTheDocument();
      expect(screen.getByTestId('popover')).toBeInTheDocument();

      // Open popover
      const input = screen.getByPlaceholderText('Select date range');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByTestId('popover-content')).toBeInTheDocument();
      });
    });

    it('handles controlled value updates', () => {
      // Test with no initial value, then update with controlled value
      const { rerender } = render(<DateRangePicker placeholder="Select date range" />);

      const input = screen.getByPlaceholderText('Select date range');
      expect(input).toHaveValue('');

      // Update to controlled value when no internal state exists
      const newValue: DateRange = {
        from: new Date(2024, 2, 1),
        to: new Date(2024, 2, 10),
      };

      rerender(<DateRangePicker placeholder="Select date range" value={newValue} />);

      // Should show the controlled value
      expect(input).toHaveValue('03/01/2024 - 03/10/2024');
    });

    it('handles keyboard input', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(<DateRangePicker placeholder="Select date range" onChange={onChange} />);

      const input = screen.getByPlaceholderText('Select date range');

      // Type a date range
      await user.type(input, '02/01/2024 - 02/15/2024');

      // Tab away to trigger parsing
      await user.tab();

      // Should not crash
      expect(input).toHaveValue('02/01/2024 - 02/15/2024');
    });
  });

  describe('Error Handling', () => {
    it('handles invalid input gracefully', async () => {
      const user = userEvent.setup();

      render(<DateRangePicker placeholder="Select date range" />);

      const input = screen.getByPlaceholderText('Select date range');

      // Type invalid date
      await user.type(input, 'invalid date');
      await user.tab();

      // Should not crash
      expect(input).toHaveValue('invalid date');
      expect(screen.getByTestId('popover')).toBeInTheDocument();
    });

    it('handles missing callbacks gracefully', async () => {
      const user = userEvent.setup();

      render(<DateRangePicker placeholder="Select date range" />);

      // Open popover
      const input = screen.getByPlaceholderText('Select date range');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByTestId('popover-content')).toBeInTheDocument();
      });

      // Should not crash without onChange callback
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains proper focus management', async () => {
      const user = userEvent.setup();

      render(<DateRangePicker placeholder="Select date range" />);

      const input = screen.getByPlaceholderText('Select date range');

      // Tab to focus input
      await user.tab();
      expect(input).toHaveFocus();

      // Open popover with Enter
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByTestId('popover-content')).toBeInTheDocument();
      });
    });
  });
});
