import { Components } from "../../core/Components";
import { SimpleUIComponent } from "../SimpleUIComponent";

export class VerticalStack extends SimpleUIComponent<HTMLDivElement> {
  name = "VerticalStack";

  constructor(components: Components) {
    const stack = document.createElement("div");
    stack.className = "flex flex-col";
    super(components, stack);
  }
}
