import { render, screen } from '@testing-library/react';
import Badge from './Badge';

// Mock the styles to avoid issues with CSS modules in tests
jest.mock('./styles/Badge.module.css', () => ({
  badge: 'badge',
  round: 'round',
  square: 'square',
  bevel: 'bevel',
  base: 'base',
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
  iconContainer: 'iconContainer',
}));

describe('Badge Component', () => {
  it('renders the Badge component with the correct text', () => {
    render(<Badge variant="base">Test Label</Badge>);
    const badgeElement = screen.getByText(/Test Label/i);
    expect(badgeElement).toBeInTheDocument();
  });

  it('renders the Badge component with the correct variant and shape', () => {
    render(
      <Badge variant="base" shape="round">
        Test Label
      </Badge>,
    );
    const badgeElement = screen.getByText(/Test Label/i);
    expect(badgeElement).toHaveClass('badge round base');
  });
});
