import { Icon } from '@iconify/react';
import * as RadixPopover from '@radix-ui/react-popover';
import React from 'react';
import styles from './styles/Popover.module.css';

export interface CustomPopoverProps extends RadixPopover.PopoverProps {
  /**
   * Content to be displayed in the popover
   */
  description: string | React.ReactNode;

  /**
   * Pass in a trigger for the popover as children
   */
  children: React.ReactNode;

  /**
   * Specify whether the popover is open or not
   */
  open?: boolean;

  /**
   * Specify whether the popover is open by default
   */
  defaultOpen?: boolean;

  /**
   * Callback for when the popover is opened or closed
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Specify whether the popover should be modal
   */
  modal?: boolean;

  /**
   * The preferred side of the anchor to render against
   * @default "top"
   */
  side?: 'top' | 'right' | 'bottom' | 'left';

  /**
   * The distance in pixels from the anchor
   * @default 2
   */
  sideOffset?: number;

  /**
   * Whether to hide the arrow
   * @default false
   */
  hideArrow?: boolean;

  /**
   * Additional CSS class for the popover content
   */
  contentClassName?: string;

  /**
   * Custom width for the popover content (e.g., '400px')
   * This will override the default max-width
   */
  width?: string;

  /**
   * Custom styles for the popover content
   */
  contentStyle?: React.CSSProperties;

  /**
   * Optionally specify an automation id for testing purposes.
   */
  ['automation-id']?: string;
}

const Popover = ({
  description,
  children,
  side = 'top',
  sideOffset = 2,
  hideArrow = false,
  contentClassName,
  width,
  contentStyle,
  modal = false,
  ...props
}: CustomPopoverProps) => {
  // Combine custom width with other content styles if provided
  const combinedContentStyle: React.CSSProperties = {
    ...(width ? { width, maxWidth: width } : {}),
    ...(contentStyle || {}),
  };

  return (
    <RadixPopover.Root modal={modal} {...props}>
      <RadixPopover.Trigger className={styles.popoverTrigger} asChild>
        {children}
      </RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          className={`${styles.popoverContent} ${contentClassName || ''}`}
          side={side}
          sideOffset={sideOffset}
          style={Object.keys(combinedContentStyle).length > 0 ? combinedContentStyle : undefined}
          data-automation-id={props['automation-id']}
          collisionPadding={8}
        >
          {description}
          <RadixPopover.Close className={styles.popoverClose} aria-label="Close">
            <Icon icon="mdi:close" width="16px" height="16px" />
          </RadixPopover.Close>

          <RadixPopover.Arrow className={`${styles.popoverArrow} ${hideArrow ? styles.hideArrow : ''}`} />
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
};

Popover.displayName = 'Popover';

export default Popover;
