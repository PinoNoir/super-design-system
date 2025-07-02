import React, { ComponentPropsWithoutRef, forwardRef } from 'react';
import {
  ContainerTypeValues,
  GridDisplayValues,
  GridFlowValues,
  SpacingValues,
} from '../../global-types/layout-properties';

export interface GridProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Pass in content that will be rendered within
   * the `Grid` component
   */
  children: React.ReactNode;

  /**
   * Specify a custom className to be applied
   * to the `Grid` component
   */
  className?: string;

  /**
   * Specify a custom container name to be applied
   * to the `Grid` component
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/container-name} to learn more.
   */
  containerName?: string;

  /**
   * Specify a custom container type to be applied
   * to the `Grid` component
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/container-type} to learn more.
   */
  containerType?: ContainerTypeValues;

  /**
   * Specify a preset gap value to apply to the
   * children inside of the `Grid` component. Note: the default value is 24px.
   */
  gap?: SpacingValues;

  /**
   * Set the `display` property of the grid component to `grid` or `inline-grid`.
   * Note: the default value is `grid`.
   */
  display?: GridDisplayValues;

  /**
   * Specifies a grid-template-columns value based
   * on the number of columns.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns} to learn more.
   */
  columns?: number | string;

  /**
   * Specifies a grid-template-rows value based
   * on the number of rows.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-rows} to learn more.
   */
  rows?: number | string;

  /**
   * Specify the size of an implicitly-created
   * grid column track or pattern of tracks.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-columns} to learn more.
   */
  gridAutoColumns?: string;

  /**
   * Specify the size of an implicitly-created
   * grid row track or pattern of tracks.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-rows} to learn more.
   */
  gridAutoRows?: string;

  /**
   * Specify how auto-placed items get flowed
   * into the grid. Note: the default value is `row`.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-flow} to learn more.
   */
  gridAutoFlow?: GridFlowValues;

  /**
   * Specify a custom automation id for testing purposes
   */
  ['automation-id']?: string;
}

const generateGridTemplateColumns = (columns: number | string): string => {
  return typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns;
};

const generateGridTemplateRows = (rows: number | string): string => {
  return typeof rows === 'number' ? `repeat(${rows}, 1fr)` : rows;
};

// Using forwardRef to properly handle refs
const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      children,
      className,
      gap = '24px',
      display = 'grid',
      columns,
      gridAutoColumns,
      gridAutoRows,
      gridAutoFlow = 'row',
      containerName,
      containerType,
      rows,
      ...props
    },
    ref,
  ) => {
    const gridTemplateColumns = columns ? generateGridTemplateColumns(columns) : undefined;
    const gridTemplateRows = rows ? generateGridTemplateRows(rows) : undefined;

    const style: React.CSSProperties = {
      display,
      gap,
      gridTemplateColumns,
      gridTemplateRows,
      gridAutoColumns,
      gridAutoRows,
      gridAutoFlow,
      containerName,
      containerType,
    };

    return (
      <div ref={ref} className={className} style={style} {...props}>
        {children}
      </div>
    );
  },
);

Grid.displayName = 'Grid';

export default Grid;
