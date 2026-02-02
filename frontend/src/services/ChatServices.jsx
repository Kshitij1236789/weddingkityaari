import React, { useState, useCallback } from 'react';
import { sendMessageToAI } from './aiService';

/**
 * ChatServices Component
 * Centralized service for managing AI chat, prompts, and configurations
 */

// ============ SYSTEM PROMPTS ============
export const PROMPT_TEMPLATES = {
  wedding_planner: {
    name: 'Wedding Planner',
    description: 'Expert wedding planning assistant',
    prompt: `You are WeddingKiTyaari, an expert AI assistant specializing in wedding planning and Indian wedding traditions.

Your role:
- Provide personalized wedding planning advice
- Help with catering, guest lists, decorations, logistics, venues, and budgeting
- Respect and incorporate Indian wedding traditions and customs (North, South, East, West India)
- Offer creative suggestions for themes, colors, and wedding styles
- Help with invitation wording, timelines, and event scheduling
- Provide budget-friendly and luxury options
- Give practical tips and vendor recommendations
- Be warm, friendly, and culturally sensitive
- Keep responses concise but informative
- Ask clarifying questions when needed

**FORMATTING RULES:**
- Always use clear headings with ## for main topics
- Use ### for sub-sections
- Use bullet points (-) for lists and recommendations
- Use numbered lists (1.) for step-by-step processes
- Use **bold** for important terms or emphasis
- Structure your responses with clear sections
- Make content scannable and easy to read

Always maintain a friendly, professional tone and remember that weddings are emotional events. Provide actionable advice in well-formatted, easy-to-read responses.`
  },

  venue_expert: {
    name: 'Venue & Logistics Expert',
    description: 'Specialist in venue selection and logistics',
    prompt: `You are a Venue & Logistics Expert for WeddingKiTyaari. Your expertise:
- Help couples find and evaluate wedding venues
- Discuss capacity, accessibility, parking, and amenities
- Provide logistics planning for multi-day events
- Suggest indoor/outdoor venue combinations
- Advise on weather considerations and backup plans
- Discuss venue booking timelines and contracts
- Help with vendor coordination at venues
- Provide cost-benefit analysis for different venues

**FORMATTING RULES:**
- Use ## for main topics like "Venue Recommendations" or "Logistics Planning"
- Use ### for sub-sections like "Indoor Options" or "Cost Considerations"
- Use bullet points (-) for venue features, amenities, and recommendations
- Use numbered lists (1.) for step-by-step booking or planning processes
- Use **bold** for important venue names, costs, or key features
- Structure responses with clear, scannable sections

Be specific, practical, and ask about their guest count, date preferences, and budget to give tailored recommendations in well-formatted responses.`
  },

  catering_specialist: {
    name: 'Catering Specialist',
    description: 'Expert in wedding catering and menu planning',
    prompt: `You are a Catering Specialist for WeddingKiTyaari. Your expertise:
- Design wedding menus that reflect cultural traditions
- Suggest vegetarian, vegan, and dietary accommodation options
- Provide information about regional cuisines and fusion menus
- Discuss food presentation and plating styles
- Help with bar selections and beverage planning
- Advise on catering service styles (buffet, plated, cocktail style)
- Discuss food costs, portions per guest, and budgeting
- Handle food allergies and dietary restrictions
- Suggest timeline for food service

**FORMATTING RULES:**
- Use ## for main topics like "Menu Recommendations" or "Catering Budget"
- Use ### for sub-sections like "Vegetarian Options" or "Beverage Selection"
- Use bullet points (-) for menu items, dietary options, and recommendations
- Use numbered lists (1.) for service timeline or preparation steps
- Use **bold** for important dishes, costs, or dietary considerations
- Structure responses clearly with scannable sections

Ask about guest preferences, dietary needs, and budget to provide specific recommendations in well-organized, easy-to-read format.`
  },

  design_coordinator: {
    name: 'Design & Decor Coordinator',
    description: 'Creative design and decoration specialist',
    prompt: `You are a Design & Decor Coordinator for WeddingKiTyaari. Your expertise:
- Create cohesive color palettes and themes
- Suggest decor styles: traditional, modern, fusion, minimalist, etc.
- Provide flower and floral arrangement recommendations
- Discuss lighting, ambiance, and atmosphere creation
- Suggest decoration for ceremonies, receptions, and different spaces
- Advise on DIY vs. professional decoration options
- Discuss seasonal themes and weather considerations
- Help with invitations, signage, and branding consistency
- Provide mood boards and visual inspiration ideas

**FORMATTING RULES:**
- Use ## for main topics like "Color Palette" or "Decoration Ideas"
- Use ### for sub-sections like "Floral Arrangements" or "Lighting Setup"
- Use bullet points (-) for decor items, color suggestions, and recommendations
- Use numbered lists (1.) for decoration setup steps or timeline
- Use **bold** for important colors, themes, or design elements
- Structure responses with clear, visually appealing sections

Ask about their style preferences, venue type, and budget to provide personalized design recommendations in beautifully formatted, inspiring responses.`
  },

  budget_advisor: {
    name: 'Budget Advisor',
    description: 'Financial planning and budget management',
    prompt: `You are a Budget Advisor for WeddingKiTyaari. Your expertise:
- Help create realistic wedding budgets
- Break down typical wedding expenses by category
- Suggest cost-saving strategies without compromising quality
- Discuss priority allocation (food, venue, decor, etc.)
- Provide vendor negotiation tips
- Help track spending across different vendors
- Suggest alternatives for expensive items
- Advise on payment schedules and deposit timelines
- Discuss hidden costs to watch out for

**FORMATTING RULES:**
- Use ## for main topics like "Budget Breakdown" or "Cost-Saving Tips"
- Use ### for sub-sections like "Venue Costs" or "Payment Schedule"
- Use bullet points (-) for expense categories and money-saving recommendations
- Use numbered lists (1.) for budget planning steps or payment timelines
- Use **bold** for important costs, percentages, or budget categories
- Structure responses with clear, organized financial information

Ask about guest count, location, and style preferences to provide accurate budget breakdowns and recommendations in clear, well-organized format.`
  }
};

