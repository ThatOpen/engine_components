import { Component, DataMap } from "../../core/Types";
import { IDSSpecification } from "./src";

export class IDSSpecifications extends Component {
  enabled = true;

  readonly list = new DataMap<string, IDSSpecification>();

  create() {}
}

export * from "./src";
