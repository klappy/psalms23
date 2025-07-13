// Enhanced Psalm 23 Experience with Advanced Features
// Including TWEEN animations, enhanced mobile performance, and cinematic effects

// Import TWEEN for smooth animations
const TWEEN = {
    Group: function() {
        this._tweens = [];
        this.getAll = function() { return this._tweens; };
        this.removeAll = function() { this._tweens = []; };
        this.add = function(tween) { this._tweens.push(tween); };
        this.remove = function(tween) { 
            const index = this._tweens.indexOf(tween);
            if (index >= 0) this._tweens.splice(index, 1);
        };
        this.update = function(time) {
            for (let i = 0; i < this._tweens.length; i++) {
                if (this._tweens[i].update(time)) {
                    this._tweens.splice(i, 1);
                    i--;
                }
            }
        };
    },
    
    Tween: function(object) {
        this.object = object;
        this.start = {};
        this.end = {};
        this.duration = 1000;
        this.easing = function(t) { return t; };
        this.onUpdate = function() {};
        this.onComplete = function() {};
        this.startTime = null;
        this.group = null;
        
        this.to = function(properties, duration) {
            this.end = properties;
            this.duration = duration || 1000;
            return this;
        };
        
        this.easing = function(func) {
            this.easingFunction = func;
            return this;
        };
        
        this.onUpdate = function(callback) {
            this.onUpdateCallback = callback;
            return this;
        };
        
        this.onComplete = function(callback) {
            this.onCompleteCallback = callback;
            return this;
        };
        
        this.start = function(time) {
            this.startTime = time || Date.now();
            for (let prop in this.end) {
                this.startValues = this.startValues || {};
                this.startValues[prop] = this.object[prop];
            }
            if (this.group) this.group.add(this);
            return this;
        };
        
        this.update = function(time) {
            if (this.startTime === null) return false;
            
            const elapsed = time - this.startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            
            const easedProgress = this.easingFunction ? this.easingFunction(progress) : progress;
            
            for (let prop in this.end) {
                const start = this.startValues[prop];
                const end = this.end[prop];
                this.object[prop] = start + (end - start) * easedProgress;
            }
            
            if (this.onUpdateCallback) this.onUpdateCallback.call(this.object);
            
            if (progress >= 1) {
                if (this.onCompleteCallback) this.onCompleteCallback.call(this.object);
                return true;
            }
            
            return false;
        };
        
        return this;
    },
    
    Easing: {
        Quadratic: {
            InOut: function(t) {
                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            }
        },
        Cubic: {
            InOut: function(t) {
                return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            }
        }
    }
};

// Enhanced global variables
let scene, camera, renderer, controls;
let currentVerse = 0;
let totalVerses = 6;
let isAutoPlay = false;
let autoPlayInterval;
let particleSystem;
let ambientLight, directionalLight;
let backgroundObjects = [];
let grassField, waterSurface, darkMountains, feastTable, goldenCup, heavenlyGlow;
let skyGradient, skyBox;
let tweenGroup = new TWEEN.Group();
let audioContext, audioBuffer;
let isTransitioning = false;
let mobileOptimized = false;
let scrollingBackground = [];

// Performance optimization for mobile
function detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function optimizeForMobile() {
    if (detectMobile()) {
        mobileOptimized = true;
        // Reduce particle counts and complexity for mobile
        return {
            particles: 50,
            trees: 10,
            sheep: 8,
            mountains: 4,
            feastItems: 6,
            pillars: 4
        };
    }
    return {
        particles: 200,
        trees: 20,
        sheep: 15,
        mountains: 8,
        feastItems: 10,
        pillars: 6
    };
}

