import React from 'react';
import { Icon } from '@iconify/react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Grid, GridItem, SectionAlert, TextInput } from '../';
import Panel, { PanelProps } from './Panel';
import Tooltip from '../tooltip/Tooltip';

const meta: Meta<typeof Panel> = {
  title: 'Components/Content/Panel',
  component: Panel,
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  argTypes: {
    border: {
      control: {
        options: ['base', 'none'],
        type: 'select',
      },
    },
    footer: {
      table: {
        disable: true,
      },
    },
    sectionAlert: {
      table: {
        disable: true,
      },
    },
    header: {
      table: {
        disable: true,
      },
    },
    headerIcon: {
      table: {
        disable: true,
      },
    },
    footerDivider: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Panel>;

export const Default: Story = {
  render: (args: PanelProps) => (
    <Panel
      header="h2 header"
      headerActionButton={
        <Button variant="tertiary" fill="outline">
          Add Task
        </Button>
      }
      footerDivider={args.footerDivider}
      border={args.border}
    >
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
        standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make
        a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
        remaining essentially unchanged.
      </p>
    </Panel>
  ),
};

export const withFooter: Story = {
  render: (args: PanelProps) => (
    <Panel
      header="h2 header"
      border={args.border}
      footer={
        <div>
          <Button variant="primary">Primary Button</Button>
        </div>
      }
    >
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
        standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make
        a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
        remaining essentially unchanged.
      </p>
    </Panel>
  ),
};

export const withFooterDivider: Story = {
  render: (args: PanelProps) => (
    <Panel
      {...args}
      header="h2 header"
      border="base"
      footerDivider={true}
      footer={
        <div>
          <Button variant="primary">Primary Button</Button>
        </div>
      }
    >
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
        standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make
        a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
        remaining essentially unchanged.
      </p>
    </Panel>
  ),
};

const createTooltip = () => (
  <Tooltip description="Tooltip Content">
    <Icon icon="mdi:information" />
  </Tooltip>
);

export const withHeaderIconAndTooltip: Story = {
  render: (args: PanelProps) => (
    <Panel
      {...args}
      header="h2 header"
      headerIcon={createTooltip()}
      border="base"
      footerDivider={true}
      footer={
        <div>
          <Button variant="primary">Primary Button</Button>
        </div>
      }
    >
      <Grid columns="repeat(auto-fit, minmax(200px, 1fr))" gridAutoRows="auto">
        <GridItem as="div" colSpan={1}>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged.
          </p>
        </GridItem>
        <GridItem as="div" colSpan={1}>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged.
          </p>
        </GridItem>
        <GridItem as="div" colSpan={1}>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged.
          </p>
        </GridItem>
      </Grid>
    </Panel>
  ),
};

export const WithSectionAlert: Story = {
  render: (args: PanelProps) => (
    <Panel
      {...args}
      header="h2 header"
      sectionAlert={<SectionAlert variant="info" message="This is a section alert info message." />}
      border="base"
      footerDivider={true}
      footer={
        <div>
          <Button variant="primary">Primary Button</Button>
        </div>
      }
    >
      <Grid columns={4}>
        <GridItem as="div" colSpan={4}>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged.
          </p>
        </GridItem>
        <GridItem as="div" colSpan={2}>
          <TextInput id="text-input-1" type="text" label="Label text" helperText="Optional help text" />
        </GridItem>
        <GridItem as="div" colSpan={2}>
          <TextInput id="text-input-2" type="text" label="Label text" helperText="Optional help text" />
        </GridItem>
        <GridItem as="div" colSpan={2}>
          <TextInput id="text-input-3" type="text" label="Label text" helperText="Optional help text" />
        </GridItem>
        <GridItem as="div" colSpan={2}>
          <TextInput id="text-input-4" type="text" label="Label text" helperText="Optional help text" />
        </GridItem>
      </Grid>
    </Panel>
  ),
};
