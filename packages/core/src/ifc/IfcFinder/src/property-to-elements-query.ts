import * as WEBIFC from "web-ifc";
import { IfcFinderQuery } from "./ifc-finder-query";
import { IfcPropertyRule } from "./types";

export class PropertyToElementsQuery extends IfcFinderQuery {
  private psets: string[] = [];

  constructor(data: { name?: string; rules: IfcPropertyRule[] }) {
    super({
      name: data?.name || "Properties to elements query",
      inclusive: false,
      rules: data.rules,
    });

    this.rules.unshift({
      type: "category",
      value: /IfcPropertySingleValue/,
    });
  }

  async update(file: File, data?: string[]) {
    // 1. Gather all propertysinglevalue that match the filters AND all psets

    if (data) {
      this.findInLines(data);
    } else {
      await this.findInFile(file);
    }

    this.lines = [];
    const psetIDs = new Set<number>();

    // Now, let's check which psets we are looking for
    for (const pset of this.psets) {
      const attrs = this.getAttributesFromLine(pset);
      if (attrs === null) {
        continue;
      }

      const idsString = attrs[4]
        .replace("(", "[")
        .replace(")", "]")
        .replace(/#/g, "");

      const ids = JSON.parse(idsString) as number[];

      for (const id of ids) {
        if (this.ids.has(id)) {
          const psetID = this.getIdFromLine(pset);
          psetIDs.add(psetID);
          this.lines.push(pset);
          break;
        }
      }
    }

    this.ids = psetIDs;
    this.psets = [];

    this.needsUpdate = false;

    // if (!data) {
    //   throw new Error(
    //     "The property to element query requires previous data containing the desired properties",
    //   );
    // }

    // Gather all the properties

    // const propertiesIDs: number[] = [];
    // const propertyPattern = /IFCPROPERTYSINGLEVALUE/;
    // for (const line of data) {
    //   if (propertyPattern.test(line)) {
    //     const id = this.getIdFromLine(line);
    //     propertiesIDs.push(id);
    //   }
    // }

    // Create filter

    // let filterText = "";
    // for (const id of propertiesIDs) {
    //   filterText += `#${id}|`;
    // }
    // filterText = filterText.slice(0, filterText.length - 1);
    // const psetFilter = new RegExp(filterText);

    // Create a filter for the psets that have these properties

    // this.rules = [
    //   {
    //     type: "property",
    //     name: /.*/,
    //     value: psetFilter,
    //   },
    //   {
    //     type: "property",
    //     name: /.*/,
    //     value: psetFilter,
    //   },
    // ];

    // Get the related psets

    // await this.findInFile(file);

    // this.needsUpdate = false;
  }

  protected findInLines(lines: string[]) {
    for (const line of lines) {
      let category: string | null = null;
      let attrValues: string[] | null = null;
      let attrNames: string[] | null = null;

      let filtersPass = false;

      if (category === null) {
        category = this.getCategoryFromLine(line);
        if (category === null) {
          continue;
        }
      }

      // If it's pset, gather it
      if (category === "IfcPropertySet") {
        this.psets.push(line);
        continue;
      }

      // Now, only process property single values
      if (category !== "IfcPropertySingleValue") {
        continue;
      }

      // Check if property filters apply
      for (const rule of this.rules) {
        if (rule.type === "property") {
          const { name, value } = rule;

          // Quick test to see if this line contains what we are looking for
          if (!value.test(line)) {
            if (!this.inclusive) {
              filtersPass = false;
              break;
            } else {
              continue;
            }
          }

          if (attrValues === null) {
            attrValues = this.getAttributesFromLine(line);
            if (attrValues === null) {
              if (!this.inclusive) {
                filtersPass = false;
                break;
              } else {
                continue;
              }
            }
          }

          if (attrNames === null) {
            // @ts-ignore
            attrNames = Object.keys(new WEBIFC.IFC4[category]());
            // Remove attributes expressID and type, given by web-ifc
            attrNames = attrNames.slice(2);

            if (attrNames === null) {
              if (!this.inclusive) {
                filtersPass = false;
                break;
              } else {
                continue;
              }
            }
          }

          // Slow test to detect if

          let someNameValueMatch = false;
          for (let i = 0; i < attrValues.length; i++) {
            const attrValue = attrValues[i];
            const attrName = attrNames[i];
            // Check that both name and value match
            if (value.test(attrValue) && name.test(attrName)) {
              someNameValueMatch = true;
              break;
            }
          }

          if (!someNameValueMatch) {
            if (!this.inclusive) {
              filtersPass = false;
              break;
            }
          } else {
            filtersPass = true;
          }
        }
      }

      if (filtersPass) {
        const id = this.getIdFromLine(line);
        this.ids.add(id);
      }
    }
  }
}
