import React from 'react';
import { render, screen } from '@testing-library/react';

import Link from '../Link';

describe('Link Component', () => {
  it('renders the link with correct text', () => {
    render(<Link href="https://example.com">Click me</Link>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders with correct href when not disabled', () => {
    render(<Link href="https://example.com">Click me</Link>);
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com');
  });

  it('does not have href attribute when disabled', () => {
    render(
      <Link href="https://example.com" disabled>
        Click me
      </Link>,
    );
    expect(screen.getByRole('link')).not.toHaveAttribute('href');
    expect(screen.getByRole('link')).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders with correct target and rel attributes', () => {
    render(
      <Link href="https://example.com" target="_blank">
        Click me
      </Link>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener');
  });

  it('renders with icon when provided and not inline', () => {
    const MockIcon = () => <span automation-id="mock-icon">Icon</span>;
    render(
      <Link href="https://example.com" icon={<MockIcon />}>
        Click me
      </Link>,
    );
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('does not render icon when inline', () => {
    const MockIcon = () => <span automation-id="mock-icon">Icon</span>;
    render(
      <Link href="https://example.com" icon={<MockIcon />} inline>
        Click me
      </Link>,
    );
    expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Link href="https://example.com" className="custom-class">
        Click me
      </Link>,
    );
    expect(screen.getByRole('link')).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    render(
      <Link href="https://example.com" ref={ref}>
        Click me
      </Link>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});
