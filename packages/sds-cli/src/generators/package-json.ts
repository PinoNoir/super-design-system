import type { ProjectConfig, TemplateConfig } from '../types.js';
import type { SDSVersions } from '../utils/version.js';

export function generatePackageJson(
  config: ProjectConfig,
  templateConfig: TemplateConfig,
  sdsVersions?: SDSVersions
): object {
  const { projectName, useTypeScript } = config;

  const basePackageJson = {
    name: projectName,
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: {
      ...templateConfig.scripts
    },
    dependencies: {
      ...getSDSDependencies(config, sdsVersions),
      ...templateConfig.dependencies
    },
    devDependencies: {
      ...templateConfig.devDependencies
    }
  };

  if (useTypeScript) {
    basePackageJson.devDependencies = {
      ...basePackageJson.devDependencies,
      '@types/node': '^22.17.0',
      '@types/react': '^18.3.20',
      '@types/react-dom': '^18.3.6',
      'typescript': '^5.8.3'
    };
  }

  return basePackageJson;
}

function getSDSDependencies(
  config: ProjectConfig,
  sdsVersions?: SDSVersions
): Record<string, string> {
  const { installationType, customPackages } = config;

  const dependencies: Record<string, string> = {};

  // Helper to get version with fallback
  const getVersion = (pkg: keyof SDSVersions) => {
    return sdsVersions?.[pkg] ? `^${sdsVersions[pkg]}` : '^2.0.0';
  };

  switch (installationType) {
    case 'full':
      dependencies['@pinonoir/sds-tokens'] = getVersion('sds-tokens');
      dependencies['@pinonoir/sds-styles'] = getVersion('sds-styles');
      dependencies['@pinonoir/sds-ui'] = getVersion('sds-ui');
      dependencies['@pinonoir/mui-themes'] = getVersion('mui-themes');
      break;

    case 'minimal':
      // Just styles (tokens are a dependency of styles)
      dependencies['@pinonoir/sds-styles'] = getVersion('sds-styles');
      break;

    case 'components':
      // UI components + styles (components need styles to work)
      dependencies['@pinonoir/sds-ui'] = getVersion('sds-ui');
      dependencies['@pinonoir/sds-styles'] = getVersion('sds-styles');
      break;

    case 'custom':
      if (customPackages) {
        for (const pkg of customPackages) {
          const pkgName = pkg.replace('@pinonoir/', '') as keyof SDSVersions;
          dependencies[pkg] = getVersion(pkgName);
        }
      }
      break;
  }

  return dependencies;
}
