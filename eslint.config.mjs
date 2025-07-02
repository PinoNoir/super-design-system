import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      'packages/*/src/**/*.test.tsx',
      'packages/*/src/**/*.test.ts',
      'packages/*/src/**/__tests__/**',
      'packages/*/src/**/__mocks__/**',
      'packages/*/src/**/*.stories.tsx',
      'packages/*/.storybook/',
      'packages/*/storybook-static/',
      'packages/*/config/',
      'packages/*/coverage/',
      'packages/*/lib/',
      'packages/*/public/',
      'packages/*/node_modules/',
      'packages/cds-styles/src',
      'packages/cds-tokens/src',
      'apps/**/*',
      '**/babel.config.js',
    ],
  },
  ...compat.extends(
    'plugin:react/recommended',
    'plugin:jest/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      prettier,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },

      parser: tsParser,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/explicit-function-return-type': 0,
      '@typescript-eslint/no-explicit-any': 'off',
      'no-empty': 'warn',

      'prettier/prettier': [
        'warn',
        {
          endOfLine: 'auto',
          semi: true,
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],

    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',

      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.eslint.json', 'packages/*/tsconfig.json'],

        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      'no-undef': 0,
      'no-any': 0,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 0,
      'react/no-unknown-property': [
        'error',
        {
          ignore: ['automation-id'],
        },
      ],
      'react-refresh/only-export-components': 'warn',
    },
  },
];
