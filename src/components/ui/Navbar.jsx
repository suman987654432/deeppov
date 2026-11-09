import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Sparkles, RotateCcw, Compass } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export default function Navbar({
  isMuted,
  onToggleMute,
  onCelebrate,
  onReplayIntro,
  enableOrbit,
  onToggleOrbit,
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-4 sm:px-8 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo / Festive Seal */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="pointer-events-auto flex items-center gap-3 festive-glass px-4 py-2 rounded-full border border-amber-500/30"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 flex items-center justify-center shadow-[0_0_12px_#f59e0b]">
            <span className="text-amber-950 font-bold text-xs">ॐ</span>
          </div>
          <div>
            <span className="font-serif font-bold text-sm sm:text-base tracking-widest text-amber-200 block leading-tight">
              DEEPAVALI
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400/70 font-medium">
              Festival of Lights
            </span>
          </div>
        </motion.div>

        {/* Right Navigation Controls */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="pointer-events-auto flex items-center gap-2 sm:gap-3"
        >
          {/* 3D Camera Mode Toggle */}
          <button
            onClick={onToggleOrbit}
            title={enableOrbit ? 'Orbit Controls Active (Drag to Rotate 3D Diya)' : 'Parallax Mode Active'}
            className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all ${
              enableOrbit
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'festive-glass text-amber-100/70 hover:text-amber-200'
            }`}
          >
            <Compass className={`w-3.5 h-3.5 ${enableOrbit ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
            <span>{enableOrbit ? '360° Orbit' : 'Parallax'}</span>
          </button>

          {/* Quick Grand Celebration Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCelebrate}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-red-600/80 via-amber-600/80 to-amber-500/80 text-amber-100 border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '5s' }} />
            <span className="hidden xs:inline">Grand</span> Fireworks
          </motion.button>

          {/* Replay Intro */}
          <button
            onClick={onReplayIntro}
            title="Replay Opening Ceremony"
            className="festive-glass p-2 sm:px-3 sm:py-2 rounded-full text-xs text-amber-200/80 hover:text-amber-200 transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Intro</span>
          </button>

          {/* Sound / Music Toggle */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Ambient Sitar & Festive Sounds' : 'Mute Audio'}
            className="festive-glass p-2.5 rounded-full text-amber-300 hover:text-amber-100 transition-all flex items-center gap-2 cursor-pointer border border-amber-500/30"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-amber-400/60" />
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                {/* Visualizer audio bars */}
                <span className="flex items-end gap-0.5 h-3.5">
                  <span className="w-0.5 bg-amber-400 animate-[bounce_1s_infinite_100ms] h-full" />
                  <span className="w-0.5 bg-amber-400 animate-[bounce_1.2s_infinite_300ms] h-2" />
                  <span className="w-0.5 bg-amber-400 animate-[bounce_0.8s_infinite_200ms] h-3" />
                </span>
              </>
            )}
          </button>
        </motion.div>
      </div>
    </header>
  );
}

