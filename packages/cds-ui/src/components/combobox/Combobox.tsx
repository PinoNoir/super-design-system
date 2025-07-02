import React, { useState, useEffect, useRef } from 'react';
import { MenuItem } from '../select';
import { TextInput } from '../text-input';
import { Portal } from '../portal';
import styles from './styles/Combobox.module.css';
import { AnimatePresence, motion } from 'framer-motion';
import { useId } from '../../utilities/use-id';

export interface ComboboxProps {
  options: string[];
  onSelect: (value: string) => void;
  onSave: (value: string) => void;
  onAddNew?: () => void;
  placeholder?: string;
  label?: string;
  hideLabel?: boolean;
  allowAddNew?: boolean;
}

const Combobox: React.FC<ComboboxProps> = ({
  options,
  onSelect,
  onSave,
  onAddNew,
  placeholder,
  label,
  hideLabel,
  allowAddNew = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [menuDimensions, setMenuDimensions] = useState({ width: 0, top: 0, left: 0 });
  const uniqueId = useId();
  const inputId = `input-${uniqueId}`;
  const listboxId = `listbox-${uniqueId}`;

  useEffect(() => {
    const updateDimensions = () => {
      if (isOpen && wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        setMenuDimensions({
          width: rect.width,
          top: rect.bottom,
          left: rect.left,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isOpen]);

  useEffect(() => {
    const filtered = options.filter((option) => option.toLowerCase().includes(inputValue.toLowerCase()));
    setFilteredOptions(filtered);
  }, [inputValue, options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
    setFocusedIndex(-1);
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option);
    setIsOpen(false);
    setFocusedIndex(-1);
    onSelect(option);
    inputRef.current?.focus();
  };

  const handleAddNew = () => {
    setIsOpen(false);
    setFocusedIndex(-1);
    if (onAddNew) {
      onAddNew();
    } else if (inputValue) {
      onSave(inputValue);
    }
    inputRef.current?.focus();
  };

  const addNewOptionCount = allowAddNew ? 1 : 0;
  const addNewInputOptionCount = allowAddNew && inputValue && !filteredOptions.includes(inputValue) ? 1 : 0;
  const totalOptionCount = filteredOptions.length + addNewOptionCount + addNewInputOptionCount;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      }
      setFocusedIndex((prevIndex) => (prevIndex < totalOptionCount - 1 ? prevIndex + 1 : -1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prevIndex) => (prevIndex > -1 ? prevIndex - 1 : totalOptionCount - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
        handleOptionClick(filteredOptions[focusedIndex]);
      } else if (focusedIndex >= filteredOptions.length && focusedIndex < totalOptionCount) {
        handleAddNew();
      } else if (inputValue) {
        onSave(inputValue);
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
      setFocusedIndex(-1);
    }, 200);
  };

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-controls={listboxId}
    >
      <TextInput
        id={inputId}
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        label={label}
        hideLabel={hideLabel}
        aria-autocomplete="list"
        aria-activedescendant={focusedIndex >= 0 ? `option-${focusedIndex}` : undefined}
      />
      <AnimatePresence>
        {isOpen && (
          <Portal>
            <motion.ul
              id={listboxId}
              role="listbox"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={menuVariants}
              transition={{ duration: 0.2 }}
              style={{
                width: `${menuDimensions.width}px`,
                top: `${menuDimensions.top}px`,
                left: `${menuDimensions.left}px`,
              }}
              className={styles.menu}
            >
              {filteredOptions.map((option, index) => (
                <MenuItem
                  key={option}
                  value={option}
                  onClick={() => handleOptionClick(option)}
                  id={`option-${index}`}
                  aria-selected={focusedIndex === index}
                >
                  {option}
                </MenuItem>
              ))}
              {allowAddNew && inputValue && !filteredOptions.includes(inputValue) && (
                <MenuItem
                  key="add-new-input"
                  value="add-new"
                  onClick={handleAddNew}
                  id={`option-${filteredOptions.length}`}
                  aria-selected={focusedIndex === filteredOptions.length}
                >
                  Add &ldquo;{inputValue}&rdquo;
                </MenuItem>
              )}
              {allowAddNew && (
                <MenuItem
                  key="add-new-button"
                  value="add-new-button"
                  onClick={handleAddNew}
                  id={`option-${filteredOptions.length + addNewInputOptionCount}`}
                  aria-selected={focusedIndex === filteredOptions.length + addNewInputOptionCount}
                >
                  Add New...
                </MenuItem>
              )}
            </motion.ul>
          </Portal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Combobox;
