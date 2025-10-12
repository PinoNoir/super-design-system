import inquirer from 'inquirer';
import { validateProjectName, detectPackageManager } from '../utils/validation.js';
import type {
  ProjectConfig,
  Framework,
  PackageManager,
  InstallationType,
  ProductType,
  ThemeVariant,
} from '../types.js';

export async function promptForProjectConfig(projectName?: string): Promise<ProjectConfig> {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: projectName || 'my-sds-app',
      when: !projectName,
      validate: (input: string) => {
        const validation = validateProjectName(input);
        if (!validation.valid) {
          return validation.problems?.join('\n') || 'Invalid project name';
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'framework',
      message: 'Select a framework:',
      choices: [
        { name: 'React + Vite', value: 'react-vite' },
        { name: 'Next.js (App Router)', value: 'nextjs' },
        { name: 'React (Create React App)', value: 'react-cra' },
      ],
      default: 'react-vite',
    },
    {
      type: 'list',
      name: 'installationType',
      message: 'Installation type:',
      choices: [
        { name: 'Full (All packages: UI Components, Styles, Tokens, Themes)', value: 'full' },
        { name: 'Minimal (Styles only - no components)', value: 'minimal' },
        { name: 'Components (UI Components + Styles)', value: 'components' },
        { name: 'Custom (Choose packages)', value: 'custom' },
      ],
      default: 'full',
    },
    {
      type: 'checkbox',
      name: 'customPackages',
      message: 'Select packages to install:',
      when: (answers) => answers.installationType === 'custom',
      choices: [
        { name: 'sds-tokens (Design tokens)', value: '@pinonoir/sds-tokens', checked: true },
        { name: 'sds-styles (CSS framework)', value: '@pinonoir/sds-styles', checked: true },
        { name: 'sds-ui (React components)', value: '@pinonoir/sds-ui', checked: true },
        { name: 'mui-themes (Material-UI themes)', value: '@pinonoir/mui-themes' },
      ],
      validate: (input: string[]) => {
        if (input.length === 0) {
          return 'Please select at least one package';
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'productType',
      message: 'Which product is this application for?',
      choices: [
        { name: 'BCC (Best Case Cloud)', value: 'bcc' },
        { name: 'TSC (Trustee Suite Cloud)', value: 'tsc' },
        { name: 'CORE (Corporate Restructuring)', value: 'core' },
        { name: "Custom (I'll configure my own theme)", value: 'custom' },
      ],
      default: 'tsc',
      when: (answers) =>
        answers.installationType === 'full' ||
        answers.installationType === 'components' ||
        (answers.installationType === 'custom' && answers.customPackages?.includes('@pinonoir/sds-ui')),
    },
    {
      type: 'list',
      name: 'themeVariant',
      message: 'Select theme variant:',
      choices: [
        { name: 'Light', value: 'light' },
        { name: 'Dark', value: 'dark' },
      ],
      default: 'light',
      when: (answers) => answers.productType && answers.productType !== 'custom',
    },
    {
      type: 'input',
      name: 'customTheme',
      message: 'Enter your custom theme name:',
      default: 'default-light',
      when: (answers) => answers.productType === 'custom',
    },
    {
      type: 'list',
      name: 'packageManager',
      message: 'Select a package manager:',
      choices: ['pnpm', 'npm', 'yarn'],
      default: detectPackageManager(),
    },
    {
      type: 'confirm',
      name: 'useTypeScript',
      message: 'Use TypeScript?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'initGit',
      message: 'Initialize git repository?',
      default: true,
    },
  ]);

  const finalProjectName = projectName || answers.projectName;
  const targetPath = process.cwd() + '/' + finalProjectName;

  // Determine the theme based on product type and variant
  let theme: string | undefined;
  if (answers.productType === 'custom') {
    theme = answers.customTheme;
  } else if (answers.productType && answers.themeVariant) {
    theme = `${answers.productType}-${answers.themeVariant}`;
  }

  return {
    projectName: finalProjectName,
    targetPath,
    framework: answers.framework as Framework,
    packageManager: answers.packageManager as PackageManager,
    installationType: answers.installationType as InstallationType,
    useTypeScript: answers.useTypeScript,
    skipInstall: false,
    skipGit: !answers.initGit, // Invert here: if user said yes to init, we should NOT skip
    customPackages: answers.customPackages,
    productType: answers.productType as ProductType,
    theme,
    themeVariant: answers.themeVariant as ThemeVariant,
  };
}
