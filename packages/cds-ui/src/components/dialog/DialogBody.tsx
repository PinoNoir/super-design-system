import styles from './styles/Dialog.module.css';

export interface DialogBodyProps extends React.ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode;
}

const DialogBody: React.FC<DialogBodyProps> = ({ children, ...props }) => {
  return (
    <div className={styles.dialogBody} {...props}>
      {children}
    </div>
  );
};

export default DialogBody;
