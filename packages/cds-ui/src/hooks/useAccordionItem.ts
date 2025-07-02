import { KeyboardEvent, MouseEvent, useCallback, useEffect } from 'react';
import useAccordionContext from '../components/accordion/useAccordionContext';
import { keys, match } from '../utilities/keyboard';

interface UseAccordionItemProps {
  id: string;
  open: boolean;
  onHeadingClick?: (isOpen: boolean, event: MouseEvent<HTMLButtonElement>) => void;
}

interface UseAccordionItemReturn {
  isOpen: boolean;
  handleClick: (event: MouseEvent<HTMLButtonElement>) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

const useAccordionItem = ({ id, open, onHeadingClick }: UseAccordionItemProps): UseAccordionItemReturn => {
  const { openItemId, setOpenItemId } = useAccordionContext();

  useEffect(() => {
    if (open) {
      setOpenItemId(id);
    }
  }, [open, id, setOpenItemId]);

  const isOpen = openItemId === id;

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      setOpenItemId(isOpen ? null : id);
      if (onHeadingClick) {
        onHeadingClick(!isOpen, event);
      }
    },
    [isOpen, id, onHeadingClick, setOpenItemId],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (match(event, keys.Enter)) {
        setOpenItemId(isOpen ? null : id);
        if (onHeadingClick) {
          onHeadingClick(!isOpen, event as unknown as MouseEvent<HTMLButtonElement>);
        }
      } else if (isOpen && match(event, keys.Escape)) {
        setOpenItemId(null);
        if (onHeadingClick) {
          onHeadingClick(false, event as unknown as MouseEvent<HTMLButtonElement>);
        }
      }
    },
    [isOpen, id, onHeadingClick, setOpenItemId],
  );

  return { isOpen, handleClick, handleKeyDown };
};

export default useAccordionItem;
