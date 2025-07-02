import { createContext } from 'react';
import { ThemeContextType } from './ThemeProvider';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export default ThemeContext;
