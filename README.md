# AI ClipCatcher

A Chrome extension that helps you find and download AI-generated content such as videos from web pages.

## Features

- Adds download buttons to video elements on supported websites
- Works with AI platforms like Sora (ChatGPT)
- Easy access to AI tools and resources
- Lightweight and easy to use

## Supported Sites

- Sora ChatGPT ([https://sora.chatgpt.com](https://sora.chatgpt.com))

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the extension directory
5. The AI ClipCatcher icon should now appear in your browser toolbar

## Usage

1. Visit a supported website containing AI-generated videos
2. Hover over a video to see the download button
3. Click the download button to save the video to your computer
4. Videos will be saved to the configured download folder (by default "ai-video" folder in your Downloads)

### Customizing Download Location

1. Click on the AI ClipCatcher icon in your browser toolbar to open the settings
2. Enter your desired subfolder name in the "Download Folder Path" field
3. Click "Save Settings" to apply changes

Note: Due to browser security restrictions, Chrome extensions can only save files to subfolders within your default downloads directory, not to arbitrary locations like "/Users/kzaman/ai-video". The extension creates a subfolder in your Downloads directory.

## Development

This extension is built with vanilla JavaScript and uses Chrome's Extension Manifest V3.

### Project Structure

```md
ai-extension/
├── icons/
│   └── favicon.png
├── background.js
├── index.html
├── manifest.json
├── popup.js
├── script.js
└── README.md
```

## Author

[Kamruzzaman](https://kzaman.me)

## Version

1.0.0
