// Content script to handle video speed control
class VideoSpeedManager {
  constructor() {
    this.videos = new Set();
    this.observer = null;
    this.init();
  }

  init() {
    this.detectVideos();
    this.setupMutationObserver();
    this.setupKeyboardShortcuts();
  }

  detectVideos() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      if (!this.videos.has(video)) {
        this.videos.add(video);
        this.setupVideoListeners(video);
      }
    });
  }

  setupVideoListeners(video) {
    // Store original playback rate
    if (!video.hasAttribute('data-original-rate')) {
      video.setAttribute('data-original-rate', video.playbackRate || 1.0);
    }

    // Add speed control indicator
    this.addSpeedIndicator(video);
  }

  addSpeedIndicator(video) {
    // Skip if indicator already exists
    if (video.parentElement.querySelector('.speed-indicator')) {
      return;
    }

    const indicator = document.createElement('div');
    indicator.className = 'speed-indicator';
    indicator.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-family: monospace;
      z-index: 9999;
      pointer-events: none;
      transition: opacity 0.3s ease;
      opacity: 0;
    `;
    
    // Position the indicator relative to the video
    if (video.parentElement.style.position !== 'relative') {
      video.parentElement.style.position = 'relative';
    }
    
    video.parentElement.appendChild(indicator);

    // Update indicator when speed changes
    const updateIndicator = () => {
      const speed = video.playbackRate || 1.0;
      indicator.textContent = `${speed}x`;
      
      // Show indicator briefly when speed changes
      indicator.style.opacity = '1';
      setTimeout(() => {
        indicator.style.opacity = '0';
      }, 2000);
    };

    // Listen for rate changes
    video.addEventListener('ratechange', updateIndicator);
    
    // Initial update
    updateIndicator();
  }

  setupMutationObserver() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check for new videos
            if (node.tagName === 'VIDEO') {
              if (!this.videos.has(node)) {
                this.videos.add(node);
                this.setupVideoListeners(node);
              }
            } else {
              // Check for videos within added elements
              const videos = node.querySelectorAll && node.querySelectorAll('video');
              if (videos) {
                videos.forEach(video => {
                  if (!this.videos.has(video)) {
                    this.videos.add(video);
                    this.setupVideoListeners(video);
                  }
                });
              }
            }
          }
        });
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Only work when not typing in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      const videos = document.querySelectorAll('video');
      if (videos.length === 0) return;

      switch (e.code) {
        case 'Minus':
        case 'NumpadSubtract':
          if (e.ctrlKey || e.altKey) {
            e.preventDefault();
            this.adjustSpeed(videos, -0.25);
          }
          break;
        case 'Equal':
        case 'NumpadAdd':
          if (e.ctrlKey || e.altKey) {
            e.preventDefault();
            this.adjustSpeed(videos, 0.25);
          }
          break;
        case 'Digit0':
        case 'Numpad0':
          if (e.ctrlKey || e.altKey) {
            e.preventDefault();
            this.setSpeed(videos, 1.0);
          }
          break;
      }
    });
  }

  adjustSpeed(videos, delta) {
    videos.forEach(video => {
      const currentSpeed = video.playbackRate || 1.0;
      const newSpeed = Math.max(0.25, Math.min(5.0, currentSpeed + delta));
      video.playbackRate = newSpeed;
    });
  }

  setSpeed(videos, speed) {
    videos.forEach(video => {
      video.playbackRate = speed;
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new VideoSpeedManager();
  });
} else {
  new VideoSpeedManager();
}