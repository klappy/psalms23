if(typeof gsap!=='undefined' && typeof ScrollTrigger!=='undefined'){
  gsap.registerPlugin(ScrollTrigger);
}
// ----------------- Feature detection -----------------
const WEBGL_AVAILABLE = (()=>{
  try{ const c=document.createElement('canvas'); return !!window.WebGLRenderingContext && (c.getContext('webgl')||c.getContext('experimental-webgl')); }catch(e){ return false; }})();
if(!WEBGL_AVAILABLE){ document.documentElement.classList.add('no-webgl'); }

let ANIM_ENABLED = (typeof gsap!=='undefined' && typeof ScrollTrigger!=='undefined');
if(!ANIM_ENABLED){
  console.warn('GSAP/ScrollTrigger not available – running in static fallback mode.');
}

console.log('--- Library status on script.js init ---');
console.log('gsap present:', typeof gsap !== 'undefined');
console.log('ScrollTrigger present:', typeof ScrollTrigger !== 'undefined');
console.log('THREE present:', typeof THREE !== 'undefined');

if(ANIM_ENABLED){
  console.log('GSAP + ScrollTrigger detected – animations enabled');
  // Original GSAP animation setup wrapped

  // Loop through each "panel" section and create animations
  Array.from(document.querySelectorAll('.panel')).forEach(panel => {
    const bg = panel.querySelector('.bg');
    const verse = panel.querySelector('.verse');
    const audio = panel.querySelector('.ambient-audio');

    // Background parallax (scale in as user scrolls)
    gsap.fromTo(bg,
      {scale:1.4},
      {
        scale:1,
        ease:'none',
        scrollTrigger:{
          trigger:panel,
          start:'top bottom',
          end:'bottom top',
          scrub:true
        }
      }
    );

    // Verse fade & rise (visible by default, animate only when ScrollTrigger fires)
    gsap.from(verse,
      {
        autoAlpha:0,
        y:50,
        ease:'power1.out',
        immediateRender:false, // keep verse visible until animation actually starts
        scrollTrigger:{
          trigger:panel,
          start:'top 80%',
          toggleActions:'play none none reverse'
        }
      }
    );

    // Ambient audio volume control tied to scroll
    if(audio){
      audio.volume = 0;
      audio.play().catch(()=>{});

      ScrollTrigger.create({
        trigger: panel,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => gsap.to(audio,{volume:1,duration:2,ease:'none',overwrite:true}),
        onEnterBack: () => gsap.to(audio,{volume:1,duration:2,ease:'none',overwrite:true}),
        onLeave: () => gsap.to(audio,{volume:0,duration:2,ease:'none',overwrite:true}),
        onLeaveBack: () => gsap.to(audio,{volume:0,duration:2,ease:'none',overwrite:true})
      });
    }

    // Touch / mouse interaction: gentle verse pulse
    verse.addEventListener('pointerdown', () => {
      gsap.fromTo(verse,{scale:1},{scale:1.06,duration:0.2,yoyo:true,repeat:1});
    });
  });

  // Unlock audio handler remains same (it's independent)

  // ----------------- Verse 2 – Water Particles -----------------
  function initWaterParticles(){
    if(!WEBGL_AVAILABLE) return;
    const canvas = document.getElementById('threeVerse2');
    if(!canvas || !canvas.getContext) return;
    if(typeof THREE==='undefined') return;

    const renderer = createRenderer(canvas);
    const camera = createCamera(canvas);
    const scene = new THREE.Scene();

    // create small blue-ish particles moving upward like sparkles on water
    const count = 800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count*3);
    for(let i=0;i<count;i++){
      positions[i*3] = (Math.random()-0.5)*3; // x
      positions[i*3+1] = Math.random()*2;      // y
      positions[i*3+2] = (Math.random()-0.5)*3; // z
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions,3));
    const material = new THREE.PointsMaterial({color:0x66ccff,size:0.02,transparent:true,opacity:0.7});
    const points = new THREE.Points(geometry,material);
    scene.add(points);

    threeSetups.push({renderer,camera});

    gsap.ticker.add(()=>{
      points.rotation.y += 0.002;
      renderer.render(scene,camera);
    });
  }

  // ----------------- Verse 6 – Star Field -----------------
  function initStarField(){
    if(!WEBGL_AVAILABLE) return;
    const canvas = document.getElementById('threeVerse6');
    if(!canvas || !canvas.getContext) return;
    if(typeof THREE==='undefined') return;

    const renderer = createRenderer(canvas);
    const camera = createCamera(canvas);
    const scene = new THREE.Scene();

    const count = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count*3);
    for(let i=0;i<count;i++){
      positions[i*3] = (Math.random()-0.5)*6;
      positions[i*3+1] = (Math.random()-0.5)*6;
      positions[i*3+2] = (Math.random()-0.5)*6;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions,3));
    const material = new THREE.PointsMaterial({color:0xffffff,size:0.03,transparent:true,opacity:0.9});
    const stars = new THREE.Points(geometry,material);
    scene.add(stars);

    threeSetups.push({renderer,camera});

    gsap.ticker.add(()=>{
      stars.rotation.y += 0.0008;
      stars.rotation.x += 0.0005;
      renderer.render(scene,camera);
    });
  }

  ScrollTrigger.create({
    trigger:'#verse2',
    start:'top 80%',
    once:true,
    onEnter:initWaterParticles
  });

  ScrollTrigger.create({
    trigger:'#verse6',
    start:'top 80%',
    once:true,
    onEnter:initStarField
  });
}

