/**
 * Client-side hook for making AI requests through your server API route
 * This approach keeps your API key secure on the server
 */

// Function to get streaming response
export const streamText = async (prompt: string) => {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error ?? `Failed to get answer: ${response.status}`);
      } catch (e) {
        console.error('Error parsing error response:', e);
        throw new Error(`Failed to get answer: ${response.status}`);
      }
    }

    // Return the raw stream for processing by the component
    return response.body;
  } catch (error) {
    console.error('Error calling AI service:', error);
    throw error;
  }
};

// Keep the original function for backward compatibility
export const answerMyQuestion = async (prompt: string) => {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error ?? `Failed to get answer: ${response.status}`);
      } catch (e) {
        console.error('Error parsing error response:', e);
        throw new Error(`Failed to get answer: ${response.status}`);
      }
    }

    // For non-streaming use cases
    const text = await response.text();
    return text;
  } catch (error) {
    console.error('Error calling AI service:', error);
    throw new Error('Failed to get answer from AI service. Please try again.');
  }
};
