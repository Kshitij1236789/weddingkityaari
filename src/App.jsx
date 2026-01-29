import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthModal from './components/AuthModal';
import UserHeader from './components/UserHeader';
import ProfileSettings from './components/ProfileSettings';
import MyWeddingPlans from './components/MyWeddingPlans';
import { HeroSection } from './components/HeroSection'; // Ensure the path matches your folder structure
import AiChatSection from './components/AichatSection'; // Ensure the path matches your folder structure

const AppContent = () => {
  const { isAuthenticated, login, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'profile', 'wedding-plans'

  const handleAuthenticated = (userData) => {
    login(userData);
    setShowAuthModal(false);
  };

  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading WeddingKiTyaari...</p>
        </div>
      </div>
    );
  }

  // Render different pages based on currentPage state
  if (isAuthenticated && currentPage === 'profile') {
    return <ProfileSettings onBack={handleBackToHome} />;
  }

  if (isAuthenticated && currentPage === 'wedding-plans') {
    return <MyWeddingPlans onBack={handleBackToHome} />;
  }

  // Default home page
  return (
    <div className="bg-[#fffcf9] selection:bg-orange-200 overflow-x-hidden relative">
      {/* User Header - Show only when authenticated */}
      {isAuthenticated && <UserHeader onNavigate={handleNavigation} />}
      
      {/* --- NEW ANIMATED HERO SECTION --- */}
      <HeroSection onGetStarted={handleGetStarted} isAuthenticated={isAuthenticated} />

      {/* --- AI SECTION COMPONENT --- Show only when authenticated */}
      {isAuthenticated && <AiChatSection />}

      {/* --- FOOTER --- */}
      <footer className="py-8 text-center text-gray-400 text-xs border-t border-orange-50 bg-white">
        <p>© 2026 WeddingKiTyaari | Crafted for your special day.</p>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onAuthenticated={handleAuthenticated}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;