chrome.action.onClicked.addListener(async (tab) => {
  try {
    if (
      !tab.url ||
      tab.url.startsWith("chrome://") ||
      tab.url.startsWith("about://") ||
      tab.url.startsWith("file://")
    ) {
      console.log("Simple Pesticide: Extension won't run on this page.");
      return; // Prevent running the extension on invalid pages
    }
    let storedData = await chrome.storage.local.get("enabled");
    let enabled = storedData.enabled ?? false;
    let newState = !enabled;

    await chrome.storage.local.set({ enabled: newState });

    if (newState) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["src/content_borders.js"],
      });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["src/content_info.js"],
      });
    } else {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: disableFeatures,
      });
    }
  } catch (err) {
    console.error("Simple Pesticide: Error toggling extension ", err);
  }
});

function disableFeatures() {
  document.querySelectorAll("*").forEach((el) => (el.style.border = ""));

  if (window.borderObserver) {
    window.borderObserver.disconnect();
    window.borderObserver = null;
  }

  if (window.infoBox) {
    window.infoBox.remove();
    window.infoBox = null;
  }

  document.removeEventListener("mousemove", window.handleElementHover);
}
