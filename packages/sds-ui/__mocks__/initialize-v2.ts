import { worker } from './setup';

async function initializeMSW() {
  // Only run in browser environment
  if (typeof window === 'undefined') {
    return;
  }

  // Only initialize in development
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

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
    console.log('✅ MSW initialized successfully');
  } catch (error) {
    console.warn('⚠️ MSW initialization failed:', error);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeMSW);
} else {
  initializeMSW();
} 