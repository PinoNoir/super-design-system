import { useState, useEffect } from 'react';
import { render, screen, act } from '@testing-library/react';
import useMeasure from '../useMeasure';

// Mock ResizeObserver
class ResizeObserverMock {
  callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  trigger = (entry: Partial<ResizeObserverEntry>) => {
    this.callback([entry as ResizeObserverEntry], this);
  };
}

describe('useMeasure hook', () => {
  let resizeObserverInstance: ResizeObserverMock;

  beforeAll(() => {
    global.ResizeObserver = jest.fn((cb) => {
      resizeObserverInstance = new ResizeObserverMock(cb);
      return resizeObserverInstance;
    }) as unknown as typeof ResizeObserver;
  });

  const DynamicTestComponent = () => {
    const [expanded, setExpanded] = useState(false);
    const [ref, height] = useMeasure<HTMLDivElement>();

    useEffect(() => {
      const timeout = setTimeout(() => setExpanded(true), 100);
      return () => clearTimeout(timeout);
    }, []);

    return (
      <>
        <div
          ref={(el) => {
            if (el) {
              Object.defineProperty(el, 'scrollHeight', {
                configurable: true,
                get: () => (expanded ? 300 : 100),
              });
            }
            ref.current = el;
          }}
          automation-id="measured-div"
        >
          {expanded ? 'Expanded content' : 'Initial content'}
        </div>
        <div automation-id="height-display">{height}</div>
      </>
    );
  };

  it('updates height when content expands', () => {
    jest.useFakeTimers();
    render(<DynamicTestComponent />);

    const heightDisplay = screen.getByTestId('height-display');

    // Initial height
    expect(heightDisplay.textContent).toBe('0'); // Initially 0 before ResizeObserver triggers

    // Simulate time passing to trigger expansion
    act(() => {
      jest.advanceTimersByTime(150);
    });

    // Simulate ResizeObserver triggering after expansion
    act(() => {
      resizeObserverInstance.trigger({
        target: screen.getByTestId('measured-div'),
        contentRect: { height: 300 } as DOMRectReadOnly,
      });
    });

    expect(heightDisplay.textContent).toBe('300');

    jest.useRealTimers();
  });
});
