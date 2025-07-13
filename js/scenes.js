/**
 * Immersive 3D Scenes for Psalm 23 Experience
 * Each scene represents a different verse with unique visuals and atmosphere
 */

class SceneManager {
    constructor() {
        this.currentScene = null;
        this.currentSceneIndex = 0;
        this.scenes = [];
        this.renderer = null;
        this.camera = null;
        this.container = null;
        this.isInitialized = false;
        
        // Performance settings
        this.qualityLevel = Utils.isLowPerformance() ? 'low' : 'high';
        this.pixelRatio = Utils.getDevicePixelRatio();
        
        // Animation state
        this.animationId = null;
        this.clock = new THREE.Clock();
        this.deltaTime = 0;
        
        // Particle systems
        this.particleSystems = [];
        
        // Lighting systems
        this.lightingSystems = [];
        
        // Post-processing
        this.composer = null;
        
        this.initializeRenderer();
        this.createScenes();
    }

    initializeRenderer() {
        this.container = document.getElementById('scene-container');
        if (!this.container) {
            console.error('Scene container not found');
            return;
        }

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: this.qualityLevel === 'high',
            alpha: true,
            powerPreference: 'high-performance'
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(this.pixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        this.container.appendChild(this.renderer.domElement);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        // Handle resize
        window.addEventListener('resize', () => this.handleResize());
        
        this.isInitialized = true;
    }

    createScenes() {
        // Define the verses and their corresponding scenes
        const verseData = [
            {
                title: "The Lord is my shepherd",
                text: "The Lord is my shepherd; I shall not want.",
                reflection: "In God's care, we find complete provision and peace.",
                sceneType: 'pastoral',
                colors: {
                    primary: '#4a9b8e',
                    secondary: '#6eb5a6',
                    accent: '#f39c12'
                }
            },
            {
                title: "Green pastures",
                text: "He makes me lie down in green pastures.",
                reflection: "In His presence, we find rest and renewal.",
                sceneType: 'meadow',
                colors: {
                    primary: '#27ae60',
                    secondary: '#2ecc71',
                    accent: '#f1c40f'
                }
            },
            {
                title: "Still waters",
                text: "He leads me beside quiet waters.",
                reflection: "His guidance brings us to places of peace and refreshment.",
                sceneType: 'waters',
                colors: {
                    primary: '#2980b9',
                    secondary: '#3498db',
                    accent: '#ecf0f1'
                }
            },
            {
                title: "Valley of shadows",
                text: "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me.",
                reflection: "In our darkest moments, His presence is our light.",
                sceneType: 'valley',
                colors: {
                    primary: '#34495e',
                    secondary: '#2c3e50',
                    accent: '#e74c3c'
                }
            },
            {
                title: "Prepared table",
                text: "You prepare a table before me in the presence of my enemies; you anoint my head with oil; my cup overflows.",
                reflection: "God's abundance surrounds us even in difficult times.",
                sceneType: 'feast',
                colors: {
                    primary: '#8e44ad',
                    secondary: '#9b59b6',
                    accent: '#f39c12'
                }
            },
            {
                title: "Eternal dwelling",
                text: "Surely goodness and mercy shall follow me all the days of my life, and I will dwell in the house of the Lord forever.",
                reflection: "God's love extends into eternity, our permanent home.",
                sceneType: 'eternal',
                colors: {
                    primary: '#e67e22',
                    secondary: '#f39c12',
                    accent: '#ecf0f1'
                }
            }
        ];

        // Create each scene
        this.scenes = verseData.map((verse, index) => {
            const scene = this.createScene(verse, index);
            return {
                ...verse,
                scene: scene.scene,
                camera: scene.camera,
                animations: scene.animations,
                particles: scene.particles,
                lights: scene.lights,
                index
            };
        });

        // Start with the first scene
        this.loadScene(0);
    }

    createScene(verseData, index) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const animations = [];
        const particles = [];
        const lights = [];

        // Set scene background
        scene.background = this.createSkybox(verseData.sceneType);

        // Create scene content based on type
        switch (verseData.sceneType) {
            case 'pastoral':
                this.createPastoralScene(scene, camera, animations, particles, lights, verseData.colors);
                break;
            case 'meadow':
                this.createMeadowScene(scene, camera, animations, particles, lights, verseData.colors);
                break;
            case 'waters':
                this.createWatersScene(scene, camera, animations, particles, lights, verseData.colors);
                break;
            case 'valley':
                this.createValleyScene(scene, camera, animations, particles, lights, verseData.colors);
                break;
            case 'feast':
                this.createFeastScene(scene, camera, animations, particles, lights, verseData.colors);
                break;
            case 'eternal':
                this.createEternalScene(scene, camera, animations, particles, lights, verseData.colors);
                break;
        }

        return { scene, camera, animations, particles, lights };
    }

