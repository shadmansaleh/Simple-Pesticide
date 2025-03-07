chrome.action.onClicked.addListener(async (tab) => {
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
