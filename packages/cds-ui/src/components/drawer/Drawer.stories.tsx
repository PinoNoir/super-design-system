import { Meta, StoryObj } from '@storybook/react-vite';
import Drawer, { DrawerHandle } from './Drawer';
import React, { useRef } from 'react';
import { Button } from '../button';

const meta: Meta<typeof Drawer> = {
  title: 'Components/Content/Drawer',
  component: Drawer,
  argTypes: {
    children: {
      control: { type: 'text' },
    },
    open: {
      control: { type: 'boolean' },
    },
    defaultOpen: {
      control: { type: 'boolean' },
    },
    onClose: {
      action: 'onClose',
      type: 'function',
    },
    onOpenChange: {
      action: 'onOpenChange',
      type: 'function',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Drawer>;

// Basic controlled usage (backwards compatible with original)
export const Controlled: Story = {
  render: function Controlled(...args) {
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

    const toggleDrawer = () => {
      setIsDrawerOpen(!isDrawerOpen);
    };

    return (
      <div>
        <Button variant="primary" onClick={toggleDrawer}>
          Toggle Drawer
        </Button>
        <Drawer {...args} open={isDrawerOpen} onClose={toggleDrawer}>
          <h2>Controlled Drawer</h2>
          <p>This drawer is controlled by the open prop.</p>
        </Drawer>
      </div>
    );
  },
};

// Controlled with onOpenChange callback
export const ControlledWithCallback: Story = {
  render: function ControlledWithCallback(...args) {
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

    return (
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button variant="primary" onClick={() => setIsDrawerOpen(true)}>
          Open Drawer
        </Button>
        <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>
          Close Drawer
        </Button>
        <Button variant="primary" onClick={() => setIsDrawerOpen((prev) => !prev)}>
          Toggle Drawer
        </Button>
        <div>
          <span>Drawer state: {isDrawerOpen ? 'Open' : 'Closed'}</span>
        </div>
        <Drawer
          {...args}
          open={isDrawerOpen}
          onOpenChange={(state) => {
            setIsDrawerOpen(state);
            console.log(`Drawer state changed to: ${state}`);
          }}
        >
          <h2>Drawer with onOpenChange</h2>
          <p>This drawer demonstrates the onOpenChange callback which is called whenever the drawer state changes.</p>
          <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>
            Close Drawer
          </Button>
        </Drawer>
      </div>
    );
  },
};

// Imperative control with ref
export const ImperativeControl: Story = {
  render: function ImperativeControl(...args) {
    const drawerRef = useRef<DrawerHandle>(null);

    return (
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button variant="primary" onClick={() => drawerRef.current?.open()}>
          Open Drawer
        </Button>
        <Button variant="secondary" onClick={() => drawerRef.current?.close()}>
          Close Drawer
        </Button>
        <Button variant="primary" onClick={() => drawerRef.current?.toggle()}>
          Toggle Drawer
        </Button>
        <Button
          variant="primary"
          fill="none"
          onClick={() => alert(`Drawer is ${drawerRef.current?.isOpen() ? 'open' : 'closed'}`)}
        >
          Check State
        </Button>
        <Drawer
          {...args}
          ref={drawerRef}
          onOpenChange={(open) => console.log(`Drawer changed to ${open ? 'open' : 'closed'} state`)}
        >
          <h2>Imperative Control</h2>
          <p>This drawer is controlled imperatively via a ref.</p>
          <p>The ref exposes open(), close(), toggle(), and isOpen() methods.</p>
          <Button variant="secondary" onClick={() => drawerRef.current?.close()}>
            Close Drawer
          </Button>
        </Drawer>
      </div>
    );
  },
};

// Uncontrolled drawer with defaultOpen
export const UncontrolledWithDefault: Story = {
  render: function UncontrolledWithDefault(...args) {
    const [openCount, setOpenCount] = React.useState(0);
    const [closeCount, setCloseCount] = React.useState(0);

    return (
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <p>Open events: {openCount}</p>
          <p>Close events: {closeCount}</p>
        </div>
        <Drawer
          {...args}
          defaultOpen={true}
          onOpenChange={(isOpen) => {
            const handleOpen = () => setOpenCount((prev) => prev + 1);
            const handleClose = () => setCloseCount((prev) => prev + 1);

            isOpen ? handleOpen() : handleClose();
          }}
        >
          <h2>Uncontrolled Drawer</h2>
          <p>This drawer starts open by default and manages its own state internally.</p>
          <p>Try closing with the X button to see the close count increment.</p>
        </Drawer>
      </div>
    );
  },
};
