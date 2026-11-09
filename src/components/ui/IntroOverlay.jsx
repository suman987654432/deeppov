import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Volume2, ArrowRight } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export default function IntroOverlay({ onEnterExperience, isVisible = true }) {
  const [stage, setStage] = useState(0);

  // Progressive reveal sequence
  useEffect(() => {
    if (!isVisible) return;
    const timers = [
      setTimeout(() => setStage(1), 600),   // Golden particles emerge
      setTimeout(() => setStage(2), 1600),  // "A Festival of Lights"
      setTimeout(() => setStage(3), 2800),  // "HAPPY DIWALI ✨"
      setTimeout(() => setStage(4), 4200),  // Glowing Diya & Subtitle
    ];
    return () => timers.forEach(clearTimeout);
  }, [isVisible]);

  const handleEnter = () => {
    soundManager.init();
    soundManager.setMuted(false);
    soundManager.playDiyaLightingSound();
    onEnterExperience();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030206] px-4 text-center overflow-hidden select-none"
        >
          {/* 1. Celestial Golden Background Aura & Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,140,0,0.14)_0%,rgba(10,6,20,0.8)_55%,rgba(3,2,6,1)_100%)] pointer-events-none" />

          {/* 2. Floating Golden Particles (Stage 1+) */}
          {stage >= 1 && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(40)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    x: `${Math.random() * 100}vw`,
                    y: `${Math.random() * 100}vh`,
                    scale: 0,
                  }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    y: [`${Math.random() * 100}vh`, `${Math.random() * 80 - 10}vh`],
                    scale: [0.5, 1.2, 0.3],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 5,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: 'easeInOut',
                  }}
                  className="absolute w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_#ffd700]"
                />
              ))}
            </div>
          )}

          {/* Center Card Content */}
          <div className="relative z-10 max-w-2xl w-full flex flex-col items-center">
            {/* Stage 2: "A Festival of Lights" */}
            <AnimatePresence>
              {stage >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 15, letterSpacing: '0.2em' }}
                  animate={{ opacity: 1, y: 0, letterSpacing: '0.45em' }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  className="flex items-center gap-2 text-xs md:text-sm uppercase font-semibold text-amber-300/80 mb-3 tracking-[0.45em]"
                >
                  <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-amber-400" />
                  A Festival of Lights
                  <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-amber-400" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stage 3: "HAPPY DIWALI ✨" */}
            <AnimatePresence>
              {stage >= 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                >
                  <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-black tracking-wider gold-text-gradient py-2">
                    HAPPY DIWALI <span className="inline-block animate-pulse text-amber-300">✨</span>
                  </h1>
                  <div className="h-0.5 w-48 sm:w-72 mx-auto bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-2 shadow-[0_0_15px_#f59e0b]" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stage 4: Center Glowing Diya Icon & Subtitle */}
            <AnimatePresence>
              {stage >= 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 0.2 }}
                  className="flex flex-col items-center mt-6 sm:mt-8"
                >
                  {/* Glowing Iconic Diya */}
                  <motion.div
                    animate={{
                      scale: [1, 1.04, 0.98, 1],
                      filter: [
                        'drop-shadow(0 0 20px rgba(255,160,20,0.6))',
                        'drop-shadow(0 0 35px rgba(255,190,40,0.9))',
                        'drop-shadow(0 0 20px rgba(255,160,20,0.6))',
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative w-24 h-24 mb-5"
                  >
                    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                      {/* Radiating halo rings */}
                      <circle cx="50" cy="50" r="42" stroke="rgba(255,215,0,0.25)" strokeDasharray="3 3" />
                      <circle cx="50" cy="50" r="34" stroke="rgba(255,140,0,0.3)" />

                      {/* Dancing Flame */}
                      <motion.path
                        d="M50 12 C44 28 35 44 50 62 C65 44 56 28 50 12 Z"
                        fill="url(#introFlame)"
                        animate={{
                          d: [
                            'M50 12 C44 28 35 44 50 62 C65 44 56 28 50 12 Z',
                            'M50 8 C42 26 38 46 50 62 C62 46 58 26 50 8 Z',
                            'M50 12 C44 28 35 44 50 62 C65 44 56 28 50 12 Z',
                          ],
                        }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      {/* Diya Clay Bowl */}
                      <path
                        d="M18 62 C18 84 82 84 82 62 C82 58 18 58 18 62 Z"
                        fill="url(#introClay)"
                      />
                      <ellipse cx="50" cy="62" rx="32" ry="7" fill="#fbbf24" opacity="0.7" />

                      <defs>
                        <linearGradient id="introClay" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="50%" stopColor="#b45309" />
                          <stop offset="100%" stopColor="#78350f" />
                        </linearGradient>
                        <linearGradient id="introFlame" x1="50%" y1="100%" x2="50%" y2="0%">
                          <stop offset="0%" stopColor="#ef4444" />
                          <stop offset="35%" stopColor="#f97316" />
                          <stop offset="70%" stopColor="#fbbf24" />
                          <stop offset="100%" stopColor="#ffffff" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </motion.div>

                  {/* Subtitle Requirement: "May your life shine brighter than a thousand stars." */}
                  <p className="font-serif italic text-base sm:text-xl text-amber-100/90 font-light max-w-lg mb-8 tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    "May your life shine brighter than a thousand stars."
                  </p>

                  {/* Call to action: Enter Experience */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleEnter}
                    className="btn-gold flex items-center gap-3 px-8 py-3.5 rounded-full text-base sm:text-lg font-semibold tracking-wider uppercase cursor-pointer"
                  >
                    <span>Enter 3D Celebration</span>
                    <ArrowRight className="w-5 h-5 text-amber-950" />
                  </motion.button>

                  <div className="flex items-center gap-2 mt-4 text-xs text-amber-300/60">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Includes festive Indian music & 3D sound effects</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

