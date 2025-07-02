import { render, screen } from '@testing-library/react';
import Avatar from '../Avatar';

// Mock the styles to avoid issues with CSS modules in tests
jest.mock('./styles/Avatar.module.css', () => ({
  avatar: 'avatar',
  avatarPlaceholder: 'avatarPlaceholder',
  placeholderText: 'placeholderText',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
}));

describe('Avatar component', () => {
  test('renders user avatar image when logged in and src is provided', () => {
    const props = {
      isLoggedIn: true,
      username: 'John Doe',
      src: 'avatar.jpg',
      'automation-id': 'test-avatar',
    };

    render(<Avatar {...props} />);

    const avatarImage = screen.getByAltText('John Doe');
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute('src', 'avatar.jpg');
    expect(avatarImage).toHaveAttribute('automation-id', 'test-avatar');
  });

  test('renders user initials when logged in but no src is provided', () => {
    const props = {
      isLoggedIn: true,
      username: 'John Doe',
      'automation-id': 'test-avatar',
    };

    render(<Avatar {...props} />);

    const avatarPlaceholder = screen.getByLabelText("John Doe's Avatar");
    expect(avatarPlaceholder).toBeInTheDocument();
    expect(avatarPlaceholder).toHaveTextContent('JD');
    expect(avatarPlaceholder).toHaveAttribute('automation-id', 'test-avatar');
  });

  test('renders default placeholder when not logged in', () => {
    const props = {
      isLoggedIn: false,
      'automation-id': 'test-avatar',
    };

    render(<Avatar {...props}>Guest</Avatar>);

    const avatarPlaceholder = screen.getByLabelText('Default Avatar');
    expect(avatarPlaceholder).toBeInTheDocument();
    expect(avatarPlaceholder).toHaveTextContent('Guest');
    expect(avatarPlaceholder).toHaveAttribute('automation-id', 'test-avatar');
  });
});
