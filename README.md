# Psalm 23 - Immersive Mobile Screensaver

A beautiful, immersive 2.5D scrolling screensaver experience displaying Psalm 23, optimized specifically for mobile Safari. Inspired by Roku's background screensavers, this creates a meditative, flowing experience perfect for biblical reflection.

## Features

### Visual Effects
- **2.5D Parallax Scrolling**: Multiple background layers that move at different speeds to create depth
- **Floating Particles**: Subtle animated particles that drift upward for an ethereal effect
- **Light Rays**: Animated light beams that sweep across the screen
- **Gradient Backgrounds**: Smooth, shifting color gradients that change over time
- **Shimmer Effects**: Subtle light reflections across verse containers

### Typography & Text
- **Elegant Fonts**: Uses Cinzel and Cormorant Garamond for beautiful, readable typography
- **Highlighted Keywords**: Key phrases glow with golden highlighting
- **Staggered Animations**: Verses fade in sequentially for dramatic effect
- **Responsive Text**: Scales perfectly across all mobile device sizes

### Interactive Features
- **Auto-Scrolling**: Automatically scrolls through the psalm at a comfortable reading pace
- **Touch Interactions**: Responsive to touch gestures with momentum scrolling
- **Intersection Observer**: Verses animate as they come into view
- **Auto-Restart**: Seamlessly loops back to the beginning when finished

### Mobile Safari Optimizations
- **Viewport Height Fix**: Handles Safari's dynamic viewport height
- **Zoom Prevention**: Prevents unwanted zoom on double-tap and pinch gestures
- **Hardware Acceleration**: Uses GPU acceleration for smooth animations
- **Touch Optimization**: Optimized touch event handling for fluid interaction
- **Performance Monitoring**: Pauses animations when tab is not visible

## Usage

1. **Desktop Development**: Open `index.html` in any modern browser
2. **Mobile Testing**: Use browser developer tools to simulate mobile devices
3. **Production**: Deploy to any web server and access via mobile Safari

### Mobile Safari Setup
1. Open the webpage in Safari on iPhone/iPad
2. Tap the share button and select "Add to Home Screen"
3. The app will now function as a full-screen screensaver

### Controls
- **Touch**: Tap and drag to manually scroll
- **Auto-Scroll**: Automatically resumes after 3 seconds of inactivity
- **Orientation**: Works in both portrait and landscape modes

## Technical Details

### File Structure
```
├── index.html          # Main HTML structure
├── styles.css          # All CSS animations and styling
├── script.js           # JavaScript interactivity
└── README.md          # This documentation
```

### Browser Compatibility
- **Primary**: Mobile Safari (iOS 12+)
- **Secondary**: Chrome Mobile, Firefox Mobile
- **Desktop**: Chrome, Firefox, Safari, Edge

### Performance Features
- GPU-accelerated animations using `transform3d`
- Efficient event handling with passive listeners
- Intersection Observer for optimal scroll detection
- RequestAnimationFrame for smooth animations
- Debounced resize handling

### Accessibility
- Respects `prefers-reduced-motion` setting
- High contrast mode support
- Semantic HTML structure
- Keyboard navigation support

## Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-gold: #ffd700;
    --background-dark: #1a1a2e;
    --text-white: #ffffff;
}
```

### Adjusting Scroll Speed
Modify the `autoScrollSpeed` in `script.js`:
```javascript
this.autoScrollSpeed = 0.5; // Increase for faster scrolling
```

### Adding New Verses
Add new verse elements to the HTML and update the CSS animation delays accordingly.

## Biblical Text

The screensaver displays Psalm 23 (ESV), one of the most beloved passages in the Bible:

> *The Lord is my shepherd; I shall not want.  
> He makes me lie down in green pastures.  
> He leads me beside still waters.  
> He restores my soul...*

## Development Notes

### Mobile Safari Considerations
- Uses `calc(var(--vh, 1vh) * 100)` for proper viewport height
- Prevents zoom with gesture event handlers
- Optimized touch event handling for smooth scrolling
- Hardware acceleration for all animations

### Performance Optimizations
- Uses `will-change` CSS property for animated elements
- Implements intersection observer for efficient scroll detection
- Dynamic particle system with automatic cleanup
- Animation frame optimization for 60fps performance

## Future Enhancements

- Additional biblical passages
- Customizable themes and colors
- Audio narration support
- Multiple language translations
- Sharing functionality

## License

This project is designed for spiritual reflection and meditation. Feel free to use and modify for personal or ministry purposes.

---

*"He leads me beside still waters. He restores my soul."* - Psalm 23:2-3