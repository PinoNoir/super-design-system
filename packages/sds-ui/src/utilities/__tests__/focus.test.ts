import React from 'react';
import { focus } from '../focus';

describe('focus', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should focus an HTMLElement directly', () => {
    // Arrange
    const element = document.createElement('button');
    const focusSpy = jest.spyOn(element, 'focus');

    // Mock document.activeElement to be something other than our element
    Object.defineProperty(document, 'activeElement', {
      value: document.body,
      writable: true,
    });

    // Act
    focus(element);

    // Assert
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  test('should focus an element from a React ref', () => {
    // Arrange
    const element = document.createElement('input');
    const focusSpy = jest.spyOn(element, 'focus');
    const ref: React.RefObject<HTMLInputElement> = { current: element };

    // Mock document.activeElement to be something other than our element
    Object.defineProperty(document, 'activeElement', {
      value: document.body,
      writable: true,
    });

    // Act
    focus(ref);

    // Assert
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  test('should not focus if element is already focused', () => {
    // Arrange
    const element = document.createElement('div');
    const focusSpy = jest.spyOn(element, 'focus');

    // Mock document.activeElement to be our element already
    Object.defineProperty(document, 'activeElement', {
      value: element,
      writable: true,
    });

    // Act
    focus(element);

    // Assert
    expect(focusSpy).not.toHaveBeenCalled();
  });

  test('should handle null ref gracefully', () => {
    // Arrange
    const ref: React.RefObject<HTMLElement> = { current: null };

    // Act & Assert - should not throw
    expect(() => focus(ref)).not.toThrow();
  });

  test('should handle null element gracefully', () => {
    // Act & Assert - should not throw
    expect(() => focus(null as unknown as HTMLElement)).not.toThrow();
  });

  test('should handle undefined element gracefully', () => {
    // Act & Assert - should not throw
    expect(() => focus(undefined as unknown as HTMLElement)).not.toThrow();
  });

  test('should handle elements without focus method', () => {
    // Create a legitimate HTMLElement but mock its focus property to undefined
    const element = document.createElement('div');
    Object.defineProperty(element, 'focus', { value: undefined });

    // Act & Assert - should not throw
    expect(() => focus(element)).not.toThrow();
  });

  test('should work with custom HTMLElements', () => {
    // Arrange - create a real HTMLElement
    const customElement = document.createElement('custom-element');
    const focusSpy = jest.spyOn(customElement, 'focus');
    const ref: React.RefObject<HTMLElement> = { current: customElement };

    Object.defineProperty(document, 'activeElement', {
      value: document.body,
      writable: true,
    });

    // Act
    focus(ref);

    // Assert
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });
});
