import React from 'react';
import { Card } from '@pinonoir/sds-ui';
import styles from './WidgetPlaceholder.module.css';

type WidgetPlaceholderProps = {
  id: string;
};

const WidgetPlaceholder: React.FC<WidgetPlaceholderProps> = ({ id }) => {
  return (
    <div className={styles.widgetPlaceholder}>
      <Card className={styles.placeholderCard}>
        <Card.Content>Moving widget {id}...</Card.Content>
      </Card>
    </div>
  );
};

export default WidgetPlaceholder;
