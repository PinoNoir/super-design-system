import React, { ComponentPropsWithoutRef } from 'react';
import {
  ContainerTypeValues,
  DisplayValues,
  JustifyValues,
  OverflowValues,
  SpacingValues,
} from '../../global-types/layout-properties';

/**
 * ContainerProps defines the properties that can be passed to the `<Container>` component.
 * It extends the standard HTML div properties to allow for additional layout and styling options.
 */
export interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Pass in content that will be rendered within the `<Container>`
   */
  children?: React.ReactNode;

  /**
   * Specify a display property on the `<Container>`
   */
  display?: DisplayValues;

  /**
   * Specify a justify-content property on the `<Container>` to position the children.
   */
  justifyContent?: JustifyValues;

  /**
   * Specify an overflow property on the `<Container>` - Note: this is useful for scrollable content
   */
  overflow?: OverflowValues;

  /**
   * Specify a custom className to be applied to the `<Container>`
   */
  className?: string;

  /**
   * Specify a padding to be applied to the `<Container>`. Default is 16px
   */
  padding?: SpacingValues;

  /**
   * Specify a top margin to be applied to the `<Container>`
   */
  marginTop?: SpacingValues;

  /**
   * Specify a bottom margin to be applied to the `<Container>`
   */
  marginBottom?: SpacingValues;

  /**
   * Specify a custom container name to be applied to the `<Container>` component
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/container-name} to learn more.
   */
  containerName?: string;

  /**
   * Specify a custom container type to be applied to the `<Container>` component
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/container-type} to learn more.
   */
  containerType?: ContainerTypeValues;

  /**
   * Optionally specify an automation id for testing purposes.
   */
  ['automation-id']?: string;
}

/**
 * Container is intended to be used as a wrapper for components and content. It renders a HTML div element by default. Use the provided props to position the `children` inside of the container.
 */
const Container = ({
  children,
  className,
  display,
  justifyContent,
  overflow,
  padding,
  marginTop,
  marginBottom,
  containerName,
  containerType,
  ...props
}: ContainerProps) => {
  const style: React.CSSProperties = {
    padding: padding,
    marginTop: marginTop,
    marginBottom: marginBottom,
    overflow: overflow,
    display: display,
    justifyContent: justifyContent,
    containerName: containerName,
    containerType: containerType,
  };

  return (
    <div className={className} style={style} {...props}>
      {children}
    </div>
  );
};

export default Container;
