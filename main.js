import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.module.js';

// Helper to test WebGL availability
function isWebGLSupported() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (_) {
    return false;
  }
}

// ----- Configuration -----
// Psalm 23 verses (KJV)
const VERSES = [
  'The Lord is my shepherd; I shall not want.',
  'He maketh me to lie down in green pastures: he leadeth me beside the still waters.',
  'He restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake.',
  'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.',
  'Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.',
  'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the Lord for ever.'
];

// Background imagery (Unsplash royalty-free URLs). Feel free to replace with your own art.
const IMAGE_URLS = [
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80', // pasture
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80', // still waters
  'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&w=800&q=80', // valley
  'https://images.unsplash.com/photo-1608877099749-9f6ae9ee0ebc?auto=format&fit=crop&w=800&q=80', // table feast
  'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=800&q=80', // oil (jar)
  'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=800&q=80'  // house / dwelling
];

const verseContainer = document.getElementById('verse');
const loadingEl = document.getElementById('loading');

// ----- Accessibility & Verse Navigation Helpers -----
let currentVerse = 0;
const VERSE_DISPLAY_DURATION = 8000; // ms
let verseTimer;

function displayVerse(index) {
  currentVerse = (index + VERSES.length) % VERSES.length;
  verseContainer.classList.remove('show');

  // Wait briefly for fade-out before swapping text
  setTimeout(() => {
    verseContainer.textContent = VERSES[currentVerse];
    verseContainer.classList.add('show');
  }, 100);

  resetVerseTimer();
}

function nextVerse() {
  displayVerse(currentVerse + 1);
}

function prevVerse() {
  displayVerse(currentVerse - 1);
}

function resetVerseTimer() {
  clearTimeout(verseTimer);
  verseTimer = setTimeout(() => nextVerse(), VERSE_DISPLAY_DURATION);
}

// Touch / swipe support
let touchStartX = 0;
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
  const t = e.changedTouches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
});

window.addEventListener('touchend', (e) => {
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
    dx < 0 ? nextVerse() : prevVerse();
  }
});

// Keyboard navigation
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') nextVerse();
  if (e.key === 'ArrowLeft') prevVerse();
});

if (!isWebGLSupported()) {
  // ----- Fallback (no WebGL) -----
  document.body.classList.add('no-webgl');
  loadingEl.classList.add('hidden');

  displayVerse(0); // show first verse immediately
} else {
  // ----- Three.js Setup -----
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.015);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Resize handling
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Create scrolling planes (sprites)
  const loader = new THREE.TextureLoader();

  const planes = [];
  const BOUNDS = 20; // world bounds for bouncing

  const totalImages = IMAGE_URLS.length;
  let loadedImages = 0;

  const markLoaded = () => {
    loadedImages += 1;
    if (loadedImages >= totalImages) {
      loadingEl.classList.add('hidden');
      // Start verse cycle when visuals ready
      displayVerse(0);
    }
  };

  IMAGE_URLS.forEach((url) => {
    loader.load(
      url,
      (tex) => {
        const geometry = new THREE.PlaneGeometry(5, 3); // 5x3 keeps ~16:9 aspect
        const material = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(
          THREE.MathUtils.randFloatSpread(BOUNDS),
          THREE.MathUtils.randFloatSpread(BOUNDS * 0.6),
          THREE.MathUtils.randFloat(-50, -10)
        );

        mesh.userData.velocity = new THREE.Vector3(
          THREE.MathUtils.randFloat(0.02, 0.04) * (Math.random() < 0.5 ? 1 : -1),
          THREE.MathUtils.randFloat(0.02, 0.04) * (Math.random() < 0.5 ? 1 : -1),
          0
        );

        planes.push(mesh);
        scene.add(mesh);
        markLoaded();
      },
      undefined,
      () => {
        // Error handler: use placeholder plane
        const geometry = new THREE.PlaneGeometry(5, 3);
        const material = new THREE.MeshBasicMaterial({ color: 0x444444, opacity: 0.6, transparent: true });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          THREE.MathUtils.randFloatSpread(BOUNDS),
          THREE.MathUtils.randFloatSpread(BOUNDS * 0.6),
          THREE.MathUtils.randFloat(-50, -10)
        );
        mesh.userData.velocity = new THREE.Vector3(
          THREE.MathUtils.randFloat(0.02, 0.04) * (Math.random() < 0.5 ? 1 : -1),
          THREE.MathUtils.randFloat(0.02, 0.04) * (Math.random() < 0.5 ? 1 : -1),
          0
        );
        planes.push(mesh);
        scene.add(mesh);
        markLoaded();
      }
    );
  });

  // ----- Animation loop -----
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // Update plane positions
    planes.forEach((plane) => {
      const v = plane.userData.velocity;
      plane.position.addScaledVector(v, delta * 60);

      if (plane.position.x > BOUNDS || plane.position.x < -BOUNDS) v.x = -v.x;
      if (plane.position.y > BOUNDS * 0.6 || plane.position.y < -BOUNDS * 0.6) v.y = -v.y;

      plane.lookAt(camera.position);
    });

    camera.position.z -= delta * 0.5;
    if (camera.position.z < 1) camera.position.z = 5;

    renderer.render(scene, camera);
  }

  animate();
}