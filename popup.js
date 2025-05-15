// popup.js - Handles the extension popup UI

document.addEventListener('DOMContentLoaded', function () {
    // Get references to form elements
    const downloadPathInput = document.getElementById('downloadPath');
    const saveButton = document.getElementById('saveSettings');

    // Load current settings
    chrome.storage.sync.get(['downloadFolderPath'], function (result) {
        if (result.downloadFolderPath) {
            downloadPathInput.value = result.downloadFolderPath;
        }
    });

    // Save settings
    saveButton.addEventListener('click', function () {
        const newPath = downloadPathInput.value.trim();

        // Basic validation - prevent absolute paths that won't work
        if (newPath.startsWith('/') || newPath.match(/^[A-Za-z]:\\/)) {
            alert(
                'Due to browser security restrictions, you cannot use absolute paths. Please enter a relative subfolder name.'
            );
            return;
        }

        // Save the settings
        chrome.storage.sync.set(
            {
                downloadFolderPath: newPath || 'ai-video' // Default to ai-video if empty
            },
            function () {
                // Show success message
                const originalText = saveButton.textContent;
                saveButton.textContent = 'Saved!';
                saveButton.disabled = true;

                // Reset button after 1.5 seconds
                setTimeout(() => {
                    saveButton.textContent = originalText;
                    saveButton.disabled = false;
                }, 1500);
            }
        );
    });
});
