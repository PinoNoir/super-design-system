import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Dropdown, DropdownMenu, DropdownItem, DropdownTrigger } from '../dropdown';
import { Icon } from '@iconify/react';
import Accordion from './Accordion';
import AccordionItem from './AccordionItem';
import { Button } from '../button';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Data Display/Accordion',
  component: Accordion,
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
    docs: {
      description: {
        component: 'An accessible accordion component that allows users to expand and collapse sections of content.',
      },
    },
    controls: { expanded: true },
  },
  argTypes: {
    variant: {
      description: 'The color mode of the accordion.',
      options: ['light', 'dark'],
      control: {
        type: 'select',
      },
      table: {
        defaultValue: { summary: 'light' },
      },
    },
    disabled: {
      description: 'Specify whether the entire accordion should be disabled.',
      control: {
        type: 'boolean',
      },
    },
    className: {
      description: 'Specify an optional className to be applied to the container node.',
      control: {
        type: 'text',
      },
    },
    children: {
      description: 'Pass AccordionItem components as children of the Accordion.',
      control: {
        type: 'object',
      },
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Accordion>;

const createContextMenu = () => (
  <Dropdown>
    <DropdownTrigger>
      <Icon icon="mdi:dots-vertical" />
    </DropdownTrigger>
    <DropdownMenu>
      <DropdownItem onClick={() => console.log('Save clicked')} icon={<Icon icon="mdi:content-copy" />}>
        Save
      </DropdownItem>
      <DropdownItem onClick={() => console.log('Print clicked')} icon={<Icon icon="mdi:printer" />}>
        Print
      </DropdownItem>
      <DropdownItem onClick={() => console.log('Download clicked')} icon={<Icon icon="mdi:download" />}>
        Download
      </DropdownItem>
      <DropdownItem onClick={() => console.log('Delete clicked')} icon={<Icon icon="mdi:delete" />}>
        Delete
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
);

export const BasicAccordion: Story = {
  render: () => (
    <Accordion variant="light">
      <AccordionItem id="accordion-item-1" open={false} title="First Section Title">
        <p>This is the content for the first accordion section. The content can be any ReactNode.</p>
      </AccordionItem>
      <AccordionItem id="accordion-item-2" open={false} title="Second Section Title">
        <p>
          This is the content for the second accordion section. You can put text, images, forms, or any other components
          here.
        </p>
      </AccordionItem>
    </Accordion>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Accordion variant="light">
      <AccordionItem
        id="accordion-item-1"
        open={false}
        title="Product Features"
        description="Overview of all product capabilities"
      >
        <p>Detailed content about product features would appear here.</p>
      </AccordionItem>
      <AccordionItem
        id="accordion-item-2"
        open={false}
        title="Technical Specifications"
        description="Detailed technical information"
      >
        <p>Technical specifications would be listed here.</p>
      </AccordionItem>
    </Accordion>
  ),
};

export const WithContextMenu: Story = {
  render: () => (
    <Accordion variant="light">
      <AccordionItem
        id="accordion-item-1"
        open={false}
        title="Section with Actions"
        description="Supporting Text"
        enableMenuContainer
        contextMenu={createContextMenu()}
      >
        <p>Content with a context menu in the header. Click the three dots to see available actions.</p>
      </AccordionItem>
      <AccordionItem
        id="accordion-item-2"
        open={false}
        title="Another Section"
        description="Supporting Text"
        enableMenuContainer
        contextMenu={createContextMenu()}
      >
        <p>Another section with the same context menu options.</p>
      </AccordionItem>
    </Accordion>
  ),
};

export const DarkVariant: Story = {
  render: () => (
    <Accordion variant="dark">
      <AccordionItem
        id="accordion-item-1"
        open={false}
        title="Dark Theme Section"
        description="Supporting Text"
        enableMenuContainer
        contextMenu={createContextMenu()}
      >
        <p>Content styled for dark mode.</p>
      </AccordionItem>
      <AccordionItem
        id="accordion-item-2"
        open={false}
        title="Another Dark Section"
        description="Supporting Text"
        enableMenuContainer
        contextMenu={createContextMenu()}
      >
        <p>More dark mode content here.</p>
      </AccordionItem>
    </Accordion>
  ),
};

export const DisabledAccordion: Story = {
  render: () => (
    <Accordion variant="light" disabled>
      <AccordionItem id="accordion-item-1" open={false} title="Disabled Section" description="Cannot be expanded">
        <p>This content cannot be accessed because the accordion is disabled.</p>
      </AccordionItem>
      <AccordionItem
        id="accordion-item-2"
        open={false}
        title="Another Disabled Section"
        description="Also cannot be expanded"
      >
        <p>This content also cannot be accessed.</p>
      </AccordionItem>
    </Accordion>
  ),
};

export const IndividuallyDisabled: Story = {
  render: () => (
    <Accordion variant="light">
      <AccordionItem id="accordion-item-1" open={false} title="Active Section" description="Can be expanded">
        <p>This section can be expanded and collapsed normally.</p>
      </AccordionItem>
      <AccordionItem
        id="accordion-item-2"
        open={false}
        title="Disabled Section"
        description="Cannot be expanded"
        disabled
      >
        <p>This specific section cannot be accessed because it is individually disabled.</p>
      </AccordionItem>
      <AccordionItem id="accordion-item-3" open={false} title="Another Active Section" description="Can be expanded">
        <p>This section can be expanded and collapsed normally.</p>
      </AccordionItem>
    </Accordion>
  ),
};

export const CustomHeadingLevel: Story = {
  render: () => (
    <Accordion variant="light">
      <AccordionItem id="accordion-item-1" open={false} title="H2 Heading" headingLevel={2}>
        <p>This accordion uses an h2 element for its heading.</p>
      </AccordionItem>
      <AccordionItem id="accordion-item-2" open={false} title="H3 Heading" headingLevel={3}>
        <p>This accordion uses an h3 element for its heading.</p>
      </AccordionItem>
    </Accordion>
  ),
};

export const ControlledAccordion: Story = {
  render: () => {
    // This is a function component so we can use hooks
    const ControlledExample = () => {
      const [openItemId, setOpenItemId] = useState<string | null>('accordion-item-1');

      return (
        <div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 8, marginBottom: 24 }}>
            <Button variant="base" onClick={() => setOpenItemId('accordion-item-1')}>
              Open First
            </Button>
            <Button variant="base" onClick={() => setOpenItemId('accordion-item-2')}>
              Open Second
            </Button>
            <Button variant="base" onClick={() => setOpenItemId(null)}>
              Close All
            </Button>
          </div>

          <Accordion variant="light" openItemId={openItemId} setOpenItemId={setOpenItemId}>
            <AccordionItem
              id="accordion-item-1"
              open={false} // Important: set to false to prevent useEffect conflicts
              title="Controlled Section 1"
            >
              <p>This accordion's state is controlled externally through React state.</p>
            </AccordionItem>
            <AccordionItem
              id="accordion-item-2"
              open={false} // Important: set to false to prevent useEffect conflicts
              title="Controlled Section 2"
            >
              <p>Click the buttons above to control which section is open.</p>
              <p>
                The "Close All" button sets the openItemId to null, which closes both sections. When you click on a
                section header, it will toggle that section open or closed.
              </p>
            </AccordionItem>
          </Accordion>
        </div>
      );
    };

    return <ControlledExample />;
  },
};

