export function newDimensionMark() {
  const mark = document.createElement("div");
  mark.style.backgroundColor = "black";
  mark.style.color = "white";
  mark.style.padding = "8px";
  mark.style.borderRadius = "8px";
  mark.style.fontFamily = "sans-serif";
  return mark;
}
