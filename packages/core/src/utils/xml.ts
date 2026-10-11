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

  /**
   * Escapes a value for XML text or a double-quoted attribute, so a value
   * holding `&`, `<`, `>` or quotes is written as data, not markup.
   */
  static escape(value: unknown) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  static builder = new XMLBuilder({
    attributeNamePrefix: "$",
    ignoreAttributes: false,
    suppressBooleanAttributes: false,
  });
}
