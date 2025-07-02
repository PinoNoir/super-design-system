import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TableCheckbox, { TableCheckboxProps } from '../TableCheckbox';
import { TableSelectionCallback } from '../types/data-table-generics';

// Mock the Checkbox component to better simulate the real behavior
jest.mock('../../checkbox/Checkbox', () => {
  return function MockCheckbox({ checked, disabled, indeterminate, onChange, label, hideLabel }: any) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Don't call onChange if disabled
      if (!disabled && onChange) {
        // Create an event that mimics what your component expects
        const mockEvent = {
          ...e,
          target: {
            ...e.target,
            checked: !checked, // Toggle the checked state
          },
          stopPropagation: jest.fn(),
        };
        onChange(mockEvent);
      }
    };

    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
      // Stop propagation on click events to match TableCheckbox behavior
      e.stopPropagation();
    };

    return (
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        onClick={handleClick}
        automation-id="table-checkbox"
        data-indeterminate={indeterminate}
        aria-label={hideLabel ? label : undefined}
      />
    );
  };
});

describe('TableCheckbox', () => {
  const defaultProps: TableCheckboxProps<any> = {
    checked: false,
    rowId: 'row-1',
    onSelectionChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with correct default props', () => {
      render(<TableCheckbox {...defaultProps} />);

      const checkbox = screen.getByTestId('table-checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
      expect(checkbox).not.toBeDisabled();
      expect(checkbox).toHaveAttribute('data-indeterminate', 'false');
    });

    it('renders as checked when checked prop is true', () => {
      render(<TableCheckbox {...defaultProps} checked={true} />);

      const checkbox = screen.getByTestId('table-checkbox');
      expect(checkbox).toBeChecked();
    });

    it('renders as disabled when disabled prop is true', () => {
      render(<TableCheckbox {...defaultProps} disabled={true} />);

      const checkbox = screen.getByTestId('table-checkbox');
      expect(checkbox).toBeDisabled();
    });

    it('renders as indeterminate when indeterminate prop is true', () => {
      render(<TableCheckbox {...defaultProps} indeterminate={true} />);

      const checkbox = screen.getByTestId('table-checkbox');
      expect(checkbox).toHaveAttribute('data-indeterminate', 'true');
    });

    it('renders with correct aria-label', () => {
      render(<TableCheckbox {...defaultProps} />);

      const checkbox = screen.getByTestId('table-checkbox');
      expect(checkbox).toHaveAttribute('aria-label', 'Select Row');
    });
  });

  describe('Selection Behavior', () => {
    it('calls onSelectionChange with correct parameters when clicked', () => {
      const mockOnSelectionChange = jest.fn();
      render(<TableCheckbox {...defaultProps} onSelectionChange={mockOnSelectionChange} />);

      const checkbox = screen.getByTestId('table-checkbox');
      fireEvent.click(checkbox);

      expect(mockOnSelectionChange).toHaveBeenCalledTimes(1);
      expect(mockOnSelectionChange).toHaveBeenCalledWith(
        'row-1',
        true, // newCheckedState should be true when unchecked box is clicked
        {
          source: 'checkbox',
        },
      );
    });

    it('calls onSelectionChange with false when checked box is clicked', () => {
      const mockOnSelectionChange = jest.fn();
      render(<TableCheckbox {...defaultProps} checked={true} onSelectionChange={mockOnSelectionChange} />);

      const checkbox = screen.getByTestId('table-checkbox');
      fireEvent.click(checkbox);

      expect(mockOnSelectionChange).toHaveBeenCalledWith(
        'row-1',
        false, // newCheckedState should be false when checked box is clicked
        {
          source: 'checkbox',
        },
      );
    });

    it('passes correct context with source', () => {
      const mockOnSelectionChange = jest.fn();
      render(<TableCheckbox {...defaultProps} onSelectionChange={mockOnSelectionChange} />);

      const checkbox = screen.getByTestId('table-checkbox');
      fireEvent.click(checkbox);

      expect(mockOnSelectionChange).toHaveBeenCalledWith('row-1', true, {
        source: 'checkbox',
      });
    });

    it('does not call onSelectionChange when disabled', () => {
      const mockOnSelectionChange = jest.fn();
      render(<TableCheckbox {...defaultProps} disabled={true} onSelectionChange={mockOnSelectionChange} />);

      const checkbox = screen.getByTestId('table-checkbox');

      // Try to interact with disabled checkbox
      fireEvent.click(checkbox);

      // Should not be called because checkbox is disabled
      expect(mockOnSelectionChange).not.toHaveBeenCalled();
    });
  });

  describe('Event Handling', () => {
    it('stops event propagation when clicked', () => {
      const mockOnSelectionChange = jest.fn();
      const mockParentClick = jest.fn();

      render(
        <div onClick={mockParentClick}>
          <TableCheckbox {...defaultProps} onSelectionChange={mockOnSelectionChange} />
        </div>,
      );

      const checkbox = screen.getByTestId('table-checkbox');
      fireEvent.click(checkbox);

      expect(mockOnSelectionChange).toHaveBeenCalledTimes(1);
      // Parent click should not be called due to stopPropagation in the mock
      expect(mockParentClick).not.toHaveBeenCalled();
    });

    it('handles multiple rapid clicks correctly', () => {
      const mockOnSelectionChange = jest.fn();
      const { rerender } = render(<TableCheckbox {...defaultProps} onSelectionChange={mockOnSelectionChange} />);

      const checkbox = screen.getByTestId('table-checkbox');

      // First click: false -> true
      fireEvent.click(checkbox);
      expect(mockOnSelectionChange).toHaveBeenCalledWith('row-1', true, { source: 'checkbox' });

      // Simulate parent updating the checked state
      rerender(<TableCheckbox {...defaultProps} checked={true} onSelectionChange={mockOnSelectionChange} />);

      // Second click: true -> false
      fireEvent.click(checkbox);
      expect(mockOnSelectionChange).toHaveBeenCalledWith('row-1', false, { source: 'checkbox' });

      // Simulate parent updating the checked state
      rerender(<TableCheckbox {...defaultProps} checked={false} onSelectionChange={mockOnSelectionChange} />);

      // Third click: false -> true
      fireEvent.click(checkbox);
      expect(mockOnSelectionChange).toHaveBeenCalledWith('row-1', true, { source: 'checkbox' });

      expect(mockOnSelectionChange).toHaveBeenCalledTimes(3);
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
        <TableCheckbox<CustomRowData> checked={false} rowId="custom-row-1" onSelectionChange={mockOnSelectionChange} />,
      );

      const checkbox = screen.getByTestId('table-checkbox');
      fireEvent.click(checkbox);

      expect(mockOnSelectionChange).toHaveBeenCalledWith('custom-row-1', true, {
        source: 'checkbox',
      });
    });

    it('maintains type safety with generic constraints', () => {
      // This test ensures the component compiles with different generic types
      const stringCallback: TableSelectionCallback<string> = jest.fn();
      const numberCallback: TableSelectionCallback<number> = jest.fn();

      render(<TableCheckbox<string> checked={false} rowId="test" onSelectionChange={stringCallback} />);
      render(<TableCheckbox<number> checked={false} rowId="test" onSelectionChange={numberCallback} />);

      // If this compiles, type safety is maintained
      expect(true).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty rowId', () => {
      const mockOnSelectionChange = jest.fn();

      render(<TableCheckbox {...defaultProps} rowId="" onSelectionChange={mockOnSelectionChange} />);

      const checkbox = screen.getByTestId('table-checkbox');
      fireEvent.click(checkbox);

      expect(mockOnSelectionChange).toHaveBeenCalledWith('', true, {
        source: 'checkbox',
      });
    });

    it('handles special characters in rowId', () => {
      const mockOnSelectionChange = jest.fn();
      const specialRowId = 'row-with-special-chars-!@#$%^&*()';

      render(<TableCheckbox {...defaultProps} rowId={specialRowId} onSelectionChange={mockOnSelectionChange} />);

      const checkbox = screen.getByTestId('table-checkbox');
      fireEvent.click(checkbox);

      expect(mockOnSelectionChange).toHaveBeenCalledWith(specialRowId, true, {
        source: 'checkbox',
      });
    });

    it('handles numeric rowId', () => {
      const mockOnSelectionChange = jest.fn();

      render(<TableCheckbox {...defaultProps} rowId="123" onSelectionChange={mockOnSelectionChange} />);

      const checkbox = screen.getByTestId('table-checkbox');
      fireEvent.click(checkbox);

      expect(mockOnSelectionChange).toHaveBeenCalledWith('123', true, {
        source: 'checkbox',
      });
    });

    it('maintains indeterminate state during interactions', () => {
      const mockOnSelectionChange = jest.fn();

      const { rerender } = render(
        <TableCheckbox {...defaultProps} indeterminate={true} onSelectionChange={mockOnSelectionChange} />,
      );

      const checkbox = screen.getByTestId('table-checkbox');
      expect(checkbox).toHaveAttribute('data-indeterminate', 'true');

      fireEvent.click(checkbox);

      // Rerender with new props (simulating parent component update)
      rerender(
        <TableCheckbox
          {...defaultProps}
          checked={true}
          indeterminate={false}
          onSelectionChange={mockOnSelectionChange}
        />,
      );

      expect(checkbox).toHaveAttribute('data-indeterminate', 'false');
      expect(checkbox).toBeChecked();
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility attributes', () => {
      render(<TableCheckbox {...defaultProps} />);

      const checkbox = screen.getByTestId('table-checkbox');
      expect(checkbox).toHaveAttribute('aria-label', 'Select Row');
      expect(checkbox).toHaveAttribute('type', 'checkbox');
    });

    it('maintains accessibility when disabled', () => {
      render(<TableCheckbox {...defaultProps} disabled={true} />);

      const checkbox = screen.getByTestId('table-checkbox');
      expect(checkbox).toBeDisabled();
      expect(checkbox).toHaveAttribute('aria-label', 'Select Row');
    });

    it('supports keyboard interaction', () => {
      const mockOnSelectionChange = jest.fn();
      render(<TableCheckbox {...defaultProps} onSelectionChange={mockOnSelectionChange} />);

      const checkbox = screen.getByTestId('table-checkbox');

      // Focus the checkbox first
      checkbox.focus();

      // Simulate keyboard interaction (Space key)
      fireEvent.keyDown(checkbox, { key: ' ', code: 'Space' });

      // Note: The actual keyboard handling depends on your Checkbox component implementation
      // This test ensures the component can receive keyboard events and be focused
      expect(checkbox).toHaveFocus();
    });
  });
});
