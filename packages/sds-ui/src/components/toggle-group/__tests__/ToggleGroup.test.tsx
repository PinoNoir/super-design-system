import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SunIcon, MoonIcon } from 'lucide-react';
import ToggleGroup from '../ToggleGroup';

describe('ToggleGroup', () => {
  const defaultIcons = [<SunIcon key="sun" className="toggleIcon" />, <MoonIcon key="moon" className="toggleIcon" />];

  it('renders with default value', () => {
    const mockOnValueChange = jest.fn();
    render(<ToggleGroup value="0" onValueChange={mockOnValueChange} icons={defaultIcons} />);

    // Check that both toggle items are rendered
    const buttons = screen.getAllByRole('radio');
    expect(buttons).toHaveLength(2);
  });

  it('calls onValueChange when clicking on a toggle item', () => {
    const mockOnValueChange = jest.fn();
    render(<ToggleGroup value="0" onValueChange={mockOnValueChange} icons={defaultIcons} />);

    const buttons = screen.getAllByRole('radio');
    fireEvent.click(buttons[1]); // Click the second button (moon)

    expect(mockOnValueChange).toHaveBeenCalledWith('1');
  });

  it('shows correct selected state based on value prop', () => {
    const mockOnValueChange = jest.fn();
    render(<ToggleGroup value="1" onValueChange={mockOnValueChange} icons={defaultIcons} />);

    const buttons = screen.getAllByRole('radio');

    // The second button should be selected (value "1")
    expect(buttons[0]).toHaveAttribute('data-state', 'off');
    expect(buttons[1]).toHaveAttribute('data-state', 'on');
  });
});
