import { render, screen, fireEvent } from '@testing-library/react';
import ButtonToggle from '../Toggle';
import styles from './styles/Toggle.module.css';

describe('ButtonToggle', () => {
  const defaultProps = {
    leftLabel: 'Left',
    rightLabel: 'Right',
    onToggle: jest.fn(),
  };

  it('renders with default props', () => {
    render(<ButtonToggle {...defaultProps} />);

    expect(screen.getByText('Left')).toBeInTheDocument();
    expect(screen.getByText('Right')).toBeInTheDocument();
  });

  it('applies correct styles based on variant', () => {
    const { rerender } = render(<ButtonToggle {...defaultProps} variant="primary" value="left" />);

    const leftButton = screen.getByTestId('left-button');
    const rightButton = screen.getByTestId('right-button');

    expect(leftButton).toHaveClass(styles.primary);
    expect(rightButton).toHaveClass(styles.primary);

    rerender(<ButtonToggle {...defaultProps} variant="secondary" value="left" />);

    expect(leftButton).toHaveClass(styles.secondary);
    expect(rightButton).toHaveClass(styles.secondary);
  });

  it('applies correct styles for selected and unselected states', () => {
    const { rerender } = render(<ButtonToggle {...defaultProps} variant="primary" value="left" />);

    const leftButton = screen.getByTestId('left-button');
    const rightButton = screen.getByTestId('right-button');

    expect(leftButton).toHaveClass(styles.primarySelected);
    expect(rightButton).toHaveClass(styles.primaryUnselected);

    rerender(<ButtonToggle {...defaultProps} variant="primary" value="right" />);

    expect(leftButton).toHaveClass(styles.primaryUnselected);
    expect(rightButton).toHaveClass(styles.primarySelected);
  });

  it('calls onToggle when a button is clicked', () => {
    const onToggleMock = jest.fn();
    render(<ButtonToggle {...defaultProps} onToggle={onToggleMock} value="left" />);

    fireEvent.click(screen.getByText('Right'));

    expect(onToggleMock).toHaveBeenCalledWith('right');

    fireEvent.click(screen.getByText('Left'));

    expect(onToggleMock).toHaveBeenCalledWith('left');
  });

  it('respects value prop', () => {
    render(<ButtonToggle {...defaultProps} value="right" variant="secondary" />);

    expect(screen.getByTestId('left-button')).toHaveClass(styles.secondaryUnselected);
    expect(screen.getByTestId('right-button')).toHaveClass(styles.secondarySelected);
  });
});
