import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import List from './List';
import ListItem from './ListItem';
import ListItemForm from './ListItemForm';
import ListItemActions from './ListItemActions';
import { TextInput } from '../text-input';
import { Toast, ToastProvider } from '../toast';
import { Card } from '../card';
import { Button } from '../button';
import { Icon } from '@iconify/react';
import { IconButton } from '../icon-button';
import { Checkbox } from '../checkbox';

const meta: Meta<typeof List<Debtor>> = {
  title: 'Components/Data Display/List',
  component: List,
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: 'A flexible list component that supports editing, deleting, and custom rendering of list items.',
      },
    },
  },
  argTypes: {
    className: {
      description: 'Optional class name to apply to the list',
      control: 'text',
    },
    'automation-id': {
      description: 'Automation ID for testing',
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof List<Debtor>>;

interface Debtor {
  id: string;
  name: string;
  caseNumber: string;
  filingDate: string;
  debtAmount: number;
}

const debtors: Debtor[] = [
  { id: '1', name: 'John Smith', caseNumber: 'ABC123', filingDate: '2023-05-01', debtAmount: 10000 },
  { id: '2', name: 'Jane Doe', caseNumber: 'XYZ789', filingDate: '2023-04-15', debtAmount: 25000 },
  { id: '3', name: 'Robert Johnson', caseNumber: 'DEF456', filingDate: '2023-05-10', debtAmount: 15000 },
];

/**
 * Helper component for displaying toast notifications in stories
 */
const ToastNotifications = ({ toast, closeToast }) => (
  <ToastProvider>
    <Toast
      variant={toast.variant}
      header={toast.header}
      onClose={closeToast}
      open={toast.open}
      message={toast.message}
      duration={5000}
      automation-id="toast-notification"
    />
  </ToastProvider>
);

/**
 * Helper to show toast messages by updating the toast state
 */
function showToastHelper(
  setToast: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      variant: 'success' | 'error';
      message: string;
      header: string;
    }>
  >,
  variant: 'success' | 'error',
  message: string,
  header: string,
) {
  setToast({
    open: true,
    variant,
    message,
    header,
  });
}

/**
 * A basic example showing a list of debtors with edit, delete functionality
 */
export const InteractiveList: Story = {
  render: function InteractiveListStory(args) {
    const [debtorList, setDebtorList] = useState<Debtor[]>(debtors);
    const [toast, setToast] = useState<{
      open: boolean;
      variant: 'success' | 'error';
      message: string;
      header: string;
    }>({
      open: false,
      variant: 'success',
      message: '',
      header: '',
    });

    const closeToast = () => {
      setToast((prev) => ({ ...prev, open: false }));
    };

    const showToast = (variant: 'success' | 'error', message: string, header: string) => {
      showToastHelper(setToast, variant, message, header);
    };

    const handleEdit = (debtor: Debtor) => {
      console.log('Editing debtor:', debtor);
    };

    // Extracted mapping logic to avoid deep nesting
    function updateDebtorList(prevDebtors: Debtor[], updatedDebtor: Debtor): Debtor[] {
      return prevDebtors.map((d) => (d.id === updatedDebtor.id ? updatedDebtor : d));
    }

    const handleSave = (debtor: Debtor) => {
      try {
        // Simulate an API call
        setTimeout(() => {
          setDebtorList((prevDebtors) => updateDebtorList(prevDebtors, debtor));
          showToast('success', `${debtor.name} saved successfully`, 'Save Successful');
        }, 500);
      } catch (error) {
        console.error('Error saving debtor:', error);
        showToast('error', 'Failed to save changes. Please try again.', 'Save Failed');
      }
    };

    const handleDelete = (debtor: Debtor) => {
      setDebtorList((prevDebtors) => prevDebtors.filter((d) => d.id !== debtor.id));
      showToast('success', `${debtor.name} deleted successfully`, 'Delete Successful');
    };

    const renderItem = (debtor: Debtor) => (
      <>
        <div
          style={{
            flexShrink: 0,
            fontWeight: 'bold',
            marginRight: '8px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '150px',
          }}
        >
          {debtor.name}
        </div>

        <div
          style={{
            display: 'flex',
            flexGrow: 1,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              flexShrink: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginRight: '12px',
            }}
          >
            Case: {debtor.caseNumber}
          </div>

          <div
            style={{
              flexShrink: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginRight: '12px',
            }}
          >
            Filed: {new Date(debtor.filingDate).toLocaleDateString()}
          </div>

          <div
            style={{
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            ${debtor.debtAmount.toLocaleString()}
          </div>
        </div>
      </>
    );

    // Create a helper function to render the List component
    const renderListWithEditFunctionality = () => {
      const renderEditInputs = (item: Debtor, handleChange: (field: keyof Debtor, value: unknown) => void) => {
        return (
          <>
            <TextInput
              id={`name-${item.id}`}
              label="Name"
              value={item.name}
              onChange={(e) => handleChange('name', e.target.value)}
              automation-id="edit-name-input"
            />
            <TextInput
              id={`case-number-${item.id}`}
              label="Case Number"
              value={item.caseNumber}
              onChange={(e) => handleChange('caseNumber', e.target.value)}
              automation-id="edit-case-number-input"
            />
            <TextInput
              id={`filing-date-${item.id}`}
              label="Filing Date"
              type="date"
              value={item.filingDate}
              onChange={(e) => handleChange('filingDate', e.target.value)}
              automation-id="edit-filing-date-input"
            />
            <TextInput
              id={`debt-amount-${item.id}`}
              type="number"
              label="Debt Amount"
              value={item.debtAmount.toString()}
              onChange={(e) => handleChange('debtAmount', Number(e.target.value))}
              automation-id="edit-debt-amount-input"
            />
          </>
        );
      };

      return (
        <List
          {...args}
          items={debtorList}
          renderItem={renderItem}
          onEdit={handleEdit}
          onSave={handleSave}
          onDelete={handleDelete}
          renderEditInputs={renderEditInputs}
        />
      );
    };

    return (
      <>
        <ToastNotifications toast={toast} closeToast={closeToast} />
        <h2>Debtor List</h2>
        {renderListWithEditFunctionality()}
      </>
    );
  },
};

/**
 * Example of a list with draggable items for reordering
 */
export const DraggableList: Story = {
  render: function DraggableListStory(args) {
    const [debtorList, setDebtorList] = useState<Debtor[]>(debtors);

    const handleReorder = (draggedId: string, droppedId: string) => {
      setDebtorList((prevList) => {
        const newList = [...prevList];
        const draggedIndex = newList.findIndex((item) => item.id === draggedId);
        const droppedIndex = newList.findIndex((item) => item.id === droppedId);

        if (draggedIndex === -1 || droppedIndex === -1) return prevList;

        // Remove dragged item from original position
        const [draggedItem] = newList.splice(draggedIndex, 1);
        // Insert at new position
        newList.splice(droppedIndex, 0, draggedItem);

        return newList;
      });
    };

    const renderItem = (debtor: Debtor) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div style={{ flexShrink: 0, marginRight: '8px', alignItems: 'center', display: 'flex' }}>
          <Icon icon="mdi:drag" color="default" />
        </div>
        <div style={{ flexGrow: 1 }}>{debtor.name}</div>
        <div style={{ flexShrink: 0 }}>${debtor.debtAmount.toLocaleString()}</div>
      </div>
    );

    return (
      <Card>
        <h2>Drag to Reorder</h2>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {debtorList.map((debtor) => (
            <ListItem
              key={debtor.id}
              id={debtor.id}
              isDraggable
              onReorder={handleReorder}
              automation-id={`draggable-item-${debtor.id}`}
            >
              {renderItem(debtor)}
            </ListItem>
          ))}
        </div>
      </Card>
    );
  },
};

/**
 * Standalone story for ListItemForm component
 */
export const StandaloneForm: StoryObj<typeof ListItemForm> = {
  render: function StandaloneFormStory() {
    const [debtor, setDebtor] = useState<Debtor>(debtors[0]);
    const [isEditing, setIsEditing] = useState(false);
    const [lastSaved, setLastSaved] = useState<Debtor | null>(null);

    const handleSave = (updatedDebtor: Debtor) => {
      setDebtor(updatedDebtor);
      setLastSaved(updatedDebtor);
      setIsEditing(false);
    };

    const handleCancel = () => {
      setIsEditing(false);
    };

    const renderEditInputs = (
      item: Record<string, unknown>,
      handleChange: (field: string, value: unknown) => void,
      errors?: Record<string, string>,
    ) => {
      // Cast the generic item to Debtor type for type safety
      const debtor = item as unknown as Debtor;

      return (
        <>
          <TextInput
            id="name"
            label="Name"
            value={debtor.name}
            onChange={(e) => handleChange('name', e.target.value)}
            invalidText={errors?.name}
            automation-id="standalone-name-input"
          />
          <TextInput
            id="case-number"
            label="Case Number"
            value={debtor.caseNumber}
            onChange={(e) => handleChange('caseNumber', e.target.value)}
            invalidText={errors?.caseNumber}
            automation-id="standalone-case-number-input"
          />
          <TextInput
            id="filing-date"
            label="Filing Date"
            type="date"
            value={debtor.filingDate}
            onChange={(e) => handleChange('filingDate', e.target.value)}
            invalidText={errors?.filingDate}
            automation-id="standalone-filing-date-input"
          />
          <TextInput
            id="debt-amount"
            type="number"
            label="Debt Amount"
            value={debtor.debtAmount.toString()}
            onChange={(e) => handleChange('debtAmount', Number(e.target.value))}
            invalidText={errors?.debtAmount}
            automation-id="standalone-debt-amount-input"
          />
        </>
      );
    };

    const validate = (item: Record<string, unknown>): Record<string, string> => {
      const errors: Record<string, string> = {};
      const debtor = item as unknown as Debtor;

      if (!debtor.name?.trim()) {
        errors.name = 'Name is required';
      }

      if (!debtor.caseNumber?.trim()) {
        errors.caseNumber = 'Case number is required';
      }

      if (!debtor.filingDate) {
        errors.filingDate = 'Filing date is required';
      }

      if (debtor.debtAmount <= 0) {
        errors.debtAmount = 'Debt amount must be greater than zero';
      }

      return errors;
    };

    return (
      <Card>
        <h2>Debtor Information</h2>

        {!isEditing ? (
          <>
            <div style={{ marginBottom: '8px', display: 'flex', gap: '8px', flexDirection: 'column' }}>
              <div>
                <strong>Name:</strong> {debtor.name}
              </div>
              <div>
                <strong>Case Number:</strong> {debtor.caseNumber}
              </div>
              <div>
                <strong>Filing Date:</strong> {new Date(debtor.filingDate).toLocaleDateString()}
              </div>
              <div>
                <strong>Debt Amount:</strong> ${debtor.debtAmount.toLocaleString()}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Button variant="primary" onClick={() => setIsEditing(true)} automation-id="edit-button">
                Edit Information
              </Button>
            </div>

            {lastSaved && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '8px',
                  backgroundColor: 'var(--theme-color-component)',
                  borderRadius: '4px',
                  color: 'var(--theme-text-base)',
                }}
              >
                <div>
                  <strong>Last Saved:</strong> {new Date().toLocaleTimeString()}
                </div>
              </div>
            )}
          </>
        ) : (
          <ListItemForm
            item={debtor as unknown as Record<string, unknown>}
            onSave={(item: Record<string, unknown>) => {
              handleSave(item as unknown as Debtor);
            }}
            onCancel={handleCancel}
            renderInputs={renderEditInputs}
            validate={validate}
            automation-id="standalone-form"
          />
        )}
      </Card>
    );
  },
};

