import React, { useState, useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import AiChatSection from './components/AichatSection';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const handleGetStarted = () => {
    // Scroll to AI chat section instead of showing auth modal
    const aiSection = document.getElementById('ai-chat-section');
    if (aiSection) {
      aiSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Default home page
  return (
    <div className="bg-[#fffcf9] selection:bg-orange-200 overflow-x-hidden relative">
      {/* --- HERO SECTION --- */}
      <HeroSection onGetStarted={handleGetStarted} isAuthenticated={false} />

      {/* --- AI SECTION COMPONENT --- Always visible */}
      <div id="ai-chat-section">
        <AiChatSection />
      </div>

      {/* --- FOOTER --- */}
      <footer className="py-8 text-center text-gray-400 text-xs border-t border-orange-50 bg-white">
        <p>© 2026 WeddingKiTyaari | Crafted for your special day.</p>
        <p className="mt-1">✨ Explore AI-powered wedding planning without creating an account ✨</p>
      </footer>
    </div>
  );
};

function App() {
  return <AppContent />;
}

export default App;