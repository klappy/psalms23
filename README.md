# Psalm 23 • Immersive Web Experience

This small single–page app presents **Psalm 23** in an ambient, meditative 3-D environment optimised for phones **and** desktops.

• Built with [Three.js](https://threejs.org/) — no build-step, runs directly from a static file server.
• Dynamic, Roku-style floating imagery forms the backdrop while verses fade in-and-out in the centre of the screen.
• Fully responsive and takes advantage of high-DPI screens but caps pixel-ratio for battery life on mobiles.

## Quick start

1. **Clone or download** this folder.
2. **Serve the files** from any static web server to avoid CORS issues (examples below).

```bash
# Using python 3.x (already installed on most systems)
python -m http.server 8000
# Then open http://localhost:8000 on your phone or laptop
```

Or deploy directly to Netlify / Vercel / GitHub Pages – no additional config required.

## customise

* **Images** – replace the URLs inside `main.js -> IMAGE_URLS` with your own JPG/PNG assets. Local `./assets/...jpg` paths also work when served from the same origin.
* **Verses / Translation** – edit the `VERSES` array in `main.js`.
* **Motion style** – tweak `BOUNDS`, plane sizes, and velocity ranges for faster or slower movement.
* **Colours** – Adjust fog colour or overlay text styles in `style.css`.

## License

All original code in this repository is released under the MIT license. Unsplash images linked by default are licensed under the Unsplash License – you may substitute them with your own artwork.