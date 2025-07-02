import React, { useRef, useEffect, useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import mergeRefs from '../../utilities/merge-refs';
import styles from './styles/Dropdown.module.css';

export interface SubMenuContentProps {
  children: React.ReactNode;
  isOpen: boolean;
  parentRef: React.RefObject<HTMLElement>;
  id: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const SubMenuContent = forwardRef<HTMLDivElement, SubMenuContentProps>(
  ({ children, isOpen, parentRef, id, onMouseEnter, onMouseLeave }, forwardedRef) => {
    const [position, setPosition] = useState<'right' | 'below'>('right');
    const contentRef = useRef<HTMLDivElement>(null);

    const updatePosition = React.useCallback(() => {
      if (parentRef.current && contentRef.current) {
        const parentRect = parentRef.current.getBoundingClientRect();
        const contentRect = contentRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (parentRect.right + contentRect.width > viewportWidth) {
          setPosition('below');
        } else if (parentRect.bottom + contentRect.height > viewportHeight) {
          setPosition('right');
        } else {
          setPosition('right');
        }
      }
    }, [parentRef, contentRef, setPosition]);

    useEffect(() => {
      if (isOpen) {
        updatePosition();
        window.addEventListener('resize', updatePosition);
      }
      return () => {
        window.removeEventListener('resize', updatePosition);
      };
    }, [isOpen, updatePosition]);

    const variants = {
      right: {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
      },
      below: {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
      },
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={mergeRefs(contentRef, forwardedRef)}
            id={id}
            className={`${styles.subMenuContent} ${
              styles[`subMenuContent${position.charAt(0).toUpperCase() + position.slice(1)}`]
            }`}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants[position]}
            transition={{ duration: 0.2 }}
            role="menu"
            aria-orientation="vertical"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  },
);

SubMenuContent.displayName = 'SubMenuContent';

export default SubMenuContent;
