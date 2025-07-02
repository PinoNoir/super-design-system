import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '../Modal';

// Mock the Icon component
jest.mock('@iconify/react', () => ({
  Icon: () => <div data-testid="mock-icon" />,
}));

describe('Modal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  const defaultProps = {
    title: 'Test Modal',
    open: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Remove any lingering modal-open attribute from previous tests
    document.body.removeAttribute('data-modal-open');
  });

  it('renders the modal when open is true', () => {
    render(<Modal {...defaultProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render the modal when open is false', () => {
    render(<Modal {...defaultProps} open={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders the trigger element and no modal when open is false', () => {
    const trigger = <button>Open Modal</button>;
    render(<Modal {...defaultProps} open={false} trigger={trigger} />);

    expect(screen.getByText('Open Modal')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('sets data-modal-open attribute on body when modal is open', () => {
    render(<Modal {...defaultProps} />);

    expect(document.body.getAttribute('data-modal-open')).toBe('true');
  });

  it('calls onClose when the close button is clicked', async () => {
    render(<Modal {...defaultProps} />);

    const closeButton = screen.getByLabelText('Close modal');
    userEvent.click(closeButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onClose when clicking the overlay (if not disabled)', async () => {
    render(<Modal {...defaultProps} />);

    const overlay = screen.getByRole('presentation');
    userEvent.click(overlay);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('does not call onClose when clicking the overlay if disableCloseOnOverlayClick is true', async () => {
    render(<Modal {...defaultProps} disableCloseOnOverlayClick={true} />);

    const overlay = screen.getByRole('presentation');
    userEvent.click(overlay);

    await waitFor(() => {
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<Modal {...defaultProps} />);

    fireEvent.keyDown(screen.getByRole('presentation'), { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when Escape key is pressed if disableClose is true', () => {
    render(<Modal {...defaultProps} disableClose={true} />);

    fireEvent.keyDown(screen.getByRole('presentation'), { key: 'Escape' });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onSave when the save button is clicked', async () => {
    render(<Modal {...defaultProps} />);

    const saveButton = screen.getByText('Save');
    userEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });
  });

  it('renders custom button labels if provided', () => {
    render(<Modal {...defaultProps} saveButtonLabel="Custom Save" closeButtonLabel="Custom Cancel" />);

    expect(screen.getByText('Custom Save')).toBeInTheDocument();
    expect(screen.getByText('Custom Cancel')).toBeInTheDocument();
  });

  it('applies the correct width class based on the width prop', () => {
    const { rerender } = render(<Modal {...defaultProps} width="small" />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('small');

    rerender(<Modal {...defaultProps} width="medium" />);
    expect(dialog).toHaveClass('medium');

    rerender(<Modal {...defaultProps} width="large" />);
    expect(dialog).toHaveClass('large');
  });

  it('renders action buttons if provided', () => {
    const actionButtons = [
      { text: 'Action 1', variant: 'primary' as const, onClick: jest.fn() },
      { text: 'Action 2', variant: 'secondary' as const, onClick: jest.fn() },
    ];

    render(<Modal {...defaultProps} actionButtons={actionButtons} />);

    expect(screen.getByText('Action 1')).toBeInTheDocument();
    expect(screen.getByText('Action 2')).toBeInTheDocument();
  });

  it('disables the save button when disablePrimaryButton is true', () => {
    render(<Modal {...defaultProps} disablePrimaryButton={true} />);

    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeDisabled();
  });

  it('disables the close button when disableClose is true', () => {
    render(<Modal {...defaultProps} disableClose={true} />);

    const closeButton = screen.getByText('Cancel');
    expect(closeButton).toBeDisabled();
  });

  it('applies custom className to the modal', () => {
    render(<Modal {...defaultProps} className="custom-class" />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('custom-class');
  });

  it('renders custom footer if provided', () => {
    const customFooter = <div>Custom Footer</div>;
    render(<Modal {...defaultProps} footer={customFooter} />);

    expect(screen.getByText('Custom Footer')).toBeInTheDocument();
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  // Keyboard navigation tests
  it('handles Tab key navigation', async () => {
    render(<Modal {...defaultProps} />);

    // Focus should change when Tab is pressed
    fireEvent.keyDown(screen.getByRole('presentation'), { key: 'Tab' });

    // Wait for any focus changes to complete
    await waitFor(() => {
      // This assertion just checks that something happened, not the exact focus target
      expect(document.activeElement).not.toBe(document.body);
    });

    // Similarly for Shift+Tab
    fireEvent.keyDown(screen.getByRole('presentation'), { key: 'Tab', shiftKey: true });

    await waitFor(() => {
      expect(document.activeElement).not.toBe(document.body);
    });
  });

  it('sets initial focus to the provided ref when initialFocus is provided', async () => {
    // Create a component with a ref to test initialFocus
    const TestComponent = () => {
      const customRef = React.useRef(null);
      return (
        <Modal {...defaultProps} initialFocus={customRef}>
          <button ref={customRef}>Focus Me</button>
        </Modal>
      );
    };

    render(<TestComponent />);

    // Wait for the setTimeout in useEffect to complete
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByText('Focus Me'));
    });
  });
});
