import { XMLBuilder, XMLParser } from "fast-xml-parser";

export class XML {
  static parser = new XMLParser({
    allowBooleanAttributes: true,
    attributeNamePrefix: "",
    ignoreAttributes: false,
    ignoreDeclaration: true,
    ignorePiTags: true,
    numberParseOptions: { leadingZeros: true, hex: true },
    parseAttributeValue: true,
    preserveOrder: false,
    processEntities: false,
    removeNSPrefix: true,
    trimValues: true,
  });

  static builder = new XMLBuilder({
    attributeNamePrefix: "$",
    ignoreAttributes: false,
    suppressBooleanAttributes: false,
  });
}
