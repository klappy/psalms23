/**
 * Advanced Visual Effects System for Psalm 23 Experience
 * Handles post-processing, transitions, lighting effects, and visual enhancements
 */

class EffectsManager {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.isEnabled = true;
        
        // Effect systems
        this.postProcessing = null;
        this.transitions = [];
        this.activeEffects = new Map();
        
        // Shader materials
        this.shaderMaterials = new Map();
        
        // Animation timelines
        this.timelines = new Map();
        
        // Initialize effects
        this.initializeEffects();
    }

    initializeEffects() {
        // Create post-processing pipeline
        this.createPostProcessingPipeline();
        
        // Create shader materials
        this.createShaderMaterials();
        
        // Initialize effect presets
        this.initializeEffectPresets();
    }

    createPostProcessingPipeline() {
        // Basic post-processing effects without external dependencies
        this.postProcessing = {
            passes: [],
            uniforms: {
                time: { value: 0 },
                resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                mouse: { value: new THREE.Vector2(0, 0) }
            }
        };
    }

    createShaderMaterials() {
        // God rays shader
        const godRaysVertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        
        const godRaysFragmentShader = `
            uniform float time;
            uniform vec2 resolution;
            uniform vec3 lightPosition;
            uniform vec3 color;
            uniform float intensity;
            varying vec2 vUv;
            
            void main() {
                vec2 uv = vUv;
                vec2 center = vec2(0.5, 0.8);
                
                float dist = distance(uv, center);
                float rays = 0.0;
                
                for(int i = 0; i < 100; i++) {
                    float angle = float(i) * 0.0628;
                    vec2 dir = vec2(cos(angle), sin(angle));
                    rays += 1.0 / (1.0 + dist * 10.0) * sin(time * 2.0 + dist * 20.0) * 0.1;
                }
                
                rays *= intensity;
                gl_FragColor = vec4(color * rays, rays * 0.5);
            }
        `;
        
        this.shaderMaterials.set('godRays', new THREE.ShaderMaterial({
            vertexShader: godRaysVertexShader,
            fragmentShader: godRaysFragmentShader,
            uniforms: {
                time: { value: 0 },
                resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                lightPosition: { value: new THREE.Vector3(0, 10, 0) },
                color: { value: new THREE.Color(1, 1, 0.8) },
                intensity: { value: 0.5 }
            },
            transparent: true,
            blending: THREE.AdditiveBlending
        }));

        // Water shader
        const waterVertexShader = `
            uniform float time;
            varying vec2 vUv;
            varying vec3 vPosition;
            
            void main() {
                vUv = uv;
                vPosition = position;
                
                vec3 newPosition = position;
                newPosition.y += sin(time * 2.0 + position.x * 0.5) * 0.2;
                newPosition.y += cos(time * 1.5 + position.z * 0.3) * 0.1;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            }
        `;
        
        const waterFragmentShader = `
            uniform float time;
            uniform vec3 color;
            uniform float opacity;
            varying vec2 vUv;
            varying vec3 vPosition;
            
            void main() {
                vec2 uv = vUv;
                
                // Create ripple effect
                float ripple = sin(time * 3.0 + vPosition.x * 2.0) * 0.1;
                ripple += cos(time * 2.0 + vPosition.z * 1.5) * 0.05;
                
                // Add reflection-like effect
                float reflection = sin(uv.x * 10.0 + time) * 0.1;
                
                vec3 finalColor = color + vec3(reflection + ripple);
                gl_FragColor = vec4(finalColor, opacity);
            }
        `;
        
        this.shaderMaterials.set('water', new THREE.ShaderMaterial({
            vertexShader: waterVertexShader,
            fragmentShader: waterFragmentShader,
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0.2, 0.6, 1.0) },
                opacity: { value: 0.8 }
            },
            transparent: true
        }));

        // Particle glow shader
        const particleVertexShader = `
            uniform float time;
            uniform float size;
            attribute float alpha;
            attribute vec3 customColor;
            varying float vAlpha;
            varying vec3 vColor;
            
            void main() {
                vAlpha = alpha;
                vColor = customColor;
                
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `;
        
        const particleFragmentShader = `
            uniform float time;
            varying float vAlpha;
            varying vec3 vColor;
            
            void main() {
                float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                alpha *= vAlpha;
                
                // Add glow effect
                float glow = 1.0 - smoothstep(0.0, 0.3, distanceToCenter);
                glow *= sin(time * 2.0) * 0.3 + 0.7;
                
                gl_FragColor = vec4(vColor * (1.0 + glow), alpha);
            }
        `;
        
        this.shaderMaterials.set('particleGlow', new THREE.ShaderMaterial({
            vertexShader: particleVertexShader,
            fragmentShader: particleFragmentShader,
            uniforms: {
                time: { value: 0 },
                size: { value: 10.0 }
            },
            transparent: true,
            blending: THREE.AdditiveBlending
        }));

        // Atmospheric fog shader
        const fogVertexShader = `
            varying vec3 vWorldPosition;
            varying vec3 vNormal;
            
            void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                vNormal = normalize(normalMatrix * normal);
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        
        const fogFragmentShader = `
            uniform float time;
            uniform vec3 fogColor;
            uniform float fogDensity;
            uniform vec3 cameraPosition;
            varying vec3 vWorldPosition;
            varying vec3 vNormal;
            
            void main() {
                float distance = length(vWorldPosition - cameraPosition);
                float fogFactor = 1.0 - exp(-fogDensity * distance);
                
                // Add animated fog
                float fog = sin(time * 0.5 + vWorldPosition.x * 0.1) * 0.1 + 0.9;
                fog *= sin(time * 0.3 + vWorldPosition.z * 0.08) * 0.1 + 0.9;
                
                fogFactor *= fog;
                
                gl_FragColor = vec4(fogColor, fogFactor * 0.3);
            }
        `;
        
        this.shaderMaterials.set('fog', new THREE.ShaderMaterial({
            vertexShader: fogVertexShader,
            fragmentShader: fogFragmentShader,
            uniforms: {
                time: { value: 0 },
                fogColor: { value: new THREE.Color(0.8, 0.9, 1.0) },
                fogDensity: { value: 0.01 },
                cameraPosition: { value: new THREE.Vector3() }
            },
            transparent: true,
            blending: THREE.NormalBlending
        }));
    }

    initializeEffectPresets() {
        // Define effect presets for different scenes
        this.effectPresets = {
            pastoral: {
                godRays: { intensity: 0.3, color: new THREE.Color(1, 1, 0.8) },
                fog: { density: 0.008, color: new THREE.Color(0.9, 0.95, 1.0) },
                particles: { glow: true, size: 8 }
            },
            meadow: {
                godRays: { intensity: 0.4, color: new THREE.Color(1, 1, 0.6) },
                fog: { density: 0.005, color: new THREE.Color(0.8, 1, 0.8) },
                particles: { glow: true, size: 6 }
            },
            waters: {
                water: { ripples: true, reflection: 0.8 },
                fog: { density: 0.012, color: new THREE.Color(0.7, 0.9, 1.0) },
                particles: { glow: false, size: 4 }
            },
            valley: {
                godRays: { intensity: 0.8, color: new THREE.Color(1, 0.9, 0.7) },
                fog: { density: 0.015, color: new THREE.Color(0.4, 0.4, 0.6) },
                particles: { glow: true, size: 12 }
            },
            feast: {
                godRays: { intensity: 0.6, color: new THREE.Color(1, 0.8, 0.4) },
                fog: { density: 0.006, color: new THREE.Color(1, 0.9, 0.7) },
                particles: { glow: true, size: 10 }
            },
            eternal: {
                godRays: { intensity: 1.0, color: new THREE.Color(1, 1, 1) },
                fog: { density: 0.004, color: new THREE.Color(1, 1, 0.9) },
                particles: { glow: true, size: 15 }
            }
        };
    }

    // Create specific effects
    createGodRays(scene, lightPosition, color = new THREE.Color(1, 1, 0.8), intensity = 0.5) {
        const geometry = new THREE.PlaneGeometry(100, 100);
        const material = this.shaderMaterials.get('godRays').clone();
        
        material.uniforms.lightPosition.value = lightPosition;
        material.uniforms.color.value = color;
        material.uniforms.intensity.value = intensity;
        
        const godRays = new THREE.Mesh(geometry, material);
        godRays.position.copy(lightPosition);
        godRays.lookAt(this.camera.position);
        
        scene.add(godRays);
        
        this.activeEffects.set('godRays', {
            object: godRays,
            material: material,
            update: (time) => {
                material.uniforms.time.value = time;
                godRays.lookAt(this.camera.position);
            }
        });
        
        return godRays;
    }

    createWaterEffect(waterMesh, color = new THREE.Color(0.2, 0.6, 1.0)) {
        const material = this.shaderMaterials.get('water').clone();
        material.uniforms.color.value = color;
        
        waterMesh.material = material;
        
        this.activeEffects.set('water', {
            object: waterMesh,
            material: material,
            update: (time) => {
                material.uniforms.time.value = time;
            }
        });
        
        return waterMesh;
    }

    createParticleGlowEffect(particleSystem, size = 10) {
        const material = this.shaderMaterials.get('particleGlow').clone();
        material.uniforms.size.value = size;
        
        // Add custom attributes
        const positions = particleSystem.geometry.attributes.position;
        const count = positions.count;
        
        const alphas = new Float32Array(count);
        const colors = new Float32Array(count * 3);
        
        for (let i = 0; i < count; i++) {
            alphas[i] = Math.random();
            colors[i * 3] = Math.random();
            colors[i * 3 + 1] = Math.random();
            colors[i * 3 + 2] = Math.random();
        }
        
        particleSystem.geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
        particleSystem.geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
        
        particleSystem.material = material;
        
        this.activeEffects.set('particleGlow', {
            object: particleSystem,
            material: material,
            update: (time) => {
                material.uniforms.time.value = time;
                
                // Update alpha values for twinkling effect
                const alphaAttribute = particleSystem.geometry.attributes.alpha;
                for (let i = 0; i < alphaAttribute.count; i++) {
                    alphaAttribute.array[i] = Math.sin(time * 2 + i * 0.1) * 0.5 + 0.5;
                }
                alphaAttribute.needsUpdate = true;
            }
        });
        
        return particleSystem;
    }

    createFogEffect(scene, color = new THREE.Color(0.8, 0.9, 1.0), density = 0.01) {
        const geometry = new THREE.SphereGeometry(200, 32, 32);
        const material = this.shaderMaterials.get('fog').clone();
        
        material.uniforms.fogColor.value = color;
        material.uniforms.fogDensity.value = density;
        
        const fogSphere = new THREE.Mesh(geometry, material);
        fogSphere.position.copy(this.camera.position);
        
        scene.add(fogSphere);
        
        this.activeEffects.set('fog', {
            object: fogSphere,
            material: material,
            update: (time) => {
                material.uniforms.time.value = time;
                material.uniforms.cameraPosition.value = this.camera.position;
                fogSphere.position.copy(this.camera.position);
            }
        });
        
        return fogSphere;
    }

    // Screen transition effects
    createFadeTransition(duration = 1000, color = new THREE.Color(0, 0, 0)) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`;
            overlay.style.opacity = '0';
            overlay.style.zIndex = '10000';
            overlay.style.transition = `opacity ${duration}ms ease`;
            overlay.style.pointerEvents = 'none';
            
            document.body.appendChild(overlay);
            
            // Fade in
            setTimeout(() => {
                overlay.style.opacity = '1';
            }, 10);
            
            // Fade out
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    resolve();
                }, duration);
            }, duration);
        });
    }

    createSlideTransition(direction = 'left', duration = 800) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            overlay.style.zIndex = '10000';
            overlay.style.transition = `transform ${duration}ms ease`;
            overlay.style.pointerEvents = 'none';
            
            // Set initial position
            switch (direction) {
                case 'left':
                    overlay.style.left = '-100%';
                    break;
                case 'right':
                    overlay.style.right = '-100%';
                    break;
                case 'up':
                    overlay.style.top = '-100%';
                    break;
                case 'down':
                    overlay.style.bottom = '-100%';
                    break;
            }
            
            document.body.appendChild(overlay);
            
            // Slide in
            setTimeout(() => {
                overlay.style.transform = 'translateX(0)';
            }, 10);
            
            // Slide out
            setTimeout(() => {
                switch (direction) {
                    case 'left':
                        overlay.style.transform = 'translateX(100%)';
                        break;
                    case 'right':
                        overlay.style.transform = 'translateX(-100%)';
                        break;
                    case 'up':
                        overlay.style.transform = 'translateY(100%)';
                        break;
                    case 'down':
                        overlay.style.transform = 'translateY(-100%)';
                        break;
                }
                
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    resolve();
                }, duration);
            }, duration / 2);
        });
    }

    createCircleTransition(duration = 1000, color = new THREE.Color(1, 1, 1)) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '50%';
            overlay.style.left = '50%';
            overlay.style.width = '0';
            overlay.style.height = '0';
            overlay.style.backgroundColor = `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`;
            overlay.style.borderRadius = '50%';
            overlay.style.transform = 'translate(-50%, -50%)';
            overlay.style.zIndex = '10000';
            overlay.style.transition = `width ${duration}ms ease, height ${duration}ms ease`;
            overlay.style.pointerEvents = 'none';
            
            document.body.appendChild(overlay);
            
            // Expand
            setTimeout(() => {
                const size = Math.max(window.innerWidth, window.innerHeight) * 2;
                overlay.style.width = `${size}px`;
                overlay.style.height = `${size}px`;
            }, 10);
            
            // Contract
            setTimeout(() => {
                overlay.style.width = '0';
                overlay.style.height = '0';
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    resolve();
                }, duration);
            }, duration);
        });
    }

    // Scene-specific effect application
    applySceneEffects(sceneType, scene) {
        const preset = this.effectPresets[sceneType];
        if (!preset) return;
        
        this.clearEffects();
        
        // Apply god rays
        if (preset.godRays) {
            const lightPos = new THREE.Vector3(0, 20, -10);
            this.createGodRays(scene, lightPos, preset.godRays.color, preset.godRays.intensity);
        }
        
        // Apply fog
        if (preset.fog) {
            this.createFogEffect(scene, preset.fog.color, preset.fog.density);
        }
        
        // Apply water effects (if applicable)
        if (preset.water && sceneType === 'waters') {
            scene.traverse((child) => {
                if (child.isMesh && child.material && child.material.color) {
                    const waterColor = child.material.color;
                    if (waterColor.b > 0.5) { // Likely water
                        this.createWaterEffect(child, waterColor);
                    }
                }
            });
        }
        
        // Apply particle effects
        if (preset.particles) {
            scene.traverse((child) => {
                if (child.isPoints) {
                    if (preset.particles.glow) {
                        this.createParticleGlowEffect(child, preset.particles.size);
                    }
                }
            });
        }
    }

    // Lighting effects
    createDynamicLighting(scene, config) {
        const lights = [];
        
        // Ambient light animation
        const ambientLight = new THREE.AmbientLight(config.ambientColor || 0x404040, config.ambientIntensity || 0.4);
        scene.add(ambientLight);
        lights.push(ambientLight);
        
        // Directional light with movement
        const directionalLight = new THREE.DirectionalLight(config.directionalColor || 0xffffff, config.directionalIntensity || 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
        lights.push(directionalLight);
        
        // Point lights for atmosphere
        if (config.pointLights) {
            config.pointLights.forEach((lightConfig, index) => {
                const pointLight = new THREE.PointLight(lightConfig.color, lightConfig.intensity, lightConfig.distance);
                pointLight.position.copy(lightConfig.position);
                scene.add(pointLight);
                lights.push(pointLight);
            });
        }
        
        this.activeEffects.set('dynamicLighting', {
            lights: lights,
            update: (time) => {
                // Animate ambient light
                ambientLight.intensity = (config.ambientIntensity || 0.4) + Math.sin(time * 0.5) * 0.1;
                
                // Animate directional light
                directionalLight.position.x = 10 + Math.sin(time * 0.3) * 5;
                directionalLight.position.z = 10 + Math.cos(time * 0.2) * 5;
                
                // Animate point lights
                if (config.pointLights) {
                    config.pointLights.forEach((lightConfig, index) => {
                        const light = lights[index + 2]; // Skip ambient and directional
                        if (light) {
                            light.intensity = lightConfig.intensity + Math.sin(time * 2 + index) * 0.2;
                        }
                    });
                }
            }
        });
        
        return lights;
    }

    // Update all active effects
    update(time) {
        if (!this.isEnabled) return;
        
        this.activeEffects.forEach((effect) => {
            if (effect.update) {
                effect.update(time);
            }
        });
        
        // Update post-processing uniforms
        if (this.postProcessing) {
            this.postProcessing.uniforms.time.value = time;
        }
    }

    // Effect management
    clearEffects() {
        this.activeEffects.forEach((effect, key) => {
            if (effect.object && effect.object.parent) {
                effect.object.parent.remove(effect.object);
            }
            if (effect.lights) {
                effect.lights.forEach(light => {
                    if (light.parent) {
                        light.parent.remove(light);
                    }
                });
            }
        });
        
        this.activeEffects.clear();
    }

    getEffect(name) {
        return this.activeEffects.get(name);
    }

    removeEffect(name) {
        const effect = this.activeEffects.get(name);
        if (effect) {
            if (effect.object && effect.object.parent) {
                effect.object.parent.remove(effect.object);
            }
            if (effect.lights) {
                effect.lights.forEach(light => {
                    if (light.parent) {
                        light.parent.remove(light);
                    }
                });
            }
            this.activeEffects.delete(name);
        }
    }

    // Enable/disable effects
    toggle() {
        this.isEnabled = !this.isEnabled;
        return this.isEnabled;
    }

    // Resize handler
    handleResize() {
        if (this.postProcessing) {
            this.postProcessing.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
        }
        
        this.shaderMaterials.forEach((material) => {
            if (material.uniforms.resolution) {
                material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
            }
        });
    }

    // Cleanup
    dispose() {
        this.clearEffects();
        
        this.shaderMaterials.forEach((material) => {
            material.dispose();
        });
        
        this.shaderMaterials.clear();
        this.timelines.clear();
    }
}

// Make available globally
window.EffectsManager = EffectsManager;