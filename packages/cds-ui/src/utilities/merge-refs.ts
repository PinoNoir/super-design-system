import { Ref } from 'react';

/**
 * Merges multiple React refs into a single ref function
 * @template T - The type of the element the ref is attached to
 * @param {Array<Ref<T> | undefined | null>} refs - List of React refs to merge
 * @returns {(element: T | null) => void} - Merged React ref function
 */
const mergeRefs = <T extends Element>(...refs: Array<Ref<T> | undefined | null>): ((element: T | null) => void) => {
  return (element: T | null) => {
    refs.forEach((ref) => {
      if (ref === null || ref === undefined) return;

      // https://github.com/facebook/react/issues/13029#issuecomment-410002316
      if (typeof ref === 'function') {
        ref(element);
      } else {
        (ref as React.MutableRefObject<T | null>).current = element;
      }
    });
  };
};

export default mergeRefs;
