import { renderHook, act } from '@testing-library/react';
import useFocusTrap from '../useFocusTrap';

describe('useFocusTrap Hook', () => {
  // Create a mock DOM structure for testing
  const setupDom = () => {
    const div = document.createElement('div');
    div.innerHTML = `
      <button id="outside-button">Outside Button</button>
      <div id="root">
        <button id="button-1">Button 1</button>
        <input id="input-1" type="text" />
        <a id="link-1" href="#">Link 1</a>
        <button id="button-2">Button 2</button>
      </div>
    `;
    document.body.appendChild(div);

    return {
      rootElement: { current: document.getElementById('root') },
      button1: document.getElementById('button-1'),
      input1: document.getElementById('input-1'),
      link1: document.getElementById('link-1'),
      button2: document.getElementById('button-2'),
      outsideButton: document.getElementById('outside-button'),
      cleanup: () => document.body.removeChild(div),
    };
  };

  beforeEach(() => {
    // Mock focus method
    (HTMLElement.prototype.focus as jest.Mock) = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should identify focusable elements within the root element', () => {
    const dom = setupDom();

    const { result } = renderHook(() =>
      useFocusTrap({
        rootElement: dom.rootElement,
        isActive: true,
      }),
    );

    expect(result.current.focusableElements).toHaveLength(4);
    expect(result.current.focusableElements[0]).toBe(dom.button1);
    expect(result.current.focusableElements[1]).toBe(dom.input1);
    expect(result.current.focusableElements[2]).toBe(dom.link1);
    expect(result.current.focusableElements[3]).toBe(dom.button2);

    dom.cleanup();
  });

  it('should not set focus when isActive is false', () => {
    const dom = setupDom();

    renderHook(() =>
      useFocusTrap({
        rootElement: dom.rootElement,
        isActive: false,
      }),
    );

    expect(dom.button1.focus).not.toHaveBeenCalled();

    dom.cleanup();
  });

  it('should focus the first element when isActive becomes true', () => {
    const dom = setupDom();

    const { rerender } = renderHook(({ isActive }) => useFocusTrap({ rootElement: dom.rootElement, isActive }), {
      initialProps: { isActive: false },
    });

    // Activate the focus trap
    rerender({ isActive: true });

    // First element should be focused
    expect(dom.button1.focus).toHaveBeenCalled();

    dom.cleanup();
  });

  it('should focus the initialFocusElement when provided', () => {
    const dom = setupDom();

    const initialFocusElement = { current: dom.input1 };

    renderHook(() =>
      useFocusTrap({
        rootElement: dom.rootElement,
        isActive: true,
        initialFocusElement,
      }),
    );

    expect(dom.input1.focus).toHaveBeenCalled();

    dom.cleanup();
  });

  it('should restore previous focus when trap becomes inactive', () => {
    const dom = setupDom();

    // Focus an element outside the trap first
    dom.outsideButton.focus();
    Object.defineProperty(document, 'activeElement', {
      value: dom.outsideButton,
      configurable: true,
    });

    const { rerender } = renderHook(({ isActive }) => useFocusTrap({ rootElement: dom.rootElement, isActive }), {
      initialProps: { isActive: true },
    });

    // Deactivate the focus trap
    rerender({ isActive: false });

    // Should restore focus to the previously focused element
    expect(dom.outsideButton.focus).toHaveBeenCalled();

    dom.cleanup();
  });

  it('should handle Tab key navigation', () => {
    const dom = setupDom();

    const { result } = renderHook(() =>
      useFocusTrap({
        rootElement: dom.rootElement,
        isActive: true,
      }),
    );

    // Mock event
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    Object.defineProperty(tabEvent, 'preventDefault', { value: jest.fn() });

    // Simulate tab press
    act(() => {
      dom.rootElement.current.dispatchEvent(tabEvent);
    });

    // Current focus should move to the next element
    expect(result.current.currentFocus).toBe(1);
    expect(tabEvent.preventDefault).toHaveBeenCalled();

    dom.cleanup();
  });

  it('should handle Shift+Tab key navigation', () => {
    const dom = setupDom();

    const { result } = renderHook(() =>
      useFocusTrap({
        rootElement: dom.rootElement,
        isActive: true,
      }),
    );

    // Set focus to the second element first
    act(() => {
      result.current.setCurrentFocus(1);
    });

    // Mock event
    const shiftTabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
    });
    Object.defineProperty(shiftTabEvent, 'preventDefault', { value: jest.fn() });

    // Simulate shift+tab press
    act(() => {
      dom.rootElement.current.dispatchEvent(shiftTabEvent);
    });

    // Current focus should move to the previous element
    expect(result.current.currentFocus).toBe(0);
    expect(shiftTabEvent.preventDefault).toHaveBeenCalled();

    dom.cleanup();
  });

  it('should handle arrow key navigation', () => {
    const dom = setupDom();

    const { result } = renderHook(() =>
      useFocusTrap({
        rootElement: dom.rootElement,
        isActive: true,
      }),
    );

    // Mock arrow down event
    const arrowDownEvent = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      bubbles: true,
    });
    Object.defineProperty(arrowDownEvent, 'preventDefault', { value: jest.fn() });

    // Simulate arrow down press
    act(() => {
      dom.rootElement.current.dispatchEvent(arrowDownEvent);
    });

    // Current focus should move to the next element
    expect(result.current.currentFocus).toBe(1);
    expect(arrowDownEvent.preventDefault).toHaveBeenCalled();

    // Mock arrow up event
    const arrowUpEvent = new KeyboardEvent('keydown', {
      key: 'ArrowUp',
      bubbles: true,
    });
    Object.defineProperty(arrowUpEvent, 'preventDefault', { value: jest.fn() });

    // Simulate arrow up press
    act(() => {
      dom.rootElement.current.dispatchEvent(arrowUpEvent);
    });

    // Current focus should move to the previous element
    expect(result.current.currentFocus).toBe(0);
    expect(arrowUpEvent.preventDefault).toHaveBeenCalled();

    dom.cleanup();
  });

  it('should wrap focus from last to first element', () => {
    const dom = setupDom();

    const { result } = renderHook(() =>
      useFocusTrap({
        rootElement: dom.rootElement,
        isActive: true,
      }),
    );

    // Set focus to the last element
    act(() => {
      result.current.setCurrentFocus(3);
    });

    // Mock tab event
    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
    });
    Object.defineProperty(tabEvent, 'preventDefault', { value: jest.fn() });

    // Simulate tab press
    act(() => {
      dom.rootElement.current.dispatchEvent(tabEvent);
    });

    // Focus should wrap to the first element
    expect(result.current.currentFocus).toBe(0);

    dom.cleanup();
  });

  it('should wrap focus from first to last element with Shift+Tab', () => {
    const dom = setupDom();

    const { result } = renderHook(() =>
      useFocusTrap({
        rootElement: dom.rootElement,
        isActive: true,
      }),
    );

    // Mock shift+tab event
    const shiftTabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
    });
    Object.defineProperty(shiftTabEvent, 'preventDefault', { value: jest.fn() });

    // Simulate shift+tab press
    act(() => {
      dom.rootElement.current.dispatchEvent(shiftTabEvent);
    });

    // Focus should wrap to the last element
    expect(result.current.currentFocus).toBe(3);

    dom.cleanup();
  });

  it('should clean up event listeners when unmounted', () => {
    const dom = setupDom();

    const removeEventListenerSpy = jest.spyOn(dom.rootElement.current, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useFocusTrap({
        rootElement: dom.rootElement,
        isActive: true,
      }),
    );

    // Unmount the hook
    unmount();

    // Should remove event listener
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    dom.cleanup();
  });
});
