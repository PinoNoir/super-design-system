import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Popover from '../Popover';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {
    // intentionally left blank for mock
  }
  unobserve() {
    // intentionally left blank for mock
  }
  disconnect() {
    // intentionally left blank for mock
  }
};

// Mock the Icon component
jest.mock('@iconify/react', () => ({
  Icon: () => <div automation-id="mocked-icon" />,
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('Popover', () => {
  const defaultProps = {
    description: 'Test description',
    children: <button>Trigger</button>,
  };

  // Setup and cleanup for each test
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runAllTimers();
    });
    jest.useRealTimers();
  });

  it('opens the popover when trigger is clicked', async () => {
    const user = userEvent.setup({ delay: null });

    await act(async () => {
      render(<Popover {...defaultProps} />);
    });

    const trigger = screen.getByRole('button', { name: 'Trigger' });

    await act(async () => {
      await user.click(trigger);
    });

    const description = screen.getByText('Test description');
    expect(description).toBeInTheDocument();
  });

  it('closes the popover when close button is clicked', async () => {
    const user = userEvent.setup({ delay: null });

    await act(async () => {
      render(<Popover {...defaultProps} />);
    });

    const trigger = screen.getByRole('button', { name: 'Trigger' });

    await act(async () => {
      await user.click(trigger);
    });

    const closeButton = screen.getByLabelText('Close');

    await act(async () => {
      await user.click(closeButton);
      // Allow any animations to complete
      jest.runAllTimers();
    });

    expect(screen.queryByText('Test description')).not.toBeInTheDocument();
  });

  it('calls onOpenChange when popover is opened and closed', async () => {
    const user = userEvent.setup({ delay: null });
    const onOpenChange = jest.fn();

    await act(async () => {
      render(<Popover {...defaultProps} onOpenChange={onOpenChange} />);
    });

    const trigger = screen.getByRole('button', { name: 'Trigger' });

    await act(async () => {
      await user.click(trigger);
    });

    expect(onOpenChange).toHaveBeenCalledWith(true);

    const closeButton = screen.getByLabelText('Close');

    await act(async () => {
      await user.click(closeButton);
      // Allow any animations to complete
      jest.runAllTimers();
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
