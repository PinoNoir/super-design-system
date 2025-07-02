import React from 'react';
import { ThemeContextType } from './ThemeProvider';
import ThemeContext from './ThemeContext';

const useTheme = (): ThemeContextType => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default useTheme;
