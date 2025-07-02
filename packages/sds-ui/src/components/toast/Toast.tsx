import { Icon } from '@iconify/react';
import * as RadixToast from '@radix-ui/react-toast';
import { ToastProps } from '@radix-ui/react-toast';
import { clsx } from 'clsx';
import React, { ReactElement, ReactNode } from 'react';
import styles from './styles/Toast.module.css';

export interface CustomToastProps extends ToastProps {
  /**
   * Unique identifier for Toast
   */
  id?: string;

  /**
   * Pass in children to be rendered within the Toast
   */
  children?: ReactNode;

  /**
   * additional className for Toast render
   */
  className?: string;

  /**
   * CSS variant of Toast(alert, success, error)
   */
  variant: 'alert' | 'success' | 'error';

  /**
   * Icon for Toast
   */
  icon?: ReactElement;

  /**
   * Text content of Toast
   */
  content?: string;

  /**
   * Text to be displayed in toast description
   */
  message: string;

  /**
   * Additional Text to be displayed in toast description
   */
  additionalMessage?: string | null;

  /**
   * Header text for toast
   */
  header?: string;

  /**
   * URL for toast link text
   */
  url?: string;

  /**
   * Text for toast link
   */
  hyperlinkText?: string;

  /**
   * triggers when closing toast
   */
  onClose: () => unknown;

  /**
   * Additional trigger for closing toast
   */
  additionalOnClose?: (() => unknown) | null;

  /**
   * Additional trigger for opening toast
   */
  additionalShow?: boolean | null;

  /**
   * Optionally specify an automation id for testing purposes.
   */
  ['automation-id']?: string;

  /**
   * optionally use the onOpenChange event to trigger the toast
   */
  onOpenChange?(open: boolean): void;

  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;

  /**
   * Time in milliseconds that toast should remain visible for. Overrides value
   * given to `ToastProvider`.
   */
  duration?: number;

  /**
   * The direction the toast should be swiped to close. Defaults to `right`.
   */
  swipeDirection?: 'up' | 'right' | 'down' | 'left';
}

const ToastProvider = RadixToast.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof RadixToast.Viewport>,
  React.ComponentPropsWithoutRef<typeof RadixToast.Viewport>
>(({ className, ...props }, ref) => (
  <RadixToast.Viewport ref={ref} className={clsx(className, styles.toastViewport)} {...props} />
));
ToastViewport.displayName = RadixToast.Viewport.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof RadixToast.Close>,
  React.ComponentPropsWithoutRef<typeof RadixToast.Close>
>(({ className, ...props }, ref) => <RadixToast.Close ref={ref} toast-close="" {...props}></RadixToast.Close>);
ToastClose.displayName = RadixToast.Close.displayName;

const Toast: React.FC<CustomToastProps> = ({
  variant = 'alert',
  header,
  icon,
  duration,
  ...props
}: CustomToastProps) => {
  const getHeaderText = () => {
    if (header) return header;
    switch (variant) {
      case 'alert':
        return 'Alert';
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      default:
        return '';
    }
  };

  const getAlertIcon = (icon: string) => {
    switch (icon) {
      case 'alert':
        return <Icon icon="mdi:information" width="24px" color="var(--theme-icon-info)" data-name="alert" />;
      case 'error':
        return <Icon icon="mdi:alert-rhombus" width="24px" color="var(--theme-icon-error)" data-name="error" />;
      case 'success':
        return <Icon icon="mdi:check-circle" width="24px" color="var(--theme-icon-success)" data-name="success" />;
      default:
        return <></>;
    }
  };

  const toastClasses = clsx(styles.toastHeader, {
    [styles.alert]: variant === 'alert',
    [styles.success]: variant === 'success',
    [styles.error]: variant === 'error',
  });

  function getToast(message: string, open: boolean, onClose: () => unknown) {
    return (
      <RadixToast.Root className={styles.toastRoot} open={open} onOpenChange={onClose} automation-id="toast">
        <div className={toastClasses}>
          <div className={styles.iconContainer}>
            {getAlertIcon(variant)}
            <span className={styles.toastTitle}>{getHeaderText()}</span>
            <small>{props.content}</small>
          </div>
          <RadixToast.Close className={styles.toastClose}>
            <Icon icon="mdi:close" />
          </RadixToast.Close>
        </div>
        <div className={styles.toastDescription}>{message}</div>
        <div className={styles.toastLinks}>
          <a href={props.url}>{props.hyperlinkText}</a>
        </div>
      </RadixToast.Root>
    );
  }

  return (
    <ToastProvider swipeDirection="right" duration={duration}>
      {getToast(props.message, props.open, props.onClose)}
      {props.additionalMessage && props.additionalShow && props.additionalOnClose ? (
        getToast(props.additionalMessage, props.additionalShow, props.additionalOnClose)
      ) : (
        <></>
      )}
      <ToastViewport />
    </ToastProvider>
  );
};

export { Toast, ToastProvider };
