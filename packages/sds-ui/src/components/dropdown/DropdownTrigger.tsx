import React from 'react';
import DropdownContext from './DropdownContext';

export interface DropdownTriggerProps {
  children: React.ReactNode;
  className?: string;
}

const DropdownTrigger: React.FC<DropdownTriggerProps> = ({ children, className }) => {
  const { triggerRef, setIsOpen, isOpen } = React.useContext(DropdownContext);

  const enhanceChild = (child: React.ReactNode): React.ReactNode => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        ref: triggerRef,
        onClick: (e: React.MouseEvent) => {
          if (typeof child.props.onClick === 'function') {
            child.props.onClick(e);
          }
          setIsOpen(!isOpen);
        },
        'aria-haspopup': 'true',
        'aria-expanded': isOpen,
        'automation-id': 'dropdown-trigger',
        className: `${child.props.className || ''} ${className || ''}`.trim(),
      } as React.HTMLAttributes<HTMLElement> & { ref: React.Ref<any> });
    }
    return child;
  };

  const enhancedChildren = React.Children.map(children, enhanceChild);

  return <>{enhancedChildren}</>;
};

export default DropdownTrigger;
