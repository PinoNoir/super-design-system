import { renderHook, act } from '@testing-library/react';
import useAccordionContext from '../../components/accordion/useAccordionContext';
import useAccordionItem from '../useAccordionItem';

// Mock the context hook
jest.mock('../../components/accordion/useAccordionContext.tsx');

describe('useAccordionItem', () => {
  const mockSetOpenItemId = jest.fn();
  const defaultProps = {
    id: 'test-id',
    open: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAccordionContext as jest.Mock).mockReturnValue({
      openItemId: null,
      setOpenItemId: mockSetOpenItemId,
    });
  });

  it('should set item as open when open prop is true', () => {
    renderHook(() => useAccordionItem({ ...defaultProps, open: true }));
    expect(mockSetOpenItemId).toHaveBeenCalledWith('test-id');
  });

  it('should handle click to open item', () => {
    const { result } = renderHook(() => useAccordionItem(defaultProps));

    act(() => {
      result.current.handleClick({
        currentTarget: {
          tagName: 'BUTTON',
          disabled: false,
          // Add other required HTMLButtonElement properties as needed
        },
      } as React.MouseEvent<HTMLButtonElement>);
    });

    expect(mockSetOpenItemId).toHaveBeenCalledWith('test-id');
  });

  it('should handle click to close item', () => {
    (useAccordionContext as jest.Mock).mockReturnValue({
      openItemId: 'test-id',
      setOpenItemId: mockSetOpenItemId,
    });

    const { result } = renderHook(() => useAccordionItem(defaultProps));

    act(() => {
      result.current.handleClick({
        currentTarget: {
          tagName: 'BUTTON',
          disabled: false,
        },
      } as React.MouseEvent<HTMLButtonElement>);
    });

    expect(mockSetOpenItemId).toHaveBeenCalledWith(null);
  });

  it('should call onHeadingClick callback when provided', () => {
    const mockOnHeadingClick = jest.fn();
    const mockEvent = {
      currentTarget: {
        tagName: 'BUTTON',
        disabled: false,
      },
    } as React.MouseEvent<HTMLButtonElement>;

    const { result } = renderHook(() => useAccordionItem({ ...defaultProps, onHeadingClick: mockOnHeadingClick }));

    act(() => {
      result.current.handleClick(mockEvent);
    });

    expect(mockOnHeadingClick).toHaveBeenCalledWith(true, mockEvent);
  });

  it('should handle Escape key to close item', () => {
    (useAccordionContext as jest.Mock).mockReturnValue({
      openItemId: 'test-id',
      setOpenItemId: mockSetOpenItemId,
    });

    const { result } = renderHook(() => useAccordionItem(defaultProps));

    const mockEvent = {
      key: 'Escape',
      keyCode: 27,
      which: 27,
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      currentTarget: {
        tagName: 'BUTTON',
        disabled: false,
      },
    } as unknown as React.KeyboardEvent<HTMLButtonElement>;

    act(() => {
      result.current.handleKeyDown(mockEvent);
    });

    expect(mockSetOpenItemId).toHaveBeenCalledWith(null);
  });

  it('should not handle Escape key when item is closed', () => {
    const { result } = renderHook(() => useAccordionItem(defaultProps));

    const mockEvent = {
      key: 'Escape',
      keyCode: 27,
      which: 27,
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      currentTarget: {
        tagName: 'BUTTON',
        disabled: false,
      },
    } as unknown as React.KeyboardEvent<HTMLButtonElement>;

    act(() => {
      result.current.handleKeyDown(mockEvent);
    });

    expect(mockSetOpenItemId).not.toHaveBeenCalled();
  });

  it('should reflect correct open state', () => {
    (useAccordionContext as jest.Mock).mockReturnValue({
      openItemId: 'test-id',
      setOpenItemId: mockSetOpenItemId,
    });

    const { result } = renderHook(() => useAccordionItem(defaultProps));
    expect(result.current.isOpen).toBe(true);
  });
});
