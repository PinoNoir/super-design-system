import { useContext } from 'react';
import AccordionContext from './AccordionContext';

const useAccordionContext = () => {
  const accordion = useContext(AccordionContext);
  if (!accordion) {
    throw new Error('useAccordion must be used within a AccordionProvider');
  }
  return accordion;
};

export default useAccordionContext;
