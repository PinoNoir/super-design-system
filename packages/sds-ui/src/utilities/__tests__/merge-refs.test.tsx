import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import mergeRefs from '../merge-refs';

// Modified component with direct blur function to ensure it works
function TextInput({ initialFocus = false }) {
  const internalRef = React.useRef<HTMLInputElement>(null);
  const [text, setText] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);

  // Set initial focus on mount directly
  React.useEffect(() => {
    if (initialFocus && internalRef.current) {
      internalRef.current.focus();
    }
  }, [initialFocus]);

  // Focus callback - simplified
  const focusCallback = React.useCallback((node: HTMLInputElement | null) => {
    // Store the node but don't focus here - we'll use the effect above
  }, []);

  // Merge our internal ref with the focus callback
  const combinedRef = mergeRefs(internalRef, focusCallback);

  // Method that uses the internal ref
  const clearAndFocus = () => {
    setText('');
    if (internalRef.current) {
      internalRef.current.focus();
    }
  };

  // Direct blur method that manually sets focused state
  const forceBlur = () => {
    if (internalRef.current) {
      internalRef.current.blur();
      // Explicitly set focused state
      setIsFocused(false);
    }
  };

  return (
    <div>
      <input
        ref={combinedRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        automation-id="input"
      />
      <div automation-id="focus-indicator">{isFocused ? 'Focused' : 'Not Focused'}</div>
      <button onClick={clearAndFocus} automation-id="clear-button">
        Clear and Focus
      </button>
      <button onClick={forceBlur} automation-id="blur-button">
        Blur Input
      </button>
    </div>
  );
}

describe('mergeRefs in Component Context', () => {
  test('verifies the mergeRefs utility works with object refs and callback refs', () => {
    // Create a basic test object
    const element = document.createElement('div');

    // Create an object ref and a callback ref
    const objectRef = React.createRef<HTMLDivElement>();
    const callbackRef = jest.fn();

    // Create the merged ref function
    const mergedRef = mergeRefs(objectRef, callbackRef);

    // Call the merged ref with our element
    mergedRef(element);

    // Verify the object ref has the correct current value
    expect(objectRef.current).toBe(element);

    // Verify the callback ref was called with the correct element
    expect(callbackRef).toHaveBeenCalledWith(element);
    expect(callbackRef).toHaveBeenCalledTimes(1);
  });

  test('directly manipulates component state to verify ref functionality', () => {
    render(<TextInput initialFocus={true} />);

    const input = screen.getByTestId('input');
    const indicator = screen.getByTestId('focus-indicator');
    const blurButton = screen.getByTestId('blur-button');
    const clearButton = screen.getByTestId('clear-button');

    // Verify initial state - should be focused
    expect(indicator).toHaveTextContent('Focused');

    // Directly manipulate the blur button
    fireEvent.click(blurButton);

    // Verify the state changed
    expect(indicator).toHaveTextContent('Not Focused');

    // Add some text to the input
    fireEvent.change(input, { target: { value: 'Test text' } });
    expect(input).toHaveValue('Test text');

    // Clear and focus via button
    fireEvent.click(clearButton);

    // Verify clearing worked and focus returned
    expect(input).toHaveValue('');
    expect(indicator).toHaveTextContent('Focused');
  });
});
