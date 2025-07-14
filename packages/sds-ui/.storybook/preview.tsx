import { Preview, ReactRenderer } from '@storybook/react-vite';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

// Load Global CSS
import '../../sds-styles/lib/bcc/global.min.css';
import '../../sds-styles/lib/tsc/global.min.css';
import '../../sds-styles/lib/core/global.min.css';

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute<ReactRenderer>({
      themes: {
        'BCC Light': 'bcc-light',
        'BCC Dark': 'bcc-dark',
        'TSC Light': 'tsc-light',
        'TSC Dark': 'tsc-dark',
        'TSC Legacy': 'tsc-legacy',
        'Core Light': 'core-light',
        'Core Dark': 'core-dark',
      },
      defaultTheme: 'BCC Light',
      attributeName: 'data-theme',
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    options: {
      controls: { expanded: true, hideNoControlsWarning: true },
      storySort: {
        order: [
          'Welcome',
          'Changelog',
          'Why Use SDS?',
          'Getting Started',
          ['Project Setup', 'BCC V2 Integration', 'Theming'],
          'Foundations',
          ['Design Tokens', '*'],
          'Layout Components',
          'Components',
          'AI Components',
          'Experimental',
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
