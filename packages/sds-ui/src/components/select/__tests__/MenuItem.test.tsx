import { render, screen, fireEvent } from '@testing-library/react';
import MenuItem from '../MenuItem';

describe('MenuItem', () => {
  it('renders children correctly', () => {
    render(<MenuItem value="test">Test Item</MenuItem>);
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('calls onClick when clicked and not disabled', () => {
    const mockOnClick = jest.fn();
    render(
      <MenuItem value="test" onClick={mockOnClick}>
        Test Item
      </MenuItem>,
    );
    fireEvent.click(screen.getByText('Test Item'));
    expect(mockOnClick).toHaveBeenCalledWith('test');
  });

  it('does not call onClick when clicked and disabled', () => {
    const mockOnClick = jest.fn();
    render(
      <MenuItem value="test" onClick={mockOnClick} disabled>
        Test Item
      </MenuItem>,
    );
    fireEvent.click(screen.getByText('Test Item'));
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('renders as selected when isSelected is true', () => {
    render(
      <MenuItem value="test" isSelected>
        Test Item
      </MenuItem>,
    );
    expect(screen.getByRole('option')).toHaveAttribute('aria-selected', 'true');
  });

  it('renders icon when selected and iconSelected is provided', () => {
    render(
      <MenuItem value="test" isSelected iconSelected={<span data-testid="selected-icon" />}>
        Test Item
      </MenuItem>,
    );
    expect(screen.getByTestId('selected-icon')).toBeInTheDocument();
  });

  it('applies correct ARIA attributes', () => {
    render(
      <MenuItem value="test" disabled>
        Test Item
      </MenuItem>,
    );
    const menuItem = screen.getByRole('option');
    expect(menuItem).toHaveAttribute('aria-disabled', 'true');
  });
});
