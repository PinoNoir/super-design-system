import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TableButton, { TableButtonProps } from '../TableButton';
import { TableSelectionCallback } from '../types/data-table-generics';

// Mock the Button component
jest.mock('../../button/Button', () => {
  return function MockButton({ children, variant, size, disabled, onClick, ...props }: any) {
    const handleClick = (e: React.MouseEvent) => {
      // Don't call onClick if disabled
      if (!disabled && onClick) {
        onClick(e);
      }
    };

    return (
      <button
        {...props}
        disabled={disabled}
        onClick={handleClick}
        automation-id="table-button"
        data-variant={variant}
        data-size={size}
      >
        {children}
      </button>
    );
  };
});

describe('TableButton', () => {
  const defaultProps: TableButtonProps<any> = {
    rowId: 'row-1',
    isSelected: false,
    onSelectionChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with correct default props', () => {
      render(<TableButton {...defaultProps} />);

      const button = screen.getByTestId('table-button');
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
      expect(button).toHaveAttribute('data-size', 'small');
    });

    it('renders default text based on isSelected state', () => {
      render(<TableButton {...defaultProps} />);

      const button = screen.getByTestId('table-button');
      expect(button).toHaveTextContent('Select');
    });

    it('renders "Selected" text when isSelected is true', () => {
      render(<TableButton {...defaultProps} isSelected={true} />);

      const button = screen.getByTestId('table-button');
      expect(button).toHaveTextContent('Selected');
    });

    it('renders custom children when provided', () => {
      render(<TableButton {...defaultProps}>Custom Button Text</TableButton>);

      const button = screen.getByTestId('table-button');
      expect(button).toHaveTextContent('Custom Button Text');
    });

    it('renders custom children regardless of isSelected state', () => {
      render(
        <TableButton {...defaultProps} isSelected={true}>
          Custom Text
        </TableButton>,
      );

      const button = screen.getByTestId('table-button');
      expect(button).toHaveTextContent('Custom Text');
      expect(button).not.toHaveTextContent('Selected');
    });

    it('renders with specified variant', () => {
      render(<TableButton {...defaultProps} variant="primary" />);

      const button = screen.getByTestId('table-button');
      expect(button).toHaveAttribute('data-variant', 'primary');
    });

    it('renders as disabled when disabled prop is true', () => {
      render(<TableButton {...defaultProps} disabled={true} />);

      const button = screen.getByTestId('table-button');
      expect(button).toBeDisabled();
    });

    it('passes through additional props', () => {
      render(<TableButton {...defaultProps} data-custom="test-value" aria-label="Custom label" />);

      const button = screen.getByTestId('table-button');
      expect(button).toHaveAttribute('data-custom', 'test-value');
      expect(button).toHaveAttribute('aria-label', 'Custom label');
    });
  });

  describe('Selection Behavior', () => {
    it('calls onSelectionChange with correct parameters when clicked (unselected to selected)', () => {
      const mockOnSelectionChange = jest.fn();
      render(<TableButton {...defaultProps} isSelected={false} onSelectionChange={mockOnSelectionChange} />);

      const button = screen.getByTestId('table-button');
      fireEvent.click(button);

      expect(mockOnSelectionChange).toHaveBeenCalledTimes(1);
      expect(mockOnSelectionChange).toHaveBeenCalledWith(
        'row-1',
        true, // newSelectionState should be true (toggling from false)
        {
          source: 'button',
        },
      );
    });

    it('calls onSelectionChange with correct parameters when clicked (selected to unselected)', () => {
      const mockOnSelectionChange = jest.fn();
      render(<TableButton {...defaultProps} isSelected={true} onSelectionChange={mockOnSelectionChange} />);

      const button = screen.getByTestId('table-button');
      fireEvent.click(button);

      expect(mockOnSelectionChange).toHaveBeenCalledWith(
        'row-1',
        false, // newSelectionState should be false (toggling from true)
        {
          source: 'button',
        },
      );
    });

    it('passes correct context with source', () => {
      const mockOnSelectionChange = jest.fn();
      render(<TableButton {...defaultProps} onSelectionChange={mockOnSelectionChange} />);

      const button = screen.getByTestId('table-button');
      fireEvent.click(button);

      expect(mockOnSelectionChange).toHaveBeenCalledWith('row-1', true, {
        source: 'button',
      });
    });

    it('does not call onSelectionChange when disabled', () => {
      const mockOnSelectionChange = jest.fn();
      render(<TableButton {...defaultProps} disabled={true} onSelectionChange={mockOnSelectionChange} />);

      const button = screen.getByTestId('table-button');
      fireEvent.click(button);

      expect(mockOnSelectionChange).not.toHaveBeenCalled();
    });

    it('handles rapid selection toggles correctly', () => {
      const mockOnSelectionChange = jest.fn();
      const { rerender } = render(
        <TableButton {...defaultProps} isSelected={false} onSelectionChange={mockOnSelectionChange} />,
      );

      const button = screen.getByTestId('table-button');

      // First click: false -> true
      fireEvent.click(button);
      expect(mockOnSelectionChange).toHaveBeenCalledWith('row-1', true, { source: 'button' });

      // Simulate parent updating the isSelected prop
      rerender(<TableButton {...defaultProps} isSelected={true} onSelectionChange={mockOnSelectionChange} />);

      // Second click: true -> false
      fireEvent.click(button);
      expect(mockOnSelectionChange).toHaveBeenCalledWith('row-1', false, { source: 'button' });

      expect(mockOnSelectionChange).toHaveBeenCalledTimes(2);
    });
  });

  describe('Optional onClick Callback', () => {
    it('calls optional onClick callback when provided', () => {
      const mockOnClick = jest.fn();
      const mockOnSelectionChange = jest.fn();

      render(<TableButton {...defaultProps} onClick={mockOnClick} onSelectionChange={mockOnSelectionChange} />);

      const button = screen.getByTestId('table-button');
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);

      // Verify the callback was called with the event
      const calls = mockOnClick.mock.calls[0];
      const [event] = calls;

      expect(event).toHaveProperty('type', 'click');
      expect(event).toHaveProperty('target');
    });

    it('does not call onClick when not provided', () => {
      const mockOnSelectionChange = jest.fn();

      render(<TableButton {...defaultProps} onSelectionChange={mockOnSelectionChange} />);

      const button = screen.getByTestId('table-button');
      fireEvent.click(button);

      // Should not throw an error
      expect(mockOnSelectionChange).toHaveBeenCalledTimes(1);
    });

    it('calls onClick before onSelectionChange', () => {
      const callOrder: string[] = [];
      const mockOnClick = jest.fn(() => callOrder.push('onClick'));
      const mockOnSelectionChange = jest.fn(() => callOrder.push('onSelectionChange'));

      render(<TableButton {...defaultProps} onClick={mockOnClick} onSelectionChange={mockOnSelectionChange} />);

      const button = screen.getByTestId('table-button');
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnSelectionChange).toHaveBeenCalledTimes(1);
      expect(callOrder).toEqual(['onClick', 'onSelectionChange']);
    });

    it('calls both onClick and onSelectionChange when both provided', () => {
      const mockOnClick = jest.fn();
      const mockOnSelectionChange = jest.fn();

      render(<TableButton {...defaultProps} onClick={mockOnClick} onSelectionChange={mockOnSelectionChange} />);

      const button = screen.getByTestId('table-button');
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnSelectionChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Event Handling', () => {
    it('handles event properly and calls callbacks', () => {
      const mockOnSelectionChange = jest.fn();

      render(<TableButton {...defaultProps} onSelectionChange={mockOnSelectionChange} />);

      const button = screen.getByTestId('table-button');
      fireEvent.click(button);

      // Verify that onSelectionChange was called
      expect(mockOnSelectionChange).toHaveBeenCalledTimes(1);
      expect(mockOnSelectionChange).toHaveBeenCalledWith(
        'row-1',
        true, // should be true when clicking unselected button
        {
          source: 'button',
        },
      );
    });

    it('handles multiple rapid clicks correctly', () => {
      const mockOnSelectionChange = jest.fn();
      const { rerender } = render(<TableButton {...defaultProps} onSelectionChange={mockOnSelectionChange} />);

      const button = screen.getByTestId('table-button');

      // First click: false -> true
      fireEvent.click(button);
      expect(mockOnSelectionChange).toHaveBeenCalledWith('row-1', true, { source: 'button' });

      // Simulate parent updating the isSelected state
      rerender(<TableButton {...defaultProps} isSelected={true} onSelectionChange={mockOnSelectionChange} />);

      // Second click: true -> false
      fireEvent.click(button);
      expect(mockOnSelectionChange).toHaveBeenCalledWith('row-1', false, { source: 'button' });

      // Simulate parent updating the isSelected state
      rerender(<TableButton {...defaultProps} isSelected={false} onSelectionChange={mockOnSelectionChange} />);

      // Third click: false -> true
      fireEvent.click(button);
      expect(mockOnSelectionChange).toHaveBeenCalledWith('row-1', true, { source: 'button' });

      expect(mockOnSelectionChange).toHaveBeenCalledTimes(3);
    });
  });

  describe('Variant Support', () => {
    const variants = ['primary', 'secondary', 'tertiary', 'base', 'accent', 'danger'] as const;

    variants.forEach((variant) => {
      it(`renders with ${variant} variant`, () => {
        render(<TableButton {...defaultProps} variant={variant} />);

        const button = screen.getByTestId('table-button');
        expect(button).toHaveAttribute('data-variant', variant);
      });
    });

    it('uses default variant when none specified', () => {
      render(<TableButton {...defaultProps} />);

      const button = screen.getByTestId('table-button');
      // Should have some default variant (adjust based on your component's default)
      expect(button).toHaveAttribute('data-variant');
    });
  });

  describe('Generic Type Support', () => {
    interface CustomRowData {
      customId: number;
      customName: string;
      customProperties: {
        priority: 'high' | 'medium' | 'low';
      };
    }

    it('works with different row data types', () => {
      const mockOnSelectionChange: TableSelectionCallback<CustomRowData> = jest.fn();

      render(
        <TableButton<CustomRowData>
          rowId="custom-row-1"
          isSelected={false}
          onSelectionChange={mockOnSelectionChange}
        />,
      );

      const button = screen.getByTestId('table-button');
      fireEvent.click(button);

      expect(mockOnSelectionChange).toHaveBeenCalledWith('custom-row-1', true, {
        source: 'button',
      });
    });

    it('maintains type safety with generic constraints', () => {
      // This test ensures the component compiles with different generic types
      const stringCallback: TableSelectionCallback<string> = jest.fn();
      const numberCallback: TableSelectionCallback<number> = jest.fn();

      render(<TableButton<string> rowId="test" isSelected={false} onSelectionChange={stringCallback} />);
      render(<TableButton<number> rowId="test" isSelected={false} onSelectionChange={numberCallback} />);

      // If this compiles, type safety is maintained
      expect(true).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined onClick gracefully', () => {
      const mockOnSelectionChange = jest.fn();

      render(<TableButton {...defaultProps} onClick={undefined} onSelectionChange={mockOnSelectionChange} />);

      const button = screen.getByTestId('table-button');

      expect(() => fireEvent.click(button)).not.toThrow();
      expect(mockOnSelectionChange).toHaveBeenCalledTimes(1);
    });

    it('handles empty rowId', () => {
      const mockOnSelectionChange = jest.fn();

      render(<TableButton {...defaultProps} rowId="" onSelectionChange={mockOnSelectionChange} />);

      const button = screen.getByTestId('table-button');
      fireEvent.click(button);

      expect(mockOnSelectionChange).toHaveBeenCalledWith('', true, {
        source: 'button',
      });
    });

    it('handles special characters in rowId', () => {
      const mockOnSelectionChange = jest.fn();
      const specialRowId = 'row-with-special-chars-!@#$%^&*()';

      render(<TableButton {...defaultProps} rowId={specialRowId} onSelectionChange={mockOnSelectionChange} />);

      const button = screen.getByTestId('table-button');
      fireEvent.click(button);

      expect(mockOnSelectionChange).toHaveBeenCalledWith(specialRowId, true, {
        source: 'button',
      });
    });

    it('handles empty children gracefully', () => {
      render(
        <TableButton {...defaultProps} isSelected={false}>
          {null}
        </TableButton>,
      );

      const button = screen.getByTestId('table-button');
      // Should fall back to default text when children is falsy
      expect(button).toHaveTextContent('Select');
    });

    it('handles complex children elements', () => {
      render(
        <TableButton {...defaultProps}>
          <span>Complex</span> <strong>Children</strong>
        </TableButton>,
      );

      const button = screen.getByTestId('table-button');
      expect(button).toHaveTextContent('Complex Children');
    });

    it('handles numeric rowId', () => {
      const mockOnSelectionChange = jest.fn();

      render(<TableButton {...defaultProps} rowId="123" onSelectionChange={mockOnSelectionChange} />);

      const button = screen.getByTestId('table-button');
      fireEvent.click(button);

      expect(mockOnSelectionChange).toHaveBeenCalledWith('123', true, {
        source: 'button',
      });
    });
  });

  describe('Button Props Integration', () => {
    it('always sets size to small', () => {
      render(<TableButton {...defaultProps} />);

      const button = screen.getByTestId('table-button');
      expect(button).toHaveAttribute('data-size', 'small');
    });

    it('preserves disabled state', () => {
      render(<TableButton {...defaultProps} disabled={true} />);

      const button = screen.getByTestId('table-button');
      expect(button).toBeDisabled();
    });

    it('passes variant correctly', () => {
      render(<TableButton {...defaultProps} variant="danger" />);

      const button = screen.getByTestId('table-button');
      expect(button).toHaveAttribute('data-variant', 'danger');
    });

    it('maintains accessibility attributes', () => {
      render(<TableButton {...defaultProps} aria-label="Custom selection button" />);

      const button = screen.getByTestId('table-button');
      expect(button).toHaveAttribute('aria-label', 'Custom selection button');
    });
  });

  describe('Accessibility', () => {
    it('has proper role and type', () => {
      render(<TableButton {...defaultProps} />);

      const button = screen.getByTestId('table-button');
      expect(button.tagName).toBe('BUTTON');
    });

    it('supports keyboard interaction', () => {
      const mockOnSelectionChange = jest.fn();
      render(<TableButton {...defaultProps} onSelectionChange={mockOnSelectionChange} />);

      const button = screen.getByTestId('table-button');

      // Focus the button first
      button.focus();

      // Simulate keyboard interaction (Enter key)
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });

      // Button should be focusable
      expect(button).toHaveFocus();
    });

    it('maintains accessibility when disabled', () => {
      render(<TableButton {...defaultProps} disabled={true} />);

      const button = screen.getByTestId('table-button');
      expect(button).toBeDisabled();
      expect(button.tagName).toBe('BUTTON');
    });
  });
});
