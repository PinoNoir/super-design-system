import React from 'react';
import { DESIGN_TOKEN_MAPPINGS } from './utils/constants';

// Create type-safe keys
export type ColorToken = keyof typeof DESIGN_TOKEN_MAPPINGS.color;
export type SpaceToken = keyof typeof DESIGN_TOKEN_MAPPINGS.space;
export type SizeToken = keyof typeof DESIGN_TOKEN_MAPPINGS.size;
export type BorderRadiusToken = keyof typeof DESIGN_TOKEN_MAPPINGS.borderRadius;
export type ShadowToken = keyof typeof DESIGN_TOKEN_MAPPINGS.shadow;
export type FontSizeToken = keyof typeof DESIGN_TOKEN_MAPPINGS.fontSize;
export type ZIndexToken = keyof typeof DESIGN_TOKEN_MAPPINGS.zIndex;

// Responsive value type
export type ResponsiveValue<T> =
  | T
  | {
      xs?: T;
      sm?: T;
      md?: T;
      lg?: T;
      xl?: T;
    };

// Sizing value type alias
export type SizingValue = SizeToken | `${number}px` | `${number}%` | 'auto' | 'fit-content';

// Box CSS props interface
export interface BoxCSSProps {
  // Layout
  display?: ResponsiveValue<'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'none'>;
  position?: ResponsiveValue<'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'>;
  gap?: ResponsiveValue<SpaceToken>;
  gridGap?: ResponsiveValue<SpaceToken>;
  gridColumnGap?: ResponsiveValue<SpaceToken>;
  gridRowGap?: ResponsiveValue<SpaceToken>;

  // Flexbox
  flexDirection?: ResponsiveValue<'row' | 'column' | 'row-reverse' | 'column-reverse'>;
  justifyContent?: ResponsiveValue<
    'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
  >;
  alignItems?: ResponsiveValue<'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'>;
  flexWrap?: ResponsiveValue<'nowrap' | 'wrap' | 'wrap-reverse'>;
  flex?: ResponsiveValue<string | number>;

  // Spacing using design tokens
  marginBlock?: ResponsiveValue<SpaceToken>;
  marginInline?: ResponsiveValue<SpaceToken>;
  p?: ResponsiveValue<SpaceToken>;
  px?: ResponsiveValue<SpaceToken>;
  py?: ResponsiveValue<SpaceToken>;
  pt?: ResponsiveValue<SpaceToken>;
  pr?: ResponsiveValue<SpaceToken>;
  pb?: ResponsiveValue<SpaceToken>;
  pl?: ResponsiveValue<SpaceToken>;

  m?: ResponsiveValue<SpaceToken>;
  mx?: ResponsiveValue<SpaceToken>;
  my?: ResponsiveValue<SpaceToken>;
  mt?: ResponsiveValue<SpaceToken>;
  mr?: ResponsiveValue<SpaceToken>;
  mb?: ResponsiveValue<SpaceToken>;
  ml?: ResponsiveValue<SpaceToken>;

  w?: ResponsiveValue<SizingValue>;
  h?: ResponsiveValue<SizingValue>;
  minW?: ResponsiveValue<SizingValue>;
  minH?: ResponsiveValue<SizingValue>;
  maxW?: ResponsiveValue<SizingValue>;
  maxH?: ResponsiveValue<SizingValue>;

  // Colors
  bg?: ResponsiveValue<ColorToken>;
  color?: ResponsiveValue<ColorToken>;
  borderColor?: ResponsiveValue<ColorToken>;

  // Border
  borderRadius?: ResponsiveValue<BorderRadiusToken>;
  borderWidth?: ResponsiveValue<string>;
  border?: ResponsiveValue<string>;

  // Effects
  boxShadow?: ResponsiveValue<ShadowToken>;
  opacity?: ResponsiveValue<number>;

  // Typography
  fontSize?: ResponsiveValue<FontSizeToken>;
  fontWeight?: ResponsiveValue<'light' | 'regular' | 'medium' | 'bold'>;
  textAlign?: ResponsiveValue<'left' | 'center' | 'right' | 'justify'>;

  // Z-index
  zIndex?: ResponsiveValue<ZIndexToken | number>;
}

export interface BoxProps extends BoxCSSProps {
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
  className?: string;
}

