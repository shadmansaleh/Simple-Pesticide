function handleElementHover(event) {
  if (!event.target || !event.shiftKey) {
    window.infoBox.style.display = "none";
    return;
  }

  let element = event.target;
  let tagName = element.tagName.toLowerCase();
  let classList = element.className ? `"${element.className}"` : "None";

  let styles = element.style.cssText
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s && !s.includes("border"))
    .join("; ");
  let styleText = styles ? `"${styles}"` : "None";

  window.infoBox.innerText = `${tagName} { classes: ${classList}, style: ${styleText} }`;
  window.infoBox.style.display = "block";
}

function toggle_infobox() {
  if (window.infoBox) {
    window.infoBox.remove();
    window.infoBox = null;
    document.removeEventListener("mousemove", handleElementHover);
    return;
  } else {
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
    document.addEventListener("mousemove", handleElementHover);
  }
}

toggle_infobox();
