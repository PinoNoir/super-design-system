import { renderHook, act } from '@testing-library/react';
import useDragAndDrop from '../useDragAndDrop';

const createMockDataTransfer = () => ({
  effectAllowed: 'move' as const,
  dropEffect: 'move' as const,
  files: {} as FileList,
  items: {} as DataTransferItemList,
  types: [],
  clearData: jest.fn(),
  getData: jest.fn(),
  setData: jest.fn(),
  setDragImage: jest.fn(),
  removeData: jest.fn(),
});

describe('useDragAndDrop', () => {
  const mockItem1 = { id: 1, content: 'Item 1' };
  const mockItem2 = { id: 2, content: 'Item 2' };

  const createMockDragEvent = (index: number): Partial<React.DragEvent> => ({
    preventDefault: jest.fn(),
    dataTransfer: createMockDataTransfer(),
  });

  it('should initialize with null values', () => {
    const { result } = renderHook(() => useDragAndDrop<typeof mockItem1>());

    expect(result.current.draggedItem).toBeNull();
    expect(result.current.draggedOverItem).toBeNull();
    expect(result.current.draggedIndex).toBeNull();
    expect(result.current.draggedOverIndex).toBeNull();
  });

  it('should handle drag start', () => {
    const { result } = renderHook(() => useDragAndDrop<typeof mockItem1>());
    const mockEvent = createMockDragEvent(0);

    act(() => {
      result.current.handleDragStart(mockEvent as React.DragEvent<HTMLElement>, mockItem1, 0);
    });

    expect(result.current.draggedItem).toEqual(mockItem1);
    expect(result.current.draggedIndex).toBe(0);
    expect(mockEvent.dataTransfer?.setData).toHaveBeenCalledWith('text/plain', '0');
    expect(mockEvent.dataTransfer?.effectAllowed).toBe('move');
  });

  it('should handle drag over', () => {
    const { result } = renderHook(() => useDragAndDrop<typeof mockItem1>());
    const mockEvent = createMockDragEvent(1);

    act(() => {
      result.current.handleDragOver(mockEvent as React.DragEvent<HTMLElement>, mockItem2, 1);
    });

    expect(result.current.draggedOverItem).toEqual(mockItem2);
    expect(result.current.draggedOverIndex).toBe(1);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.dataTransfer?.dropEffect).toBe('move');
  });

  it('should handle drag end', () => {
    const { result } = renderHook(() => useDragAndDrop<typeof mockItem1>());

    // Set initial drag state
    act(() => {
      result.current.handleDragStart(createMockDragEvent(0) as React.DragEvent<HTMLElement>, mockItem1, 0);
      result.current.handleDragOver(createMockDragEvent(1) as React.DragEvent<HTMLElement>, mockItem2, 1);
    });

    // End drag
    act(() => {
      result.current.handleDragEnd();
    });

    expect(result.current.draggedItem).toBeNull();
    expect(result.current.draggedOverItem).toBeNull();
    expect(result.current.draggedIndex).toBeNull();
    expect(result.current.draggedOverIndex).toBeNull();
  });
});
