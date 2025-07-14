import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import ToggleGroup from './ToggleGroup';
import { MoonIcon, PhoneIcon, PhoneOffIcon, SunIcon } from 'lucide-react';

const meta: Meta<typeof ToggleGroup> = {
  title: 'Components/Buttons/ToggleGroup',
  component: ToggleGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A toggle group component that allows users to select between two options. Built with Radix UI primitives for accessibility and custom styling.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'select' },
      options: ['0', '1'],
      description: 'The currently selected value (index as string)',
    },
    onValueChange: {
      action: 'value changed',
      description: 'Callback fired when the selected value changes',
    },
    icons: {
      control: { type: 'object' },
      description: 'The icons to display in the toggle group',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to handle state
const ToggleGroupWithState = ({
  initialValue = '0',
  ...props
}: {
  initialValue?: string;
  onValueChange?: (value: string) => void;
}) => {
  const [value, setValue] = useState(initialValue);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    props.onValueChange?.(newValue);
  };

  return (
    <ToggleGroup
      value={value}
      onValueChange={handleValueChange}
      icons={[<SunIcon className="toggleIcon" />, <MoonIcon className="toggleIcon" />]}
    />
  );
};

export const Default: Story = {
  render: () => <ToggleGroupWithState />,
  parameters: {
    docs: {
      description: {
        story: 'Default toggle group with sun and moon icons. The left option (sun) is selected by default.',
      },
    },
  },
};

export const RightSelected: Story = {
  render: () => <ToggleGroupWithState initialValue="1" />,
  parameters: {
    docs: {
      description: {
        story: 'Toggle group with the right option (moon) pre-selected.',
      },
    },
  },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('0');
    const [log, setLog] = useState<string[]>([]);

    const handleValueChange = (newValue: string) => {
      setValue(newValue);
      setLog((prev) => [...prev, `Changed to: ${newValue}`]);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        <ToggleGroup
          value={value}
          onValueChange={handleValueChange}
          icons={[<SunIcon className="toggleIcon" />, <MoonIcon className="toggleIcon" />]}
        />
        <div
          style={{
            background: '#f5f5f5',
            padding: '10px',
            borderRadius: '4px',
            minWidth: '200px',
            fontSize: '14px',
          }}
        >
          <strong>Current value:</strong> {value}
          {log.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <strong>Change log:</strong>
              <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                {log.slice(-3).map((entry, index) => (
                  <li key={index}>{entry}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive example showing the current value and change log. Click the toggle buttons to see the state changes.',
      },
    },
  },
};

export const ThemeToggle: Story = {
  render: () => {
    const [theme, setTheme] = useState('light');

    const handleThemeChange = (newTheme: string) => {
      setTheme(newTheme === '0' ? 'light' : 'dark');
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Theme: <strong>{theme}</strong>
        </div>
        <ToggleGroup
          value={theme === 'light' ? '0' : '1'}
          onValueChange={handleThemeChange}
          icons={[<SunIcon className="toggleIcon" />, <MoonIcon className="toggleIcon" />]}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Example of using the toggle group for theme switching. The sun icon represents light theme and moon icon represents dark theme.',
      },
    },
  },
};

export const MultipleInstances: Story = {
  render: () => {
    const [preference1, setPreference1] = useState('0');
    const [preference2, setPreference2] = useState('1');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Notification Settings</h4>
          <ToggleGroup
            value={preference1}
            onValueChange={setPreference1}
            icons={[<SunIcon className="toggleIcon" />, <MoonIcon className="toggleIcon" />]}
          />
          <div style={{ fontSize: '12px', marginTop: '5px', color: '#666' }}>
            {preference1 === '0' ? 'Email notifications enabled' : 'SMS notifications enabled'}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Display Mode</h4>
          <ToggleGroup
            value={preference2}
            onValueChange={setPreference2}
            icons={[<PhoneIcon className="toggleIcon" />, <PhoneOffIcon className="toggleIcon" />]}
          />
          <div style={{ fontSize: '12px', marginTop: '5px', color: '#666' }}>
            {preference2 === '0' ? 'Compact view' : 'Detailed view'}
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Multiple toggle groups used for different settings. Each toggle group maintains its own state independently.',
      },
    },
  },
};

export const Accessibility: Story = {
  render: () => <ToggleGroupWithState />,
  parameters: {
    docs: {
      description: {
        story:
          'The toggle group is built with Radix UI primitives, providing full keyboard navigation support, ARIA attributes, and screen reader compatibility.',
      },
    },
  },
};
