import { render, screen, fireEvent } from '@testing-library/react';
import Switch from '../Switch';

describe('Switch component', () => {
  const setup = (props = {}) => {
    const defaultProps = {
      id: 'test-switch',
      label: 'Test Label',
      onCheckedChange: jest.fn(),
      ...props,
    };
    render(<Switch {...defaultProps} />);
    return defaultProps;
  };

  it('renders with label', () => {
    setup();
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('renders label on the left in inline mode', () => {
    setup({ inline: true, labelPosition: 'left' });
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label.nextElementSibling?.tagName.toLowerCase()).toBe('button');
  });

  it('renders label on the right in inline mode', () => {
    setup({ inline: true, labelPosition: 'right' });
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label.previousElementSibling?.tagName.toLowerCase()).toBe('button');
  });

  it('calls onCheckedChange when toggled', () => {
    const onCheckedChange = jest.fn();
    setup({ onCheckedChange });
    const switchButton = screen.getByRole('switch');
    fireEvent.click(switchButton);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('respects the checked prop (controlled)', () => {
    const { rerender } = render(
      <Switch id="controlled" label="Controlled" checked={false} onCheckedChange={() => {}} />,
    );
    const switchButton = screen.getByRole('switch');
    expect(switchButton).toHaveAttribute('data-state', 'unchecked');

    rerender(<Switch id="controlled" label="Controlled" checked={true} onCheckedChange={() => {}} />);
    expect(switchButton).toHaveAttribute('data-state', 'checked');
  });

  it('respects the defaultChecked prop (uncontrolled)', () => {
    setup({ defaultChecked: true });
    const switchButton = screen.getByRole('switch');
    expect(switchButton).toHaveAttribute('data-state', 'checked');
  });

  it('disables the switch when disabled is true', () => {
    setup({ disabled: true });
    const switchButton = screen.getByRole('switch');
    expect(switchButton).toBeDisabled();
  });

  it('applies custom className', () => {
    setup({ className: 'custom-class' });
    const switchButton = screen.getByRole('switch');
    expect(switchButton.className).toMatch(/custom-class/);
  });
});
