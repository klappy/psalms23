gsap.registerPlugin(ScrollTrigger);
// ----------------- Feature detection -----------------
const WEBGL_AVAILABLE = (()=>{
  try{ const c=document.createElement('canvas'); return !!window.WebGLRenderingContext && (c.getContext('webgl')||c.getContext('experimental-webgl')); }catch(e){ return false; }})();
if(!WEBGL_AVAILABLE){ document.documentElement.classList.add('no-webgl'); }

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
        start:'top bottom', // when top of panel hits bottom of viewport
        end:'bottom top',   // when bottom of panel hits top of viewport
        scrub:true
      }
    }
  );

  // Verse fade & rise
  gsap.fromTo(verse,
    {autoAlpha:0, y:50},
    {
      autoAlpha:1,
      y:0,
      ease:'power1.out',
      scrollTrigger:{
        trigger:panel,
        start:'top center',
        end:'center center',
        scrub:true
      }
    }
  );

  // Ambient audio volume control tied to scroll
  if(audio){
    audio.volume = 0;
    // Attempt to start playback (muted) so we can fade later
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
window.addEventListener('load', () => {
  // Fake little delay to show loader for slower connections
  setTimeout(()=>{
    document.getElementById('loader').classList.add('hidden');
  }, 800);
});

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

// ----------------- Verse 2 – Water Particles -----------------
function initWaterParticles(){
  if(!WEBGL_AVAILABLE) return;
  const canvas = document.getElementById('threeVerse2');
  if(!canvas || !canvas.getContext) return;

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

// ----------------- Device Tilt Parallax -----------------
if(window.DeviceOrientationEvent){
  window.addEventListener('deviceorientation', (e)=>{
    const beta = e.beta || 0; // x tilt
    const gamma = e.gamma || 0; // y tilt
    const maxTilt = 15; // degrees
    const xNorm = THREE.MathUtils.clamp(gamma/maxTilt,-1,1);
    const yNorm = THREE.MathUtils.clamp(beta/maxTilt,-1,1);

    // rotate all verse texts subtly
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