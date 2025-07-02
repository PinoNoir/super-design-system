import { logger } from './utils/spinner.js';
import { BUILD_ORDER, runInWorkspace } from './utils/workspace.js';
import { sleep } from './utils/common.js';

async function buildAll() {
  logger.title('🚀 SDS Monorepo Build Process');

  const mainSpinner = await logger.start('Preparing build environment...');
  await sleep(500); // Give visual feedback
  await logger.success(mainSpinner, 'Build environment ready');

  for (const pkg of BUILD_ORDER) {
    const pkgSpinner = await logger.start(`Building ${pkg} package...`);

    if (!runInWorkspace('build', pkg)) {
      await logger.error(pkgSpinner, `Failed to build ${pkg} package`);
      process.exit(1);
    }

    await logger.success(pkgSpinner, `${pkg} package built successfully! 📦`);
  }

  logger.title('✨ All packages built successfully! ✨');
}

// Execute the build process
buildAll().catch(async (error) => {
  const errorSpinner = await logger.start('Build process failed');
  await logger.error(errorSpinner, `Build failed: ${error.message}`);
  process.exit(1);
});
