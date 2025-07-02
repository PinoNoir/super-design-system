import { render, screen, fireEvent } from '@testing-library/react';

import Chip from '../Chip';

// Mock the Avatar CSS module
jest.mock('../avatar/Avatar.module.css', () => ({
  avatar: 'avatar',
  avatarPlaceholder: 'avatarPlaceholder',
  placeholderText: 'placeholderText',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
}));

describe('Chip Component', () => {
  test('renders with label', () => {
    render(<Chip label="Test Chip" />);
    expect(screen.getByText('Test Chip')).toBeInTheDocument();
  });

  test('renders with avatar', () => {
    render(<Chip label="Avatar Chip" avatar={<div automation-id="avatar" />} />);
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
  });

  test('renders with icon', () => {
    render(<Chip label="Icon Chip" icon={<span automation-id="icon" />} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Chip label="Clickable Chip" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Clickable Chip'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('calls onActiveChange when filter chip is clicked', () => {
    const handleActiveChange = jest.fn();
    render(<Chip label="Filter Chip" isFilterChip active={false} onActiveChange={handleActiveChange} />);
    fireEvent.click(screen.getByText('Filter Chip'));
    expect(handleActiveChange).toHaveBeenCalledWith(true);
  });

  test('renders delete icon when onDelete is provided', () => {
    const handleDelete = jest.fn();
    render(<Chip label="Deletable Chip" onDelete={handleDelete} isDismissible />);
    expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
  });

  test('calls onDelete when delete icon is clicked', () => {
    const handleDelete = jest.fn();
    render(<Chip label="Deletable Chip" onDelete={handleDelete} isDismissible />);
    fireEvent.click(screen.getByTestId('delete-icon'));
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });

  test('renders as anchor when href is provided', () => {
    render(<Chip label="Link Chip" href="https://example.com" />);
    expect(screen.getByRole('button')).toHaveAttribute('href', 'https://example.com');
  });

  test('handles keyboard interactions', () => {
    const handleClick = jest.fn();
    render(<Chip label="Keyboard Chip" onClick={handleClick} />);
    const chip = screen.getByText('Keyboard Chip');
    fireEvent.keyDown(chip, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(chip, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });
});
