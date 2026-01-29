// AI Service for WeddingKiTyaari
// Handles all AI API calls with custom system prompts

const SYSTEM_PROMPT = `You are WeddingKiTyaari, an expert AI assistant specializing in wedding planning and Indian wedding traditions. 

Your role:
- Provide personalized wedding planning advice
- Help with catering, guest lists, decorations, and logistics
- Respect and incorporate Indian wedding traditions and customs
- Offer creative suggestions for themes, colors, and venues
- Help with invitation wording and event timeline
- Provide budget-friendly and luxury options
- Be warm, friendly, and culturally sensitive
- Keep responses concise but informative
- Ask clarifying questions when needed

Always maintain a friendly, professional tone and remember that weddings are emotional events.`;

export const sendMessageToAI = async (userMessage) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const model = import.meta.env.VITE_API_MODEL || 'gpt-4';

  if (!apiKey) {
    throw new Error('API key not configured. Please add VITE_OPENAI_API_KEY to .env.local');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_completion_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get AI response');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
};
