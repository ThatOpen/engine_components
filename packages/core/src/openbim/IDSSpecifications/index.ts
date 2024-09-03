import * as FRAGS from "@thatopen/fragments";
import { Component, DataMap } from "../../core/Types";
import { IDSSpecification } from "./src";

export class IDSSpecifications extends Component {
  enabled = true;

  readonly list = new DataMap<string, IDSSpecification>();

  create(name: string, ifcVersion: FRAGS.IfcSchema) {
    const specification = new IDSSpecification(
      this.components,
      name,
      ifcVersion,
    );

    this.list.set(specification.guid, specification);

    return specification;
  }
}

export * from "./src";
