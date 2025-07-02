import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import Breadcrumb from './Breadcrumb';
import BreadcrumbItem from './BreadcrumbItem';
import { Icon } from '@iconify/react';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Components/Navigation/Breadcrumb',
  component: Breadcrumb,
};
export default meta;

type Story = StoryObj<typeof Breadcrumb>;

const breadcrumbItems = [
  { title: 'Home', path: '/' },
  { title: 'Products', path: '/products' },
  { title: 'Electronics', path: '/products/electronics' },
  { title: 'Smartphones', path: '/products/electronics/smartphones' },
];

export const Default: Story = {
  render: () => (
    <Breadcrumb aria-label="Default Breadcrumb">
      {breadcrumbItems.map((item) => (
        <BreadcrumbItem key={item.title} href={item.path}>
          {item.title}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  ),
};

export const WithCurrentPage: Story = {
  render: () => {
    const title = breadcrumbItems.length - 1;

    return (
      <Breadcrumb aria-label="Breadcrumb with current page">
        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem
            key={item.title}
            href={item.path}
            isCurrentPage={index === title}
            aria-current={index === title ? 'page' : undefined}
          >
            {item.title}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    );
  },
};

export const NoTrailingSlash: Story = {
  render: () => {
    return (
      <Breadcrumb aria-label="Breadcrumb without trailing slash" noTrailingSlash>
        {breadcrumbItems.map((item) => (
          <BreadcrumbItem key={item.title} href={item.path}>
            {item.title}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    );
  },
};

export const WithCustomContent: Story = {
  render: () => {
    return (
      <Breadcrumb aria-label="Breadcrumb with custom content">
        <BreadcrumbItem href="/">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon icon="mdi:monitor-dashboard" width="16px" color="var(--theme-icon-info)" />
            Dashboard
          </div>
        </BreadcrumbItem>
        <BreadcrumbItem href="/products">Cases</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage aria-current="page">
          Clients
        </BreadcrumbItem>
      </Breadcrumb>
    );
  },
};
