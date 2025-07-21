import React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import styles from './styles/ToggleGroup.module.css';

interface ToggleGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  icons: React.ReactNode[];
}

const ToggleGroup: React.FC<ToggleGroupProps> = ({ onValueChange, value, icons }) => {
  return (
    <ToggleGroupPrimitive.Root className={styles.toggleGroup} type="single" value={value} onValueChange={onValueChange}>
      {icons.map((icon, index) => (
        <ToggleGroupPrimitive.Item key={index} value={index.toString()} className={styles.toggleItem}>
          {icon}
        </ToggleGroupPrimitive.Item>
      ))}
    </ToggleGroupPrimitive.Root>
  );
};

export default ToggleGroup;
