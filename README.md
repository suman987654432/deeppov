# 🪔 3D Interactive Deepavali (Diwali) Celebration Website

A premium, cinematic, award-winning 3D web experience celebrating the **Festival of Lights (Deepavali)**. Built with React 18, Vite, Three.js, React Three Fiber, Tailwind CSS, Framer Motion, Canvas Particle Physics, and Web Audio API synthesizer.

![Diwali Celebration Preview](public/diya-icon.svg)

---

## ✨ Features & Experiences

### 1. 🕯️ Procedural 3D Akhand Diya (Three.js & R3F)
- **Authentic Sacred Indian Oil Lamp**: Custom LatheGeometry modeling traditional brass and terracotta curves, rim collar, and cotton wick (`batti`).
- **Multi-layered Organic Flame**: Teardrop core and glowing aura with organic mathematical wave distortion and flicker.
- **Dynamic Warm Point Lighting**: Flickering golden/orange point light casting realistic soft shadows on the reflective marble pedestal.
- **Craft Selector**: Real-time material toggling between **Gold Brass**, **Mitti (Clay)**, and **Royal Silver**.
- **Flame Radiance Controls**: Toggle between *Gentle*, *Radiant*, and *Divine* flame energies.
- **Interactive 360° Inspection & Parallax**: Rotate the lamp in 360 degrees or experience subtle mouse-following parallax.

### 2. 🎆 Dynamic Continuous & Interactive Fireworks System
- Custom 60 FPS HTML5 Canvas particle physics engine with realistic drag, gravity, and alpha decay.
- **Explosion Patterns**: Chrysanthemum sparkle, Willow/Kamuro cascade with long glittering trails, Geometric rings, and festive jewel bursts.
- **Click-to-Launch**: Clicking anywhere on the canvas shoots an aerial firework rocket that detonates at your pointer coordinates.
- **Grand Celebration Show**: Clicking *"Celebrate Diwali"* triggers a cascading barrage of 14+ simultaneous fireworks across the skyline accompanied by golden confetti.

### 3. 🎵 Zero-Dependency Indian Festive Soundscape (Web Audio API)
- 100% self-contained procedurally synthesized Tanpura drone and Bhairav raga chime notes.
- Authentic match-strike and flame ignition chord whoosh when lighting the Diya.
- Whistling rocket launches, deep bass detonation thuds, and shimmering crackles.
- Unmute/Mute toggle with animated audio visualizer waves.

### 4. 🌟 Opening Cinematic Reveal
- Starts in meditative celestial darkness.
- Golden particles coalesce into the title: *"A Festival of Lights"*.
- Dramatic reveal of **"HAPPY DIWALI ✨"** with radiant golden text gradient and shimmer.
- Central glowing Diya lights up alongside: *"May your life shine brighter than a thousand stars."*
- Smooth transition into full 3D interactive celebration mode.

### 5. 💌 Auspicious Blessings & Custom Greeting Generator
- Required festive benedictions:
  > *"May this Diwali bring happiness, prosperity, success and endless light into your life."*
  > *"✨ Wishing You and Your Family a Very Happy Diwali ✨"*
- Four divine pillars: Jyoti (Light), Lakshmi Kripa (Prosperity), Ganesha Blessings (Wisdom), and Family Harmony.
- Interactive Greeting Card creator: customize names and copy festive greetings directly to clipboard.
- Sacred Vedic shlokas with Devanagari typography and golden glowing borders.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- **3D Graphics**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/) + [@react-three/drei](https://github.com/pmndrs/drei)
- **Animations**: [Framer Motion 11](https://www.framer.com/motion/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Celebration Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Audio Engine**: Native Web Audio API Synthesizer

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 22+
- pnpm / npm

### Run Locally
```bash
# Clone the repository
git clone <repo-url>
cd deep

# Install dependencies
pnpm install

# Start local development server
pnpm run dev
```

Visit `http://localhost:3000` in your browser.

### Build for Production
```bash
pnpm run build
```

---

## ☁️ Deploy to Vercel

This repository includes `vercel.json` pre-configured for instant zero-configuration deployment:
```bash
npx vercel
```
Or import directly on [Vercel Dashboard](https://vercel.com/new).

