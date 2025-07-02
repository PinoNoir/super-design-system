import React from 'react';
import { render, screen } from '@testing-library/react';
import ValidationMessage from '../ValidationMessage';

// Mock the styles
jest.mock('../styles/ValidationMessage.module.css', () => ({
  validationMsg: 'validationMsg',
  formRequirementInvalid: 'formRequirementInvalid',
  formRequirementWarning: 'formRequirementWarning',
}));

// Mock the getDisplayErrorMessage utility
jest.mock('../../../utilities/get-display-error-message', () => ({
  getDisplayErrorMessage: (message) => {
    if (typeof message === 'string') return message;
    if (message?.message) return message.message;
    if (React.isValidElement(message)) return message;
    return 'Error message';
  },
}));

describe('ValidationMessage', () => {
  test('does not render when no validation props are provided', () => {
    const { container } = render(<ValidationMessage />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders error message when invalid and invalidText are provided', () => {
    const { container } = render(<ValidationMessage invalid invalidText="This field is required" />);

    // Check that the error message is rendered
    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeInTheDocument();

    // Find the error container div directly
    const errorContainer = container.querySelector('.formRequirementInvalid');
    expect(errorContainer).toBeInTheDocument();
    expect(errorContainer).toHaveTextContent('This field is required');
  });

  test('does not render when invalid is true but invalidText is not provided', () => {
    const { container } = render(<ValidationMessage invalid />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders warning message when warn and warnText are provided', () => {
    const { container } = render(<ValidationMessage warn warnText="This is a warning" />);

    // Check that the warning message is rendered
    const warningMessage = screen.getByText('This is a warning');
    expect(warningMessage).toBeInTheDocument();

    // Find the warning container div directly
    const warningContainer = container.querySelector('.formRequirementWarning');
    expect(warningContainer).toBeInTheDocument();
    expect(warningContainer).toHaveTextContent('This is a warning');
  });

  test('does not render when warn is true but warnText is not provided', () => {
    const { container } = render(<ValidationMessage warn />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders both error and warning messages when all flags are true', () => {
    const { container } = render(
      <ValidationMessage invalid invalidText="This field is required" warn warnText="This is a warning" />,
    );

    // Check that both messages are rendered
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByText('This is a warning')).toBeInTheDocument();

    // Find both container divs directly
    const errorContainer = container.querySelector('.formRequirementInvalid');
    const warningContainer = container.querySelector('.formRequirementWarning');

    expect(errorContainer).toBeInTheDocument();
    expect(warningContainer).toBeInTheDocument();
    expect(errorContainer).toHaveTextContent('This field is required');
    expect(warningContainer).toHaveTextContent('This is a warning');
  });

  test('does not render error message when readOnly is true', () => {
    const { container } = render(<ValidationMessage readOnly invalid invalidText="This field is required" />);

    expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
    expect(container.querySelector('.formRequirementInvalid')).not.toBeInTheDocument();
  });

  test('still renders warning message when readOnly is true', () => {
    const { container } = render(
      <ValidationMessage readOnly invalid invalidText="This field is required" warn warnText="This is a warning" />,
    );

    expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
    expect(screen.getByText('This is a warning')).toBeInTheDocument();
    expect(container.querySelector('.formRequirementInvalid')).not.toBeInTheDocument();
    expect(container.querySelector('.formRequirementWarning')).toBeInTheDocument();
  });

  test('handles FieldError objects for invalidText', () => {
    const fieldError = { type: 'required', message: 'This field is required' };
    const { container } = render(<ValidationMessage invalid invalidText={fieldError} />);

    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(container.querySelector('.formRequirementInvalid')).toBeInTheDocument();
  });

  test('handles FieldError objects for warnText', () => {
    const fieldError = { type: 'pattern', message: 'Invalid format' };
    const { container } = render(<ValidationMessage warn warnText={fieldError} />);

    expect(screen.getByText('Invalid format')).toBeInTheDocument();
    expect(container.querySelector('.formRequirementWarning')).toBeInTheDocument();
  });

  test('handles nested FieldErrors objects', () => {
    const fieldErrors = {
      name: { type: 'required', message: 'Name is required' },
    };
    render(<ValidationMessage invalid invalidText={fieldErrors} />);

    // Our mock getDisplayErrorMessage returns 'Error message' for complex objects
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  test('does not render when success is true but successText is not provided', () => {
    const { container } = render(<ValidationMessage success />);
    expect(container).toBeEmptyDOMElement();
  });

  test('handles React nodes as error messages', () => {
    render(<ValidationMessage invalid invalidText={<span automation-id="custom-error">Custom error</span>} />);

    expect(screen.getByTestId('custom-error')).toBeInTheDocument();
  });

  test('handles React nodes as warning messages', () => {
    render(<ValidationMessage warn warnText={<span automation-id="custom-warning">Custom warning</span>} />);

    expect(screen.getByTestId('custom-warning')).toBeInTheDocument();
  });

  test('sets the automation-id attribute correctly', () => {
    render(<ValidationMessage invalid invalidText="Error" />);
    const container = screen.getByRole('alert');
    expect(container).toHaveAttribute('automation-id', 'validation-message');
  });

  test('allows custom automation-id to be provided', () => {
    render(<ValidationMessage invalid invalidText="Error" automation-id="custom-validation" />);
    const container = screen.getByRole('alert');
    expect(container).toHaveAttribute('automation-id', 'custom-validation');
  });
});
