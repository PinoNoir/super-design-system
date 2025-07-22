import React, { useMemo } from 'react';
import DropdownContext from './DropdownContext';

export interface DropdownProps {
  children: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement>(null);

  const contextValues = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      triggerRef,
    }),
    [isOpen],
  );

  return <DropdownContext.Provider value={contextValues}>{children}</DropdownContext.Provider>;
};

Dropdown.displayName = 'Dropdown';

export default Dropdown;
