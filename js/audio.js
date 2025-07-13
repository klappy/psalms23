/**
 * Advanced Audio Management System for Psalm 23 Experience
 * Handles ambient sounds, spatial audio, and procedural audio generation
 */

class AudioManager {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.ambientGain = null;
        this.effectsGain = null;
        this.sounds = new Map();
        this.spatialSounds = new Map();
        this.isInitialized = false;
        this.isEnabled = true;
        this.masterVolume = 0.7;
        this.ambientVolume = 0.4;
        this.effectsVolume = 0.6;
        
        // Audio contexts for different scene types
        this.audioContexts = {
            pastoral: null,
            water: null,
            valley: null,
            comfort: null,
            feast: null,
            eternal: null
        };
        
        // Procedural audio generators
        this.generators = {
            wind: null,
            water: null,
            birds: null,
            footsteps: null
        };
        
        this.initializeAudio();
    }

    async initializeAudio() {
        if (this.isInitialized) return;
        
        try {
            // Create Web Audio API context
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create master gain node
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);
            this.masterGain.gain.value = this.masterVolume;
            
            // Create ambient and effects gain nodes
            this.ambientGain = this.context.createGain();
            this.ambientGain.connect(this.masterGain);
            this.ambientGain.gain.value = this.ambientVolume;
            
            this.effectsGain = this.context.createGain();
            this.effectsGain.connect(this.masterGain);
            this.effectsGain.gain.value = this.effectsVolume;
            
            // Initialize procedural generators
            this.initializeProcedurals();
            
            this.isInitialized = true;
            console.log('Audio system initialized successfully');
        } catch (error) {
            console.warn('Audio initialization failed:', error);
            this.isEnabled = false;
        }
    }

    initializeProcedurals() {
        // Wind generator using pink noise
        this.generators.wind = this.createWindGenerator();
        
        // Water generator using filtered noise
        this.generators.water = this.createWaterGenerator();
        
        // Bird generator using oscillators
        this.generators.birds = this.createBirdGenerator();
        
        // Footsteps generator
        this.generators.footsteps = this.createFootstepsGenerator();
    }

    createWindGenerator() {
        const bufferSize = 4096;
        const audioBuffer = this.context.createBuffer(2, bufferSize, this.context.sampleRate);
        
        // Generate pink noise for wind
        for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
            const buffer = audioBuffer.getChannelData(channel);
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                
                buffer[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
                b6 = white * 0.115926;
            }
        }
        
        const source = this.context.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;
        
        // Add low-pass filter for wind effect
        const filter = this.context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 200;
        filter.Q.value = 0.5;
        
        source.connect(filter);
        
        return { source, filter, gain: this.context.createGain() };
    }

    createWaterGenerator() {
        const bufferSize = 8192;
        const audioBuffer = this.context.createBuffer(2, bufferSize, this.context.sampleRate);
        
        // Generate water-like noise
        for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
            const buffer = audioBuffer.getChannelData(channel);
            
            for (let i = 0; i < bufferSize; i++) {
                // Create filtered noise that resembles flowing water
                let sample = 0;
                for (let j = 0; j < 8; j++) {
                    sample += Math.sin(Math.random() * Math.PI * 2) * Math.pow(0.5, j);
                }
                buffer[i] = sample * 0.1;
            }
        }
        
        const source = this.context.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;
        
        // Create water-like filtering
        const filter1 = this.context.createBiquadFilter();
        filter1.type = 'bandpass';
        filter1.frequency.value = 800;
        filter1.Q.value = 2;
        
        const filter2 = this.context.createBiquadFilter();
        filter2.type = 'highpass';
        filter2.frequency.value = 200;
        
        source.connect(filter1);
        filter1.connect(filter2);
        
        return { source, filter1, filter2, gain: this.context.createGain() };
    }

    createBirdGenerator() {
        const birds = [];
        
        // Create multiple bird oscillators
        for (let i = 0; i < 3; i++) {
            const oscillator = this.context.createOscillator();
            oscillator.type = 'sine';
            
            const gain = this.context.createGain();
            gain.gain.value = 0;
            
            oscillator.connect(gain);
            
            birds.push({ oscillator, gain });
        }
        
        // Bird song patterns
        const birdSongs = [
            { frequencies: [800, 1200, 900], durations: [0.2, 0.15, 0.3] },
            { frequencies: [600, 800, 1000, 800], durations: [0.1, 0.1, 0.2, 0.1] },
            { frequencies: [1500, 1200, 1800], durations: [0.3, 0.2, 0.4] }
        ];
        
        return { birds, birdSongs };
    }

    createFootstepsGenerator() {
        // Create impulse response for footsteps
        const length = this.context.sampleRate * 0.1;
        const impulse = this.context.createBuffer(2, length, this.context.sampleRate);
        
        for (let channel = 0; channel < impulse.numberOfChannels; channel++) {
            const buffer = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                buffer[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
            }
        }
        
        return { impulse };
    }

    // Scene-specific audio management
    loadSceneAudio(sceneName) {
        if (!this.isEnabled) return;
        
        const sceneAudioConfig = {
            pastoral: {
                ambient: ['wind', 'birds'],
                effects: ['footsteps'],
                volume: 0.3
            },
            water: {
                ambient: ['water', 'wind'],
                effects: ['droplets'],
                volume: 0.4
            },
            valley: {
                ambient: ['wind'],
                effects: ['echo'],
                volume: 0.2
            },
            comfort: {
                ambient: ['gentle_wind'],
                effects: ['heartbeat'],
                volume: 0.35
            },
            feast: {
                ambient: ['celebration'],
                effects: ['toast'],
                volume: 0.5
            },
            eternal: {
                ambient: ['celestial'],
                effects: ['bells'],
                volume: 0.4
            }
        };
        
        const config = sceneAudioConfig[sceneName];
        if (config) {
            this.transitionToScene(sceneName, config);
        }
    }

    transitionToScene(sceneName, config) {
        // Fade out current ambient sounds
        if (this.ambientGain) {
            this.ambientGain.gain.linearRampToValueAtTime(0, this.context.currentTime + 1);
        }
        
        // Setup new scene audio after fade
        setTimeout(() => {
            this.setupSceneAudio(sceneName, config);
            this.ambientGain.gain.linearRampToValueAtTime(config.volume, this.context.currentTime + 2);
        }, 1000);
    }

    setupSceneAudio(sceneName, config) {
        // Start ambient sounds based on scene
        config.ambient.forEach(soundType => {
            this.startAmbientSound(soundType);
        });
        
        // Prepare effects
        config.effects.forEach(effectType => {
            this.prepareEffect(effectType);
        });
    }

    startAmbientSound(soundType) {
        if (!this.isEnabled) return;
        
        const generator = this.generators[soundType];
        if (generator) {
            if (generator.source) {
                generator.gain.connect(this.ambientGain);
                generator.source.start();
            }
        }
    }

    prepareEffect(effectType) {
        // Prepare sound effects for later playback
        this.sounds.set(effectType, {
            type: effectType,
            prepared: true
        });
    }

    // Spatial audio for 3D positioning
    createSpatialSound(soundId, position = { x: 0, y: 0, z: 0 }) {
        if (!this.isEnabled) return null;
        
        const panner = this.context.createPanner();
        panner.panningModel = 'HRTF';
        panner.distanceModel = 'inverse';
        panner.refDistance = 1;
        panner.maxDistance = 10000;
        panner.rolloffFactor = 1;
        panner.coneInnerAngle = 360;
        panner.coneOuterAngle = 0;
        panner.coneOuterGain = 0;
        
        // Set position
        panner.positionX.value = position.x;
        panner.positionY.value = position.y;
        panner.positionZ.value = position.z;
        
        const gain = this.context.createGain();
        gain.connect(panner);
        panner.connect(this.effectsGain);
        
        this.spatialSounds.set(soundId, { panner, gain });
        
        return { panner, gain };
    }

    updateSpatialSound(soundId, position) {
        const spatial = this.spatialSounds.get(soundId);
        if (spatial) {
            spatial.panner.positionX.value = position.x;
            spatial.panner.positionY.value = position.y;
            spatial.panner.positionZ.value = position.z;
        }
    }

    // Procedural sound generation
    playBirdSong() {
        if (!this.isEnabled) return;
        
        const generator = this.generators.birds;
        if (generator) {
            const song = Utils.randomChoice(generator.birdSongs);
            const bird = Utils.randomChoice(generator.birds);
            
            let time = this.context.currentTime;
            song.frequencies.forEach((freq, index) => {
                bird.oscillator.frequency.setValueAtTime(freq, time);
                bird.gain.gain.setValueAtTime(0.1, time);
                bird.gain.gain.linearRampToValueAtTime(0, time + song.durations[index]);
                time += song.durations[index] + 0.1;
            });
        }
    }

    playFootstep() {
        if (!this.isEnabled) return;
        
        const generator = this.generators.footsteps;
        if (generator) {
            const source = this.context.createBufferSource();
            source.buffer = generator.impulse;
            
            const gain = this.context.createGain();
            gain.gain.value = 0.3;
            
            source.connect(gain);
            gain.connect(this.effectsGain);
            
            source.start();
        }
    }

    // Procedural ambient generation
    modulateWind(intensity = 0.5) {
        const generator = this.generators.wind;
        if (generator && generator.filter) {
            const baseFreq = 200;
            const targetFreq = baseFreq + (intensity * 800);
            generator.filter.frequency.linearRampToValueAtTime(targetFreq, this.context.currentTime + 2);
        }
    }

    modulateWater(flow = 0.5) {
        const generator = this.generators.water;
        if (generator) {
            const baseFreq = 800;
            const targetFreq = baseFreq + (flow * 1200);
            generator.filter1.frequency.linearRampToValueAtTime(targetFreq, this.context.currentTime + 1);
        }
    }

    // Volume controls
    setMasterVolume(volume) {
        this.masterVolume = Utils.clamp(volume, 0, 1);
        if (this.masterGain) {
            this.masterGain.gain.linearRampToValueAtTime(this.masterVolume, this.context.currentTime + 0.1);
        }
    }

    setAmbientVolume(volume) {
        this.ambientVolume = Utils.clamp(volume, 0, 1);
        if (this.ambientGain) {
            this.ambientGain.gain.linearRampToValueAtTime(this.ambientVolume, this.context.currentTime + 0.1);
        }
    }

    setEffectsVolume(volume) {
        this.effectsVolume = Utils.clamp(volume, 0, 1);
        if (this.effectsGain) {
            this.effectsGain.gain.linearRampToValueAtTime(this.effectsVolume, this.context.currentTime + 0.1);
        }
    }

    // Audio visualization data
    createAnalyzer() {
        if (!this.isEnabled) return null;
        
        const analyzer = this.context.createAnalyser();
        analyzer.fftSize = 256;
        analyzer.smoothingTimeConstant = 0.8;
        
        this.masterGain.connect(analyzer);
        
        return {
            analyzer,
            dataArray: new Uint8Array(analyzer.frequencyBinCount),
            getFrequencyData() {
                analyzer.getByteFrequencyData(this.dataArray);
                return this.dataArray;
            }
        };
    }

    // Cleanup
    stopAll() {
        if (this.ambientGain) {
            this.ambientGain.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.5);
        }
        
        if (this.effectsGain) {
            this.effectsGain.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.5);
        }
        
        // Clean up generators
        Object.values(this.generators).forEach(generator => {
            if (generator.source) {
                generator.source.stop();
            }
        });
        
        this.spatialSounds.clear();
        this.sounds.clear();
    }

    // Enable/disable audio
    toggle() {
        this.isEnabled = !this.isEnabled;
        if (this.isEnabled) {
            this.setMasterVolume(this.masterVolume);
        } else {
            this.setMasterVolume(0);
        }
        return this.isEnabled;
    }

    // Resume audio context (required for mobile)
    async resume() {
        if (this.context && this.context.state === 'suspended') {
            await this.context.resume();
        }
    }

    // Get audio context state
    getState() {
        return {
            isEnabled: this.isEnabled,
            isInitialized: this.isInitialized,
            masterVolume: this.masterVolume,
            ambientVolume: this.ambientVolume,
            effectsVolume: this.effectsVolume,
            contextState: this.context?.state
        };
    }
}

// Make available globally
window.AudioManager = AudioManager;