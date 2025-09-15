import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import DateRangePicker from './DateRangePicker';
import type { DateRange } from 'react-day-picker';

const meta: Meta<typeof DateRangePicker> = {
  title: 'Components/Inputs/Date Range Picker',
  component: DateRangePicker,
  tags: ['!autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input field',
    },
    numberOfMonths: {
      control: { type: 'number', min: 1, max: 3 },
      description: 'Number of months to display',
    },
    months: {
      control: { type: 'number', min: 1, max: 3 },
      description: 'Legacy prop for numberOfMonths',
    },
    captionLayout: {
      control: { type: 'select' },
      options: ['label', 'dropdown', 'dropdown-months', 'dropdown-years'],
      description: 'Layout of the month caption',
    },
    fixedWeeks: {
      control: 'boolean',
      description: 'Display 6 weeks per month',
    },
    showOutsideDays: {
      control: 'boolean',
      description: 'Show days from other months',
    },
    required: {
      control: 'boolean',
      description: 'Make selection required',
    },
    excludeDisabled: {
      control: 'boolean',
      description: 'Exclude disabled dates from range',
    },
    min: {
      control: { type: 'number', min: 1, max: 30 },
      description: 'Minimum nights in range',
    },
    max: {
      control: { type: 'number', min: 1, max: 30 },
      description: 'Maximum nights in range',
    },
    format: {
      control: 'text',
      description: 'Date format string',
    },
    dir: {
      control: { type: 'select' },
      options: ['ltr', 'rtl'],
      description: 'Text direction',
    },
  },
};

export default meta;

type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {
  args: {
    placeholder: 'Select date range',
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic date range picker with default settings.',
      },
    },
  },
};

export const WithMinMaxDates: Story = {
  args: {
    minDate: new Date(2024, 0, 1),
    maxDate: new Date(2024, 11, 31),
    placeholder: 'Select dates in 2024',
  },
  parameters: {
    docs: {
      description: {
        story: 'Date range picker with minimum and maximum date constraints using legacy props.',
      },
    },
  },
};

export const MultipleMonths: Story = {
  args: {
    numberOfMonths: 2,
    placeholder: 'Pick a range',
  },
  parameters: {
    docs: {
      description: {
        story: 'Date range picker displaying multiple months for better range selection.',
      },
    },
  },
};

export const DropdownNavigation: Story = {
  args: {
    captionLayout: 'dropdown',
    numberOfMonths: 2,
    placeholder: 'Use dropdowns to navigate',
  },
  parameters: {
    docs: {
      description: {
        story: 'Date range picker with dropdown navigation for months and years.',
      },
    },
  },
};

export const FixedWeeks: Story = {
  args: {
    fixedWeeks: true,
    showOutsideDays: true,
    placeholder: 'Fixed 6-week layout',
  },
  parameters: {
    docs: {
      description: {
        story: 'Date range picker with fixed 6-week layout to prevent height changes.',
      },
    },
  },
};

export const RangeConstraints: Story = {
  args: {
    min: 3,
    max: 14,
    placeholder: 'Select 3-14 nights',
  },
  parameters: {
    docs: {
      description: {
        story: 'Date range picker with minimum and maximum night constraints.',
      },
    },
  },
};

export const BusinessDaysOnly: Story = {
  args: {
    disabled: { dayOfWeek: [0, 6] }, // Disable weekends
    min: 1,
    max: 10,
    placeholder: 'Business days only (1-10 days)',
  },
  parameters: {
    docs: {
      description: {
        story: 'Date range picker that only allows business days (Monday-Friday) with range constraints.',
      },
    },
  },
};

export const CustomFormat: Story = {
  args: {
    format: 'dd/MM/yyyy',
    placeholder: 'DD/MM/YYYY format',
  },
  parameters: {
    docs: {
      description: {
        story: 'Date range picker with custom date format (DD/MM/YYYY).',
      },
    },
  },
};

