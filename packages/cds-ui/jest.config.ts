/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

// setting timezone for all tests (important to have the same result in server and local env)
process.env.TZ = 'UTC';

import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  verbose: true,
  collectCoverage: true,
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  coverageDirectory: 'coverage',
  testResultsProcessor: 'jest-sonar-reporter',
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.module\\.css$': 'identity-obj-proxy',
    '\\.(less|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
  },
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/src/setup-tests.ts'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/lib/',
    '<rootDir>/dist/',
    '<rootDir>/build/',
    '<rootDir>/src/lib/',
  ],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx|mjs)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(?!css)$',
    '<rootDir>/node_modules/@babel',
    '<rootDir>/node_modules/@jest',
    '\\.svg$',
  ],
  extensionsToTreatAsEsm: ['.ts, .tsx', '.js, .jsx'],
  maxWorkers: 1,
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test_reports',
        outputName: 'jest-junit.xml',
      },
    ],
  ],
};

export default config;
