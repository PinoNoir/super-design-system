import React from 'react';
import { composeEventHandlers, composeReactEventHandlers } from '../events';

describe('composeEventHandlers', () => {
  // Custom event class for testing
  class TestEvent {
    defaultPrevented = false;
    preventDefault() {
      this.defaultPrevented = true;
    }
  }

  it('should call all handlers when no preventDefault is called', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const event = new TestEvent();

    const composedHandler = composeEventHandlers([handler1, handler2]);
    composedHandler(event);

    expect(handler1).toHaveBeenCalledWith(event);
    expect(handler2).toHaveBeenCalledWith(event);
  });

  it('should stop calling handlers after preventDefault is called', () => {
    const handler1 = jest.fn((event: TestEvent) => {
      event.preventDefault();
    });
    const handler2 = jest.fn();
    const event = new TestEvent();

    const composedHandler = composeEventHandlers([handler1, handler2]);
    composedHandler(event);

    expect(handler1).toHaveBeenCalledWith(event);
    expect(handler2).not.toHaveBeenCalled();
  });

  it('should handle undefined handlers gracefully', () => {
    const handler1 = jest.fn();
    const event = new TestEvent();

    const composedHandler = composeEventHandlers([handler1, undefined]);
    composedHandler(event);

    expect(handler1).toHaveBeenCalledWith(event);
  });

  it('should pass additional arguments to handlers', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const event = new TestEvent();
    const additionalArg1 = 'test';
    const additionalArg2 = 42;

    const composedHandler = composeEventHandlers([handler1, handler2]);
    composedHandler(event, additionalArg1, additionalArg2);

    expect(handler1).toHaveBeenCalledWith(event, additionalArg1, additionalArg2);
    expect(handler2).toHaveBeenCalledWith(event, additionalArg1, additionalArg2);
  });
});

describe('composeReactEventHandlers', () => {
  // Mock React synthetic event
  class MockReactEvent implements React.SyntheticEvent {
    type = 'test';
    nativeEvent: Event = {
      bubbles: false,
      cancelBubble: false,
      cancelable: false,
      composed: false,
      currentTarget: null,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: false,
      returnValue: true,
      srcElement: null,
      target: null,
      timeStamp: Date.now(),
      type: 'test',
      composedPath: jest.fn(),
      initEvent: jest.fn(),
      preventDefault: jest.fn(),
      stopImmediatePropagation: jest.fn(),
      stopPropagation: jest.fn(),
      NONE: 0,
      CAPTURING_PHASE: 1,
      AT_TARGET: 2,
      BUBBLING_PHASE: 3,
    };
    target = null;
    currentTarget = null;
    eventPhase = 0;
    bubbles = false;
    cancelable = false;
    defaultPrevented = false;
    isTrusted = false;
    timeStamp = Date.now();
    persist = jest.fn();
    isDefaultPrevented = jest.fn(() => this.defaultPrevented);
    isPropagationStopped = jest.fn(() => false);
    preventDefault = jest.fn(() => {
      this.defaultPrevented = true;
      (this.isDefaultPrevented as jest.Mock).mockReturnValue(true);
    });
    stopPropagation = jest.fn();
  }

  it('should call all React event handlers when no preventDefault is called', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const event = new MockReactEvent();

    const composedHandler = composeReactEventHandlers([handler1, handler2]);
    composedHandler(event);

    expect(handler1).toHaveBeenCalledWith(event);
    expect(handler2).toHaveBeenCalledWith(event);
  });

  it('should stop calling React event handlers after preventDefault is called', () => {
    const handler1 = jest.fn((event: React.SyntheticEvent) => {
      event.preventDefault();
    });
    const handler2 = jest.fn();
    const event = new MockReactEvent();

    const composedHandler = composeReactEventHandlers([handler1, handler2]);
    composedHandler(event);

    expect(handler1).toHaveBeenCalledWith(event);
    expect(handler2).not.toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.isDefaultPrevented()).toBe(true);
  });

  it('should handle undefined React event handlers gracefully', () => {
    const handler1 = jest.fn();
    const event = new MockReactEvent();

    const composedHandler = composeReactEventHandlers([handler1, undefined]);
    composedHandler(event);

    expect(handler1).toHaveBeenCalledWith(event);
  });

  it('should pass additional arguments to React event handlers', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const event = new MockReactEvent();
    const additionalArg1 = 'test';
    const additionalArg2 = 42;

    const composedHandler = composeReactEventHandlers([handler1, handler2]);
    composedHandler(event, additionalArg1, additionalArg2);

    expect(handler1).toHaveBeenCalledWith(event, additionalArg1, additionalArg2);
    expect(handler2).toHaveBeenCalledWith(event, additionalArg1, additionalArg2);
  });
});
