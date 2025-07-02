import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

export const chatModel = openai('gpt-4.1');
export const pdfModel = anthropic('claude-3-7-sonnet-20250219');
