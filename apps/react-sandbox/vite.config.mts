import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import createSvgSpritePlugin from 'vite-plugin-svg-sprite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({}),
    react(),
    createSvgSpritePlugin({
      exportType: 'react',
      include: '**/bcc-icon-sprite/*.svg',
    }),
  ],
  resolve: {
    alias: {
      '@api': './src/api',
      '@components': './src/components',
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      exclude: [],
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
