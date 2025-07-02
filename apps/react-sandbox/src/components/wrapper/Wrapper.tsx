import React, { useState, useEffect } from 'react';
import styles from './Wrapper.module.css';

// Basic types
type Direction = 'row' | 'column';
type Alignment = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
type ElementType = React.ElementType;
type Breakpoint = 'mobile' | 'tablet' | 'desktop';

// Column width types
type NumericWidth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type ColumnWidth = NumericWidth | 'auto' | 'equal';

// Responsive object type
interface ResponsiveObject<T> {
  mobile?: T;
  tablet?: T;
  desktop?: T;
}

// Responsive value type
type ResponsiveValue<T> = T | ResponsiveObject<T>;

// Main Wrapper props
interface WrapperProps {
  // Layout properties with responsive options
  direction?: ResponsiveValue<Direction>;
  align?: ResponsiveValue<Alignment>;
  justify?: ResponsiveValue<Justify>;
  gap?: ResponsiveValue<number | string>;
  wrap?: ResponsiveValue<boolean>;

  // Column mode properties
  cols?: boolean; // Enable columns mode

  // Container properties
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;

  // Additional props
  [key: string]: any;
}

// Column props
interface ColumnProps {
  // Width with responsive options
  width?: ResponsiveValue<ColumnWidth>;

  // Other properties
  align?: ResponsiveValue<Alignment>;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;

  // Additional props
  [key: string]: any;
}

// Breakpoint values in pixels
const BREAKPOINTS = {
  tablet: 768,
  desktop: 1024,
};

// Main Wrapper component
export const Wrapper: React.FC<WrapperProps> = ({
  // Layout properties
  direction = 'column',
  align = 'start',
  justify,
  gap = 0,
  wrap = false,

  // Column mode
  cols = false,

  // Container properties
  as: Component = 'div',
  className = '',
  style = {},
  children,

  // Additional props
  ...otherProps
}) => {
  // State to track current breakpoint
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('mobile');

  // Effect to handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= BREAKPOINTS.desktop) {
        setCurrentBreakpoint('desktop');
      } else if (width >= BREAKPOINTS.tablet) {
        setCurrentBreakpoint('tablet');
      } else {
        setCurrentBreakpoint('mobile');
      }
    };

    // Set initial breakpoint
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper to resolve responsive values based on current breakpoint
  function resolveResponsiveValue<T>(value: ResponsiveValue<T>): T {
    if (value === null || typeof value !== 'object') {
      return value as T;
    }

    const responsiveObj = value as ResponsiveObject<T>;

    // Priority: current breakpoint → smaller breakpoints
    if (currentBreakpoint === 'desktop') {
      if ('desktop' in responsiveObj && responsiveObj.desktop !== undefined) return responsiveObj.desktop;
      if ('tablet' in responsiveObj && responsiveObj.tablet !== undefined) return responsiveObj.tablet;
      if ('mobile' in responsiveObj && responsiveObj.mobile !== undefined) return responsiveObj.mobile;
    } else if (currentBreakpoint === 'tablet') {
      if ('tablet' in responsiveObj && responsiveObj.tablet !== undefined) return responsiveObj.tablet;
      if ('mobile' in responsiveObj && responsiveObj.mobile !== undefined) return responsiveObj.mobile;
    } else if ('mobile' in responsiveObj && responsiveObj.mobile !== undefined) {
      return responsiveObj.mobile;
    }

    // Fallback to first defined value or the value itself
    return value as any;
  }

  // Resolve all responsive values based on current breakpoint
  const resolvedDirection = resolveResponsiveValue(direction);
  const resolvedAlign = resolveResponsiveValue(align);
  const resolvedJustify = resolveResponsiveValue(justify);
  const resolvedGap = resolveResponsiveValue(gap);
  const resolvedWrap = resolveResponsiveValue(wrap);

  // If using cols mode, force row direction and wrap
  const finalDirection = cols ? 'row' : resolvedDirection;
  const finalWrap = cols ? true : resolvedWrap;

  // Process gap value to standard format
  const gapValue = typeof resolvedGap === 'number' ? `${resolvedGap}px` : resolvedGap;

  // Only add colsWithGap class if gap is specified
  const colsWithGapClass = cols && resolvedGap && resolvedGap !== 0 ? styles.colsWithGap : '';

  // Construct the style object
  const wrapperStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: finalDirection,
    alignItems: mapAlignmentValue(resolvedAlign),
    justifyContent: resolvedJustify ? mapJustifyValue(resolvedJustify) : undefined,
    flexWrap: finalWrap ? 'wrap' : 'nowrap',
    ...style, // Merge with user-provided styles
  };

  // Add gap for non-column layouts, otherwise use the CSS class + CSS variable approach
  if (!cols && gapValue) {
    wrapperStyles.gap = gapValue;
  }

  // For columns with gap, set the CSS variable for the column spacing
  if (colsWithGapClass && gapValue) {
    wrapperStyles['--col-gap'] = gapValue;
  }

  // Filter out undefined and null values
  const filteredStyles = Object.fromEntries(
    Object.entries(wrapperStyles).filter(([_, v]) => v !== undefined && v !== null),
  );

  // Construct CSS class names
  const cssClasses = [
    styles.wrapper,
    finalDirection === 'row' ? styles.row : styles.column,
    resolvedAlign ? styles[`align-${resolvedAlign}`] : '',
    resolvedJustify ? styles[`justify-${resolvedJustify}`] : '',
    finalWrap ? styles.wrap : '',
    cols ? styles.cols : '',
    colsWithGapClass, // Special handling for cols with gap
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={cssClasses} style={filteredStyles} {...otherProps}>
      {children}
    </Component>
  );
};

