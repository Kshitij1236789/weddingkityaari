import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function HeroSection({ onGetStarted, isAuthenticated }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) - 0.5, // Normalize to -0.5 to 0.5
        y: (e.clientY / window.innerHeight) - 0.5 
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="h-screen w-full relative flex flex-col items-center justify-center overflow-hidden bg-[#FFFCF9]">
      {/* Paper Texture Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Floating Elements with relative positioning */}
      <FloatingMandala delay={0} duration={20} top="10%" left="10%" mousePosition={mousePosition} />
      <FloatingMandala delay={2} duration={25} top="20%" right="15%" mousePosition={mousePosition} />
      <FloatingMandala delay={4} duration={22} bottom="15%" left="20%" mousePosition={mousePosition} />
      <FloatingDiya delay={0.5} duration={18} top="15%" left="5%" mousePosition={mousePosition} />
      <FloatingDiya delay={3.5} duration={22} bottom="20%" right="8%" mousePosition={mousePosition} />
      <FloatingFlower delay={1.5} duration={24} top="5%" right="20%" mousePosition={mousePosition} />
      <FloatingFlower delay={4.5} duration={20} bottom="10%" left="15%" mousePosition={mousePosition} />
      <FloatingBell delay={2} duration={19} top="25%" left="25%" mousePosition={mousePosition} />
      <FloatingRings delay={1} duration={21} top="40%" left="12%" mousePosition={mousePosition} />
      <FloatingPeacock delay={0} duration={28} top="8%" left="18%" mousePosition={mousePosition} />
      <FloatingKalash delay={2.5} duration={20} top="35%" right="5%" mousePosition={mousePosition} />
      <FloatingGarland delay={1.2} duration={22} top="12%" right="8%" mousePosition={mousePosition} />
      <FloatingMehendiHand delay={0.8} duration={20} top="45%" left="3%" mousePosition={mousePosition} />
      <FloatingDhol delay={2.2} duration={21} top="30%" left="18%" mousePosition={mousePosition} />
      <FloatingBangles delay={1.8} duration={19} top="18%" left="28%" mousePosition={mousePosition} />
      <FloatingWeddingCard delay={0.3} duration={27} top="65%" right="18%" mousePosition={mousePosition} />
      <FloatingSweets delay={2.8} duration={20} top="22%" right="25%" mousePosition={mousePosition} />
      <FloatingCamera delay={1.5} duration={26} top="48%" right="20%" mousePosition={mousePosition} />
      <FloatingHorse delay={0.2} duration={29} top="75%" left="12%" mousePosition={mousePosition} />
      
      {/* Enhanced Top Area Floating Elements for Better Mouse Tracking Visibility */}
      <FloatingHearts delay={0.2} duration={17} top="2%" left="15%" mousePosition={mousePosition} />
      <FloatingHearts delay={1.8} duration={19} top="6%" right="12%" mousePosition={mousePosition} />
      <FloatingHearts delay={3.2} duration={21} top="4%" left="45%" mousePosition={mousePosition} />
      <FloatingHearts delay={4.8} duration={16} top="8%" right="35%" mousePosition={mousePosition} />
      <FloatingLoveQuote delay={0.6} duration={24} top="3%" left="25%" text="✨ Dream Wedding" mousePosition={mousePosition} />
      <FloatingLoveQuote delay={2.4} duration={26} top="7%" right="25%" text="🌸 Perfect Day" mousePosition={mousePosition} />
      <FloatingMandala delay={1.3} duration={23} top="1%" left="35%" mousePosition={mousePosition} />
      <FloatingMandala delay={3.7} duration={25} top="9%" right="45%" mousePosition={mousePosition} />
      <FloatingDiya delay={0.9} duration={18} top="4%" left="55%" mousePosition={mousePosition} />
      <FloatingDiya delay={2.9} duration={20} top="6%" right="55%" mousePosition={mousePosition} />
      <FloatingFlower delay={1.6} duration={22} top="2%" left="65%" mousePosition={mousePosition} />
      <FloatingFlower delay={3.4} duration={24} top="8%" right="2%" mousePosition={mousePosition} />
      <FloatingRings delay={0.4} duration={19} top="5%" left="75%" mousePosition={mousePosition} />
      <FloatingRings delay={2.1} duration={21} top="3%" right="65%" mousePosition={mousePosition} />
      <FloatingGarland delay={1.1} duration={27} top="7%" left="85%" mousePosition={mousePosition} />
      <FloatingBell delay={3.6} duration={18} top="1%" right="75%" mousePosition={mousePosition} />
      
      {/* New Emotionally Engaging Wedding Elements */}
      <FloatingHearts delay={1} duration={15} top="25%" right="12%" mousePosition={mousePosition} />
      <FloatingHearts delay={3} duration={18} bottom="30%" left="8%" mousePosition={mousePosition} />
      <FloatingHearts delay={5} duration={16} top="60%" left="25%" mousePosition={mousePosition} />
      <FloatingLoveQuote delay={0.8} duration={25} top="35%" left="5%" text="💕 Forever Begins Today" mousePosition={mousePosition} />
      <FloatingLoveQuote delay={4.2} duration={23} bottom="25%" right="10%" text="💍 Two Hearts, One Love" mousePosition={mousePosition} />
      <FloatingCoupleHands delay={2.5} duration={20} top="50%" right="8%" mousePosition={mousePosition} />
      <FloatingWeddingVows delay={1.8} duration={22} top="70%" left="15%" mousePosition={mousePosition} />
      <FloatingLotusFloat delay={3.5} duration={24} top="40%" right="25%" mousePosition={mousePosition} />
      <FloatingMangalSutra delay={0.5} duration={26} bottom="40%" left="18%" mousePosition={mousePosition} />
      <FloatingRoseRain delay={2} duration={18} top="12%" left="35%" mousePosition={mousePosition} />
      <FloatingSaptapadi delay={4.5} duration={27} bottom="50%" right="15%" mousePosition={mousePosition} />

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 text-center px-6"
      >
        <h1 
          className="text-7xl md:text-8xl lg:text-9xl mb-6 font-bold"
          style={{ 
            fontFamily: "'Playfair Display', serif",
            color: "#F2613F",
            letterSpacing: "-0.02em"
          }}
        >
          WeddingKiTyaari
        </h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto font-medium mb-8"
        >
          Your dream wedding, orchestrated by Artificial Intelligence.
        </motion.p>

        {/* Authentication CTA */}
        {/* Always show the get started button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="space-y-4"
        >
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-orange-600 hover:to-pink-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            Explore AI Wedding Planner ✨
          </button>
          <p className="text-sm text-gray-600">
            No account needed - Start planning your perfect day instantly
          </p>
        </motion.div>
      </motion.div>
      
      {/* Always show scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        onClick={() => {
          window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
        }}
      >
          <span className="text-sm tracking-wider uppercase font-semibold text-[#F2613F]">
            Scroll to Start Planning
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6 text-[#F2613F]" />
          </motion.div>
        </motion.div>

    </div>
  );
}

// --- HELPER COMPONENTS (No Types) ---

function FloatingElement({ delay, duration, top, bottom, left, right, children, mousePosition = { x: 0, y: 0 } }) {
  const mouseInfluence = 20; // How much the mouse affects the position
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 150, damping: 20 });
  const springY = useSpring(y, { stiffness: 150, damping: 20 });
  
  useEffect(() => {
    x.set(mousePosition.x * mouseInfluence);
    y.set(mousePosition.y * mouseInfluence);
  }, [mousePosition, x, y, mouseInfluence]);
  
  return (
    <motion.div
      className="absolute pointer-events-none"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 0.7, 0],
        scale: [0, 1, 0],
        rotate: [0, 180, 360],
        translateY: [0, -20, 0]
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      style={{
        top, 
        bottom, 
        left, 
        right,
        x: springX,
        y: springY,
      }}
    >
      {children}
    </motion.div>
  );
}

function FloatingMandala(props) {
  return (
    <FloatingElement {...props}>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="35" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />
        <circle cx="40" cy="40" r="25" stroke="#F2613F" strokeWidth="1" opacity="0.6" />
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          return (
            <line 
              key={i}
              x1={40 + Math.cos(angle) * 15} 
              y1={40 + Math.sin(angle) * 15} 
              x2={40 + Math.cos(angle) * 35} 
              y2={40 + Math.sin(angle) * 35} 
              stroke="#F2613F" strokeWidth="1" opacity="0.4" 
            />
          );
        })}
        <circle cx="40" cy="40" r="5" fill="#F2613F" opacity="0.6" />
      </svg>
    </FloatingElement>
  );
}

function FloatingDiya(props) {
  return (
    <FloatingElement {...props}>
      <svg width="60" height="60" viewBox="0 0 60 60">
        <ellipse cx="30" cy="35" rx="18" ry="8" fill="#D4AF37" opacity="0.6" />
        <ellipse cx="30" cy="25" rx="6" ry="10" fill="#FF9500" opacity="0.7" />
      </svg>
    </FloatingElement>
  );
}

function FloatingFlower(props) {
  return (
    <FloatingElement {...props}>
      <svg width="70" height="70" viewBox="0 0 70 70">
        {[...Array(6)].map((_, i) => (
          <circle key={i} cx={35 + Math.cos(i * 60 * Math.PI / 180) * 12} cy={35 + Math.sin(i * 60 * Math.PI / 180) * 12} r="10" fill="#F2613F" opacity="0.6" />
        ))}
        <circle cx="35" cy="35" r="8" fill="#FFD700" opacity="0.7" />
      </svg>
    </FloatingElement>
  );
}

function FloatingBell(props) {
  return (
    <FloatingElement {...props}>
      <svg width="50" height="50" viewBox="0 0 50 50">
        <path d="M 25 10 L 20 15 L 20 28 Q 20 35 25 38 Q 30 35 30 28 L 30 15 Z" fill="#D4AF37" opacity="0.6" stroke="#F2613F" />
      </svg>
    </FloatingElement>
  );
}

function FloatingRings(props) {
  return (
    <FloatingElement {...props}>
      <svg width="70" height="70" viewBox="0 0 70 70">
        <circle cx="27" cy="35" r="12" stroke="#D4AF37" strokeWidth="3" fill="none" opacity="0.7" />
        <circle cx="43" cy="35" r="12" stroke="#F2613F" strokeWidth="3" fill="none" opacity="0.7" />
      </svg>
    </FloatingElement>
  );
}

function FloatingPeacock(props) {
  return (
    <FloatingElement {...props}>
      <svg width="90" height="90" viewBox="0 0 90 90">
        <ellipse cx="45" cy="18" rx="15" ry="18" fill="#F2613F" opacity="0.4" />
        <circle cx="45" cy="18" r="5" fill="#D4AF37" opacity="0.7" />
      </svg>
    </FloatingElement>
  );
}

function FloatingKalash(props) {
  return (
    <FloatingElement {...props}>
      <svg width="60" height="60" viewBox="0 0 60 60">
        <path d="M 20 15 Q 18 25 20 35 L 40 35 Q 42 25 40 15 Z" fill="#F2613F" opacity="0.5" />
        <circle cx="30" cy="12" r="5" fill="#8B4513" opacity="0.6" />
      </svg>
    </FloatingElement>
  );
}

function FloatingGarland(props) {
  return (
    <FloatingElement {...props}>
      <svg width="80" height="90" viewBox="0 0 80 90">
        <path d="M 10 20 Q 20 10 30 20 T 50 20 T 70 20" stroke="#F2613F" strokeWidth="3" fill="none" opacity="0.6"/>
      </svg>
    </FloatingElement>
  );
}

function FloatingMehendiHand(props) {
  return (
    <FloatingElement {...props}>
      <svg width="70" height="90" viewBox="0 0 70 90">
        <ellipse cx="35" cy="50" rx="18" ry="25" fill="#D4AF37" opacity="0.3" />
        <circle cx="35" cy="45" r="8" fill="none" stroke="#8B4513" strokeWidth="1.5" />
      </svg>
    </FloatingElement>
  );
}

function FloatingDhol(props) {
  return (
    <FloatingElement {...props}>
      <svg width="90" height="70" viewBox="0 0 90 70">
        <rect x="25" y="17" width="40" height="36" fill="#D4AF37" opacity="0.5" />
        <ellipse cx="25" cy="35" rx="12" ry="18" fill="#F2613F" opacity="0.6" />
        <ellipse cx="65" cy="35" rx="12" ry="18" fill="#F2613F" opacity="0.6" />
      </svg>
    </FloatingElement>
  );
}

function FloatingBangles(props) {
  return (
    <FloatingElement {...props}>
      <svg width="70" height="70" viewBox="0 0 70 70">
        <circle cx="35" cy="35" r="20" stroke="#F2613F" strokeWidth="4" fill="none" opacity="0.7" />
        <circle cx="35" cy="35" r="24" stroke="#D4AF37" strokeWidth="3" fill="none" opacity="0.6" />
      </svg>
    </FloatingElement>
  );
}

function FloatingWeddingCard(props) {
  return (
    <FloatingElement {...props}>
      <svg width="70" height="90" viewBox="0 0 70 90">
        <rect x="10" y="15" width="50" height="60" rx="3" fill="#FFFCF9" stroke="#D4AF37" strokeWidth="2" opacity="0.7" />
      </svg>
    </FloatingElement>
  );
}

function FloatingSweets(props) {
  return (
    <FloatingElement {...props}>
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="30" cy="35" r="15" fill="#FF9500" opacity="0.6" />
        <circle cx="52" cy="40" r="13" fill="#F2613F" opacity="0.5" />
      </svg>
    </FloatingElement>
  );
}

function FloatingCamera(props) {
  return (
    <FloatingElement {...props}>
      <svg width="80" height="70" viewBox="0 0 80 70">
        <rect x="15" y="25" width="50" height="35" rx="3" fill="#2C3E50" opacity="0.6" />
        <circle cx="40" cy="42" r="15" fill="#34495E" opacity="0.7" />
      </svg>
    </FloatingElement>
  );
}

function FloatingHorse(props) {
  return (
    <FloatingElement {...props}>
      <svg width="100" height="90" viewBox="0 0 100 90">
        <path d="M 30 40 Q 25 35 25 28 Q 25 20 30 18" fill="#8B4513" opacity="0.6" />
        <path d="M 35 40 Q 40 45 38 55 L 32 55" fill="#8B4513" opacity="0.6" />
      </svg>
    </FloatingElement>
  );
}

// New Emotionally Engaging Wedding Elements
function FloatingHearts(props) {
  return (
    <FloatingElement {...props}>
      <svg width="80" height="80" viewBox="0 0 80 80">
        <path d="M40,60 C35,50 20,40 20,25 C20,15 30,10 40,20 C50,10 60,15 60,25 C60,40 45,50 40,60 Z" fill="#FF69B4" opacity="0.7" />
        <path d="M50,70 C47,65 38,60 38,52 C38,47 42,45 47,50 C52,45 56,47 56,52 C56,60 51,65 50,70 Z" fill="#FF1493" opacity="0.6" />
        <path d="M30,50 C28,47 23,44 23,40 C23,37 25,36 28,38 C31,36 33,37 33,40 C33,44 30,47 30,50 Z" fill="#FFB6C1" opacity="0.8" />
      </svg>
    </FloatingElement>
  );
}

function FloatingLoveQuote({ delay, duration, top, bottom, left, right, text }) {
  return (
    <motion.div
      className="absolute pointer-events-none text-center"
      style={{ top, bottom, left, right, maxWidth: '150px' }}
      initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
      animate={{ 
        opacity: [0, 0.8, 0],
        scale: [0.5, 1, 0.5],
        rotate: [-10, 5, -10],
        y: [-20, 20, -20]
      }}
      transition={{ 
        duration, 
        delay, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    >
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 border border-pink-200">
        <span className="text-xs font-medium text-pink-600">{text}</span>
      </div>
    </motion.div>
  );
}

function FloatingCoupleHands(props) {
  return (
    <FloatingElement {...props}>
      <svg width="100" height="60" viewBox="0 0 100 60">
        <path d="M20,30 Q25,20 35,25 Q45,30 50,30" fill="#F4A460" opacity="0.6" stroke="#8B4513" strokeWidth="1" />
        <path d="M50,30 Q55,20 65,25 Q75,30 80,30" fill="#F4A460" opacity="0.6" stroke="#8B4513" strokeWidth="1" />
        <circle cx="48" cy="30" r="4" fill="#FFD700" opacity="0.8" />
        <circle cx="52" cy="30" r="4" fill="#FFD700" opacity="0.8" />
      </svg>
    </FloatingElement>
  );
}

function FloatingWeddingVows(props) {
  return (
    <FloatingElement {...props}>
      <svg width="90" height="100" viewBox="0 0 90 100">
        <rect x="15" y="20" width="60" height="70" fill="#FFF8DC" opacity="0.7" stroke="#D4AF37" strokeWidth="1" />
        <line x1="25" y1="35" x2="65" y2="35" stroke="#8B4513" strokeWidth="1" opacity="0.5" />
        <line x1="25" y1="45" x2="65" y2="45" stroke="#8B4513" strokeWidth="1" opacity="0.5" />
        <line x1="25" y1="55" x2="55" y2="55" stroke="#8B4513" strokeWidth="1" opacity="0.5" />
        <path d="M35,65 Q45,70 55,65" fill="none" stroke="#FF69B4" strokeWidth="2" opacity="0.6" />
      </svg>
    </FloatingElement>
  );
}

function FloatingLotusFloat(props) {
  return (
    <FloatingElement {...props}>
      <svg width="80" height="80" viewBox="0 0 80 80">
        {[...Array(8)].map((_, i) => (
          <ellipse key={i} 
            cx={40 + Math.cos(i * 45 * Math.PI / 180) * 15} 
            cy={40 + Math.sin(i * 45 * Math.PI / 180) * 8} 
            rx="8" ry="15" 
            fill="#FFB6C1" 
            opacity="0.6"
            transform={`rotate(${i * 45} 40 40)`}
          />
        ))}
        <circle cx="40" cy="40" r="8" fill="#FFD700" opacity="0.7" />
      </svg>
    </FloatingElement>
  );
}

function FloatingMangalSutra(props) {
  return (
    <FloatingElement {...props}>
      <svg width="90" height="100" viewBox="0 0 90 100">
        <path d="M30,20 Q45,10 60,20" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.7" />
        <circle cx="35" cy="25" r="3" fill="#2C3E50" opacity="0.8" />
        <circle cx="45" cy="28" r="4" fill="#2C3E50" opacity="0.8" />
        <circle cx="55" cy="25" r="3" fill="#2C3E50" opacity="0.8" />
        <path d="M40,35 Q45,40 50,35 Q45,45 40,35" fill="#FFD700" opacity="0.6" />
      </svg>
    </FloatingElement>
  );
}

function FloatingRoseRain(props) {
  return (
    <FloatingElement {...props}>
      <svg width="70" height="100" viewBox="0 0 70 100">
        {[...Array(5)].map((_, i) => (
          <g key={i} transform={`translate(${i * 12 + 10}, ${i * 15 + 10})`}>
            <circle cx="0" cy="0" r="4" fill="#FF69B4" opacity="0.7" />
            <circle cx="3" cy="-2" r="3" fill="#FFB6C1" opacity="0.6" />
            <circle cx="-3" cy="-2" r="3" fill="#FFB6C1" opacity="0.6" />
          </g>
        ))}
      </svg>
    </FloatingElement>
  );
}

function FloatingSaptapadi(props) {
  return (
    <FloatingElement {...props}>
      <svg width="100" height="80" viewBox="0 0 100 80">
        <circle cx="50" cy="40" r="25" fill="none" stroke="#FF6347" strokeWidth="2" opacity="0.6" />
        {[...Array(7)].map((_, i) => (
          <circle key={i} 
            cx={50 + Math.cos(i * 51.4 * Math.PI / 180) * 20} 
            cy={40 + Math.sin(i * 51.4 * Math.PI / 180) * 20} 
            r="3" 
            fill="#FFD700" 
            opacity="0.8"
          />
        ))}
        <path d="M40,30 Q50,25 60,30 Q50,35 40,30" fill="#FF69B4" opacity="0.5" />
      </svg>
    </FloatingElement>
  );
}