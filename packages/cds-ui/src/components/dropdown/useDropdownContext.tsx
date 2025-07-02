import React from 'react';
import DropdownContext from './DropdownContext';

const useDropdownContext = () => {
  const context = React.useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdownContext must be used within a Dropdown');
  }
  return context;
};

export default useDropdownContext;
