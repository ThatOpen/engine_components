import * as FRAGS from "@thatopen/fragments";
import { IDSFacetParameter } from "../types";
import { IDSFacet } from "./Facet";

// https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/material-facet.md

export class IdsMaterialFacet extends IDSFacet {
  value?: IDSFacetParameter;
  uri?: string;

  async getEntities(
    model: FRAGS.FragmentsGroup,
    collector: FRAGS.IfcProperties = {},
  ) {
    const result: number[] = [];
    return result;
  }

  async test(entities: FRAGS.IfcProperties) {
    this.testResult = [];
    return this.testResult;
  }
}
