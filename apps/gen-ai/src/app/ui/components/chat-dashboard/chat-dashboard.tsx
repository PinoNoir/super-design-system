'use client';

import React, { useCallback, useState } from 'react';
import { Button } from 'sds-ui';
import ChatDetails from '../chat-details';
import { logout } from '@/app/actions';
import {
  LayoutGrid,
  Settings,
  Users,
  SettingsIcon as Functions,
  Layers,
  Eye,
  BarChart2,
  LogOut,
  FileText,
} from 'lucide-react';
import clsx from 'clsx';
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
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
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
          </div>
          <div className={styles.sidebarContent}>
            <div className={styles.sidebarNav}>
              <nav className={styles.navSection}>
                <button className={styles.navButton}>
                  <LayoutGrid className={styles.iconButton} />
                  Tasks
                </button>
                <button className={styles.navButton}>
                  <Functions className={styles.iconButton} />
                  Functions
                </button>
                <button className={styles.navButton}>
                  <Layers className={styles.iconButton} />
                  Integrations
                </button>
                <button className={styles.navButton}>
                  <Users className={styles.iconButton} />
                  Users
                </button>
                <button className={styles.navButton}>
                  <Settings className={styles.iconButton} />
                  Settings
                </button>
              </nav>
              <div className={clsx(styles.navSection, styles.secondaryNav)}>
                <button className={styles.navButton}>
                  <Eye className={styles.iconButton} />
                  Live preview
                </button>
                <button className={styles.navButton}>
                  <BarChart2 className={styles.iconButton} />
                  Performance
                </button>
                <button className={styles.navButton} onClick={logout}>
                  <LogOut className={styles.iconButton} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

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
