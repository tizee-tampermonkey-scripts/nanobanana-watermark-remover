# Gemini Image Downloader & Auto Watermark Remover

A professional userscript for Google Gemini that automatically removes AI-generated watermarks in-place and provides high-resolution download capabilities.

## 🚀 Features

-   **Automatic In-place Cleaning**: Automatically detects and removes watermarks from images directly in the Gemini chat interface.
-   **Network Interception**: Patches the browser's `fetch` API to process images as they are received, ensuring a seamless, watermark-free browsing experience.
-   **High-Resolution Force**: Automatically upgrades images to their original resolution (stripping Google's `=sXXX` sizing and forcing `=s0`).
-   **Smart UI**: A sleek, Material Design-inspired Floating Action Button (FAB) appears only when images are present.
-   **Dual Download Modes**:
    -   **Clean Download**: Saves the high-resolution image with the watermark professionally removed.
    -   **Original Download**: Saves the high-resolution original image (includes the watermark).
-   **Performance Optimized**: Reuses already processed image blobs during download to prevent redundant CPU and network usage.

## 🛠 Installation

1.  Install a userscript manager like [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
2.  Create a new script in your manager's dashboard.
3.  Copy the entire content of `user.js` from this repository and paste it into the editor.
4.  Save the script.
5.  Navigate to [Gemini](https://gemini.google.com/).

## 📖 How to Use

1.  **Browse Normally**: As Gemini generates images, the script will automatically detect them, fetch the high-res versions, and remove the watermarks in-place. You'll see a brief blur effect while the image is being cleaned.
2.  **Download**: Click the floating "Download" icon in the bottom-right corner to expand the menu.
3.  **Choose**:
    -   Click **Clean Download** to save all images from the current session without watermarks.
    -   Click **Original Download** to save the original high-res images.

## 🔬 Technical Details

-   **Algorithm**: Uses a reverse-blending reconstruction algorithm:
    `Original = (Watermarked - Alpha * 255) / (1 - Alpha)`
-   **Alpha Maps**: Utilizes pre-captured high-precision alpha maps for both 48px and 96px watermark variants, embedded directly as Base64.
-   **CORS Bypassing**: Employs `GM_xmlhttpRequest` to safely fetch high-resolution assets from `googleusercontent.com` without being blocked by Content Security Policy (CSP).

## ⚠️ Disclaimer

This script is for personal use and educational purposes only. It is designed to help users obtain cleaner versions of their AI-generated content. Please respect Google's Terms of Service and use responsibly.
