import { useContext } from 'react';
import FileContext from './FileContext';

function useFileContext() {
  const file = useContext(FileContext);
  if (!file) {
    throw new Error('useFileContext must be used within a FileProvider');
  }
  return file;
}

export default useFileContext;
