import validateNpmPackageName from 'validate-npm-package-name';
import fs from 'fs-extra';
import path from 'path';

export function validateProjectName(name: string): { valid: boolean; problems?: string[] } {
  const validation = validateNpmPackageName(name);

  if (!validation.validForNewPackages) {
    return {
      valid: false,
      problems: [
        ...(validation.errors || []),
        ...(validation.warnings || [])
      ]
    };
  }

  return { valid: true };
}

export function validateProjectPath(targetPath: string): { valid: boolean; error?: string } {
  if (fs.existsSync(targetPath)) {
    const files = fs.readdirSync(targetPath);

    if (files.length > 0) {
      return {
        valid: false,
        error: `Directory ${path.basename(targetPath)} already exists and is not empty.`
      };
    }
  }

  return { valid: true };
}

export function detectPackageManager(): 'npm' | 'pnpm' | 'yarn' {
  const userAgent = process.env.npm_config_user_agent || '';

  if (userAgent.includes('pnpm')) {
    return 'pnpm';
  }

  if (userAgent.includes('yarn')) {
    return 'yarn';
  }

  return 'npm';
}
