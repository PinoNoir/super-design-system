import path from 'path';
import fs from 'fs-extra';
import ora from 'ora';
import type { ProjectConfig, TemplateConfig } from '../types.js';
import { ensureDirectory, writeJsonFile } from '../utils/file-system.js';
import { generatePackageJson } from '../generators/package-json.js';
import { generateTsConfig, generateTsConfigNode } from '../generators/tsconfig.js';
import { generateProvidersComponent, generateAppComponent } from '../generators/providers.js';
import { generateGlobalCss } from '../generators/styles.js';
import { detectSDSVersions, type SDSVersions } from '../utils/version.js';

export async function createProject(config: ProjectConfig): Promise<void> {
  const spinner = ora('Creating project structure...').start();

  try {
    // Create project directory
    await ensureDirectory(config.targetPath);

    // Detect SDS package versions
    const sdsVersions = await detectSDSVersions();

    // Get template configuration
    const templateConfig = getTemplateConfig(config.framework);

    // Generate and write package.json with detected versions
    const packageJson = generatePackageJson(config, templateConfig, sdsVersions);
    await writeJsonFile(path.join(config.targetPath, 'package.json'), packageJson);

    // Create source directory
    const srcPath = path.join(config.targetPath, 'src');
    await ensureDirectory(srcPath);

    // Generate TypeScript config if needed
    if (config.useTypeScript) {
      const tsConfig = generateTsConfig(config.framework);
      await writeJsonFile(path.join(config.targetPath, 'tsconfig.json'), tsConfig);

      if (config.framework === 'react-vite') {
        const tsConfigNode = generateTsConfigNode();
        await writeJsonFile(path.join(config.targetPath, 'tsconfig.node.json'), tsConfigNode);
      }
    }

    // Create framework-specific files
    await createFrameworkFiles(config, srcPath);

    // Create .gitignore
    await createGitignore(config.targetPath);

    // Create README
    await createReadme(config.targetPath, config.projectName);

    spinner.succeed('Project structure created');
  } catch (error) {
    spinner.fail('Failed to create project structure');
    throw error;
  }
}

async function createFrameworkFiles(config: ProjectConfig, srcPath: string): Promise<void> {
  const ext = config.useTypeScript ? 'tsx' : 'jsx';

  // Determine if components are included
  const hasComponents =
    config.installationType === 'full' ||
    config.installationType === 'components' ||
    (config.installationType === 'custom' && config.customPackages?.includes('@pinonoir/sds-ui'));

  // Create global.css with product-specific styles
  const globalCssContent = generateGlobalCss(config.productType, hasComponents);
  await fs.writeFile(path.join(srcPath, 'global.css'), globalCssContent);

  // Create providers component with theme configuration
  const providersContent = generateProvidersComponent(
    config.useTypeScript,
    config.theme,
    config.productType
  );
  await fs.writeFile(
    path.join(srcPath, `Providers.${ext}`),
    providersContent
  );

  if (config.framework === 'react-vite') {
    // Create Vite config
    await createViteConfig(config.targetPath, config.useTypeScript);

    // Create main entry file
    await createViteMain(srcPath, config.useTypeScript);

    // Create App component
    const appContent = generateAppComponent('react-vite', config.useTypeScript);
    await fs.writeFile(path.join(srcPath, `App.${ext}`), appContent);

    // Create index.html
    await createIndexHtml(config.targetPath, config.projectName);

    // Create basic CSS
    await createAppCss(srcPath);
  } else if (config.framework === 'nextjs') {
    // Create Next.js specific files
    await createNextConfig(config.targetPath);
    await createNextLayout(srcPath, config.useTypeScript);
    await createNextPage(srcPath, config.useTypeScript);
  }
}

