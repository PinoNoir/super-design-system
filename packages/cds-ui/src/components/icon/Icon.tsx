import React from 'react';
import { iconNames } from './utils/iconNames';
import sprite from '../../public/bcc-icon-sprite.svg';
import { useId } from '../../utilities/use-id';
import styles from './styles/Icon.module.css';
import { clsx } from 'clsx';

export type IconSize = 'small' | 'default' | 'large';
export type IconColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'disabled'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: (typeof iconNames)[number];
  color?: IconColor;
  size?: IconSize;
  ['automation-id']?: string;
  className?: string;
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, color = 'default', size = 'default', className, 'automation-id': automationId, ...props }, ref) => {
    const uniqueId = useId(`icon-${name}`);
    const iconStyles = clsx(styles.icon, size && styles[`size${size}`], color && styles[`color${color}`], className);

    return (
      <svg ref={ref} className={iconStyles} automation-id={automationId || uniqueId} {...props}>
        <use href={`${sprite}#${name}`} />
      </svg>
    );
  },
);

Icon.displayName = 'Icon';

export default Icon;
