/* eslint-disable no-console */
import { execSync } from 'child_process';

export const BUILD_ORDER = ['sds-tokens', 'sds-styles', 'sds-ui', 'mui-themes', 'sds-cli'];

export const runInWorkspace = (command, workspace) => {
  const cmd = workspace ? `pnpm --filter ${workspace} ${command}` : `pnpm -r ${command}`;

  try {
    // Changed stdio to 'inherit' to see all output including errors
    execSync(cmd, {
      stdio: 'inherit',
      encoding: 'utf8',
    });
    return true;
  } catch (error) {
    // Log the actual error details
    console.error(`❌ Command failed: ${cmd}`);
    console.error(`Exit code: ${error.status}`);

    // If there's stderr output, show it
    if (error.stderr) {
      console.error('STDERR:', error.stderr.toString());
    }

    // If there's stdout output, show it
    if (error.stdout) {
      console.error('STDOUT:', error.stdout.toString());
    }

    return false;
  }
};

// Alternative version with more detailed logging
export const runInWorkspaceVerbose = (command, workspace) => {
  const cmd = workspace ? `pnpm --filter ${workspace} ${command}` : `pnpm -r ${command}`;

  console.log(`🔧 Running: ${cmd}`);

  try {
    execSync(cmd, {
      stdio: 'inherit',
      encoding: 'utf8',
    });

    console.log(`✅ Success: ${workspace || 'all workspaces'}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed: ${workspace || 'all workspaces'}`);
    console.error(`Command: ${cmd}`);
    console.error(`Exit code: ${error.status || 'unknown'}`);

    // More detailed error information
    if (error.message) {
      console.error('Error message:', error.message);
    }

    return false;
  }
};
