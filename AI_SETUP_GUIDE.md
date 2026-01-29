# WeddingKiTyaari AI Integration Setup Guide

## Overview
Your chat interface is now fully integrated with OpenAI's API. The system uses custom prompts to ensure the AI responds as a wedding planning expert.

## Setup Steps

### 1. Get Your OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in to your account
3. Go to **API keys** section
4. Click **Create new secret key**
5. Copy the key (you'll only see it once!)

### 2. Add API Key to Your Project
Edit `.env.local` in your project root:
```
VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
VITE_API_MODEL=gpt-4
```

**⚠️ Important:** Never commit `.env.local` to version control! It's already in `.gitignore`.

### 3. How the AI Works

#### System Prompt
The AI uses a custom system prompt that defines its behavior:
- Specializes in wedding planning and Indian traditions
- Provides advice on catering, guest lists, decorations, logistics
- Maintains a warm, professional, culturally-sensitive tone
- Keeps responses concise (max 500 tokens)

#### Customizing the AI Response
Edit `src/services/aiService.js` to modify the `SYSTEM_PROMPT`:

```javascript
const SYSTEM_PROMPT = `You are WeddingKiTyaari...
// Customize this text to change how AI behaves
`;
```

**Examples of customizations:**
- Add more specific expertise: "You also specialize in budget management..."
- Change tone: "Be more casual and fun" or "Be more formal and professional"
- Add constraints: "Always include 3 specific recommendations"
- Add context: "The user is planning a traditional North Indian wedding..."

### 4. API Configuration Details

**File:** `src/services/aiService.js`

Key parameters you can adjust:
```javascript
{
  temperature: 0.7,      // 0-1: Lower = more consistent, Higher = more creative
  max_tokens: 500,       // Max response length (1 token ≈ 4 characters)
  model: 'gpt-4'        // Change to 'gpt-3.5-turbo' for faster/cheaper responses
}
```

### 5. Testing the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try asking the AI:
   - "What are the best color themes for a summer beach wedding?"
   - "How do I plan a budget for 200 guests?"
   - "Tell me about traditional wedding invitation wording"

### 6. Handling Errors

If you see an error message:
- **"API key not configured"**: Check your `.env.local` file
- **"Failed to get response"**: Verify your API key is valid and has credits
- **CORS errors**: Make sure you're using the correct API endpoint

### 7. Component Features

Your updated chat component now includes:
- ✅ Real-time AI responses
- ✅ Loading indicator (animated dots)
- ✅ Error handling and user feedback
- ✅ Message persistence in chat history
- ✅ Enter key to send messages
- ✅ Disabled input while loading

## Advanced: Different AI Models

### GPT-4 (Recommended for quality)
- **Pros:** Better understanding, more detailed responses
- **Cons:** Slower, more expensive
- **Cost:** ~$0.03 per message

### GPT-3.5-Turbo (Budget-friendly)
- **Pros:** Fast, cheap, good enough for most use cases
- **Cons:** Less nuanced responses
- **Cost:** ~$0.001 per message

Change in `.env.local`:
```
VITE_API_MODEL=gpt-3.5-turbo
```

## Budget Monitoring

Monitor your OpenAI usage:
1. Go to [OpenAI Dashboard](https://platform.openai.com/account/billing/overview)
2. Set usage limits and alerts
3. Track your spending in real-time

## Security Tips

1. ✅ Keep API key in `.env.local` (never in code)
2. ✅ Rotate your key if exposed
3. ✅ Set spending limits on OpenAI
4. ✅ Don't share `.env.local` with anyone
5. ✅ For production: Use environment variables on your server

## File Structure

```
src/
├── components/
│   └── AichatSection.jsx     (Updated with AI integration)
├── services/
│   └── aiService.js           (New: Handles AI API calls)
└── App.jsx

.env.local                      (New: API key configuration)
```

---

**Ready to chat!** Your AI wedding assistant is now live. 🎉
