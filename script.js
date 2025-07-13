class PsalmScreensaver {
    constructor() {
        this.scrollContainer = document.querySelector('.scroll-container');
        this.touchIndicator = document.querySelector('.touch-indicator');
        this.verses = document.querySelectorAll('.verse');
        this.particles = document.querySelectorAll('.particle');
        this.backgroundLayers = document.querySelectorAll('.background-layer');
        this.scrollProgress = document.querySelector('.scroll-progress');
        this.scrollBar = document.querySelector('.scroll-bar');
        
        this.isAutoScrolling = false;
        this.autoScrollSpeed = 2.0;
        this.lastScrollTime = 0;
        this.animationFrame = null;
        this.touchStartY = 0;
        this.lastTouchY = 0;
        this.velocityY = 0;
        this.isUserInteracting = false;
        this.interactionTimeout = null;
        this.hasStartedScrolling = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.initParticleSystem();
        this.setupPerformanceOptimizations();
        this.preventZoom();
        
        // Start auto-scroll after a brief delay to ensure everything is loaded
        setTimeout(() => {
            this.debugScrollSetup();
            this.startAutoScroll();
        }, 1000);
    }
    
    setupEventListeners() {
        // Scroll events
        this.scrollContainer.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
        
        // Touch events for mobile Safari - simplified approach
        this.scrollContainer.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        this.scrollContainer.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        
        // Mouse events for desktop testing
        this.scrollContainer.addEventListener('mousedown', this.handleTouchStart.bind(this));
        this.scrollContainer.addEventListener('mouseup', this.handleTouchEnd.bind(this));
        
        // Visibility change to restart screensaver
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        // Orientation change
        window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
        
        // Resize
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
        
        // Debug buttons
        document.getElementById('scroll-test-btn').addEventListener('click', () => {
            console.log('Manual scroll test - scrolling to 300px');
            this.scrollContainer.scrollTop = 300;
            this.updateBackgroundLayers();
            this.updateScrollProgress();
        });
        
        document.getElementById('reset-btn').addEventListener('click', () => {
            console.log('Reset button clicked');
            this.restartExperience();
        });
    }
    
    setupIntersectionObserver() {
        const options = {
            root: this.scrollContainer,
            rootMargin: '0px',
            threshold: [0.1, 0.5, 0.9]
        };
        
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), options);
        
        this.verses.forEach(verse => {
            this.observer.observe(verse);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const verse = entry.target;
                const ratio = entry.intersectionRatio;
                
                if (ratio > 0.5) {
                    verse.classList.add('fully-visible');
                    this.animateHighlights(verse);
                } else {
                    verse.classList.remove('fully-visible');
                }
                
                // Parallax effect based on scroll position
                this.updateParallaxEffect(verse, ratio);
            }
        });
    }
    
    animateHighlights(verse) {
        const highlights = verse.querySelectorAll('.highlight');
        highlights.forEach((highlight, index) => {
            setTimeout(() => {
                highlight.style.animation = 'highlightPulse 2s ease-in-out infinite';
            }, index * 200);
        });
    }
    
    updateParallaxEffect(verse, ratio) {
        const translateY = (1 - ratio) * 20;
        verse.style.transform = `translate3d(0, ${translateY}px, 0)`;
    }
    
    handleTouchStart(e) {
        console.log('Touch started - stopping auto-scroll');
        this.isUserInteracting = true;
        this.stopAutoScroll();
        
        // Hide touch indicator
        this.touchIndicator.style.opacity = '0';
        
        // Clear interaction timeout
        if (this.interactionTimeout) {
            clearTimeout(this.interactionTimeout);
        }
    }
    
    handleTouchEnd(e) {
        console.log('Touch ended - will resume auto-scroll in 2 seconds');
        
        // Resume auto-scroll after interaction timeout
        this.interactionTimeout = setTimeout(() => {
            console.log('Resuming auto-scroll after user interaction');
            this.isUserInteracting = false;
            this.startAutoScroll();
        }, 2000);
    }
    

    
    handleScroll() {
        this.updateBackgroundLayers();
        this.updateScrollProgress();
        
        // Check if we've reached the end
        const scrollTop = this.scrollContainer.scrollTop;
        const scrollHeight = this.scrollContainer.scrollHeight;
        const clientHeight = this.scrollContainer.clientHeight;
        
        if (scrollTop + clientHeight >= scrollHeight - 50) {
            setTimeout(() => {
                this.restartExperience();
            }, 2000);
        }
    }
    
    updateScrollProgress() {
        const scrollTop = this.scrollContainer.scrollTop;
        const scrollHeight = this.scrollContainer.scrollHeight;
        const clientHeight = this.scrollContainer.clientHeight;
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        
        this.scrollBar.style.height = `${Math.min(progress, 100)}%`;
        
        // Show progress indicator when scrolling
        if (scrollTop > 50) {
            this.scrollProgress.classList.add('visible');
        } else {
            this.scrollProgress.classList.remove('visible');
        }
    }
    
    updateBackgroundLayers() {
        const scrollTop = this.scrollContainer.scrollTop;
        const scrollHeight = this.scrollContainer.scrollHeight;
        const progress = scrollTop / (scrollHeight - window.innerHeight);
        
        this.backgroundLayers.forEach((layer, index) => {
            const speed = (index + 1) * 0.3;
            const translateY = -scrollTop * speed;
            const scale = 1 + (progress * 0.1);
            
            layer.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
        });
    }
    
    debugScrollSetup() {
        console.log('=== SCROLL DEBUG INFO ===');
        console.log('Container height:', this.scrollContainer.clientHeight);
        console.log('Content height:', this.scrollContainer.scrollHeight);
        console.log('Scrollable height:', this.scrollContainer.scrollHeight - this.scrollContainer.clientHeight);
        console.log('Overflow Y:', getComputedStyle(this.scrollContainer).overflowY);
        console.log('Verses found:', this.verses.length);
        
        // Test scroll manually
        setTimeout(() => {
            console.log('Testing manual scroll...');
            this.scrollContainer.scrollTop = 100;
            console.log('Scroll position after test:', this.scrollContainer.scrollTop);
        }, 500);
    }
    
    startAutoScroll() {
        if (this.isAutoScrolling || this.isUserInteracting) return;
        
        console.log('Starting auto-scroll...');
        this.isAutoScrolling = true;
        this.hasStartedScrolling = true;
        
        const autoScroll = () => {
            if (!this.isAutoScrolling || this.isUserInteracting) return;
            
            const currentScroll = this.scrollContainer.scrollTop;
            const maxScroll = this.scrollContainer.scrollHeight - this.scrollContainer.clientHeight;
            
            if (currentScroll >= maxScroll) {
                console.log('Reached end, restarting...');
                setTimeout(() => this.restartExperience(), 2000);
                return;
            }
            
            this.scrollContainer.scrollTop += this.autoScrollSpeed;
            this.updateBackgroundLayers();
            this.updateScrollProgress();
            
            this.animationFrame = requestAnimationFrame(autoScroll);
        };
        
        this.animationFrame = requestAnimationFrame(autoScroll);
    }
    
    stopAutoScroll() {
        this.isAutoScrolling = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
    
    restartExperience() {
        // Fade out
        document.body.style.transition = 'opacity 1s ease-out';
        document.body.style.opacity = '0';
        
        setTimeout(() => {
            // Reset scroll position
            this.scrollContainer.scrollTop = 0;
            
            // Reset verse animations
            this.verses.forEach(verse => {
                verse.style.animation = 'none';
                verse.offsetHeight; // Force reflow
                verse.style.animation = '';
            });
            
            // Fade back in
            document.body.style.opacity = '1';
            
            // Restart auto-scroll
            setTimeout(() => {
                this.startAutoScroll();
            }, 1000);
        }, 1000);
    }
    
    initParticleSystem() {
        // Add dynamic particles
        const particleContainer = document.querySelector('.particles');
        
        setInterval(() => {
            if (document.querySelectorAll('.particle').length < 12) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDuration = (20 + Math.random() * 15) + 's';
                particle.style.animationDelay = '0s';
                
                particleContainer.appendChild(particle);
                
                // Remove particle after animation
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 35000);
            }
        }, 2000);
    }
    
    setupPerformanceOptimizations() {
        // Use will-change for animated elements
        this.backgroundLayers.forEach(layer => {
            layer.style.willChange = 'transform';
        });
        
        this.verses.forEach(verse => {
            verse.style.willChange = 'transform, opacity';
        });
        
        // Optimize scroll container
        this.scrollContainer.style.willChange = 'scroll-position';
        
        // Allow wheel events for desktop scrolling
        this.scrollContainer.addEventListener('wheel', (e) => {
            // Stop auto-scroll when user scrolls with wheel
            if (!this.isUserInteracting) {
                this.handleTouchStart(e);
                setTimeout(() => this.handleTouchEnd(e), 100);
            }
        }, { passive: true });
    }
    
    preventZoom() {
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Prevent pinch zoom
        document.addEventListener('gesturestart', (e) => {
            e.preventDefault();
        });
        
        document.addEventListener('gesturechange', (e) => {
            e.preventDefault();
        });
        
        document.addEventListener('gestureend', (e) => {
            e.preventDefault();
        });
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            this.stopAutoScroll();
        } else {
            setTimeout(() => {
                if (!this.isUserInteracting) {
                    this.startAutoScroll();
                }
            }, 1000);
        }
    }
    
    handleOrientationChange() {
        setTimeout(() => {
            this.updateBackgroundLayers();
            
            // Recalculate positions
            this.verses.forEach(verse => {
                verse.style.transform = '';
            });
        }, 100);
    }
    
    handleResize() {
        this.updateBackgroundLayers();
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PsalmScreensaver();
});

// Handle page visibility for better performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when tab becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

// Add viewport height fix for mobile Safari
function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setViewportHeight();
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);

// Add custom CSS property for true viewport height
const style = document.createElement('style');
style.textContent = `
    .screensaver-container {
        height: calc(var(--vh, 1vh) * 100);
    }
    
    .scroll-container {
        height: calc(var(--vh, 1vh) * 100);
    }
`;
document.head.appendChild(style);