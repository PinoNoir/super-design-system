import { worker } from './setup';

async function initialize() {
  await worker.start({
    onUnhandledRequest: 'bypass',
  });
}

initialize().catch(console.error);
