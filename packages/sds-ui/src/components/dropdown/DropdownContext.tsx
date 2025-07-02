import React from 'react';

export interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLElement>;
}

const DropdownContext = React.createContext<DropdownContextType | undefined>(undefined);

export default DropdownContext;
