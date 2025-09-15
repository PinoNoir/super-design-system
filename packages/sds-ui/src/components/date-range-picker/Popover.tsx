import React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import clsx from 'clsx';
import styles from './styles/Popover.module.css';

interface PopoverProps extends React.ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}

const DateRangePopover = PopoverPrimitive.Root;
const DateRangePopoverTrigger = PopoverPrimitive.Trigger;

const DateRangePopoverContent = React.forwardRef<HTMLDivElement, PopoverProps>(
  ({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={clsx(styles.popoverContent, className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  ),
);

DateRangePopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { DateRangePopover, DateRangePopoverTrigger, DateRangePopoverContent };
