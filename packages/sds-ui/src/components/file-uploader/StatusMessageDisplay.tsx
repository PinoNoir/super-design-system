import React from 'react';
import useFileContext from './useFileContext';
import StatusMessage from './StatusMessage';

const StatusMessageDisplay: React.FC = () => {
  const { statusMessage, clearStatusMessage } = useFileContext();

  if (!statusMessage) return null;

  return (
    <StatusMessage
      type={statusMessage.type}
      message={statusMessage.message}
      icon={statusMessage.icon}
      onDismiss={clearStatusMessage}
    />
  );
};

export default StatusMessageDisplay;
