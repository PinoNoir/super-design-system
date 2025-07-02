import { Ref, ForwardedRef } from 'react';

/**
 * Combine multiple refs into a single ref. This is useful when you have two
 * refs from both `React.forwardRef` and `useRef` that you would like to add to
 * the same node.
 */
export const mergeRefs = <T>(...refs: ForwardedRef<T>[]): Ref<T> => {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref !== null && ref !== undefined) {
        ref.current = node;
      }
    });
  };
};
