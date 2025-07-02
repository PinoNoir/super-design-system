import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { clsx } from 'clsx';
import styles from './styles/TabsV2.module.css';

export type TabV2Item = {
  id: string;
  label: string;
};

export type TabV2Props = {
  tabs: TabV2Item[];
  activeTab?: string;
  onTabChange: (tabId: string) => void;
};

const TabsV2: React.FC<TabV2Props> = ({ tabs, activeTab, onTabChange }) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const tabHeaderRef = useRef<HTMLDivElement>(null);

  const checkForOverflow = () => {
    if (tabHeaderRef.current) {
      const isOverflow = tabHeaderRef.current.scrollWidth > tabHeaderRef.current.offsetWidth;
      setIsOverflowing(isOverflow);
    }
  };

  useEffect(() => {
    checkForOverflow();
    window.addEventListener('resize', checkForOverflow);
    return () => window.removeEventListener('resize', checkForOverflow);
  }, []);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabHeaderRef.current) {
      const containerWidth = tabHeaderRef.current.offsetWidth;
      const scrollWidth = tabHeaderRef.current.scrollWidth;
      const currentScroll = tabHeaderRef.current.scrollLeft;
      let newScrollPosition = direction === 'left' ? currentScroll - containerWidth : currentScroll + containerWidth;
      newScrollPosition = Math.max(0, Math.min(newScrollPosition, scrollWidth - containerWidth));
      tabHeaderRef.current.scrollLeft = newScrollPosition;
    }
  };

  return (
    <div className={styles.tabGroupContainer}>
      <div className={styles.tabGroup}>
        <div className={styles.tabBar}>
          <div className={styles.tabScroller}>
            <div className={styles.tabHeaders} automation-id="tab-header">
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
              <div className={clsx(styles.tabScrollerScroll, styles.tabScrollerScrollArea)} ref={tabHeaderRef}>
                <div className={styles.tabScrollerScrollContent}>
                  <div className={styles.tabList} role="tablist">
                    {tabs.map((tab) => (
                      <button
                        role="tab"
                        key={tab.id}
                        className={clsx(styles.tab, { [styles.active]: activeTab === tab.id })}
                        onClick={() => onTabChange(tab.id)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <div className={styles.tabBorder} />
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
      </div>
    </div>
  );
};

export default TabsV2;
