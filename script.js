gsap.registerPlugin(ScrollTrigger);

// Loop through each "panel" section and create animations
Array.from(document.querySelectorAll('.panel')).forEach(panel => {
  const bg = panel.querySelector('.bg');
  const verse = panel.querySelector('.verse');

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
});

// Optional: add momentum/smooth scroll on desktop for a silkier feel
// (mobile browsers already have good native momentum scrolling)
if(window.matchMedia('(pointer:fine)').matches){
  document.body.style.scrollBehavior = 'smooth';
}