// If ANIM_ENABLED false, basic interaction: allow verse text tap to focus
if(!ANIM_ENABLED){
  console.log('Animations disabled – running static fallback');
  document.querySelectorAll('.verse').forEach(v=>{
    v.addEventListener('pointerdown',()=>{
      v.classList.toggle('highlight');
    });
    v.style.opacity = 1;
    v.style.visibility = 'visible';
  });
}

// Unlock audio on first touch/click (required by mobile browsers)
function unlockAudio(){
  document.querySelectorAll('.ambient-audio').forEach(a=>{
    a.muted=false;
    a.play().catch(()=>{});
  });
  window.removeEventListener('touchstart', unlockAudio);
  window.removeEventListener('click', unlockAudio);
}
window.addEventListener('touchstart', unlockAudio, {once:true});
window.addEventListener('click', unlockAudio, {once:true});

// Optional: add momentum/smooth scroll on desktop for a silkier feel
// (mobile browsers already have good native momentum scrolling)
if(window.matchMedia('(pointer:fine)').matches){
  document.body.style.scrollBehavior = 'smooth';
}

// ----------------- Loader Handling -----------------
// Add at very top of file
// ----------------- Loader helper & global error handling -----------------
function hideLoader(){
  const l=document.getElementById('loader');
  if(l) l.classList.add('hidden');
}

function showAllVerses(){
  document.querySelectorAll('.verse').forEach(v=>{
    v.style.opacity = 1;
    v.style.visibility = 'visible';
  });
}

// Log JS errors and ensure loader disappears
window.addEventListener('error', (e)=>{
  console.error('Global JS error:', e.message, e.filename, e.lineno);
  showAllVerses();
  hideLoader();
});

const loaderEl=document.getElementById('loader');
// Hide shortly after DOM ready (don’t wait for slow external media)
document.addEventListener('DOMContentLoaded',()=>{
  setTimeout(hideLoader,1200);
});

// Ensure it also hides once full page finished
window.addEventListener('load', hideLoader);

// Fallback after 10 s – let user dismiss manually
setTimeout(()=>{
  if(loaderEl && !loaderEl.classList.contains('hidden')){
    loaderEl.classList.add('interactive');
    const progress=loaderEl.querySelector('.progress');
    if(progress) progress.textContent='Still loading… tap to continue';
    loaderEl.addEventListener('click', hideLoader, {once:true});
  }
}, 10000);

// Check for missing third-party libs after 3 s
setTimeout(()=>{
  const missing=[];
  if(typeof gsap==='undefined') missing.push('GSAP');
  if(typeof ScrollTrigger==='undefined') missing.push('ScrollTrigger');
  if(typeof THREE==='undefined') missing.push('Three.js');
  if(missing.length){
    console.warn('Some libraries failed to load:', missing.join(', '));
    showAllVerses();
    hideLoader();
  }
}, 3000);

// ----------------- Three.js Helpers -----------------
function createRenderer(canvas){
  const renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5)); // balance quality vs perf
  renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);
  return renderer;
}

function createCamera(canvas){
  const fov = 60;
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 100);
  camera.position.z = 2.5;
  return camera;
}

// Resize handler for any renderer/camera pairs stored
const threeSetups = [];
function onResize(){
  threeSetups.forEach(({renderer,camera})=>{
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if(canvas.width !== width || canvas.height !== height){
      renderer.setSize(width,height,false);
      camera.aspect = width/height;
      camera.updateProjectionMatrix();
    }
  });
}
window.addEventListener('resize', onResize);

// ----------------- Device Tilt Parallax -----------------
// Simple clamp helper (avoids relying on THREE for math)
const clamp = (val,min,max)=>Math.max(min,Math.min(max,val));

if(window.DeviceOrientationEvent){
  window.addEventListener('deviceorientation', (e)=>{
    const beta = e.beta || 0;   // front-back
    const gamma = e.gamma || 0; // left-right
    const maxTilt = 15;         // degrees considered “full tilt”
    const xNorm = clamp(gamma/maxTilt,-1,1);
    const yNorm = clamp(beta /maxTilt,-1,1);

    document.querySelectorAll('.verse').forEach(v=>{
      v.style.transform = `rotateX(${-yNorm*3}deg) rotateY(${xNorm*3}deg)`;
    });
  });
}

// ----------------- Keyboard Navigation -----------------
const panels = Array.from(document.querySelectorAll('.panel'));
function scrollToPanel(index){
  if(index>=0 && index<panels.length){ panels[index].scrollIntoView({behavior:'smooth'}); }
}
window.addEventListener('keydown',(e)=>{
  switch(e.key){
    case 'ArrowDown':
    case 'PageDown':
    case ' ': // space
      e.preventDefault();
      scrollToPanel(findCurrentIndex()+1);
      break;
    case 'ArrowUp':
    case 'PageUp':
      e.preventDefault();
      scrollToPanel(findCurrentIndex()-1);
      break;
  }
});

function findCurrentIndex(){
  const threshold=window.innerHeight*0.4;
  return panels.findIndex(p=>{
    const rect=p.getBoundingClientRect();
    return rect.top<=threshold && rect.bottom>=threshold;});
}