import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import WorkflowModal from '../WorkflowModal';

// Mock framer-motion to handle animations in tests
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }) => <>{children}</>,
    motion: {
      div: ({ children, ...props }) => <div {...props}>{children}</div>,
    },
  };
});

// Mock createPortal to make it testable
jest.mock('react-dom', () => {
  const original = jest.requireActual('react-dom');
  return {
    ...original,
    createPortal: (node) => node,
  };
});

// Mock the Icon component
jest.mock('@iconify/react', () => ({
  Icon: (props) => <svg automation-id="mock-icon" {...props} />,
}));

describe('WorkflowModal', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    title: 'Test Modal',
    children: <div>Modal Content</div>,
    isOpen: true,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Create a div to serve as the document.body for portal rendering
    const portalRoot = document.createElement('div');
    portalRoot.setAttribute('id', 'portal-root');
    document.body.appendChild(portalRoot);
  });

  afterEach(() => {
    // Cleanup after each test
    const portalRoot = document.getElementById('portal-root');
    if (portalRoot) {
      document.body.removeChild(portalRoot);
    }
  });

  test('renders correctly when open', () => {
    render(<WorkflowModal {...defaultProps} />);

    // Check if modal components are rendered
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(<WorkflowModal {...defaultProps} isOpen={false} />);

    // Modal should not be in the document
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<WorkflowModal {...defaultProps} />);

    // Click the close button
    const closeButton = screen.getByLabelText('Close panel');
    await user.click(closeButton);

    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when Escape key is pressed', async () => {
    render(<WorkflowModal {...defaultProps} />);

    // Simulate pressing the Escape key
    await waitFor(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('does not call onClose for other keys', () => {
    render(<WorkflowModal {...defaultProps} />);

    // Simulate pressing other keys
    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: 'Tab' });

    // onClose should not have been called
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('renders with a custom id when provided', () => {
    render(<WorkflowModal {...defaultProps} id="custom-modal-id" />);

    // Check if the modal has the custom id
    const modalElement = screen.getByText('Modal Content').parentElement.parentElement;
    expect(modalElement).toHaveAttribute('id', 'custom-modal-id');
  });

  test('renders footer when provided', () => {
    render(<WorkflowModal {...defaultProps} footer={<button>Submit</button>} />);

    // Check if footer is rendered
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  test('removes event listener on unmount', async () => {
    const { unmount } = render(<WorkflowModal {...defaultProps} />);

    // Spy on document.removeEventListener
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

    // Unmount the component
    unmount();

    // Check if the event listener was removed
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    // Clean up the spy
    removeEventListenerSpy.mockRestore();
  });

  test('handles animation states correctly', () => {
    render(<WorkflowModal {...defaultProps} />);

    // Check if wrapper div has the correct class
    const wrapperDiv = screen.getByText('Modal Content').parentElement.parentElement.parentElement;
    expect(wrapperDiv).toHaveClass('wrapper');

    // Check if flyout panel has the correct class
    const flyoutPanel = screen.getByText('Modal Content').parentElement.parentElement;
    expect(flyoutPanel).toHaveClass('flyoutPanel');
  });
});
