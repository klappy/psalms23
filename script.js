// Retrieve all parallax layers
const layers = Array.from(document.querySelectorAll('.layer'));

// Store viewport width to calculate loop points
let viewportW = window.innerWidth;

// Keep track of background offset
let offset = 0;

function animate() {
  // Increment offset. Smaller increments are smoother and less power hungry.
  offset += 0.5; // pixels per frame

  layers.forEach((layer) => {
    const speed = parseFloat(layer.dataset.speed);

    // Using background-position instead of transform to avoid compositing on iOS
    const xPos = -(offset * speed) % viewportW;
    layer.style.backgroundPosition = `${xPos}px center`;
  });

  requestAnimationFrame(animate);
}

// Handle viewport resize (orientation change, split-screen, etc.)
window.addEventListener('resize', () => {
  viewportW = window.innerWidth;
});

// Start animation loop after DOM is ready
window.addEventListener('load', () => {
  requestAnimationFrame(animate);
});