// Enhanced initialization
function init() {
    const config = optimizeForMobile();
    
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera with enhanced settings
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    
    // Create renderer with enhanced settings
    renderer = new THREE.WebGLRenderer({ 
        antialias: !mobileOptimized, 
        alpha: true,
        powerPreference: mobileOptimized ? "low-power" : "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = !mobileOptimized;
    renderer.shadowMap.type = mobileOptimized ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap;
    
    // Enable tone mapping for better lighting
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    // Create sky gradient
    createSkyGradient();
    
    // Enhanced lighting system
    setupLighting();
    
    // Create environments with configuration
    createEnvironments(config);
    
    // Initialize scrolling background system
    initializeScrollingBackground();
    
    // Start with the first verse
    updateScene(0);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Add performance monitoring
    if (window.performance) {
        monitorPerformance();
    }
    
    // Start render loop
    animate();
    
    // Hide loading screen with animation
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading');
        loadingScreen.style.transition = 'opacity 2s ease-out';
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 2000);
    }, 1000);
}

// Create dynamic sky gradient
function createSkyGradient() {
    const skyGeometry = new THREE.SphereGeometry(500, 32, 16);
    const skyMaterial = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        uniforms: {
            topColor: { value: new THREE.Color(0x87CEEB) },
            bottomColor: { value: new THREE.Color(0x98FB98) },
            offset: { value: 0.1 },
            exponent: { value: 0.6 }
        },
        vertexShader: `
            varying vec3 vWorldPosition;
            void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            uniform float offset;
            uniform float exponent;
            varying vec3 vWorldPosition;
            void main() {
                float h = normalize(vWorldPosition).y;
                gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
            }
        `
    });
    
    skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(skyBox);
}

// Enhanced lighting system
function setupLighting() {
    ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);
    
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    
    if (!mobileOptimized) {
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
    }
    
    scene.add(directionalLight);
    
    // Add rim lighting
    const rimLight = new THREE.DirectionalLight(0x4169e1, 0.3);
    rimLight.position.set(-5, 5, -5);
    scene.add(rimLight);
}

// Initialize scrolling background system (Roku-style)
function initializeScrollingBackground() {
    const scrollingElements = [
        { type: 'cross', speed: 0.001, size: 2 },
        { type: 'dove', speed: 0.002, size: 1.5 },
        { type: 'star', speed: 0.0015, size: 1 },
        { type: 'cloud', speed: 0.0008, size: 3 }
    ];
    
    scrollingElements.forEach(element => {
        for (let i = 0; i < 5; i++) {
            const object = createScrollingElement(element.type, element.size);
            object.position.set(
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 100,
                -100 - Math.random() * 50
            );
            object.userData.scrollSpeed = element.speed;
            object.userData.scrollType = element.type;
            scene.add(object);
            scrollingBackground.push(object);
        }
    });
}

// Create scrolling background elements
function createScrollingElement(type, size) {
    let geometry, material;
    
    switch (type) {
        case 'cross':
            geometry = new THREE.BoxGeometry(size * 0.2, size, size * 0.2);
            material = new THREE.MeshLambertMaterial({ 
                color: 0xffffff, 
                transparent: true, 
                opacity: 0.1 
            });
            const cross = new THREE.Mesh(geometry, material);
            const crossBeam = new THREE.Mesh(
                new THREE.BoxGeometry(size, size * 0.2, size * 0.2),
                material
            );
            crossBeam.position.y = size * 0.3;
            cross.add(crossBeam);
            return cross;
            
        case 'dove':
            geometry = new THREE.ConeGeometry(size * 0.3, size, 8);
            material = new THREE.MeshLambertMaterial({ 
                color: 0xffffff, 
                transparent: true, 
                opacity: 0.15 
            });
            return new THREE.Mesh(geometry, material);
            
        case 'star':
            geometry = new THREE.SphereGeometry(size * 0.3, 6, 6);
            material = new THREE.MeshLambertMaterial({ 
                color: 0xffd700, 
                transparent: true, 
                opacity: 0.2 
            });
            return new THREE.Mesh(geometry, material);
            
        case 'cloud':
            const cloud = new THREE.Group();
            for (let i = 0; i < 3; i++) {
                const sphere = new THREE.Mesh(
                    new THREE.SphereGeometry(size * 0.5, 8, 8),
                    new THREE.MeshLambertMaterial({ 
                        color: 0xffffff, 
                        transparent: true, 
                        opacity: 0.05 
                    })
                );
                sphere.position.set(
                    (Math.random() - 0.5) * size,
                    (Math.random() - 0.5) * size * 0.5,
                    0
                );
                cloud.add(sphere);
            }
            return cloud;
    }
}

