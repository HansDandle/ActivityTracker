# Chrome Extension Setup Instructions

## Creating Your Task Tracker Chrome Extension

### Step 1: Create Extension Icons
You need to create icon files in the `icons/` folder:
- `icon16.png` (16x16 pixels)
- `icon32.png` (32x32 pixels) 
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

**Quick way to create icons:**
1. Use any design tool (Canva, Figma, or even Paint)
2. Create a simple icon with the letters "TT" or a clock/timer symbol
3. Use the gradient colors from your app: #667eea to #764ba2
4. Export in the required sizes
5. Save them in the `icons/` folder

### Step 2: Load the Extension in Chrome

1. **Open Chrome Extension Management:**
   - Type `chrome://extensions/` in your address bar
   - OR Menu → More Tools → Extensions

2. **Enable Developer Mode:**
   - Toggle "Developer mode" in the top-right corner

3. **Load Your Extension:**
   - Click "Load unpacked"
   - Select your Task Tracker folder (`c:\Users\brixw\Desktop\code\Task Tracker`)
   - The extension will appear in your extensions list

4. **Pin the Extension:**
   - Click the puzzle piece icon in Chrome toolbar
   - Find "Task Tracker" and click the pin icon
   - Now you'll see the Task Tracker icon in your toolbar

### Step 3: Using Your Extension

- Click the Task Tracker icon in Chrome toolbar
- The popup will open with your full task tracker
- All data is saved locally using Chrome's storage API
- Works offline and syncs across your Chrome instances

### Features in Chrome Extension:

✅ **Compact Design**: Optimized 400px wide popup
✅ **Full Functionality**: All features from the web version
✅ **Chrome Storage**: Uses Chrome's storage API (more reliable than localStorage)
✅ **Download Integration**: CSV exports use Chrome's download API
✅ **Always Available**: Access from any tab with one click
✅ **Offline Support**: Works without internet connection

### File Structure:
```
Task Tracker/
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup interface
├── popup-styles.css       # Optimized styles for popup
├── popup-script.js        # Extension-specific JavaScript
├── icons/                 # Extension icons folder
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── index.html             # Original web version
├── styles.css             # Original web styles
└── script.js             # Original web JavaScript
```

### Troubleshooting:

**If extension doesn't load:**
- Check that all icon files exist in the icons folder
- Verify manifest.json syntax is correct
- Look for errors in Chrome's extension management page

**If popup is too small:**
- The popup is optimized for 400px width
- Maximum height is 600px as per Chrome limits
- Scroll is enabled for longer content

**For development:**
- Use the original `index.html` file for testing in a regular browser
- The extension files (`popup.*`) are specifically optimized for Chrome extension environment

### Publishing to Chrome Web Store:

1. Create icons as described above
2. Test thoroughly in developer mode
3. Create a developer account at Chrome Web Store
4. Upload your extension folder as a ZIP file
5. Fill out store listing details
6. Submit for review

Your Task Tracker is now a fully functional Chrome extension! 🎉