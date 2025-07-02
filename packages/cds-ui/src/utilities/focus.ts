import { RefObject } from 'react';

/**
 * Focuses an HTML element safely and consistently across different input types.
 *
 * @param {HTMLElement | RefObject<HTMLElement | null> | null | undefined} elementOrRef
 * - The element or React ref to focus
 * - Accepts direct HTML elements, React refs, null, or undefined
 *
 * @description
 * This utility provides a robust way to focus elements with several key features:
 * - Handles different input types (direct elements, refs)
 * - Prevents errors with null or undefined inputs
 * - Skips focusing if the element is already the active element
 * - Gracefully handles elements without a focus method
 *
 * @example
 * // Focusing a direct element
 * const inputElement = document.getElementById('myInput');
 * focus(inputElement);
 *
 * @example
 * // Focusing a React ref
 * function MyComponent() {
 *   const inputRef = useRef(null);
 *
 *   const handleClick = () => {
 *     focus(inputRef); // Safely focuses the input
 *   };
 * }
 *
 * @example
 * // Handling potential null or undefined
 * focus(maybeElement); // Won't throw an error if maybeElement is null
 *
 * @returns {void}
 */
export function focus(elementOrRef: HTMLElement | RefObject<HTMLElement | null> | null | undefined): void {
  // Handle null or undefined input
  if (!elementOrRef) return;

  // Extract the actual element from ref or use the input directly
  const element = elementOrRef instanceof HTMLElement ? elementOrRef : elementOrRef.current;

  // Additional null check
  if (!element) return;

  // Check if element is an HTMLElement and not already focused
  if (element instanceof HTMLElement && document.activeElement !== element) {
    // Safely check and call focus method
    try {
      if (typeof element.focus === 'function') {
        element.focus();
      }
    } catch {
      // Silently handle any focus-related errors
      // This ensures the function doesn't throw if focus fails
    }
  }
}
