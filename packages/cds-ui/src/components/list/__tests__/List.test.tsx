import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import List from '../List';
import userEvent from '@testing-library/user-event';

// Mock the child components
jest.mock('../ListItem', () => ({ children }: { children: React.ReactNode }) => (
  <li automation-id="list-item">{children}</li>
));

jest.mock(
  '../ListItemActions',
  () =>
    ({
      item,
      onEdit,
      onDelete,
      beforeActions,
      afterActions,
      children,
    }: {
      item: any;
      onEdit?: (item: any) => void;
      onDelete?: (item: any) => void;
      beforeActions?: React.ReactNode;
      afterActions?: React.ReactNode;
      children?: React.ReactNode | ((item: any) => React.ReactNode);
    }) => (
      <div automation-id="action-bar">
        {beforeActions && <div automation-id="before-actions">{beforeActions}</div>}
        {children ? (
          <div automation-id="custom-children">{typeof children === 'function' ? children(item) : children}</div>
        ) : (
          <>
            {onEdit && (
              <button automation-id="edit-button" onClick={() => onEdit(item)}>
                Edit
              </button>
            )}
            {onDelete && (
              <button automation-id="delete-button" onClick={() => onDelete(item)}>
                Delete
              </button>
            )}
          </>
        )}
        {afterActions && <div automation-id="after-actions">{afterActions}</div>}
      </div>
    ),
);

jest.mock(
  '../ListItemForm',
  () =>
    ({
      item,
      onSave,
      onCancel,
      renderInputs,
    }: {
      item: any;
      onSave: (item: any) => void;
      onCancel: () => void;
      renderInputs: (item: any, handleChange: (field: any, value: unknown) => void) => React.ReactNode;
    }) => {
      const handleChange = (field: any, value: unknown) => {
        // For testing purposes, we'll create a new item with the updated field
        const updatedItem = { ...item, [field]: value };
        return updatedItem;
      };

      const handleSaveClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent any default form submission
        onSave(item);
      };

      const handleCancelClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent any default form behavior
        onCancel();
      };

      return (
        <div automation-id="edit-form" role="form">
          {renderInputs(item, handleChange)}
          <button automation-id="save-button" onClick={handleSaveClick} type="button">
            Save
          </button>
          <button automation-id="cancel-button" onClick={handleCancelClick} type="button">
            Cancel
          </button>
        </div>
      );
    },
);

// Mock styles
jest.mock('./styles/List.module.css', () => ({
  list: 'mockListClass',
}));

