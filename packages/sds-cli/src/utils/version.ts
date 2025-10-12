import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface SDSVersions {
  'sds-ui'?: string;
  'sds-styles'?: string;
  'sds-tokens'?: string;
  'mui-themes'?: string;
}

/**
 * Detects the latest versions of SDS packages from the monorepo
 * Falls back to package versions if running from published package
 */
export async function detectSDSVersions(): Promise<SDSVersions> {
  const versions: SDSVersions = {};

  // Try to read from monorepo structure first
  const monorepoRoot = path.resolve(__dirname, '../../../../');
  const packagesDir = path.join(monorepoRoot, 'packages');

  const packages = ['sds-ui', 'sds-styles', 'sds-tokens', 'mui-themes'];

  for (const pkg of packages) {
    try {
      const packageJsonPath = path.join(packagesDir, pkg, 'package.json');

      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath);
        versions[pkg as keyof SDSVersions] = packageJson.version;
      } else {
        // Fallback to default version
        versions[pkg as keyof SDSVersions] = '^2.0.0';
      }
    } catch (error) {
      // Use default version if detection fails
      versions[pkg as keyof SDSVersions] = '^2.0.0';
    }
  }

  return versions;
}

/**
 * Gets the CLI version
 */
export async function getCLIVersion(): Promise<string> {
  try {
    const cliPackageJsonPath = path.resolve(__dirname, '../../package.json');
    const cliPackageJson = await fs.readJson(cliPackageJsonPath);
    return cliPackageJson.version;
  } catch (error) {
    return '1.0.0';
  }
}

/**
 * Formats versions for display
 */
export function formatVersions(versions: SDSVersions): string {
  return Object.entries(versions)
    .map(([pkg, version]) => `  ${pkg}: ${version}`)
    .join('\n');
}
