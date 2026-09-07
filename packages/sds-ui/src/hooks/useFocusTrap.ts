import { useState, useEffect, useCallback, useRef } from 'react';

interface UseFocusTrapOptions {
  rootElement: React.RefObject<HTMLElement>;
  isActive: boolean;
  initialFocusElement?: React.RefObject<HTMLElement>;
  /**
   * Also move focus on ArrowUp/Down/Left/Right, in addition to Tab/Shift+Tab.
   * Useful for roving-tabindex widgets (toolbars, radio groups). Defaults to
   * true for backward compatibility, but modal/dialog traps should pass
   * `false` - arrow keys bubbling up from a focused `<textarea>`, `<select>`,
   * or text `<input>` inside the trap are native interactions, not requests
   * to move focus elsewhere.
   */
  enableArrowKeyNavigation?: boolean;
}

function useFocusTrap({
  rootElement,
  isActive,
  initialFocusElement,
  enableArrowKeyNavigation = true,
}: UseFocusTrapOptions) {
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([]);
  const [currentFocus, setCurrentFocus] = useState(0);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Get all focusable elements
  useEffect(() => {
    if (isActive && rootElement.current) {
      const elements = Array.from(
        rootElement.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      );

      setFocusableElements(elements as HTMLElement[]);
    }
  }, [isActive, rootElement]);

  // Store previous active element and set initial focus
  useEffect(() => {
    if (isActive) {
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Set initial focus
      if (initialFocusElement?.current) {
        initialFocusElement.current.focus();
        const index = focusableElements.indexOf(initialFocusElement.current);
        if (index >= 0) setCurrentFocus(index);
      } else if (focusableElements.length > 0) {
        focusableElements[0].focus();
        setCurrentFocus(0);
      }
    } else if (previousActiveElement.current) {
      // Restore focus when trap becomes inactive
      previousActiveElement.current.focus();
    }
  }, [isActive, initialFocusElement, focusableElements]);

  // Focus the current element when currentFocus changes
  useEffect(() => {
    if (isActive && focusableElements.length > 0 && focusableElements[currentFocus]) {
      focusableElements[currentFocus].focus();
    }
  }, [currentFocus, isActive, focusableElements]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isActive || focusableElements.length === 0) return;

      switch (event.key) {
        case 'Tab':
          event.preventDefault();
          if (event.shiftKey) {
            // Shift+Tab: previous element or wrap to end
            setCurrentFocus(currentFocus === 0 ? focusableElements.length - 1 : currentFocus - 1);
          } else {
            // Tab: next element or wrap to beginning
            setCurrentFocus(currentFocus === focusableElements.length - 1 ? 0 : currentFocus + 1);
          }
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          if (!enableArrowKeyNavigation) return;
          event.preventDefault();
          setCurrentFocus(currentFocus === focusableElements.length - 1 ? 0 : currentFocus + 1);
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          if (!enableArrowKeyNavigation) return;
          event.preventDefault();
          setCurrentFocus(currentFocus === 0 ? focusableElements.length - 1 : currentFocus - 1);
          break;
      }
    },
    [isActive, focusableElements, currentFocus, enableArrowKeyNavigation],
  );

  // Set up and clean up event listeners
  useEffect(() => {
    if (isActive && rootElement.current) {
      const element = rootElement.current;
      element.addEventListener('keydown', handleKeyDown);
      return () => {
        element.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isActive, handleKeyDown, rootElement]);

  return {
    focusableElements,
    currentFocus,
    setCurrentFocus,
  };
}

export default useFocusTrap;