// Enhanced scene updates with smooth transitions
function updateScene(verseIndex) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    // Smooth transition out
    new TWEEN.Tween({ opacity: 1 })
        .to({ opacity: 0 }, 500)
        .onUpdate(function() {
            backgroundObjects.forEach(obj => {
                if (obj.material) {
                    obj.material.opacity = this.opacity;
                }
            });
        })
        .onComplete(() => {
            // Hide all objects
            backgroundObjects.forEach(obj => {
                obj.visible = false;
                if (obj.material) {
                    obj.material.opacity = 1;
                }
            });
            
            // Reset fog
            scene.fog = null;
            
            // Update environment
            updateEnvironment(verseIndex);
            
            // Smooth transition in
            new TWEEN.Tween({ opacity: 0 })
                .to({ opacity: 1 }, 800)
                .onUpdate(function() {
                    backgroundObjects.forEach(obj => {
                        if (obj.visible && obj.material) {
                            obj.material.opacity = this.opacity;
                        }
                    });
                })
                .onComplete(() => {
                    isTransitioning = false;
                })
                .start();
        })
        .start();
}

// Update environment based on verse
function updateEnvironment(verseIndex) {
    const cameraTargets = [
        { x: 0, y: 8, z: 15 },   // Shepherd
        { x: 0, y: 6, z: 12 },   // Waters
        { x: 0, y: 5, z: 10 },   // Paths
        { x: 0, y: 3, z: 8 },    // Valley
        { x: 0, y: 4, z: 8 },    // Table
        { x: 0, y: 10, z: 20 }   // Heaven
    ];
    
    const lightingConfigs = [
        { ambient: 0.4, directional: 0.8, color: 0xffffff },
        { ambient: 0.5, directional: 0.7, color: 0x87ceeb },
        { ambient: 0.4, directional: 0.6, color: 0xffa500 },
        { ambient: 0.2, directional: 0.3, color: 0x4169e1 },
        { ambient: 0.6, directional: 0.9, color: 0xffd700 },
        { ambient: 0.8, directional: 1.0, color: 0xffffff }
    ];
    
    const skyColors = [
        { top: 0x87CEEB, bottom: 0x98FB98 },
        { top: 0x4169e1, bottom: 0x87ceeb },
        { top: 0xffa500, bottom: 0xffd700 },
        { top: 0x2f2f2f, bottom: 0x000000 },
        { top: 0xffd700, bottom: 0xffa500 },
        { top: 0xffffff, bottom: 0x87ceeb }
    ];
    
    // Animate camera
    new TWEEN.Tween(camera.position)
        .to(cameraTargets[verseIndex], 1500)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();
    
    // Animate lighting
    const config = lightingConfigs[verseIndex];
    new TWEEN.Tween(ambientLight)
        .to({ intensity: config.ambient }, 1000)
        .start();
    
    new TWEEN.Tween(directionalLight)
        .to({ intensity: config.directional }, 1000)
        .start();
    
    new TWEEN.Tween(directionalLight.color)
        .to({ r: ((config.color >> 16) & 255) / 255, 
              g: ((config.color >> 8) & 255) / 255, 
              b: (config.color & 255) / 255 }, 1000)
        .start();
    
    // Animate sky
    if (skyBox) {
        new TWEEN.Tween(skyBox.material.uniforms.topColor.value)
            .to({ r: ((skyColors[verseIndex].top >> 16) & 255) / 255,
                  g: ((skyColors[verseIndex].top >> 8) & 255) / 255,
                  b: (skyColors[verseIndex].top & 255) / 255 }, 1000)
            .start();
        
        new TWEEN.Tween(skyBox.material.uniforms.bottomColor.value)
            .to({ r: ((skyColors[verseIndex].bottom >> 16) & 255) / 255,
                  g: ((skyColors[verseIndex].bottom >> 8) & 255) / 255,
                  b: (skyColors[verseIndex].bottom & 255) / 255 }, 1000)
            .start();
    }
    
    // Show appropriate environment
    switch(verseIndex) {
        case 0: showGreenPastures(); break;
        case 1: showStillWaters(); break;
        case 2: showRightPaths(); break;
        case 3: showDarkValley(); break;
        case 4: showFeastTable(); break;
        case 5: showHeavenlyHome(); break;
    }
}

