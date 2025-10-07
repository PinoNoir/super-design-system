import React from 'react';
import bg from '../assets/images/bg.png?url';
import styles from './Changelog.module.css';
import { HeadingTemplate } from '../storybook-components';

interface ChangelogProps {
  children: React.ReactNode;
}

export const Changelog: React.FC<ChangelogProps> = ({ children }) => {
  return (
    <div
      className={styles.mainContainer}
      style={{
        background: `url(${bg}) no-repeat center center fixed`,
        backgroundSize: 'cover',
      }}
    >
      <div className={styles.content}>
        <HeadingTemplate>Changelog</HeadingTemplate>
        {children}
      </div>
    </div>
  );
};
