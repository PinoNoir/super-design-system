import { createContext } from 'react';

export type AccordionContextType = {
  disabled: boolean;
  openItemId: string | null;
  setOpenItemId: (id: string | null) => void;
};

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

export default AccordionContext;
