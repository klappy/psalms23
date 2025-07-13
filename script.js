// Global variables
let scene, camera, renderer, controls;
let currentVerse = 0;
let totalVerses = 6;
let isAutoPlay = false;
let autoPlayInterval;
let particleSystem;
let ambientLight, directionalLight;
let backgroundObjects = [];
let grassField, waterSurface, darkMountains, feastTable, goldenCup, heavenlyGlow;

// Initialize the 3D scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    // Add lights
    ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);
    
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);
    
    // Create environments for each verse
    createEnvironments();
    
    // Start with the first verse
    updateScene(0);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start render loop
    animate();
    
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 1000);
}

// Create different environments for each verse
function createEnvironments() {
    // Verse 1: Green pastures
    createGreenPastures();
    
    // Verse 2: Still waters
    createStillWaters();
    
    // Verse 3: Right paths
    createRightPaths();
    
    // Verse 4: Dark valley
    createDarkValley();
    
    // Verse 5: Feast table
    createFeastTable();
    
    // Verse 6: House of the Lord
    createHeavenlyHome();
}

// Create green pastures environment
function createGreenPastures() {
    const grassGeometry = new THREE.PlaneGeometry(100, 100, 32, 32);
    const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x2d5a2d });
    
    // Create undulating grass field
    grassField = new THREE.Mesh(grassGeometry, grassMaterial);
    grassField.rotation.x = -Math.PI / 2;
    grassField.receiveShadow = true;
    
    // Add some random height variation
    const vertices = grassField.geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
        vertices[i + 2] = Math.random() * 2 - 1;
    }
    grassField.geometry.attributes.position.needsUpdate = true;
    
    scene.add(grassField);
    
    // Add some trees
    for (let i = 0; i < 20; i++) {
        const tree = createTree();
        tree.position.set(
            (Math.random() - 0.5) * 80,
            0,
            (Math.random() - 0.5) * 80
        );
        tree.userData.type = 'tree';
        scene.add(tree);
        backgroundObjects.push(tree);
    }
    
    // Add sheep
    for (let i = 0; i < 15; i++) {
        const sheep = createSheep();
        sheep.position.set(
            (Math.random() - 0.5) * 60,
            1,
            (Math.random() - 0.5) * 60
        );
        sheep.userData.type = 'sheep';
        scene.add(sheep);
        backgroundObjects.push(sheep);
    }
}

// Create still waters environment
function createStillWaters() {
    const waterGeometry = new THREE.PlaneGeometry(50, 50, 32, 32);
    const waterMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x4a90e2,
        transparent: true,
        opacity: 0.8
    });
    
    waterSurface = new THREE.Mesh(waterGeometry, waterMaterial);
    waterSurface.rotation.x = -Math.PI / 2;
    waterSurface.position.y = 0.1;
    scene.add(waterSurface);
    
    // Add ripple effect
    const rippleGeometry = new THREE.RingGeometry(0.1, 2, 16);
    const rippleMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x87ceeb,
        transparent: true,
        opacity: 0.3
    });
    
    for (let i = 0; i < 5; i++) {
        const ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
        ripple.position.set(
            (Math.random() - 0.5) * 40,
            0.2,
            (Math.random() - 0.5) * 40
        );
        ripple.rotation.x = -Math.PI / 2;
        ripple.userData.type = 'ripple';
        scene.add(ripple);
        backgroundObjects.push(ripple);
    }
}

// Create right paths environment
function createRightPaths() {
    const pathGeometry = new THREE.PlaneGeometry(100, 5, 32, 4);
    const pathMaterial = new THREE.MeshLambertMaterial({ color: 0x8b7355 });
    
    const path = new THREE.Mesh(pathGeometry, pathMaterial);
    path.rotation.x = -Math.PI / 2;
    path.position.y = 0.1;
    path.userData.type = 'path';
    scene.add(path);
    backgroundObjects.push(path);
    
    // Add path stones
    for (let i = 0; i < 30; i++) {
        const stone = createStone();
        stone.position.set(
            (Math.random() - 0.5) * 4,
            0.2,
            (Math.random() - 0.5) * 90
        );
        stone.userData.type = 'stone';
        scene.add(stone);
        backgroundObjects.push(stone);
    }
}

