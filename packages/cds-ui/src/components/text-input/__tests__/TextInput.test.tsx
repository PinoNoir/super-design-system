import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextInput from '../TextInput';

// Mock the SVG sprite import
jest.mock('../../../public/bcc-icon-sprite.svg', () => 'mocked-sprite.svg');

describe('TextInput', () => {
  it('renders with label and helper text', () => {
    render(<TextInput automation-id="test-input" id="test-input" label="Test Label" helperText="Helper text" />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });

  it('handles value changes', async () => {
    const handleChange = jest.fn();
    render(<TextInput automation-id="test-input" id="test-input" label="Test Input" onChange={handleChange} />);

    const input = screen.getByLabelText('Test Input');
    await act(async () => {
      await userEvent.type(input, 'Hello');
    });

    expect(handleChange).toHaveBeenCalledTimes(5);
    expect(input).toHaveValue('Hello');
  });

  it('displays character counter when enableCounter is true', () => {
    render(<TextInput automation-id="test-input" id="test-input" label="Test Input" enableCounter maxCount={10} />);
    expect(screen.getByText('0/10')).toBeInTheDocument();
  });

  it('updates character counter on input', async () => {
    render(<TextInput automation-id="test-input" id="test-input" label="Test Input" enableCounter maxCount={10} />);

    const input = screen.getByLabelText('Test Input');
    await act(async () => {
      await userEvent.type(input, 'Hello');
    });

    expect(screen.getByText('5/10')).toBeInTheDocument();
  });

  it('shows warning when exceeding maxCount', async () => {
    render(<TextInput automation-id="test-input" id="test-input" label="Test Input" enableCounter maxCount={5} />);

    const input = screen.getByLabelText('Test Input');
    await act(async () => {
      await userEvent.type(input, 'Hello World');
    });

    expect(screen.getByText('5/5')).toHaveClass('label textInputLabelCounter');
  });

  it('disables input when disabled prop is true', () => {
    render(<TextInput automation-id="test-input" id="test-input" label="Test Input" disabled />);
    expect(screen.getByLabelText('Test Input')).toBeDisabled();
  });

  it('displays invalid state and text', () => {
    render(
      <TextInput automation-id="test-input" id="test-input" label="Test Input" invalid invalidText="Error message" />,
    );
    expect(screen.getByLabelText('Test Input')).toHaveClass('textInput textInputInvalid');
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('displays warning state and text', () => {
    render(<TextInput automation-id="test-input" id="test-input" label="Test Input" warn warnText="Warning message" />);
    expect(screen.getByLabelText('Test Input')).toHaveClass('textInput textInputWarning');
    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('handles readonly state', () => {
    render(
      <TextInput automation-id="test-input" id="test-input" label="Test Input" readOnly value="Read only value" />,
    );
    expect(screen.getByLabelText('Test Input')).toHaveAttribute('readonly');
    expect(screen.getByLabelText('Test Input')).toHaveValue('Read only value');
  });

  it('handles required attribute', () => {
    render(<TextInput automation-id="test-input" id="test-input" label="Test Input" required />);
    const input = screen.getByLabelText('Test Input');
    expect(input).toBeRequired();

    const label = screen.getByText('Test Input');
    expect(label).toHaveAttribute('data-required', 'true');
  });

  it('handles different input types', () => {
    render(<TextInput automation-id="test-input" id="test-input" label="Test Input" type="number" />);
    expect(screen.getByLabelText('Test Input')).toHaveAttribute('type', 'number');
  });

  it('handles placeholder text', () => {
    render(<TextInput automation-id="test-input" id="test-input" label="Test Input" placeholder="Enter text here" />);
    expect(screen.getByLabelText('Test Input')).toHaveAttribute('placeholder', 'Enter text here');
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    render(<TextInput automation-id="test-input" id="test-input" label="Test Input" onClick={handleClick} />);

    const input = screen.getByLabelText('Test Input');
    await act(async () => {
      await userEvent.click(input);
    });

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
