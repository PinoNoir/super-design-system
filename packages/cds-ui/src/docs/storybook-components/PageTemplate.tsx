import React from 'react';
import bg from '../assets/images/stretto-bg.png?url';
import styles from './styles/PageTemplate.module.css';

interface PageTemplateProps {
  children: React.ReactNode;
}

const PageTemplate: React.FC<PageTemplateProps> = ({ children }) => {
  return (
    <div
      className={styles.mainContainer}
      style={{
        background: `url(${bg}) no-repeat center center fixed`,
        backgroundSize: 'cover',
      }}
    >
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default PageTemplate;
