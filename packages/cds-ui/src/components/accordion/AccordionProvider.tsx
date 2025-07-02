import { useMemo, useState } from 'react';
import AccordionContext from './AccordionContext';

interface AccordionProviderProps {
  children: React.ReactNode;
  disabled?: boolean;
}

const AccordionProvider = ({ children, disabled }: AccordionProviderProps) => {
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const contextValues = useMemo(
    () => ({
      openItemId,
      setOpenItemId,
      disabled: disabled ?? false,
    }),
    [openItemId, disabled],
  );

  return <AccordionContext.Provider value={contextValues}>{children}</AccordionContext.Provider>;
};

export default AccordionProvider;
