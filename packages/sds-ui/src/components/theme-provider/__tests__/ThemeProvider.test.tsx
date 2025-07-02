import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ThemeProvider from '../ThemeProvider';
import useTheme from '../UseTheme';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// A test component that uses the theme
const TestComponent = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <div automation-id="current-theme">{theme}</div>
      <button onClick={() => setTheme(theme === 'bcc-light' ? 'bcc-dark' : 'bcc-light')} automation-id="theme-toggle">
        Toggle Theme
      </button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Clear localStorage mock calls before each test
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    // Reset document attribute
    document.documentElement.removeAttribute('data-theme');
  });

  test('handles null localStorage value gracefully', async () => {
    // Explicitly test null return from localStorage
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <ThemeProvider defaultTheme="tsc-light">
        <TestComponent />
      </ThemeProvider>,
    );

    // Should fall back to defaultTheme when localStorage returns null
    expect(screen.getByTestId('current-theme')).toHaveTextContent('tsc-light');

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'tsc-light');
    });

    // Verify localStorage was checked
    expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');

    // Should eventually save the default theme to localStorage
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'tsc-light');
    });
  });

  test('handles undefined localStorage value gracefully', async () => {
    localStorageMock.getItem.mockReturnValue(undefined);

    render(
      <ThemeProvider defaultTheme="core-dark">
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('core-dark');

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'core-dark');
    });

    expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
  });

  test('handles empty string localStorage value gracefully', async () => {
    localStorageMock.getItem.mockReturnValue('');

    render(
      <ThemeProvider defaultTheme="core-light">
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('core-light');

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'core-light');
    });

    expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
  });

  test('provides the default bcc-light theme when no theme is stored', async () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('bcc-light');

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'bcc-light');
    });

    expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
  });

  test('uses theme from localStorage if available', async () => {
    localStorageMock.getItem.mockReturnValue('bcc-dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    // In test environment, hydration happens immediately, so stored theme is loaded right away
    expect(screen.getByTestId('current-theme')).toHaveTextContent('bcc-dark');

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'bcc-dark');
    });

    expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
  });

  test('allows theme switching and updates localStorage', async () => {
    localStorageMock.getItem.mockReturnValue('bcc-light');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    // Wait for initial setup
    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'bcc-light');
    });

    const toggleButton = screen.getByTestId('theme-toggle');

    // Switch to bcc-dark theme
    await act(async () => {
      fireEvent.click(toggleButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('bcc-dark');
      expect(document.documentElement).toHaveAttribute('data-theme', 'bcc-dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'bcc-dark');
    });

    // Switch back to bcc-light theme
    await act(async () => {
      fireEvent.click(toggleButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('bcc-light');
      expect(document.documentElement).toHaveAttribute('data-theme', 'bcc-light');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'bcc-light');
    });
  });

  test('accepts and uses defaultTheme prop', async () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <ThemeProvider defaultTheme="bcc-dark">
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('bcc-dark');

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'bcc-dark');
    });
  });

  test('stored theme overrides defaultTheme prop', async () => {
    localStorageMock.getItem.mockReturnValue('tsc-light');

    render(
      <ThemeProvider defaultTheme="bcc-dark">
        <TestComponent />
      </ThemeProvider>,
    );

    // In test environment, stored theme takes precedence immediately
    expect(screen.getByTestId('current-theme')).toHaveTextContent('tsc-light');

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'tsc-light');
    });

    expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
  });

  test('throws error when useTheme is used outside ThemeProvider', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow('useTheme must be used within a ThemeProvider');

    consoleErrorSpy.mockRestore();
  });

  test('calls localStorage methods appropriately', async () => {
    localStorageMock.getItem.mockReturnValue('bcc-dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    // localStorage.getItem should be called during hydration
    expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');

    // Wait for effects to complete
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'bcc-dark');
    });
  });

  test('handles theme changes correctly after initial render', async () => {
    localStorageMock.getItem.mockReturnValue('bcc-light');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    // Clear previous calls to focus on new changes
    localStorageMock.setItem.mockClear();

    const toggleButton = screen.getByTestId('theme-toggle');

    await act(async () => {
      fireEvent.click(toggleButton);
    });

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'bcc-dark');
    });
  });
});
