# JSFiddle Setup Instructions

To publish this cake on JSFiddle with audience preview enabled:

## Method 1: Using ES Modules (Recommended)

1. Go to [jsfiddle.net](https://jsfiddle.net)
2. Click **"Fork"** or create a new fiddle
3. In the **HTML** panel, paste the content from `jsfiddle-html.html`
4. In the **CSS** panel, paste the content from `jsfiddle-css.css`
5. In the **JavaScript** panel, paste the content from `jsfiddle-js.js`
6. In the **Settings** (gear icon):
   - Set **Framework** to "No-Library (Pure JS)"
   - Check **"Load Type"** as "No wrap - in `<head>`"
   - Or use "No wrap - in `<body>`" if the first doesn't work
7. Click **"Run"** to test
8. Click **"Save"** to save your fiddle
9. To enable **audience preview**:
   - Click the **"Share"** button (or the share icon)
   - Toggle **"Allow audience preview"** to ON
   - Copy the shareable link

## Method 2: Using External Resources (More Reliable)

If ES modules don't work, use this alternative:

1. Go to [jsfiddle.net](https://jsfiddle.net)
2. Click **"Fork"** or create a new fiddle
3. In **Settings** (gear icon) → **External Resources**, add these URLs (one per line):
   ```
   https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.min.js
   https://cdn.jsdelivr.net/npm/three@0.152.2/examples/js/controls/OrbitControls.js
   ```
4. In the **HTML** panel, leave it empty or just add: `<div id="container"></div>`
5. In the **CSS** panel, paste the content from `jsfiddle-css.css`
6. In the **JavaScript** panel, paste the content from `jsfiddle-alternative-js.js`
7. Set **Framework** to "No-Library (Pure JS)"
8. Set **Load Type** to "No wrap - in `<body>`"
9. Click **"Run"** to test
10. Click **"Save"** to save your fiddle
11. To enable **audience preview**:
    - Click the **"Share"** button
    - Toggle **"Allow audience preview"** to ON
    - Copy the shareable link

## Notes

- **Audience Preview** allows others to view your fiddle without needing to sign in
- The shareable link will look like: `https://jsfiddle.net/username/xxxxx/`
- You can also embed the fiddle using the embed code provided in the Share menu

