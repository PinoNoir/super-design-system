'use client';

import React from 'react';
import { Avatar, Button, AIstars } from '@stretto/cds-ui';
import { Copy, Download, ThumbsUp, ThumbsDown, User, FileText } from 'lucide-react';
import clsx from 'clsx';
import styles from './styles/message-item.module.css';
import { PdfContext } from '../chat-dashboard';

interface MessageItemProps {
  readonly role: string;
  readonly content: string;
  readonly pdfName?: string | null;
}

export default function MessageItem({ role, content, pdfName }: MessageItemProps) {
  // Access the PDF context
  const pdfContext = React.useContext(PdfContext);
  // Use a state to store the time, initialized with empty string
  const [timeString, setTimeString] = React.useState('');

  // Update the time string only on the client side after component mounts
  React.useEffect(() => {
    const formattedTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
    setTimeString(formattedTime);
  }, []);

  const isAssistant = role === 'assistant' || role === 'system';

  // Check if the message contains a PDF reference
  const shouldShowPdfButton = () => {
    // If we have a direct PDF name reference
    if (pdfName) {
      return true;
    }

    // For assistant messages that mention viewing a PDF
    if (isAssistant && typeof content === 'string' && content.toLowerCase().includes('view document analysis')) {
      return true;
    }

    return false;
  };

  // Handle "View PDF" button click
  const handleViewPdf = () => {
    console.log('View PDF clicked:', {
      pdfContext: !!pdfContext,
      pdfName,
      messageType: role,
    });

    if (!pdfContext) {
      console.error('Cannot view PDF: missing context');
      return;
    }

    // If we have a PDF name directly
    if (pdfName) {
      console.log('Opening PDF with name:', pdfName);
      pdfContext.setActivePdf(pdfName);
      return;
    }

    // For assistant messages, try to extract name from content
    if (isAssistant && typeof content === 'string') {
      const regex = /PDF file named "([^"]+)"/i;
      const match = regex.exec(content);
      if (match?.[1]) {
        console.log('Opening PDF from assistant message:', match[1]);
        pdfContext.setActivePdf(match[1]);
        return;
      }
    }

    console.error('No PDF name found to view');
  };

  return (
    <div className={clsx(styles.messageContainer, role === 'user' && styles.userMessage)}>
      {isAssistant ? (
        <Avatar
          username="Agent"
          isLoggedIn={false}
          size="md"
          className={styles.agentAvatar}
          automation-id="agent-avatar"
        >
          <AIstars fill="var(--theme-icon-inverted)" />
        </Avatar>
      ) : (
        <Avatar
          username={'User'}
          isLoggedIn={false}
          size="md"
          className={styles.userAvatar}
          automation-id="user-avatar"
        >
          <User />
        </Avatar>
      )}

      <div className={styles.messageContent}>
        <div className={styles.messageHeader}>
          <span className={styles.senderName}>{isAssistant ? 'Best Case Assisstant' : 'Nicholas Pino'}</span>
          {timeString && <span className={styles.timestamp}>{timeString}</span>}
        </div>
        <div className={styles.messageBubble}>
          <p className={styles.messageText}>{content}</p>

          {shouldShowPdfButton() && pdfContext && (
            <div className={styles.pdfActions}>
              <Button variant="secondary" size="small" icon={<FileText size={14} />} onClick={handleViewPdf}>
                View Document Analysis
              </Button>
            </div>
          )}
        </div>

        {isAssistant && content && (
          <div className={styles.messageActions}>
            <button className={styles.iconButton} onClick={() => navigator.clipboard.writeText(content)}>
              <Copy />
            </button>
            <button className={styles.iconButton}>
              <Download />
            </button>
            <button className={styles.iconButton}>
              <ThumbsUp />
            </button>
            <button className={styles.iconButton}>
              <ThumbsDown />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