/**
 * Example showing custom actions in the action bar using beforeActions and afterActions
 */
export const FullyCustomActions: Story = {
  render: function CustomActionsDemoStory(args) {
    const [debtorList, setDebtorList] = useState<Debtor[]>(debtors);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
    const [toast, setToast] = useState<{
      open: boolean;
      variant: 'success' | 'error';
      message: string;
      header: string;
    }>({
      open: false,
      variant: 'success',
      message: '',
      header: '',
    });

    const closeToast = () => {
      setToast((prev) => ({ ...prev, open: false }));
    };

    const showToast = (variant: 'success' | 'error', message: string, header: string) => {
      setToast({
        open: true,
        variant,
        message,
        header,
      });
    };

    const handleFavorite = (debtor: Debtor) => {
      setFavoriteIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(debtor.id)) {
          newSet.delete(debtor.id);
          showToast('success', `${debtor.name} removed from favorites`, 'Favorite Removed');
        } else {
          newSet.add(debtor.id);
          showToast('success', `${debtor.name} added to favorites`, 'Favorite Added');
        }
        return newSet;
      });
    };

    const handleView = (debtor: Debtor) => {
      showToast('success', `Viewing details for ${debtor.name}`, 'View Details');
    };

    const handleShare = (debtor: Debtor) => {
      showToast('success', `Sharing ${debtor.name}'s information`, 'Share Successful');
    };

    const handleArchive = (debtor: Debtor) => {
      setDebtorList((prev) => prev.filter((d) => d.id !== debtor.id));
      showToast('success', `${debtor.name} archived successfully`, 'Archive Successful');
    };

    const handleEdit = (debtor: Debtor) => {
      console.log('Editing debtor:', debtor);
    };

    const handleSave = (debtor: Debtor) => {
      setDebtorList((prev) => prev.map((d) => (d.id === debtor.id ? debtor : d)));
      showToast('success', `${debtor.name} saved successfully`, 'Save Successful');
    };

    const handleDelete = (debtor: Debtor) => {
      setDebtorList((prev) => prev.filter((d) => d.id !== debtor.id));
      showToast('success', `${debtor.name} deleted successfully`, 'Delete Successful');
    };

    const renderItem = (debtor: Debtor) => (
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {favoriteIds.has(debtor.id) && <Icon icon="mdi-star" style={{ color: 'gold', fontSize: '16px' }} />}
          <div
            style={{
              fontWeight: 'bold',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '150px',
            }}
          >
            {debtor.name}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexGrow: 1,
            overflow: 'hidden',
            gap: '12px',
          }}
        >
          <div style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Case: {debtor.caseNumber}
          </div>
          <div style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Filed: {new Date(debtor.filingDate).toLocaleDateString()}
          </div>
          <div style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>${debtor.debtAmount.toLocaleString()}</div>
        </div>
      </>
    );

    const renderEditInputs = (item: Debtor, handleChange: (field: keyof Debtor, value: unknown) => void) => {
      return (
        <>
          <TextInput
            id={`name-${item.id}`}
            label="Name"
            value={item.name}
            onChange={(e) => handleChange('name', e.target.value)}
            automation-id="edit-name-input"
          />
          <TextInput
            id={`case-number-${item.id}`}
            label="Case Number"
            value={item.caseNumber}
            onChange={(e) => handleChange('caseNumber', e.target.value)}
            automation-id="edit-case-number-input"
          />
          <TextInput
            id={`filing-date-${item.id}`}
            label="Filing Date"
            type="date"
            value={item.filingDate}
            onChange={(e) => handleChange('filingDate', e.target.value)}
            automation-id="edit-filing-date-input"
          />
          <TextInput
            id={`debt-amount-${item.id}`}
            type="number"
            label="Debt Amount"
            value={item.debtAmount.toString()}
            onChange={(e) => handleChange('debtAmount', Number(e.target.value))}
            automation-id="edit-debt-amount-input"
          />
        </>
      );
    };

    return (
      <>
        <ToastNotifications toast={toast} closeToast={closeToast} />
        <h2>List with Custom Actions</h2>
        <p style={{ marginBottom: '16px', color: 'var(--color-neutral-60)' }}>
          This example shows how to customize the action bar with additional actions. Try viewing, favoriting, sharing,
          and archiving items alongside the standard edit/delete actions.
        </p>
        <List
          {...args}
          items={debtorList}
          renderItem={renderItem}
          onEdit={handleEdit}
          onSave={handleSave}
          onDelete={handleDelete}
          renderEditInputs={renderEditInputs}
          renderActions={(debtor) => (
            <ListItemActions
              item={debtor}
              onEdit={handleEdit}
              onDelete={handleDelete}
              beforeActions={
                <>
                  <IconButton
                    fill="none"
                    onClick={() => handleView(debtor)}
                    aria-label="View details"
                    title="View Details"
                    automation-id="view-button"
                  >
                    <Icon icon="mdi:eye" />
                  </IconButton>
                  <IconButton
                    fill="none"
                    onClick={() => handleFavorite(debtor)}
                    aria-label={favoriteIds.has(debtor.id) ? 'Remove from favorites' : 'Add to favorites'}
                    title={favoriteIds.has(debtor.id) ? 'Remove from favorites' : 'Add to favorites'}
                    automation-id="favorite-button"
                    style={{
                      color: favoriteIds.has(debtor.id) ? 'gold' : 'inherit',
                    }}
                  >
                    <Icon icon={favoriteIds.has(debtor.id) ? 'mdi:star' : 'mdi:star-outline'} />
                  </IconButton>
                </>
              }
              afterActions={
                <>
                  <IconButton
                    fill="none"
                    onClick={() => handleShare(debtor)}
                    aria-label="Share"
                    title="Share"
                    automation-id="share-button"
                  >
                    <Icon icon="mdi:share-variant" />
                  </IconButton>
                  <IconButton
                    fill="none"
                    onClick={() => handleArchive(debtor)}
                    aria-label="Archive"
                    title="Archive"
                    automation-id="archive-button"
                  >
                    <Icon icon="mdi:archive" />
                  </IconButton>
                </>
              }
            />
          )}
        />
      </>
    );
  },
};

