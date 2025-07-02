import { AlignValues, JustifyValues } from '../../global-types/layout-properties';
import styles from './styles/Form.module.css';

export interface CustomFormActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  alignItems?: AlignValues;
  justifyContent?: JustifyValues;
}

const FormActionBar: React.FC<CustomFormActionBarProps> = ({ children, alignItems, justifyContent, ...props }) => {
  const style: React.CSSProperties = {
    alignItems: alignItems || 'center',
    justifyContent: justifyContent || 'flex-end',
  };
  return (
    <div className={styles.actionBar} style={style} {...props}>
      {children}
    </div>
  );
};

FormActionBar.displayName = 'FormActionBar';

export default FormActionBar;
