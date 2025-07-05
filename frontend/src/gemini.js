// frontend/src/utils/gemini.js

/**
 * Send chat history to Gemini backend and get response
 * @param {Array} chatHistory - Array of { role, parts } objects
 * @returns {Promise<string>} - Gemini model's text response
 */
export async function askGemini(chatHistory) {
  try {
    const response = await fetch('http://localhost:8000/api/ask-gemini-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contents: chatHistory }),
    });

    const data = await response.json();

    if (response.ok && data.response) {
      return data.response;
    } else {
      throw new Error(data.error || 'No response from Gemini API');
    }
  } catch (err) {
    console.error('Error calling Gemini:', err.message);
    return "⚠️ Gemini failed to respond. Please try again.";
  }
}
