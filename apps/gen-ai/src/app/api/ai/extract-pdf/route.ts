import { NextRequest } from 'next/server';
import { readFile, readdir } from 'fs/promises';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

// Define the schema for PDF extraction
const pdfSchema = z.object({
  // General document fields
  title: z.string().optional().describe('The title of the document.'),
  summary: z.string().describe('A summary of the document content.'),
  keyPoints: z.array(z.string()).describe('Key points from the document (maximum 5).'),

  // Optional specific fields
  invoiceNumber: z.string().optional().describe('If this is an invoice, the invoice number.'),
  total: z.number().optional().describe('If this is an invoice, the total amount.'),
  currency: z.string().optional().describe('If this is an invoice, the currency of the total amount.'),
  companyName: z.string().optional().describe('If this is an invoice, the name of the company issuing it.'),
  documentDate: z.string().optional().describe('The date mentioned in the document if any.'),

  // Add a raw text field for any other extracted text
  rawText: z.string().optional().describe('Important raw text content extracted from the document.'),
});

// Initialize Anthropic client
const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    console.log('PDF Extraction API called');

    const body = await request.json();
    console.log('Request body:', body);

    const { filename } = body;
    if (!filename) {
      return new Response(JSON.stringify({ error: 'Filename is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const uploadDir = path.join(process.cwd(), 'uploads');
    console.log('Looking for files in:', uploadDir);

    try {
      // List files
      const files = await readdir(uploadDir);
      console.log('Files in directory:', files);

      // Find matching file
      const matchingFile = files.find((file) => file.includes(filename));
      console.log('Matching file:', matchingFile);

      if (!matchingFile) {
        return new Response(
          JSON.stringify({
            error: `File not found with name containing: ${filename}`,
            availableFiles: files,
          }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          },
        );
      }

      // Get file path
      const filePath = path.join(uploadDir, matchingFile);
      console.log('File path:', filePath);

      // Read file
      console.log('Reading file...');
      const fileData = await readFile(filePath);
      console.log('File read successfully, size:', fileData.length, 'bytes');

      // Convert to base64
      const fileBase64 = fileData.toString('base64');
      console.log('Converted to base64');

      try {
        // Using Anthropic's direct API
        console.log('Calling Anthropic API directly...');

        const response = await anthropic.messages.create({
          model: 'claude-3-7-sonnet-20250219',
          max_tokens: 4000,
          system: `You are an expert document analyzer. Extract content from the PDF into a structured format.
                  If it appears to be an invoice, extract values like total amount, currency, invoice number, etc.
                  For other documents, extract title, author, date, and summarize the key content.
                  Format your response as valid JSON matching this schema: ${JSON.stringify(pdfSchema.shape)}`,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'document',
                  source: {
                    type: 'base64',
                    media_type: 'application/pdf',
                    data: fileBase64,
                  },
                },
                {
                  type: 'text',
                  text: 'Extract the information from this PDF and format it as valid JSON according to the schema.',
                },
              ],
            },
          ],
        });

        console.log('Received response from Anthropic');

        // Extract and parse the response as JSON
        try {
          // Try to extract JSON from the response
          const assistantMessage = response.content[0]?.type === 'text' ? response.content[0].text : '';
          const jsonMatch = assistantMessage.match(/```json\s*([\s\S]*?)\s*```/);

          let extractedJson;
          if (jsonMatch?.[1]) {
            // If JSON is in a code block, extract it
            extractedJson = JSON.parse(jsonMatch[1]);
          } else {
            // Otherwise try to parse the whole response as JSON
            extractedJson = JSON.parse(assistantMessage);
          }

          return new Response(JSON.stringify(extractedJson), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (jsonError) {
          console.error('Failed to parse JSON from response:', jsonError);

          // If JSON parsing fails, return the raw response
          return new Response(
            JSON.stringify({
              error: 'Failed to parse JSON response',
              rawResponse: response.content[0]?.type === 'text' ? response.content[0].text : '',
            }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            },
          );
        }
      } catch (modelError) {
        console.error('Anthropic API error:', modelError);
        return new Response(
          JSON.stringify({
            error: 'Anthropic API error',
            details: modelError instanceof Error ? modelError.message : String(modelError),
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          },
        );
      }
    } catch (fileError) {
      console.error('File processing error:', fileError);
      return new Response(
        JSON.stringify({
          error: 'File processing error',
          details: fileError instanceof Error ? fileError.message : String(fileError),
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  } catch (generalError) {
    console.error('General server error:', generalError);
    return new Response(
      JSON.stringify({
        error: 'Server error',
        details: generalError instanceof Error ? generalError.message : String(generalError),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
