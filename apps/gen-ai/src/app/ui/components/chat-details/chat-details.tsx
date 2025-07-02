'use client';

import { useState, useEffect } from 'react';
import { Drawer, Text, TabsV2 } from 'sds-ui';
import { FileText } from 'lucide-react';
import styles from './styles/chat-details.module.css';
import PdfExtraction from '../pdf-viewer';

interface ChatDetailsProps {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  activePdfId?: string | null;
}

const ChatDetails: React.FC<ChatDetailsProps> = ({
  children,
  className,
  isOpen = false,
  onOpen,
  onClose,
  activePdfId,
}) => {
  // Define tab items
  const tabs = [
    { id: 'notes', label: 'Chat Notes' },
    { id: 'pdf', label: 'Document Analysis' },
  ];

  // State to track the active tab
  const [activeTab, setActiveTab] = useState<string>('notes');

  // When a PDF is activated, switch to PDF tab
  useEffect(() => {
    // Only switch tabs if activePdfId changes AND is not null
    if (activePdfId) {
      setActiveTab('pdf');
    }
  }, [activePdfId]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleOpen = () => {
    onOpen?.();
  };

  const handleClose = () => {
    onClose?.();
  };

  return (
    <Drawer open={isOpen} onOpenChange={isOpen ? handleOpen : handleClose} onClose={onClose} className={className}>
      <div className={styles.rightPanel}>
        <TabsV2 tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

        <div className={styles.tabContent}>
          {activeTab === 'notes' && (
            <>
              <h2 className={styles.panelTitle}>Chat Notes</h2>
              {children}
            </>
          )}

          {activeTab === 'pdf' && (
            <>
              {activePdfId ? (
                <PdfExtraction
                  filename={activePdfId}
                  onExtracted={(data) => {
                    console.log('PDF data extracted:', data);
                  }}
                />
              ) : (
                <div className={styles.emptyState}>
                  <FileText size={48} opacity={0.5} />
                  <Text as="p" size="small">
                    No document is currently being analyzed. Upload a PDF from the chat interface to see its details
                    here.
                  </Text>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default ChatDetails;
