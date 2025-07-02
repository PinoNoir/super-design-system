import { render, screen } from '@testing-library/react';
import { UserContext, useUserContext } from '../UserContext'; // Adjust the import path as needed

// Test component that consumes the context
const UserDisplayComponent = () => {
  const user = useUserContext();
  return (
    <div>
      <div automation-id="user-id">{user.id}</div>
      <div automation-id="user-name">{user.name}</div>
      <div automation-id="user-profile-pic">{user.profilePic || 'No profile pic'}</div>
      <div automation-id="user-is-logged-in">{user.isLoggedIn ? 'Logged In' : 'Not Logged In'}</div>
    </div>
  );
};

// Test component with context provider
const TestProvider = ({ userValue, children }) => (
  <UserContext.Provider value={userValue}>{children}</UserContext.Provider>
);

describe('UserContext', () => {
  const mockUser = {
    id: 123,
    name: 'Test User',
    profilePic: 'https://example.com/pic.jpg',
    isLoggedIn: true,
  };

  test('useUserContext provides user data to components', () => {
    render(
      <TestProvider userValue={mockUser}>
        <UserDisplayComponent />
      </TestProvider>,
    );

    expect(screen.getByTestId('user-id')).toHaveTextContent('123');
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
    expect(screen.getByTestId('user-profile-pic')).toHaveTextContent('https://example.com/pic.jpg');
    expect(screen.getByTestId('user-is-logged-in')).toHaveTextContent('Logged In');
  });

  test('useUserContext handles optional profilePic property', () => {
    const userWithoutPic = {
      ...mockUser,
      profilePic: undefined,
    };

    render(
      <TestProvider userValue={userWithoutPic}>
        <UserDisplayComponent />
      </TestProvider>,
    );

    expect(screen.getByTestId('user-profile-pic')).toHaveTextContent('No profile pic');
  });

  test('useUserContext reflects isLoggedIn state', () => {
    const loggedOutUser = {
      ...mockUser,
      isLoggedIn: false,
    };

    render(
      <TestProvider userValue={loggedOutUser}>
        <UserDisplayComponent />
      </TestProvider>,
    );

    expect(screen.getByTestId('user-is-logged-in')).toHaveTextContent('Not Logged In');
  });

  test('useUserContext throws error when used outside of UserProvider', () => {
    // Silence the expected error log
    const originalError = console.error;
    console.error = jest.fn();

    // We expect the render to throw an error
    expect(() => {
      render(<UserDisplayComponent />);
    }).toThrow('useUserContext must be used within a UserProvider');

    // Restore the console.error
    console.error = originalError;
  });

  test('UserContext can be updated with new values', () => {
    const { rerender } = render(
      <TestProvider userValue={mockUser}>
        <UserDisplayComponent />
      </TestProvider>,
    );

    // Initial check
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');

    // Update the context with a new user
    const updatedUser = {
      ...mockUser,
      name: 'Updated User',
    };

    rerender(
      <TestProvider userValue={updatedUser}>
        <UserDisplayComponent />
      </TestProvider>,
    );

    // Check if the component received the updated value
    expect(screen.getByTestId('user-name')).toHaveTextContent('Updated User');
  });
});
