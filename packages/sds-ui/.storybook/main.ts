// This file has been automatically migrated to valid ESM format by Storybook.
import type { StorybookConfig } from '@storybook/react-vite';
import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

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
    }
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
