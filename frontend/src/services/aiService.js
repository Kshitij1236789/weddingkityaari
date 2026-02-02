// AI Service for WeddingKiTyaari
// Handles all AI API calls with custom system prompts

const createPersonalizedSystemPrompt = (userContext) => {
  const basePrompt = `You are WeddingKiTyaari, an expert AI assistant specializing in wedding planning and Indian wedding traditions.`;
  
  let personalizedPrompt = basePrompt;
  
  if (userContext) {
    personalizedPrompt += `\n\nUser Information:`;
    if (userContext.name) personalizedPrompt += `\n- Name: ${userContext.name}`;
    if (userContext.partnerName) personalizedPrompt += `\n- Partner: ${userContext.partnerName}`;
    if (userContext.weddingDate) {
      const date = new Date(userContext.weddingDate);
      const today = new Date();
      const daysDiff = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
      personalizedPrompt += `\n- Wedding Date: ${date.toLocaleDateString()} (${daysDiff > 0 ? daysDiff + ' days away' : 'past date'})`;
    }
    if (userContext.budget && userContext.budget > 0) personalizedPrompt += `\n- Budget: ₹${userContext.budget.toLocaleString()}`;
    if (userContext.location) personalizedPrompt += `\n- Location: ${userContext.location}`;
    
    personalizedPrompt += `\n\nPersonalization Instructions:`;
    personalizedPrompt += `\n- Always address the user by their name (${userContext.name})`;
    personalizedPrompt += `\n- Reference their partner ${userContext.partnerName ? userContext.partnerName : 'when mentioned'}`;
    if (userContext.weddingDate) {
      const date = new Date(userContext.weddingDate);
      const today = new Date();
      const daysDiff = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
      if (daysDiff > 0) {
        personalizedPrompt += `\n- Keep in mind they have ${daysDiff} days to plan their wedding`;
      }
    }
    if (userContext.budget && userContext.budget > 0) {
      personalizedPrompt += `\n- Tailor suggestions to their budget of ₹${userContext.budget.toLocaleString()}`;
    }
    if (userContext.location) {
      personalizedPrompt += `\n- Consider their location (${userContext.location}) for venue and vendor suggestions`;
    }
  }
  
  personalizedPrompt += `\n\nYour role:
- Provide personalized wedding planning advice
- Help with catering, guest lists, decorations, and logistics
- Respect and incorporate Indian wedding traditions and customs
- Offer creative suggestions for themes, colors, and venues
- Help with invitation wording and event timeline
- Provide budget-friendly and luxury options
- Be warm, friendly, and culturally sensitive
- Keep responses concise but informative
- Ask clarifying questions when needed
- Remember previous conversations and build upon them
- Proactively suggest next steps in their wedding planning journey

Always maintain a friendly, professional tone and remember that weddings are emotional events.`;
  
  return personalizedPrompt;
};

export const sendMessageToAI = async (userMessage, userContext = null) => {
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
            content: createPersonalizedSystemPrompt(userContext),
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        max_completion_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get AI response');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    if (!aiResponse) {
      throw new Error('Empty response from AI service');
    }
    
    return aiResponse;
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
};

export const generatePersonalizedGreeting = (promptType, userContext) => {
  if (!userContext || !userContext.name) {
    // Fallback to generic greetings
    const greetings = {
      wedding_planner: 'Namaste! I am your WeddingKiTyaari assistant. Ready to plan your dream wedding?',
      venue_expert: 'Hello! I\'m your Venue & Logistics Expert. Let\'s find the perfect venue for your special day!',
      catering_specialist: 'Welcome! I\'m your Catering Specialist. Ready to design a delicious menu for your wedding?',
      design_coordinator: 'Hi there! I\'m your Design & Decor Coordinator. Let\'s create a beautiful aesthetic for your celebration!',
      budget_advisor: 'Hello! I\'m your Budget Advisor. Let\'s plan a wedding that fits your budget perfectly!'
    };
    return greetings[promptType] || greetings.wedding_planner;
  }

  const { name, partnerName, weddingDate, budget, location } = userContext;
  let greeting = `Namaste ${name}! `;
  
  if (partnerName) {
    greeting += `So wonderful to see you planning your wedding with ${partnerName}. `;
  }
  
  if (weddingDate) {
    const date = new Date(weddingDate);
    const today = new Date();
    const daysDiff = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 0) {
      if (daysDiff > 365) {
        greeting += `With your big day on ${date.toLocaleDateString()}, we have plenty of time to plan something absolutely magical! `;
      } else if (daysDiff > 180) {
        greeting += `Your wedding date of ${date.toLocaleDateString()} is approaching - let's create something beautiful! `;
      } else if (daysDiff > 30) {
        greeting += `With ${daysDiff} days until your wedding on ${date.toLocaleDateString()}, let's make sure everything is perfectly planned! `;
      } else {
        greeting += `Your wedding is just ${daysDiff} days away on ${date.toLocaleDateString()} - how exciting! Let's finalize the details. `;
      }
    }
  }
  
  // Add mode-specific context
  switch (promptType) {
    case 'venue_expert':
      greeting += `I'm here as your Venue & Logistics Expert. `;
      if (location) {
        greeting += `Since you're looking in ${location}, I can suggest some amazing venues in that area! `;
      }
      greeting += `What type of venue are you envisioning?`;
      break;
    case 'catering_specialist':
      greeting += `I'm your Catering Specialist today. `;
      if (budget && budget > 0) {
        greeting += `With your budget of ₹${budget.toLocaleString()}, I can suggest some delicious options that fit perfectly. `;
      }
      greeting += `What cuisine preferences do you and ${partnerName || 'your partner'} have?`;
      break;
    case 'design_coordinator':
      greeting += `I'm your Design & Decor Coordinator. `;
      greeting += `I'd love to hear about your vision - what colors, themes, or styles have caught your eye?`;
      break;
    case 'budget_advisor':
      greeting += `I'm your Budget Advisor. `;
      if (budget && budget > 0) {
        greeting += `I see you've set a budget of ₹${budget.toLocaleString()}. Let's make sure we create an amazing celebration within that range! `;
      } else {
        greeting += `Let's work together to create a budget that brings your dream wedding to life! `;
      }
      greeting += `What aspects of your wedding are most important to you?`;
      break;
    default: // wedding_planner
      greeting += `I'm here to help you plan every detail of your perfect wedding. `;
      if (!weddingDate) {
        greeting += `Have you set a wedding date yet? `;
      }
      if (!location) {
        greeting += `Where are you planning to celebrate? `;
      }
      greeting += `What can I help you with today?`;
      break;
  }
  
  return greeting;
};
