import React from 'react';
import styles from './styles/Panel.module.css';
import { Flex } from '../flex';
import { clsx } from 'clsx';

export interface PanelHeaderProps {
  className?: string;
  header: React.ReactNode;
  headerIcon?: React.ReactNode;
  headerActionButton?: React.ReactNode;
  sectionAlert?: React.ReactNode;
  ['automation-id']?: string;
}

const PanelHeader: React.FC<PanelHeaderProps> = ({
  className,
  header,
  headerIcon,
  headerActionButton,
  sectionAlert,
  ...props
}) => {
  return (
    <div className={clsx(styles.panelHeader, className)} {...props}>
      {sectionAlert ? <div className={styles.errorContainer}>{sectionAlert}</div> : null}
      <Flex gap="0px" justifyContent="space-between">
        <Flex gap="8px" justifyContent="flex-start">
          <div className={styles.panelHeaderText}>{header != null ? <h2>{header}</h2> : null}</div>
          <div className={styles.panelHeaderIcon}>{headerIcon ? headerIcon : null}</div>
        </Flex>
        <Flex justifyContent="flex-end">{headerActionButton ? headerActionButton : null}</Flex>
      </Flex>
    </div>
  );
};

export default PanelHeader;
