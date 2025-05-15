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
├── .github/
│   └── workflows/
│       ├── release.yml
│       └── validate.yml
├── icons/
│   └── favicon.png
├── background.js
├── index.html
├── manifest.json
├── popup.js
├── README.md
├── release.sh
└── script.js
```

## Author

[Kamruzzaman](https://kzaman.me)

## Version

1.0.0

## Releasing New Versions

This project uses GitHub Actions to automate the release process. When you're ready to release a new version:

1. Update your code and test it thoroughly
2. Use the provided release script which will automatically:
   - Update the version in `manifest.json`
   - Generate a comprehensive changelog
   - Commit the changes
   - Create and push a new tag

```bash
# Example: Release version 1.0.1
./release.sh 1.0.1
```

### Advanced Release Options

The release script supports additional options for more control:

```bash
# Generate and save changelog to a file without creating a release
./release.sh --generate-changelog --output CHANGELOG.md

# Create a release and save the changelog to a file
./release.sh 1.0.1 --output CHANGELOG.md
```

Or do it manually:

```bash
# Update manifest.json version
# Commit changes
git tag v1.0.1
git push origin v1.0.1
```

This will automatically trigger the GitHub workflow that:

- Creates a new GitHub release with detailed changelog
- Groups changes by type (features, bug fixes, documentation, etc.)
- Packages the extension into a ZIP file
- Attaches the ZIP file to the release

The workflow files can be found in `.github/workflows/`.
