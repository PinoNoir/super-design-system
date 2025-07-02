import { execSync } from 'child_process';
import { paths, themes } from './config.js';
import { logger } from './logger.js';

export function watch(theme) {
  logger.watch(`Starting watch mode for ${theme.toUpperCase()} theme...`);
  execSync(`sass --watch ${paths.src[theme]}:${paths.lib[theme]}`, { stdio: 'inherit' });
}

export function watchAll() {
  logger.watch('Starting watch mode for all themes...');
  themes.forEach((theme) => {
    watch(theme);
  });
}

if (process.argv[2]) {
  const command = process.argv[2];
  const theme = process.argv[3];

  try {
    switch (command) {
      case 'watch':
        if (!theme) {
          logger.error('Theme name is required for watch command');
          process.exit(1);
        }
        watch(theme);
        break;
      case 'watchAll':
        watchAll();
        break;
      default:
        logger.error('Unknown command: ' + command);
        process.exit(1);
    }
  } catch (error) {
    logger.error(`Watch failed: ${error.message}`);
    process.exit(1);
  }
}
