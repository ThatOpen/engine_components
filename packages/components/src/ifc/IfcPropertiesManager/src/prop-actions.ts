import { FragmentsGroup } from "bim-fragment";
import { Components } from "../../../core";
import { SimpleUIComponent, TextInput, Button } from "../../../ui";
import { Event } from "../../../base-types";
import { IfcPropertiesUtils } from "../../IfcPropertiesUtils";
import { Modal } from "../../../ui/Modal";

export class PropActionsUI extends SimpleUIComponent<HTMLDivElement> {
  editPropBtn: Button;
  removePropBtn: Button;
  modalVisible = false;
  private _modal: Modal;

  readonly onEditProp = new Event<{
    model: FragmentsGroup;
    expressID: number;
    name: string;
    value: string;
  }>();

  readonly onRemoveProp = new Event<{
    model: FragmentsGroup;
    expressID: number;
    setID: number;
  }>();

  data: {
    model?: FragmentsGroup;
    expressID?: number;
    setID?: number;
    valueKey?: string;
  } = {};

  constructor(components: Components) {
    const div = document.createElement("div");
    div.className = "flex";
    super(components, `<div class="flex"></div>`);

    this._modal = new Modal(components, "New Property Set");
    this._components.ui.add(this._modal);
    this._modal.visible = false;
    this._modal.onHidden.add(() => this.removeFromParent());
    this._modal.onCancel.add(() => {
      this._modal.visible = false;
      this._modal.slots.content.dispose(true);
    });

    this.editPropBtn = new Button(this._components);
    this.editPropBtn.materialIcon = "edit";
    this.editPropBtn.onClick.add(() => this.setEditUI());

    this.removePropBtn = new Button(this._components);
    this.removePropBtn.materialIcon = "delete";
    this.removePropBtn.onClick.add(() => this.setRemoveUI());

    this.addChild(this.editPropBtn, this.removePropBtn);
  }

  async dispose(onlyChildren: boolean = false) {
    await super.dispose(onlyChildren);
    this.onRemoveProp.reset();
    await this.editPropBtn.dispose();
    await this.removePropBtn.dispose();
    await this._modal.dispose();
    this.data = {};
  }

  private async setEditUI() {
    const { model, expressID } = this.data;
    if (!model || !expressID || !model.hasProperties) return;

    const prop = await model.getProperties(expressID);
    if (!prop) return;

    this._modal.onAccept.reset();
    this._modal.title = "Edit Property";

    const editUI = new SimpleUIComponent(
      this._components,
      `<div class="flex flex-col gap-y-4 p-4 overflow-auto"></div>`
    );

    const nameInput = new TextInput(this._components);
    nameInput.label = "Name";
    const valueInput = new TextInput(this._components);
    valueInput.label = "Value";

    this._modal.onAccept.add(async () => {
      this._modal.visible = false;
      await this.onEditProp.trigger({
        model,
        expressID,
        name: nameInput.value,
        value: valueInput.value,
      });
    });

    editUI.addChild(nameInput, valueInput);

    const { key: nameKey } = await IfcPropertiesUtils.getEntityName(
      model,
      expressID
    );

    if (nameKey) {
      nameInput.value = prop[nameKey]?.value ?? "";
    } else {
      nameInput.value = prop.Name?.value ?? "";
    }

    const { key: valueKey } = await IfcPropertiesUtils.getQuantityValue(
      model,
      expressID
    );

    if (valueKey) {
      valueInput.value = prop[valueKey]?.value ?? "";
    } else {
      valueInput.value = prop.NominalValue?.value ?? "";
    }

    this._modal.setSlot("content", editUI);
    this._modal.visible = true;
  }

  private setRemoveUI() {
    const { model, expressID, setID } = this.data;
    if (!model || !expressID || !setID) return;

    const removeUI = new SimpleUIComponent(
      this._components,
      `<div class="flex flex-col gap-y-4 p-4 overflow-auto"></div>`
    );

    const warningText = document.createElement("div");
    warningText.className = "text-base text-center";
    warningText.textContent =
      "Are you sure to delete this property? This action can't be undone.";
    removeUI.get().append(warningText);

    this._modal.onAccept.add(async () => {
      this._modal.visible = false;
      this.removeFromParent(); // As the psetUI is going to be disposed, then we need to first remove the action buttons so they do not become disposed as well.
      await this.onRemoveProp.trigger({ model, expressID, setID });
    });

    this._modal.setSlot("content", removeUI);
    this._modal.visible = true;
  }
}
