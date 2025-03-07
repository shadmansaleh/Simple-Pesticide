# Simple Pesticide

**Simple Pesticide** is a Chrome extension designed to help developers visually analyze and inspect HTML elements on web pages. It adds colorful borders around DOM elements based on their depth in the DOM hierarchy and provides detailed information about the element’s tag, classes, and styles when you hover over it with the **Shift** key pressed.

### Features

- **Toggle Borders:** Adds colorful borders around elements based on their depth in the DOM.
- **Dynamic Updates:** Borders automatically adjust when new elements are added to the DOM.
- **Element Information on Hover:** When pressing **Shift** and hovering over an element, an info box displays the element's tag name, classes, and styles (excluding border styles).

### Screenshots

![ss-pestacide](https://github.com/user-attachments/assets/4dcf283e-1a5d-4fa5-9729-543245428407)

### Why?

I found pesticide quite useful for checkout layout states at a glance.
But it stoped working with Manifest-v3. So I decided to write it on my own.

### Installation

1. Clone the repository or download the extension files.

   ```bash
   git clone https://github.com/shadmansaleh/Simple-Pesticide

   ```

2. Open the Chrome Extensions page:  
   `chrome://extensions/`

3. Enable **Developer mode** (toggle in the top-right corner).

4. Click **Load unpacked**, and select the folder where you downloaded the extension.

5. The extension should now be installed and ready to use!

### Usage

1. Click the extension icon in the Chrome toolbar to toggle the feature.
2. When enabled, borders will appear around HTML elements based on their depth in the DOM.
3. To view element details, hover over an element with **Shift** pressed. An info box will display the element’s tag, classes, and styles (excluding border styles).

### Files

- `manifest.json`: Extension configuration and metadata.
- `src/background.js`: Manages feature toggling.
- `src/content_borders.js`: Handles adding borders to elements.
- `src/content_info.js`: Displays element information on hover.

### License

This project is licensed under the GPL3 License - see the [LICENSE](LICENSE) file for details.
