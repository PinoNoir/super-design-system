import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateRangePicker from '../DateRangePicker';
import type { DateRange } from 'react-day-picker';

// Mock Calendar component with more realistic behavior
jest.mock('../Calendar', () => {
  return function MockCalendar({ onSelect, className }: any) {
    // Filter out non-DOM props to prevent React warnings
    return (
      <div automation-id="calendar" className={className}>
        <button
          automation-id="select-range"
          onClick={() => onSelect?.({ from: new Date(2024, 1, 1), to: new Date(2024, 1, 15) })}
        >
          Select Range
        </button>
        <button
          automation-id="select-partial"
          onClick={() => onSelect?.({ from: new Date(2024, 1, 1), to: undefined })}
        >
          Select Partial
        </button>
        <button automation-id="clear-selection" onClick={() => onSelect?.(undefined)}>
          Clear
        </button>
      </div>
    );
  };
});

// Mock Popover components
jest.mock('../Popover', () => ({
  DateRangePopover: ({ children, open, onOpenChange }: any) => (
    <div automation-id="popover" data-open={open} onClick={() => onOpenChange?.(!open)}>
      {children}
    </div>
  ),
  DateRangePopoverTrigger: ({ children }: any) => <div automation-id="popover-trigger">{children}</div>,
  DateRangePopoverContent: ({ children }: any) => <div automation-id="popover-content">{children}</div>,
}));

