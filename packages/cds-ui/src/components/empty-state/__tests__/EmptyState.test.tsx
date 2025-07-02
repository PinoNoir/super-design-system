import { render, screen } from '@testing-library/react';

import EmptyState from '../EmptyState';

// Mock the styles
jest.mock('./styles/EmptyState.module.css', () => ({
  container: 'container',
  titleSection: 'titleSection',
  actionButtons: 'actionButtons',
}));

describe('EmptyState Component', () => {
  const defaultProps = {
    title: 'Test Title',
    description: 'Test Description',
    children: <button>Test Button</button>,
  };

  it('renders with required props', () => {
    render(<EmptyState {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<EmptyState {...defaultProps} className="custom-class" />);
    expect(screen.getByRole('status')).toHaveClass('custom-class');
  });

  it('renders without description when not provided', () => {
    const { description, ...propsWithoutDescription } = defaultProps;
    render(<EmptyState {...propsWithoutDescription} />);
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('applies automation-id', () => {
    render(<EmptyState {...defaultProps} automation-id="empty-state" />);
    expect(screen.getByRole('status')).toHaveAttribute('automation-id', 'empty-state');
  });

  it('renders children in the correct section', () => {
    render(<EmptyState {...defaultProps} />);
    const actionButtonsSection = screen.getByRole('button', { name: 'Test Button' }).closest('div');
    expect(actionButtonsSection).toHaveClass('actionButtons');
  });

  it('renders title as h3', () => {
    render(<EmptyState {...defaultProps} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Test Title' })).toBeInTheDocument();
  });
});
