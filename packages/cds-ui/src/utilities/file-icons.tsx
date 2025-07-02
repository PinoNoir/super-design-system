import { Icon, IconProps } from '@iconify/react';

export const getFileIcon = (fileName: string, fileType?: string): string => {
  if (fileType) {
    if (fileType.startsWith('text/plain')) return 'mdi:file-document';
    if (fileType.startsWith('image/')) return 'mdi:image';
    if (fileType === 'application/pdf') return 'mdi:file-pdf';
    if (fileType.includes('word')) return 'mdi:file-word';
    if (fileType.includes('excel')) return 'mdi:file-excel';
  }

  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'mdi:image';
    case 'pdf':
      return 'mdi:file-pdf';
    case 'doc':
    case 'docx':
      return 'mdi:file-word';
    case 'xls':
    case 'xlsx':
      return 'mdi:file-excel';
    default:
      return 'mdi:file-document';
  }
};

export const getFileTypeIcon = (fileName: string, fileType?: string, iconProps?: Partial<IconProps>) => {
  const iconName = getFileIcon(fileName, fileType);
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  return <Icon icon={iconName} width="24px" data-name={ext} {...iconProps} />;
};
