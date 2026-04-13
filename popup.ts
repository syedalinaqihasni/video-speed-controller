class VideoSpeedController {
  constructor() {
    this.currentSpeed = 1.0;
    this.videos = [];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.checkForVideos();
    this.updateUI();
    
    // Add fade-in animation
    document.querySelector('.container').classList.add('fade-in');
  }

  setupEventListeners() {
    // Speed buttons
    document.querySelectorAll('.speed-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const speed = parseFloat(btn.dataset.speed);
        this.setSpeed(speed);
      });
    });

    // Speed slider
    const slider = document.getElementById('speedRange');
    const sliderValue = document.getElementById('sliderValue');
    
    slider.addEventListener('input', (e) => {
      const speed = parseFloat(e.target.value);
      sliderValue.textContent = `${speed}x`;
      this.setSpeed(speed);
    });

    // Control buttons
    document.getElementById('decreaseBtn').addEventListener('click', () => {
      this.decreaseSpeed();
    });

    document.getElementById('increaseBtn').addEventListener('click', () => {
      this.increaseSpeed();
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
      this.setSpeed(1.0);
    });

    // Update current speed periodically
    setInterval(() => {
      this.getCurrentSpeed();
    }, 500);
  }

  async checkForVideos() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const videos = document.querySelectorAll('video');
          return {
            count: videos.length,
            speeds: Array.from(videos).map(v => v.playbackRate || 1.0)
          };
        }
      });

      const { count, speeds } = results[0].result;
      this.updateStatus(count > 0, count);
      
      if (speeds.length > 0) {
        // Use the first video's speed as current speed
        this.currentSpeed = speeds[0];
        this.updateUI();
      }
    } catch (error) {
      console.error('Error checking for videos:', error);
      this.updateStatus(false, 0);
    }
  }

  async getCurrentSpeed() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const videos = document.querySelectorAll('video');
          if (videos.length > 0) {
            return videos[0].playbackRate || 1.0;
          }
          return null;
        }
      });

      const speed = results[0].result;
      if (speed !== null && speed !== this.currentSpeed) {
        this.currentSpeed = speed;
        this.updateUI();
      }
    } catch (error) {
      // Silently handle errors for periodic checks
    }
  }

  async setSpeed(speed) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (newSpeed) => {
          const videos = document.querySelectorAll('video');
          videos.forEach(video => {
            video.playbackRate = newSpeed;
          });
        },
        args: [speed]
      });

      this.currentSpeed = speed;
      this.updateUI();
      
      // Add visual feedback
      this.showSpeedChange(speed);
    } catch (error) {
      console.error('Error setting speed:', error);
    }
  }

  decreaseSpeed() {
    const newSpeed = Math.max(0.25, this.currentSpeed - 0.25);
    this.setSpeed(newSpeed);
  }

  increaseSpeed() {
    const newSpeed = Math.min(5.0, this.currentSpeed + 0.25);
    this.setSpeed(newSpeed);
  }

  updateStatus(hasVideos, count) {
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');

    if (hasVideos) {
      statusIndicator.classList.add('active');
      statusText.textContent = `${count} video${count > 1 ? 's' : ''} detected`;
    } else {
      statusIndicator.classList.remove('active');
      statusText.textContent = 'No videos detected';
    }
  }

  updateUI() {
    // Update current speed display
    document.getElementById('currentSpeed').textContent = `${this.currentSpeed.toFixed(2)}x`;
    
    // Update slider
    const slider = document.getElementById('speedRange');
    const sliderValue = document.getElementById('sliderValue');
    slider.value = this.currentSpeed;
    sliderValue.textContent = `${this.currentSpeed.toFixed(2)}x`;
    
    // Update speed buttons
    document.querySelectorAll('.speed-btn').forEach(btn => {
      const btnSpeed = parseFloat(btn.dataset.speed);
      btn.classList.toggle('active', Math.abs(btnSpeed - this.currentSpeed) < 0.01);
    });

    // Update speed value color based on speed
    const speedValueEl = document.getElementById('currentSpeed');
    if (this.currentSpeed < 1.0) {
      speedValueEl.style.color = '#dc2626'; // Red for slow
    } else if (this.currentSpeed > 1.0) {
      speedValueEl.style.color = '#059669'; // Green for fast
    } else {
      speedValueEl.style.color = '#10b981'; // Default green
    }
  }

  showSpeedChange(speed) {
    // Add a brief highlight effect to show speed change
    const currentSpeedEl = document.getElementById('currentSpeed');
    currentSpeedEl.style.transform = 'scale(1.1)';
    setTimeout(() => {
      currentSpeedEl.style.transform = 'scale(1)';
    }, 200);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new VideoSpeedController();
});