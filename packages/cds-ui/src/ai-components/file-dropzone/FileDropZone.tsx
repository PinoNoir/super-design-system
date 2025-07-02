import React, { useRef, useState } from 'react';
import styles from './styles/FileDropZone.module.css';
import clsx from 'clsx';

export type FileDropZoneProps = {
  className?: string;
  style?: React.CSSProperties;
  disableDefaultStyles?: boolean;
  onFilesSelected: (files: FileList) => void;
};

const FileDropZone: React.FC<FileDropZoneProps> = ({ className, style, disableDefaultStyles, onFilesSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  };

  const dropZoneStyles = clsx(!disableDefaultStyles && styles.dropZone, className, {
    [styles.dragging]: isDragging && !disableDefaultStyles,
  });

  return (
    <div
      className={dropZoneStyles}
      style={style}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <input type="file" ref={fileInputRef} className={styles.hiddenInput} onChange={handleFileChange} multiple />
      <p>Drag & drop files here.</p>
    </div>
  );
};

export default FileDropZone;
