import { getParameterXML } from "../exporters/parameter";
import { IDSFacetParameter } from "../types";
import { IDSFacet } from "./Facet";

// https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/material-facet.md

export class IdsMaterialFacet extends IDSFacet {
  facetType = "Material" as const;
  value?: IDSFacetParameter;
  uri?: string;

  serialize(type: "applicability" | "requirement") {
    if (!(this.value && this.uri)) return "<ids:material />";
    const valueXML = getParameterXML("Value", this.value);
    let attributes = "";
    if (type === "requirement") {
      attributes += `cardinality="${this.cardinality}"`;
      attributes += this.uri ? `uri=${this.uri}` : "";
      attributes += this.instructions
        ? `instructions="${this.instructions}"`
        : "";
    }
    return `<ids:material ${attributes}>
  ${valueXML}
</ids:material>`;
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
