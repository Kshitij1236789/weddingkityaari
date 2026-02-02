import  { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Bot, User, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import ChatServices, { useChatService, PromptSelector } from '../services/ChatServices';
import { useAuth } from '../context/AuthContext';
import { generatePersonalizedGreeting } from '../services/aiService';

const AiChatSection = () => {
  const { user } = useAuth();
  const {
    selectedPrompt,
    isLoading,
    error,
    sendMessage,
    switchPrompt,
    getAvailablePrompts,
    getCurrentPromptInfo,
    setError,
  } = useChatService();

  // Chat history localStorage functions - Mode specific
  const loadChatHistory = (mode = selectedPrompt) => {
    try {
      const saved = localStorage.getItem('weddingkityaari_chat_histories');
      if (saved) {
        const allHistories = JSON.parse(saved);
        const modeHistory = allHistories[mode];
        if (modeHistory && modeHistory.length > 0) {
          return modeHistory;
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
    // Return default greeting for the specific mode
    return [{ role: 'assistant', text: getModeGreeting(mode) }];
  };

  const saveChatHistory = (messages, mode = selectedPrompt) => {
    try {
      const saved = localStorage.getItem('weddingkityaari_chat_histories');
      const allHistories = saved ? JSON.parse(saved) : {};
      allHistories[mode] = messages;
      localStorage.setItem('weddingkityaari_chat_histories', JSON.stringify(allHistories));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const clearChatHistory = (mode = selectedPrompt) => {
    try {
      const saved = localStorage.getItem('weddingkityaari_chat_histories');
      const allHistories = saved ? JSON.parse(saved) : {};
      delete allHistories[mode];
      localStorage.setItem('weddingkityaari_chat_histories', JSON.stringify(allHistories));
      
      const initialMessages = [{ role: 'assistant', text: getModeGreeting(mode) }];
      setMessages(initialMessages);
      setHasStartedChat(false);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  // Mode-specific greeting messages
  const getModeGreeting = (promptType) => {
    return generatePersonalizedGreeting(promptType, user);
  };

  const [messages, setMessages] = useState(() => loadChatHistory());
  const [input, setInput] = useState('');
  const [hasStartedChat, setHasStartedChat] = useState(() => {
    const savedMessages = loadChatHistory();
    return savedMessages.length > 1 || savedMessages.some(msg => msg.role === 'user');
  });
  const scrollRef = useRef(null);
  const availablePrompts = getAvailablePrompts();

  // Update greeting when user logs in or user data changes
  useEffect(() => {
    const currentHistory = loadChatHistory();
    // Only update greeting if it's the first message and it's an assistant message
    if (currentHistory.length === 1 && currentHistory[0].role === 'assistant') {
      const newGreeting = getModeGreeting(selectedPrompt);
      const updatedHistory = [{ role: 'assistant', text: newGreeting }];
      setMessages(updatedHistory);
      saveChatHistory(updatedHistory, selectedPrompt);
    }
  }, [user, selectedPrompt]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save chat history whenever messages change
  useEffect(() => {
    saveChatHistory(messages, selectedPrompt);
  }, [messages, selectedPrompt]);

  const handlePromptSwitch = (promptType) => {
    if (switchPrompt(promptType)) {
      // Save current mode's chat history before switching
      saveChatHistory(messages, selectedPrompt);
      
      // Load the new mode's chat history
      const newModeHistory = loadChatHistory(promptType);
      setMessages(newModeHistory);
      
      // Update hasStartedChat based on the new mode's history
      const hasUserMessages = newModeHistory.length > 1 || newModeHistory.some(msg => msg.role === 'user');
      setHasStartedChat(hasUserMessages);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput('');
    setError('');
    
    // Mark that user has started chatting
    if (!hasStartedChat) {
      setHasStartedChat(true);
    }
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);

    try {
      // Call AI service with the user message and user context
      console.log('Sending message to AI:', userMessage); // Debug log
      const aiResponse = await sendMessage(userMessage, user);
      console.log('Received AI response:', aiResponse); // Debug log
      setMessages(prev => [...prev, { role: 'assistant', text: aiResponse }]);
    } catch (err) {
      setError('Failed to get response. Please check your API key and try again.');
      console.error('Chat error:', err);
    }
  };

  return (
  <section className="py-20 px-4 flex justify-center bg-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-5xl flex flex-col shadow-[0_20px_60px_rgba(255,115,0,0.1)] rounded-3xl overflow-hidden border border-orange-50"
      >
        {/* Prompt Selector */}
        <div className="w-full">
          <PromptSelector 
            selectedPrompt={selectedPrompt}
            onPromptChange={handlePromptSwitch}
            prompts={availablePrompts}
          />
        </div>

        {/* Main Chat Grid */}
        <div className={`grid ${hasStartedChat ? 'grid-cols-1' : 'lg:grid-cols-5'}`}>
          {/* Decorative Sidebar - Hidden when chat is active */}
          {!hasStartedChat && (
            <div className="lg:col-span-2 bg-gradient-to-br from-orange-500 to-pink-600 p-10 text-white flex flex-col justify-between">
              <div>
                <div className="bg-white/20 w-fit p-3 rounded-2xl backdrop-blur-md mb-6">
                  <Sparkles size={32} />
                </div>
                <h2 className="text-4xl font-serif font-bold mb-4 leading-tight">Expert Advice, Just a Chat Away.</h2>
                <p className="text-orange-50 leading-relaxed">
                  Ask about catering, guest lists, decorations, venues, budgeting, or even help writing your wedding invitations. Our AI understands every tradition.
                </p>
              </div>
              
              <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                <p className="text-xs uppercase tracking-widest font-semibold mb-2 opacity-70">Current Mode:</p>
                <p className="text-sm font-semibold">{getCurrentPromptInfo().name}</p>
                <p className="text-xs opacity-70 mt-1">{getCurrentPromptInfo().description}</p>
              </div>
            </div>
          )}

          {/* Chat Interface */}
          <div className={`${hasStartedChat ? 'col-span-1' : 'lg:col-span-3'} bg-white flex flex-col min-h-[650px]`}>
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30">
              {error && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                >
                  {error}
                </motion.div>
              )}
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'system' ? (
                    <div className="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs text-center">
                      {msg.text}
                    </div>
                  ) : (
                    <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.role === 'user' ? 'bg-orange-100 text-orange-600' : 'bg-orange-500 text-white shadow-md'
                      }`}>
                        {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                      </div>
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-orange-500 text-white rounded-tr-none' 
                          : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                      }`}>
                        {msg.role === 'user' ? (
                          msg.text
                        ) : (
                          <ReactMarkdown
                            components={{
                              h2: ({children}) => <h2 className="text-base font-semibold text-gray-800 mb-2 mt-3 border-b border-orange-100 pb-1">{children}</h2>,
                              h3: ({children}) => <h3 className="text-sm font-semibold text-gray-700 mb-1 mt-2">{children}</h3>,
                              ul: ({children}) => <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>,
                              ol: ({children}) => <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>,
                              li: ({children}) => <li className="text-sm leading-relaxed">{children}</li>,
                              p: ({children}) => <p className="mb-2 text-sm leading-relaxed">{children}</p>,
                              strong: ({children}) => <strong className="font-semibold text-orange-600">{children}</strong>,
                              em: ({children}) => <em className="italic text-gray-700">{children}</em>,
                              code: ({children}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs text-gray-800">{children}</code>
                            }}
                          >
                            {msg.text}
                          </ReactMarkdown>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center bg-orange-500 text-white shadow-md">
                      <Bot size={16} />
                    </div>
                    <div className="p-4 rounded-2xl bg-white text-gray-800 rounded-tl-none border border-gray-100">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse animation-delay-100" />
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse animation-delay-200" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-gray-100">
              {/* Clear History Button */}
              {hasStartedChat && (
                <div className="flex justify-end mb-3">
                  <button
                    onClick={clearChatHistory}
                    className="flex items-center gap-2 text-xs text-gray-500 hover:text-red-500 transition-colors py-1 px-2 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={12} />
                    Clear History
                  </button>
                </div>
              )}
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                  placeholder="Message WeddingKiTyaari AI..."
                  disabled={isLoading}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-6 pr-14 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all disabled:opacity-50"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-3 p-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AiChatSection;