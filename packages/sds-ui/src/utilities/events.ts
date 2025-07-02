import React from 'react';

/**
 * Generic utility to compose event handlers so that consumers can supply their
 * own event listeners on components. The default heuristic here is to
 * iterate through the given functions until `preventDefault` is called on the
 * given event.
 *
 * @template E - Event type that extends the base Event interface
 * @template Args - Additional arguments that might be passed to the handlers
 * @param handlers - Array of event handler functions to compose
 * @returns A composed event handler function
 */
export function composeEventHandlers<E extends { defaultPrevented: boolean }, Args extends any[] = any[]>(
  handlers: Array<((event: E, ...args: Args) => void) | undefined>,
): (event: E, ...args: Args) => void {
  return (event: E, ...args: Args): void => {
    for (const handler of handlers) {
      if (event.defaultPrevented) {
        break;
      }

      // Only call the handler if it's a function
      if (typeof handler === 'function') {
        handler(event, ...args);
      }
    }
  };
}

// React-specific version for those using React events
export function composeReactEventHandlers<E extends React.SyntheticEvent, Args extends any[] = any[]>(
  handlers: Array<((event: E, ...args: Args) => void) | undefined>,
): (event: E, ...args: Args) => void {
  return (event: E, ...args: Args): void => {
    for (const handler of handlers) {
      // Check both React's isDefaultPrevented and the standard defaultPrevented
      if (event.isDefaultPrevented?.()) {
        break;
      }

      // Only call the handler if it's a function
      if (typeof handler === 'function') {
        handler(event, ...args);
      }
    }
  };
}
