import type { Framework } from '../types.js';

export function generateTsConfig(framework: Framework): object {
  const baseConfig = {
    compilerOptions: {
      target: 'ES2020',
      useDefineForClassFields: true,
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      skipLibCheck: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: 'react-jsx',
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      paths: {
        '@/*': ['./src/*']
      }
    },
    include: ['src'],
    references: [{ path: './tsconfig.node.json' }]
  };

  // Adjust for Next.js
  if (framework === 'nextjs') {
    return {
      compilerOptions: {
        ...baseConfig.compilerOptions,
        target: 'ES2017',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        noEmit: true,
        incremental: true,
        moduleResolution: 'node',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        plugins: [{ name: 'next' }],
        paths: {
          '@/*': ['./src/*']
        }
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules']
    };
  }

  return baseConfig;
}

export function generateTsConfigNode(): object {
  return {
    compilerOptions: {
      composite: true,
      skipLibCheck: true,
      module: 'ESNext',
      moduleResolution: 'bundler',
      allowSyntheticDefaultImports: true
    },
    include: ['vite.config.ts']
  };
}
