import { DEFAULT_EXTENSIONS } from '@babel/core';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import { nodeExternals } from 'rollup-plugin-node-externals';
import typescript from 'rollup-plugin-typescript2';

import postcssEnv from 'postcss-preset-env';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';

const isProduction = process.env.NODE_ENV === 'production';
const tsconfig = './tsconfig.json';
const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];
const sourceMap = true;

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
};

const external = [/node_modules/, 'react', 'react-dom', /@radix-ui\/.*/];

/** @type {import('rollup').RollupOptions} */
const config = {
  input: {
    index: './src/index.ts'
  },
  treeshake: false,
  preserveSymlinks: true,
  output: {
    dir: 'lib',
    format: 'esm',
    globals,
    sourcemap: sourceMap,
    exports: 'named',
    generatedCode: {
      constBindings: true,
    },
    preserveModules: true,
    preserveModulesRoot: 'src',
    assetFileNames: (assetInfo) => {
      // Handle CSS files specifically
      if (assetInfo.names[0]?.endsWith('.css')) {
        // Get the original source file path from originalFileNames
        const originalFile = assetInfo.originalFileNames[0];

        if (originalFile) {
          return originalFile.replace(/^src\//, '').replace(/\.module\.css$/, '.css');
        }
      }
      return 'assets/[name]-[hash][extname]';
    },
  },
  external,
  plugins: [
    nodeExternals({
      deps: true,
      devDeps: false,
      peerDeps: true,
    }),
    resolve({
      extensions,
      preferBuiltins: true,
      mainFields: ['module', 'main', 'browser'],
    }),
    postcss({
      plugins: [postcssEnv(), autoprefixer(), cssnano()],
      namedExports: true,
      modules: {
        generateScopedName: isProduction ? '[hash:base64:8]' : '[name]__[local]___[hash:base64:5]',
        writeDefinitions: true,
        localsConvention: 'camelCaseOnly',
      },
      extract: true,
      sourceMap,
    }),
    typescript({
      tsconfig,
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          module: 'ESNext',
          target: 'ES2022',
          declaration: true,
          declarationMap: true,
          sourceMap: true,
        },
        exclude: [
          '**/*.stories.tsx',
          'src/mocks/**',
          'src/docs/**',
          'src/database/**',
          'src/utilities/**',
          '**/*.test.tsx',
          '**/*.test.ts',
          '**/*setup-tests.ts',
        ],
      },
    }),
    babel({
      extensions: [...DEFAULT_EXTENSIONS],
      babelHelpers: 'bundled',
      exclude: ['**/node_modules/**', '**/*.css', '**/*.stories.tsx', 'src/public/**', './__mocks__/**'],
      presets: [['@babel/preset-env', { modules: false }], '@babel/preset-react', '@babel/preset-typescript'],
      sourceMap,
    }),
    commonjs({
      include: /node_modules/,
      sourceMap,
    }),
    copy({
      targets: [{ src: 'public/*.svg', dest: 'lib/public' }],
      flatten: false,
    }),
    image(),
    ...(isProduction ? [terser()] : []),
  ],
};

export default config;
