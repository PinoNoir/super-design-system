import { execSync } from 'child_process';
import { paths, themes } from './config.js';
import { logger } from '../../../scripts/utils/logger.js';

export function clean() {
  execSync('rimraf ./lib', { stdio: 'inherit' });
}

export function compile(theme) {
  execSync(`sass --no-source-map ${paths.src[theme]}:${paths.lib[theme]}/global.css --style expanded`, {
    stdio: 'inherit',
  });
}

export function prefix(theme) {
  execSync(
    `postcss ${paths.lib[theme]}/global.css -u autoprefixer -b "last 10 versions" -o ${paths.lib[theme]}/global.prefixed.css`,
    { stdio: 'inherit' },
  );
}

export function compress(theme) {
  execSync(
    `sass --no-source-map ${paths.lib[theme]}/global.prefixed.css:${paths.lib[theme]}/global.min.css --style compressed`,
    { stdio: 'inherit' },
  );
}

export function buildTheme(theme) {
  compile(theme);
  prefix(theme);
  compress(theme);
}

export function buildAll() {
  logger.styles('Compiling all CSS themes...');
  clean();
  themes.forEach(buildTheme);
  logger.success('All CSS themes compiled successfully! 🎉');
}

if (process.argv[2]) {
  const command = process.argv[2];
  const theme = process.argv[3];

  try {
    switch (command) {
      case 'buildAll':
        buildAll();
        break;
      case 'buildTheme':
        if (!theme) {
          logger.error('Theme name is required for buildTheme command');
          process.exit(1);
        }
        buildTheme(theme);
        break;
      case 'clean':
        clean();
        break;
      default:
        logger.error('Unknown command: ' + command);
        process.exit(1);
    }
  } catch (error) {
    logger.error(`Build failed: ${error.message}`);
    process.exit(1);
  }
}
