import { UIComponentsStack } from "../../../ui/UIComponentsStack";
import { Button, Dropdown, TextInput } from "../../../ui";
import { SimpleUIComponent } from "../../../ui/SimpleUIComponent";
import { Components } from "../../../core/Components";

export class NewProp extends SimpleUIComponent<HTMLDivElement> {
  name = "NewProp";
  nameInput: TextInput;
  typeInput: Dropdown;
  valueInput: TextInput;
  acceptButton: Button;
  cancelButton: Button;

  constructor(components: Components) {
    const div = document.createElement("div");
    div.className =
      "flex flex-col rounded-md p-4 bg-ifcjs-100 gap-y-2 items-center shadow-md";
    const title = document.createElement("h3");
    title.className = "text-white";
    title.textContent = "New property";
    div.append(title);
    super(components, div);

    this.nameInput = new TextInput(components);
    this.nameInput.labelElement.textContent = "Name";

    this.valueInput = new TextInput(components);
    this.valueInput.labelElement.textContent = "Value";

    this.typeInput = new Dropdown(components, "Type");
    this.typeInput.addOption("IfcText", "IfcReal", "IfcBoolean");

    this.acceptButton = new Button(components, {
      materialIconName: "check",
      name: "Accept",
    });
    this.acceptButton
      .get()
      .classList.remove("hover:bg-ifcjs-200", "hover:text-ifcjs-100");
    this.acceptButton.get().classList.add("hover:bg-[#55A014]", "grow");

    this.acceptButton.onclick = () => {};

    this.cancelButton = new Button(components, {
      materialIconName: "clear",
      name: "Cancel",
    });

    this.cancelButton
      .get()
      .classList.remove("hover:bg-ifcjs-200", "hover:text-ifcjs-100");
    this.cancelButton.get().classList.add("hover:bg-red-500", "grow");

    this.cancelButton.onclick = () => {
      this.nameInput.clear();
      this.valueInput.clear();
      // this.typeInput.clear();
      this.visible = false;
    };

    const buttonsStack = new UIComponentsStack(components, "Horizontal");
    buttonsStack.get().classList.add("gap-x-2", "mt-2", "w-full");
    buttonsStack.addChild(this.acceptButton, this.cancelButton);

    this.addChild(
      this.nameInput,
      this.typeInput,
      this.valueInput,
      buttonsStack
    );
  }
}
