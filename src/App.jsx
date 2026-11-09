import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import FireworksCanvas from './components/fireworks/FireworksCanvas';
import { soundManager } from './utils/audio';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Clock
} from 'lucide-react';

const CRACKERS = [
  { id: 'rambaan', name: 'Ram Baan', icon: '🏹', desc: 'Tap anywhere to shoot the Arrow of Light' },
  { id: 'bomb', name: 'Sutli Bomb', icon: '💣', desc: 'Tap to place green bomb with shockwave blast' },
  { id: 'anaar', name: 'Anaar', icon: '🌋', desc: 'Tap to place towering golden flowerpot fountain' },
  { id: 'chakri', name: 'Chakri', icon: '🌀', desc: 'Tap to spin high-speed rainbow ground wheel' },
  { id: 'sparkler', name: 'Phuljhadi', icon: '✨', desc: 'Drag finger to draw with sizzling golden fire' },
  { id: 'diya', name: 'Water Diya', icon: '🪔', desc: 'Tap water to place glowing floating diya' },
  { id: 'rocket', name: 'Rocket', icon: '🚀', desc: 'Tap to shoot whistling aerial rockets' },
  { id: 'ladi', name: 'Ladi', icon: '💥', desc: 'Tap for rapid 28-burst crackling chain' },
];

export default function App() {
  const [selectedCracker, setSelectedCracker] = useState('rambaan');
  const [autoPlay, setAutoPlay] = useState(false); // Off by default so user's taps are the star of the show
  const [slowMotion, setSlowMotion] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [isUiVisible, setIsUiVisible] = useState(true);

  const fireworksRef = useRef(null);
  const hideTimerRef = useRef(null);

  // Initialize audio on first touch
  useEffect(() => {
    soundManager.init();
    const unlock = () => {
      soundManager.ensureContext();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('touchstart', unlock);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, []);

  // Auto-hide UI during gameplay so screen recordings are 100% clean
  const handleUserInteraction = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    // After 2.5s of playing, auto-fade UI to zero opacity
    hideTimerRef.current = setTimeout(() => {
      setIsUiVisible(false);
    }, 2500);
  }, []);

  // Screen shake on big blast
  const triggerScreenShake = useCallback(() => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 350);
  }, []);

  const toggleMute = useCallback(() => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
  }, [isMuted]);

  // Grand Celebration Finale
  const triggerGrandShow = useCallback(() => {
    if (fireworksRef.current) {
      fireworksRef.current.triggerCelebration();
    }
    soundManager.playExplosion(0, 1.4);

    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.8 },
      colors: ['#ffd700', '#f59e0b', '#ef4444', '#10b981', '#ffffff'],
    });
  }, []);

  const currentCracker = CRACKERS.find((c) => c.id === selectedCracker) || CRACKERS[0];

  return (
    <div
      onClick={() => setIsUiVisible(true)}
      className={`relative w-full h-full overflow-hidden bg-[#030206] select-none touch-none overscroll-none ${
        screenShake ? 'screen-shake' : ''
      }`}
    >
      {/* 1. Deep Midnight Cosmic Sky Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(35,16,55,0.85)_0%,rgba(10,5,22,0.95)_50%,#030206_100%)] pointer-events-none" />

      {/* 2. Sacred Waterfront Ghat Silhouette with Golden Ripples */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-10 flex items-end justify-between px-6 pb-2 opacity-75">
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
      </div>

      {/* 3. Fullscreen Interactive 60FPS Canvas */}
      <FireworksCanvas
        ref={fireworksRef}
        autoPlay={autoPlay}
        crackerType={selectedCracker}
        slowMotion={slowMotion}
        onScreenShake={triggerScreenShake}
        onInteraction={handleUserInteraction}
      />

      {/* 4. AESTHETIC MINIMAL LUXURY WATERMARK (Top Center) */}
      <div className="fixed top-4 left-0 right-0 z-20 flex flex-col items-center pointer-events-none px-4 text-center">
        <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-black/40 border border-amber-500/30 backdrop-blur-md shadow-2xl">
          <span className="font-serif text-xs sm:text-sm font-black tracking-[0.25em] gold-text-gradient uppercase">
            SHUBH DEEPAVALI 2026 ✨
          </span>
        </div>
      </div>

      {/* 5. AUTO-DIMMING FLOATING DOCK (Bottom Controls) */}
      <div
        className={`fixed bottom-3 sm:bottom-5 left-0 right-0 z-20 flex flex-col items-center px-2 sm:px-4 transition-all duration-700 ease-out ${
          isUiVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="w-full max-w-md bg-black/85 border border-amber-500/40 rounded-3xl p-2.5 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.95)] flex flex-col gap-2">
          {/* Active Cracker Hint Label */}
          <div className="flex items-center justify-between px-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <span className="text-base">{currentCracker.icon}</span>
              <span>{currentCracker.name}</span>
            </div>
            <span className="text-[10px] text-amber-200/60 font-light truncate max-w-[200px]">
              {currentCracker.desc}
            </span>
          </div>

          {/* Swipeable Cracker Dock */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory touch-pan-x">
            {CRACKERS.map((c) => (
              <button
                key={c.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCracker(c.id);
                  handleUserInteraction();
                }}
                className={`flex flex-col items-center justify-center min-w-[52px] h-[52px] rounded-2xl text-xs font-bold transition-all cursor-pointer snap-start ${
                  selectedCracker === c.id
                    ? 'bg-gradient-to-t from-amber-500 to-yellow-400 text-stone-950 shadow-[0_0_15px_#ffd700] scale-105 border border-yellow-200'
                    : 'bg-stone-900/90 text-amber-200/80 border border-amber-500/20 active:scale-95'
                }`}
              >
                <span className="text-lg leading-none mb-0.5">{c.icon}</span>
                <span className="text-[9px] leading-tight font-semibold">{c.name}</span>
              </button>
            ))}
          </div>

          {/* Quick Actions Row */}
          <div className="flex items-center justify-between gap-1 pt-1 border-t border-amber-500/20 text-xs">
            {/* Grand Finale Trigger */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerGrandShow();
              }}
              className="btn-gold flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wide cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3 h-3 text-amber-950 animate-bounce" />
              <span>Grand Finale 🎆</span>
            </button>

            <div className="flex items-center gap-1">
              {/* Slow Motion */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSlowMotion(!slowMotion);
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all cursor-pointer border ${
                  slowMotion
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-[0_0_10px_#ffd700]'
                    : 'bg-stone-900/90 text-stone-400 border-stone-700'
                }`}
              >
                <Clock className="w-3 h-3 inline mr-0.5" />
                <span>Slow-Mo</span>
              </button>

              {/* Sound Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  !isMuted
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/50'
                    : 'bg-stone-900/90 text-stone-400 border-stone-700'
                }`}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
