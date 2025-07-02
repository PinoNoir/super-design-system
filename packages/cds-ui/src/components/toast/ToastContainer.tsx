import { Toast, CustomToastProps } from './Toast';
import styles from './styles/Toast.module.css';
import { clsx } from 'clsx';

export interface ToastContainerProps {
  data: CustomToastProps[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ data, position, removeToast }) => {
  const containerClasses = clsx(styles.toastContainer, {
    [styles.topRight]: position === 'top-right',
    [styles.topLeft]: position === 'top-left',
    [styles.bottomRight]: position === 'bottom-right',
    [styles.bottomLeft]: position === 'bottom-left',
  });

  return (
    data.length > 0 && (
      <div className={containerClasses} aria-live="assertive">
        {data.map((toastData, index) => (
          <Toast
            key={toastData.id || index} // Fallback to index if id is not provided
            {...toastData}
            onClose={() => removeToast(toastData.id)}
          />
        ))}
      </div>
    )
  );
};

export default ToastContainer;
