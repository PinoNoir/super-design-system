import React from 'react';
import bg from '../assets/images/bg.png?url';
import styles from './styles/PageTemplate.module.css';

interface PageTemplateProps {
  children: React.ReactNode;
  /** Renders the decorative bg.png behind the page. Only Welcome, Why Use SDS?, and the changelog use this. */
  background?: boolean;
}

const PageTemplate: React.FC<PageTemplateProps> = ({ children, background = false }) => {
  return (
    <div
      className={styles.mainContainer}
      style={
        background
          ? {
              background: `url(${bg}) no-repeat center center fixed`,
              backgroundSize: 'cover',
            }
          : undefined
      }
    >
      <div className={background ? `${styles.content} ${styles.contentOnBackground}` : styles.content}>
        {children}
      </div>
    </div>
  );
};

export default PageTemplate;
