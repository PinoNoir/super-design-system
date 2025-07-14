import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/upload', async ({ request }) => {
    try {
      // Validate request exists
      if (!request) {
        return new HttpResponse('Invalid request', { status: 400 });
      }

      const data = await request.formData();
      const files = data.get('files');

      if (!files) {
        return new HttpResponse('Missing document', { status: 400 });
      }

      if (!(files instanceof File)) {
        return new HttpResponse('Uploaded document is not a File', { status: 400 });
      }

      // Simulate progress
      const totalBytes = files.size;
      const uploadDuration = 3000; // Total time to "upload" the file in milliseconds
      const chunkSize = totalBytes / 10;
      let uploadedBytes = 0;

      while (uploadedBytes < totalBytes) {
        uploadedBytes += chunkSize;
        await new Promise((resolve) => setTimeout(resolve, uploadDuration / 10));
      }

      return HttpResponse.json(
        {
          path: '/path/to/file',
          contentType: files.type,
          data: 'File data',
          uploaded: true,
          success: true,
          resultMessage: 'File uploaded successfully',
          fileUid: 'file-uid',
          folderId: { Value: 123 },
          documentKey: { Value: 'document-key' },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.warn('MSW handler error:', error);
      return new HttpResponse('Internal Server Error', { status: 500 });
    }
  }),
];
