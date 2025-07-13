/**
 * Utility functions for the immersive Psalm 23 experience
 */

class Utils {
    // Device and performance detection
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    static isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    static isLowPerformance() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) return true;
        
        const renderer = gl.getParameter(gl.RENDERER);
        return renderer.toLowerCase().includes('software') || 
               renderer.toLowerCase().includes('swiftshader') ||
               navigator.hardwareConcurrency <= 2;
    }

    static getDevicePixelRatio() {
        return Math.min(window.devicePixelRatio || 1, 2);
    }

    // Animation helpers
    static easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    static easeOutElastic(t) {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }

    static lerp(start, end, t) {
        return start + (end - start) * t;
    }

    static map(value, fromMin, fromMax, toMin, toMax) {
        return (value - fromMin) * (toMax - toMin) / (fromMax - fromMin) + toMin;
    }

    // Vector utilities
    static randomSpherePoint() {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        return {
            x: Math.sin(phi) * Math.cos(theta),
            y: Math.sin(phi) * Math.sin(theta),
            z: Math.cos(phi)
        };
    }

    static distance(p1, p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dz = p1.z - p2.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    // Color utilities
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    static rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    static hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        return {
            r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
            g: Math.round(hue2rgb(p, q, h) * 255),
            b: Math.round(hue2rgb(p, q, h - 1/3) * 255)
        };
    }

    // Storage utilities
    static saveToStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
        }
    }

    static loadFromStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('Could not load from localStorage:', e);
            return defaultValue;
        }
    }

    // Performance monitoring
    static createPerformanceMonitor() {
        let frames = 0;
        let lastTime = performance.now();
        let fps = 60;
        
        return {
            update() {
                frames++;
                const now = performance.now();
                if (now - lastTime >= 1000) {
                    fps = Math.round((frames * 1000) / (now - lastTime));
                    frames = 0;
                    lastTime = now;
                }
                return fps;
            },
            getFPS() {
                return fps;
            }
        };
    }

    // Gesture detection
    static createGestureDetector(element) {
        let startX = 0;
        let startY = 0;
        let startTime = 0;
        let isDown = false;
        
        const gestures = {
            onSwipeLeft: null,
            onSwipeRight: null,
            onSwipeUp: null,
            onSwipeDown: null,
            onTap: null,
            onLongPress: null
        };
        
        const threshold = 50;
        const longPressDelay = 500;
        let longPressTimer = null;
        
        const getEventPos = (e) => {
            const touch = e.touches ? e.touches[0] : e;
            return {
                x: touch.clientX,
                y: touch.clientY
            };
        };
        
        const onStart = (e) => {
            e.preventDefault();
            const pos = getEventPos(e);
            startX = pos.x;
            startY = pos.y;
            startTime = Date.now();
            isDown = true;
            
            longPressTimer = setTimeout(() => {
                if (isDown && gestures.onLongPress) {
                    gestures.onLongPress();
                }
            }, longPressDelay);
        };
        
        const onEnd = (e) => {
            if (!isDown) return;
            
            clearTimeout(longPressTimer);
            isDown = false;
            
            const pos = getEventPos(e);
            const deltaX = pos.x - startX;
            const deltaY = pos.y - startY;
            const deltaTime = Date.now() - startTime;
            
            if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold && deltaTime < 300) {
                if (gestures.onTap) gestures.onTap();
                return;
            }
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > threshold && gestures.onSwipeRight) gestures.onSwipeRight();
                else if (deltaX < -threshold && gestures.onSwipeLeft) gestures.onSwipeLeft();
            } else {
                if (deltaY > threshold && gestures.onSwipeDown) gestures.onSwipeDown();
                else if (deltaY < -threshold && gestures.onSwipeUp) gestures.onSwipeUp();
            }
        };
        
        element.addEventListener('touchstart', onStart, { passive: false });
        element.addEventListener('touchend', onEnd, { passive: false });
        element.addEventListener('mousedown', onStart);
        element.addEventListener('mouseup', onEnd);
        
        return gestures;
    }

    // Random utilities
    static random(min, max) {
        return Math.random() * (max - min) + min;
    }

    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    static shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // DOM utilities
    static createElement(tag, className, parent) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (parent) parent.appendChild(element);
        return element;
    }

    static removeElement(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    // Time utilities
    static formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    static debounce(func, wait) {
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

    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // URL utilities
    static getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    static setQueryParam(param, value) {
        const url = new URL(window.location);
        url.searchParams.set(param, value);
        window.history.replaceState({}, '', url);
    }

    // Math utilities
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    static normalize(value, min, max) {
        return (value - min) / (max - min);
    }

    static smoothstep(edge0, edge1, x) {
        const t = this.clamp((x - edge0) / (edge1 - edge0), 0, 1);
        return t * t * (3 - 2 * t);
    }

    // Environment detection
    static supportsWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
        } catch (e) {
            return false;
        }
    }

    static supportsAudio() {
        return !!(window.Audio || window.AudioContext || window.webkitAudioContext);
    }

    static supportsFullscreen() {
        return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || 
                 document.mozFullScreenEnabled || document.msFullscreenEnabled);
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}

// Make available globally
window.Utils = Utils;