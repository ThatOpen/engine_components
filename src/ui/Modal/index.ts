import { Event } from "../../base-types";
import { Components } from "../../core";
import { Button } from "../ButtonComponent";
import { SimpleUIComponent } from "../SimpleUIComponent";

export class Modal extends SimpleUIComponent<HTMLDialogElement> {
  readonly onAccept = new Event();
  readonly onCancel = new Event();

  set description(value: string | null) {
    const element = this.innerElements.description;
    element.textContent = value;
    if (value) {
      element.classList.remove("hidden");
    } else {
      element?.classList.add("hidden");
    }
  }

  get description() {
    return this.innerElements.description.textContent;
  }

  set title(value: string | null) {
    const element = this.innerElements.title;
    element.textContent = value;
    if (value) {
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
    }
  }

  get title() {
    return this.innerElements.title.textContent;
  }

  set visible(value: boolean) {
    this._visible = value;
    if (value) {
      this.get().showModal();
      this.onVisible.trigger();
    } else {
      this.get().close();
      this.onHidden.trigger();
    }
  }

  get visible() {
    return this._visible;
  }

  slots: {
    content: SimpleUIComponent<HTMLDivElement>;
    actionButtons: SimpleUIComponent<HTMLDivElement>;
  };

  innerElements: {
    title: HTMLHeadElement;
    description: HTMLParagraphElement;
  };

  constructor(components: Components, title = "Tooeen Modal") {
    const template = `
    <dialog>
      <div class="flex flex-col backdrop-blur-xl w-[350px] h-fit text-white bg-ifcjs-100 rounded-md">
        <div class="flex justify-between items-center top-0 select-none px-6 py-3 border-b-2 border-solid border-[#3A444E]">
          <h3 id="title">${title}</h3>
          <p id="description" class="text-base text-gray-400"></p>
        </div>
        <div data-tooeen-slot="content"></div>
        <div data-tooeen-slot="actionButtons"></div>
      </div>
    </dialog> 
    `;
    super(components, template);

    this.innerElements = {
      title: this.getInnerElement("title") as HTMLHeadElement,
      description: this.getInnerElement("description") as HTMLParagraphElement,
    };

    this.slots = {
      content: new SimpleUIComponent(components),
      actionButtons: new SimpleUIComponent(
        components,
        `<div class="flex gap-x-2 justify-end p-4"></div>`
      ),
    };
    this.setSlots();

    const acceptBtn = new Button(this._components);
    acceptBtn.materialIcon = "check";
    acceptBtn.label = "Accept";
    acceptBtn.get().classList.remove("hover:bg-ifcjs-200");
    acceptBtn.get().classList.add("hover:bg-success");
    acceptBtn.onClick.add(() => this.onAccept.trigger());

    const cancelBtn = new Button(this._components);
    cancelBtn.materialIcon = "close";
    cancelBtn.label = "Cancel";
    cancelBtn.get().classList.remove("hover:bg-ifcjs-200");
    cancelBtn.get().classList.add("hover:bg-error");
    cancelBtn.onClick.add(() => this.onCancel.trigger());

    this.slots.actionButtons.addChild(cancelBtn, acceptBtn);
  }

  async dispose(onlyChildren: boolean = false) {
    await super.dispose(onlyChildren);
    this.onCancel.reset();
    this.onAccept.reset();
  }
}
