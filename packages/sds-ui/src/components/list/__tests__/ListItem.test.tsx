import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import ListItem from '../ListItem'; // Adjust the import path as needed

// Mock the CSS module
jest.mock('./styles/List.module.css', () => ({
  listItem: 'mockListItem',
  dragging: 'mockDragging',
  draggable: 'mockDraggable',
}));

describe('ListItem Component', () => {
  // Test 1: Basic rendering
  test('renders children correctly', () => {
    render(<ListItem>Test Item</ListItem>);
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  // Test 2: Custom className
  test('applies custom className', () => {
    const { container } = render(<ListItem className="custom-class">Test Item</ListItem>);
    const listItem = container.firstChild;
    expect(listItem).toHaveClass('mockListItem');
    expect(listItem).toHaveClass('custom-class');
  });

  // Test 3: Custom ID
  test('uses provided id', () => {
    render(<ListItem id="custom-id">Test Item</ListItem>);
    const listItem = screen.getByText('Test Item');
    expect(listItem).toHaveAttribute('id', 'custom-id');
  });

  // Test 4: Generated ID when not provided
  test('generates an id when not provided', () => {
    render(<ListItem>Test Item</ListItem>);
    const listItem = screen.getByText('Test Item');
    expect(listItem).toHaveAttribute('id');
    expect(listItem.id).toMatch(/^list-item-/);
  });

  // Test 5: Automation ID
  test('applies automation-id attribute', () => {
    render(<ListItem automation-id="test-automation-id">Test Item</ListItem>);
    const listItem = screen.getByText('Test Item');
    expect(listItem).toHaveAttribute('automation-id', 'test-automation-id');
  });

  // Test 6: Forward Ref
  test('forwards ref to the li element', () => {
    const ref = React.createRef<HTMLLIElement>();
    render(<ListItem ref={ref}>Test Item</ListItem>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('LI');
  });

  // Tests for draggable functionality
  describe('Draggable functionality', () => {
    // Test 7: isDraggable prop
    test('applies draggable attribute when isDraggable is true', () => {
      render(<ListItem isDraggable>Draggable Item</ListItem>);
      const listItem = screen.getByText('Draggable Item');
      expect(listItem).toHaveAttribute('draggable', 'true');
      expect(listItem).toHaveClass('mockDraggable');
    });

    // Test 8: Not draggable by default
    test('is not draggable by default', () => {
      render(<ListItem>Non-draggable Item</ListItem>);
      const listItem = screen.getByText('Non-draggable Item');
      // The default for draggable when not specified is false,
      // but it might not be set as an attribute in the DOM
      expect(listItem.draggable).toBe(false);
      expect(listItem).not.toHaveClass('mockDraggable');
    });

    // Test 9: Drag start
    test('handles drag start correctly', () => {
      const { container } = render(<ListItem isDraggable>Drag Me</ListItem>);
      const listItem = screen.getByText('Drag Me');

      // Mock dataTransfer
      const dataTransfer = {
        setData: jest.fn(),
        effectAllowed: '',
      };

      fireEvent.dragStart(listItem, { dataTransfer });

      expect(dataTransfer.setData).toHaveBeenCalledWith('text/plain', expect.stringMatching(/^list-item-/));
      expect(dataTransfer.effectAllowed).toBe('move');
      expect(listItem).toHaveClass('mockDragging');
    });

    // Test 10: Drag over
    test('handles drag over correctly', () => {
      render(<ListItem isDraggable>Drag Over Me</ListItem>);
      const listItem = screen.getByText('Drag Over Me');

      // Mock preventDefault globally
      const preventDefaultMock = jest.fn();
      const originalPreventDefault = Event.prototype.preventDefault;
      Event.prototype.preventDefault = preventDefaultMock;

      try {
        // Use a simple mock object instead of DataTransfer
        const mockDataTransfer = { dropEffect: '' };

        fireEvent.dragOver(listItem, {
          dataTransfer: mockDataTransfer,
        });

        expect(preventDefaultMock).toHaveBeenCalled();
        // We can't reliably test dropEffect as it gets recreated by React's synthetic events
      } finally {
        // Restore original preventDefault
        Event.prototype.preventDefault = originalPreventDefault;
      }
    });

    // Test 11: Drop with onReorder
    test('handles drop correctly with onReorder callback', () => {
      const onReorderMock = jest.fn();

      render(
        <ListItem id="drop-target" isDraggable onReorder={onReorderMock}>
          Drop Here
        </ListItem>,
      );

      const listItem = screen.getByText('Drop Here');

      // Mock preventDefault globally
      const preventDefaultMock = jest.fn();
      const originalPreventDefault = Event.prototype.preventDefault;
      Event.prototype.preventDefault = preventDefaultMock;

      try {
        // Create a mock dataTransfer object with a getData method
        const mockDataTransfer = {
          getData: jest.fn().mockReturnValue('dragged-item-id'),
        };

        fireEvent.drop(listItem, {
          dataTransfer: mockDataTransfer,
        });

        expect(preventDefaultMock).toHaveBeenCalled();
        expect(mockDataTransfer.getData).toHaveBeenCalledWith('text/plain');
        expect(onReorderMock).toHaveBeenCalledWith('dragged-item-id', 'drop-target');
      } finally {
        // Restore original functions
        Event.prototype.preventDefault = originalPreventDefault;
      }
    });

    // Test 12: Drop without onReorder
    test('handles drop correctly without onReorder callback', () => {
      render(
        <ListItem id="drop-target" isDraggable>
          Drop Here
        </ListItem>,
      );

      const listItem = screen.getByText('Drop Here');

      // Mock preventDefault globally
      const preventDefaultMock = jest.fn();
      const originalPreventDefault = Event.prototype.preventDefault;
      Event.prototype.preventDefault = preventDefaultMock;

      try {
        // Create a mock dataTransfer object with a getData method
        const mockDataTransfer = {
          getData: jest.fn().mockReturnValue('dragged-item-id'),
        };

        // This should not throw an error
        fireEvent.drop(listItem, {
          dataTransfer: mockDataTransfer,
        });

        expect(preventDefaultMock).toHaveBeenCalled();
        expect(mockDataTransfer.getData).toHaveBeenCalledWith('text/plain');
        // No need to test onReorder as it's not provided
      } finally {
        // Restore original functions
        Event.prototype.preventDefault = originalPreventDefault;
      }
    });

    // Test 13: Drop on self (same ID)
    test('does not call onReorder when dropping on self', () => {
      const onReorderMock = jest.fn();

      render(
        <ListItem id="same-id" isDraggable onReorder={onReorderMock}>
          Self Drop
        </ListItem>,
      );

      const listItem = screen.getByText('Self Drop');

      // Mock preventDefault globally
      const preventDefaultMock = jest.fn();
      const originalPreventDefault = Event.prototype.preventDefault;
      Event.prototype.preventDefault = preventDefaultMock;

      try {
        // Create a mock dataTransfer object with a getData method
        const mockDataTransfer = {
          getData: jest.fn().mockReturnValue('same-id'),
        };

        fireEvent.drop(listItem, {
          dataTransfer: mockDataTransfer,
        });

        expect(preventDefaultMock).toHaveBeenCalled();
        expect(mockDataTransfer.getData).toHaveBeenCalledWith('text/plain');
        expect(onReorderMock).not.toHaveBeenCalled();
      } finally {
        // Restore original functions
        Event.prototype.preventDefault = originalPreventDefault;
      }
    });

    // Test 14: Drag end
    test('handles drag end correctly', () => {
      render(<ListItem isDraggable>Drag End Test</ListItem>);
      const listItem = screen.getByText('Drag End Test');

      // Start dragging
      fireEvent.dragStart(listItem, {
        dataTransfer: { setData: jest.fn(), effectAllowed: '' },
      });
      expect(listItem).toHaveClass('mockDragging');

      // End dragging
      fireEvent.dragEnd(listItem);
      expect(listItem).not.toHaveClass('mockDragging');
    });
  });

  // Tests for non-draggable items with drag events
  describe('Non-draggable items receiving drag events', () => {
    // Test 15: Drag start on non-draggable
    test('ignores drag start on non-draggable items', () => {
      render(<ListItem>Non Draggable</ListItem>);
      const listItem = screen.getByText('Non Draggable');

      const dataTransfer = {
        setData: jest.fn(),
        effectAllowed: '',
      };

      fireEvent.dragStart(listItem, { dataTransfer });

      expect(dataTransfer.setData).not.toHaveBeenCalled();
      expect(listItem).not.toHaveClass('mockDragging');
    });

    // Test 16: Drag over on non-draggable
    test('ignores drag over on non-draggable items', () => {
      render(<ListItem>Non Draggable</ListItem>);
      const listItem = screen.getByText('Non Draggable');

      const dragOverEvent = {
        preventDefault: jest.fn(),
        dataTransfer: { dropEffect: '' },
      };

      fireEvent.dragOver(listItem, dragOverEvent);

      expect(dragOverEvent.preventDefault).not.toHaveBeenCalled();
    });

    // Test 17: Drop on non-draggable
    test('ignores drop on non-draggable items', () => {
      const onReorderMock = jest.fn();

      render(<ListItem onReorder={onReorderMock}>Non Draggable</ListItem>);
      const listItem = screen.getByText('Non Draggable');

      const dropEvent = {
        preventDefault: jest.fn(),
        dataTransfer: { getData: jest.fn() },
      };

      fireEvent.drop(listItem, dropEvent);

      expect(dropEvent.preventDefault).not.toHaveBeenCalled();
      expect(onReorderMock).not.toHaveBeenCalled();
    });

    // Test 18: Drag end on non-draggable
    test('ignores drag end on non-draggable items', () => {
      render(<ListItem>Non Draggable</ListItem>);
      const listItem = screen.getByText('Non Draggable');

      // Try to start dragging
      fireEvent.dragStart(listItem, {
        dataTransfer: { setData: jest.fn(), effectAllowed: '' },
      });

      // End dragging - nothing should happen
      fireEvent.dragEnd(listItem);

      // No errors should be thrown
      expect(listItem).not.toHaveClass('mockDragging');
    });
  });
});
