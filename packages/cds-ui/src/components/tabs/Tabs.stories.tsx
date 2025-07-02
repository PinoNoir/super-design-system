import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { Panel } from '../panel';
import Tabs, { TabItem } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
};
export default meta;

type Story = StoryObj<typeof Tabs>;

const loremIpsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

const createTabContent = (id: string, label: string, content: string = loremIpsum): TabItem => ({
  id,
  tabLabel: label,
  tabContent: <p>{content}</p>,
});

const createTabs = (count: number): TabItem[] =>
  Array.from({ length: count }, (_, i) => createTabContent(`tab-${i + 1}`, `Tab ${i + 1}`));

export const Default: Story = {
  args: {
    tabItems: createTabs(5),
  },
};

export const WithDefaultSelectedTab: Story = {
  args: {
    tabItems: createTabs(5).map((tab, index) => (index === 2 ? { ...tab, defaultSelected: true } : tab)),
  },
};

export const WithOverflow: Story = {
  args: {
    tabItems: createTabs(12),
  },
};

const panelTabContent: TabItem[] = [
  createTabContent('tab-1', 'Debtor'),
  createTabContent('tab-2', 'Case'),
  createTabContent(
    'tab-3',
    'Client',
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
  ),
  createTabContent(
    'tab-4',
    'Judge',
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
  ),
];

export const PanelWithTabs: Story = {
  render: () => (
    <Panel header="Panel With Tabs" footerDivider footer>
      <Tabs tabItems={panelTabContent} />
    </Panel>
  ),
};
