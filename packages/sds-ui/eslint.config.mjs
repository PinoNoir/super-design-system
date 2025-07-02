import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import react from 'eslint-plugin-react';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11Y from 'eslint-plugin-jsx-a11y';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import youMightNotNeedAnEffect from "eslint-plugin-react-you-might-not-need-an-effect";
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['src/**/*.stories.tsx', 'src/**/*.test.tsx', 'src/**/*.mdx', '!**/.storybook', 'coverage'],
  },
  ...fixupConfigRules(
    compat.extends(
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:storybook/recommended',
      'plugin:react/recommended',
      'plugin:jsx-a11y/recommended',
    ),
  ),
  {
    plugins: {
      react: fixupPluginRules(react),
      'react-refresh': reactRefresh,
      'jsx-a11y': fixupPluginRules(jsxA11Y),
      "react-you-might-not-need-an-effect": youMightNotNeedAnEffect,
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'react-refresh/only-export-components': 'warn',
      'react/prop-types': 0,
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'no-unused-vars': 'off',
      'no-console': 'off',
      "react-you-might-not-need-an-effect/you-might-not-need-an-effect": "warn",

      'react/no-unknown-property': [
        'error',
        {
          ignore: ['automation-id'],
        },
      ],

      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      'react/jsx-pascal-case': [
        2,
        {
          allowNamespace: true,
        },
      ],

      'prefer-const': [
        1,
        {
          destructuring: 'all',
        },
      ],
    },
  },
  ...compat.extends('plugin:mdx/recommended').map((config) => ({
    ...config,
    files: ['lib/*.ts', '**/*.mdx'],
  })),
  {
    files: ['lib/*.ts', '**/*.mdx'],

    rules: {
      'no-undef': 'off',
    },
  },
];