// Column component for use within a Wrapper
export const Column: React.FC<ColumnProps> = ({
  width = 'equal',
  align,
  as: Component = 'div',
  className = '',
  style = {},
  children,
  ...otherProps
}) => {
  // State to track current breakpoint
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('mobile');

  // Effect to handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= BREAKPOINTS.desktop) {
        setCurrentBreakpoint('desktop');
      } else if (width >= BREAKPOINTS.tablet) {
        setCurrentBreakpoint('tablet');
      } else {
        setCurrentBreakpoint('mobile');
      }
    };

    // Set initial breakpoint
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper to resolve responsive values (similar to Wrapper)
  function resolveResponsiveValue<T>(value: ResponsiveValue<T>): T {
    if (value === null || typeof value !== 'object') {
      return value as T;
    }

    const responsiveObj = value as ResponsiveObject<T>;

    if (currentBreakpoint === 'desktop') {
      if ('desktop' in responsiveObj && responsiveObj.desktop !== undefined) return responsiveObj.desktop;
      if ('tablet' in responsiveObj && responsiveObj.tablet !== undefined) return responsiveObj.tablet;
      if ('mobile' in responsiveObj && responsiveObj.mobile !== undefined) return responsiveObj.mobile;
    } else if (currentBreakpoint === 'tablet') {
      if ('tablet' in responsiveObj && responsiveObj.tablet !== undefined) return responsiveObj.tablet;
      if ('mobile' in responsiveObj && responsiveObj.mobile !== undefined) return responsiveObj.mobile;
    } else if ('mobile' in responsiveObj && responsiveObj.mobile !== undefined) {
      return responsiveObj.mobile;
    }

    return value as any;
  }

  // Resolve responsive values
  const resolvedWidth = resolveResponsiveValue(width);
  const resolvedAlign = align ? resolveResponsiveValue(align) : undefined;

  // Construct the style object
  const inlineStyles: React.CSSProperties = {
    ...style, // Start with user-provided styles
  };

  // Add alignment if specified
  if (resolvedAlign) {
    inlineStyles.alignSelf = mapAlignmentValue(resolvedAlign);
  }

  // Filter out undefined and null values
  const filteredStyles = Object.fromEntries(
    Object.entries(inlineStyles).filter(([_, v]) => v !== undefined && v !== null),
  );

  // Generate width classes based on the resolved width and current breakpoint
  const getWidthClasses = () => {
    const classes: string[] = []; // Explicitly type as string array

    // For responsive objects, we need breakpoint-specific classes
    if (typeof width === 'object') {
      if ('mobile' in width && width.mobile !== undefined) {
        const mobileClass = getColumnWidthClass(width.mobile, '');
        if (mobileClass) classes.push(mobileClass);
      }

      if ('tablet' in width && width.tablet !== undefined) {
        const tabletClass = getColumnWidthClass(width.tablet, 'tablet-');
        if (tabletClass) classes.push(tabletClass);
      }

      if ('desktop' in width && width.desktop !== undefined) {
        const desktopClass = getColumnWidthClass(width.desktop, 'desktop-');
        if (desktopClass) classes.push(desktopClass); // Fixed: was using tabletClass
      }

      return classes;
    }

    // For simple values, just get the class
    const simpleClass = getColumnWidthClass(resolvedWidth as ColumnWidth, '');
    return simpleClass ? [simpleClass] : [];
  };

  // Helper to get the appropriate class for a column width
  const getColumnWidthClass = (widthValue: ColumnWidth, prefix: string): string => {
    if (widthValue === 'equal') {
      return styles[`${prefix}colEqual`] || styles.colEqual;
    } else if (widthValue === 'auto') {
      return styles[`${prefix}colAuto`] || styles.colAuto;
    } else if (typeof widthValue === 'number') {
      return styles[`${prefix}col-${widthValue}`] || styles[`col-${widthValue}`];
    }
    return '';
  };

  // Get width classes
  const widthClasses = getWidthClasses();

  // Construct CSS class names
  const cssClasses = [styles.column, ...widthClasses, resolvedAlign ? styles[`self-${resolvedAlign}`] : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={cssClasses} style={filteredStyles} {...otherProps}>
      {children}
    </Component>
  );
};

// Helper functions to map values to CSS properties
function mapAlignmentValue(value: Alignment): string {
  switch (value) {
    case 'start':
      return 'flex-start';
    case 'end':
      return 'flex-end';
    default:
      return value;
  }
}

function mapJustifyValue(value: Justify): string {
  switch (value) {
    case 'start':
      return 'flex-start';
    case 'end':
      return 'flex-end';
    case 'between':
      return 'space-between';
    case 'around':
      return 'space-around';
    case 'evenly':
      return 'space-evenly';
    default:
      return value;
  }
}