// Helper function to resolve design token values
function resolveTokenValue(prop: string, value: any): string {
  if (typeof value === 'string' || typeof value === 'number') {
    // Check if it's a design token
    if (prop === 'bg' || prop === 'color' || prop === 'borderColor') {
      return DESIGN_TOKEN_MAPPINGS.color[value as ColorToken] || String(value);
    }
    if (['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml', 'gap'].includes(prop)) {
      return DESIGN_TOKEN_MAPPINGS.space[value as SpaceToken] || String(value);
    }
    if (['w', 'h', 'minW', 'minH', 'maxW', 'maxH'].includes(prop)) {
      return DESIGN_TOKEN_MAPPINGS.size[value as SizeToken] || String(value);
    }
    if (prop === 'borderRadius') {
      return DESIGN_TOKEN_MAPPINGS.borderRadius[value as BorderRadiusToken] || String(value);
    }
    if (prop === 'boxShadow') {
      return DESIGN_TOKEN_MAPPINGS.shadow[value as ShadowToken] || String(value);
    }
    if (prop === 'fontSize') {
      return DESIGN_TOKEN_MAPPINGS.fontSize[value as FontSizeToken] || String(value);
    }
    if (prop === 'zIndex') {
      return DESIGN_TOKEN_MAPPINGS.zIndex[value as ZIndexToken] || String(value);
    }
    if (prop === 'fontWeight') {
      const weights = {
        light: 'var(--font-weight-light)',
        regular: 'var(--font-weight-regular)',
        medium: 'var(--font-weight-medium)',
        bold: 'var(--font-weight-bold)',
      };
      return weights[value as keyof typeof weights] || String(value);
    }
  }
  return String(value);
}

// CSS property mappings
const CSS_PROP_MAPPINGS: Record<string, string> = {
  bg: 'backgroundColor',
  w: 'width',
  h: 'height',
  minW: 'minWidth',
  minH: 'minHeight',
  maxW: 'maxWidth',
  maxH: 'maxHeight',
  p: 'padding',
  px: 'paddingInline',
  py: 'paddingBlock',
  pt: 'paddingTop',
  pr: 'paddingRight',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  m: 'margin',
  mx: 'marginInline',
  my: 'marginBlock',
  mt: 'marginTop',
  mr: 'marginRight',
  mb: 'marginBottom',
  ml: 'marginLeft',
};

// Generate responsive styles
function generateResponsiveStyles(props: BoxCSSProps): React.CSSProperties {
  const styles: React.CSSProperties = {};

  Object.entries(props).forEach(([prop, value]) => {
    if (value === undefined) return;

    const cssProp = CSS_PROP_MAPPINGS[prop] || prop;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Handle responsive values - for now, just use the base value
      // In a real implementation, you'd want to generate media queries
      const baseValue = value.xs ?? value.sm ?? value.md ?? value.lg ?? value.xl;
      if (baseValue !== undefined) {
        const resolvedValue = resolveTokenValue(prop, baseValue);
        styles[cssProp as keyof React.CSSProperties] = String(resolvedValue) as any;
      }
    } else {
      const resolvedValue = resolveTokenValue(prop, value);
      styles[cssProp as keyof React.CSSProperties] = String(resolvedValue) as any;
    }
  });

  return styles;
}

const Box = React.forwardRef<HTMLElement, BoxProps & Omit<React.HTMLAttributes<HTMLElement>, keyof BoxCSSProps>>(
  ({ as: Component = 'div', children, className, style, ...props }, ref) => {
    // Separate CSS props from HTML props
    const cssProps: BoxCSSProps = {};
    const htmlProps: Record<string, any> = {};

    const cssPropsKeys = new Set([
      'display',
      'position',
      'flexDirection',
      'justifyContent',
      'alignItems',
      'flexWrap',
      'flex',
      'p',
      'px',
      'py',
      'pt',
      'pr',
      'pb',
      'pl',
      'm',
      'mx',
      'my',
      'mt',
      'mr',
      'mb',
      'ml',
      'gap',
      'w',
      'h',
      'minW',
      'minH',
      'maxW',
      'maxH',
      'bg',
      'color',
      'borderColor',
      'borderRadius',
      'borderWidth',
      'border',
      'boxShadow',
      'opacity',
      'fontSize',
      'fontWeight',
      'textAlign',
      'zIndex',
    ]);

    Object.entries(props).forEach(([key, value]) => {
      if (cssPropsKeys.has(key)) {
        cssProps[key as keyof BoxCSSProps] = value;
      } else {
        htmlProps[key] = value;
      }
    });

    // Generate styles
    const generatedStyles = generateResponsiveStyles(cssProps);
    const combinedStyles = { ...generatedStyles, ...style };

    return React.createElement(
      Component,
      {
        ...htmlProps,
        className,
        style: combinedStyles,
        ref,
      },
      children,
    );
  },
);

Box.displayName = 'Box';

export default Box;
