import { useTheme, ToggleButton } from '@stretto/cds-ui';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = (selected: 'left' | 'right') => {
    setTheme(selected === 'left' ? 'tsc-light' : 'tsc-dark');
  };

  return (
    <ToggleButton
      variant="primary"
      leftLabel="Light"
      rightLabel="Dark"
      leftIcon={<Sun />}
      rightIcon={<Moon />}
      value={theme.includes('light') ? 'left' : 'right'}
      onToggle={handleThemeToggle}
    />
  );
};

export default ThemeToggle;
