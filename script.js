function addDownloadButtonToVideoContainers() {
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
            background-color: red;
            transition: background-color 0.3s ease;
        `;

        const anchor = btn.closest('a');
        const anchorHref = anchor ? anchor.getAttribute('href') : null;

        // if the button is hovered then add overlay to parent
        btn.addEventListener('mouseover', () => {
            if (anchor) {
                anchor.parentElement.style.position = 'relative';
                anchor.parentElement.appendChild(overlay);
                if (anchorHref) {
                    anchor.href = 'javascript:void(0)';
                }
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

        // add event listener
        btn.addEventListener('click', async () => {
            // fetch the video file
            try {
                const response = await fetch(src);
                if (!response.ok) {
                    console.error('Network response was not ok');
                    return;
                }                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                
                // Get filename from URL as base
                let filename = src.split('/').pop() || 'video';
                
                // Determine file extension from Content-Type header
                const contentType = response.headers.get('Content-Type');
                let extension = '';
                
                if (contentType) {
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
                    
                    extension = mimeToExt[contentType] || '.mp4'; // Default to .mp4 if MIME type not recognized
                }
                
                // Remove any existing extension and add the correct one
                filename = filename.replace(/\.[^/.]+$/, '') + (extension || '.mp4');
                
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error downloading video:', error);
            }
        });
    });
}

// Run on load and on DOM changes (for dynamic content)
addDownloadButtonToVideoContainers();
const observer = new MutationObserver(addDownloadButtonToVideoContainers);
observer.observe(document.body, { childList: true, subtree: true });
