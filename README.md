# Psalm 23 Immersive Journey

An interactive, responsive, scroll-based visual experience that brings **Psalm 23** to life on any modern mobile or desktop browser.

## ✨ Features

* Full-screen, parallax-animated scenes for each verse
* Smooth fade-in typography styled for readability and reverence
* Mobile-first, fully responsive design
* Zero build-step — pure HTML, CSS, & JS served directly or from any static host
* Easily swap imagery or add ambient audio for deeper immersion

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

## 🤝 Credits & Licensing

* Imagery pulled from [Unsplash](https://unsplash.com) (free, generous license).
* Animation powered by [GSAP](https://greensock.com/gsap/) (free for non-commercial and many commercial uses — see their licensing docs).

Feel free to modify and share with your congregation. May this blessing enrich your worship experience! :seedling: