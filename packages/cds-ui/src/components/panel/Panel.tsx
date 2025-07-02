import { clsx } from 'clsx';
import { ComponentPropsWithoutRef } from 'react';
import styles from './styles/Panel.module.css';
import PanelHeader from './PanelHeader';
import PanelContent from './PanelContent';
import PanelFooter from './PanelFooter';

export interface PanelProps extends ComponentPropsWithoutRef<'div'> {
  id?: string;
  className?: string;
  header?: React.ReactNode;
  headerIcon?: React.ReactNode;
  headerActionButton?: React.ReactNode;
  children: React.ReactNode;
  footerDivider?: boolean;
  footer?: React.ReactNode;
  border?: 'base' | 'none';
  sectionAlert?: React.ReactNode;
  ['automation-id']?: string;
}

const Panel: React.FC<PanelProps> = ({
  id,
  className,
  header,
  headerIcon,
  headerActionButton,
  children,
  footerDivider,
  footer,
  border = 'base',
  sectionAlert,
  ...props
}) => {
  return (
    <div
      id={id}
      automation-id={props['automation-id']}
      className={clsx(
        styles.panel,
        {
          [styles.base]: border === 'base',
          [styles.none]: border === 'none',
        },
        className,
      )}
      {...props}
    >
      {(header || headerIcon || headerActionButton || sectionAlert) && (
        <PanelHeader
          header={header}
          headerIcon={headerIcon}
          headerActionButton={headerActionButton}
          sectionAlert={sectionAlert}
        />
      )}
      <PanelContent>{children}</PanelContent>
      {footer && <PanelFooter footer={footer} footerDivider={footerDivider} />}
    </div>
  );
};

Panel.displayName = 'Panel';

export default Panel;
