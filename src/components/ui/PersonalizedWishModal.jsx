import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Copy, Check, Share2, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PersonalizedWishModal({ isOpen, onClose }) {
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generatedMessage = `✨ Shubh Deepavali! ✨\n\nDear ${
    recipientName.trim() || 'Friend'
  },\n\nMay this Diwali bring happiness, prosperity, success, and endless light into your life.\nWishing you and your loved ones a joy-filled, peaceful and radiant Diwali!\n\nWarm festive wishes,\n~ ${
    senderName.trim() || 'A Well-Wisher'
  } 🪔✨`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#ffd700', '#f59e0b', '#ef4444'],
    });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="festive-glass-glow w-full max-w-lg rounded-3xl p-6 sm:p-8 relative border border-amber-400/50 shadow-[0_0_50px_rgba(245,158,11,0.25)] select-none"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full festive-glass text-amber-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Title */}
          <div className="text-center mb-6">
            <span className="text-xs font-serif uppercase tracking-[0.25em] text-amber-400 block mb-1">
              Personalized Blessing
            </span>
            <h3 className="font-serif text-2xl font-bold gold-text-gradient">
              Create Your Diwali Greeting Card
            </h3>
          </div>

          {/* Form Inputs */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-amber-200/80 mb-1.5">
                Recipient's Name:
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Grandma, Rahul, Sharma Family"
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 placeholder:text-stone-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-amber-200/80 mb-1.5">
                Your Name / Family Name:
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Suman & Family"
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 placeholder:text-stone-500"
              />
            </div>
          </div>

          {/* Card Preview */}
          <div className="bg-gradient-to-b from-[#181126] to-[#0c0915] p-5 rounded-2xl border border-amber-400/30 relative overflow-hidden mb-6">
            <div className="absolute top-2 right-2 text-amber-400/20 text-3xl font-serif">🪔</div>
            <p className="text-xs text-amber-300/80 uppercase tracking-widest font-serif mb-2">
              Preview Card
            </p>
            <p className="text-xs text-amber-100/90 whitespace-pre-line leading-relaxed font-serif italic">
              {generatedMessage}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 btn-gold py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950" />
                  <span className="text-emerald-950">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-stone-950" />
                  <span>Copy Blessing Text</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