// Enhanced animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update tweens
    tweenGroup.update();
    
    // Animate scrolling background
    scrollingBackground.forEach(obj => {
        obj.position.x += obj.userData.scrollSpeed * 100;
        
        if (obj.position.x > 150) {
            obj.position.x = -150;
            obj.position.y = (Math.random() - 0.5) * 100;
        }
        
        // Add subtle rotation
        obj.rotation.y += 0.005;
    });
    
    // Animate particles and effects
    if (heavenlyGlow) {
        heavenlyGlow.rotation.y += 0.001;
    }
    
    if (goldenCup && goldenCup.children[0]) {
        goldenCup.children[0].rotation.y += 0.02;
    }
    
    // Enhanced water animation
    if (waterSurface) {
        const time = Date.now() * 0.001;
        const vertices = waterSurface.geometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            vertices[i + 2] = Math.sin(time + vertices[i] * 0.1) * 0.1;
        }
        waterSurface.geometry.attributes.position.needsUpdate = true;
    }
    
    // Animate water ripples
    backgroundObjects.forEach(obj => {
        if (obj.userData.type === 'ripple') {
            obj.scale.x += 0.01;
            obj.scale.z += 0.01;
            obj.material.opacity -= 0.005;
            
            if (obj.material.opacity <= 0) {
                obj.scale.set(1, 1, 1);
                obj.material.opacity = 0.3;
            }
        }
    });
    
    // Animate sheep movement
    backgroundObjects.forEach(obj => {
        if (obj.userData.type === 'sheep') {
            const time = Date.now() * 0.001;
            obj.position.x += Math.sin(time + obj.id) * 0.005;
            obj.position.z += Math.cos(time + obj.id) * 0.005;
        }
    });
    
    renderer.render(scene, camera);
}

// Performance monitoring
function monitorPerformance() {
    let lastTime = performance.now();
    let frameCount = 0;
    
    function checkFPS() {
        const currentTime = performance.now();
        frameCount++;
        
        if (currentTime - lastTime >= 1000) {
            const fps = frameCount;
            frameCount = 0;
            lastTime = currentTime;
            
            // Auto-optimize if FPS drops too low
            if (fps < 30 && !mobileOptimized) {
                console.log('Performance optimization triggered');
                optimizePerformance();
            }
        }
        
        requestAnimationFrame(checkFPS);
    }
    
    checkFPS();
}

// Auto-optimize performance
function optimizePerformance() {
    mobileOptimized = true;
    
    // Reduce particle systems
    backgroundObjects.forEach(obj => {
        if (obj.userData.type === 'particle') {
            obj.visible = false;
        }
    });
    
    // Disable shadows
    renderer.shadowMap.enabled = false;
    
    // Reduce quality
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
}

// Initialize when page loads
window.addEventListener('load', init);

// Export for global access
window.TWEEN = TWEEN;
window.tweenGroup = tweenGroup;