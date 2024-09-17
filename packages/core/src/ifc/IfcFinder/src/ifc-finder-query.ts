import * as WEBIFC from "web-ifc";
import { IfcFinderRule } from "./types";
import { ifcCategoryCase } from "../../Utils";

export class IfcFinderQuery {
  rules: IfcFinderRule[];
  inclusive: boolean;
  name: string;
  lines: string[] = [];
  ids = new Set<number>();
  needsUpdate = true;

  constructor(data: {
    name: string;
    rules: IfcFinderRule[];
    inclusive: boolean;
  }) {
    this.name = data.name;
    this.rules = data.rules;
    this.inclusive = data.inclusive || false;
  }

  async update(data: File | string[]) {
    if (data instanceof File) {
      await this.findInFile(data);
    } else {
      this.findInLines(data);
    }

    this.needsUpdate = false;
  }

  private findInFile(file: File) {
    return new Promise<void>((resolve) => {
      const reader = new FileReader();
      const decoder = new TextDecoder("utf-8");

      // src: https://joji.me/en-us/blog/processing-huge-files-using-filereader-readasarraybuffer-in-web-browser/
      const chunkSize = 10000 * 1024; // 10mb
      const offset = 1000; // To avoid IFC lines that are split
      let start = 0;

      const endLineToken = /;/;

      const readTextPart = () => {
        if (start >= file.size) {
          resolve();
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

        this.findInLines(lines);

        console.log(start / file.size);

        start += chunkSize;
        readTextPart();
      };

      readTextPart();
    });
  }

  private findInLines(lines: string[]) {
    for (const line of lines) {
      let category: string | null = null;
      let attrValues: string[] | null = null;
      let attrNames: string[] | null = null;

      let filtersPass = false;

      for (const rule of this.rules) {
        if (rule.type === "category") {
          if (category === null) {
            category = this.getCategoryFromLine(line);
            if (category === null) {
              if (!this.inclusive) {
                break;
              } else {
                continue;
              }
            }
          }

          if (!rule.value.test(category)) {
            if (!this.inclusive) {
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

          if (category === null) {
            category = this.getCategoryFromLine(line);
            if (category === null) {
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
        const idString = line.slice(line.indexOf("#") + 1, line.indexOf("="));
        const id = parseInt(idString, 10);
        this.lines.push(line);
        this.ids.add(id);
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
