import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import IconButton from '../IconButton';

// Mock the CSS module with the class names that appear in the actual output
jest.mock('./styles/IconButton.module.css', () => ({
  // Direct class names
  iconButton: 'iconButton',
  small: 'small',
  large: 'large',
  none: 'none',
  outline: 'outline',
  filled: 'filled',
  square: 'square',
  bevel: 'bevel',
  round: 'round',
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
}));

describe('IconButton', () => {
  beforeEach(() => {
    // Clear mock calls between tests
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<IconButton>Icon</IconButton>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Icon');
    expect(button).toHaveClass('iconButton');
    expect(button).toHaveClass('secondary');
    expect(button).toHaveClass('filled');
    expect(button).toHaveClass('round');
  });

  it('applies custom className', () => {
    render(<IconButton className="custom-class">Icon</IconButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('iconButton');
  });

  it('handles onClick event', () => {
    const handleClick = jest.fn();
    render(<IconButton onClick={handleClick}>Icon</IconButton>);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables the button when disabled prop is true', () => {
    render(<IconButton disabled>Icon</IconButton>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('applies automation-id', () => {
    render(<IconButton automation-id="test-id">Icon</IconButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('automation-id', 'test-id');
  });

  it('forwards ref to button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<IconButton ref={ref}>Icon</IconButton>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('applies classes based on variant, size, fill and shape', () => {
    render(
      <IconButton variant="primary" size="large" fill="none" shape="square">
        Icon
      </IconButton>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('iconButton');
    expect(button).toHaveClass('primary');
    expect(button).toHaveClass('large');
    expect(button).toHaveClass('none');
    expect(button).toHaveClass('square');
  });
});
