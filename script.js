function generateRandomString(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const getExtensionFromContentType = (contentType) => {
    const extension = '.mp4'; // Default extension
    // Map common video MIME types to extensions
    const mimeToExt = {
        'video/mp4': '.mp4',
        'video/webm': '.webm',
        'video/ogg': '.ogv',
        'video/quicktime': '.mov',
        'video/x-matroska': '.mkv',
        'video/x-msvideo': '.avi',
        'video/3gpp': '.3gp',
        'video/x-flv': '.flv'
    };
    return mimeToExt[contentType] || extension; // Default to .mp4 if MIME type not recognized
};

const addSpinner = (element) => {
    element.style.opacity = '0.5';
    element.setAttribute('disabled', 'true'); // Disable the button
    element.textContent = 'Downloading...'; // Change button text
    // Create a spinner element
    const spinner = document.createElement('span');
    spinner.className = 'spinner';
    spinner.style.cssText = `
        border: 2px solid #f3f3f3;
        border-top: 2px solid #3498db;
        border-radius: 50%;
        width: 12px;
        height: 12px;
        animation: spin 1s linear infinite;
        display: inline-block;
        margin-left: 5px;
    `;
    element.appendChild(spinner);
};

const downloadHandler = async (event, src) => {
    // Prevent default behavior and stop event propagation
    event.preventDefault();
    event.stopPropagation();

    // fetch the video file
    try {
        // add a loading spinner
        addSpinner(event.target);
        // Fetch the video file
        const response = await fetch(src);
        if (!response.ok) {
            console.error('Network response was not ok');
            return;
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const anchorEl = document.createElement('a');
        anchorEl.href = url;

        // Determine file extension from Content-Type header
        const contentType = response.headers.get('Content-Type');
        const extension = getExtensionFromContentType(contentType);

        // Generate a random filename
        const filename = generateRandomString();
        anchorEl.download = `${filename}${extension}`;
        document.body.appendChild(anchorEl);
        anchorEl.click();
        anchorEl.remove();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading video:', error);
    } finally {
        // remove the spinner
        const button = event.target;
        button.style.opacity = '1';
        button.removeAttribute('disabled'); // Enable the button
        button.textContent = 'Download'; // Reset button text
        // Remove the spinner element
        const spinner = button.querySelector('.spinner');
        if (spinner) {
            spinner.remove();
        }
    }
};

const addDownloadButtonToVideoContainers = () => {
    console.log('Adding download button to video containers');
    // Find all video containers (adjust selector as needed)
    document.querySelectorAll('div > video[src]').forEach((video) => {
        // Prevent adding multiple buttons
        if (video.parentElement.querySelector('.ai-video-download-btn')) return;

        const src = video.getAttribute('src');
        if (!src) return;

        // Ensure parent is positioned relatively for absolute positioning
        const parent = video.parentElement;
        if (window.getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }

        // Create the download button
        const btn = document.createElement('button');
        btn.textContent = 'Download';
        btn.className = 'ai-video-download-btn';
        btn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 120;
            padding: 6px 12px;
            background: #007bff;
            color: #fff;
            border-radius: 4px;
            text-decoration: none;
            font-size: 14px;
            display: none;
            cursor: pointer;
        `;

        // Insert after the video
        video.parentElement.appendChild(btn);

        // create a overlay div
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 100;
            background-color: rgba(0, 0, 0, 0.5);
            transition: background-color 0.3s ease;
        `;

        const anchor = btn.closest('a');
        const anchorHref = anchor ? anchor.getAttribute('href') : null;

        // if the button is hovered then add overlay to parent
        btn.addEventListener('mouseover', () => {
            if (anchor) {
                anchor.parentElement.style.position = 'relative';
                anchor.parentElement.appendChild(overlay);
                anchor.href = 'javascript:void(0)';
            } else {
                parent.appendChild(overlay);
            }
        });

        // if the button is not hovered then remove overlay from parent
        btn.addEventListener('mouseout', () => {
            // remove overlay from closest anchor tag
            if (anchor) {
                anchor.parentElement.removeChild(overlay);
                if (anchorHref) {
                    anchor.href = anchorHref;
                }
            } else {
                parent.removeChild(overlay);
            }
        });

        // add event listener to the button
        btn.addEventListener('click', (event) => {
            downloadHandler(event, src);
        });

        anchor.addEventListener('mouseover', () => {
            // Show the button on hover
            btn.style.display = 'block';
        });
        anchor.addEventListener('mouseout', () => {
            // Hide the button when not hovered
            btn.style.display = 'none';
        });
    });
};

// Run on load and on DOM changes (for dynamic content)
addDownloadButtonToVideoContainers();
const observer = new MutationObserver(addDownloadButtonToVideoContainers);
observer.observe(document.body, { childList: true, subtree: true });