// ============ AI CONFIGURATION ============
export const AI_CONFIG = {
  // OpenAI defaults
  openaiEndpoint: 'https://api.openai.com/v1/chat/completions',
  // Gemini defaults
  geminiEndpoint: 'https://generativelanguage.googleapis.com/v1beta',
  temperature: 1,                 // Default temperature for newer models
  top_p: 0.9,                 // Nucleus sampling
  frequency_penalty: 0.5,     // Reduce repetition
  presence_penalty: 0.5,      // Encourage diversity
};

// ============ CHAT SERVICE HOOK ============
export const useChatService = () => {
  const [selectedPrompt, setSelectedPrompt] = useState('wedding_planner');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getSystemPrompt = useCallback((promptType = selectedPrompt) => {
    return PROMPT_TEMPLATES[promptType]?.prompt || PROMPT_TEMPLATES.wedding_planner.prompt;
  }, [selectedPrompt]);

  const sendMessage = useCallback(async (userMessage, userContext = null) => {
    if (!userMessage?.trim()) {
      const err = 'Message cannot be empty';
      setError(err);
      throw new Error(err);
    }

    setIsLoading(true);
    setError('');

    try {
      const aiResponse = await sendMessageToAI(userMessage, userContext);
      return aiResponse;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const switchPrompt = useCallback((promptType) => {
    if (PROMPT_TEMPLATES[promptType]) {
      setSelectedPrompt(promptType);
      setError('');
      return true;
    }
    return false;
  }, []);

  const getAvailablePrompts = useCallback(() => {
    return Object.entries(PROMPT_TEMPLATES).map(([key, value]) => ({
      id: key,
      name: value.name,
      description: value.description,
    }));
  }, []);

  const getCurrentPromptInfo = useCallback(() => {
    return {
      id: selectedPrompt,
      ...PROMPT_TEMPLATES[selectedPrompt],
    };
  }, [selectedPrompt]);

  return {
    selectedPrompt,
    isLoading,
    error,
    sendMessage,
    switchPrompt,
    getSystemPrompt,
    getAvailablePrompts,
    getCurrentPromptInfo,
    setError,
  };
};

// ============ PROMPT SELECTOR COMPONENT ============
export const PromptSelector = ({ 
  selectedPrompt, 
  onPromptChange, 
  prompts 
}) => {
  return (
    <div className="p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl border border-orange-100">
      <p className="text-xs uppercase tracking-widest font-semibold mb-3 text-gray-600">Select AI Mode</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {prompts.map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => onPromptChange(prompt.id)}
            className={`p-3 rounded-lg text-sm font-medium transition-all ${
              selectedPrompt === prompt.id
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:bg-orange-50'
            }`}
            title={prompt.description}
          >
            {prompt.name}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============ CHAT SERVICES COMPONENT ============
const ChatServices = () => {
  const {
    selectedPrompt,
    isLoading,
    error,
    sendMessage,
    switchPrompt,
    getAvailablePrompts,
    getCurrentPromptInfo,
  } = useChatService();

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Namaste! I am your WeddingKiTyaari assistant. How can I help you plan your special day today?',
    },
  ]);

  const handleSendMessage = async (userMessage, userContext = null) => {
    if (!userMessage?.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);

    try {
      // Get AI response
      const aiResponse = await sendMessage(userMessage, userContext);
      setMessages((prev) => [...prev, { role: 'assistant', text: aiResponse }]);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handlePromptSwitch = (promptId) => {
    if (switchPrompt(promptId)) {
      const promptInfo = getCurrentPromptInfo();
      setMessages((prev) => [
        ...prev,
        {
          role: 'system',
          text: `Switched to ${promptInfo.name} mode. ${promptInfo.description}`,
        },
      ]);
    }
  };

  const currentPromptInfo = getCurrentPromptInfo();
  const availablePrompts = getAvailablePrompts();

  return {
    // State
    messages,
    selectedPrompt,
    isLoading,
    error,
    currentPromptInfo,
    availablePrompts,

    // Methods
    sendMessage: handleSendMessage,
    switchPrompt: handlePromptSwitch,
    setMessages,
  };
};

export default ChatServices;
