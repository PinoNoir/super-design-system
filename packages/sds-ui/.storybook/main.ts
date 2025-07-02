import type { StorybookConfig } from '@storybook/react-vite';
import { dirname, join } from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-themes'),
    getAbsolutePath('@storybook/addon-designs'),
    getAbsolutePath('@storybook/addon-docs'),
    {
      name: getAbsolutePath('@storybook/addon-a11y'),
      options: {
        element: '#root',
        manual: true,
      },
      config: {
        rules: [{ id: 'color-contrast', enabled: true }],
      },
    },
    {
      name: getAbsolutePath('@storybook/addon-storysource'),
      options: {
        rule: {
          test: [/\.stories\.tsx?$/],
          include: [dirname(__dirname), '../src/components'],
        },
        loaderOptions: {
          prettierConfig: { printWidth: 80, singleQuote: true },
        },
      },
    },
  ],

  staticDirs: ['../src/public', './sb-theme-assets/icons', './sb-theme-assets/fonts', '../src/docs/assets'],

  core: {
    disableTelemetry: true,
  },

  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {
      strictMode: true,
      builder: {
        viteConfigPath: '.storybook/vite.config.mts',
      },
    },
  },

  docs: {
    defaultName: 'Overview',
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};
export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
