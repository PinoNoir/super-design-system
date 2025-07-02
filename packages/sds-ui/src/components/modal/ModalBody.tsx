import styles from './styles/Modal.module.css';

export interface ModalBodyProps extends React.ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode;
}

const ModalBody: React.FC<ModalBodyProps> = ({ children, ...props }) => {
  return (
    <div className={styles.modalBody} {...props}>
      {children}
    </div>
  );
};

export default ModalBody;
