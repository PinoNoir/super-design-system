import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

// Debug environment variables
console.log('Environment check:', {
  hasOpenAIKey: !!process.env.OPENAI_API_KEY,
  hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
  openaiKeyLength: process.env.OPENAI_API_KEY?.length || 0,
  anthropicKeyLength: process.env.ANTHROPIC_API_KEY?.length || 0,
});

export const chatModel = openai('gpt-4o-mini');
export const pdfModel = anthropic('claude-3-5-sonnet-20241022');
