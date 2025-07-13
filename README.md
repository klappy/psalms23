# 🌟 Psalm 23 Immersive PWA - Multi-Experience Hub

An epic, visually immersive mobile PWA that brings Psalm 23 to life through four distinct interactive experiences, each with unique 2.5D parallax scrolling effects.

## 🎨 Four Immersive Experiences

### 1. **The Shepherd's Journey** - Horizontal Adventure
- Side-scrolling adventure through the psalm's landscapes
- Hand-painted watercolor aesthetic with subtle animations
- Interactive sheep and shepherd elements
- **Parallax Layers**: Mountains (slow) → Hills (medium) → Path/Characters (fast)

### 2. **Divine Perspective** - Vertical Scroll with Depth
- Top-down heavenly view with isometric 3D styling
- Rich textures and dynamic lighting effects
- Tilt device to change perspective, pinch to zoom
- **Parallax Layers**: Sky → Terrain → Characters

### 3. **Living Scripture** - Immersive Storybook
- Each verse unfolds as an interactive cinematic scene
- Mixed media: photography, illustration, and subtle 3D
- Swipe between verses, tap for audio narration
- **Parallax Layers**: Atmosphere → Environment → Characters

### 4. **Sacred Landscape** - 360° Panoramic Experience
- Immersive panoramic views that rotate as you scroll
- Photorealistic with artistic filters
- Gyroscope support, touch to look around
- **Parallax Layers**: Sky dome → Horizon → Ground plane

## 🛠 Technical Stack

- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **3D Effects**: Three.js for advanced parallax
- **Audio**: Web Audio API for ambient sounds
- **PWA**: Service Worker + Web App Manifest
- **State Management**: Zustand
- **Routing**: React Router

## 📱 Mobile-First Features

- Touch gestures (swipe, pinch, tilt)
- Haptic feedback
- Offline capability
- Add to home screen
- Gyroscope integration
- Responsive design

## 🚀 Getting Started

```bash
npm install
npm run dev
```

## 📁 Project Structure

```
src/
├── components/
│   ├── hub/           # Main launcher components
│   ├── experiences/   # Individual experience components
│   └── shared/        # Shared UI components
├── experiences/
│   ├── shepherds-journey/
│   ├── divine-perspective/
│   ├── living-scripture/
│   └── sacred-landscape/
├── assets/
│   ├── images/
│   ├── audio/
│   └── data/
└── utils/
    ├── parallax/
    ├── audio/
    └── gestures/
```

## 🎯 Development Roadmap

1. **Phase 1**: Core PWA setup and experience hub
2. **Phase 2**: The Shepherd's Journey experience
3. **Phase 3**: Divine Perspective experience
4. **Phase 4**: Living Scripture experience
5. **Phase 5**: Sacred Landscape experience
6. **Phase 6**: Polish, optimization, and testing

## 📖 Psalm 23 Text

The Lord is my shepherd; I shall not want.
He maketh me to lie down in green pastures: he leadeth me beside the still waters.
He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.
Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.
Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.
Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the Lord for ever.