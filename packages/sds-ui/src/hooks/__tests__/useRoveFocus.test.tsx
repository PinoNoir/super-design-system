import { renderHook, act } from '@testing-library/react';
import useRoveFocus from '../useRoveFocus';

// Extend the Window interface to include keyPressCallbacks
declare global {
  interface Window {
    keyPressCallbacks?: Record<string, () => void>;
  }
}

// Mock react-use's useKeyPressEvent
jest.mock('react-use', () => ({
  useKeyPressEvent: jest.fn((key, callback) => {
    // Store the callback in our mock registry
    if (!window.keyPressCallbacks) {
      window.keyPressCallbacks = {};
    }
    window.keyPressCallbacks[key] = callback;
  }),
}));

// Helper to simulate key press
const simulateKeyPress = (key: string) => {
  const callback = window.keyPressCallbacks?.[key];
  if (callback) {
    act(() => {
      callback();
    });
  } else {
    throw new Error(`No callback registered for key: ${key}`);
  }
};

describe('useRoveFocus', () => {
  beforeEach(() => {
    // Clear the mock registry before each test
    window.keyPressCallbacks = {};
  });

  it('should initialize with focus on the first item', () => {
    const { result } = renderHook(() => useRoveFocus(5));
    const [currentFocus] = result.current;

    expect(currentFocus).toBe(0);
  });

  it('should move focus down when ArrowDown is pressed', () => {
    const { result } = renderHook(() => useRoveFocus(5));

    simulateKeyPress('ArrowDown');
    expect(result.current[0]).toBe(1);

    simulateKeyPress('ArrowDown');
    expect(result.current[0]).toBe(2);
  });

  it('should move focus up when ArrowUp is pressed', () => {
    const { result } = renderHook(() => useRoveFocus(5));

    // First set the focus to a non-zero value
    act(() => {
      result.current[1](2);
    });
    expect(result.current[0]).toBe(2);

    simulateKeyPress('ArrowUp');
    expect(result.current[0]).toBe(1);

    simulateKeyPress('ArrowUp');
    expect(result.current[0]).toBe(0);
  });

  it('should wrap to the top when ArrowDown is pressed on the last item', () => {
    const size = 3;
    const { result } = renderHook(() => useRoveFocus(size));

    // Set focus to the last item
    act(() => {
      result.current[1](size - 1);
    });
    expect(result.current[0]).toBe(size - 1);

    simulateKeyPress('ArrowDown');
    expect(result.current[0]).toBe(0);
  });

  it('should wrap to the bottom when ArrowUp is pressed on the first item', () => {
    const size = 3;
    const { result } = renderHook(() => useRoveFocus(size));

    // Focus is already on first item (0)
    expect(result.current[0]).toBe(0);

    simulateKeyPress('ArrowUp');
    expect(result.current[0]).toBe(size - 1);
  });

  it('should allow manual focus setting via the returned setter', () => {
    const size = 5;
    const { result } = renderHook(() => useRoveFocus(size));

    act(() => {
      result.current[1](3);
    });
    expect(result.current[0]).toBe(3);

    act(() => {
      result.current[1](0);
    });
    expect(result.current[0]).toBe(0);
  });

  it('should handle size changes appropriately', () => {
    const initialSize = 5;
    const { result, rerender } = renderHook(({ size }) => useRoveFocus(size), {
      initialProps: { size: initialSize },
    });

    // Set focus to last item in initial size
    act(() => {
      result.current[1](initialSize - 1);
    });
    expect(result.current[0]).toBe(initialSize - 1);

    // Rerender with smaller size
    const newSize = 3;
    rerender({ size: newSize });

    // Focus should still be at the same index if valid
    // But our test should verify the wrapping logic still works correctly
    simulateKeyPress('ArrowDown');
    expect(result.current[0]).toBe(0);
  });
});
