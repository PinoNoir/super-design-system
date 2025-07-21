'use client';

import { useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import styles from './styles/chat-interface.module.css';
import MessageList from '../message-list';
import ChatInput from '../chat-input';

export default function ChatContainer() {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use the useChat hook with simplified configuration
  const { messages, input, handleInputChange, handleSubmit, error, reload, stop, status, setInput } = useChat({
    api: '/api/ai',
    id: 'chat-session',
    initialMessages: [],
    onResponse: (response) => {
      console.log('Response received:', response.status);
    },
    onFinish: (message, options) => {
      console.log('Chat finished:', options.finishReason);
    },
    onError: (error) => {
      console.error('Chat error:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });
      }
    },
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
