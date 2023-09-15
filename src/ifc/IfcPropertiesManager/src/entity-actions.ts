import { FragmentsGroup } from "bim-fragment";
import { Components } from "../../../core/Components";
import { SimpleUIComponent } from "../../../ui/SimpleUIComponent";
import { TextInput } from "../../../ui/TextInput";
import { Button } from "../../../ui/ButtonComponent";
import { Modal } from "../../../ui/Modal";
import { Event } from "../../../base-types";

export class EntityActionsUI extends SimpleUIComponent<HTMLDivElement> {
  addPsetBtn: Button;
  modal: Modal;
  private _nameInput: TextInput;
  private _descriptionInput: TextInput;

  readonly onNewPset = new Event<{
    model: FragmentsGroup;
    elementIDs?: number[] | Set<number>;
    name: string;
    description: string;
  }>();

  data: {
    model?: FragmentsGroup;
    elementIDs?: number[] | Set<number>;
  } = {};

  constructor(components: Components) {
    super(components, `<div class="flex"></div>`);

    this.addPsetBtn = new Button(this._components, {
      materialIconName: "add",
    });
    this.addPsetBtn.onclick = () => {
      this._nameInput.value = "";
      this._descriptionInput.value = "";
      this.modal.visible = true;
      this.addPsetBtn.onClick.trigger();
    };
    this.addChild(this.addPsetBtn);

    this.modal = new Modal(components, "New Property Set");
    this._components.ui.add(this.modal);
    this.modal.visible = false;
    this.modal.onHidden.add(() => this.removeFromParent());

    const addPsetUI = new SimpleUIComponent(
      this._components,
      `<div class="flex flex-col gap-y-4 p-4"></div>`
    );
    this.modal.setSlot("content", addPsetUI);

    this._nameInput = new TextInput(this._components);
    this._nameInput.label = "Name";
    this._descriptionInput = new TextInput(this._components);
    this._descriptionInput.label = "Description";

    this.modal.onAccept.add(() => {
      const name = this._nameInput.value;
      const description = this._descriptionInput.value;
      this.modal.visible = false;
      const { model, elementIDs } = this.data;
      if (!model || name === "") return;
      this.onNewPset.trigger({ model, elementIDs, name, description });
    });

    this.modal.onCancel.add(() => (this.modal.visible = false));

    addPsetUI.addChild(this._nameInput, this._descriptionInput);
  }

  dispose(onlyChildren: boolean = false) {
    super.dispose(onlyChildren);
    this.data = {};
    this.onNewPset.reset();
    this.addPsetBtn.dispose();
    this.modal.dispose();
    this._nameInput.dispose();
    this._descriptionInput.dispose();
  }
}
