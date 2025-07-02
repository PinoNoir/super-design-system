import StyleDictionary from 'style-dictionary';
import {
  logBrokenReferenceLevels,
  logVerbosityLevels,
  logWarningLevels,
  formats,
  transformGroups,
} from 'style-dictionary/enums';
import { logger } from '../../../scripts/utils/logger.js';

const CONFIG = {
  log: {
    warnings: logWarningLevels.warn,
    verbosity: logVerbosityLevels.silent,
    errors: {
      brokenReferences: logBrokenReferenceLevels.throw,
    },
  },
  parsers: [
    {
      pattern: /\.js$/,
      parse: ({ filePath }) => {
        return import(filePath).then((module) => module.default || module);
      },
    },
  ],
};

async function buildTokens() {
  const brands = ['bcc', 'tsc', 'core'];
  const themes = ['light', 'dark'];
  // Define special themes that only apply to specific brands
  const specialThemes = {
    tsc: ['legacy'],
  };

  try {
    // Build global base tokens once
    logger.start(' Building global design tokens...');
    const globalBaseSD = new StyleDictionary({
      ...CONFIG,
      source: ['src/tokens/base/**/*.js'],
      platforms: {
        css: {
          transformGroup: transformGroups.css,
          buildPath: 'lib/css/',
          files: [
            {
              destination: 'base.css',
              format: formats.cssVariables,
              options: {
                showFileHeader: true,
                selector: ':root, :host',
              },
            },
          ],
        },
      },
    });

    await globalBaseSD.buildPlatform('css');

    // Build brand-specific theme tokens
    for (const brand of brands) {
      logger.start(` Building design tokens for ${brand}...`);

      // Standard themes (light/dark)
      for (const theme of themes) {
        const isLight = theme === 'light';

        try {
          const themePattern = isLight ? '**/!(dark).js' : '**/dark.js';
          const sourcePattern = `src/tokens/theme/${brand}/${themePattern}`;

          const sd = new StyleDictionary({
            ...CONFIG,
            source: ['src/tokens/base/**/*.js', sourcePattern],
            platforms: {
              css: {
                transformGroup: transformGroups.css,
                buildPath: `lib/css/${brand}/`,
                files: [
                  {
                    destination: `${brand}-${theme}.css`,
                    format: formats.cssVariables,
                    filter: (token) => {
                      const isBrandToken = token.filePath.includes(`/theme/${brand}/`);
                      const isCorrectTheme = isLight
                        ? !token.filePath.includes('dark.js')
                        : token.filePath.includes('dark.js');
                      return isBrandToken && isCorrectTheme;
                    },
                    options: {
                      showFileHeader: true,
                      selector: `:root[data-theme="${brand}-${theme}"], :host([data-theme="${brand}-${theme}"])`,
                      outputReferences: true,
                      outputReferenceFallbacks: true,
                    },
                  },
                ],
              },
            },
          });

          await sd.buildPlatform('css');
        } catch (error) {
          logger.error(`Error building ${theme} theme for ${brand}:`, error);
          throw error;
        }
      }

      // Special themes (like legacy) specific to certain brands
      if (specialThemes[brand]) {
        for (const specialTheme of specialThemes[brand]) {
          try {
            const sourcePattern = `src/tokens/theme/${brand}/${specialTheme}.js`;

            const sd = new StyleDictionary({
              ...CONFIG,
              source: ['src/tokens/base/**/*.js', sourcePattern],
              platforms: {
                css: {
                  transformGroup: transformGroups.css,
                  buildPath: `lib/css/${brand}/`,
                  files: [
                    {
                      destination: `${brand}-${specialTheme}.css`,
                      format: formats.cssVariables,
                      filter: (token) => {
                        return token.filePath.includes(`${specialTheme}.js`);
                      },
                      options: {
                        showFileHeader: true,
                        selector: `:root[data-theme="${brand}-${specialTheme}"], :host([data-theme="${brand}-${specialTheme}"])`,
                        outputReferences: true,
                        outputReferenceFallbacks: true,
                      },
                    },
                  ],
                },
              },
            });

            await sd.buildPlatform('css');
            logger.success(`Built ${specialTheme} theme for ${brand} successfully!`);
          } catch (error) {
            logger.error(`Error building ${specialTheme} theme for ${brand}:`, error);
            throw error;
          }
        }
      }
    }

    logger.success('All design tokens built successfully! 🎉');
  } catch (error) {
    logger.error('\n Build failed:', error);
    process.exit(1);
  }
}

buildTokens();

export default buildTokens;
