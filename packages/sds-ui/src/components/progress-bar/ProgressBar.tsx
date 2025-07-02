import { clsx } from 'clsx';
import { animate, motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import { CdsComponent } from '../../global-types';
import styles from './styles/ProgressBar.module.css';

export interface ProgressBarProps {
  /**
   * The id of the progress bar.
   */
  id?: string;
  /**
   * Set the progress bar style.
   */
  variant: 'primary' | 'secondary' | 'info';

  /**
   * Set the state of the progress bar.
   */
  state?: boolean | ('determinate' | 'indeterminate');

  /**
   * The progress bar starting value.
   */
  min?: number;

  /**
   * The progress bar ending value.
   */
  max: number;

  /**
   * The progress bar current value.
   */
  value: number;

  /**
   * Set external styling to the progress bar.
   */
  className?: string;

  /**
   * Determine the progress bar height
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';

  /**
   * Show progress bar progression in percentages
   */
  showProgress?: boolean;

  /**
   * Stop the progress bar animation
   */
  stopAnimation?: boolean;

  /**
   * Optionally specify an automation id for testing purposes.
   */
  ['automation-id']?: string;
}

// The Progress Bar component is a visual indicator used to display the progress of a task or process.

const ProgressBar: CdsComponent<ProgressBarProps, HTMLDivElement> = React.forwardRef(
  (
    {
      id,
      variant,
      size = 'md',
      state = 'determinate',
      value,
      min = 0,
      max = 100,
      className,
      showProgress,
      stopAnimation = false,
      ...props
    },
    forwardedRef,
  ) => {
    // Convert boolean state values to string values
    let progressState: 'determinate' | 'indeterminate';
    if (typeof state === 'boolean') {
      progressState = state ? 'determinate' : 'indeterminate';
    } else {
      progressState = state;
    }

    const baseStyles = clsx(
      !stopAnimation ? styles.animatedBase : styles.nonAnimatedBase,
      progressState === 'indeterminate' ? styles.indeterminateProgress : '',
      className,
      {
        [styles.primary]: variant === 'primary',
        [styles.secondary]: variant === 'secondary',
        [styles.info]: variant === 'info',
        [styles.xs]: size === 'xs',
        [styles.sm]: size === 'sm',
        [styles.md]: size === 'md',
        [styles.lg]: size === 'lg',
      },
    );

    const progressTextRef = useRef<HTMLSpanElement>(null);

    // Determine if we should show the actual value or animate the progress bar indefinitely
    const isIndeterminate = progressState === 'indeterminate';
    const currentValue = Math.min(Math.max(value, min), max); // Ensure value is within min/max range
    const normalizedValue = ((currentValue - min) / (max - min)) * 100; // Convert to percentage

    useEffect(() => {
      if (showProgress && progressTextRef.current && !isIndeterminate) {
        animate(0, normalizedValue, {
          duration: 0.5,
          onUpdate: (cv) => {
            if (progressTextRef.current) {
              progressTextRef.current.textContent = cv.toFixed(0);
            }
          },
        });
      }
    }, [normalizedValue, showProgress, isIndeterminate, min, max]);

    return (
      <div className={styles.progressBarContainer}>
        <div
          role="progressbar"
          ref={forwardedRef}
          aria-roledescription="progress bar"
          id={id}
          aria-label={id}
          className={styles.progressBar}
          aria-valuenow={isIndeterminate ? undefined : value}
          aria-valuemax={max}
          aria-valuemin={min}
          aria-valuetext={isIndeterminate ? 'Loading...' : `${normalizedValue.toFixed(0)}%`}
          {...props}
        >
          <motion.div
            className={baseStyles}
            animate={isIndeterminate ? { x: ['0%', '100%'] } : { width: `${normalizedValue}%` }}
            transition={
              isIndeterminate
                ? { repeat: Infinity, duration: 1.5, ease: 'linear' }
                : { ease: 'easeOut', duration: 0.65 }
            }
          />
        </div>
        {showProgress !== false && !isIndeterminate && (
          <div className={styles.progressBarTextContainer}>
            <span ref={progressTextRef}>0</span>
            <span>%</span>
          </div>
        )}
      </div>
    );
  },
);

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
