function addDownloadButtonToVideoContainers() {
    console.log('Adding download button to video containers');
    // Find all video containers (adjust selector as needed)
    document.querySelectorAll('div > video[src]').forEach((video) => {
        // Prevent adding multiple buttons
        if (video.parentElement.querySelector('.video-download-btn')) return;

        const src = video.getAttribute('src');
        if (!src) return;

        // Ensure parent is positioned relatively for absolute positioning
        const parent = video.parentElement;
        if (window.getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }

        // Create the download button
        const btn = document.createElement('a');
        btn.textContent = 'Download Video';
        btn.href = src;
        btn.download = '';
        btn.className = 'video-download-btn';
        btn.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 10;
      padding: 6px 12px;
      background: #007bff;
      color: #fff;
      border-radius: 4px;
      text-decoration: none;
      font-size: 14px;
    `;

        // Insert after the video
        video.parentElement.appendChild(btn);
    });
}

// Run on load and on DOM changes (for dynamic content)
addDownloadButtonToVideoContainers();
const observer = new MutationObserver(addDownloadButtonToVideoContainers);
observer.observe(document.body, { childList: true, subtree: true });
console.log('Content script loaded');
alert('Content script loaded');
