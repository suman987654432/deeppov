import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Sparkles, Wand2, ShieldAlert, MousePointerClick, HeartHandshake } from 'lucide-react';

export default function DiyaControls({
  isLit,
  onToggleLight,
  onCelebrate,
  flameIntensity,
  onChangeIntensity,
  materialType,
  onChangeMaterial,
  onOpenBlessingModal,
}) {
  return (
    <div className="pointer-events-none w-full max-w-4xl mx-auto flex flex-col items-center justify-between min-h-[calc(100vh-100px)] pt-20 pb-8 px-4 z-20 relative select-none">
      {/* Top Hero Text */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.2 }}
        className="text-center mt-2 sm:mt-4 pointer-events-auto"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full festive-glass border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Shubh Deepavali 2026 • शुभ दीपावली</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black tracking-wide gold-text-gradient uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
          Festival of Divine Lights
        </h1>

        <p className="mt-2 text-xs sm:text-sm md:text-base text-amber-100/80 max-w-lg mx-auto font-light font-sans tracking-wide">
          Ignite the sacred lamp to dispel darkness, welcome Goddess Lakshmi, and shower your home with eternal prosperity.
        </p>

        {/* Interactive hint pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-[11px] sm:text-xs text-amber-300/70">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-amber-500/20 backdrop-blur-sm">
            <MousePointerClick className="w-3 h-3 text-amber-400" />
            Click anywhere for fireworks
          </span>
          <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-amber-500/20 backdrop-blur-sm">
            <Wand2 className="w-3 h-3 text-amber-400" />
            Drag Diya to rotate 360°
          </span>
        </div>
      </motion.div>

      {/* Center Spacer for 3D Diya Viewport */}
      <div className="flex-1 w-full min-h-[220px] pointer-events-none" />

      {/* Bottom Main Interactive Action Panel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4 }}
        className="pointer-events-auto w-full flex flex-col items-center gap-4"
      >
        {/* Core Buttons Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {/* Main "Light the Diya" interactive button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={onToggleLight}
            className={`flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-full text-sm sm:text-base font-bold tracking-wide transition-all cursor-pointer shadow-lg ${
              isLit
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-stone-950 shadow-[0_0_25px_rgba(245,158,11,0.5)] border border-yellow-300/60'
                : 'bg-stone-800 text-amber-300 border border-amber-500/40 hover:bg-stone-700 shadow-[0_0_15px_rgba(0,0,0,0.5)]'
            }`}
          >
            <Flame
              className={`w-5 h-5 ${
                isLit ? 'text-red-950 animate-flame-flicker' : 'text-amber-500 opacity-60'
              }`}
            />
            <span>{isLit ? 'Diya is Glowing (Click to Extinguish)' : '✨ Light the Diya'}</span>
          </motion.button>

          {/* "Celebrate Diwali" Button for Grand Fireworks Show */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={onCelebrate}
            className="flex items-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-full text-sm sm:text-base font-bold tracking-wide btn-gold cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-amber-950 animate-bounce" />
            <span>Celebrate Diwali</span>
          </motion.button>

          {/* Create Wish Card */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenBlessingModal}
            className="festive-glass hover:border-amber-400/60 flex items-center gap-2 px-5 py-3.5 rounded-full text-sm font-semibold text-amber-200 transition-all cursor-pointer border border-amber-500/30"
          >
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>Send Blessing Card</span>
          </motion.button>
        </div>

        {/* Diya Customization Toolbar */}
        <div className="festive-glass px-4 py-2.5 rounded-2xl flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-amber-200/90 border border-amber-500/25">
          {/* Material Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-amber-400/70 font-medium">Diya Craft:</span>
            <div className="flex bg-black/40 rounded-full p-0.5 border border-amber-500/20">
              {[
                { id: 'brass', label: 'Gold Brass' },
                { id: 'clay', label: 'Mitti (Clay)' },
                { id: 'silver', label: 'Silver' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => onChangeMaterial(m.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                    materialType === m.id
                      ? 'bg-amber-500 text-stone-950 font-semibold shadow-[0_0_10px_#f59e0b]'
                      : 'text-amber-200/70 hover:text-amber-100'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Flame Glow Radiance */}
          <div className="flex items-center gap-2">
            <span className="text-amber-400/70 font-medium">Flame Radiance:</span>
            <div className="flex bg-black/40 rounded-full p-0.5 border border-amber-500/20">
              {[
                { val: 0.7, label: 'Gentle' },
                { val: 1.0, label: 'Radiant' },
                { val: 1.4, label: 'Divine' },
              ].map((lvl) => (
                <button
                  key={lvl.val}
                  onClick={() => onChangeIntensity(lvl.val)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                    Math.abs(flameIntensity - lvl.val) < 0.1
                      ? 'bg-amber-500 text-stone-950 font-semibold shadow-[0_0_10px_#f59e0b]'
                      : 'text-amber-200/70 hover:text-amber-100'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

