/* eslint-disable no-console */
export const logger = {
  info: (msg) => console.log(`\n ℹ️  ${msg}`),
  success: (msg) => console.log(`\n ✅ ${msg}`),
  warning: (msg) => console.log(`\n ⚠️  ${msg}`),
  error: (msg) => console.error(`\n ❌ ${msg}`),
  start: (msg) => console.log(`\n ♻️ ${msg}`),
  build: (msg) => console.log(`\n 🔨 ${msg}`),
  test: (msg) => console.log(`\n 🧪 ${msg}`),
  storybook: (msg) => console.log(`\n 📚 ${msg}`),
  clean: (msg) => console.log(`\n 🧹 ${msg}`),
  watch: (msg) => console.log(`\n 👀 ${msg}`),
  compress: (msg) => console.log(`\n 📦 ${msg}`),
  styles: (msg) => console.log(`\n 🎨 ${msg}`),
};
