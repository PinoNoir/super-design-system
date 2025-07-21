'use client';

import React from 'react';
import { Message } from '@ai-sdk/react';
import { Loader, IconButton } from 'sds-ui';
import styles from './styles/message-list.module.css';
import MessageItem from '../message-item';
import { Square } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onRetryAction: () => void;
  onStopAction: () => void;
}

export default function MessageList({ messages, isLoading, onRetryAction, onStopAction }: MessageListProps) {
  return (
    <div className={styles.messagesContainer}>
      <div className={styles.messagesWrapper}>
        {messages.length === 0 && <MessageItem role="assistant" content="Hi, how can I help you today?" />}

        {messages.map((message) => {
          // Extract PDF info if available in this message
          let pdfName = null;

          if (typeof message.content === 'string' && message.content.toLowerCase().includes('pdf')) {
            // Check for upload message pattern
            const pdfRegex = /PDF file named "([^"]+)"/i;
            const match = pdfRegex.exec(message.content);
            if (match?.[1]) {
              pdfName = match[1];
            }
          }

          return <MessageItem key={message.id} role={message.role} content={message.content} pdfName={pdfName} />;
        })}

        {isLoading && (
          <div className={styles.loaderContainer}>
            <Loader description="One moment please..." />
            <IconButton variant="secondary" size="small" onClick={onStopAction}>
              <Square size={20} />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
}