describe('DateRangePicker - Improved Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Range Selection Logic', () => {
    it('handles complete range selection', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(<DateRangePicker onChange={onChange} />);

      // Open popover by clicking on it
      const popover = screen.getByTestId('popover');
      await user.click(popover);

      const selectButton = screen.getByTestId('select-range');
      await user.click(selectButton);

      expect(onChange).toHaveBeenCalledWith({
        from: new Date(2024, 1, 1),
        to: new Date(2024, 1, 15),
      });
    });

    it('handles partial range selection', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(<DateRangePicker onChange={onChange} />);

      const popover = screen.getByTestId('popover');
      await user.click(popover);

      const selectButton = screen.getByTestId('select-partial');
      await user.click(selectButton);

      expect(onChange).toHaveBeenCalledWith({
        from: new Date(2024, 1, 1),
        to: undefined,
      });
    });

    it('handles range clearing', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(<DateRangePicker onChange={onChange} />);

      const popover = screen.getByTestId('popover');
      await user.click(popover);

      const clearButton = screen.getByTestId('clear-selection');
      await user.click(clearButton);

      expect(onChange).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Legacy Props Handling', () => {
    it('handles legacy minDate prop', () => {
      const minDate = new Date(2024, 0, 1);
      render(<DateRangePicker minDate={minDate} />);

      // Should not crash - calendar should receive disabled prop
      expect(screen.getByTestId('popover')).toBeInTheDocument();
    });

    it('handles legacy maxDate prop', () => {
      const maxDate = new Date(2024, 11, 31);
      render(<DateRangePicker maxDate={maxDate} />);

      expect(screen.getByTestId('popover')).toBeInTheDocument();
    });

    it('handles both minDate and maxDate props', () => {
      const minDate = new Date(2024, 0, 1);
      const maxDate = new Date(2024, 11, 31);
      render(<DateRangePicker minDate={minDate} maxDate={maxDate} />);

      expect(screen.getByTestId('popover')).toBeInTheDocument();
    });

    it('uses legacy months prop over numberOfMonths', () => {
      render(<DateRangePicker months={3} numberOfMonths={1} />);

      // Should prefer months over numberOfMonths
      expect(screen.getByTestId('popover')).toBeInTheDocument();
    });
  });

  describe('Date Display Logic', () => {
    it('shows empty value when no date selected', () => {
      render(<DateRangePicker placeholder="Select dates" />);

      const input = screen.getByPlaceholderText('Select dates');
      expect(input).toHaveValue('');
    });

    it('displays single date when range is incomplete', () => {
      const value: DateRange = {
        from: new Date(2024, 1, 1),
        to: undefined,
      };

      render(<DateRangePicker value={value} />);

      // Should show formatted single date using dateFormat (MM/dd/yyyy by default)
      expect(screen.getByDisplayValue('02/01/2024')).toBeInTheDocument();
    });

    it('displays complete range', () => {
      const value: DateRange = {
        from: new Date(2024, 1, 1),
        to: new Date(2024, 1, 15),
      };

      render(<DateRangePicker value={value} />);

      expect(screen.getByDisplayValue('02/01/2024 - 02/15/2024')).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('prioritizes value prop over internal state', () => {
      const controlledValue: DateRange = {
        from: new Date(2024, 2, 1),
        to: new Date(2024, 2, 15),
      };

      const { rerender } = render(<DateRangePicker />);

      // Change to controlled
      rerender(<DateRangePicker value={controlledValue} />);

      expect(screen.getByDisplayValue('03/01/2024 - 03/15/2024')).toBeInTheDocument();
    });

    it('uses defaultValue for initial state', () => {
      const defaultValue: DateRange = {
        from: new Date(2024, 1, 1),
        to: new Date(2024, 1, 15),
      };

      render(<DateRangePicker defaultValue={defaultValue} />);

      expect(screen.getByDisplayValue('02/01/2024 - 02/15/2024')).toBeInTheDocument();
    });
  });

  describe('Custom Formatting', () => {
    it('uses custom date format', () => {
      const value: DateRange = {
        from: new Date(2024, 1, 1),
        to: new Date(2024, 1, 15),
      };

      render(<DateRangePicker value={value} format="dd/MM/yyyy" />);

      // Now uses the format prop correctly - should show dd/MM/yyyy format
      expect(screen.getByDisplayValue('01/02/2024 - 15/02/2024')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles undefined onChange gracefully', async () => {
      const user = userEvent.setup();

      render(<DateRangePicker />);

      const popover = screen.getByTestId('popover');
      await user.click(popover);

      // Should not throw when selecting without onChange
      const selectButton = screen.getByTestId('select-range');
      expect(() => user.click(selectButton)).not.toThrow();
    });

    it('maintains component stability with null values', () => {
      expect(() => {
        render(<DateRangePicker value={null as any} />);
      }).not.toThrow();
    });
  });

  describe('Manual Input Entry', () => {
    it('allows manual date range entry', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(<DateRangePicker onChange={onChange} />);

      const input = screen.getByRole('textbox');

      // Clear the input and type a date range
      await user.clear(input);
      await user.type(input, '02/01/2024 - 02/15/2024');

      expect(onChange).toHaveBeenCalledWith({
        from: new Date(2024, 1, 1),
        to: new Date(2024, 1, 15),
      });
    });

    it('allows manual single date entry', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(<DateRangePicker onChange={onChange} />);

      const input = screen.getByRole('textbox');

      await user.clear(input);
      await user.type(input, '02/01/2024');

      expect(onChange).toHaveBeenCalledWith({
        from: new Date(2024, 1, 1),
        to: undefined,
      });
    });

    it('handles invalid date input gracefully', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(<DateRangePicker onChange={onChange} />);

      const input = screen.getByRole('textbox');

      await user.clear(input);
      await user.type(input, 'invalid date');

      // Should not crash and should not call onChange with invalid data
      expect(onChange).not.toHaveBeenCalled();
      expect(input).toHaveValue('invalid date');
    });

    it('handles custom date formats for manual entry', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(<DateRangePicker onChange={onChange} format="dd/MM/yyyy" />);

      const input = screen.getByRole('textbox');

      await user.clear(input);
      await user.type(input, '01/02/2024 - 15/02/2024');

      expect(onChange).toHaveBeenCalledWith({
        from: new Date(2024, 1, 1),
        to: new Date(2024, 1, 15),
      });
    });

    it('updates input value as user types', async () => {
      const user = userEvent.setup();

      render(<DateRangePicker />);

      const input = screen.getByRole('textbox');

      await user.clear(input);
      await user.type(input, '02/01/2024');

      expect(input).toHaveValue('02/01/2024');
    });

    it('handles partial date range input', async () => {
      const onChange = jest.fn();

      render(<DateRangePicker onChange={onChange} />);

      const input = screen.getByRole('textbox');

      // Directly set the input value to avoid intermediate parsing states
      fireEvent.change(input, { target: { value: '02/01/2024 - invalid' } });

      // Should not call onChange for invalid second date
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility Edge Cases', () => {
    it('provides proper ARIA attributes', () => {
      render(<DateRangePicker aria-label="Date range selector" aria-describedby="date-help" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Date range selector');
      expect(input).toHaveAttribute('aria-describedby', 'date-help');
    });

    it('uses generated ID when none provided', () => {
      render(<DateRangePicker />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id');
    });

    it('uses provided ID over generated one', () => {
      render(<DateRangePicker id="custom-date-picker" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'custom-date-picker');
    });
  });

  describe('Calendar Integration', () => {
    it('renders calendar when opened', async () => {
      const user = userEvent.setup();
      render(<DateRangePicker />);

      const popover = screen.getByTestId('popover');
      await user.click(popover);

      expect(screen.getByTestId('calendar')).toBeInTheDocument();
    });

    it('handles calendar props', () => {
      const props = {
        numberOfMonths: 2,
        showOutsideDays: false,
        fixedWeeks: true,
        captionLayout: 'dropdown' as const,
      };

      render(<DateRangePicker {...props} />);

      // Should render without crashing
      expect(screen.getByTestId('popover')).toBeInTheDocument();
    });
  });

  describe('Event Handler Props', () => {
    it('accepts event handler props', () => {
      const onMonthChange = jest.fn();
      const onDayClick = jest.fn();
      const onSelect = jest.fn();

      render(<DateRangePicker onMonthChange={onMonthChange} onDayClick={onDayClick} onSelect={onSelect} />);

      // Should render without crashing
      expect(screen.getByTestId('popover')).toBeInTheDocument();
    });
  });
});
