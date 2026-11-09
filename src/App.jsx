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
  { id: 'rocket', name: 'Rocket', icon: '🚀', desc: 'Click/Tap anywhere to shoot aerial rockets' },
  { id: 'anaar', name: 'Anaar', icon: '🌋', desc: 'Click to place towering golden fountain' },
  { id: 'chakri', name: 'Chakri', icon: '🌀', desc: 'Click to spin high-speed rainbow wheel' },
  { id: 'bomb', name: 'Sutli Bomb', icon: '💣', desc: 'Click to plant bomb with shockwave blast' },
  { id: 'ladi', name: 'Ladi', icon: '💥', desc: 'Click for rapid 28-burst crackling chain' },
  { id: 'hunter', name: 'Magic Hunter', icon: '🎯', desc: 'Click to shoot 8 rapid colorful comet tracers' },
];

export default function App() {
  const [selectedCracker, setSelectedCracker] = useState('rocket');
  const [autoPlay, setAutoPlay] = useState(true);
  const [slowMotion, setSlowMotion] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [screenShake, setScreenShake] = useState(false);

  const fireworksRef = useRef(null);

  // Initialize audio on first user touch / click
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
      particleCount: 90,
      spread: 75,
      origin: { y: 0.8 },
      colors: ['#ffd700', '#f59e0b', '#ef4444', '#10b981', '#ffffff'],
    });
  }, []);

  const currentCracker = CRACKERS.find((c) => c.id === selectedCracker) || CRACKERS[0];

  return (
    <div
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

      {/* 3. Fullscreen Interactive 60FPS Fireworks Canvas */}
      <FireworksCanvas
        ref={fireworksRef}
        autoPlay={autoPlay}
        crackerType={selectedCracker}
        slowMotion={slowMotion}
        onScreenShake={triggerScreenShake}
      />

      {/* 4. Top Header & Active Cracker Badge */}
      <header className="fixed top-3 left-0 right-0 z-20 flex flex-col items-center pointer-events-none px-4 text-center">
        <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/60 border border-amber-500/35 backdrop-blur-md text-amber-300 text-[11px] sm:text-xs tracking-widest uppercase mb-1 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
          <Sparkles className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Interactive Diwali Pataakha Arena</span>
        </div>

        <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black tracking-wider gold-text-gradient drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
          DIWALI AATISHBAAZI <span className="inline-block text-amber-300 animate-pulse">✨</span>
        </h1>

        {/* Active Cracker Instructions Badge */}
        <div className="mt-1 pointer-events-auto flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 border border-amber-400/50 backdrop-blur-lg shadow-lg">
          <span className="text-base">{currentCracker.icon}</span>
          <span className="text-xs sm:text-sm font-bold text-amber-200">
            {currentCracker.name}:
          </span>
          <span className="text-xs text-amber-100/80 font-light hidden xs:inline">
            {currentCracker.desc}
          </span>
        </div>
      </header>

      {/* 5. Permanent Stable Bottom Control HUD */}
      <div className="fixed bottom-3 sm:bottom-5 left-0 right-0 z-20 flex flex-col items-center pointer-events-none px-2 sm:px-4">
        <div className="pointer-events-auto w-full max-w-2xl bg-black/85 border border-amber-500/40 rounded-3xl p-3 sm:p-4 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col gap-2.5">
          {/* Traditional Cracker Tabs (All 10 Authentic Crackers) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none border-b border-amber-500/20">
            <span className="text-[11px] font-black text-amber-400/90 uppercase tracking-wider pl-1 pr-1.5 whitespace-nowrap">
              Pataakha:
            </span>
            <div className="flex items-center gap-1.5">
              {CRACKERS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCracker(c.id)}
                  title={c.desc}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-sm ${
                    selectedCracker === c.id
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 shadow-[0_0_15px_#ffd700] scale-105 border border-yellow-200'
                      : 'bg-black/50 text-amber-200/70 hover:text-white border border-amber-500/20 hover:border-amber-400/50'
                  }`}
                >
                  <span className="text-sm">{c.icon}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between gap-2 flex-wrap pt-0.5">
            {/* Grand Fireworks Finale */}
            <button
              onClick={triggerGrandShow}
              className="btn-gold flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-black tracking-wide uppercase cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-950 animate-bounce" />
              <span>Grand Finale 🎆</span>
            </button>

            <div className="flex items-center gap-1.5">
              {/* Slow Motion */}
              <button
                onClick={() => setSlowMotion(!slowMotion)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                  slowMotion
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-[0_0_12px_#ffd700]'
                    : 'bg-stone-900/80 text-stone-300 border-stone-700 hover:text-white'
                }`}
                title="Slow down firework explosion speed to 35%"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Slow-Mo</span>
              </button>

              {/* Auto Sky Toggle */}
              <button
                onClick={() => setAutoPlay(!autoPlay)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                  autoPlay
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-stone-900/80 text-stone-400 border-stone-700 hover:text-stone-200'
                }`}
              >
                {autoPlay ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden xs:inline">{autoPlay ? 'Auto ON' : 'Auto OFF'}</span>
              </button>

              {/* Sound Toggle */}
              <button
                onClick={toggleMute}
                className={`p-2 rounded-full border transition-all cursor-pointer ${
                  !isMuted
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-stone-900/80 text-stone-400 border-stone-700 hover:text-stone-200'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
