import { clsx } from 'clsx';
import React from 'react';
import { CustomAttributes } from '../../global-types';
import styles from './styles/Text.module.css';

export type TextElement = 'a' | 'span' | 'label' | 'legend' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

// Variant types for text size, weight, and color
export type TextSizeVariant = 'xs' | 'small' | 'body' | 'large' | 'xl' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'a';
export type TextWeightVariant = 'light' | 'normal' | 'medium' | 'bold';
export type TextColorVariant =
  | 'base'
  | 'neutral80'
  | 'neutral60'
  | 'disabled'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'help'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export interface TextProps extends CustomAttributes {
  /**
   * Use the as prop to
   * pecify which HTML text element to render: */
  as: TextElement;

  /**
   * Value prop for text
   * content: */
  children?: React.ReactNode;

  /**
   * Control the text size
   * with the size prop:
   */
  size?: TextSizeVariant;

  /**
   * Control the text color
   * with the color prop:
   */
  color?: TextColorVariant;

  /**
   * Control the text weight
   * with the weight prop:
   */
  weight?: TextWeightVariant;

  /**
   * Use the href prop to insert
   * a URL for hyperlinks:
   */
  href?: string;

  /**
   * Add a target attribute
   * to specify where/how the linked document will open:
   */
  target?: string;

  /**
   * Use the className prop
   * for additional styling:
   */
  className?: string;

  /**
   * Use the style prop for inline styling
   */
  style?: React.CSSProperties;

  /**
   * Optionally pass in an onClick handler
   */
  onClick?: () => void;

  /**
   * Optionally specify an automation id for testing purposes.
   */
  ['automation-id']?: string;
}

// A polymorphic component that renders text as different HTML elements based on the `as` prop and can be styled with the `size`, `color`, and `weight` props.
const Text: React.FC<TextProps> = ({
  as: BaseComponent,
  children,
  className,
  style,
  size,
  color = 'base',
  weight,
  ...props
}) => {
  const textClasses = clsx(styles.text, className, {
    [styles[`${size}`]]: size,
    [styles[`${color}`]]: color,
    [styles[`${weight}`]]: weight,
  });

  return (
    <BaseComponent style={style} className={textClasses} {...props}>
      {children}
    </BaseComponent>
  );
};

Text.displayName = 'Text';

export default Text;
