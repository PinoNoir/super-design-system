import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SplitButton from '../SplitButton';

// Mock the Icon component
jest.mock('@iconify/react', () => ({
  Icon: () => <div automation-id="mocked-icon" />,
}));

jest.mock('../../dropdown', () => ({
  Dropdown: ({ children }) => <div automation-id="dropdown">{children}</div>,
  DropdownMenu: ({ children }) => (
    <div role="menu" automation-id="dropdown-menu">
      {children}
    </div>
  ),
  DropdownItem: ({ children, onClick }) => (
    <div role="menuitem" automation-id="dropdown-item" onClick={onClick}>
      {children}
    </div>
  ),
  DropdownTrigger: ({ children }) => <div automation-id="dropdown-button-trigger">{children}</div>,
}));

describe('SplitButton', () => {
  const mockDropdownItems = [
    { label: 'Item 1', onClick: jest.fn() },
    { label: 'Item 2', onClick: jest.fn(), icon: <span>Icon</span> },
  ];

  const defaultProps = {
    dropdownItems: mockDropdownItems,
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<SplitButton variant="primary" {...defaultProps} />);
    expect(screen.queryByTestId('dropdown-button-trigger')).toBeInTheDocument();
    expect(screen.queryByTestId('mocked-icon')).toBeInTheDocument();
  });

  it('calls onClick when main button is clicked', () => {
    render(<SplitButton variant="primary" {...defaultProps} />);
    fireEvent.click(screen.queryByTestId('main-button'));
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('opens dropdown menu when trigger is clicked', async () => {
    render(<SplitButton variant="primary" {...defaultProps} />);

    // Find the dropdown trigger
    const trigger = screen.queryByTestId('dropdown-button-trigger');

    await act(async () => {
      userEvent.click(trigger);
    });

    await act(async () => {
      await waitFor(() => {
        const menu = screen.getByRole('menu');
        expect(menu).toBeInTheDocument();
      });
    });
  });

  it('calls appropriate onClick when dropdown item is selected', async () => {
    render(<SplitButton variant="primary" {...defaultProps} />);

    const trigger = screen.queryByTestId('dropdown-button-trigger');

    // Open the dropdown
    await act(async () => {
      await userEvent.click(trigger);
    });

    // Wait for the menu to appear
    const menu = screen.queryByTestId('dropdown-menu');
    await waitFor(() => {
      expect(menu).toBeInTheDocument();
    });

    const menuItems = screen.getAllByTestId('dropdown-item');
    expect(menuItems.length).toBeGreaterThan(0);

    const item1 = menuItems[0];
    await act(async () => {
      await userEvent.click(item1);
    });

    await waitFor(() => {
      expect(mockDropdownItems[0].onClick).toHaveBeenCalledTimes(1);
    });
  });

  it('renders icons in dropdown items when provided', async () => {
    render(<SplitButton variant="primary" {...defaultProps} />);

    const trigger = screen.queryByTestId('dropdown-button-trigger');

    await act(async () => {
      await userEvent.click(trigger);
    });

    await act(async () => {
      await waitFor(() => {
        const menuItems = screen.getAllByTestId('dropdown-item');
        const item2 = menuItems.find((item) => item.textContent?.includes('Item 2'));
        expect(item2).toBeInTheDocument();
        expect(item2?.querySelector('span')).toBeInTheDocument();
      });
    });
  });

  it('disables trigger when triggerDisabled prop is true', () => {
    render(<SplitButton variant="primary" {...defaultProps} triggerDisabled />);

    // Find the dropdown trigger container
    const triggerContainer = screen.queryByTestId('dropdown-button-trigger');

    // Find the button inside the trigger container
    const triggerButton = triggerContainer.querySelector('button');

    expect(triggerButton).toBeInTheDocument();
    expect(triggerButton).toBeDisabled();
  });
});
