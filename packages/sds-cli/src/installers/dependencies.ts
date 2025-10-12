import { execa } from 'execa';
import ora from 'ora';
import type { PackageManager } from '../types.js';
import { logger } from '../utils/logger.js';

export async function installDependencies(
  projectPath: string,
  packageManager: PackageManager
): Promise<void> {
  const spinner = ora('Installing dependencies...').start();

  try {
    const installCommand = getInstallCommand(packageManager);

    await execa(installCommand.command, installCommand.args, {
      cwd: projectPath,
      stdio: 'pipe'
    });

    spinner.succeed('Dependencies installed successfully');
  } catch (error) {
    spinner.fail('Failed to install dependencies');

    // Check if it's a workspace protocol error
    const errorMessage = error instanceof Error ? error.message : '';
    if (errorMessage.includes('workspace:')) {
      logger.error('Workspace protocol error detected.');
      logger.warning('This happens when testing with unpublished packages.');
      logger.info('Solutions:');
      logger.info('  1. Use pnpm as your package manager (it supports workspace:)');
      logger.info('  2. Use --skip-install flag and install dependencies manually');
      logger.info('  3. Wait until packages are published to npm');
    } else {
      logger.error(errorMessage || 'Unknown error occurred');
    }

    throw error;
  }
}

function getInstallCommand(packageManager: PackageManager): {
  command: string;
  args: string[];
} {
  switch (packageManager) {
    case 'pnpm':
      return { command: 'pnpm', args: ['install'] };
    case 'yarn':
      return { command: 'yarn', args: [] };
    case 'npm':
    default:
      return { command: 'npm', args: ['install'] };
  }
}

export async function initializeGit(projectPath: string): Promise<void> {
  const spinner = ora('Initializing git repository...').start();

  try {
    await execa('git', ['init'], { cwd: projectPath });
    await execa('git', ['add', '-A'], { cwd: projectPath });
    await execa('git', ['commit', '-m', 'Initial commit from @pinonoir/sds-cli'], {
      cwd: projectPath
    });

    spinner.succeed('Git repository initialized');
  } catch (error) {
    spinner.fail('Failed to initialize git repository');
    logger.warning('You can manually initialize git later with: git init');
  }
}
