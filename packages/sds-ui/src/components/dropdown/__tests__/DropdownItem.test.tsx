import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import DropdownItem from '../DropdownItem';
import DropdownContext from '../DropdownContext';

// Mock dependencies
jest.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(
      (
        { children, ...props }: { children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>,
        ref: React.Ref<HTMLDivElement>,
      ) => (
        <div {...props} ref={ref}>
          {children}
        </div>
      ),
    ),
  },
}));

jest.mock('clsx', () => ({
  clsx: (...args) => args.filter(Boolean).join(' '),
}));

jest.mock('../../../utilities/use-id', () => ({
  useId: (prefix) => `${prefix}-mocked-id`,
}));

describe('DropdownItem', () => {
  const mockOnClick = jest.fn();
  const mockOnKeyDown = jest.fn();
  const mockOnMouseEnter = jest.fn();
  const mockOnMouseLeave = jest.fn();
  const mockSetIsOpen = jest.fn();

  const defaultProps = {
    children: 'Dropdown Item Text',
    onClick: mockOnClick,
    onKeyDown: mockOnKeyDown,
    onMouseEnter: mockOnMouseEnter,
    onMouseLeave: mockOnMouseLeave,
  };

  // Setup context wrapper
  const mockTriggerRef = { current: null } as React.RefObject<HTMLElement>;
  const DropdownContextWrapper = ({ children, setIsOpen = mockSetIsOpen, triggerRef = mockTriggerRef }) => {
    const contextValue = React.useMemo(() => ({ isOpen: true, setIsOpen, triggerRef }), [setIsOpen, triggerRef]);
    return <DropdownContext.Provider value={contextValue}>{children}</DropdownContext.Provider>;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with all props', () => {
    render(
      <DropdownContextWrapper>
        <DropdownItem
          {...defaultProps}
          id="custom-id"
          className="custom-class"
          icon={<span automation-id="custom-icon">Icon</span>}
          role="option"
          tabIndex={0}
        />
      </DropdownContextWrapper>,
    );

    const dropdownItem = screen.getByRole('option');

    // Check if component renders with text content
    expect(dropdownItem).toHaveTextContent('Dropdown Item Text');

    // Check if props are correctly applied
    expect(dropdownItem).toHaveClass('custom-class');
    expect(dropdownItem).toHaveAttribute('id', 'custom-id');
    expect(dropdownItem).toHaveAttribute('tabIndex', '0');
    expect(dropdownItem).toHaveAttribute('automation-id', 'dropdown-item');

    // Check if icon renders
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  test('renders with auto-generated ID when not provided', () => {
    render(
      <DropdownContextWrapper>
        <DropdownItem {...defaultProps} />
      </DropdownContextWrapper>,
    );

    const dropdownItem = screen.getByRole('menuitem');
    expect(dropdownItem).toHaveAttribute('id', 'dropdown-item-mocked-id');
  });

  test('throws error when used outside DropdownContext', () => {
    // Temporarily silence error output for this test
    const originalConsoleError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<DropdownItem {...defaultProps} />);
    }).toThrow('DropdownItem must be used within a Dropdown');

    // Restore console.error
    console.error = originalConsoleError;
  });

  test('calls onClick and closes dropdown when clicked', () => {
    render(
      <DropdownContextWrapper>
        <DropdownItem {...defaultProps} />
      </DropdownContextWrapper>,
    );

    const dropdownItem = screen.getByRole('menuitem');
    fireEvent.click(dropdownItem);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  test('should not close dropdown when clicked as submenu trigger', () => {
    render(
      <DropdownContextWrapper>
        <DropdownItem {...defaultProps} isSubmenuTrigger={true} />
      </DropdownContextWrapper>,
    );

    const dropdownItem = screen.getByRole('menuitem');
    fireEvent.click(dropdownItem);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockSetIsOpen).not.toHaveBeenCalled();
  });

  test('calls onKeyDown when provided and key is pressed', () => {
    render(
      <DropdownContextWrapper>
        <DropdownItem {...defaultProps} />
      </DropdownContextWrapper>,
    );

    const dropdownItem = screen.getByRole('menuitem');
    fireEvent.keyDown(dropdownItem, { key: 'Tab' });

    expect(mockOnKeyDown).toHaveBeenCalledTimes(1);
    expect(mockOnKeyDown).toHaveBeenCalledWith(
      expect.objectContaining({
        key: 'Tab',
      }),
    );
  });

  test('triggers click on Enter key when no onKeyDown provided', () => {
    render(
      <DropdownContextWrapper>
        <DropdownItem onClick={mockOnClick}>{defaultProps.children}</DropdownItem>
      </DropdownContextWrapper>,
    );

    const dropdownItem = screen.getByRole('menuitem');
    fireEvent.keyDown(dropdownItem, { key: 'Enter' });

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  test('triggers click on Space key when no onKeyDown provided', () => {
    render(
      <DropdownContextWrapper>
        <DropdownItem onClick={mockOnClick}>{defaultProps.children}</DropdownItem>
      </DropdownContextWrapper>,
    );

    const dropdownItem = screen.getByRole('menuitem');
    fireEvent.keyDown(dropdownItem, { key: ' ' });

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  test('does not trigger click when disabled', () => {
    render(
      <DropdownContextWrapper>
        <DropdownItem {...defaultProps} disabled />
      </DropdownContextWrapper>,
    );

    const dropdownItem = screen.getByRole('menuitem');
    fireEvent.click(dropdownItem);

    expect(mockOnClick).not.toHaveBeenCalled();
    expect(mockSetIsOpen).not.toHaveBeenCalled();
  });

  test('sets data-state attribute when disabled', () => {
    render(
      <DropdownContextWrapper>
        <DropdownItem {...defaultProps} disabled />
      </DropdownContextWrapper>,
    );

    const dropdownItem = screen.getByRole('menuitem');
    expect(dropdownItem).toHaveAttribute('data-state', 'disabled');
  });

  test('sets tabIndex to -1 when disabled', () => {
    render(
      <DropdownContextWrapper>
        <DropdownItem {...defaultProps} disabled />
      </DropdownContextWrapper>,
    );

    const dropdownItem = screen.getByRole('menuitem');
    expect(dropdownItem).toHaveAttribute('tabIndex', '-1');
  });

  test('calls onMouseEnter when mouse enters', () => {
    render(
      <DropdownContextWrapper>
        <DropdownItem {...defaultProps} />
      </DropdownContextWrapper>,
    );

    const dropdownItem = screen.getByRole('menuitem');
    fireEvent.mouseEnter(dropdownItem);

    expect(mockOnMouseEnter).toHaveBeenCalledTimes(1);
  });

  test('calls onMouseLeave when mouse leaves', () => {
    render(
      <DropdownContextWrapper>
        <DropdownItem {...defaultProps} />
      </DropdownContextWrapper>,
    );

    const dropdownItem = screen.getByRole('menuitem');
    fireEvent.mouseLeave(dropdownItem);

    expect(mockOnMouseLeave).toHaveBeenCalledTimes(1);
  });

  test('uses default menuitem role when not specified', () => {
    render(
      <DropdownContextWrapper>
        <DropdownItem {...defaultProps} />
      </DropdownContextWrapper>,
    );

    expect(screen.getByRole('menuitem')).toBeInTheDocument();
  });

  test('uses custom role when specified', () => {
    render(
      <DropdownContextWrapper>
        <DropdownItem {...defaultProps} role="option" />
      </DropdownContextWrapper>,
    );

    expect(screen.getByRole('option')).toBeInTheDocument();
  });

  test('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <DropdownContextWrapper>
        <DropdownItem {...defaultProps} ref={ref} />
      </DropdownContextWrapper>,
    );

    expect(ref.current).not.toBeNull();
    expect(ref.current).toHaveTextContent('Dropdown Item Text');
  });

  test('renders children correctly', () => {
    const complexChildren = (
      <div>
        <span automation-id="child-span">Complex Child</span>
        <button automation-id="child-button">Click Me</button>
      </div>
    );

    render(
      <DropdownContextWrapper>
        <DropdownItem onClick={mockOnClick}>{complexChildren}</DropdownItem>
      </DropdownContextWrapper>,
    );

    expect(screen.getByTestId('child-span')).toBeInTheDocument();
    expect(screen.getByTestId('child-button')).toBeInTheDocument();
  });
});
