import { Icon } from '@iconify/react';
import { clsx } from 'clsx';
import React, {
  AriaAttributes,
  forwardRef,
  KeyboardEvent,
  MouseEvent,
  MouseEventHandler,
  PropsWithChildren,
  ReactElement,
  useRef,
} from 'react';
import useAccordionItem from '../../hooks/useAccordionItem';
import styles from './styles/Accordion.module.css';
import useAccordionContext from './useAccordionContext';
import { useId } from '../../utilities/use-id';

export interface AccordionItemProps {
  /**
   * The id of the accordion item.
   */
  id: string;
  /**
   * The content to display in the accordion item.
   */
  children?: React.ReactNode;
  /**
   * Specify an optional className to be
   * applied to the container node.
   */
  className?: string;

  /**
   * Specify whether an individual `AccordionItem` should
   * be disabled (overrides the parent accordion state). If undefined,
   * this value will be managed by the parent Accordion.
   */
  disabled?: boolean;

  /**
   * The handler of the massaged `click` event.
   */
  onClick?: MouseEventHandler<HTMLLIElement>;

  /**
   * The accordion title.
   */
  title: React.ReactNode;

  /**
   * The description of the content to be displayed in the accordion item.
   */
  description?: string;

  /**
   * Pass a custom context menu to the accordion item.
   */
  contextMenu?: React.ReactNode;

  /**
   * Optionally enable the menu container.
   */
  enableMenuContainer?: boolean;

  /**
   * `true` to open the expand.
   */
  open: boolean;

  /**
   * The callback function to render the expand button.
   * Can be a React component class.
   */
  renderToggle?: (props: PropsWithChildren<AccordionToggleProps>) => ReactElement;

  /**
   * The callback function to run on the `onTransitionEnd`
   * event for the list item.
   */
  handleTransitionEnd?: React.TransitionEventHandler<HTMLDivElement>;

  /**
   * The callback function to run on the `onHeadingClick`
   * event for the list item.
   */
  onHeadingClick?: (isOpen: boolean, event: MouseEvent<HTMLButtonElement>) => void;

  /**
   * The heading level for the accordion header (for accessibility)
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

interface AccordionToggleProps {
  'aria-controls'?: AriaAttributes['aria-controls'];
  'aria-expanded'?: AriaAttributes['aria-expanded'];
  'aria-disabled'?: AriaAttributes['aria-disabled'];
  role?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  'data-state'?: 'open' | 'closed';
  ['automation-id']?: string;
}

const defaultRenderToggle = (props: AccordionToggleProps) => <button type="button" {...props} />;

const AccordionItem = forwardRef<HTMLLIElement, AccordionItemProps>(
  (
    {
      id,
      children,
      className,
      open,
      renderToggle = defaultRenderToggle,
      title,
      description,
      contextMenu,
      enableMenuContainer = false,
      disabled: controlledDisabled,
      handleTransitionEnd,
      onHeadingClick,
      headingLevel = 3,
      ...props
    },
    ref,
  ) => {
    const {
      isOpen,
      handleClick: handleButtonClick,
      handleKeyDown: handleButtonKeyDown,
    } = useAccordionItem({ id, open, onHeadingClick });

    const uniqueId = useId('accordion-item');
    const contentId = useId('accordion-content');
    const headerId = useId('accordion-header');
    const accordionState = useAccordionContext();
    const contentRef = useRef<HTMLDivElement>(null);

    const disabled = controlledDisabled ?? accordionState.disabled;
    const Toggle = renderToggle;

    const handleContextMenuClick = (e: MouseEvent) => {
      e.stopPropagation();
    };

    // Create heading element based on provided headingLevel
    const HeadingTag = `h${headingLevel}` as keyof React.JSX.IntrinsicElements;

    return (
      <li
        ref={ref}
        className={clsx(styles.accordionItem, className)}
        {...props}
        id={uniqueId}
        data-state={isOpen ? 'open' : 'closed'}
      >
        <HeadingTag className={styles.accordionHeading}>
          <Toggle
            disabled={disabled}
            aria-controls={contentId}
            aria-expanded={isOpen}
            aria-disabled={disabled}
            role="button"
            id={headerId}
            className={clsx(styles.accordionHeader, className)}
            onClick={handleButtonClick}
            onKeyDown={handleButtonKeyDown}
            data-state={isOpen ? 'open' : 'closed'}
            automation-id="accordion-toggle"
          >
            <Icon icon="mdi:chevron-down" className={styles.accordionChevron} aria-hidden="true" focusable="false" />
            <div className={styles.accordionTitle}>{title}</div>
            {description && <div className={styles.accordionDescription}>{description}</div>}
            {enableMenuContainer && contextMenu && (
              <div
                className={styles.accordionContextMenu}
                onClick={handleContextMenuClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                role="presentation"
              >
                {contextMenu}
              </div>
            )}
          </Toggle>
        </HeadingTag>
        <div
          id={contentId}
          ref={contentRef}
          className={clsx(
            styles.accordionContent,
            isOpen ? styles.accordionContentOpen : styles.accordionContentClosed,
          )}
          onTransitionEnd={handleTransitionEnd}
          role="region"
          aria-labelledby={headerId}
          hidden={!isOpen}
          automation-id="accordion-content"
          data-state={isOpen ? 'open' : 'closed'}
        >
          <div className={styles.accordionContentInner}>{children}</div>
        </div>
      </li>
    );
  },
);

AccordionItem.displayName = 'AccordionItem';

export default AccordionItem;
