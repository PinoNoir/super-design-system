/* eslint-disable no-console */
import { createSpinner } from 'nanospinner';
import colors from 'yoctocolors';
import { cristal } from 'gradient-string';
import { sleep } from './common.js';

export const logger = {
  async start(text) {
    const spinner = createSpinner(colors.blue(text)).start();
    return spinner;
  },

  async success(spinner, text) {
    spinner.success({ text: colors.green(text) });
    await sleep(100);
  },

  async error(spinner, text) {
    spinner.error({ text: colors.red(text) });
    await sleep(100);
  },

  title(text) {
    console.log('\n' + cristal.multiline(text) + '\n');
  },
};
