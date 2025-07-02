import { render, screen, fireEvent } from '@testing-library/react';
import PromptInput from '../PromptInput';

describe('PromptInput', () => {
  const setup = (props = {}) => {
    const defaultProps = {
      value: '',
      onChange: jest.fn(),
      ...props,
    };
    render(<PromptInput {...defaultProps} />);
    return defaultProps;
  };

  it('renders with default props', () => {
    setup();
    const textarea = screen.getByLabelText('Prompt input');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('placeholder', 'Ask me anything...');
  });

  it('renders with custom placeholder and aria-label', () => {
    setup({ placeholder: 'Type here...', ariaLabel: 'Custom label' });
    const textarea = screen.getByLabelText('Custom label');
    expect(textarea).toHaveAttribute('placeholder', 'Type here...');
  });

  it('calls onChange when typing', () => {
    const onChange = jest.fn();
    setup({ onChange });
    const textarea = screen.getByLabelText('Prompt input');
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    expect(onChange).toHaveBeenCalledWith('Hello');
  });

  it('calls onSubmit when Enter is pressed without Shift', () => {
    const onSubmit = jest.fn();
    setup({ onSubmit });
    const textarea = screen.getByLabelText('Prompt input');
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });
    expect(onSubmit).toHaveBeenCalled();
  });

  it('does not call onSubmit when Shift+Enter is pressed', () => {
    const onSubmit = jest.fn();
    setup({ onSubmit });
    const textarea = screen.getByLabelText('Prompt input');
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('renders leftSlot, rightSlot, bottomSlot, and iconSlot', () => {
    setup({
      leftSlot: <div automation-id="left-slot">Left</div>,
      rightSlot: <div automation-id="right-slot">Right</div>,
      bottomSlot: <div automation-id="bottom-slot">Bottom</div>,
      iconSlot: <div automation-id="icon-slot">Icon</div>,
    });

    expect(screen.getByTestId('left-slot')).toBeInTheDocument();
    expect(screen.getByTestId('right-slot')).toBeInTheDocument();
    expect(screen.getByTestId('bottom-slot')).toBeInTheDocument();
    expect(screen.getByTestId('icon-slot')).toBeInTheDocument();
  });
});
