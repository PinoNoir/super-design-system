import { createContext } from 'react';

interface TableContextType {
  titleId?: string;
  descriptionId?: string;
}

const TableContainerContext = createContext({
  titleId: undefined,
  descriptionId: undefined,
} as TableContextType);

export default TableContainerContext;
