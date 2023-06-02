import { UIComponentsStack } from "../../../ui/UIComponentsStack";
import { Button, TextInput } from "../../../ui";
import { SimpleUIComponent } from "../../../ui/SimpleUIComponent";
import { Components } from "../../Components";

export class EditProp extends SimpleUIComponent<HTMLDivElement> {
  name = "EditProp";
  nameInput: TextInput;
  valueInput: TextInput;
  acceptButton: Button;
  cancelButton: Button;

  constructor(components: Components) {
    const div = document.createElement("div");
    div.className =
      "absolute flex flex-col rounded-md top-5 left-5 p-4 bg-ifcjs-100 gap-y-2 items-center";
    super(components, div);
    this.nameInput = new TextInput(components);
    this.nameInput.labelElement.textContent = "Name";
    this.valueInput = new TextInput(components);
    this.valueInput.labelElement.textContent = "Value";

    this.acceptButton = new Button(components, {
      materialIconName: "check",
      name: "Accept",
    });
    this.acceptButton.get().classList.remove("hover:bg-ifcjs-200");
    this.acceptButton.get().classList.add("hover:bg-green-500");

    this.cancelButton = new Button(components, {
      materialIconName: "clear",
      name: "Cancel",
    });

    this.cancelButton
      .get()
      .classList.remove("hover:bg-ifcjs-200", "hover:text-ifcjs-100");
    this.cancelButton.get().classList.add("hover:bg-red-500");

    this.cancelButton.onclick = () => {
      this.visible = false;
    };

    const buttonsStack = new UIComponentsStack(components, "Horizontal");
    buttonsStack.get().classList.add("gap-x-2", "mt-2");
    buttonsStack.addChild(this.acceptButton, this.cancelButton);

    this.addChild(this.nameInput, this.valueInput, buttonsStack);
  }
}
