import { render, screen, fireEvent } from '@testing-library/react';
import RadioButtonGroup from '../RadioButtonGroup';
import RadioButton from '../RadioButton';

describe('RadioButtonGroup', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with legend text', () => {
    render(
      <RadioButtonGroup legendText="Test Legend" name="test-group">
        <RadioButton label="Option 1" value="1" />
        <RadioButton label="Option 2" value="2" />
      </RadioButtonGroup>,
    );

    expect(screen.getByText('Test Legend')).toBeInTheDocument();
  });

  it('renders all radio buttons', () => {
    render(
      <RadioButtonGroup name="test-group">
        <RadioButton label="Option 1" value="1" />
        <RadioButton label="Option 2" value="2" />
        <RadioButton label="Option 3" value="3" />
      </RadioButtonGroup>,
    );

    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('selects the default option', () => {
    render(
      <RadioButtonGroup name="test-group" defaultSelected="2">
        <RadioButton label="Option 1" value="1" />
        <RadioButton label="Option 2" value="2" />
        <RadioButton label="Option 3" value="3" />
      </RadioButtonGroup>,
    );

    expect(screen.getByLabelText('Option 2')).toBeChecked();
  });

  it('calls onChange when a radio button is selected', () => {
    render(
      <RadioButtonGroup name="test-group" onChange={mockOnChange}>
        <RadioButton label="Option 1" value="1" />
        <RadioButton label="Option 2" value="2" />
      </RadioButtonGroup>,
    );

    fireEvent.click(screen.getByLabelText('Option 2'));

    expect(mockOnChange).toHaveBeenCalledWith('2', 'test-group', expect.any(Object));
  });

  it('disables all radio buttons when group is disabled', () => {
    render(
      <RadioButtonGroup name="test-group" disabled>
        <RadioButton label="Option 1" value="1" />
        <RadioButton label="Option 2" value="2" />
      </RadioButtonGroup>,
    );

    screen.getAllByRole('radio').forEach((radio) => {
      expect(radio).toBeDisabled();
    });
  });

  it('displays helper text when provided', () => {
    render(
      <RadioButtonGroup name="test-group" helperText="This is helper text">
        <RadioButton label="Option 1" value="1" />
      </RadioButtonGroup>,
    );

    expect(screen.getByText('This is helper text')).toBeInTheDocument();
  });

  it('displays invalid text when invalid', () => {
    render(
      <RadioButtonGroup name="test-group" invalid invalidText="This is invalid">
        <RadioButton label="Option 1" value="1" />
      </RadioButtonGroup>,
    );

    expect(screen.getByText('This is invalid')).toBeInTheDocument();
  });

  it('updates selection when valueSelected prop changes', () => {
    const { rerender } = render(
      <RadioButtonGroup name="test-group" valueSelected="1">
        <RadioButton label="Option 1" value="1" />
        <RadioButton label="Option 2" value="2" />
      </RadioButtonGroup>,
    );

    expect(screen.getByLabelText('Option 1')).toBeChecked();

    rerender(
      <RadioButtonGroup name="test-group" valueSelected="2">
        <RadioButton label="Option 1" value="1" />
        <RadioButton label="Option 2" value="2" />
      </RadioButtonGroup>,
    );

    expect(screen.getByLabelText('Option 2')).toBeChecked();
  });

  it('does not allow changes when readOnly', () => {
    render(
      <RadioButtonGroup name="test-group" readOnly valueSelected="1" onChange={mockOnChange}>
        <RadioButton label="Option 1" value="1" />
        <RadioButton label="Option 2" value="2" />
      </RadioButtonGroup>,
    );

    fireEvent.click(screen.getByLabelText('Option 2'));

    expect(mockOnChange).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Option 1')).toBeChecked();
    expect(screen.getByLabelText('Option 2')).not.toBeChecked();
  });
});
