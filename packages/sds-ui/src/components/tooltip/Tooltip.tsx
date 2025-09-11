import * as RadixTooltip from '@radix-ui/react-tooltip';
import React from 'react';
import styles from './styles/Tooltip.module.css';

export interface TooltipProps extends Omit<RadixTooltip.TooltipContentProps, 'children'> {
  /** Pass in the child to which the tooltip will be applied */
  children: React.ReactNode;

  /**
   * Provide the description to be rendered inside of the Tooltip. The
   * description will use `aria-describedby` and will describe the child node
   * in addition to the text rendered inside of the child. This means that if you
   * have text in the child node, it will be announced alongside the
   * description to the screen reader.
   */
  description?: React.ReactNode;

  /** If true, the tooltip will open. */
  open?: boolean;

  /** If true, the tooltip will be open by default. */
  defaultOpen?: boolean;

  /** Callback fired when the tooltip opens or closes. */
  onOpenChange?: (open: boolean) => void;

  /** The distance in pixels from the trigger. */
  sideOffset?: number;

  /** The preferred side of the trigger to render against when open. Will be reversed when collisions occur and avoidCollisions is enabled. */
  side?: 'top' | 'right' | 'bottom' | 'left';

  /** The preferred alignment against the trigger. May change when collisions occur. */
  align?: 'start' | 'center' | 'end';

  /** The sticky behavior on the align axis. "partial" will keep the content in the boundary as long as the trigger is at least partially in the boundary whilst "always" will keep the content in the boundary regardless. */
  sticky?: 'partial' | 'always';

  /** When true, overrides the side and align preferences to prevent collisions with boundary edges. */
  avoidCollisions?: boolean;

  /** The element used as the collision boundary. By default this is the viewport, though you can provide additional element(s) to be included in this check. */
  collisionBoundary?: Element | null | Array<Element | null>;

  /** The padding to add to the collision boundary. */
  collisionPadding?: number;

  /** The element to render the tooltip content into. */
  container?: HTMLElement;

  /** Optionally specify the delay duration for the tooltip on open. */
  delayDuration?: number;

  /** Optionally specify the delay duration for the tooltip on close. */
  skipDelayDuration?: number;

  /** If true, the tooltip will not close when hovering over the content. */
  disableHoverableContent?: boolean;

  /** Event handler called when the escape key is down. It can be prevented by calling event.preventDefault. */
  onEscapeKeydown?: (event: KeyboardEvent) => void;

  /** By default, screenreaders will announce the content inside the component. If this is not descriptive enough, or you have content that cannot be announced, use aria-label as a more descriptive label. */
  ['aria-label']?: string;

  /** Optionally specify an automation id for testing purposes. */
  ['automation-id']?: string;

  /** Text alignment within the tooltip content */
  textAlign?: 'left' | 'center' | 'right';
}

// Displays additional information related to an element when the user hovers over it.
const Tooltip = ({
  children,
  description,
  defaultOpen,
  open,
  onOpenChange,
  delayDuration = 700,
  skipDelayDuration = 300,
  disableHoverableContent = false,
  side = 'top',
  sideOffset = 5,
  sticky = 'partial',
  align = 'center',
  avoidCollisions = true,
  collisionPadding = 10,
  collisionBoundary,
  container,
  onEscapeKeydown,
  textAlign = 'center',
  ...props
}: TooltipProps) => {
  return (
    <RadixTooltip.Provider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      disableHoverableContent={disableHoverableContent}
    >
      <RadixTooltip.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <RadixTooltip.Trigger className={styles.trigger} asChild automation-id="tooltip-trigger">
          {children}
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal container={container}>
          <RadixTooltip.Content
            className={`${styles.content} ${styles[`textAlign${textAlign.charAt(0).toUpperCase() + textAlign.slice(1)}`]}`}
            sideOffset={sideOffset}
            side={side}
            sticky={sticky}
            align={align}
            avoidCollisions={avoidCollisions}
            collisionPadding={collisionPadding}
            collisionBoundary={collisionBoundary}
            onEscapeKeyDown={onEscapeKeydown}
            automation-id="tooltip-content"
            {...props}
          >
            {description}
            <RadixTooltip.Arrow className={styles.arrow} />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};

Tooltip.displayName = 'Tooltip';

export default Tooltip;
