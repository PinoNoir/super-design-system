import React from 'react';
import { AlignValues } from '../../global-types/layout-properties';
import styles from './styles/FormBlock.module.css';
import { clsx } from 'clsx';

export type LayoutVariant = '1-column' | '2-column' | '3-column' | '4-column';

export interface FormBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Children components to be rendered within the form block */
  children: React.ReactNode;
  /** Determines the column layout of the form block */
  layoutVariant?: LayoutVariant;
  /** Controls the alignment of items within the form block */
  alignItems?: AlignValues;
  /** Optional margin before the form block */
  marginBlockStart?: string;
  /** Optional margin after the form block */
  marginBlockEnd?: string;
  /** Optional gap between items */
  gap?: string;
  /** Whether to wrap children in a flex row container */
  row?: boolean;
}

const FormBlock = React.forwardRef<HTMLDivElement, FormBlockProps>(
  (
    {
      children,
      layoutVariant = '1-column',
      alignItems = 'self-start',
      marginBlockStart,
      marginBlockEnd,
      gap,
      row = true,
      className,
      ...props
    },
    ref,
  ) => {
    const formBlockStyles = clsx(styles.base, className, {
      [styles.layoutVariants1Column]: layoutVariant === '1-column',
      [styles.layoutVariants2Column]: layoutVariant === '2-column',
      [styles.layoutVariants3Column]: layoutVariant === '3-column',
      [styles.layoutVariants4Column]: layoutVariant === '4-column',
      [styles.row]: row,
    });

    const style: React.CSSProperties = {
      alignItems,
      marginBlockStart,
      marginBlockEnd,
      gap,
    };

    return (
      <div ref={ref} className={formBlockStyles} style={style} {...props}>
        {children}
      </div>
    );
  },
);

FormBlock.displayName = 'FormBlock';

export default FormBlock;
