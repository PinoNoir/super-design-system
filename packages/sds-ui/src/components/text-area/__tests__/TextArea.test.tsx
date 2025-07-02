import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TextArea from '../TextArea';

// Mock the styles
jest.mock('./styles/TextArea.module.css', () => ({
  formItem: 'formItem',
  textAreaWrapper: 'textAreaWrapper',
  label: 'label',
  visuallyHidden: 'visuallyHidden',
  requiredLabel: 'requiredLabel',
  formHelperText: 'formHelperText',
  formHelperTextDisabled: 'formHelperTextDisabled',
  formCounterText: 'formCounterText',
  formCounterTextDisabled: 'formCounterTextDisabled',
  textAreaLabelWrapper: 'textAreaLabelWrapper',
  textAreaFieldOuterWrapper: 'textAreaFieldOuterWrapper',
  textAreaFieldWrapper: 'textAreaFieldWrapper',
  textArea: 'textArea',
  contentWrapper: 'contentWrapper',
}));

describe('TextArea Component', () => {
  it('renders with default props', () => {
    render(<TextArea maxCharacters={100} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<TextArea maxCharacters={100} label="Test Label" id="test" />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('hides label when hideLabel is true', () => {
    render(<TextArea maxCharacters={100} label="Test Label" id="test" hideLabel />);
    expect(screen.getByText('Test Label')).toHaveClass('visuallyHidden');
  });

  it('adds required class to label when required is true', () => {
    render(<TextArea maxCharacters={100} label="Test Label" id="test" required />);
    expect(screen.getByText('Test Label')).toHaveClass('requiredLabel');
  });

  it('renders helper text when provided', () => {
    render(<TextArea maxCharacters={100} helperText="Helper text" />);
    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });

  it('renders character counter when textCounter is true', () => {
    render(<TextArea maxCharacters={100} textCounter />);
    expect(screen.getByText('0/100 characters')).toBeInTheDocument();
  });

  it('updates character counter when typing', () => {
    render(<TextArea maxCharacters={100} textCounter />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    expect(screen.getByText('5/100 characters')).toBeInTheDocument();
  });

  it('disables textarea when disabled prop is true', () => {
    render(<TextArea maxCharacters={100} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('applies invalid attribute when invalid prop is true', () => {
    render(<TextArea maxCharacters={100} invalid />);
    expect(screen.getByRole('textbox').parentElement).toHaveAttribute('data-invalid', 'true');
  });

  it('applies custom className', () => {
    render(<TextArea maxCharacters={100} className="custom-class" />);
    expect(screen.getByRole('textbox').closest('div.formItem')).toHaveClass('custom-class');
  });

  it('forwards ref to textarea element', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<TextArea maxCharacters={100} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('passes additional props to textarea element', () => {
    render(<TextArea maxCharacters={100} placeholder="Enter text here" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'Enter text here');
  });
});
