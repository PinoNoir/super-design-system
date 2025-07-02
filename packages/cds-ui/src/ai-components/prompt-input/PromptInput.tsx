import React, { ReactNode, useEffect, useId, useRef } from 'react';
import styles from './styles/PromptInput.module.css';
import clsx from 'clsx';
import mergeRefs from '../../utilities/merge-refs';

export interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  wrapperRef?: React.Ref<HTMLDivElement>;
  focusClassName?: string;
  placeholder?: string;
  iconSlot?: ReactNode;
  fileSlot?: ReactNode;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  bottomSlot?: ReactNode;
  className?: string;
  ariaLabel?: string;
  rows?: number;
  maxRows?: number;
}

const PromptInput: React.FC<PromptInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Ask me anything...',
  onFocus,
  onBlur,
  autoFocus,
  wrapperRef,
  focusClassName,
  iconSlot,
  fileSlot,
  leftSlot,
  rightSlot,
  bottomSlot,
  className = '',
  ariaLabel = 'Prompt input',
  rows = 3,
  maxRows = 8,
}) => {
  const id = useId();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isFocused, setIsFocused] = React.useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const wrapperClass = clsx(styles.mainWrapper, { [styles.focused]: isFocused }, isFocused && focusClassName);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [value]);

  useEffect(() => {
    const el = textAreaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, maxRows * 24)}px`;
    }
  }, [value, maxRows]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
  };

  const promtStyles = clsx(styles.promptContainer, className);

  return (
    <React.Fragment>
      <div ref={mergeRefs(containerRef, wrapperRef)} className={wrapperClass}>
        <div className={promtStyles}>
          {fileSlot && <div className={styles.fileSlot}>{fileSlot}</div>}
          <div className={styles.innerElements}>
            {iconSlot && <div className={styles.iconSlot}>{iconSlot}</div>}
            <label htmlFor={id} className={styles.srOnly}>
              {ariaLabel}
            </label>
            <textarea
              id={id}
              ref={textAreaRef}
              className={clsx(styles.textArea, className)}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              aria-label={ariaLabel}
              rows={rows}
              autoFocus={autoFocus}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
          <div className={styles.promptFooter}>
            <div className={styles.slotWrapper}>
              {leftSlot && <div className={styles.leftSlot}>{leftSlot}</div>}
              {rightSlot && <div className={styles.rightSlot}>{rightSlot}</div>}
            </div>
          </div>
        </div>
      </div>
      {bottomSlot && <div className={styles.bottomSlot}>{bottomSlot}</div>}
    </React.Fragment>
  );
};

export default PromptInput;
