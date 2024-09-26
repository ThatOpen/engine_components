import * as FRAGS from "@thatopen/fragments";
import * as WEBIFC from "web-ifc";
import { ifcCategoryCase } from "../../Utils";
import { IfcFinderRule, SerializedQuery } from "./types";
import { Components, Event } from "../../../core";

/**
 * The base class for all queries used by the {@link IfcFinder}.
 */
export abstract class IfcFinderQuery {
  /**
   * The list of functions to import the queries. If you create your own custom query, you should add its importer here. See the other queries provided by the library for reference.
   */
  static importers = new Map<
    string,
    (components: Components, data: any) => IfcFinderQuery
  >();

  /**
   * Event used to notify the progress when performing a query on an IFC file.
   */
  readonly onProgress = new Event<number>();

  /**
   * A name given to the instance of the query to identify it.
   */
  abstract name: string;

  /**
   * The list of IFC items that this query found across all models.
   */
  abstract items: FRAGS.FragmentIdMap;

  /**
   * If false, ALL rules of the query must comply to make a match. If true, ANY rule will be enough to make a match.
   */
  inclusive = false;

  /**
   * The list of rules to be applied by this query.
   */
  rules: IfcFinderRule[] = [];

  /**
   * The IDs of the match items per model.
   */
  ids: { [modelID: string]: Set<number> } = {};

  /**
   * Whether this query is up to date or not per file. If not, when updating the group where it belongs, it will re-process the given file.
   */
  needsUpdate = new Map<string, boolean>();

  /**
   * Export the current data of this query in a serializable object to persist it over time.
   */
  abstract export(): { [key: string]: any };

  /**
   * Perform the search in the given file and save the result.
   */
  abstract update(modelID: string, file: File): Promise<void>;

  protected components: Components;

  protected abstract findInLines(modelID: string, lines: string[]): void;

  protected constructor(components: Components) {
    this.components = components;
  }

  /**
   * Imports a query given its data. This data can be generating using its {@link IfcFinderQuery.export} method.
   *
   * @param components the instance of {@link Components} used by this app.
   * @param data the data of the query to import as a serializable object.
   */
  static import(components: Components, data: { [id: string]: any }) {
    const newQuery = IfcFinderQuery.importers.get(data.type);
    if (!newQuery) {
      console.warn(`Invalid query data:.`, data);
      return null;
    }
    return newQuery(components, data);
  }

  /**
   * Imports the given serialized rules. Only use this when writing your own custom query. See the other queries provided by the library for reference.
   *
   * @param serializedRules the rules to be parsed.
   */
  static importRules(serializedRules: { [key: string]: any }[]) {
    const rules: IfcFinderRule[] = [];
    for (const serializedRule of serializedRules) {
      const rule: Partial<IfcFinderRule> = {};
      for (const id in serializedRule) {
        const item = serializedRule[id];
        if (item.regexp) {
          rule[id as keyof IfcFinderRule] = new RegExp(item.value) as any;
        } else {
          rule[id as keyof IfcFinderRule] = item;
        }
      }
      rules.push(rule as IfcFinderRule);
    }
    return rules;
  }

  /**
   * Imports the given IDs. Only use this when writing your own custom query. See the other queries provided by the library for reference.
   *
   * @param data the serialized object representing the query whose IDs to parse.
   */
  static importIds(data: SerializedQuery) {
    const ids: { [modelID: string]: Set<number> } = {};
    for (const modelID in data.ids) {
      ids[modelID] = new Set(data.ids[modelID]);
    }
    return ids;
  }

  /**
   * Clears the data of the given model. If not specified, clears all the data.
   *
   * @param modelID ID of the model whose data to clear.
   */
  clear(modelID?: string) {
    if (modelID === undefined) {
      this.ids = {};
      this.needsUpdate.clear();
      return;
    }
    delete this.ids[modelID];
    this.needsUpdate.delete(modelID);
  }

  protected addID(modelID: string, id: number) {
    if (!this.ids[modelID]) {
      this.ids[modelID] = new Set<number>();
    }
    this.ids[modelID].add(id);
  }

  protected getData() {
    const ids: { [modelID: string]: number[] } = {};
    for (const modelID in this.ids) {
      ids[modelID] = Array.from(this.ids[modelID]);
    }

    const rules = this.exportRules();

    return {
      name: this.name,
      inclusive: this.inclusive,
      type: "IfcFinderQuery",
      ids,
      rules,
    } as SerializedQuery;
  }

  protected exportRules(): { [key: string]: any }[] {
    const rules: { [key: string]: any }[] = [];
    for (const rule of this.rules) {
      const serializedRule: { [key: string]: any } = {};
      for (const id in rule) {
        const item = rule[id as keyof IfcFinderRule];
        if (item instanceof RegExp) {
          serializedRule[id] = { regexp: true, value: item.source };
        } else {
          serializedRule[id] = item;
        }
      }
      rules.push(serializedRule);
    }
    return rules;
  }

  protected findInFile(modelID: string, file: File) {
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

        this.findInLines(modelID, lines);

        this.onProgress.trigger(start / file.size);

        start += chunkSize;
        readTextPart();
      };

      readTextPart();
    });
  }

  protected getIdFromLine(line: string) {
    const idString = line.slice(line.indexOf("#") + 1, line.indexOf("="));
    return parseInt(idString, 10);
  }

  protected testRules(line: string) {
    let category: string | null = null;
    let attrValues: string[] | null = null;
    let attrNames: string[] | null = null;

    let filtersPass = false;

    for (const rule of this.rules) {
      // Test categories
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

      // Test properties
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

      // Test operators
      if (rule.type === "operator") {
        const { name, value, operator } = rule;

        let someNameValueMatch = false;
        for (let i = 0; i < attrValues.length; i++) {
          const attrName = attrNames[i];
          const attrValue = attrValues[i].replace(
            /IFCLENGTHMEASURE\(|IFCVOLUMEMEASURE\(|\)/g,
            "",
          );
          // Check that name matches and operator applies
          if (name.test(attrName)) {
            if (operator === "=" && parseFloat(attrValue) === value) {
              someNameValueMatch = true;
              break;
            } else if (operator === "<" && parseFloat(attrValue) < value) {
              someNameValueMatch = true;
              break;
            } else if (operator === ">" && parseFloat(attrValue) > value) {
              someNameValueMatch = true;
              break;
            } else if (operator === ">=" && parseFloat(attrValue) >= value) {
              someNameValueMatch = true;
              break;
            } else if (operator === "<=" && parseFloat(attrValue) <= value) {
              someNameValueMatch = true;
              break;
            }
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

    return filtersPass;
  }

  protected getCategoryFromLine(line: string) {
    const start = line.indexOf("=") + 1;
    const end = line.indexOf("(");
    const category = line.slice(start, end).trim();
    const name = ifcCategoryCase[category];
    if (!name) {
      return null;
    }
    return name;
  }

  protected getAttributesFromLine(line: string) {
    const matchRegex = /\((.*)\)/;
    const match = line.match(matchRegex);
    if (!(match && match[1])) {
      return null;
    }
    const splitRegex = /,(?![^()]*\))/g;
    const attrs = match[1].split(splitRegex).map((part) => part.trim());
    // console.log(attrs);
    // const validAttrs = attrs.map((attr) => {
    //   if (attr.startsWith("(") && attr.endsWith(")")) return "$";
    //   if (attr.startsWith("'") && attr.endsWith("'")) return attr.slice(1, -1);
    //   return attr;
    // });
    // return validAttrs;
    return attrs;
  }
}
