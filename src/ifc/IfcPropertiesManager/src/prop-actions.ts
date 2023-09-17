import { FragmentsGroup } from "bim-fragment";
import { Components } from "../../../core";
import {
  SimpleUIComponent,
  FloatingWindow,
  TextInput,
  Button,
} from "../../../ui";
import { Event } from "../../../base-types";
import { IfcPropertiesUtils } from "../../IfcPropertiesUtils";

export class PropActionsUI extends SimpleUIComponent<HTMLDivElement> {
  editPropBtn: Button;
  removePropBtn: Button;
  modalVisible = false;
  private _modal: SimpleUIComponent<HTMLDialogElement>;
  private _modalWindow: FloatingWindow;

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

    this.editPropBtn = new Button(this._components);
    this.editPropBtn.materialIcon = "edit";
    this.setEditUI();

    this.removePropBtn = new Button(this._components);
    this.removePropBtn.materialIcon = "delete";
    this.setRemoveUI();

    this.addChild(this.editPropBtn, this.removePropBtn);

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
    this._modalWindow.onHidden.add(() => this._modal.get().close());
    this._modal.addChild(this._modalWindow);
  }

  async dispose(onlyChildren: boolean = false) {
    await super.dispose(onlyChildren);
    this.onRemoveProp.reset();
    await this.editPropBtn.dispose();
    await this.removePropBtn.dispose();
    await this._modal.dispose();
    await this._modalWindow.dispose();
    this.data = {};
  }

  private setEditUI() {
    const editUI = new SimpleUIComponent(
      this._components,
      `<div class="flex flex-col gap-y-4 p-4 overflow-auto"></div>`
    );

    const nameInput = new TextInput(this._components);
    nameInput.label = "Name";
    const valueInput = new TextInput(this._components);
    valueInput.label = "Value";

    const acceptBtn = new Button(this._components);
    acceptBtn.materialIcon = "check";
    acceptBtn.label = "Accept";
    acceptBtn.get().classList.remove("hover:bg-ifcjs-200");
    acceptBtn.get().classList.add("hover:bg-success");
    acceptBtn.onClick.add(async () => {
      this._modal.get().close();
      const { model, expressID } = this.data;
      if (!model || !expressID) return;
      await this.onEditProp.trigger({
        model,
        expressID,
        name: nameInput.value,
        value: valueInput.value,
      });
    });

    const cancelBtn = new Button(this._components);
    cancelBtn.materialIcon = "close";
    cancelBtn.label = "Cancel";
    cancelBtn.get().classList.remove("hover:bg-ifcjs-200");
    cancelBtn.get().classList.add("hover:bg-error");
    cancelBtn.onClick.add(() => this._modal.get().close());

    const actionBtns = new SimpleUIComponent(
      this._components,
      `<div class="flex gap-x-2 justify-end"></div>`
    );

    actionBtns.addChild(cancelBtn, acceptBtn);

    editUI.addChild(nameInput, valueInput, actionBtns);

    this.editPropBtn.onClick.add(async () => {
      const { model, expressID } = this.data;
      const properties = model?.properties;
      if (!model || !expressID || !properties) return;

      const prop = properties[expressID];

      const { key: nameKey } = IfcPropertiesUtils.getEntityName(
        properties,
        expressID
      );

      if (nameKey) {
        nameInput.value = prop[nameKey]?.value ?? "";
      } else {
        nameInput.value = prop.Name?.value ?? "";
      }

      const { key: valueKey } = IfcPropertiesUtils.getQuantityValue(
        properties,
        expressID
      );

      if (valueKey) {
        valueInput.value = prop[valueKey]?.value ?? "";
      } else {
        valueInput.value = prop.NominalValue?.value ?? "";
      }

      this._modalWindow.title = "Edit Property";
      this._modalWindow.setSlot("content", editUI);
      this.showModal();
    });
  }

  private setRemoveUI() {
    const removeUI = new SimpleUIComponent(
      this._components,
      `<div class="flex flex-col gap-y-4 p-4 overflow-auto"></div>`
    );

    const warningText = document.createElement("div");
    warningText.className = "text-base text-center";
    warningText.textContent =
      "Are you sure to delete this property? This action can't be undone.";
    removeUI.get().append(warningText);

    const acceptBtn = new Button(this._components);
    acceptBtn.materialIcon = "check";
    acceptBtn.label = "Accept";
    acceptBtn.get().classList.remove("hover:bg-ifcjs-200");
    acceptBtn.get().classList.add("hover:bg-success");
    acceptBtn.onClick.add(async () => {
      this._modal.get().close();
      const { model, expressID, setID } = this.data;
      if (!model || !expressID || !setID) return;
      this.removeFromParent(); // As the psetUI is going to be disposed, then we need to first remove the action buttons so they do not become disposed as well.
      await this.onRemoveProp.trigger({ model, expressID, setID });
    });

    const cancelBtn = new Button(this._components);
    cancelBtn.materialIcon = "close";
    cancelBtn.label = "Cancel";
    cancelBtn.get().classList.remove("hover:bg-ifcjs-200");
    cancelBtn.get().classList.add("hover:bg-error");
    cancelBtn.onClick.add(() => this._modal.get().close());

    const actionBtns = new SimpleUIComponent(
      this._components,
      `<div class="flex gap-x-2 justify-end"></div>`
    );

    actionBtns.addChild(cancelBtn, acceptBtn);

    removeUI.addChild(actionBtns);

    this.removePropBtn.onClick.add(async () => {
      const { model, expressID, setID } = this.data;
      if (!model || !expressID || !setID) return;
      this._modalWindow.title = "Remove Property";
      this._modalWindow.setSlot("content", removeUI);
      this.showModal();
    });
  }

  private showModal() {
    this.modalVisible = true;
    this._modalWindow.visible = true;
    this._modal.get().showModal();
  }
}
