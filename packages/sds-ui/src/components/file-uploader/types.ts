export interface UploadConfig {
  method?: 'POST' | 'PUT' | 'PATCH';
  url?: string;
  headers?: Record<string, string>;
  formDataKey?: string;
  chunkSize?: number;
  concurrent?: boolean;
  timeout?: number;
}

export interface UploadResult {
  success: boolean;
  progress?: number;
  error?: string;
  data?: any;
  file?: File;
}

export interface S3Config {
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
}

export interface RestConfig {
  baseUrl: string;
  endpoint: string;
  headers?: Record<string, string>;
  method?: 'POST' | 'PUT' | 'PATCH';
  formDataKey?: string;
}

export interface FormDataConfig {
  url: string;
  fileKey?: string;
  additionalFields?: Record<string, string>;
  headers?: Record<string, string>;
}

export type UploadAdapter = (file: File, config?: UploadConfig) => Promise<UploadResult>;
