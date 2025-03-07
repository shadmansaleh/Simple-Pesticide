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
    if (window.infoBox) {
      window.infoBox.remove();
      window.infoBox = null;
    }
    document.removeEventListener("mousemove", handleElementHover);
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

  // Create info box
  if (!window.infoBox) {
    window.infoBox = document.createElement("div");
    window.infoBox.style.position = "fixed";
    window.infoBox.style.bottom = "10px";
    window.infoBox.style.left = "10px";
    window.infoBox.style.padding = "8px";
    window.infoBox.style.background = "rgba(0, 0, 0, 0.8)";
    window.infoBox.style.color = "white";
    window.infoBox.style.fontSize = "12px";
    window.infoBox.style.borderRadius = "5px";
    window.infoBox.style.display = "none";
    window.infoBox.style.zIndex = "10000";
    document.body.appendChild(window.infoBox);
  }

  function handleElementHover(event) {
    if (!event.target || !event.shiftKey) {
      window.infoBox.style.display = "none";
      return;
    }

    let element = event.target;
    let tagName = element.tagName.toLowerCase();
    let classList = element.className ? `"${element.className}"` : "None";
    let style = element.style.cssText ? `"${element.style.cssText}"` : "None";

    window.infoBox.innerText = `${tagName} { classes: ${classList}, style: ${style} }`;
    window.infoBox.style.display = "block";
  }

  document.addEventListener("mousemove", handleElementHover);
}
