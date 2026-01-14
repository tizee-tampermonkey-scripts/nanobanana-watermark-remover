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

## 🔬 How It Works

### The Watermark Blending Model

Google Gemini applies watermarks using **alpha compositing**, a technique where the watermark is semi-transparently overlaid on the original image. The mathematical model for this blending operation is:

```
Watermarked = Original * (1 - Alpha) + Watermark * Alpha
```

Where:
- `Watermarked` = The final pixel value we see (the image with watermark)
- `Original` = The clean image pixel value (what we want to recover)
- `Watermark` = The watermark overlay pixel value (white = 255)
- `Alpha` = The opacity/transparency value at each pixel (0 to 1)

### Reverse Reconstruction Algorithm

To recover the original image, we solve for `Original` by algebraically rearranging the blending equation:

```
Original = (Watermarked - Alpha * Watermark) / (1 - Alpha)
```

This is implemented in the code at `user.js:64-70`:

```javascript
const watermarked = imageData.data[imgIdx + c];
const original = (watermarked - alpha * LOGO_VALUE) / oneMinusAlpha;
imageData.data[imgIdx + c] = Math.max(0, Math.min(255, Math.round(original)));
```

### Alpha Map Extraction

The critical insight is that **alpha values vary per pixel** (the watermark has soft edges, anti-aliasing, and varying transparency). The script extracts these alpha values from pre-captured watermark-only images:

1. **Pre-captured Background Images**: The script contains Base64-encoded reference images showing only the watermark against a black background
2. **Alpha Calculation**: For each pixel, alpha is derived from the maximum RGB channel value (`user.js:36-48`):
   ```
   alpha = max(R, G, B) / 255
   ```
3. **Two Sizes**: Separate alpha maps are maintained for 48px and 96px watermark variants

### Watermark Position Detection

The watermark is consistently placed in the **bottom-right corner** with size-dependent margins:

| Image Size | Logo Size | Margin Right/Bottom |
|------------|-----------|---------------------|
| > 1024px   | 96px      | 64px                |
| <= 1024px  | 48px      | 32px                |

Position calculation (`user.js:84-92`):
```javascript
x = imageWidth - marginRight - logoSize
y = imageHeight - marginBottom - logoSize
```

### Implementation Workflow

1. **Network Interception**: Patch the browser's `fetch` API to intercept Gemini image requests
2. **High-Res Upgrade**: Strip Google's `=sXXX` URL parameter and force `=s0` for original resolution
3. **Alpha Map Selection**: Choose the appropriate 48px or 96px alpha map based on image dimensions
4. **Pixel-wise Reconstruction**: Apply the reverse formula only to the watermark region
5. **In-place Replacement**: Replace the image source directly in the DOM

### Key Optimization Techniques

- **Selective Processing**: Only process pixels where `alpha > 0.002` (skip fully transparent areas)
- **Alpha Clamping**: Limit alpha to `0.99` maximum to prevent division by near-zero values
- **Canvas Processing**: Use HTML5 Canvas API for efficient pixel manipulation
- **Blob Reuse**: Cache processed blobs for download to avoid redundant computation

### CORS Bypass

The script uses `GM_xmlhttpRequest` to bypass Content Security Policy restrictions when fetching high-resolution images from `googleusercontent.com` domains.

## ⚠️ Disclaimer

This script is for personal use and educational purposes only. It is designed to help users obtain cleaner versions of their AI-generated content. Please respect Google's Terms of Service and use responsibly.
