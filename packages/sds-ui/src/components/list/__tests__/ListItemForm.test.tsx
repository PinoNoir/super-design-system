import { render, screen, fireEvent, createEvent } from '@testing-library/react';

import ListItemForm from '../ListItemForm'; // Adjust the import path as needed

// Mock the Button component
jest.mock('../../button', () => ({
  Button: ({ children, onClick, size, variant, type, ...props }) => {
    const automationId = props['automation-id'];
    return (
      <button onClick={onClick} automation-id={automationId} type={type}>
        {children}
      </button>
    );
  },
}));

// Mock the CSS module
jest.mock('./styles/List.module.css', () => ({
  listItemForm: 'mockListItemForm',
  listItemFormButtons: 'mockListItemFormButtons',
}));

describe('ListItemForm Component', () => {
  // Define a sample item for testing
  const testItem = { id: '123', name: 'Test Item', description: 'Test Description' };

  // Define a basic renderInputs function
  interface Errors {
    name?: string;
    description?: string;
    [key: string]: string | undefined;
  }

  const renderInputs = (item, handleChange, errors: Errors = {}) => (
    <div automation-id="inputs-container">
      <label htmlFor="name">Name:</label>
      <input
        id="name"
        value={item.name}
        onChange={(e) => handleChange('name', e.target.value)}
        automation-id="name-input"
      />
      {errors.name && <span automation-id="name-error">{errors.name}</span>}

      <label htmlFor="description">Description:</label>
      <input
        id="description"
        value={item.description}
        onChange={(e) => handleChange('description', e.target.value)}
        automation-id="description-input"
      />
      {errors.description && <span automation-id="description-error">{errors.description}</span>}
    </div>
  );

  // Test 1: Basic rendering
  test('renders the form with inputs and buttons correctly', () => {
    const onSave = jest.fn();
    const onCancel = jest.fn();

    render(<ListItemForm item={testItem} onSave={onSave} onCancel={onCancel} renderInputs={renderInputs} />);

    // Check if the form exists with correct class
    const form = screen.getByTestId('inputs-container').closest('form');
    expect(form).toHaveClass('mockListItemForm');

    // Check if inputs exist and have correct values
    expect(screen.getByTestId('name-input')).toHaveValue('Test Item');
    expect(screen.getByTestId('description-input')).toHaveValue('Test Description');

    // Check if buttons exist with correct labels
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();

    // Reset button should not be visible initially (as no changes were made)
    expect(screen.queryByText('Reset')).not.toBeInTheDocument();
  });

  // Test 2: Custom button labels
  test('applies custom button labels', () => {
    const onSave = jest.fn();
    const onCancel = jest.fn();

    render(
      <ListItemForm
        item={testItem}
        onSave={onSave}
        onCancel={onCancel}
        renderInputs={renderInputs}
        saveLabel="Custom Save"
        cancelLabel="Custom Cancel"
      />,
    );

    expect(screen.getByText('Custom Save')).toBeInTheDocument();
    expect(screen.getByText('Custom Cancel')).toBeInTheDocument();
  });

  // Test 3: Input changes and state updates
  test('updates internal state when inputs change', () => {
    const onSave = jest.fn();
    const onCancel = jest.fn();

    render(<ListItemForm item={testItem} onSave={onSave} onCancel={onCancel} renderInputs={renderInputs} />);

    // Change the name input
    const nameInput = screen.getByTestId('name-input');
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

    // After changes, the Reset button should appear
    expect(screen.getByText('Reset')).toBeInTheDocument();

    // Check if the input value was updated
    expect(nameInput).toHaveValue('Updated Name');
  });

  // Test 4: Save functionality
  test('calls onSave with the updated item when Save is clicked', () => {
    const onSave = jest.fn();
    const onCancel = jest.fn();

    render(<ListItemForm item={testItem} onSave={onSave} onCancel={onCancel} renderInputs={renderInputs} />);

    // Change the inputs
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Updated Name' } });
    fireEvent.change(screen.getByTestId('description-input'), { target: { value: 'Updated Description' } });

    // Click the Save button
    fireEvent.click(screen.getByText('Save'));

    // Check if onSave was called with the updated item
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith({
      id: '123',
      name: 'Updated Name',
      description: 'Updated Description',
    });
  });

  // Test 5: Cancel functionality
  test('calls onCancel when Cancel is clicked', () => {
    const onSave = jest.fn();
    const onCancel = jest.fn();

    render(<ListItemForm item={testItem} onSave={onSave} onCancel={onCancel} renderInputs={renderInputs} />);

    // Click the Cancel button
    fireEvent.click(screen.getByText('Cancel'));

    // Check if onCancel was called
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onSave).not.toHaveBeenCalled();
  });

  // Test 6: Reset functionality
  test('resets form to initial values when Reset is clicked', () => {
    const onSave = jest.fn();
    const onCancel = jest.fn();

    render(<ListItemForm item={testItem} onSave={onSave} onCancel={onCancel} renderInputs={renderInputs} />);

    // Change the inputs
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Updated Name' } });
    fireEvent.change(screen.getByTestId('description-input'), { target: { value: 'Updated Description' } });

    // Verify the Reset button appears and click it
    const resetButton = screen.getByText('Reset');
    expect(resetButton).toBeInTheDocument();
    fireEvent.click(resetButton);

    // Check if form was reset to initial values
    expect(screen.getByTestId('name-input')).toHaveValue('Test Item');
    expect(screen.getByTestId('description-input')).toHaveValue('Test Description');

    // Reset button should disappear after reset
    expect(screen.queryByText('Reset')).not.toBeInTheDocument();
  });

  // Test 7: Validation
  test('shows validation errors and prevents saving when validation fails', () => {
    const onSave = jest.fn();
    const onCancel = jest.fn();

    // Define a validation function
    const validate = (item): Errors => {
      const errors: Errors = {};
      if (!item.name) {
        errors.name = 'Name is required';
      }
      if (!item.description) {
        errors.description = 'Description is required';
      }
      return errors;
    };

    render(
      <ListItemForm
        item={testItem}
        onSave={onSave}
        onCancel={onCancel}
        renderInputs={renderInputs}
        validate={validate}
      />,
    );

    // Clear the name input to trigger validation error
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: '' } });

    // Click the Save button
    fireEvent.click(screen.getByText('Save'));

    // Check if validation error is shown
    expect(screen.getByTestId('name-error')).toHaveTextContent('Name is required');

    // Check that onSave was NOT called
    expect(onSave).not.toHaveBeenCalled();
  });

  // Test 8: Clearing errors on input change
  test('clears validation errors when input changes', () => {
    const onSave = jest.fn();
    const onCancel = jest.fn();

    // Define a validation function
    const validate = (item): Errors => {
      const errors: Errors = {};
      if (!item.name) {
        errors.name = 'Name is required';
      }
      return errors;
    };

    render(
      <ListItemForm
        item={testItem}
        onSave={onSave}
        onCancel={onCancel}
        renderInputs={renderInputs}
        validate={validate}
      />,
    );

    // Clear the name input to trigger validation error
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: '' } });

    // Click the Save button to trigger validation
    fireEvent.click(screen.getByText('Save'));

    // Check if validation error is shown
    expect(screen.getByTestId('name-error')).toHaveTextContent('Name is required');

    // Now enter a value to clear the error
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'New Name' } });

    // Check that the error is no longer shown
    expect(screen.queryByTestId('name-error')).not.toBeInTheDocument();
  });

  // Test 9: Form resets when item prop changes
  test('resets the form when item prop changes', () => {
    const onSave = jest.fn();
    const onCancel = jest.fn();

    const { rerender } = render(
      <ListItemForm item={testItem} onSave={onSave} onCancel={onCancel} renderInputs={renderInputs} />,
    );

    // Change the inputs
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Modified Name' } });

    // Verify input was changed and Reset button appears
    expect(screen.getByTestId('name-input')).toHaveValue('Modified Name');
    expect(screen.getByText('Reset')).toBeInTheDocument();

    // Rerender with a new item
    const newItem = { id: '456', name: 'New Item', description: 'New Description' };
    rerender(<ListItemForm item={newItem} onSave={onSave} onCancel={onCancel} renderInputs={renderInputs} />);

    // Check if form was reset to match the new item
    expect(screen.getByTestId('name-input')).toHaveValue('New Item');
    expect(screen.getByTestId('description-input')).toHaveValue('New Description');

    // Reset button should not be visible
    expect(screen.queryByText('Reset')).not.toBeInTheDocument();
  });

  // Test 10: Form submission
  test('prevents default form submission and calls handleSave', () => {
    const onSave = jest.fn();
    const onCancel = jest.fn();

    render(<ListItemForm item={testItem} onSave={onSave} onCancel={onCancel} renderInputs={renderInputs} />);

    // Get the form
    const form = screen.getByTestId('inputs-container').closest('form');

    // Using a direct event to ensure preventDefault is captured correctly
    const submitEvent = createEvent.submit(form);
    submitEvent.preventDefault = jest.fn();

    // Trigger the submit event
    fireEvent(form, submitEvent);

    // Check that preventDefault was called and onSave was called
    expect(submitEvent.preventDefault).toHaveBeenCalled();
    expect(onSave).toHaveBeenCalledWith(testItem);
  });

  // Test 11: Automation ID
  test('applies automation-id to the form', () => {
    const onSave = jest.fn();
    const onCancel = jest.fn();

    const props = { 'automation-id': 'custom-form-id' };

    render(<ListItemForm item={testItem} onSave={onSave} onCancel={onCancel} renderInputs={renderInputs} {...props} />);

    const form = screen.getByTestId('inputs-container').closest('form');
    expect(form).toHaveAttribute('automation-id', 'custom-form-id');
  });

  // Test 12: Default automation-id
  test('uses default automation-id when not provided', () => {
    const onSave = jest.fn();
    const onCancel = jest.fn();

    render(<ListItemForm item={testItem} onSave={onSave} onCancel={onCancel} renderInputs={renderInputs} />);

    const form = screen.getByTestId('inputs-container').closest('form');
    expect(form).toHaveAttribute('automation-id', 'list-item-form');
  });
});
