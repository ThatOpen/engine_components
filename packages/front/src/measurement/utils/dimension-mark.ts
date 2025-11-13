export function newDimensionMark() {
  const mark = document.createElement("div");
  mark.style.backgroundColor = "blue";
  mark.style.color = "white";
  mark.style.padding = "6px";
  mark.style.borderRadius = "6px";
  mark.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.6)"; // Add box shadow effect
  mark.style.zIndex = "-10";

  return mark;
}

export function newEndPoint(
  option: {
    color?: string;
    size?: string;
    border?: string;
    background?: string;
  } = {},
): HTMLDivElement {
  const {
    color = "white",
    size = "4px",
    border = "2px solid blue",
    background = "white",
  } = option;

  const mark = document.createElement("div");
  mark.style.backgroundColor = background;
  mark.style.color = color;
  mark.style.height = size;
  mark.style.width = size;
  mark.style.borderRadius = "50%";
  mark.style.border = border;
  mark.style.zIndex = "-20";

  return mark;
}