// Create dark valley environment
function createDarkValley() {
    // Create mountain silhouettes
    for (let i = 0; i < 8; i++) {
        const mountain = createMountain();
        mountain.position.set(
            (Math.random() - 0.5) * 100,
            0,
            -30 - Math.random() * 20
        );
        mountain.userData.type = 'mountain';
        scene.add(mountain);
        backgroundObjects.push(mountain);
    }
    
    // Add fog effect
    scene.fog = new THREE.Fog(0x000000, 10, 100);
}

// Create feast table environment
function createFeastTable() {
    const tableGeometry = new THREE.BoxGeometry(6, 0.2, 3);
    const tableMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
    
    feastTable = new THREE.Mesh(tableGeometry, tableMaterial);
    feastTable.position.y = 1;
    feastTable.castShadow = true;
    scene.add(feastTable);
    
    // Add feast items
    for (let i = 0; i < 10; i++) {
        const item = createFeastItem();
        item.position.set(
            (Math.random() - 0.5) * 5,
            1.5,
            (Math.random() - 0.5) * 2.5
        );
        item.userData.type = 'feast';
        scene.add(item);
        backgroundObjects.push(item);
    }
    
    // Add golden cup
    goldenCup = createGoldenCup();
    goldenCup.position.set(0, 1.5, 0);
    scene.add(goldenCup);
}

// Create heavenly home environment
function createHeavenlyHome() {
    // Add glowing particles
    createHeavenlyParticles();
    
    // Add pillars
    for (let i = 0; i < 6; i++) {
        const pillar = createPillar();
        const angle = (i / 6) * Math.PI * 2;
        pillar.position.set(
            Math.cos(angle) * 15,
            0,
            Math.sin(angle) * 15
        );
        pillar.userData.type = 'pillar';
        scene.add(pillar);
        backgroundObjects.push(pillar);
    }
}

// Helper functions to create objects
function createTree() {
    const group = new THREE.Group();
    
    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 6);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 3;
    trunk.castShadow = true;
    group.add(trunk);
    
    // Leaves
    const leavesGeometry = new THREE.SphereGeometry(3, 8, 8);
    const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228b22 });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = 7;
    leaves.castShadow = true;
    group.add(leaves);
    
    return group;
}

function createSheep() {
    const group = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.SphereGeometry(1, 8, 8);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xf5f5dc });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.scale.set(1.2, 0.8, 1);
    body.castShadow = true;
    group.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.6, 8, 8);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.set(0, 0.3, 1.2);
    head.castShadow = true;
    group.add(head);
    
    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1);
    const legMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    
    for (let i = 0; i < 4; i++) {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(
            (i % 2 === 0 ? -0.5 : 0.5),
            -0.5,
            (i < 2 ? 0.5 : -0.5)
        );
        leg.castShadow = true;
        group.add(leg);
    }
    
    return group;
}

function createStone() {
    const geometry = new THREE.SphereGeometry(0.2, 6, 6);
    const material = new THREE.MeshLambertMaterial({ color: 0x696969 });
    const stone = new THREE.Mesh(geometry, material);
    stone.scale.set(1, 0.5, 1);
    stone.castShadow = true;
    return stone;
}

function createMountain() {
    const geometry = new THREE.ConeGeometry(5, 15, 8);
    const material = new THREE.MeshLambertMaterial({ color: 0x2f2f2f });
    const mountain = new THREE.Mesh(geometry, material);
    mountain.position.y = 7.5;
    mountain.castShadow = true;
    return mountain;
}

