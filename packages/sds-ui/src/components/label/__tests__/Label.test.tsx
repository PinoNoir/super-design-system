import { render, screen } from '@testing-library/react';

import Label from '../Label';

describe('Label Component', () => {
  it('renders with children', () => {
    render(<Label>Test Label</Label>);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Label className="custom-class">Test Label</Label>);
    expect(screen.getByText('Test Label')).toHaveClass('custom-class');
  });

  it('does not render icon Box when no icon is provided', () => {
    const { container } = render(<Label>Test Label</Label>);
    expect(container.querySelectorAll('div')).toHaveLength(1); // Only the outer Box
  });

  it('renders icon Box when icon is provided', () => {
    const { container } = render(<Label icon={<span>icon</span>}>Test Label</Label>);
    expect(container.querySelectorAll('div')).toHaveLength(2); // Outer Box and inner Box
  });

  it('passes through additional props to label element', () => {
    render(<Label htmlFor="test-input">Test Label</Label>);
    expect(screen.getByText('Test Label')).toHaveAttribute('for', 'test-input');
  });

  it('applies automation-id when provided', () => {
    render(<Label automation-id="test-label">Test Label</Label>);
    expect(screen.getByText('Test Label')).toHaveAttribute('automation-id', 'test-label');
  });

  it('renders with correct display flex', () => {
    const { container } = render(<Label>Test Label</Label>);
    const outerBox = container.firstChild;
    expect(outerBox).toHaveStyle('display: flex');
  });
});
