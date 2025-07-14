import { worker } from './setup';

async function initialize() {
  // Only initialize MSW in development
  if (process.env.NODE_ENV === 'development') {
    try {
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          url: '/mockServiceWorker.js',
          options: {
            scope: '/',
          },
        },
        waitUntilReady: false,
      });
      console.log('MSW initialized successfully');
    } catch (error) {
      console.warn('MSW initialization failed:', error);
    }
  }
}

// Use a more robust initialization approach
if (typeof window !== 'undefined') {
  initialize().catch(console.error);
}
