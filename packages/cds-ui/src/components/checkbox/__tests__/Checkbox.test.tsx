import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkbox from '../Checkbox';

describe('Checkbox Component', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    test('renders with a label', () => {
      render(<Checkbox label="Test Checkbox" />);
      expect(screen.getByLabelText('Test Checkbox')).toBeInTheDocument();
    });

    test('renders with a complex label (React node)', () => {
      render(<Checkbox label={<span automation-id="complex-label">Complex Label</span>} />);
      expect(screen.getByTestId('complex-label')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    test('renders with a hidden label', () => {
      render(<Checkbox label="Hidden Label" hideLabel />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(screen.getByText('Hidden Label')).toHaveClass('visuallyHidden');
    });

    test('renders with correct automation-id', () => {
      render(<Checkbox label="Test" automation-id="test-checkbox" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('automation-id', 'test-checkbox');
    });

    test('uses default automation-id when not provided', () => {
      render(<Checkbox label="Test" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('automation-id', 'checkbox');
    });

    test('assigns a unique ID when not provided', () => {
      render(<Checkbox label="Test Checkbox" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox.id).toMatch(/checkbox-/);
    });

    test('uses provided ID when available', () => {
      render(<Checkbox label="Test Checkbox" id="custom-id" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox.id).toBe('custom-id');
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    test('associates label with input using htmlFor', () => {
      render(<Checkbox label="Test Checkbox" />);
      const checkbox = screen.getByRole('checkbox');
      const label = screen.getByText('Test Checkbox');
      expect(label).toHaveAttribute('for', checkbox.id);
    });

    test('sets aria-label when provided', () => {
      render(<Checkbox label="Display Label" ariaLabel="Screen Reader Label" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-label', 'Screen Reader Label');
    });

    test('sets aria-labelledby when provided', () => {
      render(<Checkbox label="Test" ariaLabelledBy="external-label" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-labelledby', 'external-label');
    });

    test('uses label text as aria-label when string label provided without ariaLabel', () => {
      render(<Checkbox label="Test Label" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-label', 'Test Label');
    });

    test('adds required attribute when required prop is true', () => {
      render(<Checkbox label="Required Field" required />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeRequired();
    });

    test('adds data-required attribute to label when required', () => {
      render(<Checkbox label="Required Field" required />);
      const label = screen.getByText('Required Field');
      expect(label).toHaveAttribute('data-required', 'true');
    });
  });

  // State and behavior tests
  describe('State and Behavior', () => {
    test('is unchecked by default', () => {
      render(<Checkbox label="Test" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    test('is checked when defaultChecked is true', () => {
      render(<Checkbox label="Test" defaultChecked />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    test('can be controlled - checked', () => {
      render(<Checkbox label="Test" checked={true} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    test('can be controlled - unchecked', () => {
      render(<Checkbox label="Test" checked={false} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    test('toggles state when clicked (uncontrolled)', async () => {
      render(<Checkbox label="Test" />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).not.toBeChecked();
      await userEvent.click(checkbox);
      expect(checkbox).toBeChecked();
      await userEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    test('calls onChange handler when state changes', async () => {
      const handleChange = jest.fn();
      render(<Checkbox label="Test" onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      await userEvent.click(checkbox);
      expect(handleChange).toHaveBeenCalledTimes(1);

      // Event should include the new checked state
      expect(handleChange.mock.calls[0][0].target.checked).toBe(true);
    });

    test('does not update internal state when controlled', async () => {
      const handleChange = jest.fn();
      render(<Checkbox label="Test" checked={false} onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      await userEvent.click(checkbox);

      // Should still be unchecked because it's controlled
      expect(checkbox).not.toBeChecked();
      // But the onChange should have been called
      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });

  // Disabled state tests
  describe('Disabled State', () => {
    test('is disabled when disabled prop is true', () => {
      render(<Checkbox label="Disabled Checkbox" disabled />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });

    test('adds disabled class when disabled', () => {
      render(<Checkbox label="Disabled Checkbox" disabled />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('disabled');
    });

    test('does not call onChange when clicked while disabled', async () => {
      const handleChange = jest.fn();
      render(<Checkbox label="Disabled Checkbox" disabled onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      await userEvent.click(checkbox);
      expect(handleChange).not.toHaveBeenCalled();
    });

    test('sets data-checked attribute on wrapper', () => {
      render(<Checkbox label="Test" checked={true} />);
      const wrapper = screen.getByText('Test').closest('div');
      expect(wrapper).toHaveAttribute('data-checked', 'true');
    });
  });

  // Indeterminate state tests
  describe('Indeterminate State', () => {
    test('sets indeterminate property when indeterminate prop is true', () => {
      render(<Checkbox label="Indeterminate Checkbox" indeterminate />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(true);
    });

    test('adds indeterminate class when indeterminate', () => {
      render(<Checkbox label="Indeterminate Checkbox" indeterminate />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('indeterminate');
    });

    test('sets data-indeterminate attribute on wrapper', () => {
      render(<Checkbox label="Test" indeterminate={true} />);
      const wrapper = screen.getByText('Test').closest('div');
      expect(wrapper).toHaveAttribute('data-indeterminate', 'true');
    });

    test('updates indeterminate state when prop changes', () => {
      const { rerender } = render(<Checkbox label="Indeterminate Checkbox" indeterminate={false} />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

      expect(checkbox.indeterminate).toBe(false);

      rerender(<Checkbox label="Indeterminate Checkbox" indeterminate={true} />);
      expect(checkbox.indeterminate).toBe(true);
    });

    test('can be both checked and indeterminate', () => {
      render(<Checkbox label="Test" checked indeterminate />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

      expect(checkbox).toBeChecked();
      expect(checkbox.indeterminate).toBe(true);
    });

    test('can be both disabled and indeterminate', () => {
      render(<Checkbox label="Test" disabled indeterminate />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

      expect(checkbox).toBeDisabled();
      expect(checkbox.indeterminate).toBe(true);
    });
  });

  // Specific combinations of states
  describe('State Combinations', () => {
    test('handles checked + disabled state', () => {
      render(<Checkbox label="Test" checked disabled />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toBeChecked();
      expect(checkbox).toBeDisabled();
    });

    test('handles indeterminate + disabled state', () => {
      render(<Checkbox label="Test" indeterminate disabled />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

      expect(checkbox.indeterminate).toBe(true);
      expect(checkbox).toBeDisabled();
    });

    test('handles all states together: checked + indeterminate + disabled', () => {
      render(<Checkbox label="Test" checked indeterminate disabled />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

      expect(checkbox).toBeChecked();
      expect(checkbox.indeterminate).toBe(true);
      expect(checkbox).toBeDisabled();
    });
  });

  // Testing prop passing
  describe('Prop Passing', () => {
    test('passes additional props to input element', () => {
      render(<Checkbox label="Test" data-testprop="test-value" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('data-testprop', 'test-value');
    });

    test('correctly passes name to input element', () => {
      render(<Checkbox label="Test" name="test-name" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('name', 'test-name');
    });

    test('correctly passes value to input element', () => {
      render(<Checkbox label="Test" value="test-value" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('value', 'test-value');
    });

    test('correctly passes tabIndex to input element', () => {
      render(<Checkbox label="Test" tabIndex={2} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('tabindex', '2');
    });
  });

  // Keyboard interaction tests
  describe('Keyboard Interactions', () => {
    test('toggles with space key', async () => {
      const user = userEvent.setup();
      render(<Checkbox label="Test" />);
      const checkbox = screen.getByRole('checkbox');

      checkbox.focus();
      expect(checkbox).toHaveFocus();

      // Press space to check - this is natively supported by checkbox inputs
      await user.keyboard(' ');
      expect(checkbox).toBeChecked();

      // Press space again to uncheck
      await user.keyboard(' ');
      expect(checkbox).not.toBeChecked();
    });

    // Note: Enter key behavior for checkboxes depends on the browser
    // Native checkboxes typically respond to Space but not always to Enter
    // Skipping this test since the component relies on native browser behavior
    test.skip('toggles with enter key', async () => {
      const user = userEvent.setup();
      render(<Checkbox label="Test" />);
      const checkbox = screen.getByRole('checkbox');

      checkbox.focus();

      // Enter key test skipped - would need custom keyboard handling for this
      await user.keyboard('{Enter}');
      expect(checkbox).toBeChecked();
    });
  });

  // Ref forwarding tests
  describe('Ref Forwarding', () => {
    test('forwards ref to the input element', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Checkbox label="Test" ref={ref} />);

      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName).toBe('INPUT');
      expect(ref.current?.type).toBe('checkbox');
    });

    test('can access and manipulate the forwarded ref', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Checkbox label="Test" ref={ref} />);

      if (ref.current) {
        fireEvent.click(ref.current);
        expect(ref.current.checked).toBe(true);
      }
    });
  });
});
