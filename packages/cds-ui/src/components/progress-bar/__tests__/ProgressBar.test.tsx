import { render, screen, act } from '@testing-library/react';
import ProgressBar from '../ProgressBar';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  animate: jest.fn((start, end, options) => {
    options.onUpdate(end);
    return { stop: jest.fn() };
  }),
}));

// Mock the styles
jest.mock('../styles/ProgressBar.module.css', () => ({
  progressBar: 'progress-bar',
  progressBarVariants: {
    primary: 'primary',
  },
  sizeVariants: {
    small: 'sm',
    medium: 'md',
    large: 'lg',
  },
  progressBarTextContainer: 'progress-bar-text-container',
  animatedBase: 'animatedBase',
  nonAnimatedBase: 'nonAnimatedBase',
  progressBarContainer: 'progress-bar-container',
  className: 'custom-class',
}));

describe('ProgressBar Component', () => {
  it('renders with basic props', () => {
    render(<ProgressBar variant="primary" value={50} max={100} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ProgressBar variant="primary" value={50} max={100} className="custom-class" />);
    expect(screen.getByRole('progressbar').firstChild).toHaveClass('custom-class');
  });

  it('sets aria-label when id is provided', () => {
    render(<ProgressBar variant="primary" value={50} max={100} id="test-progress" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'test-progress');
  });

  it('shows progress text when showProgress is true', () => {
    render(<ProgressBar variant="primary" value={50} max={100} showProgress />);
    expect(screen.getByText('%')).toBeInTheDocument();
  });

  it('does not show progress text when showProgress is false', () => {
    render(<ProgressBar variant="primary" value={50} max={100} showProgress={false} />);
    expect(screen.queryByText('%')).not.toBeInTheDocument();
  });

  it('animates progress text', async () => {
    jest.useFakeTimers();
    render(<ProgressBar variant="primary" value={50} max={100} showProgress />);

    act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByText('50')).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('applies stopAnimation class when stopAnimation is true', () => {
    render(<ProgressBar variant="primary" value={100} max={100} stopAnimation={true} />);
    expect(screen.getByRole('progressbar').firstChild).toHaveClass('nonAnimatedBase');
  });

  it('applies base class when value is less than 100', () => {
    render(<ProgressBar variant="primary" value={99} max={100} />);
    expect(screen.getByRole('progressbar').firstChild).toHaveClass('animatedBase');
  });

  it('applies automation-id when provided', () => {
    render(<ProgressBar variant="primary" value={50} max={100} automation-id="test-progress" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('automation-id', 'test-progress');
  });
});
