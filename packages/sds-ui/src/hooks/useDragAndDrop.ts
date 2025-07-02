import { useState, useCallback } from 'react';

interface UseDragAndDropResult<T> {
  draggedItem: T | null;
  draggedOverItem: T | null;
  draggedIndex: number | null;
  draggedOverIndex: number | null;
  handleDragStart: (event: React.DragEvent<HTMLElement>, item: T, index: number) => void;
  handleDragOver: (event: React.DragEvent<HTMLElement>, item: T, index: number) => void;
  handleDragEnd: () => void;
}

function useDragAndDrop<T>(): UseDragAndDropResult<T> {
  const [draggedItem, setDraggedItem] = useState<T | null>(null);
  const [draggedOverItem, setDraggedOverItem] = useState<T | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((event: React.DragEvent<HTMLElement>, item: T, index: number) => {
    setDraggedItem(item);
    setDraggedIndex(index);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', index.toString());
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLElement>, item: T, index: number) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setDraggedOverItem(item);
    setDraggedOverIndex(index);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDraggedOverItem(null);
    setDraggedIndex(null);
    setDraggedOverIndex(null);
  }, []);

  return {
    draggedItem,
    draggedOverItem,
    draggedIndex,
    draggedOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}

export default useDragAndDrop;
