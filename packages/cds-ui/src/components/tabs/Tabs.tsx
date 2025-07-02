import React from 'react';
import { Icon } from '@iconify/react';
import { clsx } from 'clsx';
import styles from './styles/Tabs.module.css';

export type TabItem = {
  /**
   * Unique id for the tab
   */
  id: string;

  /**
   * Specify the tab label
   */
  tabLabel: string;

  /**
   * Specify if the tab is selected by default
   */
  defaultSelected?: boolean;

  /**
   * Pass in children to be rendered within the Tab content area
   */
  tabContent: React.ReactNode;

  /**
   * Optionally specify an automation id for testing purposes
   */
  ['automation-id']?: string;

  /**
   * Optionally specify a custom CSS className
   */
  className?: string;
};

export interface TabProps extends React.ComponentPropsWithRef<'button'> {
  /**
   * Array of tab items
   */
  tabItems: TabItem[];
}

/** Tabs organize content into multiple sections and allow users to navigate between them. The content under the set of tabs should be related and form a coherent unit. */
const Tabs = React.forwardRef<HTMLButtonElement, TabProps>(function Tabs({ tabItems, ...props }, forwardedRef) {
  const defaultTab = tabItems.find((tab) => tab.defaultSelected) || tabItems[0];
  const [activeTabId, setActiveTabId] = React.useState(defaultTab.id);
  const [isOverflowing, setIsOverflowing] = React.useState(false);
  const tabHeaderRef = React.useRef<HTMLDivElement>(null);

  const checkForOverflow = () => {
    if (tabHeaderRef.current) {
      const isOverflow = tabHeaderRef.current.scrollWidth > tabHeaderRef.current.offsetWidth;
      setIsOverflowing(isOverflow);
    }
  };

  React.useEffect(() => {
    checkForOverflow();

    const handleResize = () => {
      checkForOverflow();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabHeaderRef.current) {
      const containerWidth = tabHeaderRef.current.offsetWidth;
      const scrollWidth = tabHeaderRef.current.scrollWidth;
      const currentScroll = tabHeaderRef.current.scrollLeft;

      // Calculate the new scroll position
      let newScrollPosition = direction === 'left' ? currentScroll - containerWidth : currentScroll + containerWidth;

      // Clamp the new scroll position between 0 and the maximum scrollable width
      newScrollPosition = Math.max(0, Math.min(newScrollPosition, scrollWidth - containerWidth));

      tabHeaderRef.current.scrollLeft = newScrollPosition;
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
  };

  const activeTabIndex = tabItems.findIndex((tab) => tab.id === activeTabId);

  return (
    <div className={styles.tabGroupContainer}>
      <div className={styles.tabGroup}>
        <div className={styles.tabBar}>
          <div className={styles.tabScroller}>
            <div className={styles.tabHeaders}>
              {isOverflowing && (
                <button
                  className={styles.tabScrollArrows}
                  onClick={() => scrollTabs('left')}
                  automation-id="left-arrow"
                  aria-label="Scroll left"
                >
                  <Icon icon="mdi:chevron-left" />
                </button>
              )}
              <div
                className={clsx(styles.tabScrollerScroll, styles.tabScrollerScrollArea)}
                ref={tabHeaderRef}
                automation-id="tab-header"
              >
                <div className={styles.tabScrollerScrollContent}>
                  <div className={styles.tabList} role="tablist">
                    {tabItems.map((tab) => (
                      <button
                        role="tab"
                        key={tab.id}
                        className={clsx(styles.tab, activeTabId === tab.id ? styles.activeTab : styles.inactiveTab)}
                        onClick={() => handleTabClick(tab.id)}
                        ref={forwardedRef}
                        {...props}
                      >
                        {tab.tabLabel}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {isOverflowing && (
                <button
                  className={styles.tabScrollArrows}
                  onClick={() => scrollTabs('right')}
                  automation-id="right-arrow"
                  aria-label="Scroll right"
                >
                  <Icon icon="mdi:chevron-right" />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className={styles.contentContainer}>
          {activeTabIndex !== -1 ? tabItems[activeTabIndex].tabContent : null}
        </div>
      </div>
    </div>
  );
});

export default Tabs;
