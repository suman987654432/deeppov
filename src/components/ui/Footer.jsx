import React from 'react';
import { Sparkles, Heart, Flame } from 'lucide-react';

export default function Footer({ onCelebrate }) {
  return (
    <footer className="relative z-20 border-t border-amber-500/20 bg-gradient-to-t from-black via-[#080511] to-transparent py-14 px-4 select-none">
      {/* Top golden glowing line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent shadow-[0_0_15px_#f59e0b]" />

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Festive Crest Icon */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-200 p-0.5 mb-4 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
          <div className="w-full h-full bg-[#0d091a] rounded-full flex items-center justify-center">
            <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
          </div>
        </div>

        {/* Sacred Shloka in Devanagari */}
        <h3 className="font-serif text-lg sm:text-xl font-bold tracking-widest text-amber-200 mb-2">
          ॥ शुभं करोति कल्याणम् आरोग्यम् धनसंपदा ॥
        </h3>
        <p className="text-xs sm:text-sm text-amber-300/70 font-light max-w-md mx-auto mb-6">
          "Salutations to the Divine Flame that brings auspiciousness, health, and abundant wealth."
        </p>

        {/* Interactive Quick Trigger */}
        <button
          onClick={onCelebrate}
          className="inline-flex items-center gap-2 text-xs text-amber-400 hover:text-amber-200 transition-colors py-1.5 px-4 rounded-full border border-amber-500/30 mb-8 bg-amber-500/10 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Launch Fireworks Finale</span>
        </button>

        {/* Bottom Credits & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full pt-8 border-t border-amber-500/10 text-xs text-amber-200/50 gap-4">
          <p>© 2026 Deepavali Celebration • Designed with 3D WebGL & Love</p>
          <div className="flex items-center gap-2 text-amber-300/70">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>for the Festival of Lights</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

