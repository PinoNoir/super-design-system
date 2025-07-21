import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { chatModel as model } from '../models/models';
import { readFile, readdir } from 'fs/promises';
import path from 'path';
import { pdfStorage } from '../../lib/pdf-storage';

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    const { messages, data } = body;

    console.log('API request received:', {
      hasMessages: !!messages,
      messageCount: messages?.length,
      hasData: !!data,
      dataKeys: data ? Object.keys(data) : [],
    });

    if (!messages) {
      return new Response(JSON.stringify({ error: 'Messages are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if this request includes file processing
    if (data?.fileName?.toLowerCase().endsWith('.pdf')) {
      console.log('Processing PDF file:', data.fileName);

      try {
        // Try to get the PDF content for analysis
        const uploadDir = path.join(process.cwd(), 'uploads');
        const files = await readdir(uploadDir);
        const matchingFile = files.find((file) => file.includes(data.fileId || data.fileName));

        if (matchingFile) {
          // Check if we have analysis results for this PDF
          const analysis = pdfStorage.getAnalysis(data.fileName);

          if (analysis) {
            // We have analysis results, provide a more detailed response
            const customResponse = `I can see you've uploaded a PDF file named "${data.fileName}". 

I have analyzed this document and can help you with specific questions about its contents. Here's what I found:

**Document Summary:**
${analysis.analysis.summary || 'Analysis available'}

**Key Points:**
${
  analysis.analysis.keyPoints
    ? analysis.analysis.keyPoints
        .slice(0, 3)
        .map((point: string) => `• ${point}`)
        .join('\n')
    : 'Key points available'
}

You can ask me specific questions about this document, and I'll provide detailed answers based on the analysis. What would you like to know?`;

            const result = await streamText({
              model,
              prompt: customResponse,
            });

            console.log('PDF response with analysis created successfully');
            return result.toDataStreamResponse();
          } else {
            // PDF was found but no analysis yet, provide a response that acknowledges the upload
            const customResponse = `I can see you've uploaded a PDF file named "${data.fileName}". 

The document has been uploaded successfully and is being processed for analysis. You can ask me questions about it, and I'll do my best to help you analyze its contents. 

You can also click the "View Document Analysis" button to see a detailed breakdown once the analysis is complete. What would you like to know about this document?`;

            const result = await streamText({
              model,
              prompt: customResponse,
            });

            console.log('PDF response created successfully');
            return result.toDataStreamResponse();
          }
        } else {
          // PDF not found, provide a fallback response
          const fallbackResponse = `I can see you've uploaded a PDF file named "${data.fileName}". 

The document has been uploaded successfully. You can ask me questions about it, and I'll do my best to help you analyze its contents. What would you like to know about this document?`;

          const result = await streamText({
            model,
            prompt: fallbackResponse,
          });

          console.log('PDF fallback response created');
          return result.toDataStreamResponse();
        }
      } catch (streamError) {
        console.error('Error creating PDF stream:', streamError);
        throw streamError;
      }
    }

    // Standard chat processing for non-file messages
    console.log('Processing standard chat message with', messages.length, 'messages');

    try {
      const result = await streamText({
        model,
        messages,
        maxTokens: 1000, // Limit tokens to prevent issues
      });

      console.log('Chat response created successfully');
      return result.toDataStreamResponse();
    } catch (streamError) {
      console.error('Error creating chat stream:', streamError);
      throw streamError;
    }
  } catch (error) {
    console.error('Error calling AI:', error);

    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorDetails = {
      error: 'Failed to get answer from AI service',
      details: errorMessage,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(errorDetails), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
