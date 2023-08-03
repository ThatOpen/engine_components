import { FragmentsGroup } from "bim-fragment";
import { Components } from "../../../core/Components";
import { SimpleUIComponent } from "../../../ui/SimpleUIComponent";
import { FloatingWindow } from "../../../ui/FloatingWindow";
import { TextInput } from "../../../ui/TextInput";
import { Button } from "../../../ui/ButtonComponent";
import { Event } from "../../../base-types";
import { Dropdown } from "../../../ui/Dropdown";

type StringPropTypes = "IfcText" | "IfcLabel" | "IfcIdentifier";

export class PsetActionsUI extends SimpleUIComponent<HTMLDivElement> {
  editPsetBtn: Button;
  removePsetBtn: Button;
  addPropBtn: Button;
  modalVisible = false;
  private _modal: SimpleUIComponent<HTMLDialogElement>;
  private _modalWindow: FloatingWindow;

  readonly onEditPset = new Event<{
    model: FragmentsGroup;
    psetID: number;
    name: string;
    description: string;
  }>();
  readonly onRemovePset = new Event<{
    model: FragmentsGroup;
    psetID: number;
  }>();
  readonly onNewProp = new Event<{
    model: FragmentsGroup;
    psetID: number;
    name: string;
    type: StringPropTypes;
    value: string;
  }>();

  data: {
    model?: FragmentsGroup;
    psetID?: number;
  } = {};

  constructor(components: Components) {
    super(components, `<div class="flex"></div>`);

    this.editPsetBtn = new Button(this._components);
    this.editPsetBtn.materialIcon = "edit";
    this.setEditUI();

    this.removePsetBtn = new Button(this._components);
    this.removePsetBtn.materialIcon = "delete";
    this.setRemoveUI();

    this.addPropBtn = new Button(this._components);
    this.addPropBtn.materialIcon = "add";
    this.setAddPropUI();

    this.addChild(this.addPropBtn, this.editPsetBtn, this.removePsetBtn);

    this._modal = new SimpleUIComponent(components, `<dialog></dialog>`);
    this._components.ui.add(this._modal);
    this._modal.get().addEventListener("close", () => {
      this.removeFromParent();
      this.modalVisible = false;
      this._modalWindow.visible = false;
    });

    this._modalWindow = new FloatingWindow(this._components);
    this._modalWindow.get().className =
      "overflow-auto text-white bg-ifcjs-100 rounded-md w-[350px]";
    this._modalWindow.onHidden.on(() => this._modal.get().close());
    this._modal.addChild(this._modalWindow);
  }

  private setEditUI() {
    const editUI = new SimpleUIComponent(
      this._components,
      `<div class="flex flex-col gap-y-4 p-4 overflow-auto"></div>`
    );

    const nameInput = new TextInput(this._components);
    nameInput.label = "Name";
    const descriptionInput = new TextInput(this._components);
    descriptionInput.label = "Description";

    const acceptBtn = new Button(this._components);
    acceptBtn.materialIcon = "check";
    acceptBtn.label = "Accept";
    acceptBtn.get().classList.remove("hover:bg-ifcjs-200");
    acceptBtn.get().classList.add("hover:bg-success");
    acceptBtn.onclick = () => {
      this._modal.get().close();
      const { model, psetID } = this.data;
      if (!model || !psetID) return;
      this.onEditPset.trigger({
        model,
        psetID,
        name: nameInput.value,
        description: descriptionInput.value,
      });
    };

    const cancelBtn = new Button(this._components);
    cancelBtn.materialIcon = "close";
    cancelBtn.label = "Cancel";
    cancelBtn.get().classList.remove("hover:bg-ifcjs-200");
    cancelBtn.get().classList.add("hover:bg-error");
    cancelBtn.onclick = () => this._modal.get().close();

    const actionBtns = new SimpleUIComponent(
      this._components,
      `<div class="flex gap-x-2 justify-end"></div>`
    );

    actionBtns.addChild(cancelBtn, acceptBtn);

    editUI.addChild(nameInput, descriptionInput, actionBtns);

    this.editPsetBtn.onclick = () => {
      const { model, psetID } = this.data;
      const properties = model?.properties;
      if (!model || !psetID || !properties) return;
      const entity = properties[psetID];
      nameInput.value = entity.Name?.value ?? "";
      descriptionInput.value = entity.Description?.value ?? "";
      this._modalWindow.title = "Edit Property Set";
      this._modalWindow.setSlot("content", editUI);
      this.showModal();
      this.editPsetBtn.onClicked.trigger();
    };
  }

