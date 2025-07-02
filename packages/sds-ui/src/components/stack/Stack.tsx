import React, { ComponentPropsWithoutRef } from 'react';
import {
  AlignValues,
  GridDirectionValues,
  SpacingValues,
  JustifyValues,
  FlexDisplayValues,
  GridWrapValues,
} from '../../global-types/layout-properties';
import styles from './styles/Stack.module.css';
import clsx from 'clsx';

export interface StackProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Pass in content that will be rendered within the `Stack` component
   */
  children: React.ReactNode;

  /**
   * Set the `display` property of the stack component to `flex` or `inline-flex`.
   * Note: the default value is `flex`.
   */
  display?: FlexDisplayValues;

  /**
   * Specify a custom className to be applied to the `Stack` component
   */
  className?: string;

  /**
   * Specify a preset gap value to apply to the children of the `Stack` component. Note: the default value is 24px.
   */
  gap?: SpacingValues;

  /**
   * Specify the align-items property to align the children inside the `Stack` component
   */
  alignItems?: AlignValues;

  /**
   * Specify the flex-direction property to set how children are placed inside the `Stack` component
   */
  flexDirection?: GridDirectionValues;

  /**
   * Specify the flex-wrap property to set how children
   * flow inside of the `Flex` component. Children can be forced onto
   * one line or can wrap onto multiple lines.
   */
  flexWrap?: GridWrapValues;

  /**
   * Specify the flex-basis property to set the initial main size of a child
   * inside of the `Flex` component. Note: This prop will only take
   * effect if the parent container
   * of the `Flex` component is also set to `display: flex`
   */
  flexBasis?: string;

  /**
   * Set the flex-grow property to specify how much of the `Flex` component's
   * remaining space should be assigned to the child's main size. Note: This prop
   * will only take effect if the parent container
   * of the `Flex` component is also set to `display: flex`
   */
  flexGrow?: number;

  /**
   * Specify the flex-shrink property to set the shrink factor of a child.
   * If the size of all flex items is larger than the `Flex` component,
   * items shrink to fit. Note: This prop will only take effect if the
   * parent container of the `Flex` component
   * is also set to `display: flex`
   */
  flexShrink?: number;

  /**
   * Specify the min-height property to set
   * the minimum height of the `Flex` component.
   */
  minHeight?: string;

  /**
   * Specify a justify-content property to justify the children inside the `Stack` component
   */
  justifyContent?: JustifyValues;

  /**
   * Specify the padding property to set the padding of the `Stack` component.
   */
  padding?: SpacingValues;

  /**
   * Specify the margin property to set the margin of the `Stack` component.
   */
  margin?: SpacingValues;

  /**
   * Specify a custom automation id for testing purposes
   */
  ['automation-id']?: string;
}

/**
 * Stack is intended to be used as a wrapper for components and content that you
 * want to "stack" vertically or horizontally.
 * The Stack component's default properties are set to
 * `display: flex` and `flex-direction: column`.
 * It renders a HTML div element by default. Use the provided props to
 * adjust the `children` rendered within.
 */
const Stack = ({
  children,
  className,
  display = 'flex',
  gap = '24px',
  alignItems,
  justifyContent,
  flexDirection = 'column',
  flexWrap,
  flexBasis,
  flexGrow,
  flexShrink,
  minHeight,
  padding,
  margin,
  style: userStyle,
  ...props
}: StackProps) => {
  const { display: _userDisplay, ...safeUserStyles } = userStyle || {};

  const style = {
    ...safeUserStyles,
    ...(display && { display }),
    ...(gap && { gap }),
    ...(alignItems && { alignItems }),
    ...(justifyContent && { justifyContent }),
    ...(flexDirection && { flexDirection }),
    ...(flexWrap && { flexWrap }),
    ...(flexBasis && { flexBasis }),
    ...(typeof flexGrow === 'number' && { flexGrow }),
    ...(typeof flexShrink === 'number' && { flexShrink }),
    ...(minHeight && { minHeight }),
    ...(padding && { padding }),
    ...(margin && { margin }),
  };

  return (
    <div className={clsx(styles.stack, className)} style={style} {...props}>
      {children}
    </div>
  );
};

Stack.displayName = 'Stack';

export default Stack;
