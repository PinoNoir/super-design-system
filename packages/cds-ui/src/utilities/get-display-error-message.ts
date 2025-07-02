import { FieldError, FieldErrors } from 'react-hook-form';

export const getDisplayErrorMessage = (error: React.ReactNode | FieldError | FieldErrors | undefined): string => {
  if (!error) return '';
  if (typeof error === 'string') return error;
  if (typeof error === 'object') {
    if ('message' in error) return typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
    if ('type' in error) return typeof error.type === 'string' ? error.type : JSON.stringify(error.type);
  }
  return typeof error === 'object' ? JSON.stringify(error) : String(error);
};
