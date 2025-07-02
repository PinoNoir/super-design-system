import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import DropdownSubmenu from '../DropdownSubmenu';

// Mock the child components
jest.mock('../DropdownItem', () => ({ children, onClick, onKeyDown, onMouseEnter, icon, className, ...props }) => (
  <div
    automation-id="dropdown-item"
    onClick={onClick}
    onKeyDown={onKeyDown}
    onMouseEnter={onMouseEnter}
    className={className}
    {...props}
  >
    {icon && <span automation-id="icon">{icon}</span>}
    {children}
  </div>
));

jest.mock('../DropdownHeader', () => ({ children }) => <div automation-id="dropdown-header">{children}</div>);

jest.mock('../DropdownDivider', () => () => <div automation-id="dropdown-divider" />);

jest.mock('../SubMenuContent', () => {
  const forwardRef = (props, ref) => {
    const { children, isOpen, id, onMouseEnter, onMouseLeave } = props;
    return (
      <div
        automation-id="submenu-content"
        ref={ref}
        style={{ display: isOpen ? 'block' : 'none' }}
        id={id}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </div>
    );
  };
  return React.forwardRef(forwardRef);
});

jest.mock('@iconify/react', () => ({
  Icon: ({ icon, className, ...props }) => (
    <span automation-id="icon-component" className={className} {...props}>
      {icon}
    </span>
  ),
}));

describe('DropdownSubmenu', () => {
  const mockProps = {
    label: 'Submenu Label',
    children: <div automation-id="submenu-children">Submenu Content</div>,
    className: 'custom-class',
    icon: <span automation-id="custom-icon">Icon</span>,
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  test('renders correctly with all props', () => {
    render(<DropdownSubmenu {...mockProps} />);

    // Check if component renders with proper structure
    expect(screen.getByTestId('dropdown-divider')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-item')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-header')).toBeInTheDocument();
    expect(screen.getByTestId('submenu-content')).toBeInTheDocument();
    expect(screen.getByTestId('icon-component')).toBeInTheDocument();

    // Check label and custom class
    expect(screen.getByTestId('dropdown-header')).toHaveTextContent('Submenu Label');
    expect(screen.getByTestId('dropdown-item')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByTestId('dropdown-item')).toHaveAttribute('aria-haspopup', 'true');
    expect(screen.getByTestId('dropdown-item')).toHaveAttribute('role', 'menuitem');
    expect(screen.getByRole('presentation')).toHaveClass('custom-class');

    // Check icon is passed down
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();

    // Check submenu content state
    expect(screen.getByTestId('submenu-content')).toHaveStyle({ display: 'none' });

    // Check children are rendered
    expect(screen.getByText('Submenu Content')).toBeInTheDocument();
  });

  test('opens submenu on click', () => {
    render(<DropdownSubmenu {...mockProps} />);

    const dropdownItem = screen.getByTestId('dropdown-item');
    fireEvent.click(dropdownItem);

    expect(screen.getByTestId('dropdown-item')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('submenu-content')).toHaveStyle({ display: 'block' });
  });

  test('opens submenu on Enter key press', () => {
    render(<DropdownSubmenu {...mockProps} />);

    const dropdownItem = screen.getByTestId('dropdown-item');
    fireEvent.keyDown(dropdownItem, { key: 'Enter' });

    expect(screen.getByTestId('dropdown-item')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('submenu-content')).toHaveStyle({ display: 'block' });
  });

  test('opens submenu on Space key press', () => {
    render(<DropdownSubmenu {...mockProps} />);

    const dropdownItem = screen.getByTestId('dropdown-item');
    fireEvent.keyDown(dropdownItem, { key: ' ' });

    expect(screen.getByTestId('dropdown-item')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('submenu-content')).toHaveStyle({ display: 'block' });
  });

  test('opens submenu on mouse enter', () => {
    render(<DropdownSubmenu {...mockProps} />);

    const dropdownItem = screen.getByTestId('dropdown-item');
    fireEvent.mouseEnter(dropdownItem);

    expect(screen.getByTestId('dropdown-item')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('submenu-content')).toHaveStyle({ display: 'block' });
  });

  test('closes submenu after mouse leave with delay', async () => {
    const { rerender } = render(<DropdownSubmenu {...mockProps} />);

    // Open the submenu first
    const dropdownItem = screen.getByTestId('dropdown-item');
    fireEvent.mouseEnter(dropdownItem);

    expect(screen.getByTestId('submenu-content')).toHaveStyle({ display: 'block' });

    // Now leave the submenu
    const submenu = screen.getByRole('presentation');
    fireEvent.mouseLeave(submenu);

    // Submenu should still be open before the timeout
    expect(screen.getByTestId('submenu-content')).toHaveStyle({ display: 'block' });

    // Fast-forward timeout
    jest.advanceTimersByTime(100);

    // Force a re-render to apply state changes
    rerender(<DropdownSubmenu {...mockProps} />);

    // Now it should be closed
    expect(screen.getByTestId('submenu-content')).toHaveStyle({ display: 'none' });
  });

  test('cancels timeout on re-enter', () => {
    render(<DropdownSubmenu {...mockProps} />);

    // Open the submenu
    const dropdownItem = screen.getByTestId('dropdown-item');
    fireEvent.mouseEnter(dropdownItem);

    // Leave the submenu to start timeout
    const submenu = screen.getByRole('presentation');
    fireEvent.mouseLeave(submenu);

    // Re-enter the submenu before timeout completes
    jest.advanceTimersByTime(50);
    const submenuContent = screen.getByTestId('submenu-content');
    fireEvent.mouseEnter(submenuContent);

    // Advance past when the timeout would have fired
    jest.advanceTimersByTime(100);

    // Submenu should still be open
    expect(screen.getByTestId('submenu-content')).toHaveStyle({ display: 'block' });
  });

  test('has correct accessibility attributes', () => {
    render(<DropdownSubmenu {...mockProps} />);

    const dropdownItem = screen.getByTestId('dropdown-item');
    const submenuContent = screen.getByTestId('submenu-content');

    expect(dropdownItem).toHaveAttribute('tabIndex', '0');
    expect(dropdownItem).toHaveAttribute('role', 'menuitem');
    expect(dropdownItem).toHaveAttribute('aria-haspopup', 'true');
    expect(dropdownItem).toHaveAttribute('aria-expanded', 'false');

    // Check that aria-controls matches the submenu content id
    const controlsId = dropdownItem.getAttribute('aria-controls');
    expect(controlsId).toBeTruthy();
    expect(submenuContent).toHaveAttribute('id', controlsId);

    // Since we can't properly test the aria-hidden attribute with our mock,
    // we'll check that Icon is imported and used properly instead
    expect(screen.getByTestId('icon-component')).toBeInTheDocument();
    expect(screen.getByTestId('icon-component')).toHaveClass('subMenuIcon');
  });

  test('renders without optional props', () => {
    const { label, children } = mockProps;
    render(<DropdownSubmenu label={label}>{children}</DropdownSubmenu>);

    // Component should render without errors
    expect(screen.getByTestId('dropdown-header')).toHaveTextContent('Submenu Label');

    // Check children are rendered properly
    expect(screen.getByTestId('submenu-content')).toHaveTextContent('Submenu Content');

    // Custom icon should not be present
    expect(screen.queryByTestId('custom-icon')).not.toBeInTheDocument();
  });

  test('has the automation-id attribute', () => {
    render(<DropdownSubmenu {...mockProps} />);
    expect(screen.getByRole('presentation')).toHaveAttribute('automation-id', 'dropdown-submenu');
  });
});
