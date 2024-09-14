import * as WEBIFC from "web-ifc";
import { Component, Components, Event } from "../../core";
import { ifcCategoryCase } from "../Utils";

export interface IfcCategoryRule {
  type: "category";
  value: RegExp;
}

export interface IfcPropertyRule {
  type: "property";
  name: RegExp;
  value: RegExp;
}

export type IfcFinderRules = IfcCategoryRule | IfcPropertyRule;

/**
 * Component to make text queries in the IFC.
 */
export class IfcFinder extends Component {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "0da7ad77-f734-42ca-942f-a074adfd1e3a" as const;

  readonly onProgress = new Event<number>();

  /** {@link Component.enabled} */
  enabled = true;

  constructor(components: Components) {
    super(components);
  }

  find(file: File, rules: IfcFinderRules[]) {
    return new Promise<Set<number>>((resolve) => {
      const reader = new FileReader();
      const decoder = new TextDecoder("utf-8");

      // src: https://joji.me/en-us/blog/processing-huge-files-using-filereader-readasarraybuffer-in-web-browser/
      const chunkSize = 10000 * 1024; // 10mb
      const offset = 1000; // To avoid IFC lines that are split
      let start = 0;

      const endLineToken = /;/;

      const resultItems = new Set<number>();

      const readTextPart = () => {
        if (start >= file.size) {
          resolve(resultItems);
          return;
        }
        const end = Math.min(start + chunkSize + offset, file.size);
        const slice = file.slice(start, end);
        reader.readAsArrayBuffer(slice);
      };

      reader.onload = () => {
        if (!(reader.result instanceof ArrayBuffer)) {
          return;
        }

        const buffer = new Uint8Array(reader.result);

        const snippet = decoder.decode(buffer);

        // Get individual IFC lines
        const lines = snippet.split(endLineToken);
        // Remove first line, which is cut
        lines.shift();

        // Test all filters against each line
        for (const line of lines) {
          let category: string | null = null;
          let attrValues: string[] | null = null;
          let attrNames: string[] | null = null;

          let filtersPass = true;

          for (const rule of rules) {
            if (rule.type === "category") {
              if (category === null) {
                category = this.getCategoryFromLine(line);
                if (category === null) {
                  filtersPass = false;
                  break;
                }
              }

              if (!rule.value.test(category)) {
                filtersPass = false;
                break;
              }
              continue;
            }

            if (rule.type === "property") {
              const { name, value } = rule;

              // Quick test to see if this line contains what we are looking for
              if (!value.test(line)) {
                filtersPass = false;
                break;
              }

              if (attrValues === null) {
                attrValues = this.getAttributesFromLine(line);
                if (attrValues === null) {
                  filtersPass = false;
                  break;
                }
              }

              if (category === null) {
                category = this.getCategoryFromLine(line);
                if (category === null) {
                  filtersPass = false;
                  break;
                }
              }

              if (attrNames === null) {
                // @ts-ignore
                attrNames = Object.keys(new WEBIFC.IFC4[category]());
                if (attrNames === null) {
                  filtersPass = false;
                  break;
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
                filtersPass = false;
                break;
              }
            }
          }

          if (filtersPass) {
            const idString = line.slice(
              line.indexOf("#") + 1,
              line.indexOf("="),
            );
            const id = parseInt(idString, 10);
            resultItems.add(id);
          }
        }

        console.log(start / file.size);

        start += chunkSize;
        readTextPart();
      };

      readTextPart();
    });
  }

  private getCategoryFromLine(line: string) {
    const start = line.indexOf("=") + 1;
    const end = line.indexOf("(");
    const category = line.slice(start, end).trim();
    const name = ifcCategoryCase[category];
    if (!name) {
      return null;
    }
    return name;
  }

  private getAttributesFromLine(line: string) {
    const matchRegex = /\((.*)\)/;
    const match = line.match(matchRegex);
    if (!(match && match[1])) {
      return null;
    }
    const splitRegex = /,(?![^()]*\))/g;
    const attrs = match[1].split(splitRegex).map((part) => part.trim());
    const validAttrs = attrs.map((attr) => {
      if (attr.startsWith("(") && attr.endsWith(")")) return "$";
      if (attr.startsWith("'") && attr.endsWith("'")) return attr.slice(1, -1);
      return attr;
    });
    return validAttrs;
  }
}
