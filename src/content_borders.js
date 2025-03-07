function applyBorders(element, depth = 0, usedColors = {}) {
  const colors = ["red", "blue", "green", "orange", "purple"];
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

  element.setAttribute("data-border-color", color);
  element.style.border = `2px solid ${color}`;
  usedColors[element] = color;

  Array.from(element.children).forEach((child) =>
    applyBorders(child, depth + 1, usedColors),
  );
}

function toggle_borders() {
  if (window.borderObserver) {
    document.querySelectorAll("*").forEach((el) => (el.style.border = ""));
    window.borderObserver.disconnect();
    window.borderObserver = null;
    return;
  } else {
    applyBorders(document.body);

    window.borderObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
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

toggle_borders();
