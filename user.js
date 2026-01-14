// ==UserScript==
// @name         Gemini Image Downloader & Auto Watermark Remover
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically removes watermarks in-place and provides efficient high-res download options.
// @author       You
// @match        https://gemini.google.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      googleusercontent.com
// @connect      *
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // --- Assets (Base64) ---
    const BG_48_DATA = 'data:image/png;base64,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';
    const BG_96_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAIAAABt+uBvAAAfrElEQVR4nJV9zXNc15Xf75zXIuBUjG45M7GyEahFTMhVMUEvhmQqGYJeRPTG1mokbUL5v5rsaM/CkjdDr4b2RqCnKga9iIHJwqCyMCgvbG/ibparBGjwzpnF+bjnvm7Q9isU2Hj93r3nno/f+bgfJOaZqg4EJfglSkSXMtLAKkRETKqqRMM4jmC1Z5hZVZEXEylUiYgAISKBf8sgiKoqDayqIkJEKBeRArh9++7BwcHn558/+8XRz//30cDDOI7WCxGBCYCIZL9EpKoKEKCqzFzpr09aCzZAb628DjAAggBin5UEBCPfuxcRiIpIG2+On8TuZ9Ot9eg+Pxt9+TkIIDBZL9lU/yLv7Czeeeedra2txWLxzv948KXtL9WxGWuS1HzRvlKAFDpKtm8yGMfRPmc7diVtRcA+8GEYGqMBEDEgIpcABKqkSiIMgYoIKQjCIACqojpmQ+v8IrUuRyVJ9pk2qY7Gpon0AIAAJoG+8Z/eaGQp9vb2UloCFRWI6igQJQWEmGbeCBGI7DMpjFpmBhPPBh/zbAATRCEKZSgn2UzEpGyM1iZCKEhBopzq54IiqGqaWw5VtXAkBl9V3dlUpG2iMD7Yncpcex7eIO/tfb3IDbu7u9kaFTv2Xpi1kMUAmJi5ERDWnZprJm/jomCohjJOlAsFATjJVcIwzFgZzNmKqIg29VNVIiW2RkLD1fGo2hoRQYhBAInAmBW/Z0SD9y9KCmJ9663dVB8o3n77bSJ7HUQ08EBEzMxGFyuxjyqErwLDt1FDpUzfBU6n2w6JYnRlrCCljpXMDFUEv9jZFhDoRAYo8jDwMBiVYcwAYI0Y7xuOAvW3KS0zM7NB5jAMWDPR/jSx77755ny+qGqytbV1/fr11Oscnph+a1PDqphErjnGqqp0eYfKlc1mIz4WdStxDWJms8+0IITdyeWoY2sXgHFalQBiEClctswOBETqPlEASXAdxzGG5L7JsA/A/q1bQDEkAoAbN27kDbN6/1FVHSFjNyS3LKLmW1nVbd9NHsRwxBCoYaKqmpyUREl65IYzKDmaVo1iO0aEccHeGUdXnIo4CB+cdpfmrfHA5eVlEXvzdNp3dxtF4V/39/cFKujIJSIaWMmdReqFjGO2ZpaCUGRXc1COvIIOhbNL3acCQDb2Es5YtIIBI3SUgZw7Ah1VBKpQmH0RlCAQ81noVd16UnKMpOBa93twRbvx9t5ivnC1MQ4Rwaxsd7eyu36wUQzkxDMxmd9Rl6uxyaU+du6/sEBERkMrUmSgY97DyGN7pwlc4UqUuq1q0Cgi6LlrHtY0yNQnv5qMZ/23iHexf/OmhXr5ajZycHC/oklqsT1BAYK1lxy/RtCUNphW0uDCZUdJP3UBCgAwmEYVoiEBmyBEauFJ0w4JnGdWSvCHJHK5TimY3BW5hUqNnoxpNkYiWuzM927sdWakjUfXd3cX83mMzBVcRaAGgo0wOA5YvGZdiMjo5sZEA4NLMK2SKAZpumZDViWMgBjgFoHXq0p7YpberAgA5iC0iMgF7r4fKX/nZDSmqvfu3attrne0f+tWCsmxdhhSlao/yp5SkZkpoj6dtN/rshANptFVfZgtsHAJSKYmREqkDNWxSYM5GjWvpIAoGIJIgkR1lPBrEQCqQiwzM91G+ACGYLHz+q39W5UlTkC5c/f2nWvXrjnQBLKk3WlkdqRQESIGKPwdjxp4Fw4XmaVYKKUQqKE+GEqw4COIIZHwYqkpqtpsLeJOs50ItFpgYoJJL1Dl74lEoobLChbqARiGYX9/XzHV3OzU/tza2rp7925VE44rlcJlTi2VqcplXWeQMfVTmg63Cak+UIIXVQXzbHAzjywnHhsQTtSkoapE3GJiu6Tpp/VYs1PjkcHBl+c7+/v7BKoaQ2SOCCDNb27fuX1... [truncated]

    // --- Styles ---
    const styles = `
        .gemini-downloader-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
          font-family: 'Google Sans', Roboto, sans-serif;
        }
        .gemini-menu-group {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(20px) scale(0.9);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: bottom right;
        }
        .gemini-downloader-fab.expanded .gemini-menu-group {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }
        .main-fab {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          padding: 0;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
          z-index: 10000;
        }
        .gemini-downloader-fab.expanded .main-fab svg {
          transform: rotate(45deg);
        }
        .action-btn {
          padding: 8px 16px;
          min-width: 100px;
          justify-content: flex-start;
        }
        .gemini-btn {
          background: linear-gradient(135deg, #4285f4, #34a853, #fbbc05, #ea4335);
          background-size: 300% 300%;
          border: none;
          border-radius: 24px;
          color: white;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          animation: gradientAnimate 6s ease infinite;
        }
        @keyframes gradientAnimate {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
        .gemini-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }
        .gemini-btn svg {
          width: 20px;
          height: 20px;
          fill: currentColor;
          transition: transform 0.3s;
        }
        .status-pill {
          background: rgba(32, 33, 36, 0.9);
          color: #e8eaed;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          margin-bottom: 4px;
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
          white-space: nowrap;
        }
        .status-pill.visible {
          opacity: 1;
        }
        img[data-watermark-processed="processing"] {
            filter: blur(5px) grayscale(0.5);
            transition: filter 0.3s;
        }
    `;

    const injectStyles = () => {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    };

    // --- Core Logic ---
    function calculateAlphaMap(bgCaptureImageData) {
        const { width, height, data } = bgCaptureImageData;
        const alphaMap = new Float32Array(width * height);
        for (let i = 0; i < alphaMap.length; i++) {
            const idx = i * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const maxChannel = Math.max(r, g, b);
            alphaMap[i] = maxChannel / 255.0;
        }
        return alphaMap;
    }

    const ALPHA_THRESHOLD = 0.002;
    const MAX_ALPHA = 0.99;
    const LOGO_VALUE = 255;

    function removeWatermark(imageData, alphaMap, position) {
        const { x, y, width, height } = position;
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                const imgIdx = ((y + row) * imageData.width + (x + col)) * 4;
                const alphaIdx = row * width + col;
                let alpha = alphaMap[alphaIdx];
                if (alpha < ALPHA_THRESHOLD) continue;
                alpha = Math.min(alpha, MAX_ALPHA);
                const oneMinusAlpha = 1.0 - alpha;
                for (let c = 0; c < 3; c++) {
                    const watermarked = imageData.data[imgIdx + c];
                    const original = (watermarked - alpha * LOGO_VALUE) / oneMinusAlpha;
                    imageData.data[imgIdx + c] = Math.max(0, Math.min(255, Math.round(original)));
                }
            }
        }
    }

    function detectWatermarkConfig(imageWidth, imageHeight) {
        if (imageWidth > 1024 && imageHeight > 1024) {
            return { logoSize: 96, marginRight: 64, marginBottom: 64 };
        } else {
            return { logoSize: 48, marginRight: 32, marginBottom: 32 };
        }
    }

    function calculateWatermarkPosition(imageWidth, imageHeight, config) {
        const { logoSize, marginRight, marginBottom } = config;
        return {
            x: imageWidth - marginRight - logoSize,
            y: imageHeight - marginBottom - logoSize,
            width: logoSize,
            height: logoSize
        };
    }

    class WatermarkEngine {
        constructor(bgCaptures) {
            this.bgCaptures = bgCaptures;
            this.alphaMaps = {};
        }

        static async create() {
            const bg48 = await loadImage(BG_48_DATA);
            const bg96 = await loadImage(BG_96_DATA);
            return new WatermarkEngine({ bg48, bg96 });
        }

        async getAlphaMap(size) {
            if (this.alphaMaps[size]) return this.alphaMaps[size];
            const bgImage = size === 48 ? this.bgCaptures.bg48 : this.bgCaptures.bg96;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(bgImage, 0, 0);
            const imageData = ctx.getImageData(0, 0, size, size);
            const alphaMap = calculateAlphaMap(imageData);
            this.alphaMaps[size] = alphaMap;
            return alphaMap;
        }

        async removeWatermarkFromImage(image) {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const config = detectWatermarkConfig(canvas.width, canvas.height);
            const position = calculateWatermarkPosition(canvas.width, canvas.height, config);
            const alphaMap = await this.getAlphaMap(config.logoSize);
            removeWatermark(imageData, alphaMap, position);
            ctx.putImageData(imageData, 0, 0);
            return canvas;
        }
    }

    let engine = null;
    const processingQueue = new Set();

    const loadImage = (src) => new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });

    const canvasToBlob = (canvas, type = 'image/png') =>
        new Promise(resolve => canvas.toBlob(resolve, type));

    const isValidGeminiImage = (img) => {
        return img.src && img.src.includes('googleusercontent.com') &&
            (img.closest('generated-image') || img.closest('.generated-image-container') || img.alt?.includes('Generated image'));
    };

    const findGeminiImages = () =>
        [...document.querySelectorAll('img')].filter(isValidGeminiImage);

    const getHighResUrl = (src) => {
        if (!src || !src.includes('googleusercontent.com')) return src;
        try {
            const segments = src.split('/');
            const lastIdx = segments.length - 1;
            let lastSegment = segments[lastIdx];

            let query = '';
            if (lastSegment.includes('?')) {
                const parts = lastSegment.split('?');
                lastSegment = parts[0];
                query = parts[1];
            }

            let cleanSegment = lastSegment
                .replace(/(=|-)(w|h|s|c|rw|no)\d*/g, '')
                .replace(/--+/g, '-')
                .replace(/^-+|-+$/g, '');

            if (!cleanSegment.includes('=')) {
                cleanSegment += '=s0';
            } else {
                if (!cleanSegment.endsWith('=s0')) cleanSegment += '=s0';
            }

            segments[lastIdx] = query ? `${cleanSegment}?${query}` : cleanSegment;
            return segments.join('/');
        } catch (e) {
            return src;
        }
    };

    const getBestUrlFromSrcset = (srcset) => {
        if (!srcset) return null;
        try {
            const candidates = srcset.split(',').map(entry => {
                const parts = entry.trim().split(/\s+/);
                const url = parts[0];
                const descriptor = parts[1] || '1x';
                let score = 1;
                if (descriptor.endsWith('w')) score = parseInt(descriptor) || 1;
                else if (descriptor.endsWith('x')) score = parseFloat(descriptor) * 1000;
                return { url, score };
            });
            candidates.sort((a, b) => b.score - a.score);
            return candidates[0]?.url || null;
        } catch (e) {
            return null;
        }
    };

    async function fetchImageAsBlob(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "blob",
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) resolve(response.response);
                    else reject(new Error(`Fetch failed: ${response.status}`));
                },
                onerror: reject
            });
        });
    }

    async function fetchBestImageBlob(img) {
        let candidateSrc = getBestUrlFromSrcset(img.srcset) || img.src;
        const highResUrl = getHighResUrl(candidateSrc);
        try {
            const blob = await fetchImageAsBlob(highResUrl);
            if (blob && blob.size > 5000) return blob;
        } catch (e) {}
        try {
            const blob = await fetchImageAsBlob(candidateSrc);
            if (blob && blob.size > 5000) return blob;
        } catch (e) {}
        return null;
    }

    // --- Automatic Replacement Logic ---
    async function autoProcessImage(img) {
        if (!engine || processingQueue.has(img) || img.dataset.watermarkProcessed) return;
        
        processingQueue.add(img);
        img.dataset.watermarkProcessed = 'processing';
        
        try {
            const originalSrc = img.src;
            const blob = await fetchBestImageBlob(img);
            if (blob) {
                const bitmap = await createImageBitmap(blob);
                const processedCanvas = await engine.removeWatermarkFromImage(bitmap);
                const cleanBlob = await canvasToBlob(processedCanvas);
                const newUrl = URL.createObjectURL(cleanBlob);
                
                // Store original and replace in-place
                img.dataset.originalSrc = originalSrc;
                img.src = newUrl;
                img.srcset = ''; 
                img.dataset.watermarkProcessed = 'true';
            } else {
                img.dataset.watermarkProcessed = 'failed';
            }
        } catch (e) {
            img.dataset.watermarkProcessed = 'failed';
        } finally {
            processingQueue.delete(img);
        }
    }

    // --- Intercept Fetch ---
    const GEMINI_URL_PATTERN = /^https:\/\/lh3\.googleusercontent\.com\/rd-gg(?:-dl)?\/.+=s(?!0-d\?).*/;
    const { fetch: origFetch } = unsafeWindow;
    unsafeWindow.fetch = async (...args) => {
        const url = typeof args[0] === "string" ? args[0] : args[0]?.url;
        if (GEMINI_URL_PATTERN.test(url) && engine) {
            const highResUrl = getHighResUrl(url);
            if (typeof args[0] === "string") args[0] = highResUrl;
            else if (args[0]?.url) args[0].url = highResUrl;

            const response = await origFetch(...args);
            if (!response.ok) return response;

            try {
                const blob = await response.blob();
                const bitmap = await createImageBitmap(blob);
                const canvas = await engine.removeWatermarkFromImage(bitmap);
                const processedBlob = await canvasToBlob(canvas);
                return new Response(processedBlob, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                });
            } catch (e) {
                return response;
            }
        }
        return origFetch(...args);
    };

    // --- UI Logic ---
    function createUI() {
        if (document.querySelector('.gemini-downloader-fab')) return;

        const container = document.createElement('div');
        container.className = 'gemini-downloader-fab';

        const menuGroup = document.createElement('div');
        menuGroup.className = 'gemini-menu-group';

        const statusPill = document.createElement('div');
        statusPill.className = 'status-pill';
        statusPill.textContent = 'Ready';

        const downloadCleanBtn = document.createElement('button');
        downloadCleanBtn.className = 'gemini-btn action-btn';
        downloadCleanBtn.innerHTML = `
            <svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
            <span>Clean Download</span>
        `;
        downloadCleanBtn.onclick = () => downloadAllImages(true, statusPill);

        const downloadOrigBtn = document.createElement('button');
        downloadOrigBtn.className = 'gemini-btn action-btn';
        downloadOrigBtn.innerHTML = `
            <svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
            <span>Original Download</span>
        `;
        downloadOrigBtn.onclick = () => downloadAllImages(false, statusPill);

        menuGroup.appendChild(statusPill);
        menuGroup.appendChild(downloadCleanBtn);
        menuGroup.appendChild(downloadOrigBtn);

        const mainFab = document.createElement('button');
        mainFab.className = 'gemini-btn main-fab';
        mainFab.innerHTML = `
            <svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
        `;
        mainFab.onclick = () => container.classList.toggle('expanded');

        container.appendChild(menuGroup);
        container.appendChild(mainFab);
        document.body.appendChild(container);
    }

    async function downloadAllImages(clean, statusPill) {
        const images = findGeminiImages();
        if (images.length === 0) {
            statusPill.textContent = 'No Images Found';
            statusPill.classList.add('visible');
            setTimeout(() => statusPill.classList.remove('visible'), 3000);
            return;
        }

        statusPill.textContent = `Preparing ${images.length} images...`;
        statusPill.classList.add('visible');

        const results = await Promise.all(images.map(async (img, index) => {
            try {
                if (clean) {
                    // Optimized: Use existing clean blob if processed
                    if (img.dataset.watermarkProcessed === 'true') {
                        const resp = await fetch(img.src);
                        return { blob: await resp.blob(), index };
                    } else {
                        const blob = await fetchBestImageBlob(img);
                        const bitmap = await createImageBitmap(blob);
                        const processedCanvas = await engine.removeWatermarkFromImage(bitmap);
                        return { blob: await canvasToBlob(processedCanvas), index };
                    }
                } else {
                    // Original requested: Use stored originalSrc
                    const targetUrl = img.dataset.originalSrc || img.src;
                    const blob = await fetchImageAsBlob(getHighResUrl(targetUrl));
                    return { blob, index };
                }
            } catch (e) { return null; }
        }));

        const successful = results.filter(r => r && r.blob);
        statusPill.textContent = `Saving ${successful.length} images...`;

        for (const res of successful) {
            const filename = `gemini_${clean ? 'clean' : 'original'}_${Date.now()}_${res.index + 1}.png`;
            const url = URL.createObjectURL(res.blob);
            if (typeof GM_download === 'function') {
                GM_download({ url, name: filename, onload: () => URL.revokeObjectURL(url) });
            } else {
                const a = document.createElement('a'); a.href = url; a.download = filename;
                document.body.appendChild(a); a.click(); document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 5000);
            }
            await new Promise(r => setTimeout(r, 250));
        }
        statusPill.textContent = 'Done!';
        setTimeout(() => statusPill.classList.remove('visible'), 3000);
    }

    // --- Init ---
    const updateVisibility = () => {
        const images = findGeminiImages();
        const fab = document.querySelector('.gemini-downloader-fab');
        if (fab) fab.style.display = images.length > 0 ? 'flex' : 'none';
        images.forEach(autoProcessImage);
    };

    const debounce = (fn, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    };

    const init = async () => {
        injectStyles();
        engine = await WatermarkEngine.create();
        createUI();
        updateVisibility();
        
        const observer = new MutationObserver(debounce(updateVisibility, 300));
        observer.observe(document.body, { childList: true, subtree: true });
    };

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();