describe('List Component', () => {
  // Sample data for testing
  const mockItems = [
    { id: '1', name: 'Item 1', description: 'Description 1' },
    { id: '2', name: 'Item 2', description: 'Description 2' },
    { id: '3', name: 'Item 3', description: 'Description 3' },
  ];

  const renderItem = (item: (typeof mockItems)[0]) => (
    <div automation-id={`rendered-item-${item.id}`}>
      {item.name} - {item.description}
    </div>
  );

  const renderEditInputs = (
    item: (typeof mockItems)[0],
    handleChange: (field: keyof (typeof mockItems)[0], value: unknown) => void,
  ) => (
    <div automation-id="edit-inputs">
      <input automation-id="name-input" value={item.name} onChange={(e) => handleChange('name', e.target.value)} />
      <input
        automation-id="description-input"
        value={item.description}
        onChange={(e) => handleChange('description', e.target.value)}
      />
    </div>
  );

  const mockOnEdit = jest.fn();
  const mockOnSave = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===== CORE FUNCTIONALITY TESTS =====

  test('renders list of items correctly', () => {
    render(
      <List
        items={mockItems}
        renderItem={renderItem}
        onEdit={mockOnEdit}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        renderEditInputs={renderEditInputs}
      />,
    );

    // Check that the list has the correct automation-id
    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('automation-id', 'list');

    // Check that all items are rendered
    expect(screen.getByTestId('rendered-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('rendered-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('rendered-item-3')).toBeInTheDocument();

    // Check that action bars are rendered for each item
    const actionBars = screen.getAllByTestId('action-bar');
    expect(actionBars).toHaveLength(3);
  });

  test('applies custom className when provided', () => {
    const customClassName = 'custom-list-class';

    render(
      <List
        items={mockItems}
        renderItem={renderItem}
        onEdit={mockOnEdit}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        renderEditInputs={renderEditInputs}
        className={customClassName}
      />,
    );

    const list = screen.getByTestId('list');
    expect(list.className).toContain(customClassName);
    expect(list.className).toContain('mockListClass'); // Should also have the module class
  });

  test('applies custom automation-id when provided', () => {
    render(
      <List
        items={mockItems}
        renderItem={renderItem}
        onEdit={mockOnEdit}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        renderEditInputs={renderEditInputs}
        automation-id="custom-list-id"
      />,
    );

    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('automation-id', 'custom-list-id');
  });

  // ===== EDIT MODE TESTS =====

  test('switches to edit mode when edit button is clicked', async () => {
    render(
      <List
        items={mockItems}
        renderItem={renderItem}
        onEdit={mockOnEdit}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        renderEditInputs={renderEditInputs}
      />,
    );

    // Get the edit button for the first item
    const editButtons = screen.getAllByTestId('edit-button');

    // Click the edit button for the first item
    fireEvent.click(editButtons[0]);

    // Check that onEdit was called with the correct item
    expect(mockOnEdit).toHaveBeenCalledWith(mockItems[0]);

    // Check that the edit form is now displayed for the first item
    const editForm = await screen.findByTestId('edit-form');
    expect(editForm).toBeInTheDocument();

    // The original rendered item should no longer be visible
    expect(screen.queryByTestId('rendered-item-1')).not.toBeInTheDocument();

    // Other items should still be rendered normally
    expect(screen.getByTestId('rendered-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('rendered-item-3')).toBeInTheDocument();
  });

  test('calls onDelete when delete button is clicked', () => {
    render(
      <List
        items={mockItems}
        renderItem={renderItem}
        onEdit={mockOnEdit}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        renderEditInputs={renderEditInputs}
      />,
    );

    // Get the delete button for the second item
    const deleteButtons = screen.getAllByTestId('delete-button');

    // Click the delete button for the second item
    fireEvent.click(deleteButtons[1]);

    // Check that onDelete was called with the correct item
    expect(mockOnDelete).toHaveBeenCalledWith(mockItems[1]);
  });

  test('calls onSave and exits edit mode when save button is clicked', async () => {
    render(
      <List
        items={mockItems}
        renderItem={renderItem}
        onEdit={mockOnEdit}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        renderEditInputs={renderEditInputs}
      />,
    );

    // Get the edit button for the first item and click it
    const editButtons = screen.getAllByTestId('edit-button');
    fireEvent.click(editButtons[0]);

    // Now the edit form should be displayed
    const editForm = await screen.findByTestId('edit-form');
    expect(editForm).toBeInTheDocument();

    // Click the save button
    const saveButton = screen.getByTestId('save-button');
    fireEvent.click(saveButton);

    // Check that onSave was called with the correct item
    expect(mockOnSave).toHaveBeenCalledWith(mockItems[0]);

    // The component should exit edit mode
    await waitFor(() => {
      expect(screen.queryByTestId('edit-form')).not.toBeInTheDocument();
    });

    // The rendered item should be visible again
    await waitFor(() => {
      expect(screen.getByTestId('rendered-item-1')).toBeInTheDocument();
    });
  });

  test('exits edit mode without saving when cancel button is clicked', async () => {
    render(
      <List
        items={mockItems}
        renderItem={renderItem}
        onEdit={mockOnEdit}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        renderEditInputs={renderEditInputs}
      />,
    );

    // Get the edit button for the first item and click it
    const editButtons = screen.getAllByTestId('edit-button');
    fireEvent.click(editButtons[0]);

    // Now the edit form should be displayed
    const editForm = await screen.findByTestId('edit-form');
    expect(editForm).toBeInTheDocument();

    // Click the cancel button
    const cancelButton = screen.getByTestId('cancel-button');
    await userEvent.click(cancelButton);

    // Check that onSave was NOT called
    expect(mockOnSave).not.toHaveBeenCalled();

    // The component should exit edit mode
    await waitFor(() => {
      expect(screen.queryByTestId('edit-form')).not.toBeInTheDocument();
    });

    // The rendered item should be visible again
    await waitFor(() => {
      expect(screen.getByTestId('rendered-item-1')).toBeInTheDocument();
    });
  });

  test('only one item can be in edit mode at a time', async () => {
    render(
      <List
        items={mockItems}
        renderItem={renderItem}
        onEdit={mockOnEdit}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        renderEditInputs={renderEditInputs}
      />,
    );

    // Get all edit buttons
    const editButtons = screen.getAllByTestId('edit-button');

    // Click the edit button for the first item
    fireEvent.click(editButtons[0]);

    // Now the edit form should be displayed for the first item
    let editForm = await screen.findByTestId('edit-form');
    expect(editForm).toBeInTheDocument();

    // Click the edit button for the second item
    fireEvent.click(editButtons[1]);

    // Check that onEdit was called for the second item
    expect(mockOnEdit).toHaveBeenCalledWith(mockItems[1]);

    // The first item should no longer be in edit mode and the second one should be
    await waitFor(() => {
      expect(screen.queryByTestId('rendered-item-1')).toBeInTheDocument();
      expect(screen.queryByTestId('rendered-item-2')).not.toBeInTheDocument();
    });
  });

  // ===== RENDERACTIONS TESTS =====

  test('renderActions can trigger edit mode', async () => {
    // Create a component with controllable edit state for testing
    const TestComponent = () => {
      const [editingId, setEditingId] = React.useState<string | null>(null);

      const handleEdit = (item: (typeof mockItems)[0]) => {
        mockOnEdit(item);
        setEditingId(item.id);
      };

      const handleSave = (item: (typeof mockItems)[0]) => {
        mockOnSave(item);
        setEditingId(null);
      };

      const renderActions = (item: (typeof mockItems)[0]) => (
        <div automation-id={`custom-actions-${item.id}`}>
          <button automation-id={`custom-edit-${item.id}`} onClick={() => handleEdit(item)}>
            Edit {item.name}
          </button>
        </div>
      );

      return (
        <List
          items={mockItems}
          renderItem={renderItem}
          onEdit={handleEdit}
          onSave={handleSave}
          onDelete={mockOnDelete}
          renderEditInputs={renderEditInputs}
          renderActions={renderActions}
          editingItemId={editingId}
        />
      );
    };

    render(<TestComponent />);

    // Click custom edit button for first item
    fireEvent.click(screen.getByTestId('custom-edit-1'));

    // Check that onEdit was called
    expect(mockOnEdit).toHaveBeenCalledWith(mockItems[0]);

    // Check that edit form appears
    const editForm = await screen.findByTestId('edit-form');
    expect(editForm).toBeInTheDocument();

    // Original item should no longer be visible
    expect(screen.queryByTestId('rendered-item-1')).not.toBeInTheDocument();
  });

  test('renderActions custom buttons call correct functions', () => {
    const renderActions = (item: (typeof mockItems)[0]) => (
      <div automation-id={`custom-actions-${item.id}`}>
        <button automation-id={`custom-edit-${item.id}`} onClick={() => mockOnEdit(item)}>
          Edit {item.name}
        </button>
        <button automation-id={`custom-delete-${item.id}`} onClick={() => mockOnDelete(item)}>
          Delete {item.name}
        </button>
      </div>
    );

    render(
      <List
        items={mockItems}
        renderItem={renderItem}
        onEdit={mockOnEdit}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        renderEditInputs={renderEditInputs}
        renderActions={renderActions}
      />,
    );

    // Test custom edit button
    fireEvent.click(screen.getByTestId('custom-edit-1'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockItems[0]);

    // Test custom delete button
    fireEvent.click(screen.getByTestId('custom-delete-2'));
    expect(mockOnDelete).toHaveBeenCalledWith(mockItems[1]);
  });

  test('renderActions with ListItemActions-like component maintains edit functionality', async () => {
    // Create a mock component that behaves like ListItemActions but can trigger edit properly
    const MockActionComponent = ({
      item,
      onEdit,
      onDelete,
      beforeActions,
    }: {
      item: any;
      onEdit: (item: any) => void;
      onDelete: (item: any) => void;
      beforeActions?: React.ReactNode;
    }) => (
      <div automation-id="action-bar">
        {beforeActions && <div automation-id="before-actions">{beforeActions}</div>}
        <button automation-id="edit-button" onClick={() => onEdit(item)}>
          Edit
        </button>
        <button automation-id="delete-button" onClick={() => onDelete(item)}>
          Delete
        </button>
      </div>
    );

    const renderActions = (item: (typeof mockItems)[0]) => (
      <MockActionComponent
        item={item}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        beforeActions={<span automation-id={`status-${item.id}`}>Status: Active</span>}
      />
    );

    render(
      <List
        items={mockItems}
        renderItem={renderItem}
        onEdit={mockOnEdit}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        renderEditInputs={renderEditInputs}
        renderActions={renderActions}
      />,
    );

    // Check that custom status is rendered
    expect(screen.getByTestId('status-1')).toBeInTheDocument();

    // Check that edit and delete buttons are rendered
    const editButtons = screen.getAllByTestId('edit-button');
    const deleteButtons = screen.getAllByTestId('delete-button');
    expect(editButtons).toHaveLength(3);
    expect(deleteButtons).toHaveLength(3);

    // Click edit button for first item
    fireEvent.click(editButtons[0]);

    // Check that onEdit was called with correct item
    expect(mockOnEdit).toHaveBeenCalledWith(mockItems[0]);
  });

  test('uses renderActions when provided instead of default action bar', () => {
    const mockRenderActions = jest.fn((item) => (
      <div automation-id={`custom-actions-${item.id}`}>
        <button automation-id={`view-${item.id}`}>View {item.name}</button>
        <button automation-id={`share-${item.id}`}>Share</button>
      </div>
    ));

    render(
      <List
        items={mockItems}
        renderItem={renderItem}
        onEdit={mockOnEdit}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        renderEditInputs={renderEditInputs}
        renderActions={mockRenderActions}
      />,
    );

    // Check that custom actions are rendered
    expect(screen.getByTestId('custom-actions-1')).toBeInTheDocument();
    expect(screen.getByTestId('view-1')).toBeInTheDocument();
    expect(screen.getByTestId('share-1')).toBeInTheDocument();

    // Check that default edit/delete buttons are NOT rendered
    expect(screen.queryByTestId('edit-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();

    // Check that renderActions was called for each item
    expect(mockRenderActions).toHaveBeenCalledTimes(3);
    expect(mockRenderActions).toHaveBeenCalledWith(mockItems[0]);
    expect(mockRenderActions).toHaveBeenCalledWith(mockItems[1]);
    expect(mockRenderActions).toHaveBeenCalledWith(mockItems[2]);
  });

  test('renderActions receives correct item data', () => {
    const mockRenderActions = jest.fn((item) => (
      <div automation-id={`actions-${item.id}`}>
        <span>ID: {item.id}</span>
        <span>Name: {item.name}</span>
      </div>
    ));

    render(
      <List
        items={mockItems}
        renderItem={renderItem}
        onEdit={mockOnEdit}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        renderEditInputs={renderEditInputs}
        renderActions={mockRenderActions}
      />,
    );

    // Verify correct data is displayed
    expect(screen.getByText('ID: 1')).toBeInTheDocument();
    expect(screen.getByText('Name: Item 1')).toBeInTheDocument();
    expect(screen.getByText('ID: 2')).toBeInTheDocument();
    expect(screen.getByText('Name: Item 2')).toBeInTheDocument();

    // Verify renderActions was called with correct items
    expect(mockRenderActions).toHaveBeenNthCalledWith(1, mockItems[0]);
    expect(mockRenderActions).toHaveBeenNthCalledWith(2, mockItems[1]);
    expect(mockRenderActions).toHaveBeenNthCalledWith(3, mockItems[2]);
  });

  test('renderActions can conditionally render different actions', () => {
    const renderActions = (item: (typeof mockItems)[0]) => {
      if (item.id === '1') {
        return <button automation-id={`special-${item.id}`}>Special Action</button>;
      }
      return <button automation-id={`normal-${item.id}`}>Normal Action</button>;
    };

    render(
      <List
        items={mockItems}
        renderItem={renderItem}
        onEdit={mockOnEdit}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        renderEditInputs={renderEditInputs}
        renderActions={renderActions}
      />,
    );

    // First item should have special action
    expect(screen.getByTestId('special-1')).toBeInTheDocument();
    expect(screen.queryByTestId('normal-1')).not.toBeInTheDocument();

    // Other items should have normal actions
    expect(screen.getByTestId('normal-2')).toBeInTheDocument();
    expect(screen.getByTestId('normal-3')).toBeInTheDocument();
    expect(screen.queryByTestId('special-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('special-3')).not.toBeInTheDocument();
  });

  test('renderActions can return null for no actions', () => {
    const renderActions = (item: (typeof mockItems)[0]) => {
      // Only show actions for item 1
      if (item.id === '1') {
        return <button automation-id={`action-${item.id}`}>Action</button>;
      }
      return null;
    };

    render(
      <List
        items={mockItems}
        renderItem={renderItem}
        onEdit={mockOnEdit}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        renderEditInputs={renderEditInputs}
        renderActions={renderActions}
      />,
    );

    // Only item 1 should have actions
    expect(screen.getByTestId('action-1')).toBeInTheDocument();
    expect(screen.queryByTestId('action-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('action-3')).not.toBeInTheDocument();

    // No default actions should be present
    expect(screen.queryByTestId('edit-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
  });

  test('edit mode still works correctly with renderActions', async () => {
    const TestComponent = () => {
      const [editingId, setEditingId] = React.useState<string | null>(null);

      const handleEdit = (item: (typeof mockItems)[0]) => {
        mockOnEdit(item);
        setEditingId(item.id);
      };

      const handleSave = (item: (typeof mockItems)[0]) => {
        mockOnSave(item);
        setEditingId(null);
      };

      const handleCancel = () => {
        setEditingId(null);
      };

      const renderActions = (item: (typeof mockItems)[0]) => (
        <button automation-id={`custom-edit-${item.id}`} onClick={() => handleEdit(item)}>
          Custom Edit
        </button>
      );

      return (
        <List
          items={mockItems}
          renderItem={renderItem}
          onEdit={handleEdit}
          onSave={handleSave}
          onDelete={mockOnDelete}
          renderEditInputs={renderEditInputs}
          renderActions={renderActions}
          editingItemId={editingId}
        />
      );
    };

    render(<TestComponent />);

    // Click custom edit button
    fireEvent.click(screen.getByTestId('custom-edit-1'));

    // Should enter edit mode
    const editForm = await screen.findByTestId('edit-form');
    expect(editForm).toBeInTheDocument();

    // Save should work
    fireEvent.click(screen.getByTestId('save-button'));
    expect(mockOnSave).toHaveBeenCalledWith(mockItems[0]);

    // Should exit edit mode
    await waitFor(() => {
      expect(screen.queryByTestId('edit-form')).not.toBeInTheDocument();
    });

    // Custom actions should be visible again
    expect(screen.getByTestId('custom-edit-1')).toBeInTheDocument();
  });
});
