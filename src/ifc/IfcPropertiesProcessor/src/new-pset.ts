import { UIComponentsStack } from "../../../ui/UIComponentsStack";
import { Button, CheckboxInput, Dropdown, TextInput } from "../../../ui";
import { SimpleUIComponent } from "../../../ui/SimpleUIComponent";
import { Components } from "../../../core/Components";

export class NewPset extends SimpleUIComponent<HTMLDivElement> {
  name = "NewPset";
  nameInput: TextInput;
  descriptionInput: TextInput;
  acceptButton: Button;
  cancelButton: Button;

  constructor(components: Components) {
    const div = document.createElement("div");
    div.className =
      "flex flex-col rounded-md p-4 bg-ifcjs-100 gap-y-2 items-center shadow-md";
    const title = document.createElement("h3");
    title.className = "text-white";
    title.textContent = "Add property set";
    div.append(title);

    super(components, div);

    // #region New Pset
    const newPsetContainer = new UIComponentsStack(components);
    newPsetContainer.get().classList.add("gap-y-2");

    this.nameInput = new TextInput(components);
    this.nameInput.labelElement.textContent = "Name";

    this.descriptionInput = new TextInput(components);
    this.descriptionInput.labelElement.textContent = "Description";

    newPsetContainer.addChild(this.nameInput, this.descriptionInput);
    // #endregion

    // #region Existing Pset
    const existingPsetContainer = new UIComponentsStack(components);
    existingPsetContainer.get().classList.add("w-full");

    const existingPsets = new Dropdown(components);
    existingPsets.addOption("My custom pset");
    existingPsets.labelElement.textContent = "Property set";

    existingPsetContainer.addChild(existingPsets);
    // #endregion

    // #region Bottom Stack
    this.acceptButton = new Button(components, {
      materialIconName: "check",
      name: "Accept",
    });
    this.acceptButton
      .get()
      .classList.remove("hover:bg-ifcjs-200", "hover:text-ifcjs-100");
    this.acceptButton.get().classList.add("hover:bg-[#55A014]", "grow");

    this.cancelButton = new Button(components, {
      materialIconName: "clear",
      name: "Cancel",
    });

    this.cancelButton
      .get()
      .classList.remove("hover:bg-ifcjs-200", "hover:text-ifcjs-100");
    this.cancelButton.get().classList.add("hover:bg-red-500", "grow");

    this.cancelButton.onclick = () => {
      this.visible = false;
    };

    const bottomStack = new UIComponentsStack(components, "Horizontal");
    bottomStack.get().classList.add("gap-x-2", "mt-2", "w-full");
    bottomStack.addChild(this.acceptButton, this.cancelButton);
    // #endregion

    // #region Top Stack
    const newPset = new CheckboxInput(components);
    newPset.labelElement.textContent = "New";

    const existingPset = new CheckboxInput(components);
    existingPset.labelElement.textContent = "Existing";

    newPset.onChange.on((v) => {
      const value = Boolean(v);
      existingPset.inputValue = !value;
      existingPsetContainer.visible = !value;
      newPsetContainer.visible = value;
    });

    existingPset.onChange.on((v) => {
      const value = Boolean(v);
      newPset.inputValue = !value;
      newPsetContainer.visible = !value;
      existingPsetContainer.visible = value;
    });

    const topStack = new UIComponentsStack(components, "Horizontal");
    topStack.get().classList.add("gap-x-4", "my-2");
    topStack.addChild(newPset, existingPset);
    // #endregion

    this.addChild(
      topStack,
      newPsetContainer,
      existingPsetContainer,
      bottomStack
    );

    newPset.inputValue = true;
    existingPsetContainer.visible = false;
  }
}
