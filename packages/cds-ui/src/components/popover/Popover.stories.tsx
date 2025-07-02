import React from 'react';
import { Icon } from '@iconify/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Popover from './Popover';
import { Button } from '../button';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popovers/Popover',
  component: Popover,
  argTypes: {
    children: { control: { disable: true } },
    description: { control: { type: 'text' } },
    open: { control: { type: 'boolean' } },
    defaultOpen: { control: { type: 'boolean' } },
    onOpenChange: { action: 'onOpenChange', type: 'function' },
    modal: { control: { type: 'boolean' } },
    side: {
      control: { type: 'select' },
      options: ['top', 'right', 'bottom', 'left'],
      description: 'The preferred side of the anchor to render against',
    },
    sideOffset: {
      control: { type: 'number' },
      description: 'The distance in pixels from the anchor',
    },
    hideArrow: {
      control: { type: 'boolean' },
      description: 'Whether to hide the arrow',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Popover component provides contextual information or actions when a user interacts with a trigger element.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Popover>;

export const Basic: Story = {
  args: {
    children: <Icon width="24px" height="24px" color="var(--color-neutral-100)" icon="mdi:help-box"></Icon>,
    description: 'This is some basic popover content.',
  },
  parameters: {
    docs: {
      description: {
        story: 'The default popover configuration with a help icon as the trigger and simple text content.',
      },
    },
  },
};

export const WithRichContent: Story = {
  args: {
    children: <Icon width="24px" height="24px" color="var(--theme-info)" icon="mdi:information"></Icon>,
    description: (
      <div style={{ maxWidth: '300px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600 }}>Additional Information</h3>
        <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
          This popover contains formatted content with a heading, paragraph, and a link.
        </p>
        <Button
          variant="accent"
          onClick={() => {
            alert('Learn more clicked!');
          }}
        >
          Learn more
        </Button>
      </div>
    ),
    defaultOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'A popover with rich HTML content including headings, paragraphs, and actionable links.',
      },
    },
  },
};

export const CustomTrigger: Story = {
  args: {
    children: <Button variant="primary">Click for details</Button>,
    description: 'This popover is triggered by a custom Button instead of an icon.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how to use a custom trigger element (Button) instead of the default icon.',
      },
    },
  },
};

export const ModalPopover: Story = {
  args: {
    children: <Icon width="24px" height="24px" color="var(--theme-color-warning)" icon="mdi:alert-circle"></Icon>,
    description: (
      <div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600, color: 'var(--color-neutral-100)' }}>
          Important Notice
        </h3>
        <p>
          This popover is in modal mode, which means it traps focus and blocks interaction with the rest of the page
          until dismissed.
        </p>
        <p style={{ marginTop: '8px' }}>Try clicking outside - you must click the X to close it.</p>
      </div>
    ),
    modal: true,
    defaultOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'A modal popover that traps focus and requires user interaction before returning to the main content.',
      },
    },
  },
};

export const PositionedPopovers: Story = {
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '400px', padding: '50px' }}>
      <Popover side="top" description="This popover appears above the trigger">
        <Icon width="24px" height="24px" icon="mdi:arrow-up"></Icon>
      </Popover>
      <Popover side="right" description="This popover appears to the right of the trigger">
        <Icon width="24px" height="24px" icon="mdi:arrow-right"></Icon>
      </Popover>
      <Popover side="bottom" description="This popover appears below the trigger">
        <Icon width="24px" height="24px" icon="mdi:arrow-down"></Icon>
      </Popover>
      <Popover side="left" description="This popover appears to the left of the trigger">
        <Icon width="24px" height="24px" icon="mdi:arrow-left"></Icon>
      </Popover>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates different positioning options for the popover relative to its trigger.',
      },
    },
  },
};

export const WithoutArrow: Story = {
  args: {
    children: <Icon width="24px" height="24px" color="var(--color-neutral-100)" icon="mdi:dots-vertical"></Icon>,
    description: 'This popover is displayed without the pointing arrow.',
    hideArrow: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'A popover configuration that hides the pointing arrow, giving it a more menu-like appearance.',
      },
    },
  },
};

// Updated WithCustomWidth story
export const WithCustomWidth: Story = {
  args: {
    children: <Icon width="24px" height="24px" color="var(--color-neutral-100)" icon="mdi:resize-horizontal"></Icon>,
    description: (
      <div>
        <p>This popover has a custom width set to accommodate more content.</p>
        <p>It's useful when you need to display larger amounts of information or more complex UI elements.</p>
      </div>
    ),
    width: '400px', // Use the new width prop
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how to create a wider popover for displaying more complex content.',
      },
    },
  },
};

// Alternative WithCustomWidth with contentStyle
export const WithCustomWidthAlt: Story = {
  args: {
    children: <Icon width="24px" height="24px" color="var(--color-neutral-100)" icon="mdi:resize-horizontal"></Icon>,
    description: (
      <div>
        <p>This popover uses contentStyle to set custom width and other styles.</p>
        <p>This approach gives you more flexibility for styling the popover content.</p>
      </div>
    ),
    contentStyle: {
      width: '400px',
      backgroundColor: 'var(--theme-color-foreground)',
      borderLeft: '4px solid var(--theme-color-info)',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how to use contentStyle for more advanced styling of the popover.',
      },
    },
  },
};

export const FormInPopover: Story = {
  args: {
    children: <Icon width="24px" height="24px" color="var(--theme-color-info)" icon="mdi:pencil"></Icon>,
    description: (
      <form style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label htmlFor="popover-email-input" style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
            Email
          </label>
          <input
            id="popover-email-input"
            type="email"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        </div>
        <Button
          variant="primary"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            alert('Form submitted!');
          }}
        >
          Subscribe
        </Button>
      </form>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates using a popover to contain a simple form, like a quick subscribe or feedback input.',
      },
    },
  },
};

export const WithCustomOffset: Story = {
  args: {
    children: <Icon width="24px" height="24px" color="var(--color-neutral-100)" icon="mdi:arrow-expand"></Icon>,
    description: 'This popover has a larger offset (20px) from its trigger.',
    sideOffset: 20,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how to adjust the distance between the popover and its trigger using the sideOffset prop.',
      },
    },
  },
};
