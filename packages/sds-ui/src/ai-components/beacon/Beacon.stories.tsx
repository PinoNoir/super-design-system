import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import Beacon from './Beacon';
import { Button } from '../../components/button';

const meta: Meta<typeof Beacon> = {
  title: 'AI Components/Beacon',
  component: Beacon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A flexible status indicator component for AI chatbots that shows thinking, processing, generating, and idle states.

## Features
- Animated blue drop shadow with pulsing effect
- Customizable state messages
- Configurable animations and timing
- Progress bar for active states
- Accessibility support with ARIA labels
- Optional completion callbacks
        `,
      },
    },
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['thinking', 'processing', 'generating', 'idle'],
      description: 'Current state of the AI chatbot',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'thinking' },
      },
    },
    showProgressBar: {
      control: 'boolean',
      description: 'Show/hide the progress bar animation',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }, // Updated to match new default
      },
    },
    animateDots: {
      control: 'boolean',
      description: 'Enable/disable animated dots after text',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    dotInterval: {
      control: { type: 'range', min: 200, max: 1000, step: 100 },
      description: 'Interval between dot animations (ms)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '500' },
      },
    },
    transitionDuration: {
      control: { type: 'range', min: 100, max: 800, step: 50 },
      description: 'Duration of text transition animations (ms)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '300' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all animations and interactions',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Beacon>;

// Basic State Stories
export const Thinking: Story = {
  args: {
    state: 'thinking',
  },
};

export const Processing: Story = {
  args: {
    state: 'processing',
  },
};

export const Generating: Story = {
  args: {
    state: 'generating',
  },
};

export const Idle: Story = {
  args: {
    state: 'idle',
  },
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Disabled state stops all animations and interactions.',
      },
    },
  },
  args: {
    state: 'thinking',
    disabled: true,
  },
};

type BeaconState = 'thinking' | 'processing' | 'generating' | 'idle';

// Interactive Demo
export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Automatically cycles through all states to demonstrate transitions and animations.',
      },
    },
  },
  render: function InteractiveDemo() {
    const [currentState, setCurrentState] = useState<BeaconState>('thinking');
    const [completions, setCompletions] = useState(0);

    const states: Array<BeaconState> = ['thinking', 'processing', 'generating', 'idle'];

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentState((prevState) => {
          const currentIndex = states.indexOf(prevState);
          return states[(currentIndex + 1) % states.length];
        });
      }, 2500);

      return () => clearInterval(interval);
    }, []);

    const handleComplete = () => {
      setCompletions((prev) => prev + 1);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#64748b',
          }}
        >
          <strong>Current State:</strong> {currentState} | <strong>Completions:</strong> {completions}
        </div>
        <Beacon state={currentState} onComplete={handleComplete} />
      </div>
    );
  },
};

// Customization Examples
export const CustomMessages: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates custom messages for different states, useful for specific AI workflows.',
      },
    },
  },
  args: {
    state: 'processing',
    customMessages: {
      thinking: 'Analyzing query',
      processing: 'Searching knowledge base',
      generating: 'Crafting response',
      idle: 'How can I help?',
    },
  },
};

export const MinimalConfiguration: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Minimal setup without progress bar and dot animations for cleaner UI.',
      },
    },
  },
  args: {
    state: 'thinking',
    showProgressBar: false,
    animateDots: false,
  },
};

export const FastAnimations: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Faster animations for more responsive feeling interfaces.',
      },
    },
  },
  args: {
    state: 'processing',
    dotInterval: 200,
    transitionDuration: 150,
  },
};

export const SlowAnimations: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Slower, more relaxed animations for calmer user experiences.',
      },
    },
  },
  args: {
    state: 'generating',
    dotInterval: 800,
    transitionDuration: 500,
  },
};

export const WithProgressBar: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shows the beacon with progress bar enabled - useful for longer operations.',
      },
    },
  },
  args: {
    state: 'processing',
    showProgressBar: true,
  },
};

// Comparison View
export const AllStates: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of all available states.',
      },
    },
  },
  render: () => {
    const states: Array<{ state: 'thinking' | 'processing' | 'generating' | 'idle'; description: string }> = [
      { state: 'thinking', description: 'AI is considering the user input' },
      { state: 'processing', description: 'AI is actively processing the request' },
      { state: 'generating', description: 'AI is generating the response' },
      { state: 'idle', description: 'AI is ready and waiting for input' },
    ];

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          maxWidth: '1000px',
        }}
      >
        {states.map(({ state, description }) => (
          <div
            key={state}
            style={{
              padding: '20px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}
          >
            <div
              style={{
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#1e293b',
                textTransform: 'capitalize',
              }}
            >
              {state}
            </div>
            <div
              style={{
                marginBottom: '16px',
                fontSize: '13px',
                color: '#64748b',
                lineHeight: '1.4',
              }}
            >
              {description}
            </div>
            <Beacon state={state} />
          </div>
        ))}
      </div>
    );
  },
};

// Real-world Implementation Example
export const ChatbotWorkflow: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Realistic chatbot workflow simulation showing how to implement state management.',
      },
    },
  },
  render: function ChatbotWorkflow() {
    const [currentState, setCurrentState] = useState<'thinking' | 'processing' | 'generating' | 'idle'>('idle');
    const [isRunning, setIsRunning] = useState(false);
    const [log, setLog] = useState<string[]>([]);

    const simulateWorkflow = async () => {
      if (isRunning) return;

      setIsRunning(true);
      setLog([]);

      // Simulate user query received
      setLog((prev) => [...prev, '🧑 User: "What is machine learning?"']);
      setCurrentState('thinking');
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Processing phase
      setLog((prev) => [...prev, '🤖 AI: Starting to process...']);
      setCurrentState('processing');
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generating response
      setLog((prev) => [...prev, '🤖 AI: Generating response...']);
      setCurrentState('generating');
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Complete
      setLog((prev) => [...prev, '🤖 AI: Response ready!']);
      setCurrentState('idle');
      setIsRunning(false);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', maxWidth: '500px' }}>
        <Beacon
          state={currentState}
          customMessages={{
            thinking: 'Understanding your question',
            processing: 'Searching knowledge',
            generating: 'Writing response',
            idle: 'Ready for questions',
          }}
          onComplete={() => setLog((prev) => [...prev, '✅ Workflow completed!'])}
        />

        <Button variant="base" onClick={simulateWorkflow} disabled={isRunning}>
          {isRunning ? 'Running Simulation...' : 'Start AI Workflow'}
        </Button>

        {log.length > 0 && (
          <div
            style={{
              width: '100%',
              maxHeight: '200px',
              overflowY: 'auto',
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              fontSize: '13px',
              fontFamily: 'monospace',
            }}
          >
            {log.map((entry, index) => (
              <div key={entry + '-' + index} style={{ marginBottom: '4px', color: '#475569' }}>
                {entry}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
};

// Performance Comparison
export const PerformanceComparison: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Compare different animation configurations for performance considerations.',
      },
    },
  },
  render: () => {
    const configs = [
      { title: 'High Performance', showProgressBar: false, animateDots: false },
      { title: 'Balanced', showProgressBar: true, animateDots: true, dotInterval: 600 },
      { title: 'Full Featured', showProgressBar: true, animateDots: true, dotInterval: 300 },
    ];

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          maxWidth: '800px',
        }}
      >
        {configs.map((config) => (
          <div
            key={config.title}
            style={{
              padding: '20px',
              backgroundColor: 'var(--theme-color-foreground)',
              border: '1px solid var(--theme-border-base)',
              borderRadius: '12px',
            }}
          >
            <h4>{config.title}</h4>
            <Beacon state="processing" {...config} />
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--theme-text-base)' }}>
              Progress Bar: {config.showProgressBar ? 'Yes' : 'No'}
              <br />
              Dot Animation: {config.animateDots ? 'Yes' : 'No'}
              <br />
              {config.dotInterval ? `Dot Speed: ${config.dotInterval}ms` : null}
            </div>
          </div>
        ))}
      </div>
    );
  },
};
