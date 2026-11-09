import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Sun, Moon, Shield, Award, Heart, Gift } from 'lucide-react';

const BLESSINGS = [
  {
    icon: Sun,
    title: 'Divine Light (Jyoti)',
    desc: 'May sacred diyas illuminate every path of your life and clear away all shadows of doubt.',
    sanskrit: 'शुभं करोति कल्याणम्',
  },
  {
    icon: Award,
    title: 'Maha Lakshmi Kripa',
    desc: 'Abundant wealth, sustained prosperity, and glorious success in all your righteous endeavors.',
    sanskrit: 'ॐ श्रीं महालक्ष्म्यै नमः',
  },
  {
    icon: Shield,
    title: 'Auspicious Beginnings',
    desc: 'Lord Ganesha removes every hurdle and blesses your home with profound wisdom and peace.',
    sanskrit: 'वक्रतुण्ड महाकाय',
  },
  {
    icon: Heart,
    title: 'Joy & Family Harmony',
    desc: 'Warm laughter, sweet delicacies, and everlasting bonding with your cherished loved ones.',
    sanskrit: 'सर्वे भवन्तु सुखिनः',
  },
];

export default function WishesSection({ onCelebrate }) {
  return (
    <section className="relative z-20 py-24 px-4 sm:px-8 max-w-6xl mx-auto text-center select-none">
      {/* Background radial gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-amber-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Sacred Mantra Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <span className="text-amber-400 font-serif tracking-[0.3em] text-sm uppercase block mb-2">
          ॥ ॐ तमसो मा ज्योतिर्गमय ॥
        </span>
        <p className="text-xs sm:text-sm text-amber-200/70 font-light italic max-w-md mx-auto">
          "From ignorance lead us to knowledge, from darkness lead us to light."
        </p>
      </motion.div>

      {/* Main Required Text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.0, delay: 0.2 }}
        className="festive-glass-glow p-8 sm:p-14 rounded-3xl relative overflow-hidden mb-16 border border-amber-400/40"
      >
        {/* Subtle decorative gold corner flourishes */}
        <div className="absolute top-3 left-4 text-amber-400/30 text-2xl font-serif">❖</div>
        <div className="absolute top-3 right-4 text-amber-400/30 text-2xl font-serif">❖</div>
        <div className="absolute bottom-3 left-4 text-amber-400/30 text-2xl font-serif">❖</div>
        <div className="absolute bottom-3 right-4 text-amber-400/30 text-2xl font-serif">❖</div>

        {/* Primary Required Blessing Sentence */}
        <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-extrabold gold-text-gradient leading-tight sm:leading-snug max-w-4xl mx-auto">
          "May this Diwali bring happiness, prosperity, success and endless light into your life."
        </h2>

        {/* Divider with Center Glowing Sparkle */}
        <div className="flex items-center justify-center gap-4 my-8">
          <div className="h-[1px] w-20 sm:w-36 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          <Sparkles className="w-6 h-6 text-amber-400 animate-spin" style={{ animationDuration: '7s' }} />
          <div className="h-[1px] w-20 sm:w-36 bg-gradient-to-l from-transparent via-amber-400 to-transparent" />
        </div>

        {/* Secondary Required Wish Text */}
        <p className="font-serif text-lg sm:text-2xl md:text-3xl font-bold tracking-wide text-amber-100 drop-shadow-[0_2px_12px_rgba(245,158,11,0.5)]">
          ✨ Wishing You and Your Family a Very Happy Diwali ✨
        </p>

        {/* Action Button inside card */}
        <div className="mt-8 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCelebrate}
            className="btn-gold px-8 py-3 rounded-full text-sm sm:text-base font-bold flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-950" />
            <span>Light Sky with Fireworks</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Four Divine Pillars of Deepavali */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {BLESSINGS.map((b, idx) => {
          const Icon = b.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="festive-glass p-6 rounded-2xl border border-amber-500/25 flex flex-col items-center text-center group transition-all hover:border-amber-400/60 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/40 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-[0_0_15px_#f59e0b] transition-all">
                <Icon className="w-6 h-6 text-amber-300" />
              </div>
              <span className="text-[11px] font-serif text-amber-400/80 tracking-widest uppercase mb-1">
                {b.sanskrit}
              </span>
              <h3 className="font-serif font-bold text-lg text-amber-100 mb-2">{b.title}</h3>
              <p className="text-xs text-amber-200/70 font-light leading-relaxed">{b.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

