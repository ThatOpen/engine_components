import { Component } from "./component";
import { Configurator } from "../../ConfigManager";
import { Components } from "../../Components";

export type ComponentUIElement = {
  name: string;
  id: string;
  icon: string;
  componentID: string;
  get: (components: Components) => {
    element: HTMLElement;
    config?: Configurator;
    dispose?: () => void;
  };
};

export abstract class ComponentWithUI extends Component {
  abstract name: string;
  abstract getUI(): ComponentUIElement[];
}
