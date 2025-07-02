'use client';

import { useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import styles from './styles/chat-interface.module.css';
import MessageList from '../message-list';
import ChatInput from '../chat-input';

export default function ChatContainer() {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use the useChat hook with all configuration options
  const { messages, input, handleInputChange, handleSubmit, error, reload, stop, status, setInput } = useChat({
    api: '/api/ai',
    id: 'best-case-chat', // Consistent ID for this chat instance
    initialMessages: [], // You can provide initial messages if needed
    onResponse: (response) => {
      // Optional callback when response is received
      console.log('Response received:', response.status);
    },
    onFinish: (message, options) => {
      // Optional callback when streaming is complete
      console.log('Chat finished:', options.finishReason);
    },
    onError: (error) => {
      console.error('Chat error:', error);
    },
    // Optional: Handle tool calls if needed
    onToolCall: async ({ toolCall }) => {
      // Example tool call handling
      if (toolCall.toolName === 'getCurrentTime') {
        return new Date().toLocaleTimeString();
      }
      // Add more tool handlers as needed
      return null;
    },
    // Higher max steps if you'll use tool calls that might need multiple exchanges
    maxSteps: 3,
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle errors
  if (error) {
    console.error('Chat error:', error);
  }

  return (
    <div className={styles.chatContainer}>
      <MessageList
        messages={messages}
        isLoading={status === 'streaming' || status === 'submitted'}
        onRetryAction={() => reload()}
        onStopAction={() => stop()}
      />
      <div ref={messagesEndRef} />
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={status === 'streaming' || status === 'submitted'}
        status={status}
        setInput={setInput}
      />
    </div>
  );
}
