// Psalm 23 2.5D Scrolling Screensaver
class PsalmScreensaver {
    constructor() {
        this.container = document.querySelector('.parallax-container');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.speedBtn = document.getElementById('speedBtn');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        
        this.isPaused = false;
        this.currentSpeed = 1;
        this.speeds = [0.5, 1, 1.5, 2];
        this.speedIndex = 1;
        this.scrollPosition = 0;
        this.maxScroll = 200; // Percentage of container width to scroll
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.startScrolling();
        this.setupMobileOptimizations();
    }
    
    setupEventListeners() {
        // Control buttons
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.speedBtn.addEventListener('click', () => this.changeSpeed());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        // Touch events for mobile
        let touchStartX = 0;
        let touchStartY = 0;
        let isScrolling = false;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            isScrolling = false;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (!isScrolling) {
                const touchX = e.touches[0].clientX;
                const touchY = e.touches[0].clientY;
                const deltaX = Math.abs(touchX - touchStartX);
                const deltaY = Math.abs(touchY - touchStartY);
                
                if (deltaX > deltaY && deltaX > 10) {
                    isScrolling = true;
                    e.preventDefault();
                }
            }
        }, { passive: false });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    this.togglePause();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.changeSpeed();
                    break;
                case 'f':
                case 'F':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
            }
        });
        
        // Visibility change handling
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
        
        // Window resize handling
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Prevent context menu on long press
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    setupMobileOptimizations() {
        // Disable zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Prevent pull-to-refresh
        document.body.style.overscrollBehavior = 'none';
        
        // Optimize for mobile performance
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {
                // Service worker registration failed, continue without it
            });
        }
    }
    
    startScrolling() {
        const animate = () => {
            if (!this.isPaused) {
                this.scrollPosition += 0.02 * this.currentSpeed;
                
                if (this.scrollPosition >= this.maxScroll) {
                    this.scrollPosition = 0;
                }
                
                const translateX = -(this.scrollPosition / 100) * (this.container.offsetWidth - window.innerWidth);
                this.container.style.transform = `translateX(${translateX}px)`;
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        this.pauseBtn.textContent = this.isPaused ? '▶' : '⏸';
        
        // Add visual feedback
        this.pauseBtn.style.background = this.isPaused ? 
            'rgba(255, 193, 7, 0.9)' : 'rgba(255, 255, 255, 0.9)';
        
        // Show/hide text overlay based on pause state
        const textOverlay = document.querySelector('.text-overlay');
        if (this.isPaused) {
            textOverlay.style.opacity = '1';
            textOverlay.style.pointerEvents = 'auto';
        } else {
            textOverlay.style.opacity = '0.7';
            textOverlay.style.pointerEvents = 'none';
        }
    }
    
    pause() {
        if (!this.isPaused) {
            this.togglePause();
        }
    }
    
    resume() {
        if (this.isPaused) {
            this.togglePause();
        }
    }
    
    changeSpeed() {
        this.speedIndex = (this.speedIndex + 1) % this.speeds.length;
        this.currentSpeed = this.speeds[this.speedIndex];
        
        // Update speed button text
        const speedSymbols = ['🐌', '⚡', '🚀', '💨'];
        this.speedBtn.textContent = speedSymbols[this.speedIndex];
        
        // Add visual feedback
        this.speedBtn.style.background = 'rgba(76, 175, 80, 0.9)';
        setTimeout(() => {
            this.speedBtn.style.background = 'rgba(255, 255, 255, 0.9)';
        }, 300);
    }
    
    async toggleFullscreen() {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
                this.fullscreenBtn.textContent = '⛶';
            } else {
                await document.exitFullscreen();
                this.fullscreenBtn.textContent = '⛶';
            }
        } catch (err) {
            console.log('Fullscreen not supported');
        }
    }
    
    handleResize() {
        // Recalculate scroll limits on resize
        this.maxScroll = Math.max(200, (this.container.offsetWidth - window.innerWidth) / this.container.offsetWidth * 100);
    }
}

// Enhanced visual effects
class VisualEffects {
    constructor() {
        this.setupParticleEffects();
        this.setupLightingEffects();
    }
    
    setupParticleEffects() {
        // Add floating particles for atmosphere
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 6;
        `;
        
        document.querySelector('.screensaver-container').appendChild(particlesContainer);
        
        // Create particles
        for (let i = 0; i < 20; i++) {
            this.createParticle(particlesContainer);
        }
    }
    
    createParticle(container) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            pointer-events: none;
        `;
        
        // Random position and animation
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const duration = 10 + Math.random() * 20;
        const delay = Math.random() * 10;
        
        particle.style.left = startX + '%';
        particle.style.top = startY + '%';
        particle.style.animation = `particleFloat ${duration}s linear infinite ${delay}s`;
        
        container.appendChild(particle);
    }
    
    setupLightingEffects() {
        // Add dynamic lighting based on time
        const lightingOverlay = document.createElement('div');
        lightingOverlay.className = 'lighting-overlay';
        lightingOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 7;
            background: radial-gradient(circle at 70% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%);
            animation: lightingChange 30s ease-in-out infinite;
        `;
        
        document.querySelector('.screensaver-container').appendChild(lightingOverlay);
    }
}

// Add CSS animations for particles and lighting
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0;
        }
    }
    
    @keyframes lightingChange {
        0%, 100% {
            background: radial-gradient(circle at 70% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%);
        }
        50% {
            background: radial-gradient(circle at 70% 20%, rgba(255, 215, 0, 0.2) 0%, transparent 50%);
        }
    }
    
    .psalm-container {
        animation: textGlow 4s ease-in-out infinite alternate;
    }
    
    @keyframes textGlow {
        0% {
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        100% {
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 0 20px rgba(255, 255, 255, 0.3);
        }
    }
`;
document.head.appendChild(style);

// Initialize the screensaver when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PsalmScreensaver();
    new VisualEffects();
    
    // Add loading animation
    const container = document.querySelector('.screensaver-container');
    container.style.opacity = '0';
    container.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        container.style.transition = 'all 1s ease-out';
        container.style.opacity = '1';
        container.style.transform = 'scale(1)';
    }, 100);
});

// Performance optimizations
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Preload any additional resources here
    });
}

// Handle orientation change
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
});