import { IDSFacetParameter } from "../types";
import { IDSFacet } from "./Facet";

// https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/material-facet.md

export class IdsMaterialFacet extends IDSFacet {
  value?: IDSFacetParameter;
  uri?: string;

  serialize() {
    return "";
  }

  async getEntities() {
    const result: number[] = [];
    return result;
  }

  async test() {
    this.testResult = [];
    return this.testResult;
  }
}