function createFeastItem() {
    const geometry = new THREE.SphereGeometry(0.3, 8, 8);
    const colors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0x96ceb4, 0xfeca57];
    const material = new THREE.MeshLambertMaterial({ 
        color: colors[Math.floor(Math.random() * colors.length)]
    });
    const item = new THREE.Mesh(geometry, material);
    item.castShadow = true;
    return item;
}

function createGoldenCup() {
    const geometry = new THREE.CylinderGeometry(0.8, 0.6, 1.5, 8);
    const material = new THREE.MeshLambertMaterial({ color: 0xffd700 });
    const cup = new THREE.Mesh(geometry, material);
    cup.castShadow = true;
    
    // Add overflow effect
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const particles = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        particles[i] = (Math.random() - 0.5) * 2;
        particles[i + 1] = Math.random() * 3 + 1;
        particles[i + 2] = (Math.random() - 0.5) * 2;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particles, 3));
    const particleMaterial = new THREE.PointsMaterial({ 
        color: 0xffd700,
        size: 0.1,
        transparent: true,
        opacity: 0.8
    });
    
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    cup.add(particleSystem);
    
    return cup;
}

function createPillar() {
    const geometry = new THREE.CylinderGeometry(1, 1, 12, 8);
    const material = new THREE.MeshLambertMaterial({ color: 0xf0f0f0 });
    const pillar = new THREE.Mesh(geometry, material);
    pillar.position.y = 6;
    pillar.castShadow = true;
    return pillar;
}

function createHeavenlyParticles() {
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const particles = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        particles[i] = (Math.random() - 0.5) * 100;
        particles[i + 1] = Math.random() * 50;
        particles[i + 2] = (Math.random() - 0.5) * 100;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particles, 3));
    const particleMaterial = new THREE.PointsMaterial({ 
        color: 0xffffff,
        size: 0.3,
        transparent: true,
        opacity: 0.8
    });
    
    heavenlyGlow = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(heavenlyGlow);
}

// Update scene based on current verse
function updateScene(verseIndex) {
    // Hide all objects first
    backgroundObjects.forEach(obj => {
        obj.visible = false;
    });
    
    // Reset fog
    scene.fog = null;
    
    // Update lighting and environment based on verse
    switch(verseIndex) {
        case 0: // The Lord is my shepherd
            ambientLight.intensity = 0.4;
            directionalLight.color.setHex(0xffffff);
            directionalLight.intensity = 0.8;
            camera.position.set(0, 8, 15);
            showGreenPastures();
            break;
            
        case 1: // Green pastures, still waters
            ambientLight.intensity = 0.5;
            directionalLight.color.setHex(0x87ceeb);
            directionalLight.intensity = 0.7;
            camera.position.set(0, 6, 12);
            showStillWaters();
            break;
            
        case 2: // Right paths
            ambientLight.intensity = 0.4;
            directionalLight.color.setHex(0xffa500);
            directionalLight.intensity = 0.6;
            camera.position.set(0, 5, 10);
            showRightPaths();
            break;
            
        case 3: // Dark valley
            ambientLight.intensity = 0.2;
            directionalLight.color.setHex(0x4169e1);
            directionalLight.intensity = 0.3;
            camera.position.set(0, 3, 8);
            showDarkValley();
            break;
            
        case 4: // Feast table
            ambientLight.intensity = 0.6;
            directionalLight.color.setHex(0xffd700);
            directionalLight.intensity = 0.9;
            camera.position.set(0, 4, 8);
            showFeastTable();
            break;
            
        case 5: // House of the Lord
            ambientLight.intensity = 0.8;
            directionalLight.color.setHex(0xffffff);
            directionalLight.intensity = 1.0;
            camera.position.set(0, 10, 20);
            showHeavenlyHome();
            break;
    }
    
    // Animate camera to new position
    animateCamera();
}

// Show specific environments
function showGreenPastures() {
    if (grassField) grassField.visible = true;
    backgroundObjects.forEach(obj => {
        if (obj.userData.type === 'tree' || obj.userData.type === 'sheep') {
            obj.visible = true;
        }
    });
}

