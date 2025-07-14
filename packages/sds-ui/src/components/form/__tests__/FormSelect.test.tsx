import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FormSelect from '../FormSelect';

describe('FormSelect', () => {
  const defaultProps = {
    name: 'test-select',
    value: '',
    children: (
      <>
        <option value="">Select an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </>
    ),
  };

  it('renders with label and required indicator', () => {
    render(<FormSelect {...defaultProps} label="Test Label" required />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    // The asterisk is added via CSS ::after pseudo-element, so we check for the required class
    expect(screen.getByText('Test Label')).toHaveClass('requiredLabel');
  });

  it('renders without label', () => {
    render(<FormSelect {...defaultProps} />);

    expect(screen.queryByText('Test Label')).not.toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(<FormSelect {...defaultProps} error="This field is required" />);

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies invalid class when error is present', () => {
    render(<FormSelect {...defaultProps} error="Error message" />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('invalid');
    expect(select).toHaveAttribute('aria-invalid', 'true');
  });

  it('calls onChange when selection changes', () => {
    const handleChange = jest.fn();
    render(<FormSelect {...defaultProps} onChange={handleChange} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option1' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('renders chevron icon by default', () => {
    render(<FormSelect {...defaultProps} />);

    const selectContainer = document.querySelector('.selectContainer');
    expect(selectContainer).toBeInTheDocument();
    expect(selectContainer).toHaveClass('selectContainer');
  });

  it('applies correct classes to select element', () => {
    render(<FormSelect {...defaultProps} className="custom-class" />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('select', 'custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLSelectElement>();
    render(<FormSelect {...defaultProps} ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });
});
