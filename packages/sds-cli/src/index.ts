import { Command } from 'commander';
import path from 'path';
import { promptForProjectConfig } from './prompts/index.js';
import { validateProjectPath } from './utils/validation.js';
import { logger } from './utils/logger.js';
import { createProject } from './installers/project.js';
import { installDependencies, initializeGit } from './installers/dependencies.js';
import type { ProjectConfig } from './types.js';

const program = new Command();

program
  .name('sds')
  .description('CLI tool for creating Super Design System projects')
  .version('1.0.0');

program
  .command('create [project-name]')
  .description('Create a new SDS project')
  .option('-t, --template <template>', 'Template to use (react-vite, nextjs, react-cra)')
  .option('--full', 'Install all SDS packages')
  .option('--minimal', 'Install minimal SDS packages (tokens & styles)')
  .option('--components', 'Install only component library')
  .option('--typescript', 'Use TypeScript (default: true)')
  .option('--javascript', 'Use JavaScript instead of TypeScript')
  .option('--skip-install', 'Skip dependency installation')
  .option('--skip-git', 'Skip git initialization')
  .option('-pm, --package-manager <pm>', 'Package manager to use (npm, pnpm, yarn)')
  .action(async (projectName: string | undefined, options) => {
    try {
      logger.banner();

      // Build config from options or prompt
      const config = await buildConfig(projectName, options);

      // Validate project path
      const pathValidation = validateProjectPath(config.targetPath);
      if (!pathValidation.valid) {
        logger.error(pathValidation.error || 'Invalid project path');
        process.exit(1);
      }

      // Create project
      await createProject(config);

      // Install dependencies
      if (!config.skipInstall) {
        await installDependencies(config.targetPath, config.packageManager);
      }

      // Initialize git
      if (!config.skipGit) {
        await initializeGit(config.targetPath);
      }

      // Success message
      logger.nextSteps(config.projectName, config.packageManager);
    } catch (error) {
      logger.error('Failed to create project');
      console.error(error);
      process.exit(1);
    }
  });

program.parse();

async function buildConfig(
  projectName: string | undefined,
  options: any
): Promise<ProjectConfig> {
  // If we have all required options, build config directly
  if (projectName && options.template && hasInstallationType(options)) {
    const targetPath = path.join(process.cwd(), projectName);

    return {
      projectName,
      targetPath,
      framework: options.template,
      packageManager: options.packageManager || 'pnpm',
      installationType: getInstallationType(options),
      useTypeScript: !options.javascript,
      skipInstall: options.skipInstall || false,
      skipGit: options.skipGit || false
    };
  }

  // Otherwise, use interactive prompts
  return await promptForProjectConfig(projectName);
}

function hasInstallationType(options: any): boolean {
  return !!(options.full || options.minimal || options.components);
}

function getInstallationType(options: any): ProjectConfig['installationType'] {
  if (options.full) return 'full';
  if (options.minimal) return 'minimal';
  if (options.components) return 'components';
  return 'full';
}
