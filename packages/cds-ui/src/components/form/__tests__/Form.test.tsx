import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Form from '../Form';

// Mock the Loader component
jest.mock('../../loader', () => ({
  Loader: ({ withOverlay, ...props }: any) => <div automation-id="loader" data-with-overlay={withOverlay} {...props} />,
}));

// Mock the CSS modules
jest.mock('./styles/Form.module.css', () => ({
  form: 'form',
  formContent: 'formContent',
  formHeader: 'formHeader',
  helperText: 'helperText',
  innerContent: 'innerContent',
}));

describe('Form Component', () => {
  const defaultProps = {
    children: <input automation-id="test-input" />,
  };

  beforeAll(() => {
    // Mock HTMLFormElement.prototype.requestSubmit for JSDOM
    HTMLFormElement.prototype.requestSubmit = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Form {...defaultProps} />);
      expect(screen.getByTestId('test-input')).toBeInTheDocument();
    });

    it('applies the correct displayName', () => {
      expect(Form.displayName).toBe('Form');
    });

    it('renders children correctly', () => {
      render(<Form {...defaultProps} />);
      expect(screen.getByTestId('test-input')).toBeInTheDocument();
    });

    it('renders multiple children correctly', () => {
      const multipleChildren = [
        <input key="1" automation-id="input-1" />,
        <button key="2" automation-id="button-1">
          Submit
        </button>,
      ];

      render(<Form children={multipleChildren} />);
      expect(screen.getByTestId('input-1')).toBeInTheDocument();
      expect(screen.getByTestId('button-1')).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('applies custom id to form element', () => {
      render(<Form {...defaultProps} id="custom-form-id" />);
      const formElement = screen.getByTestId('test-input').closest('form');
      expect(formElement).toHaveAttribute('id', 'custom-form-id');
    });

    it('applies custom className correctly', () => {
      render(<Form {...defaultProps} className="custom-class" />);
      const formElement = screen.getByTestId('test-input').closest('form');
      const formWrapper = formElement?.parentElement;
      expect(formWrapper).toHaveClass('form', 'custom-class');
    });

    it('applies default automation-id when not provided', () => {
      render(<Form {...defaultProps} />);
      const formElement = screen.getByTestId('test-input').closest('form');
      expect(formElement).toHaveAttribute('automation-id', 'form');
    });

    it('applies custom automation-id when provided', () => {
      render(<Form {...defaultProps} automation-id="custom-automation-id" />);
      const formElement = screen.getByTestId('test-input').closest('form');
      expect(formElement).toHaveAttribute('automation-id', 'custom-automation-id');
    });

    it('spreads additional props to form element', () => {
      render(<Form {...defaultProps} data-custom="custom-value" />);
      const formElement = screen.getByTestId('test-input').closest('form');
      expect(formElement).toHaveAttribute('data-custom', 'custom-value');
    });
  });

  describe('Header Section', () => {
    it('renders header when provided', () => {
      render(<Form {...defaultProps} header="Test Form Header" />);
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Test Form Header');
    });

    it('does not render header when not provided', () => {
      render(<Form {...defaultProps} />);
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    it('renders helper text when provided', () => {
      render(<Form {...defaultProps} helperText="This is helper text" />);
      expect(screen.getByText('This is helper text')).toBeInTheDocument();
      expect(screen.getByText('This is helper text')).toHaveClass('helperText');
    });

    it('renders helper text as ReactNode', () => {
      const helperNode = <span automation-id="helper-node">Complex helper text</span>;
      render(<Form {...defaultProps} helperText={helperNode} />);
      expect(screen.getByTestId('helper-node')).toBeInTheDocument();
    });

    it('does not render helper text when not provided', () => {
      render(<Form {...defaultProps} />);
      expect(screen.queryByText(/helper/i)).not.toBeInTheDocument();
    });
  });

  describe('Footer Section', () => {
    it('renders footer when provided', () => {
      const footer = <div automation-id="form-footer">Footer content</div>;
      render(<Form {...defaultProps} footer={footer} />);
      expect(screen.getByTestId('form-footer')).toBeInTheDocument();
    });

    it('does not render footer when not provided', () => {
      render(<Form {...defaultProps} />);
      expect(screen.queryByTestId('form-footer')).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('renders loader when isLoading is true', () => {
      render(<Form {...defaultProps} isLoading={true} />);
      const loader = screen.getByTestId('loader');
      expect(loader).toBeInTheDocument();
      expect(loader).toHaveAttribute('data-with-overlay', 'true');
    });

    it('does not render loader when isLoading is false', () => {
      render(<Form {...defaultProps} isLoading={false} />);
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    it('does not render loader when isLoading is not provided', () => {
      render(<Form {...defaultProps} />);
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
  });

  describe('Event Handling', () => {
    it('calls onSubmit when form is submitted', () => {
      const mockOnSubmit = jest.fn();
      mockOnSubmit.mockImplementation((e) => e.preventDefault());

      render(
        <Form {...defaultProps} onSubmit={mockOnSubmit}>
          <button type="submit">Submit</button>
        </Form>,
      );

      fireEvent.click(screen.getByText('Submit'));
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.any(Object));
    });

    it('calls onReset when form is reset', () => {
      const mockOnReset = jest.fn();
      mockOnReset.mockImplementation((e) => e.preventDefault());

      render(
        <Form {...defaultProps} onReset={mockOnReset}>
          <button type="reset">Reset</button>
        </Form>,
      );

      fireEvent.click(screen.getByText('Reset'));
      expect(mockOnReset).toHaveBeenCalledTimes(1);
      expect(mockOnReset).toHaveBeenCalledWith(expect.any(Object));
    });

    it('handles submit event without onSubmit prop', () => {
      render(
        <Form {...defaultProps}>
          <button type="submit">Submit</button>
        </Form>,
      );

      // Should not throw an error
      expect(() => fireEvent.click(screen.getByText('Submit'))).not.toThrow();
    });

    it('handles reset event without onReset prop', () => {
      render(
        <Form {...defaultProps}>
          <button type="reset">Reset</button>
        </Form>,
      );

      // Should not throw an error
      expect(() => fireEvent.click(screen.getByText('Reset'))).not.toThrow();
    });
  });

  describe('CSS Classes', () => {
    it('applies correct CSS classes to wrapper div', () => {
      render(<Form {...defaultProps} />);
      const formElement = screen.getByTestId('test-input').closest('form');
      const wrapper = formElement?.parentElement;
      expect(wrapper).toHaveClass('form');
    });

    it('applies correct CSS classes to form element', () => {
      render(<Form {...defaultProps} />);
      const formElement = screen.getByTestId('test-input').closest('form');
      expect(formElement).toHaveClass('formContent');
    });

    it('applies custom className to both wrapper and form', () => {
      render(<Form {...defaultProps} className="custom-styles" />);
      const formElement = screen.getByTestId('test-input').closest('form');
      const wrapper = formElement?.parentElement;

      expect(wrapper).toHaveClass('form', 'custom-styles');
      expect(formElement).toHaveClass('formContent', 'custom-styles');
    });

    it('applies correct CSS class to form header', () => {
      render(<Form {...defaultProps} header="Test Header" />);
      const headerDiv = screen.getByRole('heading').parentElement;
      expect(headerDiv).toHaveClass('formHeader');
    });

    it('applies correct CSS class to inner content', () => {
      render(<Form {...defaultProps} />);
      const innerContent = screen.getByTestId('test-input').parentElement;
      expect(innerContent).toHaveClass('innerContent');
    });
  });

  describe('Accessibility', () => {
    it('has proper form element', () => {
      render(<Form {...defaultProps} />);
      const formElement = screen.getByTestId('test-input').closest('form');
      expect(formElement).toBeInTheDocument();
    });

    it('header uses proper heading level', () => {
      render(<Form {...defaultProps} header="Accessible Header" />);
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('maintains form structure for screen readers', () => {
      render(
        <Form {...defaultProps} header="Form Title" helperText="Form instructions">
          <label htmlFor="test">Test Field</label>
          <input id="test" />
        </Form>,
      );

      expect(screen.getByRole('heading')).toBeInTheDocument();
      expect(screen.getByText('Form instructions')).toBeInTheDocument();
      expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined children gracefully', () => {
      render(<Form children={undefined} />);
      const formElement = document.querySelector('form');
      expect(formElement).toBeInTheDocument();
    });

    it('handles null children gracefully', () => {
      render(<Form children={null} />);
      const formElement = document.querySelector('form');
      expect(formElement).toBeInTheDocument();
    });

    it('handles empty string header', () => {
      render(<Form {...defaultProps} header="" />);
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    it('handles empty string helperText', () => {
      render(<Form {...defaultProps} helperText="" />);
      const helperTextDiv = document.querySelector('.helperText');
      expect(helperTextDiv).not.toBeInTheDocument();
    });

    it('handles complex nested children', () => {
      const complexChildren = (
        <div>
          <fieldset>
            <legend>Personal Info</legend>
            <input automation-id="name" placeholder="Name" />
            <input automation-id="email" placeholder="Email" />
          </fieldset>
        </div>
      );

      render(<Form children={complexChildren} />);
      expect(screen.getByTestId('name')).toBeInTheDocument();
      expect(screen.getByTestId('email')).toBeInTheDocument();
      expect(screen.getByText('Personal Info')).toBeInTheDocument();
    });
  });
});
