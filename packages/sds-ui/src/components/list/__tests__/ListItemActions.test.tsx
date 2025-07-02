import { render, screen, fireEvent } from '@testing-library/react';

import ListItemActions from '../ListItemActions'; // Adjust the import path as needed

// Mock the Icon component from @iconify/react
jest.mock('@iconify/react', () => ({
  Icon: ({ icon }: { icon: string }) => <div automation-id={`icon-${icon}`}>{icon}</div>,
}));

// Mock the IconButton component
jest.mock('../../icon-button', () => ({
  IconButton: ({ children, onClick, 'aria-label': ariaLabel, 'automation-id': automationId }: any) => (
    <button onClick={onClick} aria-label={ariaLabel} automation-id={automationId} className="mockIconButton">
      {children}
    </button>
  ),
}));

// Mock the CSS module
jest.mock('./styles/List.module.css', () => ({
  actionBarWrapper: 'mockActionBarWrapper',
}));

// Mock clsx
jest.mock('clsx', () => jest.fn((...args) => args.filter(Boolean).join(' ')));

describe('ListItemActions Component', () => {
  // Define a sample item for testing
  const testItem = { id: '123', name: 'Test Item' };

  // Test 1: Basic rendering with default actions
  test('renders the default action buttons correctly', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(<ListItemActions item={testItem} onEdit={onEdit} onDelete={onDelete} automation-id="list-actions" />);

    // Check if the wrapper div exists with correct class
    const wrapper = screen.getByTestId('list-actions').closest('div');
    expect(wrapper).toHaveClass('mockActionBarWrapper');

    // Check if both action buttons exist with the correct icons
    expect(screen.getByTestId('icon-mdi:pencil')).toBeInTheDocument();
    expect(screen.getByTestId('icon-mdi:delete-forever')).toBeInTheDocument();

    // Check if the buttons have the correct class
    const editButton = screen.getByTestId('icon-mdi:pencil').closest('button');
    const deleteButton = screen.getByTestId('icon-mdi:delete-forever').closest('button');

    expect(editButton).toHaveClass('mockIconButton');
    expect(deleteButton).toHaveClass('mockIconButton');
  });

  // Test 2: Edit button click
  test('calls onEdit with the correct item when edit button is clicked', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(<ListItemActions item={testItem} onEdit={onEdit} onDelete={onDelete} />);

    // Find the edit button and click it
    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);

    // Check if onEdit was called with the correct item
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(testItem);

    // Check that onDelete was not called
    expect(onDelete).not.toHaveBeenCalled();
  });

  // Test 3: Delete button click
  test('calls onDelete with the correct item when delete button is clicked', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(<ListItemActions item={testItem} onEdit={onEdit} onDelete={onDelete} />);

    // Find the delete button and click it
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    // Check if onDelete was called with the correct item
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(testItem);

    // Check that onEdit was not called
    expect(onEdit).not.toHaveBeenCalled();
  });

  // Test 4: BeforeActions functionality
  test('renders beforeActions correctly', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const onCustomAction = jest.fn();

    const beforeActions = (
      <>
        <button automation-id="custom-before-1" onClick={onCustomAction}>
          Custom Before 1
        </button>
        <button automation-id="custom-before-2">Custom Before 2</button>
      </>
    );

    render(<ListItemActions item={testItem} onEdit={onEdit} onDelete={onDelete} beforeActions={beforeActions} />);

    // Check that custom before actions are rendered
    expect(screen.getByTestId('custom-before-1')).toBeInTheDocument();
    expect(screen.getByTestId('custom-before-2')).toBeInTheDocument();

    // Check that default actions are still present
    expect(screen.getByTestId('icon-mdi:pencil')).toBeInTheDocument();
    expect(screen.getByTestId('icon-mdi:delete-forever')).toBeInTheDocument();

    // Test that custom action works
    fireEvent.click(screen.getByTestId('custom-before-1'));
    expect(onCustomAction).toHaveBeenCalledTimes(1);
  });

  // Test 5: AfterActions functionality
  test('renders afterActions correctly', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const onShare = jest.fn();

    const afterActions = (
      <>
        <button automation-id="share-button" onClick={onShare}>
          Share
        </button>
        <button automation-id="archive-button">Archive</button>
      </>
    );

    render(<ListItemActions item={testItem} onEdit={onEdit} onDelete={onDelete} afterActions={afterActions} />);

    // Check that custom after actions are rendered
    expect(screen.getByTestId('share-button')).toBeInTheDocument();
    expect(screen.getByTestId('archive-button')).toBeInTheDocument();

    // Check that default actions are still present
    expect(screen.getByTestId('icon-mdi:pencil')).toBeInTheDocument();
    expect(screen.getByTestId('icon-mdi:delete-forever')).toBeInTheDocument();

    // Test that custom action works
    fireEvent.click(screen.getByTestId('share-button'));
    expect(onShare).toHaveBeenCalledTimes(1);
  });

  // Test 6: BeforeActions and AfterActions together
  test('renders both beforeActions and afterActions correctly', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    const beforeActions = <button automation-id="before-action">Before</button>;
    const afterActions = <button automation-id="after-action">After</button>;

    render(
      <ListItemActions
        item={testItem}
        onEdit={onEdit}
        onDelete={onDelete}
        beforeActions={beforeActions}
        afterActions={afterActions}
      />,
    );

    // Check that all actions are rendered in correct order
    const wrapper = screen.getByTestId('before-action').closest('div');
    const allButtons = wrapper!.querySelectorAll('button');

    expect(allButtons).toHaveLength(4); // before + edit + delete + after
    expect(allButtons[0]).toHaveAttribute('automation-id', 'before-action');
    expect(allButtons[3]).toHaveAttribute('automation-id', 'after-action');
  });

  // Test 7: BeforeActions as function
  test('supports beforeActions as a function receiving the item', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    const beforeActions = (item: typeof testItem) => (
      <button automation-id="dynamic-before" onClick={() => console.log(item.name)}>
        View {item.name}
      </button>
    );

    render(<ListItemActions item={testItem} onEdit={onEdit} onDelete={onDelete} beforeActions={beforeActions} />);

    expect(screen.getByTestId('dynamic-before')).toBeInTheDocument();
    expect(screen.getByText('View Test Item')).toBeInTheDocument();
  });

  // Test 8: AfterActions as function
  test('supports afterActions as a function receiving the item', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    const afterActions = (item: typeof testItem) => (
      <button automation-id="dynamic-after">Actions for {item.id}</button>
    );

    render(<ListItemActions item={testItem} onEdit={onEdit} onDelete={onDelete} afterActions={afterActions} />);

    expect(screen.getByTestId('dynamic-after')).toBeInTheDocument();
    expect(screen.getByText('Actions for 123')).toBeInTheDocument();
  });

  // Test 9: Hide default actions
  test('hides edit button when hideEdit is true', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(<ListItemActions item={testItem} onEdit={onEdit} onDelete={onDelete} hideEdit={true} />);

    // Edit button should not be present
    expect(screen.queryByTestId('icon-mdi:pencil')).not.toBeInTheDocument();

    // Delete button should still be present
    expect(screen.getByTestId('icon-mdi:delete-forever')).toBeInTheDocument();
  });

  test('hides delete button when hideDelete is true', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(<ListItemActions item={testItem} onEdit={onEdit} onDelete={onDelete} hideDelete={true} />);

    // Delete button should not be present
    expect(screen.queryByTestId('icon-mdi:delete-forever')).not.toBeInTheDocument();

    // Edit button should still be present
    expect(screen.getByTestId('icon-mdi:pencil')).toBeInTheDocument();
  });

  test('hides both default buttons when both hide props are true', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(<ListItemActions item={testItem} onEdit={onEdit} onDelete={onDelete} hideEdit={true} hideDelete={true} />);

    // Neither default button should be present
    expect(screen.queryByTestId('icon-mdi:pencil')).not.toBeInTheDocument();
    expect(screen.queryByTestId('icon-mdi:delete-forever')).not.toBeInTheDocument();
  });

  // Test 10: Custom children override
  test('renders custom children and ignores default actions', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(
      <ListItemActions item={testItem} onEdit={onEdit} onDelete={onDelete}>
        {(item) => (
          <>
            <button automation-id="custom-status">Status: {item.name}</button>
            <button automation-id="custom-action">Custom Action</button>
          </>
        )}
      </ListItemActions>,
    );

    // Custom children should be present
    expect(screen.getByTestId('custom-status')).toBeInTheDocument();
    expect(screen.getByTestId('custom-action')).toBeInTheDocument();
    expect(screen.getByText('Status: Test Item')).toBeInTheDocument();

    // Default actions should not be present when children are provided
    expect(screen.queryByTestId('icon-mdi:pencil')).not.toBeInTheDocument();
    expect(screen.queryByTestId('icon-mdi:delete-forever')).not.toBeInTheDocument();
  });

  // Test 11: Custom children as ReactNode
  test('supports custom children as ReactNode', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(
      <ListItemActions item={testItem} onEdit={onEdit} onDelete={onDelete}>
        <button automation-id="static-child">Static Child</button>
        <span automation-id="static-text">Static Text</span>
      </ListItemActions>,
    );

    // Static children should be present
    expect(screen.getByTestId('static-child')).toBeInTheDocument();
    expect(screen.getByTestId('static-text')).toBeInTheDocument();

    // Default actions should not be present
    expect(screen.queryByTestId('icon-mdi:pencil')).not.toBeInTheDocument();
    expect(screen.queryByTestId('icon-mdi:delete-forever')).not.toBeInTheDocument();
  });

  // Test 12: Automation ID
  test('applies automation-id to the wrapper', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(<ListItemActions item={testItem} onEdit={onEdit} onDelete={onDelete} automation-id="test-actions" />);

    const wrapper = screen.getByTestId('test-actions').closest('div');
    expect(wrapper).toHaveAttribute('automation-id', 'test-actions');
  });

  // Test 13: Optional onEdit and onDelete when using custom children
  test('works without onEdit and onDelete when using custom children', () => {
    render(
      <ListItemActions item={testItem}>
        <button automation-id="only-custom">Only Custom</button>
      </ListItemActions>,
    );

    expect(screen.getByTestId('only-custom')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-mdi:pencil')).not.toBeInTheDocument();
    expect(screen.queryByTestId('icon-mdi:delete-forever')).not.toBeInTheDocument();
  });

  // Test 14: Works with different item types
  test('works correctly with different item types', () => {
    const complexItem = {
      id: '456',
      name: 'Complex Item',
      details: {
        category: 'test',
        priority: 'high',
      },
    };

    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(
      <ListItemActions item={complexItem} onEdit={onEdit} onDelete={onDelete}>
        {(item) => (
          <button automation-id="complex-display">
            {item.details.category} - {item.details.priority}
          </button>
        )}
      </ListItemActions>,
    );

    expect(screen.getByTestId('complex-display')).toBeInTheDocument();
    expect(screen.getByText('test - high')).toBeInTheDocument();

    // Test that default actions still work
    const { rerender } = render(<ListItemActions item={complexItem} onEdit={onEdit} onDelete={onDelete} />);

    fireEvent.click(screen.getByTestId('icon-mdi:pencil').closest('button')!);
    expect(onEdit).toHaveBeenCalledWith(complexItem);
  });

  // Test 15: Accessibility
  test('maintains accessibility with custom actions', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    const beforeActions = (
      <button aria-label="View details" automation-id="view-button">
        👁️
      </button>
    );

    render(<ListItemActions item={testItem} onEdit={onEdit} onDelete={onDelete} beforeActions={beforeActions} />);

    // Check that all buttons are accessible
    const allButtons = screen.getAllByRole('button');
    expect(allButtons).toHaveLength(3); // view + edit + delete

    // Check that custom button has proper aria-label
    const viewButton = screen.getByTestId('view-button');
    expect(viewButton).toHaveAttribute('aria-label', 'View details');

    // Check that IconButtons have proper aria-labels
    expect(screen.getByTestId('edit-button')).toHaveAttribute('aria-label', 'Edit item');
    expect(screen.getByTestId('delete-button')).toHaveAttribute('aria-label', 'Delete item');

    // All buttons should be focusable
    allButtons.forEach((button) => {
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });
  });
});
