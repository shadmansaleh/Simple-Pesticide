chrome.action.onClicked.addListener(async (tab) => {
  let storedData = await chrome.storage.local.get("enabled");
  let enabled = storedData.enabled ?? false;
  let newState = !enabled;

  await chrome.storage.local.set({ enabled: newState });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: toggleBorders,
    args: [newState],
  });
});

function toggleBorders(enabled) {
  if (!enabled) {
    document.querySelectorAll("*").forEach((el) => (el.style.border = ""));
    if (window.borderObserver) {
      window.borderObserver.disconnect();
      window.borderObserver = null;
    }
    return;
  }

  const colors = ["red", "blue", "green", "orange", "purple"];

  function applyBorders(element, depth = 0, usedColors = {}) {
    if (!element || element.nodeType !== 1) return;

    let siblings = element.parentElement ? element.parentElement.children : [];
    let siblingColors = new Set();

    for (let sibling of siblings) {
      if (usedColors[sibling]) {
        siblingColors.add(usedColors[sibling]);
      }
    }

    let availableColors = colors.filter((c) => !siblingColors.has(c));
    let color = availableColors.length
      ? availableColors[0]
      : colors[depth % colors.length];

    element.style.border = `2px solid ${color}`;
    usedColors[element] = color;

    Array.from(element.children).forEach((child) =>
      applyBorders(child, depth + 1, usedColors),
    );
  }

  applyBorders(document.body);

  // MutationObserver to handle dynamic DOM changes
  if (!window.borderObserver) {
    window.borderObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            // Only apply to elements
            applyBorders(
              node,
              node.closest("*") ? node.closest("*").depth + 1 : 0,
              {},
            );
          }
        });
      });
    });

    window.borderObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}
