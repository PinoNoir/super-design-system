import { useLayoutEffect, useRef, useState } from 'react';

function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(() => {
      setHeight(element.scrollHeight);
    });

    resizeObserver.observe(element);

    return () => {
      if (element) resizeObserver.unobserve(element);
      resizeObserver.disconnect();
    };
  }, []);

  return [ref, height] as const;
}

export default useMeasure;