function showStillWaters() {
    if (waterSurface) waterSurface.visible = true;
    backgroundObjects.forEach(obj => {
        if (obj.userData.type === 'ripple') {
            obj.visible = true;
        }
    });
}

function showRightPaths() {
    backgroundObjects.forEach(obj => {
        if (obj.userData.type === 'path' || obj.userData.type === 'stone') {
            obj.visible = true;
        }
    });
}

function showDarkValley() {
    scene.fog = new THREE.Fog(0x000000, 10, 100);
    backgroundObjects.forEach(obj => {
        if (obj.userData.type === 'mountain') {
            obj.visible = true;
        }
    });
}

function showFeastTable() {
    if (feastTable) feastTable.visible = true;
    if (goldenCup) goldenCup.visible = true;
    backgroundObjects.forEach(obj => {
        if (obj.userData.type === 'feast') {
            obj.visible = true;
        }
    });
}

function showHeavenlyHome() {
    if (heavenlyGlow) heavenlyGlow.visible = true;
    backgroundObjects.forEach(obj => {
        if (obj.userData.type === 'pillar') {
            obj.visible = true;
        }
    });
}

// Animate camera movement
function animateCamera() {
    // Smooth camera transition would go here
    // For now, we'll use a simple position update
}

// Navigation functions
function nextVerse() {
    if (currentVerse < totalVerses - 1) {
        currentVerse++;
        updateVerse();
    }
}

function previousVerse() {
    if (currentVerse > 0) {
        currentVerse--;
        updateVerse();
    }
}

function updateVerse() {
    // Hide all verses
    for (let i = 0; i < totalVerses; i++) {
        document.getElementById(`verse-${i}`).classList.remove('active');
    }
    
    // Show current verse
    document.getElementById(`verse-${currentVerse}`).classList.add('active');
    
    // Update 3D scene
    updateScene(currentVerse);
    
    // Update progress bar
    const progress = ((currentVerse + 1) / totalVerses) * 100;
    document.getElementById('progress').style.width = progress + '%';
    
    // Update navigation buttons
    document.getElementById('prevBtn').style.opacity = currentVerse === 0 ? '0.5' : '1';
    document.getElementById('nextBtn').style.opacity = currentVerse === totalVerses - 1 ? '0.5' : '1';
}

function toggleAutoPlay() {
    const autoBtn = document.getElementById('autoBtn');
    
    if (isAutoPlay) {
        clearInterval(autoPlayInterval);
        isAutoPlay = false;
        autoBtn.textContent = 'Auto Play';
    } else {
        autoPlayInterval = setInterval(() => {
            if (currentVerse < totalVerses - 1) {
                nextVerse();
            } else {
                currentVerse = 0;
                updateVerse();
            }
        }, 8000);
        isAutoPlay = true;
        autoBtn.textContent = 'Stop Auto';
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Animate particles and effects
    if (heavenlyGlow) {
        heavenlyGlow.rotation.y += 0.001;
    }
    
    if (goldenCup && goldenCup.children[0]) {
        goldenCup.children[0].rotation.y += 0.02;
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
            obj.position.x += (Math.random() - 0.5) * 0.01;
            obj.position.z += (Math.random() - 0.5) * 0.01;
        }
    });
    
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Touch/swipe support for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
            previousVerse();
        } else {
            nextVerse();
        }
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowRight':
        case ' ':
            nextVerse();
            break;
        case 'ArrowLeft':
            previousVerse();
            break;
        case 'Home':
            currentVerse = 0;
            updateVerse();
            break;
        case 'End':
            currentVerse = totalVerses - 1;
            updateVerse();
            break;
    }
});

// Initialize everything when page loads
window.addEventListener('load', init);

// Set object types for visibility control
function setObjectTypes() {
    backgroundObjects.forEach(obj => {
        // This would be set during object creation based on what type they are
        // For now, we'll handle this in the creation functions
    });
}

// Start the experience
console.log('Psalm 23 - The Lord is My Shepherd - Interactive Experience Loading...');