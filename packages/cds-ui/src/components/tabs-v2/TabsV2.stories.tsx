import { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Panel } from '../panel';
import TabsV2 from './TabsV2';

const meta: Meta<typeof TabsV2> = {
  title: 'Components/Navigation/Tabs V2',
  component: TabsV2,
};
export default meta;

type Story = StoryObj<typeof TabsV2>;

const tabs = [
  { id: 'home', label: 'Home' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'settings', label: 'Settings' },
  { id: 'profile', label: 'Profile' },
  { id: 'edit-profile', label: 'Edit Profile' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'billing', label: 'Billing' },
  { id: 'security', label: 'Security' },
  { id: 'logout', label: 'Logout' },
];

const TabsTemplate: Story = {
  render: function TabsTemplate(args) {
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    return <TabsV2 {...args} tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />;
  },
};

export const Default: Story = {
  ...TabsTemplate,
};

export const WithDefaultSelectedTab: Story = {
  ...TabsTemplate,
  args: {
    activeTab: 'dashboard',
  },
};

export const withOverflow: Story = {
  ...TabsTemplate,
};

export const PanelWithTabs: Story = {
  render: function PanelWithTabs(args) {
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    return (
      <Panel header="Panel With Tabs" footerDivider footer>
        <TabsV2 {...args} tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </Panel>
    );
  },
};
