'use client';

import React, { useCallback, useState } from 'react';
import { Button, Sidebar } from 'sds-ui';
import ChatDetails from '../chat-details';
import { logout } from '@/app/actions';
import { Settings, LogOut, FileText, Home as LucideHome, Search, MessageCircle, User } from 'lucide-react';
import styles from './styles/chat-layout.module.css';

// Create a PDF context to share pdf state across components
export const PdfContext = React.createContext<{
  setActivePdf: (fileId: string) => void;
  clearActivePdf: () => void;
}>({
  setActivePdf: () => {},
  clearActivePdf: () => {},
});

export default function ChatDashboard({ children }: { readonly children: React.ReactNode }) {
  // State to control the details drawer
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activePdfId, setActivePdfId] = useState<string | null>(null);

  // Handle opening the details panel
  const handleOpenDetails = () => {
    setIsDetailsOpen(true);
  };

  // Handle closing the details panel
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  // PDF context handlers
  const setActivePdf = React.useCallback((fileId: string) => {
    setActivePdfId(fileId);
    setIsDetailsOpen(true);
  }, []);

  const clearActivePdf = useCallback(() => {
    setActivePdfId(null);
  }, []);

  const contextValue = React.useMemo(
    () => ({
      setActivePdf,
      clearActivePdf,
    }),
    [setActivePdf, clearActivePdf],
  );

  return (
    <PdfContext.Provider value={contextValue}>
      <div className={styles.appContainer}>
        <Sidebar
          header={
            <div className={styles.brand}>
              <svg width="32" height="32" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.491 17.8175L17.7472 11.6667H44.6489L39.0183 17.8175H11.491Z"
                  fill="var(--color-neutral-100)"
                />
                <path d="M5.35081 37.5L11.607 31.3492H38.5087L32.8781 37.5H5.35081Z" fill="var(--color-neutral-100)" />
                <path
                  d="M7.97293 21.508L1.66663 27.6587H42.6576L48.3333 21.508H7.97293Z"
                  fill="var(--color-neutral-100)"
                />
              </svg>
            </div>
          }
          sections={[
            {
              id: 'main',
              title: 'Main Navigation',
              items: [
                {
                  id: 'home',
                  label: 'Home',
                  icon: <LucideHome />,
                  isActive: true,
                  onClick: () => console.log('Home clicked'),
                },
                {
                  id: 'dashboard',
                  label: 'Dashboard',
                  icon: <Search />,
                  onClick: () => console.log('Dashboard clicked'),
                },
                {
                  id: 'messages',
                  label: 'Messages',
                  icon: <MessageCircle />,
                  badge: '3',
                  onClick: () => console.log('Messages clicked'),
                },
              ],
            },
            {
              id: 'history',
              title: 'History',
              items: [
                {
                  id: 'recent-1',
                  label: 'Recent Chat 1',
                  icon: <MessageCircle />,
                  onClick: () => console.log('Recent Chat 1 clicked'),
                },
                {
                  id: 'recent-2',
                  label: 'Recent Chat 2',
                  icon: <MessageCircle />,
                  onClick: () => console.log('Recent Chat 2 clicked'),
                },
                {
                  id: 'recent-3',
                  label: 'Recent Chat 3',
                  icon: <MessageCircle />,
                  onClick: () => console.log('Recent Chat 3 clicked'),
                },
              ],
            },
            {
              id: 'settings',
              title: 'Settings',
              items: [
                {
                  id: 'profile',
                  label: 'Profile',
                  icon: <User />,
                  onClick: () => console.log('Profile clicked'),
                },
                {
                  id: 'preferences',
                  label: 'Preferences',
                  icon: <Settings />,
                  onClick: () => console.log('Preferences clicked'),
                },
              ],
            },
          ]}
          footer={
            <div className={styles.sidebarFooter}>
              <Button variant="secondary" onClick={logout} icon={<LogOut />}>
                Logout
              </Button>
            </div>
          }
        />

        <div className={styles.mainContent}>
          <div className={styles.headerContainer}>
            <header className={styles.header}>
              <div className={styles.headerActions}>
                <Button variant="primary" size="small">
                  Save Chat
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={handleOpenDetails}
                  icon={activePdfId ? <FileText size={16} /> : undefined}
                >
                  {activePdfId ? 'View Document' : 'Chat Notes'}
                </Button>
              </div>
            </header>
          </div>
          {children}
        </div>

        <ChatDetails
          isOpen={isDetailsOpen}
          onOpen={handleOpenDetails}
          onClose={handleCloseDetails}
          activePdfId={activePdfId}
        >
          Notes Go here.
        </ChatDetails>
      </div>
    </PdfContext.Provider>
  );
}
