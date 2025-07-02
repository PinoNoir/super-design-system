import React, { ComponentPropsWithoutRef, forwardRef } from 'react';
import {
  AlignValues,
  DisplayValues,
  JustifySelfValues,
  JustifyValues,
  SpacingValues,
} from '../../global-types/layout-properties';

type ContainerElement = 'div' | 'aside' | 'article' | 'section' | 'main' | 'header' | 'footer' | 'nav';

export interface GridItemProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Provide a custom element to render instead of the default <div>.
   */
  as: ContainerElement;

  /**
   * Specify a grid gap property to set the gap between the `GridItem` component's children.
   */
  gap?: SpacingValues;

  /**
   * Pass in content that will be rendered within the `GridItem`.
   */
  children?: React.ReactNode;

  /**
   * Specify a custom className to be applied to the `GridItem`
   */
  className?: string;

  /**
   * Set the `display` property of the `GridItem` component.
   * Note: the default value is `grid`.
   */
  display?: DisplayValues;

  /**
   * Specify the number of columns the `GridItem` should span.
   */
  colSpan?: number | string;

  /**
   * Specify the number of rows the `GridItem` should span.
   */
  rowSpan?: number | string;

  /**
   * Specify what column line number the `GridItem` starts on
   */
  startColumn?: number | string;

  /**
   * Specify what column line number the `GridItem` ends on
   */
  endColumn?: number | string;

  /**
   * Specify what row line number the `GridItem` starts on
   */
  startRow?: number | string;

  /**
   * Specify what row line number the `GridItem` ends on
   */
  endRow?: number | string;

  /**
   * Specify the align-items property to align the children inside the `GridItem` component.
   */
  alignItems?: AlignValues;

  /**
   * Specify a justify-content property to justify the children inside the `GridItem` component.
   */
  justifyContent?: JustifyValues;

  /**
   * Specify the justify-self property to justify the `GridItem` component.
   */
  justifySelf?: JustifySelfValues;

  /**
   * Specify the max-height property to set the maximum height of the `GridItem` component.
   */
  maxHeight?: string;

  /**
   * Specify a custom automation id for testing purposes
   */
  ['automation-id']?: string;
}

const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  (
    {
      as: BaseComponent,
      children,
      gap,
      className,
      display = 'grid',
      colSpan,
      rowSpan,
      startColumn,
      endColumn,
      startRow,
      endRow,
      alignItems,
      justifyContent,
      justifySelf,
      maxHeight,
      ...props
    },
    ref,
  ) => {
    const style: React.CSSProperties = {
      display: display,
      gridColumnStart: startColumn,
      gridColumnEnd: colSpan ? `span ${colSpan}` : endColumn,
      gridRowStart: startRow,
      gridRowEnd: rowSpan ? `span ${rowSpan}` : endRow,
      alignItems: alignItems,
      justifyContent: justifyContent,
      justifySelf: justifySelf, // Added justifySelf to style object
      maxHeight: maxHeight,
      gap: gap,
    };

    return (
      <BaseComponent ref={ref} className={className} style={style} {...props}>
        {children}
      </BaseComponent>
    );
  },
);

GridItem.displayName = 'GridItem';

export default GridItem;
