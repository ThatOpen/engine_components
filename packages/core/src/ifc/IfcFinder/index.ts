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

export type IfcFinderRule = IfcCategoryRule | IfcPropertyRule;

export type IfcFinderQuery = {
  name: string;
  inclusive: boolean;
  rules: IfcFinderRule[];
  result: string[];
  needsUpdate: boolean;
};

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

  async find(file: File, queries: IfcFinderQuery[]) {
    let found = new Set<number>();

    // Handle the rest of query parts
    for (let i = 0; i < queries.length; i++) {
      found = new Set<number>();
      const query = queries[i];
      const previousQuery = queries[i - 1];

      if (!query.needsUpdate) {
        // This query is up to date, so let's use its data directly
        this.findInLines(query.result, query, found);
        continue;
      }

      query.result = [];

      if (!previousQuery) {
        // There's no previous result, so let's read the file
        query.result = await this.findInFile(file, query, found);
        query.needsUpdate = false;
        continue;
      }

      // There's previous data, so let's use it
      this.findInLines(previousQuery.result, query, found, query.result);
      query.needsUpdate = false;
    }

    return found;
  }

  findInFile(file: File, query: IfcFinderQuery, found: Set<number>) {
    return new Promise<string[]>((resolve) => {
      const reader = new FileReader();
      const decoder = new TextDecoder("utf-8");

      const resultLines: string[] = [];

      // src: https://joji.me/en-us/blog/processing-huge-files-using-filereader-readasarraybuffer-in-web-browser/
      const chunkSize = 10000 * 1024; // 10mb
      const offset = 1000; // To avoid IFC lines that are split
      let start = 0;

      const endLineToken = /;/;

      const readTextPart = () => {
        if (start >= file.size) {
          resolve(resultLines);
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

        this.findInLines(lines, query, found, resultLines);

        console.log(start / file.size);

        start += chunkSize;
        readTextPart();
      };

      readTextPart();
    });
  }

  private findInLines(
    lines: string[],
    query: IfcFinderQuery,
    found: Set<number>,
    resultLines?: string[],
  ) {
    const { rules } = query;
    for (const line of lines) {
      let category: string | null = null;
      let attrValues: string[] | null = null;
      let attrNames: string[] | null = null;

      let filtersPass = false;

      for (const rule of rules) {
        if (rule.type === "category") {
          if (category === null) {
            category = this.getCategoryFromLine(line);
            if (category === null) {
              if (!query.inclusive) {
                break;
              } else {
                continue;
              }
            }
          }

          if (!rule.value.test(category)) {
            if (!query.inclusive) {
              filtersPass = false;
              break;
            } else {
              continue;
            }
          }

          filtersPass = true;
          continue;
        }

        if (rule.type === "property") {
          const { name, value } = rule;

          // Quick test to see if this line contains what we are looking for
          if (!value.test(line)) {
            if (!query.inclusive) {
              filtersPass = false;
              break;
            } else {
              continue;
            }
          }

          if (attrValues === null) {
            attrValues = this.getAttributesFromLine(line);
            if (attrValues === null) {
              if (!query.inclusive) {
                filtersPass = false;
                break;
              } else {
                continue;
              }
            }
          }

          if (category === null) {
            category = this.getCategoryFromLine(line);
            if (category === null) {
              if (!query.inclusive) {
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
              if (!query.inclusive) {
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
            if (!query.inclusive) {
              filtersPass = false;
              break;
            }
          } else {
            filtersPass = true;
          }
        }
      }

      if (filtersPass) {
        const idString = line.slice(line.indexOf("#") + 1, line.indexOf("="));
        const id = parseInt(idString, 10);
        if (resultLines) {
          resultLines.push(line);
        }
        found.add(id);
      }
    }
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
