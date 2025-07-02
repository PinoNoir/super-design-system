import { setupWorker } from 'msw/browser';
import { handlers } from './file-upload-handler';

export const worker = setupWorker(...handlers);
