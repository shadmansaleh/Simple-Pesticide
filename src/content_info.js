function handleElementHover(event) {
  if (!event.target || !event.shiftKey) {
    window.infoBox.style.display = "none";
    removeRaisedBorder();
    return;
  }

  let element = event.target;
  let tagName = element.tagName.toLowerCase();
  let classList =
    typeof element.className === "string" && element.className.trim()
      ? element.className
        .split(" ")
        // Exclude the pesticide-37-highlighted class
        .filter((className) => className !== "pesticide-37-highlighted")
      : [];
  let classText = classList.length > 0 ? classList.join(" ") : "None";

  let styles = element.style.cssText
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s && !s.includes("border"))
    .join("; ");
  let styleText = styles ? `"${styles}"` : "None";

  window.infoBox.innerText = `${tagName} { classes: ${classText}, style: ${styleText} }`;
  window.infoBox.style.display = "block";

  addRaisedBorder(element); // Add raised border effect on hover
}

function toggle_infobox() {
  if (window.infoBox) {
    window.infoBox.remove();
    window.infoBox = null;
    document.removeEventListener("mousemove", handleElementHover);
    removeRaisedBorder(); // Remove raised border when infobox is disabled
    return;
  } else {
    window.infoBox = document.createElement("div");
    window.infoBox.id = "pesticide-37-infobox";
    window.infoBox.style.position = "fixed";
    window.infoBox.style.bottom = "24px";
    window.infoBox.style.left = "12px";
    window.infoBox.style.padding = "8px";
    window.infoBox.style.background = "rgba(0, 0, 0, 0.8)";
    window.infoBox.style.color = "white";
    window.infoBox.style.fontSize = "14px";
    window.infoBox.style.borderRadius = "5px";
    window.infoBox.style.display = "none";
    window.infoBox.style.zIndex = "10000";
    document.body.appendChild(window.infoBox);
    document.addEventListener("mousemove", handleElementHover);
  }
}

// Function to add raised border to the hovered element
function addRaisedBorder(element) {
  if (!element.classList.contains("pesticide-37-highlighted")) {
    const previouslyHighlighted = document.querySelector(
      ".pesticide-37-highlighted",
    );
    if (previouslyHighlighted) {
      previouslyHighlighted.classList.remove("pesticide-37-highlighted");
    }
    element.classList.add("pesticide-37-highlighted");
  }
}

// Function to remove raised border when hover is removed
function removeRaisedBorder() {
  const highlightedElement = document.querySelector(
    ".pesticide-37-highlighted",
  );
  if (highlightedElement) {
    highlightedElement.classList.remove("pesticide-37-highlighted");
  }
}

// Check if the style element already exists in the document
if (!document.getElementById("pesticide-37-style")) {
  // Create a style element with a unique ID
  const style = document.createElement("style");
  style.id = "pesticide-37-style"; // Set a unique ID to avoid duplication
  style.innerHTML = `
    .pesticide-37-highlighted {
      border: 2px solid #888 !important;  /* Thicker border for more prominence */
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.8) !important;  /* More pronounced raised effect */
    }
  `;

  // Append the style element to the head of the document
  document.head.appendChild(style);
}

// Call toggle_infobox to initialize the feature
toggle_infobox();