export const RequiredSelection: Story = {
  args: {
    required: true,
    placeholder: 'Required selection',
  },
  parameters: {
    docs: {
      description: {
        story: 'Date range picker with required selection - cannot be cleared once selected.',
      },
    },
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<DateRange | undefined>();
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <DateRangePicker value={value} onChange={setValue} placeholder="Controlled picker" />
        <div
          style={{
            padding: '12px',
            backgroundColor: 'var(--theme-color-component)',
            color: 'var(--theme-text-base)',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          <strong>Selected Range:</strong>
          <br />
          {value?.from ? (
            <>
              From: {value.from.toLocaleDateString()}
              <br />
              To: {value.to ? value.to.toLocaleDateString() : 'Not selected'}
              {value.from && value.to && (
                <>
                  <br />
                  <strong>Duration:</strong>{' '}
                  {Math.ceil((value.to.getTime() - value.from.getTime()) / (1000 * 60 * 60 * 24))} days
                </>
              )}
            </>
          ) : (
            'No date range selected'
          )}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Controlled date range picker with real-time display of selected values and duration calculation.',
      },
    },
  },
};

export const AdvancedFeatures: Story = {
  render: () => {
    const [value, setValue] = useState<DateRange | undefined>();
    const [showAdvanced, setShowAdvanced] = useState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            padding: '8px 16px',
            backgroundColor: 'var(--theme-color-component)',
            color: 'var(--theme-text-base)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Features
        </button>

        <DateRangePicker
          value={value}
          onChange={setValue}
          placeholder="Advanced date range picker"
          numberOfMonths={showAdvanced ? 2 : 1}
          captionLayout={showAdvanced ? 'dropdown' : 'label'}
          fixedWeeks={showAdvanced}
          showOutsideDays={true}
          min={showAdvanced ? 2 : undefined}
          max={showAdvanced ? 30 : undefined}
          excludeDisabled={showAdvanced}
        />

        {showAdvanced && (
          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--theme-color-component)',
              color: 'var(--theme-text-base)',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            <strong>Advanced Features Enabled:</strong>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>2-month view</li>
              <li>Dropdown navigation</li>
              <li>Fixed 6-week layout</li>
              <li>2-30 night range constraint</li>
              <li>Exclude disabled dates</li>
            </ul>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showcasing advanced features that can be toggled on/off.',
      },
    },
  },
};

export const FlexibleWidth: Story = {
  render: () => {
    const [value, setValue] = useState<DateRange | undefined>();

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ margin: '0 0 8px 0' }}>Short Placeholder</h4>
          <DateRangePicker value={value} onChange={setValue} placeholder="Pick dates" />
        </div>

        <div>
          <h4 style={{ margin: '0 0 8px 0' }}>Long Placeholder</h4>
          <DateRangePicker value={value} onChange={setValue} placeholder="Choose your vacation dates for this year" />
        </div>

        <div>
          <h4 style={{ margin: '0 0 8px 0' }}>With Selected Range</h4>
          <DateRangePicker
            value={{
              from: new Date(2024, 5, 15),
              to: new Date(2024, 5, 22),
            }}
            onChange={setValue}
            placeholder="Select date range"
          />
        </div>

        <div
          style={{
            padding: '12px',
            backgroundColor: 'var(--theme-color-component)',
            color: 'var(--theme-text-base)',
            borderRadius: '4px',
            fontSize: '14px',
            maxWidth: '400px',
          }}
        >
          <strong>Flexible Width Features:</strong>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>Minimum width: 200px for usability</li>
            <li>Expands to fit content</li>
            <li>Responsive to placeholder length</li>
            <li>Adapts to selected date range display</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the flexible width behavior of the date range picker input.',
      },
    },
  },
};

export const StylingShowcase: Story = {
  render: () => {
    const [value, setValue] = useState<DateRange | undefined>();

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h4 style={{ margin: '0 0 8px 0' }}>Default Styling</h4>
          <DateRangePicker value={value} onChange={setValue} placeholder="Default styling" />
        </div>

        <div>
          <h4 style={{ margin: '0 0 8px 0' }}>With Custom Class Names</h4>
          <DateRangePicker
            value={value}
            onChange={setValue}
            placeholder="Custom styling"
            className="custom-date-picker"
            classNames={
              {
                root: 'custom-root',
                day_button: 'custom-day-button',
                selected: 'custom-selected',
              } as any
            }
          />
        </div>

        <div
          style={{
            padding: '12px',
            backgroundColor: 'var(--theme-color-component)',
            color: 'var(--theme-text-base)',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          <strong>Note:</strong> The custom class names above are examples. You can add corresponding CSS rules to style
          these elements as needed.
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Showcase of different styling options available with the date range picker.',
      },
    },
  },
};
