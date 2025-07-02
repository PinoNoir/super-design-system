import { render, screen } from '@testing-library/react';
import Loader from '../Loader';

describe('Loader Component', () => {
  it('renders with default props but hides description', () => {
    render(<Loader />);
    const svg = screen.getByRole('progressbar', { name: 'Loading...' });
    expect(svg).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('renders description when showDescription is true', () => {
    render(<Loader showDescription />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom description when showDescription is true', () => {
    const customDescription = 'Please wait...';
    render(<Loader description={customDescription} showDescription />);
    const svg = screen.getByRole('progressbar', { name: customDescription });
    expect(svg).toBeInTheDocument();
    expect(screen.getByText(customDescription)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Loader className="custom-class" />);
    const svg = screen.getByRole('progressbar');
    expect(svg).toHaveClass('custom-class');
  });

  it('renders with overlay when withOverlay is true', () => {
    render(<Loader withOverlay />);
    const wrapper = screen.getByRole('progressbar').closest('div');
    expect(wrapper).toHaveClass('loadingOverlay');
  });

  it('does not render with overlay when withOverlay is false', () => {
    render(<Loader withOverlay={false} />);
    const wrapper = screen.getByRole('progressbar').closest('div');
    expect(wrapper).not.toHaveClass('loadingOverlay');
  });

  it('applies automation-id when provided', () => {
    render(<Loader automation-id="test-loader" />);
    const container = screen.getByRole('progressbar').closest('[automation-id]');
    expect(container).toHaveAttribute('automation-id', 'test-loader');
  });
});
