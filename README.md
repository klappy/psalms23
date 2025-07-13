# Psalm 23 Immersive Journey

An interactive, responsive, scroll-based visual experience that brings **Psalm 23** to life on any modern mobile or desktop browser.

## ✨ Features

* Full-screen, parallax-animated scenes for each verse
* Smooth fade-in typography styled for readability and reverence
* Mobile-first, fully responsive design
* Zero build-step — pure HTML, CSS, & JS served directly or from any static host
* Easily swap imagery or add ambient audio for deeper immersion
* 3D particle water shimmer (Verse 2) & star field (Verse 6) via **Three.js** (lazy-loaded)
* Device-tilt micro-parallax for verse text
* Simple loader overlay for slower connections

## 📂 Project structure

```
├── index.html   # Main markup & CDNs for GSAP + ScrollTrigger
├── styles.css   # Responsive & parallax styling
├── script.js    # Animation logic
└── README.md    # You are here
```

## 🚀 Quick start

1. **Download or clone** this folder.
2. Open `index.html` in any modern browser (Chrome, Safari, Firefox, Edge, mobile Safari/Chrome, etc.).
3. Scroll to journey through the Psalm.

No build tools required — perfect for dropping into an existing website or presenting directly from a phone during a sermon.

## 🖼️ Customization

* **Images:** Replace the `background-image` URLs in `index.html` with your own assets or local files for complete thematic control.
* **Fonts / Colors:** Edit `styles.css` to change typography, palette, or add branding.
* **Audio:** To embed ambient sound, add an `<audio>` tag to `index.html` with the `autoplay` and `loop` attributes, then gently fade volume with GSAP for smooth transitions.
* **Deeper interactivity:** Because GSAP is already loaded, you can extend the experience with 3-D transforms, split-text reveals, or canvas/WebGL overlays.

## 🔉 Audio sourcing

Put small, loop-friendly MP3 files into `audio/`:

* `stream.mp3` – gentle creek/stream loop (≈15-20 s)
* `valley_wind.mp3` – low wind/rumble ambience (≈15 s)
* `choir.mp3` – soft choir pad (≈30 s)

Free sources:
* [Pixabay Audio](https://pixabay.com/music/) – search *river*, *wind*, *choir pad*
* [Freesound](https://freesound.org) – CC-0 clips are plentiful

Keep files small (<1 MB) to ensure quick loading on mobile.

## 🤝 Credits & Licensing

* Imagery pulled from [Unsplash](https://unsplash.com) (free, generous license).
* Animation powered by [GSAP](https://greensock.com/gsap/) (free for non-commercial and many commercial uses — see their licensing docs).

Feel free to modify and share with your congregation. May this blessing enrich your worship experience! :seedling: