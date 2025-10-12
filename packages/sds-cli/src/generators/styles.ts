import type { ProductType } from '../types.js';

/**
 * Generates global.css file with product-specific imports
 */
export function generateGlobalCss(productType?: ProductType, hasComponents?: boolean): string {
  // Determine the styles import based on product type
  let stylesImport = '';

  switch (productType) {
    case 'bcc':
      stylesImport = "@import '@pinonoir/sds-styles/bcc';";
      break;
    case 'tsc':
      stylesImport = "@import '@pinonoir/sds-styles/tsc';";
      break;
    case 'core':
      stylesImport = "@import '@pinonoir/sds-styles/core';";
      break;
    case 'custom':
    default:
      // Use default styles if custom or no product type specified
      stylesImport = "@import '@pinonoir/sds-styles';";
      break;
  }

  // Add component styles if components are included
  const componentImport = hasComponents ? "\n@import '@pinonoir/sds-ui/component-styles';" : '';

  const productComment = productType && productType !== 'custom'
    ? `/* ${productType.toUpperCase()} Product Styles */\n`
    : '/* Super Design System Styles */\n';

  return `${productComment}${stylesImport}${componentImport}
`;
}
