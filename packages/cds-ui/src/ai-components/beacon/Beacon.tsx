import { useState, useEffect, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import styles from './styles/Beacon.module.css';

export type BeaconState = 'thinking' | 'processing' | 'generating' | 'idle';
export type TransitionStage = 'initial' | 'entering' | 'current' | 'exiting';

export interface BeaconProps {
  id?: string;
  className?: string;
  state?: BeaconState;
  onComplete?: () => void;
  customMessages?: Partial<Record<BeaconState, string>>;
  showProgressBar?: boolean;
  animateDots?: boolean;
  dotInterval?: number;
  transitionDuration?: number;
  disabled?: boolean;
}

const DEFAULT_STATE_MESSAGES: Record<BeaconState, string> = {
  thinking: 'Thinking',
  processing: 'Processing your request',
  generating: 'Generating response',
  idle: 'Ready',
};

const Beacon = ({
  id,
  className,
  state = 'thinking',
  onComplete,
  customMessages = {},
  showProgressBar = false, // Changed default to false
  animateDots = true,
  dotInterval = 500,
  transitionDuration = 300,
  disabled = false,
}: BeaconProps) => {
  const [dots, setDots] = useState('');
  const [previousState, setPreviousState] = useState(state);
  const [transitionStage, setTransitionStage] = useState<TransitionStage>('initial');
  const [displayedText, setDisplayedText] = useState('');

  const stateMessages = useMemo(() => ({ ...DEFAULT_STATE_MESSAGES, ...customMessages }), [customMessages]);

  // Handle state transitions and onComplete callback
  useEffect(() => {
    if (disabled) return;

    if (state !== previousState) {
      setTransitionStage('exiting');

      const timeout = setTimeout(() => {
        setPreviousState(state);
        setDisplayedText(stateMessages[state]);
        setTransitionStage('entering');

        // Call onComplete when transitioning to idle state
        if (state === 'idle' && onComplete) {
          onComplete();
        }

        const entryTimeout = setTimeout(() => {
          setTransitionStage('current');
        }, 50);

        return () => clearTimeout(entryTimeout);
      }, transitionDuration);

      return () => clearTimeout(timeout);
    } else if (!displayedText || transitionStage === 'initial') {
      setDisplayedText(stateMessages[state]);
      setTransitionStage('current');
    }
  }, [state, previousState, displayedText, stateMessages, transitionDuration, disabled, onComplete, transitionStage]);

  useEffect(() => {
    if (disabled || !animateDots || state === 'idle') {
      setDots('');
      return;
    }

    // Start fresh
    let dotCount = 0;
    setDots('');

    const interval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      setDots('.'.repeat(dotCount));
    }, dotInterval);

    return () => {
      clearInterval(interval);
    };
  }, [state, animateDots, dotInterval, disabled]);

  const isActive = !disabled && state !== 'idle';
  const shouldShowProgressBar = showProgressBar && isActive;

  const getCurrentMessage = useCallback(() => {
    return displayedText || stateMessages[state];
  }, [displayedText, stateMessages, state]);

  return (
    <div
      className={clsx(styles.container, className, { [styles.disabled]: disabled })}
      id={id}
      role="status"
      aria-live="polite"
      aria-label={`Status: ${getCurrentMessage()}${isActive && animateDots ? dots : ''}`}
    >
      <div className={styles.wrapper}>
        <div className={styles.svgContainer}>
          <div className={styles.circleWrapper}>
            <div
              className={clsx(styles.circle, {
                [styles.active]: isActive,
              })}
              aria-hidden="true"
            />
          </div>
        </div>

        <div className={styles.textContainer}>
          <span className={clsx(styles.statusText, styles[transitionStage])} aria-hidden="true">
            <span className={styles.statusTextContent}>{getCurrentMessage()}</span>
            <span className={styles.statusDots}>{isActive && animateDots ? dots : ''}</span>
          </span>
        </div>
      </div>

      {shouldShowProgressBar && (
        <div className={styles.progressBarContainer} data-testid="progress-bar-container">
          <div
            className={styles.progressBar}
            role="progressbar"
            aria-label="Processing"
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      )}
    </div>
  );
};

export default Beacon;
