import { FormEvent, useRef, useState, useEffect } from 'react';
import { Box, Button, TextArea, Text, IconButton } from 'sds-ui';
import { Paperclip, Send } from 'lucide-react';
import styles from './styles/chat-input.module.css';

interface ChatInputProps {
  readonly input: string;
  readonly handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  readonly handleSubmit: (e: FormEvent<HTMLFormElement>, options?: any) => void;
  readonly isLoading: boolean;
  readonly status: 'submitted' | 'streaming' | 'ready' | 'error';
  readonly setInput?: (value: string) => void; // Optional prop for direct state updates
}

export default function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  status,
  setInput, // Added this prop with the optional flag
}: ChatInputProps) {
  const [fileUploading, setFileUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileId, setUploadedFileId] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  // Create a local state that syncs with the input prop
  const [localInput, setLocalInput] = useState(input);

  // Effect to sync the input prop with local state
  useEffect(() => {
    setLocalInput(input);
  }, [input]);

  // Handle keypress events (for Enter key submission)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if (form) {
        const submitEvent = new Event('submit', {
          cancelable: true,
          bubbles: true,
        }) as unknown as FormEvent<HTMLFormElement>;
        handleSubmit(submitEvent);
      }
    }
  };

  // Local handler for input changes
  const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalInput(e.target.value);
    handleInputChange(e);
  };

  // Trigger file input click
  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // In your ChatInput component
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setFileUploading(true);
    setUploadedFile(file);

    try {
      // Upload the file to the server
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload file');

      const data = await response.json();

      // Create a message about the uploaded file
      const newInputValue = `I've uploaded a PDF file named "${file.name}". Please extract and analyze the information from this document.`;

      // Update the input state
      setLocalInput(newInputValue);
      if (typeof setInput === 'function') {
        setInput(newInputValue);
      }

      // Store the uploaded filename in state or context for later use
      // This could be in a parent component or context
      if (data.filename) {
        // You could use a context or prop function like:
        // onFileUploaded(data.filename);

        // For now, we'll add it to the options to be sent with the message
        setUploadedFileId(data.filename);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setFileUploading(false);
    }
  };

  // And in the onSubmit function:
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Create submit options with file attachment if available
    const options: any = {};

    if (uploadedFile && uploadedFileId) {
      // Add file details to request options
      options.data = {
        fileName: uploadedFile.name,
        fileType: uploadedFile.type,
        fileSize: uploadedFile.size,
        fileId: uploadedFileId, // This is the server-side filename with UUID
      };

      console.log('Submitting message with PDF data:', options);

      // Clear the uploaded file after submission
      setUploadedFile(null);
      setUploadedFileId('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }

    handleSubmit(e, options);
  };

  let buttonLabel = 'Send';
  if (status === 'submitted') {
    buttonLabel = 'Sending...';
  } else if (status === 'streaming') {
    buttonLabel = 'Receiving...';
  }

  return (
    <div className={styles.inputContainer}>
      <form onSubmit={onSubmit} className={styles.inputWrapper}>
        <div className={styles.textAreaContainer}>
          <TextArea
            placeholder="Ask a question or upload a document..."
            value={localInput}
            onChange={onInputChange}
            onKeyDown={handleKeyPress}
            maxCharacters={1000}
            disabled={isLoading || fileUploading}
          />
          <div className={styles.fileButton}>
            <IconButton
              variant="secondary"
              type="button"
              onClick={handleFileButtonClick}
              disabled={isLoading || fileUploading}
            >
              <Paperclip size={16} />
            </IconButton>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
              disabled={isLoading}
            />
          </div>
          {uploadedFile && (
            <div className={styles.uploadedFile}>
              File: {uploadedFile.name} ({Math.round(uploadedFile.size / 1024)} KB)
            </div>
          )}
        </div>
        <Button
          variant="primary"
          type="submit"
          disabled={(isLoading || !localInput.trim()) && !uploadedFile}
          icon={<Send size={16} />}
        >
          {buttonLabel}
        </Button>
      </form>

      <Box mt="16" display="flex" justifyContent="flex-start">
        <Text as="p" color="neutral60" style={{ fontSize: '14px', fontStyle: 'italic' }}>
          Disclaimer: This is a generative AI model. It may not always provide accurate or reliable information.
        </Text>
      </Box>
    </div>
  );
}