function getTemplateConfig(framework: string): TemplateConfig {
  const baseConfig: TemplateConfig = {
    dependencies: {
      'react': '^18.3.1',
      'react-dom': '^18.3.1'
    },
    devDependencies: {},
    scripts: {}
  };

  if (framework === 'react-vite') {
    return {
      ...baseConfig,
      devDependencies: {
        ...baseConfig.devDependencies,
        '@vitejs/plugin-react': '^4.3.4',
        'vite': '^6.2.6',
        'vite-tsconfig-paths': '^5.1.4'
      },
      scripts: {
        'dev': 'vite',
        'build': 'vite build',
        'preview': 'vite preview'
      }
    };
  }

  if (framework === 'nextjs') {
    return {
      dependencies: {
        ...baseConfig.dependencies,
        'next': '^15.1.4'
      },
      devDependencies: {},
      scripts: {
        'dev': 'next dev',
        'build': 'next build',
        'start': 'next start',
        'lint': 'next lint'
      }
    };
  }

  return baseConfig;
}

async function createViteConfig(targetPath: string, useTypeScript: boolean): Promise<void> {
  const ext = useTypeScript ? 'ts' : 'js';
  const content = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3000
  }
});
`;

  await fs.writeFile(path.join(targetPath, `vite.config.${ext}`), content);
}

async function createViteMain(srcPath: string, useTypeScript: boolean): Promise<void> {
  const ext = useTypeScript ? 'tsx' : 'jsx';
  const content = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Providers from './Providers';
import './global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
);
`;

  await fs.writeFile(path.join(srcPath, `main.${ext}`), content);
}

async function createIndexHtml(targetPath: string, projectName: string): Promise<void> {
  const content = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

  await fs.writeFile(path.join(targetPath, 'index.html'), content);
}

async function createAppCss(srcPath: string): Promise<void> {
  const content = `.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  font-size: 3rem;
  margin-bottom: 2rem;
}
`;

  await fs.writeFile(path.join(srcPath, 'App.css'), content);
}

async function createNextConfig(targetPath: string): Promise<void> {
  const content = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
`;

  await fs.writeFile(path.join(targetPath, 'next.config.js'), content);
}

async function createNextLayout(srcPath: string, useTypeScript: boolean): Promise<void> {
  const appDir = path.join(srcPath, 'app');
  await ensureDirectory(appDir);

  const ext = useTypeScript ? 'tsx' : 'jsx';
  const content = `import Providers from '../Providers';
import '../global.css';
import type { Metadata } from 'next';

export const metadata${useTypeScript ? ': Metadata' : ''} = {
  title: 'SDS App',
  description: 'Created with Super Design System CLI',
};

export default function RootLayout({
  children,
}${useTypeScript ? ': { children: React.ReactNode }' : ''}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
`;

  await fs.writeFile(path.join(appDir, `layout.${ext}`), content);
}

async function createNextPage(srcPath: string, useTypeScript: boolean): Promise<void> {
  const appDir = path.join(srcPath, 'app');
  await ensureDirectory(appDir);

  const ext = useTypeScript ? 'tsx' : 'jsx';
  const content = generateAppComponent('nextjs', useTypeScript);

  await fs.writeFile(path.join(appDir, `page.${ext}`), content);
}

async function createGitignore(targetPath: string): Promise<void> {
  const content = `# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage

# Production
build
dist
.next
out

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode
.idea
*.swp
*.swo
*~
`;

  await fs.writeFile(path.join(targetPath, '.gitignore'), content);
}

async function createReadme(targetPath: string, projectName: string): Promise<void> {
  const content = `# ${projectName}

Created with [@pinonoir/sds-cli](https://www.npmjs.com/package/@pinonoir/sds-cli)

## Getting Started

Install dependencies:

\`\`\`bash
npm install
# or
pnpm install
# or
yarn install
\`\`\`

Run the development server:

\`\`\`bash
npm run dev
# or
pnpm dev
# or
yarn dev
\`\`\`

## Super Design System

This project uses the Super Design System for UI components and styling.

- [SDS Documentation](https://github.com/your-org/super-design-system)
- [Component Library](https://github.com/your-org/super-design-system/tree/main/packages/sds-ui)

## Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Next.js Documentation](https://nextjs.org/docs)
`;

  await fs.writeFile(path.join(targetPath, 'README.md'), content);
}