    createSkybox(sceneType) {
        const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
        let skyMaterial;

        switch (sceneType) {
            case 'pastoral':
                skyMaterial = new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setHSL(0.6, 0.4, 0.8),
                    side: THREE.BackSide
                });
                break;
            case 'meadow':
                skyMaterial = new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setHSL(0.55, 0.6, 0.9),
                    side: THREE.BackSide
                });
                break;
            case 'waters':
                skyMaterial = new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setHSL(0.65, 0.7, 0.85),
                    side: THREE.BackSide
                });
                break;
            case 'valley':
                skyMaterial = new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setHSL(0.7, 0.2, 0.2),
                    side: THREE.BackSide
                });
                break;
            case 'feast':
                skyMaterial = new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setHSL(0.8, 0.6, 0.4),
                    side: THREE.BackSide
                });
                break;
            case 'eternal':
                skyMaterial = new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setHSL(0.15, 0.8, 0.9),
                    side: THREE.BackSide
                });
                break;
        }

        return new THREE.Mesh(skyGeometry, skyMaterial);
    }

    createPastoralScene(scene, camera, animations, particles, lights, colors) {
        // Position camera
        camera.position.set(0, 5, 10);
        camera.lookAt(0, 0, 0);

        // Create ground
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshLambertMaterial({
            color: colors.primary
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // Create shepherd figure (abstract)
        const shepherdGeometry = new THREE.ConeGeometry(0.5, 3, 8);
        const shepherdMaterial = new THREE.MeshPhongMaterial({
            color: colors.accent
        });
        const shepherd = new THREE.Mesh(shepherdGeometry, shepherdMaterial);
        shepherd.position.set(-5, 1.5, 0);
        shepherd.castShadow = true;
        scene.add(shepherd);

        // Create staff
        const staffGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4);
        const staffMaterial = new THREE.MeshPhongMaterial({
            color: '#8b4513'
        });
        const staff = new THREE.Mesh(staffGeometry, staffMaterial);
        staff.position.set(-4, 2, 0);
        staff.castShadow = true;
        scene.add(staff);

        // Create sheep
        for (let i = 0; i < 8; i++) {
            const sheep = this.createSheep();
            sheep.position.set(
                Utils.random(-10, 10),
                0.5,
                Utils.random(-10, 10)
            );
            sheep.castShadow = true;
            scene.add(sheep);

            // Add gentle movement animation
            animations.push({
                update: (time) => {
                    sheep.position.x += Math.sin(time * 0.5 + i) * 0.01;
                    sheep.position.z += Math.cos(time * 0.3 + i) * 0.01;
                    sheep.rotation.y += 0.005;
                }
            });
        }

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);
        lights.push(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        scene.add(directionalLight);
        lights.push(directionalLight);

        // Particle system for floating dust/pollen
        const particleSystem = this.createFloatingParticles(colors.accent, 100);
        scene.add(particleSystem);
        particles.push(particleSystem);

        // Camera animation
        animations.push({
            update: (time) => {
                camera.position.x = Math.sin(time * 0.1) * 2;
                camera.position.y = 5 + Math.sin(time * 0.15) * 1;
                camera.lookAt(0, 0, 0);
            }
        });
    }

    createMeadowScene(scene, camera, animations, particles, lights, colors) {
        camera.position.set(0, 3, 8);
        camera.lookAt(0, 0, 0);

        // Create lush ground
        const groundGeometry = new THREE.PlaneGeometry(150, 150);
        const groundMaterial = new THREE.MeshLambertMaterial({
            color: colors.primary
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // Create grass particles
        for (let i = 0; i < 2000; i++) {
            const grassBlade = this.createGrassBlade();
            grassBlade.position.set(
                Utils.random(-75, 75),
                0,
                Utils.random(-75, 75)
            );
            grassBlade.rotation.y = Math.random() * Math.PI;
            scene.add(grassBlade);

            // Add wind animation
            animations.push({
                update: (time) => {
                    grassBlade.rotation.z = Math.sin(time * 2 + i * 0.01) * 0.2;
                }
            });
        }

        // Create flowers
        for (let i = 0; i < 50; i++) {
            const flower = this.createFlower();
            flower.position.set(
                Utils.random(-60, 60),
                0.5,
                Utils.random(-60, 60)
            );
            scene.add(flower);

            // Add gentle swaying
            animations.push({
                update: (time) => {
                    flower.rotation.z = Math.sin(time * 1.5 + i * 0.1) * 0.1;
                }
            });
        }

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.7);
        scene.add(ambientLight);
        lights.push(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
        directionalLight.position.set(5, 15, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
        lights.push(directionalLight);

        // Particle system for butterflies
        const butterflySystem = this.createButterflyParticles(colors.accent, 20);
        scene.add(butterflySystem);
        particles.push(butterflySystem);

        // Camera animation
        animations.push({
            update: (time) => {
                camera.position.x = Math.sin(time * 0.05) * 3;
                camera.position.z = 8 + Math.sin(time * 0.08) * 2;
                camera.lookAt(0, 0, 0);
            }
        });
    }

    createWatersScene(scene, camera, animations, particles, lights, colors) {
        camera.position.set(0, 5, 12);
        camera.lookAt(0, 0, 0);

        // Create water surface
        const waterGeometry = new THREE.PlaneGeometry(200, 200, 64, 64);
        const waterMaterial = new THREE.MeshPhongMaterial({
            color: colors.primary,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        });
        const water = new THREE.Mesh(waterGeometry, waterMaterial);
        water.rotation.x = -Math.PI / 2;
        scene.add(water);

        // Water animation
        animations.push({
            update: (time) => {
                const positions = water.geometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) {
                    const x = positions[i];
                    const z = positions[i + 2];
                    positions[i + 1] = Math.sin(time * 2 + x * 0.1) * 0.5 + Math.cos(time * 1.5 + z * 0.1) * 0.3;
                }
                water.geometry.attributes.position.needsUpdate = true;
            }
        });

        // Create shore/banks
        const shoreGeometry = new THREE.PlaneGeometry(220, 50);
        const shoreMaterial = new THREE.MeshLambertMaterial({
            color: '#d2b48c'
        });
        const shore1 = new THREE.Mesh(shoreGeometry, shoreMaterial);
        shore1.rotation.x = -Math.PI / 2;
        shore1.position.z = -125;
        scene.add(shore1);

        const shore2 = new THREE.Mesh(shoreGeometry, shoreMaterial);
        shore2.rotation.x = -Math.PI / 2;
        shore2.position.z = 125;
        scene.add(shore2);

        // Create reeds
        for (let i = 0; i < 30; i++) {
            const reed = this.createReed();
            reed.position.set(
                Utils.random(-100, 100),
                0,
                Utils.random(-90, -70)
            );
            scene.add(reed);

            // Add wind animation
            animations.push({
                update: (time) => {
                    reed.rotation.z = Math.sin(time * 1.2 + i * 0.2) * 0.3;
                }
            });
        }

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);
        lights.push(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(8, 12, 8);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
        lights.push(directionalLight);

        // Particle system for water ripples
        const rippleSystem = this.createRippleParticles(colors.accent, 50);
        scene.add(rippleSystem);
        particles.push(rippleSystem);

        // Camera animation
        animations.push({
            update: (time) => {
                camera.position.x = Math.sin(time * 0.08) * 4;
                camera.position.y = 5 + Math.sin(time * 0.12) * 1;
                camera.lookAt(0, 0, 0);
            }
        });
    }

    createValleyScene(scene, camera, animations, particles, lights, colors) {
        camera.position.set(0, 2, 10);
        camera.lookAt(0, 0, -5);

        // Create valley floor
        const valleyGeometry = new THREE.PlaneGeometry(100, 200);
        const valleyMaterial = new THREE.MeshLambertMaterial({
            color: colors.primary
        });
        const valley = new THREE.Mesh(valleyGeometry, valleyMaterial);
        valley.rotation.x = -Math.PI / 2;
        valley.receiveShadow = true;
        scene.add(valley);

        // Create mountains/cliffs
        for (let i = 0; i < 10; i++) {
            const mountain = this.createMountain();
            mountain.position.set(
                Utils.random(-40, 40),
                Utils.random(5, 15),
                Utils.random(-80, -20)
            );
            mountain.scale.set(
                Utils.random(0.5, 2),
                Utils.random(0.8, 3),
                Utils.random(0.5, 2)
            );
            scene.add(mountain);
        }

        // Create path through valley
        const pathGeometry = new THREE.PlaneGeometry(4, 150);
        const pathMaterial = new THREE.MeshLambertMaterial({
            color: '#8b7355'
        });
        const path = new THREE.Mesh(pathGeometry, pathMaterial);
        path.rotation.x = -Math.PI / 2;
        path.position.y = 0.01;
        scene.add(path);

        // Create divine light beam
        const lightGeometry = new THREE.CylinderGeometry(0, 5, 20, 8);
        const lightMaterial = new THREE.MeshBasicMaterial({
            color: colors.accent,
            transparent: true,
            opacity: 0.3
        });
        const lightBeam = new THREE.Mesh(lightGeometry, lightMaterial);
        lightBeam.position.set(0, 10, -30);
        scene.add(lightBeam);

        // Animate light beam
        animations.push({
            update: (time) => {
                lightBeam.material.opacity = 0.3 + Math.sin(time * 2) * 0.1;
                lightBeam.rotation.y = time * 0.5;
            }
        });

        // Dark ambient lighting
        const ambientLight = new THREE.AmbientLight(0x202020, 0.3);
        scene.add(ambientLight);
        lights.push(ambientLight);

        // Divine spotlight
        const spotLight = new THREE.SpotLight(colors.accent, 1, 50, Math.PI / 4);
        spotLight.position.set(0, 20, -30);
        spotLight.target.position.set(0, 0, 0);
        spotLight.castShadow = true;
        scene.add(spotLight);
        scene.add(spotLight.target);
        lights.push(spotLight);

        // Particle system for dust motes in light
        const dustSystem = this.createDustParticles(colors.accent, 200);
        scene.add(dustSystem);
        particles.push(dustSystem);

        // Camera animation - walking through valley
        animations.push({
            update: (time) => {
                camera.position.z = 10 + Math.sin(time * 0.1) * 20;
                camera.position.x = Math.sin(time * 0.05) * 2;
                camera.lookAt(0, 0, -5);
            }
        });
    }

    createFeastScene(scene, camera, animations, particles, lights, colors) {
        camera.position.set(0, 8, 15);
        camera.lookAt(0, 2, 0);

        // Create table
        const tableGeometry = new THREE.BoxGeometry(12, 0.5, 6);
        const tableMaterial = new THREE.MeshPhongMaterial({
            color: '#8b4513'
        });
        const table = new THREE.Mesh(tableGeometry, tableMaterial);
        table.position.set(0, 2, 0);
        table.castShadow = true;
        scene.add(table);

        // Create feast items
        this.createFeastItems(scene, table);

        // Create chairs
        for (let i = 0; i < 6; i++) {
            const chair = this.createChair();
            const angle = (i / 6) * Math.PI * 2;
            chair.position.set(
                Math.sin(angle) * 8,
                0,
                Math.cos(angle) * 8
            );
            chair.rotation.y = angle;
            scene.add(chair);
        }

        // Create ground
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshLambertMaterial({
            color: colors.primary
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // Warm lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);
        lights.push(ambientLight);

        const candleLight = new THREE.PointLight(colors.accent, 1, 20);
        candleLight.position.set(0, 5, 0);
        candleLight.castShadow = true;
        scene.add(candleLight);
        lights.push(candleLight);

        // Animate candle light
        animations.push({
            update: (time) => {
                candleLight.intensity = 1 + Math.sin(time * 4) * 0.2;
                candleLight.position.y = 5 + Math.sin(time * 2) * 0.1;
            }
        });

        // Particle system for golden sparkles
        const sparkleSystem = this.createSparkleParticles(colors.accent, 100);
        scene.add(sparkleSystem);
        particles.push(sparkleSystem);

        // Camera animation
        animations.push({
            update: (time) => {
                camera.position.x = Math.sin(time * 0.1) * 5;
                camera.position.z = 15 + Math.sin(time * 0.08) * 3;
                camera.lookAt(0, 2, 0);
            }
        });
    }

    createEternalScene(scene, camera, animations, particles, lights, colors) {
        camera.position.set(0, 10, 20);
        camera.lookAt(0, 0, 0);

        // Create celestial structures
        for (let i = 0; i < 8; i++) {
            const pillar = this.createPillar();
            const angle = (i / 8) * Math.PI * 2;
            pillar.position.set(
                Math.sin(angle) * 15,
                5,
                Math.cos(angle) * 15
            );
            scene.add(pillar);
        }

        // Create central altar/throne
        const altarGeometry = new THREE.BoxGeometry(4, 2, 4);
        const altarMaterial = new THREE.MeshPhongMaterial({
            color: colors.accent,
            shininess: 100
        });
        const altar = new THREE.Mesh(altarGeometry, altarMaterial);
        altar.position.set(0, 1, 0);
        altar.castShadow = true;
        scene.add(altar);

        // Create ground with radial pattern
        const groundGeometry = new THREE.PlaneGeometry(200, 200, 32, 32);
        const groundMaterial = new THREE.MeshLambertMaterial({
            color: colors.primary
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // Divine lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);
        lights.push(ambientLight);

        // Multiple colored lights
        const lightColors = [0xffd700, 0xffffff, 0xff6b6b, 0x4ecdc4];
        lightColors.forEach((color, i) => {
            const light = new THREE.PointLight(color, 0.8, 30);
            const angle = (i / lightColors.length) * Math.PI * 2;
            light.position.set(
                Math.sin(angle) * 10,
                8,
                Math.cos(angle) * 10
            );
            scene.add(light);
            lights.push(light);

            // Animate lights
            animations.push({
                update: (time) => {
                    light.intensity = 0.8 + Math.sin(time * 2 + i) * 0.3;
                    light.position.y = 8 + Math.sin(time * 1.5 + i) * 2;
                }
            });
        });

        // Particle system for ethereal motes
        const etherealSystem = this.createEtherealParticles(colors.accent, 300);
        scene.add(etherealSystem);
        particles.push(etherealSystem);

        // Camera animation - slowly circling
        animations.push({
            update: (time) => {
                const radius = 20 + Math.sin(time * 0.1) * 5;
                camera.position.x = Math.sin(time * 0.05) * radius;
                camera.position.z = Math.cos(time * 0.05) * radius;
                camera.position.y = 10 + Math.sin(time * 0.08) * 5;
                camera.lookAt(0, 0, 0);
            }
        });
    }

    // Helper methods for creating 3D objects
    createSheep() {
        const group = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.SphereGeometry(0.8, 8, 6);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: '#f0f0f0' });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.5;
        group.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.4, 8, 6);
        const headMaterial = new THREE.MeshLambertMaterial({ color: '#e0e0e0' });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(0, 0.8, 0.8);
        group.add(head);
        
        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8);
        const legMaterial = new THREE.MeshLambertMaterial({ color: '#8b4513' });
        
        for (let i = 0; i < 4; i++) {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(
                i % 2 === 0 ? -0.3 : 0.3,
                0.2,
                i < 2 ? 0.3 : -0.3
            );
            group.add(leg);
        }
        
        return group;
    }

    createGrassBlade() {
        const geometry = new THREE.PlaneGeometry(0.1, 1);
        const material = new THREE.MeshLambertMaterial({
            color: '#2d5a2d',
            side: THREE.DoubleSide
        });
        return new THREE.Mesh(geometry, material);
    }

    createFlower() {
        const group = new THREE.Group();
        
        // Stem
        const stemGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1);
        const stemMaterial = new THREE.MeshLambertMaterial({ color: '#228b22' });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.y = 0.5;
        group.add(stem);
        
        // Flower
        const flowerGeometry = new THREE.SphereGeometry(0.2, 8, 6);
        const flowerMaterial = new THREE.MeshLambertMaterial({ 
            color: Utils.randomChoice(['#ff69b4', '#ffff00', '#ff4500', '#9370db']) 
        });
        const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
        flower.position.y = 1;
        group.add(flower);
        
        return group;
    }

    createReed() {
        const geometry = new THREE.CylinderGeometry(0.05, 0.05, 3);
        const material = new THREE.MeshLambertMaterial({ color: '#8fbc8f' });
        return new THREE.Mesh(geometry, material);
    }

    createMountain() {
        const geometry = new THREE.ConeGeometry(Utils.random(3, 8), Utils.random(8, 20), 8);
        const material = new THREE.MeshLambertMaterial({ color: '#696969' });
        return new THREE.Mesh(geometry, material);
    }

    createChair() {
        const group = new THREE.Group();
        
        // Seat
        const seatGeometry = new THREE.BoxGeometry(1, 0.1, 1);
        const seatMaterial = new THREE.MeshPhongMaterial({ color: '#8b4513' });
        const seat = new THREE.Mesh(seatGeometry, seatMaterial);
        seat.position.y = 1;
        group.add(seat);
        
        // Back
        const backGeometry = new THREE.BoxGeometry(1, 2, 0.1);
        const back = new THREE.Mesh(backGeometry, seatMaterial);
        back.position.set(0, 2, -0.45);
        group.add(back);
        
        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1);
        const legMaterial = new THREE.MeshPhongMaterial({ color: '#654321' });
        
        for (let i = 0; i < 4; i++) {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(
                i % 2 === 0 ? -0.4 : 0.4,
                0.5,
                i < 2 ? 0.4 : -0.4
            );
            group.add(leg);
        }
        
        return group;
    }

    createPillar() {
        const geometry = new THREE.CylinderGeometry(0.5, 0.5, 10);
        const material = new THREE.MeshPhongMaterial({ 
            color: '#daa520',
            shininess: 100
        });
        return new THREE.Mesh(geometry, material);
    }

    createFeastItems(scene, table) {
        // Create various feast items on the table
        const items = [
            { geometry: new THREE.CylinderGeometry(0.3, 0.3, 0.8), color: '#8b4513', pos: [-3, 2.65, 0] },
            { geometry: new THREE.BoxGeometry(0.8, 0.3, 0.8), color: '#daa520', pos: [0, 2.65, -1] },
            { geometry: new THREE.SphereGeometry(0.4), color: '#ff6347', pos: [2, 2.65, 0] },
            { geometry: new THREE.CylinderGeometry(0.2, 0.2, 1), color: '#ff4500', pos: [-1, 2.75, 1] },
            { geometry: new THREE.BoxGeometry(1.2, 0.2, 0.6), color: '#8fbc8f', pos: [1, 2.6, -1.5] }
        ];

        items.forEach(item => {
            const material = new THREE.MeshPhongMaterial({ color: item.color });
            const mesh = new THREE.Mesh(item.geometry, material);
            mesh.position.set(...item.pos);
            mesh.castShadow = true;
            scene.add(mesh);
        });
    }

    // Particle system creators
    createFloatingParticles(color, count) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        
        for (let i = 0; i < count; i++) {
            positions[i * 3] = Utils.random(-50, 50);
            positions[i * 3 + 1] = Utils.random(0, 20);
            positions[i * 3 + 2] = Utils.random(-50, 50);
            
            velocities[i * 3] = Utils.random(-0.01, 0.01);
            velocities[i * 3 + 1] = Utils.random(0.01, 0.05);
            velocities[i * 3 + 2] = Utils.random(-0.01, 0.01);
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        
        const material = new THREE.PointsMaterial({
            color: color,
            size: 0.1,
            transparent: true,
            opacity: 0.6
        });
        
        return new THREE.Points(geometry, material);
    }

    createButterflyParticles(color, count) {
        return this.createFloatingParticles(color, count);
    }

    createRippleParticles(color, count) {
        return this.createFloatingParticles(color, count);
    }

    createDustParticles(color, count) {
        return this.createFloatingParticles(color, count);
    }

    createSparkleParticles(color, count) {
        return this.createFloatingParticles(color, count);
    }

    createEtherealParticles(color, count) {
        return this.createFloatingParticles(color, count);
    }

    // Scene management
    loadScene(index) {
        if (index < 0 || index >= this.scenes.length) return;
        
        this.currentSceneIndex = index;
        this.currentScene = this.scenes[index];
        
        // Update camera
        this.camera.copy(this.currentScene.camera);
        
        // Update UI
        this.updateUI();
        
        // Load audio for scene
        if (window.audioManager) {
            window.audioManager.loadSceneAudio(this.currentScene.sceneType);
        }
    }

    nextScene() {
        if (this.currentSceneIndex < this.scenes.length - 1) {
            this.loadScene(this.currentSceneIndex + 1);
        }
    }

    previousScene() {
        if (this.currentSceneIndex > 0) {
            this.loadScene(this.currentSceneIndex - 1);
        }
    }

    updateUI() {
        const currentVerseEl = document.getElementById('current-verse');
        const totalVersesEl = document.getElementById('total-verses');
        const verseTitleEl = document.getElementById('verse-title');
        const verseTextEl = document.getElementById('verse-text');
        const verseReflectionEl = document.getElementById('verse-reflection');
        const progressBarEl = document.getElementById('progress-bar');
        const contentOverlayEl = document.getElementById('content-overlay');
        const verseContentEl = contentOverlayEl.querySelector('.verse-content');

        if (this.currentScene) {
            currentVerseEl.textContent = this.currentSceneIndex + 1;
            totalVersesEl.textContent = this.scenes.length;
            verseTitleEl.textContent = this.currentScene.title;
            verseTextEl.textContent = this.currentScene.text;
            verseReflectionEl.textContent = this.currentScene.reflection;
            
            // Update progress bar
            const progress = ((this.currentSceneIndex + 1) / this.scenes.length) * 100;
            progressBarEl.style.width = `${progress}%`;
            
            // Show content with animation
            verseContentEl.classList.remove('visible');
            setTimeout(() => {
                verseContentEl.classList.add('visible');
            }, 300);
        }
    }

    // Animation loop
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        this.deltaTime = this.clock.getDelta();
        const elapsed = this.clock.getElapsedTime();
        
        if (this.currentScene) {
            // Update scene animations
            this.currentScene.animations.forEach(animation => {
                animation.update(elapsed);
            });
            
            // Update particle systems
            this.currentScene.particles.forEach(particleSystem => {
                this.updateParticleSystem(particleSystem, elapsed);
            });
            
            // Render
            this.renderer.render(this.currentScene.scene, this.camera);
        }
    }

    updateParticleSystem(particleSystem, time) {
        if (particleSystem.geometry.attributes.position) {
            const positions = particleSystem.geometry.attributes.position.array;
            const velocities = particleSystem.geometry.attributes.velocity.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += velocities[i];
                positions[i + 1] += velocities[i + 1];
                positions[i + 2] += velocities[i + 2];
                
                // Reset particles that go out of bounds
                if (positions[i + 1] > 30) {
                    positions[i + 1] = 0;
                    positions[i] = Utils.random(-50, 50);
                    positions[i + 2] = Utils.random(-50, 50);
                }
            }
            
            particleSystem.geometry.attributes.position.needsUpdate = true;
        }
    }

    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Cleanup
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.scenes.forEach(scene => {
            scene.scene.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        });
        
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Make available globally
window.SceneManager = SceneManager;