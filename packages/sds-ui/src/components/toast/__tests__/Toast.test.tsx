import { render, screen, fireEvent, act } from '@testing-library/react';
import { Toast } from '../Toast';

describe('Toast Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders with correct content and variant', () => {
    render(
      <Toast
        open={true}
        variant="success"
        message="Test message"
        header="Custom Header"
        content="Additional content"
        onClose={mockOnClose}
      />,
    );

    expect(screen.getByText('Custom Header')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText('Additional content')).toBeInTheDocument();
    expect(screen.getByTestId('toast')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<Toast open={true} variant="alert" message="Test message" onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders hyperlink when url and hyperlinkText are provided', () => {
    render(
      <Toast
        open={true}
        variant="error"
        message="Test message"
        url="https://example.com"
        hyperlinkText="Learn More"
        onClose={mockOnClose}
      />,
    );

    const link = screen.getByText('Learn More');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('renders additional message when provided', () => {
    render(
      <Toast
        open={true}
        variant="alert"
        message="Primary message"
        additionalMessage="Additional message"
        additionalShow={true}
        additionalOnClose={jest.fn()}
        onClose={mockOnClose}
      />,
    );

    expect(screen.getByText('Primary message')).toBeInTheDocument();
    expect(screen.getByText('Additional message')).toBeInTheDocument();
  });

  it('auto-closes after specified duration', () => {
    render(<Toast open={true} variant="success" message="Test message" duration={3000} onClose={mockOnClose} />);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
