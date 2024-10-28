import { Component } from "./component";

export type ComponentUIElement = {
  name: string;
  enabled: boolean;
  componentID: string;
  attributes: { [name: string]: string };
  get: () => HTMLElement;
};

export abstract class ComponentWithUI extends Component {
  abstract name: string;
  abstract getUI(): ComponentUIElement[];
}
