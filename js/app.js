/**
 * Main Application for Immersive Psalm 23 Experience
 * Orchestrates all systems and manages the overall user experience
 */

class Psalm23App {
    constructor() {
        this.isInitialized = false;
        this.isPlaying = false;
        this.autoAdvanceEnabled = true;
        this.autoAdvanceTimer = null;
        this.autoAdvanceDelay = 15000; // 15 seconds per verse
        
        // Core systems
        this.sceneManager = null;
        this.audioManager = null;
        this.effectsManager = null;
        this.gestureDetector = null;
        this.performanceMonitor = null;
        
        // UI elements
        this.elements = {};
        
        // Settings
        this.settings = {
            audio: true,
            autoAdvance: true,
            particles: true,
            effects: true,
            quality: 'auto'
        };
        
        // Initialize the application
        this.initialize();
    }

    async initialize() {
        try {
            // Show loading screen
            this.showLoadingScreen();
            
            // Load settings from storage
            this.loadSettings();
            
            // Check WebGL support
            if (!this.checkWebGLSupport()) {
                throw new Error('WebGL not supported');
            }
            
            // Initialize core systems
            await this.initializeSystems();
            
            // Setup UI
            this.setupUI();
            
            // Setup gesture detection
            this.setupGestureDetection();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Setup keyboard controls
            this.setupKeyboardControls();
            
            // Start the experience
            this.startExperience();
            
            this.isInitialized = true;
            console.log('Psalm 23 Experience initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize Psalm 23 Experience:', error);
            this.handleError(error);
        }
    }

    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return !!gl;
        } catch (e) {
            return false;
        }
    }

    handleError(error) {
        console.error('App error:', error);
        
        // Hide loading screen
        this.hideLoadingScreen();
        
        // Switch to fallback mode
        document.getElementById('scene-container').style.display = 'none';
        document.getElementById('fallback-container').style.display = 'block';
        
        // Initialize fallback app
        window.fallbackApp = new FallbackApp();
    }

    async initializeSystems() {
        // Initialize audio system
        this.audioManager = new AudioManager();
        window.audioManager = this.audioManager;
        
        // Initialize scene manager
        this.sceneManager = new SceneManager();
        
        // Initialize effects manager
        this.effectsManager = new EffectsManager(
            this.sceneManager.renderer,
            this.sceneManager.currentScene?.scene,
            this.sceneManager.camera
        );
        
        // Wait for audio context to be ready
        await this.audioManager.initializeAudio();
        
        // Apply initial settings
        this.applySettings();
    }

    setupUI() {
        // Get UI elements
        this.elements = {
            loadingScreen: document.getElementById('loading-screen'),
            prevBtn: document.getElementById('prev-btn'),
            nextBtn: document.getElementById('next-btn'),
            settingsBtn: document.getElementById('settings-btn'),
            settingsPanel: document.getElementById('settings-panel'),
            audioToggle: document.getElementById('audio-toggle'),
            autoAdvanceToggle: document.getElementById('auto-advance'),
            particlesToggle: document.getElementById('particles-toggle'),
            gestureArea: document.getElementById('gesture-area'),
            verseContent: document.querySelector('.verse-content')
        };
        
        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Navigation buttons
        this.elements.prevBtn.addEventListener('click', () => {
            this.previousVerse();
        });
        
        this.elements.nextBtn.addEventListener('click', () => {
            this.nextVerse();
        });
        
        // Settings
        this.elements.settingsBtn.addEventListener('click', () => {
            this.toggleSettings();
        });
        
        // Setting toggles
        this.elements.audioToggle.addEventListener('change', (e) => {
            this.settings.audio = e.target.checked;
            this.audioManager.toggle();
            this.saveSettings();
        });
        
        this.elements.autoAdvanceToggle.addEventListener('change', (e) => {
            this.settings.autoAdvance = e.target.checked;
            this.autoAdvanceEnabled = e.target.checked;
            this.saveSettings();
            
            if (this.autoAdvanceEnabled) {
                this.startAutoAdvance();
            } else {
                this.stopAutoAdvance();
            }
        });
        
        this.elements.particlesToggle.addEventListener('change', (e) => {
            this.settings.particles = e.target.checked;
            this.saveSettings();
            // Restart current scene to apply particle settings
            this.sceneManager.loadScene(this.sceneManager.currentSceneIndex);
        });
        
        // Close settings when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.elements.settingsPanel.contains(e.target) && 
                !this.elements.settingsBtn.contains(e.target)) {
                this.elements.settingsPanel.classList.remove('open');
            }
        });
        
        // Verse content interaction
        this.elements.verseContent.addEventListener('click', () => {
            this.nextVerse();
        });
        
        // Handle visibility change (pause/resume)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
        
        // Handle resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    setupGestureDetection() {
        this.gestureDetector = Utils.createGestureDetector(this.elements.gestureArea);
        
        this.gestureDetector.onSwipeLeft = () => {
            this.nextVerse();
        };
        
        this.gestureDetector.onSwipeRight = () => {
            this.previousVerse();
        };
        
        this.gestureDetector.onSwipeUp = () => {
            this.toggleSettings();
        };
        
        this.gestureDetector.onTap = () => {
            this.nextVerse();
        };
        
        this.gestureDetector.onLongPress = () => {
            this.toggleAutoAdvance();
        };
    }

    setupPerformanceMonitoring() {
        this.performanceMonitor = Utils.createPerformanceMonitor();
        
        // Monitor performance and adjust quality if needed
        setInterval(() => {
            const fps = this.performanceMonitor.update();
            
            if (fps < 30 && this.settings.quality === 'auto') {
                this.adjustQuality('low');
            } else if (fps > 50 && this.settings.quality === 'low') {
                this.adjustQuality('high');
            }
        }, 2000);
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.previousVerse();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                    e.preventDefault();
                    this.nextVerse();
                    break;
                case 'Escape':
                    this.toggleSettings();
                    break;
                case 'm':
                case 'M':
                    this.toggleAudio();
                    break;
                case 'a':
                case 'A':
                    this.toggleAutoAdvance();
                    break;
                case 'f':
                case 'F':
                    this.toggleFullscreen();
                    break;
            }
        });
    }

    startExperience() {
        // Hide loading screen
        this.hideLoadingScreen();
        
        // Start animation loop
        this.animate();
        
        // Start auto-advance if enabled
        if (this.autoAdvanceEnabled) {
            this.startAutoAdvance();
        }
        
        // Resume audio context (required for mobile)
        this.audioManager.resume();
        
        this.isPlaying = true;
    }

    animate() {
        if (!this.isInitialized) return;
        
        requestAnimationFrame(() => this.animate());
        
        const time = this.sceneManager.clock.getElapsedTime();
        
        // Update scene manager
        this.sceneManager.animate();
        
        // Update effects
        if (this.effectsManager) {
            this.effectsManager.update(time);
        }
        
        // Update performance monitor
        this.performanceMonitor.update();
    }

    // Navigation methods
    nextVerse() {
        if (this.sceneManager.currentSceneIndex < this.sceneManager.scenes.length - 1) {
            this.transitionToVerse(this.sceneManager.currentSceneIndex + 1);
        }
        this.restartAutoAdvance();
    }

    previousVerse() {
        if (this.sceneManager.currentSceneIndex > 0) {
            this.transitionToVerse(this.sceneManager.currentSceneIndex - 1);
        }
        this.restartAutoAdvance();
    }

    async transitionToVerse(index) {
        if (index < 0 || index >= this.sceneManager.scenes.length) return;
        
        // Create transition effect
        const transitionTypes = ['fade', 'slide', 'circle'];
        const transitionType = Utils.randomChoice(transitionTypes);
        
        try {
            // Start transition
            switch (transitionType) {
                case 'fade':
                    await this.effectsManager.createFadeTransition(800);
                    break;
                case 'slide':
                    const direction = index > this.sceneManager.currentSceneIndex ? 'left' : 'right';
                    await this.effectsManager.createSlideTransition(direction, 1000);
                    break;
                case 'circle':
                    await this.effectsManager.createCircleTransition(1200);
                    break;
            }
            
            // Load new scene
            this.sceneManager.loadScene(index);
            
            // Apply scene effects
            if (this.settings.effects) {
                this.effectsManager.applySceneEffects(
                    this.sceneManager.currentScene.sceneType,
                    this.sceneManager.currentScene.scene
                );
            }
            
            // Update UI
            this.updateNavigationButtons();
            
        } catch (error) {
            console.error('Transition failed:', error);
            // Fallback to direct scene change
            this.sceneManager.loadScene(index);
        }
    }

    // Auto-advance functionality
    startAutoAdvance() {
        if (!this.autoAdvanceEnabled) return;
        
        this.autoAdvanceTimer = setTimeout(() => {
            this.nextVerse();
        }, this.autoAdvanceDelay);
    }

    stopAutoAdvance() {
        if (this.autoAdvanceTimer) {
            clearTimeout(this.autoAdvanceTimer);
            this.autoAdvanceTimer = null;
        }
    }

    restartAutoAdvance() {
        this.stopAutoAdvance();
        if (this.autoAdvanceEnabled) {
            this.startAutoAdvance();
        }
    }

    // Settings management
    toggleSettings() {
        this.elements.settingsPanel.classList.toggle('open');
    }

    toggleAudio() {
        this.settings.audio = !this.settings.audio;
        this.elements.audioToggle.checked = this.settings.audio;
        this.audioManager.toggle();
        this.saveSettings();
    }

    toggleAutoAdvance() {
        this.settings.autoAdvance = !this.settings.autoAdvance;
        this.elements.autoAdvanceToggle.checked = this.settings.autoAdvance;
        this.autoAdvanceEnabled = this.settings.autoAdvance;
        this.saveSettings();
        
        if (this.autoAdvanceEnabled) {
            this.startAutoAdvance();
        } else {
            this.stopAutoAdvance();
        }
    }

    toggleFullscreen() {
        if (Utils.supportsFullscreen()) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                document.documentElement.requestFullscreen();
            }
        }
    }

    applySettings() {
        // Apply audio settings
        if (this.settings.audio) {
            this.audioManager.setMasterVolume(0.7);
        } else {
            this.audioManager.setMasterVolume(0);
        }
        
        // Apply UI settings
        this.elements.audioToggle.checked = this.settings.audio;
        this.elements.autoAdvanceToggle.checked = this.settings.autoAdvance;
        this.elements.particlesToggle.checked = this.settings.particles;
        
        this.autoAdvanceEnabled = this.settings.autoAdvance;
    }

    adjustQuality(quality) {
        this.settings.quality = quality;
        
        if (this.sceneManager) {
            this.sceneManager.qualityLevel = quality;
            
            // Adjust renderer settings
            const renderer = this.sceneManager.renderer;
            if (quality === 'low') {
                renderer.setPixelRatio(1);
                renderer.shadowMap.enabled = false;
            } else {
                renderer.setPixelRatio(Utils.getDevicePixelRatio());
                renderer.shadowMap.enabled = true;
            }
        }
    }

    // UI updates
    updateNavigationButtons() {
        this.elements.prevBtn.disabled = this.sceneManager.currentSceneIndex === 0;
        this.elements.nextBtn.disabled = this.sceneManager.currentSceneIndex === this.sceneManager.scenes.length - 1;
    }

    showLoadingScreen() {
        this.elements.loadingScreen.classList.remove('hidden');
    }

    hideLoadingScreen() {
        this.elements.loadingScreen.classList.add('hidden');
    }

    showErrorMessage(message) {
        const errorOverlay = document.createElement('div');
        errorOverlay.className = 'error-overlay';
        errorOverlay.innerHTML = `
            <div class="error-content">
                <h2>Error</h2>
                <p>${message}</p>
                <button onclick="location.reload()">Reload</button>
            </div>
        `;
        
        // Add error styles
        errorOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            color: white;
            font-family: 'Inter', sans-serif;
        `;
        
        document.body.appendChild(errorOverlay);
    }

    // Lifecycle methods
    pause() {
        this.isPlaying = false;
        this.stopAutoAdvance();
        
        if (this.audioManager) {
            this.audioManager.setMasterVolume(0);
        }
    }

    resume() {
        if (!this.isInitialized) return;
        
        this.isPlaying = true;
        
        if (this.audioManager && this.settings.audio) {
            this.audioManager.setMasterVolume(0.7);
            this.audioManager.resume();
        }
        
        if (this.autoAdvanceEnabled) {
            this.startAutoAdvance();
        }
    }

    handleResize() {
        if (this.sceneManager) {
            this.sceneManager.handleResize();
        }
        
        if (this.effectsManager) {
            this.effectsManager.handleResize();
        }
    }

    // Settings persistence
    saveSettings() {
        Utils.saveToStorage('psalm23_settings', this.settings);
    }

    loadSettings() {
        const savedSettings = Utils.loadFromStorage('psalm23_settings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...savedSettings };
        }
    }

    // Cleanup
    dispose() {
        this.stopAutoAdvance();
        
        if (this.sceneManager) {
            this.sceneManager.dispose();
        }
        
        if (this.audioManager) {
            this.audioManager.stopAll();
        }
        
        if (this.effectsManager) {
            this.effectsManager.dispose();
        }
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeydown);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        window.removeEventListener('resize', this.handleResize);
    }
}

// Only initialize if not already handled by fallback mode
if (typeof window.fallbackApp === 'undefined' && typeof THREE !== 'undefined') {
    // Initialize the application when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for user interaction on mobile to start audio
        const startApp = () => {
            try {
                window.psalm23App = new Psalm23App();
                document.removeEventListener('click', startApp);
                document.removeEventListener('touchstart', startApp);
            } catch (error) {
                console.error('Failed to start main app, falling back to 2D mode:', error);
                window.fallbackApp = new FallbackApp();
            }
        };
        
        // For mobile devices, wait for user interaction
        if (Utils && Utils.isMobile()) {
            document.addEventListener('click', startApp);
            document.addEventListener('touchstart', startApp);
            
            // Show instruction for mobile users
            const instruction = document.createElement('div');
            instruction.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                z-index: 10001;
                font-family: 'Inter', sans-serif;
            `;
            instruction.innerHTML = `
                <h3>Welcome to Psalm 23</h3>
                <p>Tap anywhere to begin your immersive journey</p>
            `;
            document.body.appendChild(instruction);
            
            // Remove instruction after user interaction
            const removeInstruction = () => {
                if (instruction.parentNode) {
                    instruction.parentNode.removeChild(instruction);
                }
            };
            
            document.addEventListener('click', removeInstruction);
            document.addEventListener('touchstart', removeInstruction);
        } else {
            // For desktop, start immediately
            startApp();
        }
    });
}

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.psalm23App) {
        window.psalm23App.dispose();
    }
});

// Export for global access
window.Psalm23App = Psalm23App;