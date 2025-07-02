import React, { useState, useEffect, ReactNode } from 'react';
import ThemeContext from './ThemeContext';

export type ThemeTypes =
  | 'bcc-light'
  | 'bcc-dark'
  | 'tsc-light'
  | 'tsc-dark'
  | 'tsc-legacy'
  | 'core-light'
  | 'core-dark';

export interface ThemeContextType {
  theme: ThemeTypes;
  setTheme: (theme: ThemeTypes) => void;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeTypes;
}

// Helper function to safely access localStorage
const getStoredTheme = (): ThemeTypes | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('theme') as ThemeTypes;
  }
  return null;
};

const setStoredTheme = (theme: ThemeTypes): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', theme);
  }
};

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, defaultTheme = 'bcc-light' }) => {
  const [theme, setTheme] = useState<ThemeTypes>(defaultTheme);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydration effect - runs only on client side after initial render
  useEffect(() => {
    const savedTheme = getStoredTheme();
    if (savedTheme) {
      setTheme(savedTheme);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      // Update data-theme attribute when theme changes
      document.documentElement.setAttribute('data-theme', theme);
      // Save theme preference
      setStoredTheme(theme);
    }
  }, [theme, isHydrated]);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
