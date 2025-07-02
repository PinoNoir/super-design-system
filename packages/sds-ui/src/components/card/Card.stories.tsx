import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import Card from './Card';
import Button from '../button/Button';

const meta: Meta = {
  title: 'Components/Content/Card',
  component: Card,
  subcomponents: {
    CardTitle: Card.Title as React.ComponentType<any>,
    CardFooter: Card.Footer as React.ComponentType<any>,
  },
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      options: ['base', 'bordered'],
      control: { type: 'select' },
    },
    className: {
      control: {
        type: 'text',
      },
    },
    isLoading: {
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <Card.Title>Title</Card.Title>
      <Card.Content>Content</Card.Content>
      <Card.Footer align="end">
        <Button variant="primary">Click Here!</Button>
      </Card.Footer>
    </Card>
  ),
};

export const Bordered: Story = {
  render: () => (
    <Card variant="bordered">
      <Card.Title>Title</Card.Title>
      <Card.Content>Content</Card.Content>
      <Card.Footer>
        <Button variant="primary">Click Here!</Button>
      </Card.Footer>
    </Card>
  ),
};

export const Loading: Story = {
  render: () => (
    <Card isLoading>
      <Card.Title>Title</Card.Title>
      <Card.Content>Content</Card.Content>
      <Card.Footer>
        <Button variant="primary">Click Here!</Button>
      </Card.Footer>
    </Card>
  ),
};
