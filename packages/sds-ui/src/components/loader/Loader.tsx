import React from 'react';
import { ReactAttr } from '../../global-types/common';
import { clsx } from 'clsx';
import styles from './styles/Loader.module.css';

export interface LoaderProps extends ReactAttr<SVGSVGElement> {
  /**
   * Provide an optional className to be applied to the SVG element
   */
  className?: string;
  /**
   * Specify a description that would be used to best describe the loading state
   */
  description?: string | null;
  /**
   * Specify whether you want the loader to be applied with an overlay
   */
  withOverlay?: boolean;
  /**
   * Optionally specify an automation id for testing purposes.
   */
  ['automation-id']?: string;
  /**
   * Optionally override the size of the loader
   */
  size?: number | string;
  /**
   * Optionally hide the description from showing
   */
  showDescription?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  className,
  withOverlay = false,
  description = 'Loading...',
  showDescription = false,
  size = '40px',
  ...props
}) => {
  const loader = (
    <span className={styles.loaderContainer} automation-id="loader" aria-busy="true" aria-live="polite">
      <svg
        role="progressbar"
        viewBox="0 0 50 50"
        className={clsx(styles.loader, className)}
        aria-label={description ?? 'Loading...'}
        width={size}
        height={size}
        {...props}
      >
        <g className={styles.spinner}>
          <circle className={styles.staticCircle} cx="25" cy="25" r="20" />
          <circle className={styles.animatedCircle} cx="25" cy="25" r="20" />
        </g>
      </svg>
      {showDescription && description && <span className={styles.description}>{description}</span>}
    </span>
  );

  return withOverlay ? <div className={styles.loadingOverlay}>{loader}</div> : loader;
};

export default Loader;
