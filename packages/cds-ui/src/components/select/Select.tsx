import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import MenuItem, { MenuItemProps } from './MenuItem';
import clsx from 'clsx';
import styles from './styles/Select.module.css';
import mergeRefs from '../../utilities/merge-refs';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SelectValue } from '../../global-types/select-value';
import { useId } from '../../utilities/use-id';

export interface SelectProps {
  id?: string;
  className?: string;
  variant?: 'base' | 'pagination';
  placeholder?: string;
  children: React.ReactNode;
  defaultValue?: SelectValue;
  value?: SelectValue;
  onChange: (event: { target: { name?: string; value: SelectValue } }) => void;
  label?: string;
  hideLabel?: boolean;
  inline?: boolean;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  invalidText?: React.ReactNode;
  renderValue?(value: SelectValue): typeof value;
  name?: string;
  ['automation-id']?: string;
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      id,
      className,
      variant = 'base',
      placeholder = 'Select an option',
      children,
      value: controlledValue,
      defaultValue = '',
      onChange,
      label,
      hideLabel = false,
      inline = false,
      disabled = false,
      required = false,
      invalid = false,
      invalidText = 'Please select an option',
      renderValue,
      name,
      ...props
    },
    forwardedRef,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [menuWidth, setMenuWidth] = useState(0);
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState<SelectValue>(defaultValue ?? '');
    const currentValue = isControlled ? controlledValue : internalValue;

    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const selectId = useId('select');
    const labelId = `${selectId}-label`;
    const listboxId = `${selectId}-listbox`;

    const menuItems = React.Children.toArray(children).filter(
      (child): child is React.ReactElement<MenuItemProps> => React.isValidElement(child) && child.type === MenuItem,
    );

    const updateMenuPosition = React.useCallback(() => {
      if (isOpen && triggerRef.current) {
        requestAnimationFrame(() => {
          const rect = triggerRef.current?.getBoundingClientRect();
          if (rect) {
            setPosition({
              top: rect.bottom + window.scrollY,
              left: rect.left + window.scrollX,
            });
            setMenuWidth(rect.width);
          }
        });
      }
    }, [isOpen]);

    useEffect(() => {
      updateMenuPosition();
    }, [isOpen, updateMenuPosition]);

    useEffect(() => {
      window.addEventListener('resize', updateMenuPosition);
      return () => {
        window.removeEventListener('resize', updateMenuPosition);
      };
    }, [updateMenuPosition]);

    useEffect(() => {
      const handleOutsideClick = (event: MouseEvent) => {
        if (
          menuRef.current &&
          !menuRef.current.contains(event.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }, []);

    const handleToggleDropdown = () => {
      if (!disabled) {
        setIsOpen((prev) => !prev);
      }
    };

    const handleOptionClick = (optionValue: SelectValue) => {
      if (!isControlled) {
        setInternalValue(optionValue);
      }
      setIsOpen(false);

      if (onChange) {
        onChange({
          target: {
            name: name ?? '',
            value: optionValue,
          },
        });
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          handleToggleDropdown();
          break;
        case 'ArrowUp':
        case 'ArrowDown':
          event.preventDefault();
          setIsOpen(true);
          break;
        case 'Escape':
          setIsOpen(false);
          break;
        default:
          break;
      }
    };

    const displayedValue = renderValue ? renderValue(currentValue) : currentValue;

    const wrapperClasses = clsx(styles.selectOuterWrapper, {
      [styles.paginationVariant]: variant === 'pagination',
    });

    const triggerClasses = clsx(styles.trigger, className, {
      [styles.invalid]: invalid,
    });

    const labelClasses = clsx(styles.label, {
      [styles.visuallyHidden]: hideLabel,
      [styles.requiredLabel]: required,
      [styles.disabledLabel]: disabled,
    });

    const menuVariants = {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1 },
    };

    return (
      <div className={wrapperClasses}>
        <div className={clsx(styles.selectWrapper)} data-inline={inline ? 'true' : 'false'}>
          {label && (
            <div className={styles.labelWrapper}>
              <label
                id={labelId}
                htmlFor={selectId}
                className={labelClasses}
                data-required={required ? 'true' : 'false'}
              >
                {label}
              </label>
            </div>
          )}
          <button
            ref={mergeRefs(forwardedRef, triggerRef)}
            type="button"
            id={selectId}
            name={name}
            aria-labelledby={label ? labelId : undefined}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={isOpen ? listboxId : undefined}
            className={triggerClasses}
            onClick={handleToggleDropdown}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            automation-id="select-trigger"
            {...props}
          >
            <span className={styles.value}>{displayedValue || placeholder}</span>
            <motion.span
              className={styles.triggerIcon}
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.1 }}
            >
              <Icon icon="mdi:chevron-down" width="20px" />
            </motion.span>
          </button>
          {invalid && (
            <span className={styles.errorMessage} role="alert" id={`${selectId}-error`}>
              {invalidText}
            </span>
          )}
        </div>
        {createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={menuRef}
                role="listbox"
                id={listboxId}
                aria-labelledby={labelId}
                className={clsx(styles.menu)}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={menuVariants}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  top: `${position.top}px`,
                  left: `${position.left}px`,
                  width: `${menuWidth}px`,
                  zIndex: 9999,
                }}
              >
                {menuItems.map((item) => (
                  <MenuItem
                    key={`${item.props.id}-${item.props.value}`}
                    value={item.props.value}
                    onClick={handleOptionClick}
                    isSelected={item.props.value === currentValue}
                    iconSelected={<Icon icon="mdi-check" />}
                  >
                    {item.props.children}
                  </MenuItem>
                ))}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';

export default Select;
