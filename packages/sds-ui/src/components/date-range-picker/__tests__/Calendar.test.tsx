import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calendar from '../Calendar';
import type { DateRange } from 'react-day-picker';

// Mock react-day-picker
jest.mock('react-day-picker', () => ({
  DayPicker: ({ onSelect, onMonthChange, onDayClick, classNames, ...props }: any) => {
    // Convert camelCase props to kebab-case data attributes
    const convertToDataAttrs = (obj: any) => {
      const dataAttrs: any = {};
      Object.keys(obj).forEach((key) => {
        const kebabKey = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
        const value = obj[key];
        if (value !== undefined && value !== null) {
          dataAttrs[`data-${kebabKey}`] = String(value);
        }
      });
      return dataAttrs;
    };

    return (
      <div
        automation-id="day-picker"
        data-class-names={JSON.stringify(classNames)}
        role="grid"
        tabIndex={0}
        {...convertToDataAttrs(props)}
      >
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
    );
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronLeft: () => <div automation-id="chevron-left">left</div>,
  ChevronRight: () => <div automation-id="chevron-right">right</div>,
}));

describe('Calendar', () => {
  const defaultProps = {
    mode: 'range' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<Calendar {...defaultProps} />);

      expect(screen.getByTestId('day-picker')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(<Calendar {...defaultProps} className="custom-calendar" />);

      const wrapper = screen.getByTestId('day-picker').parentElement;
      expect(wrapper).toHaveClass('custom-calendar');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Calendar {...defaultProps} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Calendar Configuration', () => {
    it('applies default calendar settings', () => {
      render(<Calendar {...defaultProps} />);

      const dayPicker = screen.getByTestId('day-picker');
      expect(dayPicker).toHaveAttribute('data-show-outside-days', 'true');
      expect(dayPicker).toHaveAttribute('data-fixed-weeks', 'false');
      expect(dayPicker).toHaveAttribute('data-caption-layout', 'label');
      expect(dayPicker).toHaveAttribute('data-nav-layout', 'around');
      expect(dayPicker).toHaveAttribute('data-hide-weekdays', 'false');
      expect(dayPicker).toHaveAttribute('data-show-week-number', 'false');
      expect(dayPicker).toHaveAttribute('data-animate', 'false');
    });

    it('applies custom calendar settings', () => {
      const props = {
        ...defaultProps,
        showOutsideDays: false,
        fixedWeeks: true,
        captionLayout: 'dropdown' as const,
        navLayout: 'around' as const,
        hideWeekdays: true,
        showWeekNumber: true,
        animate: true,
      };

      render(<Calendar {...props} />);

      const dayPicker = screen.getByTestId('day-picker');
      expect(dayPicker).toHaveAttribute('data-show-outside-days', 'false');
      expect(dayPicker).toHaveAttribute('data-fixed-weeks', 'true');
      expect(dayPicker).toHaveAttribute('data-caption-layout', 'dropdown');
      expect(dayPicker).toHaveAttribute('data-hide-weekdays', 'true');
      expect(dayPicker).toHaveAttribute('data-show-week-number', 'true');
      expect(dayPicker).toHaveAttribute('data-animate', 'true');
    });
  });

  describe('Class Names Integration', () => {
    it('merges default and custom class names', () => {
      const customClassNames = {
        root: 'custom-root',
        day_button: 'custom-day-button',
        selected: 'custom-selected',
      };

      render(<Calendar {...defaultProps} classNames={customClassNames as any} />);

      const dayPicker = screen.getByTestId('day-picker');
      const classNamesData = JSON.parse(dayPicker.getAttribute('data-class-names') || '{}');

      expect(classNamesData).toMatchObject({
        root: 'custom-root',
        day_button: 'custom-day-button',
        selected: 'custom-selected',
        // Should also include default styles
        range_middle: expect.any(String),
        hidden: expect.any(String),
      });
    });

    it('applies CSS module styles by default', () => {
      render(<Calendar {...defaultProps} />);

      const dayPicker = screen.getByTestId('day-picker');
      const classNamesData = JSON.parse(dayPicker.getAttribute('data-class-names') || '{}');

      // Check that CSS module classes are applied
      expect(classNamesData.range_middle).toBeDefined();
      expect(classNamesData.hidden).toBeDefined();
    });
  });

  describe('Event Handlers', () => {
    it('handles month change events', async () => {
      const onMonthChange = jest.fn();
      const user = userEvent.setup();

      render(<Calendar {...defaultProps} onMonthChange={onMonthChange} />);

      const nextButton = screen.getByTestId('next-month');
      await user.click(nextButton);

      expect(onMonthChange).toHaveBeenCalledWith({ month: new Date(2024, 2, 1) });
    });

    it('handles day click events', async () => {
      const onDayClick = jest.fn();
      const user = userEvent.setup();

      render(<Calendar {...defaultProps} onDayClick={onDayClick} />);

      const dayButton = screen.getByTestId('day-15');
      await user.click(dayButton);

      expect(onDayClick).toHaveBeenCalledWith(new Date(2024, 1, 15), {}, expect.any(MouseEvent));
    });

    it('handles range selection events', async () => {
      const onSelect = jest.fn();
      const user = userEvent.setup();

      render(<Calendar {...defaultProps} onSelect={onSelect} />);

      const selectButton = screen.getByTestId('select-range');
      await user.click(selectButton);

      expect(onSelect).toHaveBeenCalledWith(
        {
          from: new Date(2024, 1, 1),
          to: new Date(2024, 1, 15),
        },
        new Date(2024, 1, 1),
        {},
        expect.any(MouseEvent),
      );
    });
  });

  describe('Date Constraints', () => {
    it('applies startMonth constraint', () => {
      const startMonth = new Date(2024, 0, 1);
      render(<Calendar {...defaultProps} startMonth={startMonth} />);

      const dayPicker = screen.getByTestId('day-picker');
      expect(dayPicker).toHaveAttribute('data-start-month');
    });

    it('applies endMonth constraint', () => {
      const endMonth = new Date(2024, 11, 31);
      render(<Calendar {...defaultProps} endMonth={endMonth} />);

      const dayPicker = screen.getByTestId('day-picker');
      expect(dayPicker).toHaveAttribute('data-end-month');
    });

    it('applies disabled dates', () => {
      const disabled = [new Date(2024, 1, 10)];
      render(<Calendar {...defaultProps} disabled={disabled} />);

      const dayPicker = screen.getByTestId('day-picker');
      expect(dayPicker).toHaveAttribute('data-disabled');
    });
  });

  describe('Modifiers and Styling', () => {
    it('applies custom modifiers', () => {
      const modifiers = {
        today: new Date(),
        weekend: { dayOfWeek: [0, 6] },
      };

      render(<Calendar {...defaultProps} modifiers={modifiers} />);

      const dayPicker = screen.getByTestId('day-picker');
      expect(dayPicker).toHaveAttribute('data-modifiers');
    });

    it('applies modifiersClassNames', () => {
      const modifiersClassNames = {
        today: 'custom-today',
        weekend: 'custom-weekend',
      };

      render(<Calendar {...defaultProps} modifiersClassNames={modifiersClassNames} />);

      const dayPicker = screen.getByTestId('day-picker');
      expect(dayPicker).toHaveAttribute('data-modifiers-class-names');
    });

    it('applies modifiersStyles', () => {
      const modifiersStyles = {
        today: { backgroundColor: 'blue' },
        weekend: { color: 'red' },
      };

      render(<Calendar {...defaultProps} modifiersStyles={modifiersStyles} />);

      const dayPicker = screen.getByTestId('day-picker');
      expect(dayPicker).toHaveAttribute('data-modifiers-styles');
    });
  });

  describe('Localization', () => {
    it('applies locale settings', () => {
      const locale = { code: 'en-US' };
      render(<Calendar {...defaultProps} locale={locale} />);

      const dayPicker = screen.getByTestId('day-picker');
      expect(dayPicker).toHaveAttribute('data-locale');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Calendar {...defaultProps} />);

      const dayPicker = screen.getByTestId('day-picker');
      expect(dayPicker).toHaveAttribute('role', 'grid');
    });

    it('supports keyboard navigation', () => {
      render(<Calendar {...defaultProps} />);

      const dayPicker = screen.getByTestId('day-picker');

      // Focus the calendar container directly
      dayPicker.focus();
      expect(dayPicker).toHaveFocus();
    });
  });

  describe('Props Forwarding', () => {
    it('forwards all additional props to DayPicker', () => {
      const additionalProps = {
        startMonth: new Date(2024, 0, 1),
        endMonth: new Date(2024, 11, 31),
        numberOfMonths: 2,
        pagedNavigation: true,
        reverseMonths: false,
      };

      render(<Calendar {...defaultProps} {...additionalProps} />);

      const dayPicker = screen.getByTestId('day-picker');
      expect(dayPicker).toHaveAttribute('data-start-month');
      expect(dayPicker).toHaveAttribute('data-end-month');
      expect(dayPicker).toHaveAttribute('data-number-of-months', '2');
      expect(dayPicker).toHaveAttribute('data-paged-navigation', 'true');
      expect(dayPicker).toHaveAttribute('data-reverse-months', 'false');
    });
  });
});
