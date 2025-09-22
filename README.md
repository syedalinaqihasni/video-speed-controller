# Video Speed Controller Chrome Extension

A powerful Chrome extension that gives you complete control over video playback speed on any website.

## Features

- **Universal Video Control**: Works on any website with video content (YouTube, Netflix, Vimeo, etc.)
- **Speed Range**: Adjust speed from 0.25x to 5x with precise control
- **Quick Speed Buttons**: One-click buttons for common speeds (0.25x, 0.5x, 1x, 1.5x, 2x, 3x, 4x, 5x)
- **Custom Speed Slider**: Fine-tune speed with a smooth slider control
- **Keyboard Shortcuts**: 
  - `Ctrl/Alt + -`: Decrease speed by 0.25x
  - `Ctrl/Alt + +`: Increase speed by 0.25x
  - `Ctrl/Alt + 0`: Reset to normal speed
- **Visual Speed Indicator**: Shows current speed overlay on videos
- **Real-time Detection**: Automatically detects new videos on dynamic pages
- **Beautiful UI**: Modern, intuitive popup interface

## Installation

### From Chrome Web Store (Coming Soon)
1. Visit the Chrome Web Store
2. Search for "Video Speed Controller"
3. Click "Add to Chrome"

### Manual Installation (Development)
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension icon will appear in your browser toolbar

## How to Use

1. **Navigate to any website with videos**
2. **Click the extension icon** in your browser toolbar
3. **Use the controls**:
   - Click speed buttons for quick changes
   - Use the slider for precise control
   - Use increase/decrease buttons for fine adjustments
   - Click reset to return to normal speed

## Keyboard Shortcuts

- `Ctrl + -` or `Alt + -`: Decrease speed by 0.25x
- `Ctrl + +` or `Alt + +`: Increase speed by 0.25x  
- `Ctrl + 0` or `Alt + 0`: Reset to normal speed (1x)

## Supported Websites

This extension works on virtually any website with HTML5 video players, including:

- YouTube
- Netflix  
- Vimeo
- Twitch
- Amazon Prime Video
- Disney+
- Local video files
- Educational platforms
- And many more!

## Privacy

This extension:
- ✅ Only accesses the current active tab when you click the extension
- ✅ Does not collect or transmit any personal data
- ✅ Works entirely locally in your browser
- ✅ No external servers or analytics

## Technical Details

- Built with modern JavaScript (ES6+)
- Uses Chrome Extension Manifest V3
- Responsive design with Tailwind CSS
- Real-time video detection with MutationObserver
- Cross-platform keyboard shortcuts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have suggestions:
1. Check the browser console for any error messages
2. Ensure the extension has permission to access the current website
3. Try refreshing the page and clicking the extension icon again
4. Report issues with detailed steps to reproduce

## Changelog

### Version 1.0.0
- Initial release
- Universal video speed control
- Speed range 0.25x to 5x
- Keyboard shortcuts
- Real-time video detection
- Modern UI with animations