import { clsx } from 'clsx';
import { forwardRef, PropsWithChildren } from 'react';
import styles from './styles/Accordion.module.css';
import AccordionContext from './AccordionContext';
import AccordionProvider from './AccordionProvider';

export interface AccordionProps {
  /**
   * Specify an optional className to be applied to
   * the container node.
   */
  className?: string;

  /**
   * Specify whether an individual AccordionItem
   * should be disabled.
   */
  disabled?: boolean;

  /**
   * The color mode of the accordion.
   */
  variant?: 'light' | 'dark';

  /**
   * The currently open item ID (for controlled usage)
   */
  openItemId?: string | null;

  /**
   * Setter for the open item ID (for controlled usage)
   */
  setOpenItemId?: (id: string | null) => void;
}

/**
 * The accordion component is used to display a list of items that can be
 * expanded or collapsed to show or hide additional content.
 */
const Accordion = forwardRef<HTMLUListElement, PropsWithChildren<AccordionProps>>(
  ({ className, children, disabled = false, variant = 'light', openItemId, setOpenItemId, ...props }, ref) => {
    const containerClasses = clsx(styles.accordionContainer, {
      [styles.dark]: variant === 'dark',
    });

    // Check if we're in controlled mode
    const isControlled = openItemId !== undefined && setOpenItemId !== undefined;

    // Use a controlled context or the default provider
    if (isControlled) {
      return (
        <AccordionContext.Provider value={{ openItemId, setOpenItemId, disabled }}>
          <ul ref={ref} className={clsx(containerClasses, className)} {...props}>
            {children}
          </ul>
        </AccordionContext.Provider>
      );
    }

    // Default uncontrolled behavior
    return (
      <AccordionProvider disabled={disabled}>
        <ul ref={ref} className={clsx(containerClasses, className)} {...props}>
          {children}
        </ul>
      </AccordionProvider>
    );
  },
);

Accordion.displayName = 'Accordion';

export default Accordion;
