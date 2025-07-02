export enum FileTypes {
  Image,
  Document,
  Archive,
  Spreadsheet,
  Text,
}

export interface FileType {
  type: FileTypes;
  mimeTypes: string[];
  extensions: string[];
  description?: string;
}

// Utility function to check accepted file extensions
export const isFileTypeAccepted = (file: File, accept: string[] | undefined): boolean => {
  if (!accept || accept.length === 0) return true; // Accept all if none specified
  return accept.some((type) => {
    if (type.startsWith('.')) {
      // Check extension
      return file.name.endsWith(type);
    } else {
      // Check MIME type
      const [major, minor] = type.split('/');
      const [fileMajor, fileMinor] = file.type.split('/');
      return major === fileMajor && (minor === '*' || minor === fileMinor);
    }
  });
};

export const imageFileType: FileType = {
  type: FileTypes.Image,
  mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'],
  extensions: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'],
  description: 'Image files',
};

export const documentFileType: FileType = {
  type: FileTypes.Document,
  mimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  extensions: ['.pdf', '.doc', '.docx'],
  description: 'Document files',
};

export const archiveFileType: FileType = {
  type: FileTypes.Archive,
  mimeTypes: ['application/zip', 'application/x-rar-compressed'],
  extensions: ['.zip', '.rar'],
  description: 'Archive files',
};

export const spreadsheetFileType: FileType = {
  type: FileTypes.Spreadsheet,
  mimeTypes: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  extensions: ['.xls', '.xlsx'],
  description: 'Spreadsheet files',
};

export const textFileType: FileType = {
  type: FileTypes.Text,
  mimeTypes: ['text/plain'],
  extensions: ['.txt'],
  description: 'Text files',
};
