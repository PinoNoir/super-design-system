import { UploadResult, UploadConfig, S3Config, RestConfig, FormDataConfig, UploadAdapter } from './types';

export const createRestUploader = (config: RestConfig): UploadAdapter => {
  return async (file: File, uploadConfig?: UploadConfig): Promise<UploadResult> => {
    try {
      const formData = new FormData();
      formData.append(config.formDataKey || 'file', file);

      const response = await fetch(`${config.baseUrl}/${config.endpoint}`, {
        method: config.method || 'POST',
        headers: {
          ...config.headers,
          ...uploadConfig?.headers,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        progress: 100,
        data,
        file,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
        file,
      };
    }
  };
};

export const createFormDataUploader = (config: FormDataConfig): UploadAdapter => {
  return async (file: File, uploadConfig?: UploadConfig): Promise<UploadResult> => {
    try {
      const formData = new FormData();
      formData.append(config.fileKey || 'file', file);

      if (config.additionalFields) {
        Object.entries(config.additionalFields).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }

      const response = await fetch(config.url, {
        method: 'POST',
        headers: {
          ...config.headers,
          ...uploadConfig?.headers,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        progress: 100,
        data,
        file,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
        file,
      };
    }
  };
};

export const createChunkedUploader = (config: RestConfig & { chunkSize?: number }): UploadAdapter => {
  return async (file: File, uploadConfig?: UploadConfig): Promise<UploadResult> => {
    try {
      const chunkSize = config.chunkSize || uploadConfig?.chunkSize || 1024 * 1024; // 1MB default
      const totalChunks = Math.ceil(file.size / chunkSize);

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('chunkIndex', chunkIndex.toString());
        formData.append('totalChunks', totalChunks.toString());
        formData.append('fileName', file.name);

        const response = await fetch(`${config.baseUrl}/${config.endpoint}`, {
          method: config.method || 'POST',
          headers: {
            ...config.headers,
            ...uploadConfig?.headers,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Chunk upload failed with status: ${response.status}`);
        }

        const progress = Math.round(((chunkIndex + 1) / totalChunks) * 100);

        if (chunkIndex < totalChunks - 1) {
          return {
            success: false, // Not complete yet
            progress,
            file,
          };
        }
      }

      return {
        success: true,
        progress: 100,
        file,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Chunked upload failed',
        file,
      };
    }
  };
};

export const createS3Uploader = (config: S3Config): UploadAdapter => {
  return async (file: File, uploadConfig?: UploadConfig): Promise<UploadResult> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const presignedUrlResponse = await fetch('/api/s3-presigned-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          bucket: config.bucket,
          region: config.region,
        }),
      });

      if (!presignedUrlResponse.ok) {
        throw new Error('Failed to get presigned URL');
      }

      const { presignedUrl } = await presignedUrlResponse.json();

      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
          ...uploadConfig?.headers,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`S3 upload failed with status: ${uploadResponse.status}`);
      }

      return {
        success: true,
        progress: 100,
        data: { url: presignedUrl.split('?')[0] },
        file,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'S3 upload failed',
        file,
      };
    }
  };
};

export const FileUploaderAdapters = {
  createRestUploader,
  createFormDataUploader,
  createChunkedUploader,
  createS3Uploader,
};