/**
 * Example showing completely custom action bar content
 */
export const CustomActions: Story = {
  render: function FullyCustomActionsStory(args) {
    const [debtorList] = useState<Debtor[]>(debtors);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const handleSelect = (debtor: Debtor) => {
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(debtor.id)) {
          newSet.delete(debtor.id);
        } else {
          newSet.add(debtor.id);
        }
        return newSet;
      });
    };

    const handleBulkAction = (action: string) => {
      console.log(`Performing ${action} on:`, Array.from(selectedIds));
      setSelectedIds(new Set()); // Clear selection after action
    };

    const renderItem = (debtor: Debtor) => (
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Checkbox
            label=""
            checked={selectedIds.has(debtor.id)}
            onChange={() => handleSelect(debtor)}
            style={{ marginRight: '8px' }}
          />
          <div style={{ fontWeight: 'bold' }}>{debtor.name}</div>
        </div>
        <div style={{ flexGrow: 1, color: 'var(--theme-text-base)' }}>
          Case: {debtor.caseNumber} | ${debtor.debtAmount.toLocaleString()}
        </div>
      </>
    );

    const renderEditInputs = (item: Debtor, handleChange: (field: keyof Debtor, value: unknown) => void) => {
      return (
        <TextInput id="name" label="Name" value={item.name} onChange={(e) => handleChange('name', e.target.value)} />
      );
    };

    return (
      <>
        {selectedIds.size > 0 && (
          <div
            style={{
              marginBottom: '16px',
              padding: '12px',
              backgroundColor: 'var(--color-blue-10)',
              borderRadius: '4px',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <span style={{ color: 'var(--color-neutral-100)' }}>{selectedIds.size} item(s) selected</span>
            <Button variant="secondary" onClick={() => handleBulkAction('export')} size="small">
              Export Selected
            </Button>
            <Button variant="secondary" onClick={() => handleBulkAction('archive')} size="small">
              Archive Selected
            </Button>
          </div>
        )}

        <h2>Custom Action Bar</h2>
        <p style={{ marginBottom: '16px', color: 'var(--theme-text-base)' }}>
          This example shows a custom action bar with selection checkboxes and status indicators.
        </p>

        <List
          {...args}
          items={debtorList}
          renderItem={renderItem}
          onEdit={() => {}}
          onSave={() => {}}
          onDelete={() => {}}
          renderEditInputs={renderEditInputs}
          renderActions={(debtor) => (
            <ListItemActions item={debtor}>
              {(item) => (
                <>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px',
                      maxHeight: '24px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: item.debtAmount > 20000 ? 'var(--color-red-20)' : 'var(--color-green-20)',
                      color: item.debtAmount > 20000 ? 'var(--color-red-60)' : 'var(--color-green-60)',
                    }}
                  >
                    {item.debtAmount > 20000 ? 'High Risk' : 'Low Risk'}
                  </div>
                  <IconButton
                    fill="none"
                    onClick={() => console.log('Quick action for:', item.name)}
                    title="Quick Action"
                  >
                    <Icon icon="mdi:chevron-right" />
                  </IconButton>
                </>
              )}
            </ListItemActions>
          )}
        />
      </>
    );
  },
};
