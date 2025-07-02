import React from 'react';
import bg from '../assets/images/heading-bg.png?url';
import styles from './styles/HeadingTemplate.module.css';

interface HeadingTemplateProps {
  children: React.ReactNode;
}

const HeadingTemplate: React.FC<HeadingTemplateProps> = ({ children }) => {
  return (
    <div
      className={styles.container}
      style={{
        background: `url(${bg}) no-repeat center center`,
        backgroundSize: 'cover',
      }}
    >
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default HeadingTemplate;
