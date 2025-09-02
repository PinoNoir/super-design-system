import { useId, useState, useCallback } from 'react';
import { format, isValid, parse } from 'date-fns';
import type {
  DateRange,
  Matcher,
  MonthChangeEventHandler,
  DayEventHandler,
  Locale,
  ModifiersClassNames,
  ModifiersStyles,
  ClassNames,
  PropsRange,
} from 'react-day-picker';
import { CalendarIcon } from 'lucide-react';
import Calendar from './Calendar';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';

import clsx from 'clsx';
import styles from './styles/DateRangePicker.module.css';

interface DateRangePickerProps {
  // Core functionality
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  defaultValue?: DateRange;

  // Input configuration
  placeholder?: string;
  format?: string;
  inputClassName?: string;

  // Calendar configuration
  numberOfMonths?: number;
  defaultMonth?: Date;
  startMonth?: Date;
  endMonth?: Date;

  // Date constraints
  disabled?: Matcher | Matcher[];
  min?: number;
  max?: number;
  required?: boolean;
  excludeDisabled?: boolean;

  // UI customization
  showOutsideDays?: boolean;
  fixedWeeks?: boolean;
  captionLayout?: 'dropdown' | 'label' | 'dropdown-months' | 'dropdown-years';

  // Accessibility
  id?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;

  // Styling
  className?: string;
  classNames?: ClassNames;
  modifiersClassNames?: ModifiersClassNames;
  modifiersStyles?: ModifiersStyles;

  // Event handlers
  onSelect?: PropsRange['onSelect'];
  onMonthChange?: MonthChangeEventHandler;
  onDayClick?: DayEventHandler<React.MouseEvent>;

  // Localization
  locale?: Locale;
  dir?: 'ltr' | 'rtl';

  // Advanced features
  timeZone?: string;
  today?: Date;

  // Legacy support
  minDate?: Date;
  maxDate?: Date;
  months?: number; // Alias for numberOfMonths
}

const DateRangePicker = ({
  value,
  onChange,
  defaultValue,
  placeholder = 'Pick a date range',
  format: dateFormat = 'MM/dd/yyyy',
  inputClassName,
  numberOfMonths = 1,
  defaultMonth,
  startMonth,
  endMonth,
  disabled,
  min,
  max,
  required = false,
  excludeDisabled = false,
  showOutsideDays = true,
  fixedWeeks = false,
  captionLayout = 'label',
  id: providedId,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  className,
  classNames,
  modifiersClassNames,
  modifiersStyles,
  onSelect,
  onMonthChange,
  onDayClick,
  locale,
  dir = 'ltr',
  today,
  // Legacy props
  minDate,
  maxDate,
  months,
}: DateRangePickerProps) => {
  const generatedId = useId();
  const id = providedId || generatedId;

  // Use numberOfMonths or legacy months prop
  const actualNumberOfMonths = months || numberOfMonths;

  // Handle legacy minDate/maxDate props
  const legacyDisabled = useCallback(() => {
    const matchers: Matcher[] = [];
    if (minDate) matchers.push({ before: minDate });
    if (maxDate) matchers.push({ after: maxDate });
    return matchers.length > 0 ? matchers : undefined;
  }, [minDate, maxDate]);

  const actualDisabled = disabled || legacyDisabled();

  const [selected, setSelected] = useState<DateRange | undefined>(value || defaultValue);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleRangeSelect = useCallback(
    (range: DateRange | undefined) => {
      setSelected(range);
      onChange?.(range);
      onSelect?.(range, range?.from, {}, new MouseEvent('click') as any);

      // Clear input value so getDisplayText() is used
      setInputValue('');
    },
    [onChange, onSelect],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputVal = e.target.value;
      setInputValue(inputVal);

      // Only parse if input looks complete enough
      const trimmedInput = inputVal.trim();
      if (trimmedInput.length < 8) return; // Minimum complete date length for MM/dd/yyyy

      // If the input contains " - " but is incomplete, don't parse anything
      if (trimmedInput.includes(' - ')) {
        // Try to parse date range format
        const rangeParts = trimmedInput.split(' - ');
        if (rangeParts.length === 2) {
          const fromPart = rangeParts[0].trim();
          const toPart = rangeParts[1].trim();

          // Only parse if both parts look like complete dates and match expected format
          if (fromPart.length >= 8 && toPart.length >= 8) {
            // Additional validation: check if the format roughly matches MM/dd/yyyy or custom format
            const formatLength = dateFormat.length;
            if (fromPart.length >= formatLength && toPart.length >= formatLength) {
              const fromDate = parse(fromPart, dateFormat, new Date());
              const toDate = parse(toPart, dateFormat, new Date());

              if (isValid(fromDate) && isValid(toDate)) {
                const newRange = { from: fromDate, to: toDate };
                setSelected(newRange);
                onChange?.(newRange);
              }
            }
          }
        }
        // Don't parse single dates if input contains " - " (it's an incomplete range)
        return;
      }

      // Parse as single date only if it doesn't contain " - " and matches expected length
      const formatLength = dateFormat.length;
      if (trimmedInput.length >= formatLength) {
        const singleDate = parse(trimmedInput, dateFormat, new Date());
        // Additional validation: make sure the parsed date formats back to similar input
        if (isValid(singleDate)) {
          const formattedBack = format(singleDate, dateFormat);
          // Only accept if the input closely matches the expected format
          if (trimmedInput.length >= formattedBack.length - 1) {
            // Allow for slight length differences
            const newRange = { from: singleDate, to: undefined };
            setSelected(newRange);
            onChange?.(newRange);
          }
        }
      }
    },
    [onChange, dateFormat],
  );

  const displayRange = selected || value;
  const getDisplayText = () => {
    if (!displayRange?.from) return '';
    if (!displayRange.to) return format(displayRange.from, dateFormat);
    return `${format(displayRange.from, dateFormat)} - ${format(displayRange.to, dateFormat)}`;
  };

  return (
    <div className={clsx(styles.container, className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className={styles.wrapper}>
            <div className={styles.innerWrapper}>
              <input
                id={id}
                type="text"
                value={inputValue || getDisplayText()}
                placeholder={placeholder}
                onChange={handleInputChange}
                className={clsx(styles.textInput, inputClassName)}
                aria-label={ariaLabel}
                aria-describedby={ariaDescribedBy}
              />
              <CalendarIcon size={20} />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className={styles.popover} align="start">
          <Calendar
            mode="range"
            defaultMonth={displayRange?.from || defaultMonth}
            selected={selected}
            onSelect={handleRangeSelect}
            numberOfMonths={actualNumberOfMonths}
            startMonth={startMonth}
            endMonth={endMonth}
            disabled={actualDisabled}
            min={min}
            max={max}
            required={required}
            excludeDisabled={excludeDisabled}
            showOutsideDays={showOutsideDays}
            fixedWeeks={fixedWeeks}
            captionLayout={captionLayout}
            classNames={classNames}
            modifiersClassNames={modifiersClassNames}
            modifiersStyles={modifiersStyles}
            onMonthChange={onMonthChange}
            onDayClick={onDayClick}
            locale={locale}
            dir={dir}
            today={today}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

DateRangePicker.displayName = 'DateRangePicker';

export default DateRangePicker;
