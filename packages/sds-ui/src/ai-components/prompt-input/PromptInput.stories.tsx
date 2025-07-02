import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import PromptInput from './PromptInput';
import { Plus, Mic, Send, Smile, Square } from 'lucide-react';
import { Beacon, BeaconState } from '../beacon';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, SplitButton, Switch } from '../../components';
import FileChip from '../file-chip/FileChip';

const meta: Meta<typeof PromptInput> = {
  title: 'AI Components/Prompt Input',
  component: PromptInput,
};

export default meta;

type Story = StoryObj<typeof PromptInput>;

export const Basic: Story = {
  render: function Basic() {
    const [value, setValue] = useState('');
    return (
      <PromptInput value={value} onChange={setValue} placeholder="Ask something..." ariaLabel="Basic prompt input" />
    );
  },
};

export const WithIcons: Story = {
  render: function WithIcons() {
    const [value, setValue] = useState('');
    return (
      <PromptInput
        value={value}
        onChange={setValue}
        placeholder="Ask Copilot..."
        iconSlot={<Mic />}
        leftSlot={
          <button aria-label="Send">
            <Plus />
          </button>
        }
        rightSlot={
          <button aria-label="Send">
            <Send />
          </button>
        }
        ariaLabel="Prompt input with icons"
      />
    );
  },
};

export const WithBottomSlot: Story = {
  render: function WithBottomSlot() {
    const [value, setValue] = useState('');
    return (
      <PromptInput
        value={value}
        onChange={setValue}
        placeholder="Type your message..."
        leftSlot={<Smile />}
        rightSlot={
          <button aria-label="Send">
            <Send />
          </button>
        }
        bottomSlot={<div style={{ fontSize: '12px', color: '#888' }}>Press Enter to send</div>}
        ariaLabel="Prompt input with bottom slot"
      />
    );
  },
};

export const Multiline: Story = {
  render: function Multiline() {
    const [value, setValue] = useState('');
    return (
      <PromptInput
        value={value}
        onChange={setValue}
        placeholder="Write a longer message..."
        leftSlot={<Mic />}
        rightSlot={
          <button aria-label="Send">
            <Send />
          </button>
        }
        rows={5}
        maxRows={6}
        ariaLabel="Multiline prompt input"
      />
    );
  },
};

export const FullFeatured: Story = {
  render: function SendMessage() {
    const [value, setValue] = useState('');
    const [sentMessage, setSentMessage] = useState<string | null>(null);
    const [currentState, setCurrentState] = useState<BeaconState | null>(null);
    const [isWebSearchEnabled, setIsWebSearchEnabled] = useState(false);
    const [selectedModel, setSelectedModel] = useState('Claude Sonnet 3.7');

    const handleModelSelect = (label: string) => {
      setSelectedModel(label);
      console.log(`Selected model: ${label}`);
    };

    const dropdownItems = [
      { label: 'Claude Sonnet 3.7', onClick: () => handleModelSelect('Claude Sonnet 3.7') },
      { label: 'Grok', onClick: () => handleModelSelect('Grok') },
      { label: 'Open AI', onClick: () => handleModelSelect('Open AI') },
      { label: 'Deepseek', onClick: () => handleModelSelect('Deepseek') },
    ];

    const handleSend = () => {
      if (!value.trim()) return;

      setSentMessage(value);
      setValue('');
      setCurrentState('thinking');

      // Simulate async response
      setTimeout(() => {
        setCurrentState(null); // Hide the beacon after "thinking"
      }, 2000);
    };

    const handleToggle = (checked: boolean) => {
      setIsWebSearchEnabled(checked);
      console.log(`Web search is now ${checked ? 'enabled' : 'disabled'}`);
    };

    return (
      <div style={{ width: '100%', maxWidth: 800 }}>
        {sentMessage && <div style={{ marginBottom: '1rem', color: 'var(--theme-text-base)' }}>{sentMessage}</div>}
        {currentState === 'thinking' && (
          <div style={{ display: 'flex', margin: '24px 0' }}>
            <Beacon state="thinking" />
          </div>
        )}
        <PromptInput
          value={value}
          onChange={setValue}
          placeholder="Ask me anything..."
          onSubmit={handleSend}
          fileSlot={
            <>
              <FileChip file={new File(['%PDF-1.4'], 'report 1.pdf', { type: 'application/pdf' })} isLoading />
              <FileChip file={new File(['%PDF-1.4'], 'report 2.pdf', { type: 'application/pdf' })} isLoading />
              <FileChip file={new File(['%PDF-1.4'], 'report 3.pdf', { type: 'application/pdf' })} isLoading />
              <FileChip file={new File(['%PDF-1.4'], 'report 4.pdf', { type: 'application/pdf' })} isLoading />
              <FileChip file={new File(['%PDF-1.4'], 'report 5.pdf', { type: 'application/pdf' })} />
            </>
          }
          leftSlot={
            <>
              <Dropdown>
                <DropdownTrigger>
                  <button onClick={handleSend} aria-label="Upload file">
                    <Plus />
                  </button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem onClick={() => console.log('Take a Photo')}>Take a Photo</DropdownItem>
                  <DropdownItem onClick={() => console.log('Upload Files')}>Upload Files</DropdownItem>
                  <DropdownItem onClick={() => console.log('Use Existing Files')}>Use Existing Files</DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                <Switch
                  id="web-search-toggle"
                  label="Web Search"
                  labelPosition="left"
                  inline
                  checked={isWebSearchEnabled}
                  onCheckedChange={handleToggle}
                />
              </div>
            </>
          }
          rightSlot={
            <>
              <SplitButton variant="primary" dropdownItems={dropdownItems}>
                  {selectedModel}
              </SplitButton>

              {currentState === 'thinking' ? (
                <button
                  onClick={() => setCurrentState(null)}
                  aria-label="Stop generation"
                  style={{ cursor: 'pointer' }}
                >
                  <Square />
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  aria-label="Send message"
                  disabled={!value.trim()}
                  style={{ cursor: value.trim() ? 'pointer' : 'not-allowed' }}
                >
                  <Send />
                </button>
              )}
            </>
          }
          bottomSlot={
            <div style={{ fontSize: '12px', color: 'var(--theme-text-muted)' }}>Press Enter or click send</div>
          }
          ariaLabel="Prompt input with send button"
        />
      </div>
    );
  },
};
