import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import * as React from 'react';
import type { ClassNames } from 'react-day-picker';
import styles from './styles/Calendar.module.css';
import clsx from 'clsx';

type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  className?: string;
  classNames?: ClassNames;
  showOutsideDays?: boolean;
  fixedWeeks?: boolean;
  captionLayout?: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years';
  navLayout?: 'around' | 'after';
  hideWeekdays?: boolean;
  showWeekNumber?: boolean;
  animate?: boolean;
};

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      className,
      classNames,
      showOutsideDays = true,
      fixedWeeks = false,
      captionLayout = 'label',
      navLayout = 'around',
      hideWeekdays = false,
      showWeekNumber = false,
      animate = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={className}>
        <DayPicker
          showOutsideDays={showOutsideDays}
          fixedWeeks={fixedWeeks}
          captionLayout={captionLayout}
          navLayout={navLayout}
          hideWeekdays={hideWeekdays}
          showWeekNumber={showWeekNumber}
          animate={animate}
          classNames={{
            root: styles.root,
            months: styles.months,
            month: styles.month,
            month_caption: styles.caption,
            caption_label: styles.captionLabel,
            nav: styles.nav,
            button_previous: clsx(styles.navButton, styles.navButtonPrevious),
            button_next: clsx(styles.navButton, styles.navButtonNext),
            month_grid: styles.table,
            weekdays: styles.headRow,
            weekday: styles.headCell,
            week: styles.row,
            day: styles.cell,
            day_button: styles.dayButton,
            selected: styles.daySelected,
            today: styles.dayToday,
            outside: styles.dayOutside,
            disabled: styles.dayDisabled,
            range_middle: styles.dayRangeMiddle,
            hidden: styles.dayHidden,
            range_start: styles.dayRangeStart,
            range_end: styles.dayRangeEnd,
            ...classNames,
          }}
          components={{
            Chevron: ({ orientation, ...chevronProps }) => {
              // Filter out non-DOM props before passing to Lucide icons
              const { className, size, ...domProps } = chevronProps;
              if (orientation === 'left') {
                return <ChevronLeft className={className} size={size} {...domProps} />;
              }
              return <ChevronRight className={className} size={size} {...domProps} />;
            },
          }}
          {...props}
        />
      </div>
    );
  },
);

Calendar.displayName = 'Calendar';
export default Calendar;
