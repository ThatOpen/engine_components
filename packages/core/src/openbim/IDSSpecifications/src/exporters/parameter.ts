import { IDSFacetParameterName, IDSFacetParameter } from "../types";

export const getParameterXML = (
  name: IDSFacetParameterName,
  parameter?: IDSFacetParameter,
) => {
  let parameterXML = "";
  if (!parameter) return parameterXML;

  if (parameter.type === "simple") {
    parameterXML = `<simpleValue>${parameter.parameter}</simpleValue>`;
  }

  if (parameter.type === "enumeration") {
    const value = parameter.parameter;
    parameterXML = `<xs:restriction base="xs:string">
    ${value.map((v) => `<xs:enumeration value="${v}" />`).join("\n")}
    </xs:restriction>`;
  }

  if (parameter.type === "pattern") {
    const value = parameter.parameter;
    parameterXML = `<xs:restriction base="xs:string">
      <xs:pattern value="${value}" />
    </xs:restriction>`;
  }

  if (parameter.type === "bounds") {
    const { min, minInclusive, max, maxInclusive } = parameter.parameter;
    let minTag = "";
    if (min !== undefined) {
      minTag = `<xs:min${minInclusive ? "Inclusive" : "Exclusive"} value="${min}">`;
    }

    let maxTag = "";
    if (max !== undefined) {
      maxTag = `<xs:max${maxInclusive ? "Inclusive" : "Exclusive"} value="${max}">`;
    }

    parameterXML = `<xs:restriction base="xs:double">
      ${minTag}
      ${maxTag}
    </xs:restriction>`;
  }

  if (parameter.type === "length") {
    const { length, min, max } = parameter.parameter;
    let lengthTag = "";
    if (length !== undefined && min === undefined && max === undefined) {
      lengthTag = `<xs:length value="${length}" />`;
    }

    let minTag = "";
    if (min !== undefined && length === undefined) {
      minTag = `<xs:minLength value="${min}" />`;
    }

    let maxTag = "";
    if (max !== undefined && length === undefined) {
      maxTag = `<xs:maxLength value="${max}" />`;
    }

    parameterXML = `<xs:restriction base="xs:string">
      ${lengthTag}
      ${minTag}
      ${maxTag}
    </xs:restriction>`;
  }

  const xml = `<${name[0].toLowerCase() + name.slice(1)}>
    ${parameterXML}
  </${name[0].toLowerCase() + name.slice(1)}>`;

  return xml;
};
