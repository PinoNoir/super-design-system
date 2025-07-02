import { render, screen } from '@testing-library/react';
import StatusMessageDisplay from '../StatusMessageDisplay';
import useFileContext from '../useFileContext';
import { StatusMessageType } from '../../../global-types/file-status'; // Adjust the import path as needed

// Mock the useFileContext hook
jest.mock('../useFileContext.tsx', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the StatusMessage component
jest.mock('../StatusMessage', () => {
  return function MockStatusMessage({ type, message, icon, onDismiss }: any) {
    return (
      <div automation-id="status-message">
        <span>Type: {type}</span>
        <span>Message: {message}</span>
        <span>Icon: {icon}</span>
        <button onClick={onDismiss}>Dismiss</button>
      </div>
    );
  };
});

describe('StatusMessageDisplay', () => {
  const mockClearStatusMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when statusMessage is null', () => {
    (useFileContext as jest.Mock).mockReturnValue({
      statusMessage: null,
      clearStatusMessage: mockClearStatusMessage,
    });

    render(<StatusMessageDisplay />);
    expect(screen.queryByTestId('status-message')).not.toBeInTheDocument();
  });

  it('renders StatusMessage when statusMessage is provided', () => {
    const mockStatusMessage: StatusMessageType = {
      type: 'success',
      message: 'Test message',
      icon: 'check-circle',
    };

    (useFileContext as jest.Mock).mockReturnValue({
      statusMessage: mockStatusMessage,
      clearStatusMessage: mockClearStatusMessage,
    });

    render(<StatusMessageDisplay />);

    expect(screen.getByTestId('status-message')).toBeInTheDocument();
    expect(screen.getByText('Type: success')).toBeInTheDocument();
    expect(screen.getByText('Message: Test message')).toBeInTheDocument();
    expect(screen.getByText('Icon: check-circle')).toBeInTheDocument();
  });

  it('passes clearStatusMessage as onDismiss prop to StatusMessage', () => {
    const mockStatusMessage: StatusMessageType = {
      type: 'error',
      message: 'Error message',
      icon: 'alert-circle',
    };

    (useFileContext as jest.Mock).mockReturnValue({
      statusMessage: mockStatusMessage,
      clearStatusMessage: mockClearStatusMessage,
    });

    render(<StatusMessageDisplay />);

    const dismissButton = screen.getByText('Dismiss');
    dismissButton.click();

    expect(mockClearStatusMessage).toHaveBeenCalledTimes(1);
  });
});
