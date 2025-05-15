// background.js - Handles background tasks for the extension

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'download') {
        // Extract download parameters from the message
        const { url, filename, folderPath } = message;

        // Start the download
        chrome.downloads.download(
            {
                url: url,
                filename: `${folderPath}/${filename}`,
                saveAs: false
            },
            (downloadId) => {
                if (chrome.runtime.lastError) {
                    console.error('Download failed:', chrome.runtime.lastError);
                    sendResponse({ success: false, error: chrome.runtime.lastError.message });
                } else {
                    sendResponse({ success: true, downloadId });
                }
            }
        );

        // Return true to indicate that the response will be sent asynchronously
        return true;
    }
});

// Listen for storage changes to update settings across all contexts
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.downloadFolderPath) {
        console.log('Download folder path updated:', changes.downloadFolderPath.newValue);
    }
});
