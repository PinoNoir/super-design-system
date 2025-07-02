import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccordionContext from '../AccordionContext';
import AccordionProvider from '../AccordionProvider';
import useAccordionContext from '../useAccordionContext';

// Test component that uses the accordion context
function TestComponent({ id = 'test-item' }: Readonly<{ id?: string }>) {
  const { openItemId, setOpenItemId, disabled } = useAccordionContext();

  return (
    <div>
      <div automation-id="open-item-id">{openItemId || 'none'}</div>
      <div automation-id="disabled">{disabled.toString()}</div>
      <button
        automation-id="toggle-button"
        onClick={() => setOpenItemId(openItemId === id ? null : id)}
        disabled={disabled}
      >
        Toggle
      </button>
    </div>
  );
}

// Test component for error case
function OutsideComponent() {
  // This will throw an error because it's not inside an AccordionProvider
  const { openItemId } = useAccordionContext();
  return <div>{openItemId}</div>;
}

describe('AccordionContext', () => {
  test('provides the expected context values', () => {
    render(
      <AccordionProvider disabled={false}>
        <TestComponent />
      </AccordionProvider>,
    );

    // Initial state
    expect(screen.getByTestId('open-item-id')).toHaveTextContent('none');
    expect(screen.getByTestId('disabled')).toHaveTextContent('false');
  });

  test('updates openItemId when setOpenItemId is called', async () => {
    const user = userEvent.setup();

    render(
      <AccordionProvider disabled={false}>
        <TestComponent id="test-1" />
      </AccordionProvider>,
    );

    // Initial state
    expect(screen.getByTestId('open-item-id')).toHaveTextContent('none');

    // Toggle open
    await user.click(screen.getByTestId('toggle-button'));
    expect(screen.getByTestId('open-item-id')).toHaveTextContent('test-1');

    // Toggle closed
    await user.click(screen.getByTestId('toggle-button'));
    expect(screen.getByTestId('open-item-id')).toHaveTextContent('none');
  });

  test('passes the disabled prop correctly', () => {
    render(
      <AccordionProvider disabled={true}>
        <TestComponent />
      </AccordionProvider>,
    );

    expect(screen.getByTestId('disabled')).toHaveTextContent('true');
    expect(screen.getByTestId('toggle-button')).toBeDisabled();
  });

  test('throws error when useAccordionContext is used outside provider', () => {
    // Silence the error output for this test
    const originalConsoleError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<OutsideComponent />);
    }).toThrow('useAccordion must be used within a AccordionProvider');

    // Restore console.error
    console.error = originalConsoleError;
  });

  test('multiple accordion items can interact with the same context', async () => {
    const user = userEvent.setup();

    render(
      <AccordionProvider disabled={false}>
        <div>
          <TestComponent id="item-1" />
          <TestComponent id="item-2" />
        </div>
      </AccordionProvider>,
    );

    const buttons = screen.getAllByTestId('toggle-button');

    // Open first item
    await user.click(buttons[0]);
    // Both components should show item-1 is open
    screen.getAllByTestId('open-item-id').forEach((element) => {
      expect(element).toHaveTextContent('item-1');
    });

    // Open second item (should close first)
    await user.click(buttons[1]);
    // Both components should show item-2 is open
    screen.getAllByTestId('open-item-id').forEach((element) => {
      expect(element).toHaveTextContent('item-2');
    });
  });

  test('context can be consumed directly using useContext', () => {
    // Create a component that consumes the context directly
    const DirectConsumer = () => {
      const contextValue = React.useContext(AccordionContext);
      return <div automation-id="context-value">{contextValue ? 'context exists' : 'no context'}</div>;
    };

    render(
      <AccordionProvider disabled={false}>
        <DirectConsumer />
      </AccordionProvider>,
    );

    expect(screen.getByTestId('context-value')).toHaveTextContent('context exists');
  });
});
