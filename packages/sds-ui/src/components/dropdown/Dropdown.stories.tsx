import { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown, DropdownItem, DropdownTrigger, DropdownMenu, DropdownSubmenu } from './';
import { Button } from '../button';
import { Icon } from '@iconify/react';
import { IconButton } from '../icon-button';
import React from 'react';

const meta: Meta = {
  title: 'Components/Popovers/Dropdown',
  component: Dropdown,
  argTypes: {
    children: { control: { disable: true } },
    onClick: { action: 'clicked' },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

export const DefaultDropdown: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="primary">Open Dropdown</Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onClick={() => console.log('primary-click-action')}>Primary Action</DropdownItem>
        <DropdownItem onClick={() => console.log('secondary-click-action')}>Secondary Action</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const IconTrigger: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <IconButton variant="primary">
          <Icon icon="mdi:pencil" width="20px" color="var(--color-white)" />
        </IconButton>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onClick={() => console.log('edit')}>Edit</DropdownItem>
        <DropdownItem onClick={() => console.log('delete')}>Delete</DropdownItem>
        <DropdownItem onClick={() => console.log('share')}>Share</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="secondary" shape="square">
          File Options
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem
          onClick={() => console.log('open')}
          icon={<Icon icon="mdi:folder-open" width="20px" color="var(--theme-icon-base)" />}
        >
          Open
        </DropdownItem>
        <DropdownItem
          onClick={() => console.log('save')}
          icon={<Icon icon="mdi:download" width="20px" color="var(--theme-icon-base)" />}
        >
          Save
        </DropdownItem>
        <DropdownItem
          onClick={() => console.log('print')}
          icon={<Icon icon="mdi:printer" width="20px" color="var(--theme-icon-base)" />}
        >
          Print
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const NestedDropdowns: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="primary">Main Menu</Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onClick={() => console.log('option1')}>Option 1</DropdownItem>
        <DropdownItem onClick={() => console.log('option2')}>Option 2</DropdownItem>
        <DropdownSubmenu label="Submenu">
          <DropdownItem onClick={() => console.log('sub1')}>Sub Option 1</DropdownItem>
          <DropdownItem onClick={() => console.log('sub2')}>Sub Option 2</DropdownItem>
        </DropdownSubmenu>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const DisabledItems: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="primary">Actions</Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onClick={() => console.log('enabled')}>Enabled Action</DropdownItem>
        <DropdownItem onClick={() => console.log('disabled')} disabled>
          Disabled Action
        </DropdownItem>
        <DropdownItem onClick={() => console.log('also-enabled')}>Another Enabled Action</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};
