gsap.registerPlugin(ScrollTrigger);

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