import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StatusMessage, { StatusMessageProps } from '../StatusMessage';

// Mock the framer-motion module
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<object>) => <div {...props}>{children}</div>,
  },
}));

// Mock the Icon component
jest.mock('@iconify/react', () => ({
  Icon: ({ icon }: { icon: string }) => <span automation-id={`icon-${icon}`} />,
}));

describe('StatusMessage', () => {
  const defaultProps: StatusMessageProps = {
    type: 'success',
    message: 'Test message',
    icon: 'check-circle',
    onDismiss: jest.fn(),
  };

  it('renders correctly with success props', () => {
    render(<StatusMessage {...defaultProps} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByTestId('icon-mdi:check-circle')).toBeInTheDocument();
    expect(screen.getByLabelText('Dismiss message')).toBeInTheDocument();
  });

  it('renders correctly with error props', () => {
    render(<StatusMessage {...defaultProps} type="error" icon="alert-circle" />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByTestId('icon-mdi:alert-circle')).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', () => {
    render(<StatusMessage {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('Dismiss message'));
    expect(defaultProps.onDismiss).toHaveBeenCalledTimes(1);
  });

  it('has correct accessibility attributes', () => {
    render(<StatusMessage {...defaultProps} />);

    const statusElement = screen.getByRole('status');
    expect(statusElement).toHaveAttribute('aria-live', 'polite');
  });
});