export const ComplexContent: Story = {
  render: () => (
    <Accordion variant="light">
      <AccordionItem id="accordion-item-1" open={false} title="Form Elements">
        <div>
          <h4>Contact Form</h4>
          <form onSubmit={(e) => e.preventDefault()}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Name:
              </label>
              <input id="name" type="text" style={{ width: '100%', padding: '0.5rem' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Email:
              </label>
              <input id="email" type="email" style={{ width: '100%', padding: '0.5rem' }} />
            </div>
            <Button variant="secondary" type="submit">
              Submit
            </Button>
          </form>
        </div>
      </AccordionItem>
      <AccordionItem id="accordion-item-2" open={false} title="Data Table">
        <div>
          <h4>Product Comparison</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '0.5rem', textAlign: 'left' }}>Feature</th>
                <th style={{ border: '1px solid #ccc', padding: '0.5rem', textAlign: 'left' }}>Basic</th>
                <th style={{ border: '1px solid #ccc', padding: '0.5rem', textAlign: 'left' }}>Pro</th>
                <th style={{ border: '1px solid #ccc', padding: '0.5rem', textAlign: 'left' }}>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Users</td>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>1-5</td>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>1-20</td>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Unlimited</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Storage</td>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>10GB</td>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>100GB</td>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>1TB</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Support</td>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Email</td>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Email + Chat</td>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>24/7 Priority</td>
              </tr>
            </tbody>
          </table>
        </div>
      </AccordionItem>
    </Accordion>
  ),
};
