function applyBorders(element, depth = 0, startTime) {
  const TIME_LIMIT = 5000; // 2 seconds
  const MAX_CHILDREN = 1000;
  const colors = ["red", "blue", "green", "orange", "purple"];

  const elapsedTime = performance.now() - startTime; // Get elapsed time in milliseconds
  if (!element || element.nodeType !== 1 || elapsedTime >= TIME_LIMIT) return; // Stop if exceeded timelimit

  let color = colors[depth % colors.length];

  element.setAttribute("data-border-color", color);
  element.style.border = `1px solid ${color}`;

  if (element.children.length <= MAX_CHILDREN) {
    Array.from(element.children).forEach(
      (child) => applyBorders(child, depth + 1, startTime), // Continue with the remaining time
    );
  }
}

function toggle_borders() {
  if (window.borderObserver) {
    document.querySelectorAll("*").forEach((el) => (el.style.border = ""));
    window.borderObserver.disconnect();
    window.borderObserver = null;
    return;
  } else {
    const startTime = performance.now(); // Start the timer when borders are applied
    applyBorders(document.body, 0, startTime); // Pass the start time to applyBorders

    window.borderObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const newStartTime = performance.now(); // Create a new start time for each node
            applyBorders(
              node,
              node.closest("*")?.depth ? node.closest("*").depth + 1 : 0,
              newStartTime, // Pass the new start time for this particular node
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
