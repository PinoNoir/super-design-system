import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { BankBalance, CaseList, DeadlinesContainer } from '../components/sub-components';
import { WidgetType } from '../components/widget-card/WidgetCard';
import { WidgetContainer, WidgetCard } from '../components';
import styles from './styles/Layout.module.css';

const INITIAL_WIDGETS: WidgetType[] = [
  {
    id: 'widget-1',
    title: 'Case Deadlines',
    content: <DeadlinesContainer />,
  },
  {
    id: 'widget-2',
    title: 'Upcoming Meetings',
    content: <></>,
  },
  {
    id: 'widget-3',
    title: 'Case List',
    content: <CaseList />,
  },
  {
    id: 'widget-4',
    title: 'Bank Summary',
    content: <></>,
  },
  {
    id: 'widget-5',
    title: 'Court Imports',
    content: <></>,
  },
  {
    id: 'widget-6',
    title: 'Upcoming Tasks',
    content: <></>,
  },
  {
    id: 'widget-7',
    title: 'Transactions',
    content: <></>,
  },
  {
    id: 'widget-8',
    title: 'Trustee Suite Training',
    content: <></>,
  },
  {
    id: 'widget-9',
    title: 'Bank Balance',
    content: <BankBalance data={[]} />,
  },
];

// Define container IDs
const CONTAINERS = [
  { id: 'container-1', title: 'Primary Widgets' },
  { id: 'container-2', title: 'Secondary Widgets' },
  { id: 'container-3', title: 'Tertiary Widgets' },
  { id: 'container-4', title: 'Quaternary Widgets' },
];

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  // Active drag state
  const [activeId, setActiveId] = useState<string | null>(null);

  // Container widgets state - stores the widget IDs for each container
  const [containerWidgets, setContainerWidgets] = useState<Record<string, string[]>>({
    'container-1': ['widget-1', 'widget-2'],
    'container-2': ['widget-3', 'widget-4'],
    'container-3': ['widget-8', 'widget-9'],
    'container-4': ['widget-5', 'widget-6', 'widget-7'],
  });

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Find the active widget when dragging
  const activeWidget = activeId ? INITIAL_WIDGETS.find((widget) => widget.id === activeId) : null;

  // Get widgets for a specific container
  const getContainerWidgets = (containerId: string) => {
    const widgetIds = containerWidgets[containerId] || [];
    return widgetIds.map((id) => INITIAL_WIDGETS.find((widget) => widget.id === id)).filter(Boolean);
  };

  // Find which container a widget belongs to
  const findContainer = (widgetId: string) => {
    return Object.keys(containerWidgets).find((containerId) => containerWidgets[containerId]?.includes(widgetId));
  };

  // Helper to get items of a container
  const getContainerItems = (containerId: string): string[] => {
    return [...(containerWidgets[containerId] || [])];
  };

  // Start dragging
  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id as string);
  }

  // Handle drag end - this is where the actual reordering happens
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    // Exit if no valid drop target
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find which containers are involved
    const activeContainerId = findContainer(activeId);
    const overContainerId = findContainer(overId);

    // If we can't determine the containers, exit
    if (!activeContainerId) {
      setActiveId(null);
      return;
    }

    // Check if we're dropping on a container instead of a widget
    const isOverContainer = CONTAINERS.some((container) => container.id === overId);

    // If dropping directly on a container
    if (isOverContainer) {
      // Don't do anything if it's the same container the item is already in
      if (activeContainerId === overId) {
        setActiveId(null);
        return;
      }

      // Move to a different container
      setContainerWidgets((prev) => {
        // Remove from source container
        const sourceItems = [...(prev[activeContainerId] || [])];
        const activeIndex = sourceItems.indexOf(activeId);
        if (activeIndex !== -1) {
          sourceItems.splice(activeIndex, 1);
        }

        // Add to destination container at the end
        const destItems = [...(prev[overId] || [])];
        destItems.push(activeId);

        return {
          ...prev,
          [activeContainerId]: sourceItems,
          [overId]: destItems,
        };
      });

      setActiveId(null);
      return;
    }

    // If over a widget in the same container - reordering within container
    if (activeContainerId === overContainerId) {
      setContainerWidgets((prev) => {
        const items = [...(prev[activeContainerId] || [])];
        const oldIndex = items.indexOf(activeId);
        const newIndex = items.indexOf(overId);

        if (oldIndex !== -1 && newIndex !== -1) {
          return {
            ...prev,
            [activeContainerId]: arrayMove(items, oldIndex, newIndex),
          };
        }
        return prev;
      });
    }
    // If over a widget in a different container - moving between containers
    else if (overContainerId) {
      setContainerWidgets((prev) => {
        // Remove from source container
        const sourceItems = [...(prev[activeContainerId] || [])];
        const activeIndex = sourceItems.indexOf(activeId);
        if (activeIndex !== -1) {
          sourceItems.splice(activeIndex, 1);
        }

        // Add to destination container at the specific position
        const destItems = [...(prev[overContainerId] || [])];
        const overIndex = destItems.indexOf(overId);
        if (overIndex !== -1) {
          destItems.splice(overIndex, 0, activeId);
        } else {
          destItems.push(activeId);
        }

        return {
          ...prev,
          [activeContainerId]: sourceItems,
          [overContainerId]: destItems,
        };
      });
    }

    setActiveId(null);
  }

  // Render the component
  return (
    <div className={styles.mainWrapper}>
      <h1>Home</h1>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className={styles.containersWrapper}>
          {CONTAINERS.map((container) => {
            const items = getContainerItems(container.id);
            const widgets = getContainerWidgets(container.id);

            return (
              <React.Fragment key={container.id}>
                <SortableContext id={container.id} items={items} strategy={verticalListSortingStrategy}>
                  <WidgetContainer id={container.id} isEmpty={widgets.length === 0}>
                    {widgets.map((widget) => widget && <WidgetCard key={widget.id} widget={widget} />)}
                  </WidgetContainer>
                </SortableContext>
              </React.Fragment>
            );
          })}
        </div>

        <DragOverlay>{activeId && activeWidget ? <WidgetCard widget={activeWidget} /> : null}</DragOverlay>
      </DndContext>
    </div>
  );
}
