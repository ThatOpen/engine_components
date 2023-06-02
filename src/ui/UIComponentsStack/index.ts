import { Components } from "../../core/Components";
import { SimpleUIComponent } from "../SimpleUIComponent";

export class UIComponentsStack extends SimpleUIComponent<HTMLDivElement> {
  name = "UIComponentsStack";

  constructor(components: Components, direction: "Vertical" | "Horizontal") {
    const stack = document.createElement("div");
    stack.className = `flex ${
      direction === "Vertical" ? "flex-col" : "flex-row"
    }`;
    super(components, stack);
  }
}