  private setRemoveUI() {
    const removeUI = new SimpleUIComponent(
      this._components,
      `<div class="flex flex-col gap-y-4 p-4 overflow-auto"></div>`
    );

    const warningText = document.createElement("div");
    warningText.className = "text-base text-center";
    warningText.textContent =
      "Are you sure to delete this property set? This action can't be undone.";
    removeUI.get().append(warningText);

    const acceptBtn = new Button(this._components);
    acceptBtn.materialIcon = "check";
    acceptBtn.label = "Accept";
    acceptBtn.get().classList.remove("hover:bg-ifcjs-200");
    acceptBtn.get().classList.add("hover:bg-success");
    acceptBtn.onclick = () => {
      this._modal.get().close();
      const { model, psetID } = this.data;
      if (!model || !psetID) return;
      this.removeFromParent(); // As the psetUI is going to be disposed, then we need to first remove the action buttons so they do not become disposed as well.
      this.onRemovePset.trigger({ model, psetID });
    };

    const cancelBtn = new Button(this._components);
    cancelBtn.materialIcon = "close";
    cancelBtn.label = "Cancel";
    cancelBtn.get().classList.remove("hover:bg-ifcjs-200");
    cancelBtn.get().classList.add("hover:bg-error");
    cancelBtn.onclick = () => this._modal.get().close();

    const actionBtns = new SimpleUIComponent(
      this._components,
      `<div class="flex gap-x-2 justify-end"></div>`
    );

    actionBtns.addChild(cancelBtn, acceptBtn);

    removeUI.addChild(actionBtns);

    this.removePsetBtn.onclick = () => {
      const { model, psetID } = this.data;
      if (!model || !psetID) return;
      this._modalWindow.title = "Remove Property Set";
      this._modalWindow.setSlot("content", removeUI);
      this.showModal();
      this.removePsetBtn.onClicked.trigger();
    };
  }

  private setAddPropUI() {
    const addPropUI = new SimpleUIComponent(
      this._components,
      `<div class="flex flex-col gap-y-4 p-4 overflow-auto"></div>`
    );

    const nameInput = new TextInput(this._components);
    nameInput.label = "Name";

    const typeInput = new Dropdown(this._components);
    typeInput.label = "Type";
    typeInput.addOption("IfcText", "IfcLabel", "IfcIdentifier");
    typeInput.value = "IfcText";

    const valueInput = new TextInput(this._components);
    valueInput.label = "Value";

    const acceptBtn = new Button(this._components);
    acceptBtn.materialIcon = "check";
    acceptBtn.label = "Accept";
    acceptBtn.get().classList.remove("hover:bg-ifcjs-200");
    acceptBtn.get().classList.add("hover:bg-success");
    acceptBtn.onclick = () => {
      this._modal.get().close();
      const { model, psetID } = this.data;
      if (!model || !psetID) return;
      const name = nameInput.value;
      const type = typeInput.value as StringPropTypes;
      if (name === "" || !type) return;
      this.onNewProp.trigger({
        model,
        psetID,
        name,
        type,
        value: valueInput.value,
      });
    };

    const cancelBtn = new Button(this._components);
    cancelBtn.materialIcon = "close";
    cancelBtn.label = "Cancel";
    cancelBtn.get().classList.remove("hover:bg-ifcjs-200");
    cancelBtn.get().classList.add("hover:bg-error");
    cancelBtn.onclick = () => this._modal.get().close();

    const actionBtns = new SimpleUIComponent(
      this._components,
      `<div class="flex gap-x-2 justify-end"></div>`
    );

    actionBtns.addChild(cancelBtn, acceptBtn);

    addPropUI.addChild(nameInput, typeInput, valueInput, actionBtns);

    this.addPropBtn.onclick = () => {
      const { model, psetID } = this.data;
      if (!model || !psetID) return;
      this._modalWindow.title = "New Property";
      this._modalWindow.setSlot("content", addPropUI);
      this.showModal();
      this.addPropBtn.onClicked.trigger();
    };
  }

  private showModal() {
    this.modalVisible = true;
    this._modalWindow.visible = true;
    this._modal.get().showModal();
  }
}
