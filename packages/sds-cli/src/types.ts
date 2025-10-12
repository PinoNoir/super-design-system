export type Framework = 'react-vite' | 'nextjs' | 'react-cra';
export type PackageManager = 'npm' | 'pnpm' | 'yarn';
export type InstallationType = 'full' | 'minimal' | 'components' | 'custom';
export type ProductType = 'bcc' | 'tsc' | 'core' | 'custom';
export type ThemeVariant = 'light' | 'dark';

export interface ProjectConfig {
  projectName: string;
  targetPath: string;
  framework: Framework;
  packageManager: PackageManager;
  installationType: InstallationType;
  useTypeScript: boolean;
  skipInstall: boolean;
  skipGit: boolean;
  customPackages?: string[];
  productType?: ProductType;
  theme?: string;
  themeVariant?: ThemeVariant;
}

export interface TemplateConfig {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
}
