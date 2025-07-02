import { execSync } from 'child_process';
import { logger } from '../../../scripts/utils/logger.js';

function runCommand(script) {
  try {
    execSync(`pnpm ${script}`, { stdio: 'inherit' });
    return true;
  } catch (err) {
    logger.error(`Command failed: pnpm ${script}`);
    logger.error(`Error: ${err.message}`);
    return false;
  }
}

async function build() {
  try {
    logger.start(' Building SDS React components...');

    // Clean
    logger.clean('Cleaning previous build...');
    if (!runCommand('clean:lib')) {
      throw new Error('Failed to clean lib directory');
    }

    // Build library
    logger.build('Building library...');
    if (!runCommand('build:lib')) {
      throw new Error('Failed to build library');
    }

    logger.success('SDS React components built successfully! 🎉');
  } catch (error) {
    logger.error(`Build failed: ${error.message}`);
    process.exit(1);
  }
}

// Execute the build process
build().catch((error) => {
  logger.error(`Build failed: ${error.message}`);
  process.exit(1);
});
