import * as THREE from "three";
import { Components } from "../../core";
import { Button } from "../ButtonComponent";
import { SimpleUIComponent } from "../SimpleUIComponent";

export interface UICommands<T> {
  [id: string]: (data?: T) => void;
}

export class CommandsMenu<T> extends SimpleUIComponent<HTMLDivElement> {
  name = "CommandsMenu";

  commandData?: T;

  offset = new THREE.Vector2(20, -10);

  innerElements: {
    window: HTMLDivElement;
  };

  commands: UICommands<T> = {};

  get hasCommands() {
    return Object.keys(this.commands).length !== 0;
  }

  constructor(components: Components) {
    const template = `<div id="window" class="absolute bg-ifcjs-100 backdrop-blur-xl rounded-md p-3 z-50"></div>`;
    super(components, template);

    this.innerElements = {
      window: this.getInnerElement("window") as HTMLDivElement,
    };

    this.toggleWindowEvent(true);
  }

  update() {
    this.dispose(true);
    for (const name in this.commands) {
      const command = this.commands[name];
      const button = new Button(this._components, { name });
      button.name = name;
      this.addChild(button);
      button.onclick = () => command(this.commandData);
    }
  }

  popup(x: number, y: number) {
    this.domElement.style.left = `${x + this.offset.x}px`;
    this.domElement.style.top = `${y + this.offset.y}px`;
    this.visible = true;
  }

  dispose(onlyChildren: boolean = false) {
    super.dispose(onlyChildren);
    if (!onlyChildren) {
      this.toggleWindowEvent(false);
      this.commands = {};
      (this.commandData as any) = null;
    }
  }

  private toggleWindowEvent(active: boolean) {
    if (active) {
      window.addEventListener("click", this.hideCommandsMenu);
    } else {
      window.removeEventListener("click", this.hideCommandsMenu);
    }
  }

  private hideCommandsMenu = () => {
    this.visible = false;
  };
}
