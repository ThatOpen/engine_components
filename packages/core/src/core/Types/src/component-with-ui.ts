import { Component } from "./component";
import { Configurator } from "../../ConfigManager";

export type ComponentUIElement = {
  name: string;
  id: string;
  icon: string;
  componentID: string;
  get: () => { element: HTMLElement; config?: Configurator<any, any> };
};

export abstract class ComponentWithUI extends Component {
  abstract name: string;
  abstract getUI(): ComponentUIElement[];
}
