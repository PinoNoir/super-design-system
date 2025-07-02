import { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import Divider from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Layout Components/Divider',
  component: Divider,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A flexible divider component for separating content with customizable thickness and orientation.',
      },
    },
  },
  argTypes: {
    thickness: {
      options: ['thin', 'medium', 'thick'],
      control: { type: 'select' },
      description: 'Controls the thickness of the divider border',
    },
    orientation: {
      options: ['horizontal', 'vertical'],
      control: { type: 'select' },
      description: 'Sets the orientation of the divider',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes to apply',
    },
  },
  args: {
    thickness: 'medium',
    orientation: 'horizontal',
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

const sampleText = {
  lines: ['I code, delete, recode', 'Delete again, and then', 'I read documentation', 'And then I code again.'],
  words: ['Design', 'Develop', 'Deploy', 'Iterate'],
};

// Default story showing basic usage
export const Default: Story = {
  args: {
    thickness: 'medium',
    orientation: 'horizontal',
  },
  render: (args) => (
    <div style={{ width: '300px' }}>
      <p>Content above the divider</p>
      <Divider {...args} />
      <p>Content below the divider</p>
    </div>
  ),
};

// Horizontal dividers with different content layouts
export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    thickness: 'medium',
  },
  render: (args) => (
    <div style={{ maxWidth: '400px', lineHeight: '1.6' }}>
      {sampleText.lines.map((line) => (
        <React.Fragment key={line}>
          <p style={{ margin: '12px 0' }}>{line}</p>
          {line !== sampleText.lines[sampleText.lines.length - 1] && <Divider {...args} />}
        </React.Fragment>
      ))}
    </div>
  ),
};

// Vertical dividers in a row layout
export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    thickness: 'medium',
  },
  render: (args) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        height: '60px',
        flexWrap: 'wrap',
      }}
    >
      {sampleText.words.map((word, i) => (
        <React.Fragment key={word}>
          <span style={{ padding: '8px 0', whiteSpace: 'nowrap', color: 'var(--color-text-base)' }}>{word}</span>
          {i < sampleText.words.length - 1 && <Divider {...args} />}
        </React.Fragment>
      ))}
    </div>
  ),
};

// Showcase all thickness variants
export const ThicknessVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '300px' }}>
      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-base)' }}>
          Thin
        </h4>
        <Divider thickness="thin" orientation="horizontal" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-base)' }}>
          Medium
        </h4>
        <Divider thickness="medium" orientation="horizontal" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-base)' }}>
          Thick
        </h4>
        <Divider thickness="thick" orientation="horizontal" />
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

// Combined horizontal and vertical layout
export const MixedLayout: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
      <div>
        <h3 style={{ margin: '0 0 12px 0', color: 'var(--color-text-base)' }}>Project Phases</h3>
        <Divider thickness="thick" orientation="horizontal" />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          color: 'var(--color-text-base)',
        }}
      >
        <span>Planning</span>
        <Divider thickness="thin" orientation="vertical" />
        <span>Development</span>
        <Divider thickness="thin" orientation="vertical" />
        <span>Testing</span>
        <Divider thickness="thin" orientation="vertical" />
        <span>Launch</span>
      </div>

      <div>
        <Divider thickness="medium" orientation="horizontal" />
        <p style={{ margin: '12px 0 0 0', fontSize: '14px', color: '#666' }}>Each phase builds upon the previous one</p>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

// Interactive playground
export const Playground: Story = {
  args: {
    thickness: 'medium',
    orientation: 'horizontal',
  },
  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexDirection: args.orientation === 'horizontal' ? 'column' : 'row',
        alignItems: args.orientation === 'horizontal' ? 'stretch' : 'center',
        gap: '16px',
        maxWidth: '400px',
        minHeight: args.orientation === 'vertical' ? '100px' : 'auto',
        padding: '20px',
        border: '1px dashed #ccc',
        borderRadius: '4px',
      }}
    >
      <div
        style={{
          padding: '8px',
          color: 'var(--color-text-base)',
          backgroundColor: 'var(--theme-color-foreground)',
          borderRadius: '4px',
          textAlign: 'center',
        }}
      >
        Content Block 1
      </div>

      <Divider {...args} />

      <div
        style={{
          padding: '8px',
          color: 'var(--color-text-base)',
          backgroundColor: 'var(--theme-color-foreground)',
          borderRadius: '4px',
          textAlign: 'center',
        }}
      >
        Content Block 2
      </div>
    </div>
  ),
};
