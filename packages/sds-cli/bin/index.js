#!/usr/bin/env node

import('../dist/index.js').catch((error) => {
  console.error('Error loading CLI:', error);
  process.exit(1);
});
