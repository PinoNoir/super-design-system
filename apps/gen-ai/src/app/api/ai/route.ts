import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { chatModel as model } from '../models/models';

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    const { messages, data } = body;

    if (!messages) {
      return new Response(JSON.stringify({ error: 'Messages are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if this request includes file processing
    if (data?.fileName?.toLowerCase().endsWith('.pdf')) {
      // For PDF uploads, return a specific response that acknowledges your app's PDF functionality
      const customResponse = `I see you've uploaded a PDF file named "${data.fileName}". 
        You can view a detailed analysis of this document by clicking the "View Document Analysis" button 
        above or using the document viewer in the sidebar. 
        
        Is there anything specific about this document you'd like me to help with after you've reviewed the analysis?`;

      const result = await streamText({
        model,
        prompt: customResponse,
      });

      return result.toDataStreamResponse();
    }

    // Standard chat processing for non-file messages
    const result = await streamText({
      model,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error calling AI:', error);
    return new Response(JSON.stringify({ error: 'Failed to get answer from AI service' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
